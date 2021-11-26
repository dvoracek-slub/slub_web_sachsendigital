import shaka from 'shaka-player/dist/shaka-player.ui';

import ImageFetcher from './ImageFetcher';
import { buildTimeString, isPosInRect, numberIntoRange, templateElement } from './util';

/**
 * @typedef {{
 *  absolute: number;
 *  seconds: number;
 *  chapter: import('./Chapters').Chapter;
 *  onChapterMarker: boolean;
 *  }} SeekPosition
 *
 * @typedef {{
 *  uri: string;
 *  thumb: any;
 *  tilesetImage: HTMLImageElement;
 * }} LastRendered
 */

const DISPLAY_WIDTH = 160;

/**
 * Component for a thumbnail preview when sliding over the seekbar.
 *
 * Oriented at https://github.com/google/shaka-player/issues/3371#issuecomment-830001465.
 */
export default class ThumbnailPreview {
  /**
   *
   * @param {object} config
   * @param {HTMLElement} config.seekBar
   * @param {shaka.Player} config.player
   * @param {() => number | null} config.getFps
   * @param {(timecode: number) => import('./Chapters').Chapter} config.getChapter
   * @param {ImageFetcher} config.network
   * @param {object} config.interaction
   * @param {(pos: SeekPosition) => void} config.interaction.onChange
   */
  constructor(config) {
    this.seekBar = config.seekBar;
    this.player = config.player;
    this.getFps = config.getFps;
    this.getChapter = config.getChapter;
    this.network = config.network;
    this.interaction = config.interaction;

    // Make preview unselectable so that, for example, the info text won't
    // accidentally be selected when scrubbing on FlatSeekBar.
    const container = templateElement(`
      <div class="thumbnail-preview noselect">
        <div class="content-box">
          <div class="display">
            <canvas>
          </div>
          <span class="info">
            <span class="chapter-text"></span>
            <span class="timecode-text"></span>
          </span>
        </div>
      </div>
    `);

    const seekMarker = templateElement(`
      <div class="seek-marker"></div>
    `);

    this.dom = {
      seekMarker,
      container,
      display: container.querySelector('.display'),
      /** @type {HTMLCanvasElement} */
      canvas: container.querySelector('canvas'),
      info: container.querySelector('.info'),
      chapterText: container.querySelector('.chapter-text'),
      timecodeText: container.querySelector('.timecode-text'),
    };

    this.ctx = this.dom.canvas.getContext('2d');

    this.setCanvasResolution(DISPLAY_WIDTH, DISPLAY_WIDTH / (16 / 9));

    /** @type {LastRendered | null} */
    this.lastRendered = null;
    this.isChanging = false;
    this.showContainer = false;

    this.seekBar.append(this.dom.seekMarker, this.dom.container);

    this.handlers = {
      onWindowBlur: this.onWindowBlur.bind(this),
      onPointerMove: this.onPointerMove.bind(this),
      onPointerDown: this.onPointerDown.bind(this),
      onPointerUp: this.onPointerUp.bind(this),
    };

    window.addEventListener('blur', this.handlers.onWindowBlur);
    // TODO: Find a better solution for this
    document.addEventListener('pointermove', this.handlers.onPointerMove);
    document.addEventListener('pointerdown', this.handlers.onPointerDown);
    document.addEventListener('pointerup', this.handlers.onPointerUp);
  }

  release() {
    window.removeEventListener('blur', this.handlers.onWindowBlur);
    document.removeEventListener('pointermove', this.handlers.onPointerMove);
    document.removeEventListener('pointerdown', this.handlers.onPointerDown);
    document.removeEventListener('pointerup', this.handlers.onPointerUp);
  }

  setCanvasResolution(width, height) {
    // Code adopted from https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio

    const scale = window.devicePixelRatio;

    this.dom.canvas.width = scale * width;
    this.dom.canvas.height = scale * height;

    this.canvasResolution = { scale, width, height };

    this.ctx.scale(scale, scale);

    if (this.lastRendered) {
      this.renderImage(this.lastRendered.uri, this.lastRendered.thumb, this.lastRendered.tilesetImage, true);
    }
  }

  ensureDisplaySize(thumbWidth, thumbHeight) {
    const previewHeight = DISPLAY_WIDTH / thumbWidth * thumbHeight;
    if (this.canvasResolution.height !== previewHeight) {
      this.dom.display.style.height = `${previewHeight}px`;
      this.setCanvasResolution(160, previewHeight);
    }
  }

  /**
   * @protected
   */
  onWindowBlur() {
    // The blur event is fired, for example, when the user switches the tab via
    // Ctrl+Tab. If they then move the mouse and return to the player tab, it may
    // be surprising to have the thumbnail preview still open. Thus, close the
    // preview to avoid that.
    this.setIsVisible(false);

    this.changeEnd();
  }

  /**
   *
   * @returns {number}
   */
  getVideoDuration() {
    return this.player.getMediaElement().duration;
  }

  /**
   * @protected
   */
  getThumbsTrack() {
    const estimatedBandwidth = this.player.getStats().estimatedBandwidth;

    const imageTracks = this.player.getImageTracks().filter(
      track => track.bandwidth < estimatedBandwidth * 0.01
    );
    imageTracks.sort((a, b) => b.bandwidth - a.bandwidth);

    return imageTracks[0];
  }

  /**
   * @protected
   * @param {MouseEvent} e
   * @returns {SeekPosition | undefined}
   */
  mouseEventToPosition(e) {
    const duration = this.getVideoDuration();
    if (!(duration > 0)) {
      return;
    }

    const isHoveringButton = document.querySelector("input[type=button]:hover, button:hover") !== null;
    if (isHoveringButton) {
      return;
    }

    const bounding = this.seekBar.getBoundingClientRect();

    // Don't check bounds when scrubbing
    if (!this.isChanging) {
      if (this.showContainer) {
        // A seek has already been initiated by hovering the seekbar. Check
        // bounds in such a way that quickly moving the mouse left/right won't
        // accidentally close the container.

        const { left, right, bottom } = bounding;
        if (!(left <= e.clientX && e.clientX <= right && e.clientY <= bottom)) {
          return;
        }

        const { top } = this.dom.container.getBoundingClientRect();
        if (!(top <= e.clientY)) {
          return;
        }
      } else {
        // Before initiating a seek, check that the seek bar (or a descendant)
        // is actually hovered (= not only an element that visually overlays the
        // seek bar, such as a modal).

        if (!this.seekBar.contains(e.target)) {
          return;
        }
      }
    }

    const secondsPerPixel = duration / bounding.width;

    let absolute = e.clientX - bounding.left;
    let seconds = numberIntoRange(absolute * secondsPerPixel, [0, duration]);
    const chapter = this.getChapter(seconds);
    let onChapterMarker = false;

    // "Capture" mouse on chapter markers,
    // but only if the user is not currently scrubbing.
    if (chapter && !this.isChanging) {
      const offsetPixels = (seconds - chapter.timecode) / secondsPerPixel;
      if (-2 <= offsetPixels && offsetPixels < 6) {
        seconds = chapter.timecode;
        absolute = seconds / secondsPerPixel;
        onChapterMarker = true;
      }
    }

    return { absolute, seconds, chapter, onChapterMarker };
  }

  /**
   * @protected
   * @param {PointerEvent} e
   */
  async onPointerMove(e) {
    const seekPosition = this.mouseEventToPosition(e);
    if (seekPosition === undefined) {
      return this.setIsVisible(false);
    }

    // Check primary button
    if (this.isChanging && e.buttons & 1 !== 0) {
      this.interaction?.onChange?.(seekPosition);
    }

    this.setIsVisible(true, false);
    this.renderSeekPosition(seekPosition);

    const thumbsTrack = this.getThumbsTrack();
    if (thumbsTrack === undefined) {
      return;
    }

    const thumb = await this.player.getThumbnails(thumbsTrack.id, seekPosition.seconds);
    if (thumb === null || thumb.uris.length === 0) {
      return;
    }

    const uri = thumb.uris[0];
    if (this.lastRendered === null || uri !== this.lastRendered.uri) {
      this.network.get(uri)
        .then(image => {
          this.renderImageAndShow(uri, thumb, image, seekPosition);
        });
    } else {
      this.renderImageAndShow(uri, thumb, this.lastRendered.tilesetImage, seekPosition);
    }
  }

  /**
   *
   * @param {PointerEvent} e
   */
  onPointerDown(e) {
    // Check primary button
    if (e.buttons & 1 !== 0) {
      const position = this.mouseEventToPosition(e);
      if (position !== undefined) {
        if (!this.isChanging) {
          this.interaction?.onChangeStart?.();
          document.body.classList.add('seek-or-scrub');
          this.isChanging = true;
        }

        this.interaction?.onChange?.(position);
      }
    }
  }

  /**
   *
   * @param {PointerEvent} e
   */
  onPointerUp(e) {
    this.changeEnd();

    if (this.mouseEventToPosition(e) === undefined) {
      this.setIsVisible(false);
    }
  }

  changeEnd() {
    if (this.isChanging) {
      this.interaction?.onChangeEnd?.();
      document.body.classList.remove('seek-or-scrub');
      this.isChanging = false;
    }
  }

  renderThumbTimecode(thumb) {
    // TODO: Make this more flexible than just accomodating ffmpeg's fps filter
    const fps = this.getFps();
    const targetTime = thumb.startTime + thumb.duration / 2;
    const timecode = buildTimeString(targetTime - 0.00001, this.getVideoDuration() >= 3600, fps);

    this.ctx.font = "8px sans-serif";
    this.ctx.textBaseline = 'top';

    const textMetrics = this.ctx.measureText(timecode);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxDescent; // because baseline = top

    const textPaddingX = 2;
    const textPaddingY = 2;
    const textLeft = this.canvasResolution.width - (textWidth + textPaddingX);

    // Fill text box for solid background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(textLeft - textPaddingX, 0, textWidth + 2 * textPaddingX, textHeight + 2 * textPaddingY);

    this.ctx.fillStyle = "white";
    this.ctx.fillText(timecode, textLeft, textPaddingY);
  }

  renderImage(uri, thumb, tilesetImage, force = false) {
    // Check if it's another thumbnail (`startTime` as a proxy)
    if (force || this.lastRendered === null || thumb.startTime !== this.lastRendered.thumb.startTime) {
      let { positionX, positionY, width, height } = thumb;

      this.ctx.drawImage(
        tilesetImage,
        // position and size on source image
        positionX, positionY, width, height,
        // position and size on destination canvas
        0, 0, this.canvasResolution.width, this.canvasResolution.height
      );

      this.renderThumbTimecode(thumb);

      this.lastRendered = { uri, thumb, tilesetImage };
    }
  }

  renderImageAndShow(uri, thumb, tilesetImage, seekPosition) {
    // When width/height are in the interval [0,1], we treat them as relative
    // to the tileset size. See `CustomHlsParser`.
    if ((0 <= thumb.width && thumb.width <= 1) && (0 <= thumb.height && thumb.height <= 1)) {
      thumb.positionX *= tilesetImage.width;
      thumb.width *= tilesetImage.width;

      thumb.positionY *= tilesetImage.height;
      thumb.height *= tilesetImage.height;
    }

    this.ensureDisplaySize(thumb.width, thumb.height);

    this.renderImage(uri, thumb, tilesetImage);
    this.setIsVisible(true);

    // If the image has just become visible, the container position may change
    this.positionContainer(seekPosition);
  }

  /**
   *
   * @param {SeekPosition} seekPosition
   */
  positionContainer(seekPosition) {
    // Align the container so that the mouse underneath is centered,
    // but avoid overflowing at the left or right of the seek bar
    const containerX = numberIntoRange(
      seekPosition.absolute - this.dom.container.offsetWidth / 2,
      [0, this.seekBar.clientWidth - this.dom.container.offsetWidth]
    );
    this.dom.container.style.left = `${containerX}px`;
  }

  /**
   *
   * @param {SeekPosition} seekPosition
   */
  renderSeekPosition(seekPosition) {
    const duration = this.getVideoDuration();
    if (!Number.isFinite(duration)) {
      this.setIsVisible(false);
      return;
    }

    this.dom.seekMarker.style.left = `${seekPosition.absolute}px`;

    if (seekPosition.onChapterMarker) {
      this.dom.info.classList.add("on-chapter-marker");
    } else {
      this.dom.info.classList.remove("on-chapter-marker");
    }

    // Empty chapter titles are hidden to maintain correct distance of info text
    // to thumbnail image
    const title = seekPosition.chapter?.title ?? "";
    this.dom.chapterText.innerText = title;
    this.setElementVisible(this.dom.chapterText, title !== "");

    this.dom.timecodeText.innerText = buildTimeString(seekPosition.seconds, duration >= 3600, this.getFps());

    // The info text length may influence the container position, so position
    // after setting the text.
    this.positionContainer(seekPosition);
  }

  setIsVisible(showContainer, showThumb = showContainer) {
    this.showContainer = showContainer;
    this.setElementVisible(this.dom.container, showContainer);
    this.setElementVisible(this.dom.seekMarker, showContainer);

    this.setElementVisible(this.dom.display, showThumb);
  }

  setElementVisible(element, visible) {
    if (visible) {
      element.classList.add('shown');
    } else {
      element.classList.remove('shown');
    }
  }
}

// @ts-check

import shaka from 'shaka-player/dist/shaka-player.ui';
import 'shaka-player/ui/controls.less';

import Gestures from '../../lib/Gestures';
import { e, setElementClass } from '../../lib/util';
import {
  FlatSeekBar,
  PresentationTimeTracker,
  VideoTrackSelection
} from '../controls';

/**
 * Listens to the following custom events:
 * - {@link dlf.media.SeekBarEvent}
 * - {@link dlf.media.ManualSeekEvent}
 *
 * Emits the following custom events:
 * - {@link dlf.media.MediaPropertiesEvent}
 *
 * @implements {dlf.media.PlayerFrontend}
 */
export default class ShakaFrontend {
  /**
   *
   * @param {Translator & Identifier} env
   * @param {shaka.Player} player
   * @param {HTMLMediaElement} media
   */
  constructor(env, player, media) {
    /** @private */
    this.env = env;

    /** @private */
    this.player = player;

    /** @private */
    this.media = media;

    /** @private @type {dlf.media.MediaProperties} */
    this.mediaProperties = {
      poster: null,
      chapters: null,
      fps: null,
      variantGroups: null,
    };

    /** @private @type {string[]} */
    this.controlPanelButtons = [];

    /** @private @type {string[]} */
    this.overflowMenuButtons = [];

    /** @type {HTMLElement | null} */
    this.shakaBottomControls = null;

    /** @private @type {FlatSeekBar | null} */
    this.seekBar_ = null;

    /** @private */
    this.$container = e('div', {
      className: "dlf-media-player dlf-media-frontend-shaka"
    }, [
      this.$videoBox = e('div', { className: "dlf-media-shaka-box" }, [
        this.$video = media,
        this.$poster = e('img', {
          className: "dlf-media-poster dlf-visible",
          $error: () => {
            this.hidePoster();
          },
        }),
      ]),
      this.$errorBox = e('div', {
        className: "dlf-media-shaka-box dlf-media-error"
      }),
    ]);

    /** @private */
    this.ui = new shaka.ui.Overlay(this.player, this.$videoBox, this.media);

    this.controls = /** @type {shaka.ui.Controls} */(this.ui.getControls());

    /** @private */
    this.gestures_ = new Gestures({
      allowGesture: this.allowGesture.bind(this),
    });

    /** @private */
    this.handlers = {
      afterManualSeek: this.afterManualSeek.bind(this),
    };

    this.registerEventHandlers();
  }

  /**
   * @private
   */
  registerEventHandlers() {
    // TODO: Figure out a good flow of events
    this.controls.addEventListener('dlf-media-seek-bar', (e) => {
      const detail = /** @type {dlf.media.SeekBarEvent} */(e).detail;
      this.seekBar_ = detail.seekBar;
    });
    this.controls.addEventListener('dlf-media-manual-seek', this.handlers.afterManualSeek);

    this.gestures_.register(this.$videoBox);
  }

  get domElement() {
    return this.$container;
  }

  get seekBar() {
    return this.seekBar_;
  }

  get gestures() {
    return this.gestures_;
  }

  /**
   *
   * @param {Partial<dlf.media.MediaProperties>} props
   */
  updateMediaProperties(props) {
    Object.assign(this.mediaProperties, props);
    this.notifyMediaProperties(/* full= */this.mediaProperties, props);
  }

  /**
   * @private
   * @param {dlf.media.MediaProperties} fullProps
   * @param {Partial<dlf.media.MediaProperties>} updateProps
   */
  notifyMediaProperties(
    fullProps = this.mediaProperties,
    updateProps = fullProps
  ) {
    if (updateProps.poster !== undefined) {
      this.renderPoster();
    }

    /** @type {dlf.media.MediaPropertiesEvent} */
    const event = new CustomEvent('dlf-media-properties', {
      detail: {
        updateProps,
        fullProps,
      },
    });
    this.controls.dispatchEvent(event);
  }

  handleEscape() {
    if (this.seekBar?.isThumbnailPreviewOpen()) {
      this.seekBar?.endSeek();
      return true;
    }

    if (this.controls.anySettingsMenusAreOpen()) {
      this.controls.hideSettingsMenus();
      return true;
    }

    return false;
  }

  afterManualSeek() {
    // Hide poster when seeking in pause mode before playback has started
    // We don't want to hide the poster when initial timecode is used
    // TODO: Move this back to DlfMediaPlayer?
    this.hidePoster();
  }

  /**
   *
   * @param {string[]} elementKey
   */
  addControlElement(...elementKey) {
    this.controlPanelButtons.push(...elementKey);
  }

  /**
   *
   * @param {string[]} elementKey
   */
  addOverflowButton(...elementKey) {
    this.overflowMenuButtons.push(...elementKey);
  }

  configure() {
    // TODO: Somehow avoid overriding the SeekBar globally?
    FlatSeekBar.register();

    this.ui.configure({
      addSeekBar: true,
      enableTooltips: true,
      controlPanelElements: [
        'play_pause',
        PresentationTimeTracker.register(this.env),
        'spacer',
        'volume',
        'mute',
        ...this.controlPanelButtons,
        'overflow_menu',
      ],
      overflowMenuButtons: [
        'language',
        VideoTrackSelection.register(this.env),
        'playback_rate',
        'loop',
        'quality',
        'picture_in_picture',
        'captions',
        ...this.overflowMenuButtons,
      ],
      addBigPlayButton: true,
      seekBarColors: {
        base: 'rgba(255, 255, 255, 0.3)',
        buffered: 'rgba(255, 255, 255, 0.54)',
        played: 'rgb(255, 255, 255)',
        adBreaks: 'rgb(255, 204, 0)',
      },
      enableKeyboardPlaybackControls: false,
      doubleClickForFullscreen: false,
      singleClickForPlayAndPause: false,
    });

    // DOM is (re-)created in `ui.configure()`, so query container afterwards
    this.shakaBottomControls =
      this.$videoBox.querySelector('.shaka-bottom-controls');

    this.notifyMediaProperties();
  }

  hidePoster() {
    this.$poster.classList.remove('dlf-visible');
  }

  /**
   * @private
   */
  renderPoster() {
    if (this.mediaProperties.poster !== null) {
      this.$poster.src = this.mediaProperties.poster;
    }
  }

  /**
   * @private
   * @param {PointerEvent} event
   */
  allowGesture(event) {
    // Don't allow gestures over Shaka bottom controls
    const bounding = this.$videoBox.getBoundingClientRect();
    const controlsHeight = this.shakaBottomControls?.getBoundingClientRect().height ?? 0;
    const userAreaBottom = bounding.bottom - controlsHeight - 20;
    if (event.clientY >= userAreaBottom) {
      return false;
    }

    // Check that the pointer interacts with the container, so isn't over the button
    if (event.target !== this.$videoBox.querySelector('.shaka-play-button-container')) {
      return false;
    }

    return true;
  }
}

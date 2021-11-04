import shaka from 'shaka-player/dist/shaka-player.ui';
import 'shaka-player/ui/controls.less';

import Chapters from './Chapters';

import PresentationTimeTracker from './controls/PresentationTimeTracker';

import '../../Less/VideoPlayer/VideoPlayer.less';
import Environment from './Environment';
import ImageFetcher from './ImageFetcher';
import ThumbnailPreview from './ThumbnailPreview';

export default class SachsenShakaPlayer {
  /**
   *
   * @param {object} config
   * @param {Environment} config.env
   * @param {HTMLElement} config.container
   * @param {HTMLVideoElement} config.video
   * @param {string} config.manifestUri
   * @param {number?} config.timecode
   * @param {Chapters} config.chapters
   * @param {string[]} config.controlPanelButtons
   * @param {string[]} config.overflowMenuButtons
   * @param {object} config.constants
   * @param {number} config.constants.prevChapterTolerance
   */
  constructor(config) {
    this.env = config.env;
    this.container = config.container;
    this.video = config.video;
    this.manifestUri = config.manifestUri;
    this.initialTimecode = config.timecode;
    this.chapters = config.chapters;
    this.controlPanelButtons = config.controlPanelButtons ?? [];
    this.overflowMenuButtons = config.overflowMenuButtons ?? [];

    this.constants = Object.assign({
      prevChapterTolerance: 5,
    }, config.constants);
  }

  async initialize() {
    this.fps = 25;
    this.player = new shaka.Player(this.video);
    const ui = new shaka.ui.Overlay(this.player, this.container, this.video);
    this.controls = ui.getControls();

    // Store player instance so that our custom controls may access it
    this.controls.elSxndPlayer = this;

    const config = {
      addSeekBar: true,
      'controlPanelElements': [
        'play_pause',
        'chapters_menu',
        PresentationTimeTracker.KEY,
        'spacer',
        'volume',
        'mute',
        ...this.controlPanelButtons,
        'fullscreen',
        'overflow_menu'
      ],
      'overflowMenuButtons': ['language', 'playback_rate', 'loop', 'quality', 'picture_in_picture', 'captions', ...this.overflowMenuButtons],
      'addBigPlayButton': true,
      'seekBarColors': {
        base: 'rgba(255, 255, 255, 0.3)',
        buffered: 'rgba(255, 255, 255, 0.54)',
        played: 'rgb(255, 255, 255)',
        adBreaks: 'rgb(255, 204, 0)',
      }
    };
    ui.configure(config);

    // Listen for error events.
    this.player.addEventListener('error', this.onPlayerErrorEvent.bind(this));
    this.controls.addEventListener('error', this.onUiErrorEvent.bind(this));

    this.vifa = VideoFrame({
      id: this.video.id,
      frameRate: this.fps,
      callback: function (response) {
        console.log('callback response: ' + response);
      }
    });

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
      // This runs if the asynchronous load is successful.
      console.log('The video has now been loaded!');
      await this.player.load(this.manifestUri, this.initialTimecode);
    } catch (e) {
      // onError is executed if the asynchronous load fails.
      onError(e);
    }

    this.seekBar = this.container.querySelector('.shaka-seek-bar-container');
    this.thumbnailPreview = new ThumbnailPreview({
      mainContainer: this.container,
      seekBar: this.seekBar,
      seekThumbSize: 12,
      player: this.player,
      network: new ImageFetcher(),
    });

    this.renderChapterMarkers();
  }

  setLocale(locale) {
    this.controls.getLocalization().changeLocale([locale]);
  }

  renderChapterMarkers() {
    for (const chapter of this.chapters) {
      const relative = chapter.timecode / this.video.duration;

      // In particular, make sure that we don't put markers outside of the
      // seekbar for wrong timestamps.
      if (!(0 <= relative && relative < 1)) {
        continue;
      }

      // The outer <span /> is to give some leeway, making the chapter marker
      // easier to hit.

      const marker = document.createElement('span');
      marker.className = 'sxnd-chapter-marker';
      marker.style.position = 'absolute';
      marker.style.left = `${chapter.timecode / this.video.duration * 100}%`;
      marker.title = chapter.title;
      marker.addEventListener('click', () => {
        this.play();
        this.seekTo(chapter);
      });

      const markerInner = document.createElement('span');
      marker.append(markerInner);

      this.seekBar.append(marker);
    }
  }

  onPlayerErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    this.onPlayerError(event.detail);
  }

  onUiErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    this.onPlayerError(event.detail);
  }

  onPlayerError(error) {
    // Handle player error
    console.error('Error code', error.code, 'object', error);
  }

  get currentTime() {
    return this.video.currentTime;
  }

  get displayTime() {
    return this.controls.getDisplayTime();
  }

  getCurrentChapter() {
    return this.timeToChapter(this.currentTime);
  }

  timeToChapter(timecode) {
    return this.chapters.timeToChapter(timecode);
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  /**
   *
   * @param {*} position Timecode or chapter
   */
  seekTo(position) {
    if (position == null) {
      return;
    }

    if (typeof position === 'number') {
      this.video.currentTime = position;
    } else if (typeof position.timecode === 'number') {
      this.video.currentTime = position.timecode;
    }
  }

  skipSeconds(delta) {
    // TODO: Consider end of video
    this.video.currentTime += delta;
  }

  /**
   * Within configured number of seconds of a chapter, jump to the start of the
   * previous chapter. After that, jump to the start of the current chapter. As
   * a fallback, jump to the start of the video.
   */
  prevChapter() {
    this.seekTo(
      this.timeToChapter(this.currentTime - this.constants.prevChapterTolerance) ?? 0
    );
  }

  nextChapter() {
    let cur = this.getCurrentChapter();
    if (cur) {
      this.seekTo(this.chapters.advance(cur, +1));
    }
  }
}

/**
 *
 * Initialize the Shaka-Player App
 *
 */

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }

}

// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener('shaka-ui-load-failed', (errorEvent) => {
  // Handle the failure to load; errorEvent.detail.reasonCode has a
  // shaka.ui.FailReasonCode describing why.
  console.error('Unable to load the UI library!');
});

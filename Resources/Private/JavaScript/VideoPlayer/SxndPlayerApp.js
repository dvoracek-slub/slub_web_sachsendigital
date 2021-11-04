import $ from 'jquery';

import BookmarkModal from './BookmarkModal';
import Chapters from './Chapters';
import ControlPanelButton from './controls/ControlPanelButton';
import Environment from './Environment';
import HelpModal from './HelpModal';
import { Modifier, modifiersFromEvent } from './Keyboard';
import Modals from './Modals';
import SachsenShakaPlayer from './SachsenShakaPlayer';
import ScreenshotModal from './ScreenshotModal';

class SxndPlayerApp {
  constructor(container, videoInfo, locale) {
    this.container = container;
    this.videoInfo = videoInfo;
    this.locale = locale;

    this.constants = {
      /** Number of seconds in which to still rewind to previous chapter. */
      prevChapterTolerance: 5,
    };

    // TODO: Use arrays inside the app, avoid this transformation?
    const videoMetadata = this.videoInfo.metadata.metadata;
    for (const key of Object.keys(videoMetadata)) {
      if (Array.isArray(videoMetadata[key])) {
        if (videoMetadata[key].length > 0) {
          videoMetadata[key] = videoMetadata[key][0];
        } else {
          delete videoMetadata[key];
        }
      }
    }

    this.env = new Environment();

    document.addEventListener('shaka-ui-loaded', this.onShakaUiLoaded.bind(this));

    // This is a hack against the keyup handler in `slub_digitalcollections`,
    // which adds/removes a `fullscreen` CSS class when releasing `f`/`Esc`.
    // TODO: Find a better solution for this.
    window.addEventListener('keyup', e => {
      e.stopImmediatePropagation();
    }, { capture: true });
  }

  onShakaUiLoaded() {
    const video = document.createElement("video");
    video.id = 'video';
    video.poster = this.videoInfo.url.poster;
    video.style.width = "100%";
    video.style.height = "100%";
    this.container.append(video);

    const chapters = new Chapters(this.videoInfo.chapters);

    let timecode = new URL(window.location).searchParams.get('timecode');
    if (timecode === null && this.videoInfo.pageNo !== undefined) {
      timecode = chapters.at(this.videoInfo.pageNo - 1).timecode;
    }

    const sxndPlayer = new SachsenShakaPlayer({
      env: this.env,
      container: this.container,
      video: document.getElementById('video'),
      manifestUri: this.videoInfo.url.manifest,
      timecode: timecode ? parseFloat(timecode) : undefined,
      chapters,
      controlPanelButtons: [
        ControlPanelButton.register(this.env, {
          material_icon: 'photo_camera',
          title: "Screenshot",
          onClick: () => {
            this.showScreenshot();
          },
        }),
        ControlPanelButton.register(this.env, {
          material_icon: 'bookmark_border',
          title: "Bookmark",
          onClick: () => {
            this.showBookmarkUrl();
          },
        }),
        ControlPanelButton.register(this.env, {
          material_icon: 'help_outline',
          title: "Bedienhinweise",
          onClick: () => {
            this.modals.help.open();
          },
        }),
      ],
      constants: this.constants,
    });

    sxndPlayer.initialize();

    sxndPlayer.setLocale(this.locale);

    $('a[data-timecode]').on('click', function () {
      const timecode = $(this).data('timecode');
      sxndPlayer.play();
      sxndPlayer.seekTo(timecode);
    });

    this.modals = Modals({
      help: new HelpModal(this.container),
      bookmark: new BookmarkModal(this.container, this.env),
      screenshot: new ScreenshotModal(this.container, this.env, {
        video: sxndPlayer.video,
      }),
    });

    this.sxndPlayer = sxndPlayer;

    // Capturing is used, in particular, to suppress Shaka's default keybindings
    // TODO: Find a better solution
    document.addEventListener('keydown', this.onKeyDown.bind(this), { capture: true });
  }

  hideThumbnailPreview() {
    this.sxndPlayer.thumbnailPreview.hidePreview();
  }

  onKeyDown(e) {
    const mod = modifiersFromEvent(e);

    if (e.key == 'F1' && mod == Modifier.None) {
      e.preventDefault();
      this.hideThumbnailPreview();
      this.modals.help.toggle();
      return;
    } else if (e.key == 'Escape' && mod == Modifier.None) {
      e.preventDefault();
      this.hideThumbnailPreview();
      this.modals.closeNext();
      return;
    }

    // We don't stop propagation for Esc, because Shaka should take this for
    // closing the overflow menu.
    // TODO: Refactor and tweak this behavior
    e.stopImmediatePropagation();

    if (this.modals.hasOpen()) {
      return;
    }

    if (e.key == 'f' && mod === Modifier.None) {
      e.preventDefault();
      this.hideThumbnailPreview();
      this.sxndPlayer.controls.toggleFullScreen();
    } else if (e.key == ' ' && mod === Modifier.None) {
      if (this.sxndPlayer.video.paused) {
        e.preventDefault();
        this.sxndPlayer.video.play();
      } else {
        e.preventDefault();
        this.sxndPlayer.video.pause();
      }
    } else if (e.key == "ArrowUp" && mod === Modifier.None) {
      e.preventDefault();
      this.sxndPlayer.video.volume = Math.min(1, this.sxndPlayer.video.volume + 0.05);
    } else if (e.key == "ArrowDown" && mod === Modifier.None) {
      e.preventDefault();
      this.sxndPlayer.video.volume = Math.max(0, this.sxndPlayer.video.volume - 0.05);
    } else if (e.key == "ArrowLeft") {
      if (mod === Modifier.CtrlMeta) {
        e.preventDefault();
        this.sxndPlayer.prevChapter();
      } else if (mod === Modifier.Shift) {
        e.preventDefault();
        this.sxndPlayer.vifa.seekBackward(1);
      } else if (mod === Modifier.None) {
        e.preventDefault();
        this.sxndPlayer.skipSeconds(-10);
      }
    } else if (e.key == "ArrowRight") {
      if (mod === Modifier.CtrlMeta) {
        e.preventDefault();
        this.sxndPlayer.nextChapter();
      } else if (mod === Modifier.Shift) {
        e.preventDefault();
        this.sxndPlayer.vifa.seekForward(1);
      } else if (mod === Modifier.None) {
        e.preventDefault();
        this.sxndPlayer.skipSeconds(+10);
      }
    } else if (e.key == 'm' && mod === Modifier.None) {
      e.preventDefault();
      this.sxndPlayer.video.muted = !this.sxndPlayer.video.muted;
    } else if (e.key == '.' && mod === Modifier.None) {
      e.preventDefault();
      this.sxndPlayer.vifa.seekForward(1);
    } else if (e.key == ',' && mod === Modifier.None) {
      e.preventDefault();
      this.sxndPlayer.vifa.seekBackward(1);
    } else if (e.key == 'b' && mod === Modifier.None) {
      e.preventDefault();
      this.showBookmarkUrl();
    } else if (e.key == 's' && mod === Modifier.None) {
      e.preventDefault();
      this.showScreenshot();
    }
  }

  showBookmarkUrl() {
    this.sxndPlayer.pause();
    this.hideThumbnailPreview();
    this.modals.bookmark.setTimecode(this.sxndPlayer.displayTime).open();
  }

  showScreenshot() {
    this.sxndPlayer.pause();
    this.hideThumbnailPreview();
    this.modals.screenshot
      .setMetadata(this.videoInfo.metadata)
      .setTimecode(this.sxndPlayer.displayTime)
      .open();
  }
}

window.SxndPlayerApp = SxndPlayerApp;

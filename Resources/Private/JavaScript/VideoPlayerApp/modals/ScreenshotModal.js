// @ts-check

import imageFormats from '../../lib/image/imageFormats';
import { buildTimeString } from '../../VideoPlayer';
import {
  binaryStringToArrayBuffer,
  blobToBinaryString,
  canvasToBlob,
  download,
  e,
  sanitizeBasename,
  textToHtml,
} from '../../lib/util';
import generateTimecodeUrl from '../lib/generateTimecodeUrl';
import { metadataArrayToString } from '../lib/util';
import SimpleModal from '../lib/SimpleModal';
import { listKeybindingsDisj } from '../lib/trans';
import { drawScreenshot } from '../Screenshot';

/**
 * @typedef {{
 *  metadata: MetadataArray | null;
 *  showMetadata: boolean;
 *  timecode: number | null;
 *  supportedImageFormats: ImageFormatDesc[];
 *  selectedImageFormat: ImageFormatDesc | null;
 * }} State
 */

/**
 * @extends {SimpleModal<State>}
 */
export default class ScreenshotModal extends SimpleModal {
  /**
   *
   * @param {HTMLElement} parent
   * @param {Translator & Identifier & Browser} env
   * @param {Keybinding<any, any>[]} keybindings
   */
  constructor(parent, env, keybindings) {
    const supportedImageFormats = imageFormats.filter(
      format => env.supportsCanvasExport(format.mimeType)
    );

    super(parent, {
      metadata: null,
      showMetadata: true,
      timecode: null,
      supportedImageFormats,
      selectedImageFormat: supportedImageFormats[0] ?? null,
    });

    /** @private */
    this.env = env;
    /** @private @type {HTMLVideoElement | null} */
    this.videoDomElement = null;

    const snapKeybindings = keybindings.filter(
      kb => kb.action === 'modal.screenshot.snap'
    );

    this.$main.classList.add('screenshot-modal');
    this.$title.innerText = env.t('modal.screenshot.title');

    const idShowMetadata = env.mkid();
    const radioGroup = env.mkid();

    this.$body.append(
      e("div", { className: "screenshot-config" }, [
        e("h4", {}, [env.t('modal.screenshot.configuration')]),
        e("section", { className: "metadata-config" }, [
          e("h1", {}, [env.t('modal.screenshot.metadata')]),
          e("div", { className: "metadata-overlay" }, [
            e("input", {
              type: "checkbox",
              id: idShowMetadata,
              checked: this.state.showMetadata,
              $change: this.handleChangeShowMetadata.bind(this),
            }),
            e("label", { htmlFor: idShowMetadata }, [
              env.t('modal.screenshot.metadata-overlay'),
            ]),
          ]),
        ]),
        e("section", {}, [
          e("h1", {}, [env.t('modal.screenshot.file-format')]),
          e("div", {}, (
            this.state.supportedImageFormats.map(format => {
              const radioId = env.mkid();

              return e("span", { className: "file-format-option" }, [
                e("input", {
                  id: radioId,
                  name: radioGroup,
                  type: 'radio',
                  checked: format.mimeType === this.state.selectedImageFormat?.mimeType,
                  $change: () => {
                    this.setState({
                      selectedImageFormat: format,
                    });
                  },
                }),
                e("label", { htmlFor: radioId }, [` ${format.label}`]),
              ]);
            })
          )),
        ]),
        e("a", {
          href: "#",
          className: "download-link",
          $click: this.handleDownloadImage.bind(this),
        }, [
          e("i", {
            className: "material-icons-round inline-icon",
          }, ["download"]),
          env.t('modal.screenshot.download-image'),
        ]),
        e("aside", { className: "snap-tip" }, [
          e("i", {
            className: "material-icons-round inline-icon",
          }, ["info_outline"]),
          e("span", {
            // Escape translation string, but allow listKeybindingsDisj (only)
            // to use HTML (TODO: Refactor?)
            innerHTML: textToHtml(env.t('modal.screenshot.snap-tip', { keybinding: "{kb}" }))
              .replace('{kb}', e("span", {}, listKeybindingsDisj(env, snapKeybindings)).outerHTML)
          }),
        ]),
      ]),

      this.$canvas = e("canvas")
    );
  }

  /**
   * Sets video DOM element for upcoming screenshots.
   *
   * @param {HTMLVideoElement} video
   * @returns {this}
   */
  setVideo(video) {
    this.videoDomElement = video;
    return this;
  }

  /**
   * Triggers UI update using new {@link metadata}.
   *
   * @param {MetadataArray} metadata
   * @returns {this}
   */
  setMetadata(metadata) {
    this.setState({ metadata });
    return this;
  }

  /**
   * Triggers UI update using new {@link timecode}.
   *
   * @param {number} timecode
   * @returns {this}
   */
  setTimecode(timecode) {
    this.setState({ timecode });
    return this;
  }

  /**
   * @private
   * @param {Event} e
   */
  handleChangeShowMetadata(e) {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    this.setState({
      showMetadata: e.target.checked,
    });
  }

  /**
   * @private
   * @param {MouseEvent} e
   */
  async handleDownloadImage(e) {
    e.preventDefault();

    // We could've set `.download-image[href]` in `render()` or in the radio
    // box change listener, but avoid this for performance reasons.

    await this.downloadCurrentImage(this.state);
  }

  /**
   * @param {Pick<State, 'showMetadata' | 'metadata'>} state
   */
  renderCurrentScreenshot({ showMetadata, metadata }) {
    if (this.videoDomElement === null) {
      // TODO: Error handling
      return false;
    }

    const config = {
      captions: showMetadata ? this.getCaptions(metadata) : [],
      minWidth: 1000,
    };

    drawScreenshot(this.$canvas, this.videoDomElement, config);

    return true;
  }

  /**
   *
   * @param {Pick<State, 'metadata' | 'timecode' | 'selectedImageFormat'>} state
   */
  async downloadCurrentImage(state) {
    const { metadata, timecode, selectedImageFormat } = state;
    if (metadata === null || timecode === null || selectedImageFormat === null) {
      console.error("one of [metadata, timecode, selectedImageFormat] is null");
      return false;
    }

    const image = await this.makeImageBlob(
      this.$canvas, selectedImageFormat, metadata, timecode);
    const filename = this.getFilename(metadata, timecode, selectedImageFormat);

    download(image, filename);

    return true;
  }

  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {ImageFormatDesc} imageFormat
   * @param {MetadataArray} metadata
   * @param {number} timecode
   */
  async makeImageBlob(canvas, imageFormat, metadata, timecode) {
    const imageBlob = await canvasToBlob(canvas, imageFormat.mimeType);
    const imageDataStr = await blobToBinaryString(imageBlob);
    const image = imageFormat.parseBinaryString(imageDataStr);

    if (image) {
      const url = generateTimecodeUrl(timecode, this.env);

      image.addMetadata({
        title: metadata.metadata.title?.[0] ?? "",
        // NOTE: Don't localize (not only relevant to current user)
        comment: `Screenshot taken on Sachsen.Digital.\n\n${url.toString()}`,
      });
      const buffer = binaryStringToArrayBuffer(image.toBinaryString());
      return new Blob([buffer], { type: imageBlob.type });
    } else {
      return imageBlob;
    }
  }

  /**
   *
   * @param {MetadataArray} metadata
   * @param {number} timecode
   * @param {ImageFormatDesc} selectedImageFormat
   * @return {string}
   */
  getFilename(metadata, timecode, selectedImageFormat) {
    // NOTE: Don't localize (English file name prefix should be alright)
    const basename = sanitizeBasename(
      `Screenshot-${metadata.metadata.title?.[0] ?? "Unnamed"}-T${buildTimeString(timecode, true)}`
    );

    const extension = selectedImageFormat.extension;

    return `${basename}.${extension}`;
  }

  /**
   *
   * @param {MetadataArray | null} metadata
   * @returns {import('../Screenshot').ScreenshotCaption[]}
   */
  getCaptions(metadata) {
    return [
      { v: 'bottom', h: 'left', text: "https://sachsen.digital" },
      { v: 'bottom', h: 'right', text: metadata ? metadataArrayToString(metadata) : "" },
    ];
  }

  /**
   * Downloads image without opening the modal.
   */
  async snap() {
    // Parameters may be on the way via setState (TODO: Refactor)
    await this.update();

    const state = this.state;
    const success = (
      this.renderCurrentScreenshot(state)
      && await this.downloadCurrentImage(state)
    );

    if (!success) {
      alert(this.env.t('modal.screenshot.error'));
    }
  }

  /**
   * @override
   * @param {import('../lib/SimpleModal').BaseState & State} state
   */
  render(state) {
    super.render(state);

    const shouldRender = (
      state.show
      && (!this.state.show || state.showMetadata !== this.state.showMetadata)
    );

    if (shouldRender) {
      this.renderCurrentScreenshot(state);
    }
  }
}

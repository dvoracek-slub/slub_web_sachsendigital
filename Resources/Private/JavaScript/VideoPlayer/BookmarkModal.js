import SimpleModal from './SimpleModal';

export default class BookmarkModal extends SimpleModal {
  constructor(element) {
    super(element, {
      timecode: null,
    });

    this._urlInput = this._element.querySelector('.url-input');
  }

  setTimecode(timecode) {
    this.setState({ timecode });
    return this;
  }

  render(state) {
    super.render(state);

    const { show, timecode } = state;

    if (timecode !== null && timecode !== this._state.timecode) {
      const url = new URL(window.location);
      url.searchParams.set('timecode', state.timecode);

      this._urlInput.value = url.toString();
    }

    if (show && show !== this._state.show) {
      this._urlInput.select();
    }
  }
}

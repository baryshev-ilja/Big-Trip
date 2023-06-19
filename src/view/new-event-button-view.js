import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewEventButtonView extends AbstractView {
  #handleButtonClick = null;

  constructor({onButtonClick}) {
    super();
    this.#handleButtonClick = onButtonClick;

    this.element.addEventListener('click', this.#onButtonClickHandler);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  disable() {
    this.element.disabled = true;
  }

  #onButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}

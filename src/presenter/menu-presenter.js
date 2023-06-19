import {render} from '../framework/render.js';
import NewEventButtonView from '../view/new-event-button-view.js';

export default class MenuPresenter {
  #menuContainer = null;
  #buttonElement = null;
  #handleButtonClick = null;

  constructor({menuContainer, onNewEventButtonClick}) {
    this.#menuContainer = menuContainer;
    this.#handleButtonClick = onNewEventButtonClick;
  }

  init() {
    if (this.#buttonElement !== null) {
      return;
    }

    this.#buttonElement = new NewEventButtonView({
      onButtonClick: this.#handleButtonClick
    });
    render(this.#buttonElement, this.#menuContainer);
  }

  buttonDisable() {
    this.#buttonElement.disable();
  }
}

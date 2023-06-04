import {createElement} from '../render.js';

function createNoPointsView() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class NoPointsView {
  #element = null;

  get template() {
    return createNoPointsView();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

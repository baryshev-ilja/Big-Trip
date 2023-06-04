import {createElement} from '../render.js';

function createRouteWrapperTemplate() {
  return '<section class="trip-main__trip-info  trip-info"></section>';
}

export default class RouteWrapperView {
  #element = null;

  get template() {
    return createRouteWrapperTemplate();
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

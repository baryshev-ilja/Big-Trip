import {createElement} from '../render.js';

function createRouteWrapperTemplate() {
  return '<section class="trip-main__trip-info  trip-info"></section>';
}

export default class RouteWrapperView {
  getTemplate() {
    return createRouteWrapperTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

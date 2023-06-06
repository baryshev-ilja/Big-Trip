import AbstractView from '../framework/view/abstract-view.js';

function createRouteWrapperTemplate() {
  return '<section class="trip-main__trip-info  trip-info"></section>';
}

export default class RouteWrapperView extends AbstractView {
  get template() {
    return createRouteWrapperTemplate();
  }
}

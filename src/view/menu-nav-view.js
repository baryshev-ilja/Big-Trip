import AbstractView from '../framework/view/abstract-view.js';

function createMenuNavTemplate() {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
                <a class="trip-tabs__btn" href="#">Stats</a>
              </nav>`;
}

export default class MenuNavView extends AbstractView {
  get template() {
    return createMenuNavTemplate();
  }
}

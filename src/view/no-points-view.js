import AbstractView from '../framework/view/abstract-view.js';

function createNoPointsView() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class NoPointsView extends AbstractView {
  get template() {
    return createNoPointsView();
  }
}

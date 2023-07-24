import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const messagesByFilter = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createListMessageTemplate(filterType) {
  return `<p class="trip-events__msg">${messagesByFilter[filterType]}</p>`;
}

export default class PointListMessageView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return createListMessageTemplate(this.#filterType);
  }
}

import AbstractView from '../framework/view/abstract-view.js';
import {MenuItem} from '../const.js';

function createMenuNavTemplate(currentMenuItem) {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn
                ${currentMenuItem === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}"
                data-menu-item="${MenuItem.TABLE}"
                href="#">Table</a>
                <a class="trip-tabs__btn
                ${currentMenuItem === MenuItem.STATS ? 'trip-tabs__btn--active' : ''}"
                data-menu-item="${MenuItem.STATS}"
                href="#">Stats</a>
              </nav>`;
}

export default class MenuNavView extends AbstractView {
  #menuItem = null;

  constructor(menuItem) {
    super();
    this.#menuItem = null;
  }

  get template() {
    return createMenuNavTemplate(this.#menuItem);
  }

  #menuClickHandler = (evt) => {
    const selectedMenu = evt.target.dataset.menuItem;
    if (evt.target.tagName !== 'A' || selectedMenu === this.#menuItem) {
      return;
    }

    evt.preventDefault();
    this.#menuItem = selectedMenu;
    this._callback.menuClick(selectedMenu);
  };

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }
}

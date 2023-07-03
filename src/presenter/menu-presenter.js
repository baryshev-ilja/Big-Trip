import {render, replace, remove} from '../framework/render.js';
import MenuNavView from '../view/menu-nav-view.js';
import {MenuItem} from '../const.js';

export default class MenuPresenter {
  #menuContainer = null;
  #menuNavComponent = null;
  #currentMenu = MenuItem.TABLE;
  #menuClickHandler = null;

  constructor({menuContainer}) {
    this.#menuContainer = menuContainer;
  }

  init(menuClickHandler) {
    const prevMenuComponent = this.#menuNavComponent;

    this.#menuNavComponent = new MenuNavView(this.#currentMenu);
    this.#menuNavComponent.setMenuClickHandler(this.#handleMenuClick);
    this.#menuClickHandler = menuClickHandler;

    if (prevMenuComponent === null) {
      render(this.#menuNavComponent, this.#menuContainer);
      return;
    }

    replace(this.#menuNavComponent, prevMenuComponent);
    remove(prevMenuComponent);
  }

  #handleMenuClick = (menuItem) => {
    this.#currentMenu = menuItem;
    this.#menuClickHandler(this.#currentMenu);

    this.init(this.#menuClickHandler);
  };

  reset() {
    this.#handleMenuClick(MenuItem.TABLE);
  }
}

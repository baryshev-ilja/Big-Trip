import {render, RenderPosition} from '../framework/render.js';
import MenuNavView from '../view/menu-nav-view.js';
import RouteWrapperView from '../view/route-wrapper-view.js';
import RouteInfoView from '../view/route-info-view.js';
import RouteCostView from '../view/route-cost-view.js';

export default class MenuPresenter {
  #routeWrapperComponent = new RouteWrapperView();
  #routeInfoComponent = new RouteInfoView();
  #routeCostComponent = new RouteCostView();
  #menuNavComponent = new MenuNavView();

  #menuContainer = null;
  #routeContainer = null;
  #filtersContainer = null;

  constructor({
    routeContainer,
    menuContainer,
    filtersContainer,
  }) {
    this.#menuContainer = menuContainer;
    this.#routeContainer = routeContainer;
    this.#filtersContainer = filtersContainer;
  }

  init() {
    this.#renderRouteWrapper();
    this.#renderRouteInfo();
    this.#renderRouteCost();
    this.#renderMenuNav();
  }

  #renderRouteWrapper() {
    render(this.#routeWrapperComponent, this.#routeContainer, RenderPosition.AFTERBEGIN);
  }

  #renderRouteInfo() {
    render(this.#routeInfoComponent, this.#routeWrapperComponent.element);
  }

  #renderRouteCost() {
    render(this.#routeCostComponent, this.#routeWrapperComponent.element);
  }

  #renderMenuNav() {
    render(this.#menuNavComponent, this.#menuContainer);
  }
}

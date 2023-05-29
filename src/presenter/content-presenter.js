import {render, RenderPosition} from '../render.js';
import EditFormView from '../view/edit-form-view.js';
import FiltersView from '../view/filters-view.js';
import MenuNavView from '../view/menu-nav-view.js';
import RouteWrapperView from '../view/route-wrapper-view.js';
import RouteInfoView from '../view/route-info-view.js';
import RouteCostView from '../view/route-cost-view.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import WaypointView from '../view/waypoint-view.js';

export default class ContentPresenter {
  routeWrapperComponent = new RouteWrapperView();
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsContainer, routeContainer, menuContainer, filtersContainer, pointsModel}) {
    this.tripEventsContainer = tripEventsContainer;
    this.routeContainer = routeContainer;
    this.menuContainer = menuContainer;
    this.filtersContainer = filtersContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(this.routeWrapperComponent, this.routeContainer, RenderPosition.AFTERBEGIN);
    render(new RouteInfoView(), this.routeWrapperComponent.element);
    render(new RouteCostView(), this.routeWrapperComponent.element);
    render(new MenuNavView(), this.menuContainer);
    render(new FiltersView(), this.filtersContainer);

    render(new SortingView(), this.tripEventsContainer);
    render(this.tripEventsListComponent, this.tripEventsContainer);
    render(new EditFormView(), this.tripEventsListComponent.element);

    for(let i = 0; i < this.points.length; i++) {
      render(new WaypointView({point: this.points[i]}), this.tripEventsListComponent.element);
    }
  }
}

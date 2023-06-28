import {render, remove, RenderPosition} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import MenuNavView from '../view/menu-nav-view.js';
import RouteWrapperView from '../view/route-wrapper-view.js';
import RouteInfoView from '../view/route-info-view.js';
import RouteCostView from '../view/route-cost-view.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import {sortTime, sortPrice, sortDay} from '../utils/waypoint.js';
import {SortType, UserAction, UpdateType} from '../const.js';
import MenuPresenter from './menu-presenter.js';

export default class GeneralPresenter {

  #routeWrapperComponent = new RouteWrapperView();
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsContainer = null;
  #routeContainer = null;
  #menuContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #filters = null;
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();
  #routeInfoComponent = new RouteInfoView();
  #routeCostComponent = new RouteCostView();
  #menuNavComponent = new MenuNavView();

  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #menuPresenter = null;


  constructor({
    tripEventsContainer,
    routeContainer,
    menuContainer,
    filtersContainer,
    pointsModel,
    filters
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#routeContainer = routeContainer;
    this.#menuContainer = menuContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#filters = filters;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPrice);
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortDay);
    }

    return this.#pointsModel.points;
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetMode());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#rerenderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#rerenderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#rerenderBoard();
  };

  #renderNewEventButton() {
    this.#menuPresenter = new MenuPresenter({
      menuContainer: this.#routeContainer,
      onNewEventButtonClick: this.#handleNewEventButtonClick
    });
    this.#menuPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#tripEventsContainer);
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

  #renderMenuFilters() {
    const menuFilterComponent = new FiltersView(this.#filters);
    render(menuFilterComponent, this.#filtersContainer);
  }

  // Функция-обработчик нажатия на кнопку New event. Добавляет новую точку маршрута из массива с данными
  #handleNewEventButtonClick = () => {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.initNewEventForm();
    this.#pointsPresenter.set(pointPresenter.getIdNewPoint(), pointPresenter);

  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    const points = this.points;
    const pointsCount = this.points.length;

    this.#renderRouteWrapper();
    this.#renderRouteInfo();
    this.#renderRouteCost();
    this.#renderMenuNav();
    this.#renderMenuFilters();
    this.#renderNewEventButton();

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#renderPoints(points);
  }

  #rerenderBoard() {
    const points = this.points;
    const pointsCount = this.points.length;

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#renderPoints(points);
  }
}

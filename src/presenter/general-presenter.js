import {render, RenderPosition} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import MenuNavView from '../view/menu-nav-view.js';
import RouteWrapperView from '../view/route-wrapper-view.js';
import RouteInfoView from '../view/route-info-view.js';
import RouteCostView from '../view/route-cost-view.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {sortDay, sortTime, sortPrice} from '../utils/waypoint.js';
import {SortType} from '../const.js';
import MenuPresenter from './menu-presenter.js';

const INITIAL_COUNT_OF_POINTS = 1;
// const POINT_COUNT_PER_STEP = 1;

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

  #points = [];
  #renderedPointsCount = INITIAL_COUNT_OF_POINTS;
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];
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
  }

  init() {
    this.#points = [...this.#pointsModel.points].sort(sortDay);
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this.#sourcedPoints = [...this.#points];
    this.#renderBoard();
  }

  get points() {
    return this.#pointsModel.points;
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetMode());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве #points
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPrice);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
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
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderPoint(point, form = false) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, form);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(from, to) {
    this.#points
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderPointsList() {
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#renderPoints(0, Math.min(this.#points.length));
  }

  #clearPointsList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
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

  #addNewPointToAllData(newPoint) {
    this.#points.push(newPoint);
    this.#sourcedPoints.push(newPoint);
  }

  // Функция-обработчик нажатия на кнопку New event. Добавляет новую точку маршрута из массива с данными
  #handleNewEventButtonClick = () => {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.initNewEventForm();
    this.#pointsPresenter.set(pointPresenter.getIdNewPoint(), pointPresenter);
    this.#addNewPointToAllData(pointPresenter.getDataNewPoint());

  };

  #renderBoard() {
    this.#renderRouteWrapper();
    this.#renderRouteInfo();
    this.#renderRouteCost();
    this.#renderMenuNav();
    this.#renderMenuFilters();
    this.#renderNewEventButton();

    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}

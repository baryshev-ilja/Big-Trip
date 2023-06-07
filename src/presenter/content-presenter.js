import {render, RenderPosition, replace} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import FiltersView from '../view/filters-view.js';
import MenuNavView from '../view/menu-nav-view.js';
import RouteWrapperView from '../view/route-wrapper-view.js';
import RouteInfoView from '../view/route-info-view.js';
import RouteCostView from '../view/route-cost-view.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import NoPointsView from '../view/no-points-view.js';
import {getIsEscape} from '../utils/common.js';

const INITIAL_COUNT_OF_POINTS = 6;
const POINT_COUNT_PER_STEP = 1;

export default class ContentPresenter {
  #routeWrapperComponent = new RouteWrapperView();
  #tripEventsListComponent = new TripEventsListView();
  #newEventButtonComponent = null;
  #tripEventsContainer = null;
  #routeContainer = null;
  #menuContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #filters = null;
  #sortComponent = new SortingView();
  #noPointsComponent = new NoPointsView();
  #routeInfoComponent = new RouteInfoView();
  #routeCostComponent = new RouteCostView();
  #menuNavComponent = new MenuNavView();

  #points = [];
  #renderedPointsCount = INITIAL_COUNT_OF_POINTS;

  constructor({
    tripEventsContainer,
    routeContainer,
    menuContainer,
    filtersContainer,
    pointsModel,
    newEventButton,
    filters
  }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#routeContainer = routeContainer;
    this.#menuContainer = menuContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#newEventButtonComponent = newEventButton;
    this.#filters = filters;

  }


  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderPoint(point) {
    // Функция-обработчик нажатия клавиши Escape
    const escKeyDownHandler = (evt) => {
      if (getIsEscape(evt)) {
        evt.preventDefault();
        replaceFormToWaypoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new WaypointView({
      point,
      onEditClick: () => {
        replaceWaypointToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditFormView({
      point,
      onFormSubmit: () => {
        replaceFormToWaypoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    // Функция, которая переводит точку маршрута в режим редактирования (открывается форма редактирования)
    function replaceWaypointToForm() {
      replace(pointEditComponent, pointComponent);
    }


    // Функция, которая переводит точку маршрута в режим редактирования (открывается форма редактирования)
    function replaceFormToWaypoint() {
      replace(pointComponent, pointEditComponent);
    }


    render(pointComponent, this.#tripEventsListComponent.element);
  }

  #renderPoints(from, to) {
    this.#points
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderPointsList() {
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#renderPoints(0, Math.min(this.#points.length, INITIAL_COUNT_OF_POINTS));
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
  #newEventButtonHandler = (evt) => {
    evt.preventDefault();
    this.#points
      .slice(this.#renderedPointsCount, this.#renderedPointsCount + POINT_COUNT_PER_STEP)
      .forEach((point) => this.#renderPoint(point));

    this.#renderedPointsCount += POINT_COUNT_PER_STEP;
  };

  #renderBoard() {
    this.#renderRouteWrapper();
    this.#renderRouteInfo();
    this.#renderRouteCost();
    this.#renderMenuNav();
    this.#renderMenuFilters();

    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();

    this.#newEventButtonComponent.addEventListener('click', this.#newEventButtonHandler);
  }
}

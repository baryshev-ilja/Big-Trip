import PointListMessageView from '../view/point-list-empty-message-view.js';
import PointListView from '../view/point-list-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import SortView from '../view/sort-view.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {sortTime, sortPrice, sortDay} from '../utils/waypoint.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorView from '../view/error-view.js';
import PointsApiService from '../api/points-api-service.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const AUTHORISATION = 'Basic 45h5hgk57dw0ght7450ekfe0';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip';

export default class GeneralPresenter {
  #listContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #sortComponent = null;
  #listMessageComponent = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #handleNewPointBtnAborting = null;
  #handleNewPointBtnSuccess = null;
  #pointsApiService = new PointsApiService(END_POINT, AUTHORISATION);

  constructor({listContainer, pointsModel, filterModel, onNewPointDestroy, newPointBtnAborting, newPointBtnSuccess}) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#handleNewPointBtnAborting = newPointBtnAborting;
    this.#handleNewPointBtnSuccess = newPointBtnSuccess;

    this.#newPointPresenter = new NewPointPresenter({
      pointsModel,
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });
  }

  get points() {
    const currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[currentFilterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
    }

    return filteredPoints;
  }

  init() {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  hideListMessage() {
    remove(this.#listMessageComponent);
  }

  showListMessage() {
    if (!this.#pointsModel.points.length) {
      this.#renderListMessage();
    }
  }

  destroy() {
    this.#clearBoard({resetSortType: true});
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  async checkOnline() {
    this.#uiBlocker.block();

    try {
      await this.#pointsApiService.isOnline();
      this.#handleNewPointBtnSuccess();
    } catch (err) {
      this.#handleNewPointBtnAborting();
    }

    this.#uiBlocker.unblock();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      pointsListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderListMessage() {
    this.#listMessageComponent = new PointListMessageView({
      filterType: this.#filterModel.filter
    });
    render(this.#listMessageComponent, this.#listComponent.element);
  }

  #renderLoadingMessage() {
    render(this.#loadingComponent, this.#listComponent.element);
  }

  #renderErrorMessage() {
    render(this.#errorComponent, this.#listComponent.element);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#listMessageComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    render(this.#listComponent, this.#listContainer);

    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }

    const points = this.points;

    if (!points.length && !this.#pointsModel.offers.length && !this.#pointsModel.destinations.length) {
      this.#renderErrorMessage();
      return;
    }

    if (points.length) {
      remove(this.#listMessageComponent);
      this.#renderSort();

      for (const point of points) {
        this.#renderPoint(point);
      }
    } else {
      this.#renderListMessage();
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#handleNewPointBtnAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };
}

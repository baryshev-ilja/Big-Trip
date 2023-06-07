import {render, replace} from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import {getIsEscape} from '../utils/common';

export default class PointPresenter {
  #pointsListContainer = null;
  #waypointComponent = null;
  #waypointEditComponent = null;
  #point = null;

  constructor({pointsListContainer}) {
    this.#pointsListContainer = pointsListContainer;
  }

  init(point) {
    this.#point = point;

    this.#waypointComponent = new WaypointView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
    });

    this.#waypointEditComponent = new EditFormView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
    });

    render(this.#waypointComponent, this.#pointsListContainer);
  }

  // Функция-обработчик нажатия клавиши Escape
  #escKeyDownHandler = (evt) => {
    if (getIsEscape(evt)) {
      evt.preventDefault();
      this.#replaceFormToWaypoint();
    }
  };

  // Метод, который переводит точку маршрута в режим редактирования (открывается форма редактирования)
  #replaceWaypointToForm() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }


  // Метод, который переводит точку маршрута в режим редактирования (открывается форма редактирования)
  #replaceFormToWaypoint() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditClick = () => {
    this.#replaceWaypointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToWaypoint();
  };
}

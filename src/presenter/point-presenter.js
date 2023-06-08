import {render, replace, remove} from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import {getIsEscape} from '../utils/common';

export default class PointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #waypointComponent = null;
  #waypointEditComponent = null;
  #point = null;

  constructor({pointsListContainer, onDataChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#waypointEditComponent = new EditFormView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
    });

    // console.log(`${count}-[2]`, 'prevWaypointComponent', prevWaypointComponent, 'this.#waypointComponent', this.#waypointComponent);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#pointsListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if(this.#pointsListContainer.contains(prevWaypointComponent.element)) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if(this.#pointsListContainer.contains(prevWaypointEditComponent.element)) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);

    // console.log(`${count}-[3]`, 'prevWaypointComponent', prevWaypointComponent, 'this.#waypointComponent', this.#waypointComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
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

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToWaypoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}

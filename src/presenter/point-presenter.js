import {render, replace, remove, RenderPosition} from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import {getIsEscape} from '../utils/common.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #waypointComponent = null;
  #waypointEditComponent = null;

  #point = null;
  #newPointId = null;
  #mode = Mode.DEFAULT;

  constructor({pointsListContainer, onDataChange, onModeChange}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }


  initNewEventForm() {

    // console.log(prevWaypointComponent);
    // Создается новый компонент точки маршрута. Но в него не передаются данные. А это значит, что в него
    // подставятся случайно сгенерированные данные (point = BLANK_POINT)
    this.#waypointComponent = new WaypointView({
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    // А сюда записывается весь этот объект с данными, который был создан при создании экземпляра
    // new WaypointView(). Он будет передаваться дальше, в компонент формы редактирования, как параметр point
    const pointDataForForm = this.#waypointComponent.getPointData();
    this.#point = pointDataForForm;

    // Чтобы узнать id по которому запишется данный Presenter (для дальнейшей обработки, и перерисовки этой точки
    // маршрута) в приватное поле класса записывается новый уникальный id, который генерируется при вызове данного
    // метода
    this.#newPointId = pointDataForForm.id;

    // Тут создается новый компонент формы редактирования точки. И уже он будет перерисован на страницу, вместо
    // обычной точки по умолчанию
    this.#waypointEditComponent = new EditFormView({
      point: pointDataForForm,
      onFormSubmit: this.#handleFormSubmit,
    });


    render(this.#waypointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    this.#replaceWaypointToForm();
  }


  getDataNewPoint() {
    return this.#point;
  }


  getIdNewPoint() {
    return this.#newPointId;
  }


  resetMode() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#waypointEditComponent.reset(this.#point);
      this.#replaceFormToWaypoint();
    }
  }


  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }


  // Функция-обработчик нажатия клавиши Escape
  #escKeyDownHandler = (evt) => {
    if (getIsEscape(evt)) {
      evt.preventDefault();
      this.#waypointEditComponent.reset(this.#point);
      this.#replaceFormToWaypoint();
    }
  };


  // Метод, который переводит точку маршрута в режим редактирования (открывается форма редактирования)
  #replaceWaypointToForm() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }


  // Метод, который переводит точку маршрута в режим редактирования (открывается форма редактирования)
  #replaceFormToWaypoint() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }


  #handleEditClick = () => {
    this.#replaceWaypointToForm();
  };


  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToWaypoint();
  };


  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };
}

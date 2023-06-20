import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate, DATE_FORMAT, TIME_FORMAT, hasOffers, differentDate} from '../utils/waypoint.js';
import {createRandomWaypoint} from '../mock/waypoint-mock.js';

let BLANK_POINT = createRandomWaypoint();

function createWaypointTemplate(point) {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type, city, cities} = point;
  const dateFromFormatted = humanizeDate(dateFrom, DATE_FORMAT);
  const timeFrom = humanizeDate(dateFrom, TIME_FORMAT);
  const timeTo = humanizeDate(dateTo, TIME_FORMAT);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';


  // Записывает в одну строчку все выбранные предложения (checked) для текущей точки маршрута
  const createOffersCheckedTemplate = (offersArray) => {
    const allInputChecked = offersArray.filter((item) => item.checked === true);

    return allInputChecked.map((item) => `<li class="event__offer">
      <span class="event__offer-title">${item.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
    </li>`)
      .join('');
  };


  // Записывает в переменную результат выполнения предыдущей функции. Затем вставляется в разметку как шаблон
  const offersCheckedTemplate = createOffersCheckedTemplate(offers);


  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${dateFromFormatted}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${city}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
                  </p>
                  <p class="event__duration">${differentDate(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>

                ${hasOffers(offers) ? `<h4 class="visually-hidden">Offers:</h4>
                  <ul class="event__selected-offers">${offersCheckedTemplate}</ul>` : ''}

                <button class="${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}

export default class WaypointView extends AbstractView {
  #point = null;

  // Сюда будет передаваться функция, которая будет вызываться в слушателе события
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point = BLANK_POINT, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    // Навешиваем на кнопку слушатель события Click
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointTemplate(this.#point);
  }

  getPointData() {
    BLANK_POINT = createRandomWaypoint();
    return BLANK_POINT;
  }

  // Функция-колбек, которая будет передаваться в слушатель события
  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}

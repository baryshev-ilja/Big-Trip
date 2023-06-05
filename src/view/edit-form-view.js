import AbstractView from '../framework/view/abstract-view.js';
import {createRandomWaypoint} from '../mock/waypoint-mock.js';
import {humanizeDate, EDIT_DATE_FORMAT, TIME_FORMAT, hasOffers} from '../utils.js';
import {Types} from '../const.js';


const BLANK_POINT = createRandomWaypoint();
const arrayWaypointTypes = Object.values(Types);


function createEditFormTemplate(data) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, city, cities} = data;


  // Функция, которая возвращает, заполненный данными, список типов точек маршрута. Затем результат функции
  // вставляется ниже, в разметку
  const returnWaypointTypes = (arrayTypes) => {
    let fieldset = '';

    arrayTypes.forEach((offerType) => {
      fieldset += `
      <div class="event__type-item">
         <input id="event-type-${offerType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offerType}">
         <label class="event__type-label  event__type-label--${offerType}" for="event-type-${offerType}-1">${offerType[0].toUpperCase()}${offerType.slice(1)}</label>
      </div>`;
    });
    return fieldset;
  };


  // Функция, которая возвращает, заполненный данными, список доступных опций для выбранного типа точки маршрута. Затем результат функции
  // вставляется ниже, в разметку
  const showOffers = () => {
    let offersArray = '';

    offers.forEach((item) => {
      offersArray += `
      <div class="event__offer-selector">
         <input class="event__offer-checkbox  visually-hidden"
         id="event-offer-${item.name}-${item.id}"
         type="checkbox"
         name="event-offer-${item.name}"
         ${item.checked ? 'checked' : ''}>
         <label class="event__offer-label" for="event-offer-${item.name}-${item.id}">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
         </label>
      </div>`;
    });
    return offersArray;
  };


  // Функция, которая возвращает, заполненный данными, список доступных городов для остановки. Затем результат функции
  // вставляется ниже, в разметку
  const returnCityValues = (values) => {
    let citiesArray = '';

    values.forEach((cityValue) => {
      citiesArray += `<option value="${cityValue}"></option>`;
    });
    return citiesArray;
  };


  // Функция, которая возвращает, заполненный данными, список изображений точки маршрута. Там, где планируется
  // остановиться. Затем результат функции вставляется ниже, в разметку
  const returnImages = (arr) => {
    let imagesArray = '';

    arr.pictures.forEach((item) => {
      imagesArray += `<img class="event__photo" src="${item.src}" alt="${item.description}">`;
    });
    return imagesArray;
  };


  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${returnWaypointTypes(arrayWaypointTypes)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type[0].toUpperCase()}${type.slice(1)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" placeholder="${city}" value="" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${returnCityValues(cities)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" placeholder="${humanizeDate(dateFrom, EDIT_DATE_FORMAT)} ${humanizeDate(dateFrom, TIME_FORMAT)}" value="">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" placeholder="${humanizeDate(dateTo, EDIT_DATE_FORMAT)} ${humanizeDate(dateTo, TIME_FORMAT)}" value="">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" placeholder="${basePrice}" value="">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>
                <section class="event__details">

                  ${hasOffers(offers) ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${showOffers()}
                    </div>
                  </section>` : ''}

                  ${destination ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.name} - ${destination.description.toLowerCase()}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${returnImages(destination)}
                      </div>
                    </div>
                  </section>` : ''}

                </section>
              </form>`;
}

export default class EditFormView extends AbstractView {
  #point = null;

  // Сюда будет передаваться функция, которая будет вызываться в слушателе события
  #handleFormSubmit = null;

  constructor({point = BLANK_POINT, onFormSubmit}) {
    super();
    this.#point = point;
    this.#handleFormSubmit = onFormSubmit;

    // Навешиваем на форму (это и есть первый родительский элемент - form) слушатель события Submit
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditFormTemplate(this.#point);
  }

  // Функция-колбек, которая будет передаваться в слушатель события
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}

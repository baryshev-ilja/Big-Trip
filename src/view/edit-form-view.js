import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {humanizeDate, EDIT_DATE_FORMAT, TIME_FORMAT, hasOffers} from '../utils/waypoint.js';
import {Types} from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const arrayWaypointTypes = Object.values(Types);

function createEditFormTemplate(data) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    city,
    cities,
    isInputCityChecked,
    prevCity,
    isPrice,
    isDateFrom,
    isDateTo,
    oldDateFrom,
    oldDateTo,
    newOffers,
  } = data;

  // const isPriceFalse = isPrice === false;
  // const isDateFromFalse = isDateFrom === false;
  // const isDateToFalse = isDateTo === false;

  // const isSubmitDisabled = (isPriceFalse || isDateFromFalse || isDateToFalse);

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

    newOffers.forEach((item) => {
      offersArray += `
      <div class="event__offer-selector">
         <input class="event__offer-checkbox  visually-hidden"
         id="event-offer-${item.name}-${item.id}"
         type="checkbox"
         name="event-offer-${item.name}"
         value="${item.name}"
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
                      ${type}
                    </label>
                    <input
                     class="event__input  event__input--destination"
                     id="event-destination-1"
                     type="text"
                     name="event-destination"
                     placeholder="${!isInputCityChecked ? `${prevCity}` : ''}"
                     value="${isInputCityChecked ? `${he.encode(city)}` : ''}"
                     list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${returnCityValues(cities)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input
                     class="event__input  event__input--time"
                     id="event-start-time-1"
                     type="text"
                     name="event-start-time"
                     placeholder="${isDateFrom ? '' : `${humanizeDate(oldDateFrom, EDIT_DATE_FORMAT)} ${humanizeDate(oldDateFrom, TIME_FORMAT)}`}"
                     value="${isDateFrom ? `${humanizeDate(dateFrom, EDIT_DATE_FORMAT)} ${humanizeDate(dateFrom, TIME_FORMAT)}` : ''}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input
                     class="event__input  event__input--time"
                     id="event-end-time-1"
                     type="text"
                     name="event-end-time"
                     placeholder="${isDateTo ? '' : `${humanizeDate(oldDateTo, EDIT_DATE_FORMAT)} ${humanizeDate(oldDateTo, TIME_FORMAT)}`}"
                     value="${isDateTo ? `${humanizeDate(dateTo, EDIT_DATE_FORMAT)} ${humanizeDate(dateTo, TIME_FORMAT)}` : ''}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input
                     class="event__input  event__input--price"
                     id="event-price-1"
                     type="text"
                     name="event-price"
                     placeholder=""
                     value="${isPrice ? `${basePrice}` : ''}">
                  </div>

                  <button
                     class="event__save-btn  btn  btn--blue"
                     type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>
                <section class="event__details">

                  ${hasOffers(newOffers) ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${showOffers()}
                    </div>
                  </section>` : ''}

                  ${isInputCityChecked ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${he.encode(city)} - ${destination.description.toLowerCase()}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${returnImages(destination)}
                      </div>
                    </div>
                  </section>` : ''}

                </section>
              </form>`;
}

export default class EditFormView extends AbstractStatefulView {
  #point = null;

  // Сюда будет передаваться функция, которая будет вызываться в слушателе события
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepickerDateFrom = null;
  #datepickerDateTo = null;
  #invalidSymbols = /[^0-9]/g;


  constructor({point, onFormSubmit, onDeleteClick}) {
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }


  get template() {
    return createEditFormTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerDateFrom) {
      this.#datepickerDateFrom.destroy();
      this.#datepickerDateFrom = null;
    }

    if (this.#datepickerDateTo) {
      this.#datepickerDateTo.destroy();
      this.#datepickerDateTo = null;
    }
  }


  reset(point) {
    this.updateElement(
      EditFormView.parsePointToState(point)
    );
  }


  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#inputCityChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#inputTypeChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#inputPriceInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#inputPriceChangeHandler);
    this.element.querySelector('#event-start-time-1').addEventListener('change', this.#inputDateFromChangeHandler);
    this.element.querySelector('#event-end-time-1').addEventListener('change', this.#inputDateToChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerClickHandler);
    }

    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  }


  #inputCityChangeHandler = (evt) => {
    if (evt.target.value) {
      this.updateElement({
        isInputCityChecked: true,
        city: evt.target.value,
      });
    } else {
      this.updateElement({
        isInputCityChecked: false,
      });
    }
  };


  #inputTypeChangeHandler = (evt) => {
    if (evt.target.className === 'event__type-input  visually-hidden') {
      const isChecked = this.element.querySelector('#event-type-toggle-1').checked;
      this.element.querySelector('#event-type-toggle-1').checked = !isChecked;

      this.updateElement({
        type: evt.target.value,
        newOffers: this._state.offers[evt.target.value],
      });

    }
  };


  #inputPriceInputHandler = (evt) => {
    evt.target.value = evt.target.value.replace(this.#invalidSymbols, '');
    he.encode(evt.target.value);
  };


  #inputPriceChangeHandler = (evt) => {
    if (evt.target.value) {
      this.updateElement({
        basePrice: evt.target.value,
        isPrice: true,
      });
    } else {
      this.updateElement({
        isPrice: false,
      });
    }
  };


  #inputDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
      isDateFrom: true,
    });
  };


  #inputDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
      isDateTo: true,
    });
  };


  #offerClickHandler = (evt) => {
    if (evt.target.className === 'event__offer-checkbox  visually-hidden') {

      const updateOffers = (checked, value) => {
        const isDesiredItem = this._state.newOffers.find((item) => item.name === value);
        isDesiredItem.checked = checked;
        return this._state.newOffers.map((item) => item.name === value ? isDesiredItem : item);
      };

      this.updateElement({
        newOffers: [...updateOffers(evt.target.checked, evt.target.value)]
      });
    }
  };

  #setDatepickerDateFrom() {
    this.#datepickerDateFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#inputDateFromChangeHandler,
      },
    );
  }

  #setDatepickerDateTo() {
    this.#datepickerDateTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#inputDateToChangeHandler,
      },
    );
  }


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToPoint(this._state));
  };


  static parsePointToState(point) {
    return {
      ...point,
      isInputCityChecked: false,
      prevCity: point.city,
      isDateFrom: false,
      isDateTo: false,
      isPrice: false,
      oldDateFrom: point.dateFrom,
      oldDateTo: point.dateTo,
      newOffers: point.offers[point.type],
    };
  }

  static parseStateToPoint(state) {
    const point = {
      ...state
    };

    delete point.isInputCityChecked;
    delete point.prevCity;
    delete point.isDateFrom;
    delete point.isDateTo;
    delete point.isPrice;
    delete point.oldDateFrom;
    delete point.oldDateTo;
    delete point.newOffers;

    return point;
  }
}

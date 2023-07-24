import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {validatePriceField} from '../utils/waypoint.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';
import dayjs from 'dayjs';

const DefaultPointData = {
  DATE_FROM: dayjs().toISOString(),
  DATE_TO: dayjs().add(30, 'minutes').toISOString(),
  TYPE: 'ship',
};

const BLANK_POINT = {
  basePrice: '',
  dateFrom: DefaultPointData.DATE_FROM,
  dateTo: DefaultPointData.DATE_TO,
  destination: '',
  isFavorite: false,
  offers: [],
  type: DefaultPointData.TYPE,
};

function createEditPointTemplate(point, offersByType, destinations) {
  const {type, dateFrom, dateTo, basePrice, destination, offers, isDisabled, isSaving, isDeleting} = point;

  const isNewPoint = !point.id;
  const isSubmitDisabled = destination && basePrice;
  const submitBtnText = isSaving ? 'Saving...' : 'Save';
  const deleteBtnText = isDeleting ? 'Deleting...' : 'Delete';
  const resetBtnText = isNewPoint ? 'Cancel' : deleteBtnText;

  const parsDateFrom = dayjs(dateFrom);
  const parsDateTo = dayjs(dateTo);

  const pointTypeOffer = offersByType.find((offer) => offer.type === type);
  const pointDestination = destinations.find((appointment) => destination === appointment.id);

  const destinationOptionsTemplate = destinations.map((element) => `<option value="${he.encode(element.name)}"></option>`).join('');

  const typeOptionsTemplate = offersByType.map((offer) => `
      <div class="event__type-item">
         <input
         id="event-type-${he.encode(offer.type)}-1"
         class="event__type-input  visually-hidden"
         type="radio"
         name="event-type"
         value="${he.encode(offer.type)}"
         ${offer.type === type ? 'checked' : ''}>
         <label
         class="event__type-label  event__type-label--${he.encode(offer.type)}"
         for="event-type-${he.encode(offer.type)}-1">${offer.type[0].toUpperCase()}${offer.type.slice(1)}</label>
      </div>`).join('');

  const createOffersTemplate = () => {
    if (!pointTypeOffer.offers.length) {
      return '';
    }

    return `
    <section class="event__section  event__section--offers">
         <h3 class="event__section-title  event__section-title--offers">Offers</h3>
         <div class="event__available-offers">
         ${pointTypeOffer.offers.map((offer) => `
            <div class="event__offer-selector">
               <input class="event__offer-checkbox  visually-hidden"
               id="event-offer-${he.encode(offer.title)}-${he.encode(String(offer.id))}"
               type="checkbox"
               name="event-offer-${he.encode(offer.title)}"
               data-offer-id="${he.encode(String(offer.id))}"
               ${offers.includes(offer.id) ? 'checked' : ''}>
               <label
               class="event__offer-label"
               for="event-offer-${he.encode(offer.title)}-${he.encode(String(offer.id))}">
                  <span class="event__offer-title">${he.encode(offer.title)}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${he.encode(String(offer.price))}</span>
               </label>
            </div>`).join('')}
         </div>
    </section>`;
  };

  const createPointDestinationTemplate = () => {
    if (!pointDestination) {
      return '';
    }

    return `
    <section class="event__section  event__section--destination">
         <h3 class="event__section-title  event__section-title--destination">Destination</h3>
         <p class="event__destination-description">${he.encode(pointDestination.description)}</p>
         <div class="event__photos-container">
               <div class="event__photos-tape">
               ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}">`).join('')}
               </div>
         </div>
    </section>`;
  };

  const createRollupBtn = () => isNewPoint ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typeOptionsTemplate}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${he.encode(type)}
                    </label>
                    <input
                     class="event__input  event__input--destination"
                     id="event-destination-1"
                     type="text"
                     name="event-destination"
                     value="${pointDestination ? `${he.encode(pointDestination.name)}` : ''}"
                     list="destination-list-1"
                     required>
                    <datalist id="destination-list-1">
                      ${destinationOptionsTemplate}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input
                     class="event__input  event__input--time"
                     id="event-start-time-1"
                     type="text"
                     name="event-start-time"
                     value="${parsDateFrom.format('DD/MM/YY HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input
                     class="event__input  event__input--time"
                     id="event-end-time-1"
                     type="text"
                     name="event-end-time"
                     value="${parsDateTo.format('DD/MM/YY HH:mm')}">
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
                     required
                     value="${basePrice ? `${he.encode(String(basePrice))}` : 0}">
                  </div>

                  <button
                  class="event__save-btn  btn  btn--blue"
                  type="submit"
                  ${isSubmitDisabled || isDisabled ? '' : 'disabled'}>${submitBtnText}</button>

                  <button
                  class="event__reset-btn"
                  type="reset"
                  ${isDisabled ? 'disabled' : ''}>${resetBtnText}</button>

                  ${createRollupBtn()}

                </header>
                <section class="event__details">
                     ${createOffersTemplate()}
                     ${createPointDestinationTemplate()}
                </section>
            </form>
         </li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #offersByType = null;
  #destinations = null;

  #handleFormSubmit = null;
  #handleResetButtonClick = null;
  #handleRollupButtonClick = null;
  #datepickerDateFrom = null;
  #datepickerDateTo = null;

  #invalidSymbols = /[^0-9]/g;

  constructor({
    point = BLANK_POINT,
    offersByType,
    destinations,
    onFormSubmit,
    onResetButtonClick,
    onRollupButtonClick,
  }) {
    super();

    this._setState(EditPointView.parsePointToState(point));
    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetButtonClick = onResetButtonClick;
    this.#handleRollupButtonClick = onRollupButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offersByType, this.#destinations);
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
    this.updateElement(EditPointView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeToggleHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationToggleHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputHandler);

    this.element.querySelectorAll('.event__offer-selector input')
      .forEach((offer) => offer.addEventListener('change', this.#offersChangeHandler));

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupButtonClickHandler);
    }

    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  }

  #setDatepickerDateFrom() {
    this.#datepickerDateFrom = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#dateFromChangeHandler,
      },
    );
  }

  #setDatepickerDateTo() {
    this.#datepickerDateTo = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#dateToChangeHandler,
      },
    );
  }

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #eventDestinationToggleHandler = (evt) => {
    evt.preventDefault();

    let selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);
    if (!selectedDestination) {
      selectedDestination = '';
    }

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: validatePriceField(evt.target.value)
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    evt.target.toggleAttribute('checked');

    let selectedOffers = this._state.offers;

    if (evt.target.hasAttribute('checked')) {
      selectedOffers.push(+(evt.target.dataset.offerId));
    } else {
      selectedOffers = selectedOffers.filter((id) => id !== +(evt.target.dataset.offerId));
    }

    this._setState({
      offers: selectedOffers
    });
  };

  #dateFromChangeHandler = ([dateFrom]) => {
    this._setState({
      dateFrom: dateFrom,
    });
    this.#setDatepickerDateTo();
  };

  #dateToChangeHandler = ([dateTo]) => {
    this._setState({
      dateTo: dateTo,
    });
    this.#setDatepickerDateFrom();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetButtonClick(EditPointView.parseStateToPoint(this._state));
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}

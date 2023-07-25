import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';

dayjs.extend(Duration);

const DATE_FORMAT = 'DD MMM';
const TIME_FORMAT = 'HH:mm';
const MILLISECONDS_AMOUNT_IN_HOUR = 3600000;
const MILLISECONDS_AMOUNT_IN_DAY = 86400000;

function createPointTemplate(point, offersByType, destinations) {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = point;

  const parsDateTo = dayjs(dateTo);
  const parsDateFrom = dayjs(dateFrom);

  const pointTypeOffer = offersByType.find((offer) => offer.type === type);
  const pointDestination = destinations.find((appointment) => destination === appointment.id);

  const createOffersTemplate = () => {
    if (!pointTypeOffer) {
      return '';
    }

    return pointTypeOffer.offers
      .filter((offer) => offers.includes(offer.id))
      .map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${he.encode(offer.title)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${he.encode(String(offer.price))}</span>
    </li>`)
      .join('');
  };

  const getEventDuration = (from, to) => {
    const eventDuration = to.diff(from);
    let durationFormat = 'DD[D] HH[H] mm[M]';

    if (eventDuration < MILLISECONDS_AMOUNT_IN_DAY) {
      durationFormat = 'HH[H] mm[M]';
    }

    if (eventDuration < MILLISECONDS_AMOUNT_IN_HOUR) {
      durationFormat = 'mm[M]';
    }

    return dayjs.duration(eventDuration).format(durationFormat);
  };

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${parsDateFrom.format(DATE_FORMAT)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${he.encode(type)} ${pointDestination ? he.encode(pointDestination.name) : ''}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${parsDateFrom.format(TIME_FORMAT)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${parsDateTo.format(TIME_FORMAT)}</time>
                  </p>
                  <p class="event__duration">${getEventDuration(parsDateFrom, parsDateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
                </p>

                <h4 class="visually-hidden">Offers:</h4>
                  <ul class="event__selected-offers">${createOffersTemplate()}</ul>

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

export default class PointView extends AbstractView {
  #point = null;
  #offersByType = null;
  #destinations = null;

  #handleRollupButtonClick = null;
  #handleFavoriteClick = null;

  constructor({point, offersByType, destinations, onRollupButtonClick, onFavoriteClick}) {
    super();

    this.#point = point;
    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleFavoriteClick = onFavoriteClick;

    // Навешиваем на кнопку слушатель события Click
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offersByType, this.#destinations);
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };


  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}

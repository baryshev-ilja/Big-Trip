import TripInfoView from '../view/trip-info-view.js';
import {remove, render, RenderPosition, replace} from '../framework/render.js';
import {sortDay} from '../utils/waypoint.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;

  #tripInfoComponent = null;

  constructor({tripInfoContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.points.sort(sortDay);
    const offers = this.#pointsModel.offers;
    const destinations = this.#pointsModel.destinations;

    const prevInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView({
      points: points,
      offersByType: offers,
      destinations: destinations,
    });

    if (prevInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  #handleModelEvent = () => this.init();
}

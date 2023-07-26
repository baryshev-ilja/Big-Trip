import ApiService from '../framework/api-service.js';

const Method = {
  HEAD: 'HEAD',
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const DataUrl = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: DataUrl.POINTS})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: DataUrl.OFFERS})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: DataUrl.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: DataUrl.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${DataUrl.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  async isOnline() {
    const response = await this._load({
      url: `${DataUrl.POINTS}`,
      method: Method.HEAD,
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': +point.basePrice,
      'date_from': new Date(point.dateFrom).toISOString(),
      'date_to': new Date(point.dateTo).toISOString(),
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}

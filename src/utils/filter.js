import {FilterType} from '../const.js';
import {isEventExpired, isEventInFuture} from './waypoint.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isEventExpired(point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventInFuture(point.dateFrom)),
};

export {filter};

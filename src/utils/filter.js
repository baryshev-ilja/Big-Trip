import {FilterType} from '../const.js';
import {isEventExpired, isEventInFuture} from './waypoint.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isEventExpired(point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventInFuture(point.dateFrom)),
};

export {filter};

// import dayjs from 'dayjs';
// const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
// dayjs.extend(isSameOrAfter);
//
//
// const datePast = dayjs('2023-06-05');
// const dateFuture = dayjs('2023-06-06');
//
// const isFuture = dayjs(dateFuture).isSameOrAfter(dayjs(), 'D');
// const isPast = dayjs().isAfter(datePast, 'D');
//
// console.log(isFuture);
// console.log(isPast);

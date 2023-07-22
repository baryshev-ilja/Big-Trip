const Types = {
  'TAXI': 'taxi',
  'BUS': 'bus',
  'TRAIN': 'train',
  'SHIP': 'ship',
  'DRIVE': 'drive',
  'FLIGHT': 'flight',
  'CHECKIN': 'check-in',
  'SIGHTSEEING': 'sightseeing',
  'RESTAURANT': 'restaurant',
};

const CITIES = [
  'Yerevan',
  'Baku',
  'Dhaka',
  'Minsk',
  'Sarajevo',
  'Sofia',
  'Zagreb',
  'Prague',
  'Copenhagen',
  'Roseau',
  'Cairo',
  'Malabo',
  'Tallinn',
  'Helsinki',
  'Tbilisi',
  'Berlin',
  'Budapest',
  'Baghdad',
  'Tehran',
  'Jerusalem',
  'Astana',
  'Luxembourg',
  'Belgrade',
  'Moscow',
  'Oslo',
  'Bratislava',
  'Bern',
  'Tashkent',
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

const BackgroundColorChart = {
  taxi: 'rgba(255, 179, 25, 0.7)',
  bus: 'rgba(249, 132, 4, 0.7)',
  train: 'rgba(246, 174, 153, 0.7)',
  ship: 'rgba(61, 178, 255, 0.7)',
  drive: 'rgba(18, 93, 152, 0.7)',
  flight: 'rgba(57, 162, 219, 0.7)',
  ['check-in']: 'rgba(222, 186, 157, 0.7)',
  sightseeing: 'rgba(121, 180, 183, 0.7)',
  restaurant: 'rgba(191, 216, 184, 0.7)',
};

export {
  Types,
  CITIES,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  MenuItem,
  BackgroundColorChart
};

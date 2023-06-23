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
};

export {Types, CITIES, FilterType, SortType, UserAction, UpdateType};

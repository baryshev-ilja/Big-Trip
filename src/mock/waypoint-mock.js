import dayjs from 'dayjs';
import {createDestinationTemplate} from './destinations-mock.js';
import {offersByType} from './offers-mock.js';
import {Types, CITIES} from '../const.js';
import {getRandomPositiveInteger, getRandomArrayElement, generateDateFrom, generateDateTo} from '../utils.js';

// Коллекция уникальных городов
const arrayUniqOfCities = new Set();

// Массив из пар [ключ - значение], созданный из объекта, где прописаны типы точки маршрута
const arrayTypesOfWaypoints = Object.entries(Types);

function createWaypointTemplate() {
  const typeInfo = getRandomArrayElement(arrayTypesOfWaypoints);
  let city;

  // Цикл выбирающий город, который еще не использовался. Записывает его в переменную city
  while (true) {
    const cityElement = getRandomArrayElement(CITIES);

    // Если в коллекции уникальных городов нет выбранного, тогда записывает его в эту коллекцию и переменную city
    if (!arrayUniqOfCities.has(cityElement)) {
      arrayUniqOfCities.add(cityElement);
      city = cityElement;
      break;
    }
  }

  let dateFrom = generateDateFrom(7);
  const dateTo = generateDateTo(dateFrom);
  dateFrom = dayjs(dateFrom).format('DD/MM/YYYY HH:MM');

  return {
    'base_price': getRandomPositiveInteger(100, 467),
    'date_from': dateFrom,
    'date_to': dateTo,
    'destination': createDestinationTemplate(city),
    'isFavorite': Boolean(getRandomPositiveInteger(0, 1)),
    'offers': offersByType[typeInfo[1]],
    'type': Types[typeInfo[0]],
  };
}

export {createWaypointTemplate};

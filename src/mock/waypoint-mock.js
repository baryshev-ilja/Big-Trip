import {createDestinationTemplate} from './destinations-mock.js';
import {offersByType} from './offers-mock.js';
import {Types, CITIES} from '../const.js';
import {getRandomPositiveInteger, getRandomArrayElement, generateDateFrom, generateDateTo} from '../utils.js';

// Коллекция уникальных городов
const arrayUniqOfCities = new Set();

// Массив из пар [ключ - значение], созданный из объекта, где прописаны типы точки маршрута
const arrayTypesOfWaypoints = Object.entries(Types);

function createRandomWaypoint() {
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

  const dateFrom = generateDateFrom(7);
  const dateTo = generateDateTo(dateFrom);

  return {
    basePrice: getRandomPositiveInteger(100, 467),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: createDestinationTemplate(city),
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    offers: offersByType[typeInfo[1]],
    type: Types[typeInfo[0]],
  };
}

export {createRandomWaypoint};

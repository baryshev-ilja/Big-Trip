import {createDestinationTemplate} from './destinations-mock.js';
import {offersByType} from './offers-mock.js';
import {Types, CITIES} from '../const.js';
import { generateDateFrom, generateDateTo} from '../utils/mock.js';
import {getRandomPositiveInteger, getRandomArrayElement} from '../utils/common.js';
import {nanoid} from 'nanoid';

// Коллекция уникальных городов
const arrayUniqOfCities = new Set();


// Массив из пар [ключ - значение], созданный из объекта, где прописаны типы точки маршрута
const arrayTypesOfWaypoints = Object.entries(Types);


// Функция, которая генерирует объект со случайными данными для точки маршрута
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
    id: nanoid(),
    basePrice: getRandomPositiveInteger(100, 467),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: createDestinationTemplate(),
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    offers: offersByType,
    type: Types[typeInfo[0]],
    city,
    cities: CITIES,
  };
}

export {createRandomWaypoint};

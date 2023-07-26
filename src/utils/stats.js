import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);


// Функция, которая вычитает разницу во времени между датами (в миллисекундах)
const getDiff = (point) => {
  const {dateFrom, dateTo} = point;
  return dayjs(dateTo).diff(dateFrom);
};


// Функция, которая преобразует длительность в человеко-понятный формат
const getHumanizedTimeDiff = (diff) => {
  const eventDuration = dayjs.duration(diff);
  let dateFormat = 'mm[M]';

  if (eventDuration.asDays() >= 1) {
    dateFormat = 'DD[D] HH[H] mm[M]';
  } else if (eventDuration.asHours() >= 1) {
    dateFormat = 'HH[H] mm[M]';
  }

  if (eventDuration.asDays() >= 30) {
    return '> 30D';
  }
  return eventDuration.format(`${dateFormat}`);
};


// Функция, которая возвращает коллекцию уникальных типов точек маршрута
const getUniqueTypes = (points) => {
  const uniqueTypes = new Set();
  points.forEach((point) => uniqueTypes.add(point.type));
  return uniqueTypes;
};


// Функция, которая возвращает массив из точек маршрута одного типа (например taxi)
const getPointsByType = (points, type) => points.filter((point) => point.type === type);


// Функция, которая создает новую коллекцию Map, на основе этой же коллекции,
// но только сначала сортирует её по убыванию
const sortMapByValueDown = (map) => new Map([...map.entries()].sort((a, b) => b[1] - a[1]));


// Функция, которая возвращает стоимость всех точек маршрута в одном типе
// (например стоимость всех точек с типом taxi)

const getTotalPriceOfType = (points, type) => {
  const pointsByType = getPointsByType(points, type);
  return pointsByType.reduce((initialPrice, currentPoint) => (initialPrice + currentPoint.basePrice), 0);
};


// Функция, которая суммирует все время всех точек в ОДНОМ типе (например taxi = 34698021345).
// Записывает всю сумму в миллисекундах

const getTotalDurationOfType = (points, type) => {
  const pointsByType = getPointsByType(points, type);

  const totalDuration = pointsByType.reduce((initialDuration, currentPoint) =>
    initialDuration + getDiff(currentPoint), 0);

  return totalDuration;
};


// Функция, которая возвращает отсортированную коллекцию
// общей стоимости всех точек в КАЖДОМ типе
//
// например {taxi: 3456, ship: 786, train: 341}

const getPriceForAllTypes = (points) => {
  const uniqueTypes = getUniqueTypes(points);
  const priceForAllTypes = new Map();

  uniqueTypes.forEach((type) => priceForAllTypes
    .set(type, getTotalPriceOfType(points, type)));

  // console.log(sortMapByValueDown(priceForAllTypes));
  return sortMapByValueDown(priceForAllTypes);
};


// Функция, которая возвращает отсортированную коллекцию
// общего количества всех точек в КАЖДОМ типе
//
// например {taxi: 6, ship: 4, train: 1}

const getTotalCountPointsOfType = (points) => {
  const uniqueTypes = getUniqueTypes(points);
  const totalCountPointsOfTypes = new Map();

  uniqueTypes.forEach((type) => totalCountPointsOfTypes
    .set(type, getPointsByType(points, type).length));

  return sortMapByValueDown(totalCountPointsOfTypes);
};


// Функция, которая возвращает отсортированную коллекцию
// общего количества времени всех точек в КАЖДОМ типе
//
// например {taxi: 645639458745, ship: 42456456345635, train: 134564563456345}

const getDurationForAllTypes = (points) => {
  const uniqueTypes = getUniqueTypes(points);
  const durationForAllTypes = new Map();

  uniqueTypes.forEach((type) => durationForAllTypes
    .set(type, getTotalDurationOfType(points, type)));

  return sortMapByValueDown(durationForAllTypes);
};

export {
  getHumanizedTimeDiff,
  getPriceForAllTypes,
  getTotalCountPointsOfType,
  getDurationForAllTypes
};

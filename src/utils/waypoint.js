import dayjs from 'dayjs';
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);


const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const EDIT_DATE_FORMAT = 'DD/MM/YY';
const MILLISECONDS_AMOUNT_IN_HOUR = 3600000;
const MILLISECONDS_AMOUNT_IN_DAY = 86400000;


// Функция для конвертации времени в человеко-понятный формат
const humanizeDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';


// Функция проверяет, просрочена ли дата события или нет
function isEventExpired(dueDate) {
  return dayjs().isAfter(dueDate, 'D');
}


// Функция, которая проверяет - текущая дата равна или находится раньше даты начала события
function isEventInFuture(dueDate) {
  return dayjs(dueDate).isSameOrAfter(dayjs(), 'D');
}


// Функция вернет true если в массиве с предложениями есть хотя-бы одно предложение
const hasOffers = (offers) => offers.length > 0;


// Функция-преобразователь. Если число состоит из одного символа "х" => переводит его в формат "0х"
const convertToTwoDigitSystem = (data) => {
  const convertedData = String(data);
  return (convertedData.length < 2) ? `0${convertedData}` : `${convertedData}`;
};


// Функция для получения разницы (в минутах) между датой выезда и заезда. Преобразовывает в человеко-понятный вид
const getNumberOfMinutes = (from, to) => {
  let result;

  if (to > from) {
    result = String(to - from);
  } else if (to < from) {
    const positiveNumber = Math.abs(to - from);
    result = String(60 - positiveNumber);
  } else if (to === from) {
    return '00';
  }

  return (result.length < 2) ? `0${result}` : `${result}`;
};


// Функция, которая высчитывает разницу между датой выезда и заезда. В зависимости от полученного результата
// возвращает разные строчки (String) результата
function differentDate(dateFrom, dateTo) {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);

  const date1Minute = dayjs(date1).format('mm');
  const date2Minute = dayjs(date2).format('mm');

  const dayResult = date2.diff(date1, 'day');
  const hourResult = date2.diff(date1, 'hour');

  if (dayResult) {
    const dayFormatted = convertToTwoDigitSystem(dayResult);
    const hourFormatted = convertToTwoDigitSystem((Math.round((hourResult / dayResult) - 24)));

    return `${dayFormatted}D ${hourFormatted}H ${getNumberOfMinutes(date1Minute, date2Minute)}M`;
  } else if (hourResult) {
    return `${convertToTwoDigitSystem(hourResult)}H ${getNumberOfMinutes(date1Minute, date2Minute)}M`;
  } else {
    return `${getNumberOfMinutes(date1Minute, date2Minute)}M`;
  }
}


// Функция для сортировки по цене
function sortPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}


// Функция для сортировки по времени
function sortTime(pointA, pointB) {
  const {dateFrom: dateFromA, dateTo: dateToA} = pointA;
  const {dateFrom: dateFromB, dateTo: dateToB} = pointB;

  const totalAmountOfTimeA = dayjs(dateToA).diff(dayjs(dateFromA));
  const totalAmountOfTimeB = dayjs(dateToB).diff(dayjs(dateFromB));

  return totalAmountOfTimeB - totalAmountOfTimeA;
}


// Функция для сортировки по дням
function sortDay(pointA, pointB) {
  const {dateFrom: dateFromA} = pointA;
  const {dateFrom: dateFromB} = pointB;
  return dayjs(dateFromA).diff(dayjs(dateFromB));
}

const PRICE_FIELD_PATTERN = /\D+/;

const validatePriceField = (value) => {
  if (PRICE_FIELD_PATTERN.test(value)) {
    value = 0;
  }
  return +value;
};


export {
  humanizeDate,
  isEventExpired,
  isEventInFuture,
  DATE_FORMAT,
  EDIT_DATE_FORMAT,
  TIME_FORMAT,
  MILLISECONDS_AMOUNT_IN_HOUR,
  MILLISECONDS_AMOUNT_IN_DAY,
  hasOffers,
  differentDate,
  sortTime,
  sortPrice,
  sortDay,
  validatePriceField
};

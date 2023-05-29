import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:MM';
const EDIT_DATE_FORMAT = 'DD/MM/YYYY';

// Функция, которая возвращает случайный элемент из переданного массива
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];


// Функция, которая возвращает целое положительное число из заданного диапазона
const getRandomPositiveInteger = (first, second) => {
  const lower = Math.ceil(Math.min(Math.abs(first), Math.abs(second)));
  const upper = Math.floor(Math.max(Math.abs(first), Math.abs(second)));
  return Math.floor( lower + Math.random() * (upper - lower + 1));
};


// Функция, которая возвращает массив с рандомным количеством УНИКАЛЬНЫХ элементов
const createArrayOfElements = (a, b, arr) => {
  const arrayUniqElements = new Set();
  const amount = getRandomPositiveInteger(a, b);

  while (arrayUniqElements.size < amount) {
    arrayUniqElements.add(getRandomArrayElement(arr));
  }
  return Array.from(arrayUniqElements);
};


// Функция для конвертации времени в человеко-понятный формат
const humanizeDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';


// Функция вернет true если в массиве с предложениями есть хотя-бы одно предложение
const hasOffers = (offers) => offers.length > 0;


// Функция, которая создает случайную дату заезда, в допустимом промежутке времени
const generateDateFrom = (gap = 7) => {
  // Определяет, будет ли число отрицательным или положительным
  const isPositiveSign = Boolean(getRandomPositiveInteger(0, 1));

  // Определяет шаг даты. На сколько дней будет увеличиваться или уменьшаться дата
  let daysGap = getRandomPositiveInteger(1, gap);

  // Если число должно быть отрицательным, то делает шаг даты отрицательным (будет откат назад по дате)
  if (isPositiveSign) {
    daysGap = -daysGap;
  }

  // Назначает дату заезда, в зависимости от шага (вперед или назад). Рассчитывается от текущей даты
  return dayjs().add(daysGap, 'day').toDate();
};


// Функция, которая создает дату выезда (обязательно создает дату больше текущей, или же точно такую же)
const generateDateTo = (date) => {
  // Назначает дату выезда. Выбирается случайное число и прибавляется к дате заезда
  const dayToGap = getRandomPositiveInteger(0, 3);
  return dayjs(date).add(dayToGap, 'day').toDate();
};


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


export {
  getRandomArrayElement,
  getRandomPositiveInteger,
  createArrayOfElements,
  generateDateFrom,
  generateDateTo,
  humanizeDate,
  DATE_FORMAT,
  EDIT_DATE_FORMAT,
  TIME_FORMAT,
  hasOffers,
  differentDate
};

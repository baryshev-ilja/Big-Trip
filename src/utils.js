import dayjs from 'dayjs';

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


const generateDateTo = (date) => {
  // Назначает дату выезда. Выбирается случайное число и прибавляется к дате заезда
  const dayToGap = getRandomPositiveInteger(0, 3);
  return dayjs(date).add(dayToGap, 'day').format('DD/MM/YYYY HH:MM');
};


export {
  getRandomArrayElement,
  getRandomPositiveInteger,
  createArrayOfElements,
  generateDateFrom,
  generateDateTo
};

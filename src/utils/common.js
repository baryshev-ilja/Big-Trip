// Функция, которая возвращает случайный элемент из переданного массива
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];


// Функция, которая возвращает целое положительное число из заданного диапазона
const getRandomPositiveInteger = (first, second) => {
  const lower = Math.ceil(Math.min(Math.abs(first), Math.abs(second)));
  const upper = Math.floor(Math.max(Math.abs(first), Math.abs(second)));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


// Функция для проверки клавиши Escape
const getIsEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  getRandomPositiveInteger,
  getRandomArrayElement,
  getIsEscape
};

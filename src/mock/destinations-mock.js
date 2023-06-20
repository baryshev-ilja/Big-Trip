import {getRandomPositiveInteger, getRandomArrayElement} from '../utils/common.js';
import {createArrayOfElements} from '../utils/mock.js';

const descriptionMock = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Pellentesque lacinia feugiat rhoncus.',
  'Maecenas maximus nisi ligula, non sodales nulla aliquam sit amet.',
  'Morbi suscipit, metus non aliquet mollis, ex tellus aliquam arcu, dapibus euismod nisi diam luctus odio.',
  'Suspendisse non velit vestibulum, dignissim augue ac, fringilla lorem.',
  'Nunc tortor neque, rutrum vitae rhoncus sed, blandit vel tellus.',
  'Aenean orci nisi, sollicitudin sit amet convallis ut, ullamcorper vitae neque.',
  'Phasellus in ante ut risus porttitor convallis.',
  'Mauris vel lobortis magna.',
  'Curabitur enim lectus, auctor nec porta ac, ornare sed lacus.',
  'Suspendisse in imperdiet mauris.',
  'In pellentesque imperdiet quam quis facilisis.',
  'Curabitur dictum interdum leo, eget feugiat metus consectetur ut.',
  'Vestibulum hendrerit orci pharetra vestibulum malesuada.',
  'Praesent pellentesque fringilla aliquam.',
  'Vivamus pretium nunc nec magna blandit, eget vestibulum nisi pharetra.',
  'Aliquam accumsan tincidunt tristique.',
];


// Функция, которая генерирует случайное количество объектов с фотографиями
const createPictureDescription = (a, b,) => {
  const arrayPictureObj = [];
  const amount = getRandomPositiveInteger(a, b);

  for (let i = 1; i < amount; i++) {
    const pictureObj = {
      'src': `https://loremflickr.com/248/152?random=${getRandomPositiveInteger(1, 234)}`,
      'description': `${getRandomArrayElement(descriptionMock).toLowerCase()}`,
    };
    arrayPictureObj.push(pictureObj);
  }

  return arrayPictureObj;
};


// Функция, которая возвращает объект с описанием города и его фотографиями
function createDestinationTemplate() {
  return {
    'description': createArrayOfElements(1, 5, descriptionMock).join(' '),
    // 'name': city,
    'pictures': createPictureDescription(1, 6),
  };
}

export {createDestinationTemplate};

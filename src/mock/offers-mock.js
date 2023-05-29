import {Types} from '../const.js';

const offersByType = {
  [Types.TAXI]: [
    {
      'title': 'Upgrade to a economy class',
      'price': 50,
    },
    {
      'title': 'Upgrade to a comfort class',
      'price': 120,
    },
    {
      'title': 'Upgrade to a business class',
      'price': 150,
    },
  ],
  [Types.BUS]: [
    {
      'title': 'sit forward',
      'price': 55,
    },
    {
      'title': 'pick up from the entrance',
      'price': 100,
    },
    {
      'title': 'express bus',
      'price': 155,
    },
  ],
  [Types.TRAIN]: [
    {
      'title': 'lower place',
      'price': 45,
    },
    {
      'title': 'Three meals a day',
      'price': 130,
    },
    {
      'title': 'coupe',
      'price': 550,
    },
  ],
  [Types.SHIP]: [
    {
      'title': 'luxury yacht',
      'price': 14500,
    },
    {
      'title': 'fishing from the board',
      'price': 630,
    },
    {
      'title': 'room with shower',
      'price': 1000,
    },
  ],
  [Types.DRIVE]: [
    {
      'title': 'cabriolet',
      'price': 2500,
    },
    {
      'title': 'crossover',
      'price': 2900,
    },
    {
      'title': 'budget class',
      'price': 200,
    },
  ],
  [Types.FLIGHT]: [
    {
      'title': 'Upgrade to a comfort class',
      'price': 520,
    },
    {
      'title': 'Upgrade to a business class',
      'price': 850,
    },
  ],
  [Types.CHECKIN]: [
    {
      'title': 'bar for drinks in the room',
      'price': 500,
    },
    {
      'title': 'deluxe room for two',
      'price': 2500,
    },
    {
      'title': 'wedding number',
      'price': 3500,
    },
  ],
  [Types.SIGHTSEEING]: [
    {
      'title': 'bicycle for walking',
      'price': 200,
    },
    {
      'title': 'personal guide',
      'price': 800,
    },
    {
      'title': 'group guide',
      'price': 500,
    },
  ],
  [Types.RESTAURANT]: [],
};

export {offersByType};

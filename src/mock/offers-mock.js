import {Types} from '../const.js';

const offersByType = {
  [Types.TAXI]: [
    {
      'id': 1,
      'name': 'economy',
      'title': 'Upgrade to a economy class',
      'price': 50,
      'checked': false,
    },
    {
      'id': 2,
      'name': 'comfort',
      'title': 'Upgrade to a comfort class',
      'price': 120,
      'checked': true,
    },
    {
      'id': 3,
      'name': 'business',
      'title': 'Upgrade to a business class',
      'price': 150,
      'checked': false,
    },
  ],

  [Types.BUS]: [
    {
      'id': 1,
      'name': 'forward',
      'title': 'Sit forward',
      'price': 55,
      'checked': true,
    },
    {
      'id': 2,
      'name': 'entrance',
      'title': 'Pick up from the entrance',
      'price': 100,
      'checked': false,
    },
    {
      'id': 3,
      'name': 'express',
      'title': 'Express bus',
      'price': 155,
      'checked': true,
    },
  ],

  [Types.TRAIN]: [
    {
      'id': 1,
      'name': 'lower',
      'title': 'Lower place',
      'price': 45,
      'checked': false,
    },
    {
      'id': 2,
      'name': 'meals',
      'title': 'Three meals a day',
      'price': 130,
      'checked': false,
    },
    {
      'id': 3,
      'name': 'coupe',
      'title': 'Coupe',
      'price': 550,
      'checked': false,
    },
  ],

  [Types.SHIP]: [
    {
      'id': 1,
      'name': 'luxury',
      'title': 'Luxury yacht',
      'price': 14500,
      'checked': true,
    },
    {
      'id': 2,
      'name': 'fishing',
      'title': 'Fishing from the board',
      'price': 630,
      'checked': false,
    },
    {
      'id': 3,
      'name': 'shower',
      'title': 'Room with shower',
      'price': 1000,
      'checked': true,
    },
  ],

  [Types.DRIVE]: [
    {
      'id': 1,
      'name': 'cabriolet',
      'title': 'Cabriolet',
      'price': 2500,
      'checked': false,
    },
    {
      'id': 2,
      'name': 'crossover',
      'title': 'Crossover',
      'price': 2900,
      'checked': true,
    },
    {
      'id': 3,
      'name': 'budget',
      'title': 'Budget class',
      'price': 200,
      'checked': false,
    },
  ],

  [Types.FLIGHT]: [
    {
      'id': 1,
      'name': 'upgrade_c',
      'title': 'Upgrade to a comfort class',
      'price': 520,
      'checked': false,
    },
    {
      'id': 2,
      'name': 'upgrade_b',
      'title': 'Upgrade to a business class',
      'price': 850,
      'checked': true,
    },
  ],

  [Types.CHECKIN]: [
    {
      'id': 1,
      'name': 'bar',
      'title': 'Bar for drinks in the room',
      'price': 500,
      'checked': false,
    },
    {
      'id': 2,
      'name': 'deluxe',
      'title': 'Deluxe room for two',
      'price': 2500,
      'checked': false,
    },
    {
      'id': 3,
      'name': 'wedding',
      'title': 'Wedding number',
      'price': 3500,
      'checked': true,
    },
  ],

  [Types.SIGHTSEEING]: [
    {
      'id': 1,
      'name': 'bicycle',
      'title': 'Bicycle for walking',
      'price': 200,
      'checked': false,
    },
    {
      'id': 2,
      'name': 'personal',
      'title': 'Personal guide',
      'price': 800,
      'checked': true,
    },
    {
      'id': 3,
      'name': 'group',
      'title': 'Group guide',
      'price': 500,
      'checked': false,
    },
  ],

  [Types.RESTAURANT]: [],
};

export {offersByType};

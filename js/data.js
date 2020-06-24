'use strict';

window.data = (function () {
  var HouseType = {
    PLACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'};
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var IMG_CNT_LEN = 2;
  var ADVERTS_COUNT = 8;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MAX_PRICE = 3500;
  var MAX_ROOMS = 5;
  var NO_GUEST_ROOM_COUNT = 100;
  var NO_GUEST_VALUE = 0;

  var createAdverts = function (cnt, xMin, xMax) {
    var adverts = [];

    for (var i = 0; i < cnt; i++) {
      var num = ((i + 1) + '').padStart(IMG_CNT_LEN, '0');
      var x = window.util.random(xMin, xMax);
      var y = window.util.random(MIN_Y, MAX_Y);
      var rooms = window.util.random(1, MAX_ROOMS);
      var guests = window.util.random(0, rooms);

      var element = {
        'author': {
          'avatar': 'img/avatars/user' + num + '.png',
        },
        'offer': {
          'title': 'строка, заголовок предложения',
          'address': x + ', ' + y,
          'price': window.util.randomInt(MAX_PRICE),
          'type': Object.keys(HouseType)[window.util.randomInt(Object.keys(HouseType).length)],
          'rooms': rooms,
          'guests': guests,
          'checkin': TIMES[window.util.randomInt(TIMES.length)],
          'checkout': TIMES[window.util.randomInt(TIMES.length)],
          'features': window.util.getRandomArray(FEATURES),
          'description': 'строка с описанием',
          'photos': window.util.getRandomArray(PHOTOS),
        },
        'location': {
          'x': x,
          'y': y
        }
      };
      adverts.push(element);
    }

    return adverts;
  };

  var loadAdverts = function () {
    return window.backend.load();
  };

  var adverts;
  return {
    NO_GUEST_ROOM_COUNT: NO_GUEST_ROOM_COUNT,
    NO_GUEST_VALUE: NO_GUEST_VALUE,
    ADVERTS_COUNT: ADVERTS_COUNT,
    ADVERTS: adverts,
    createAdverts: createAdverts,
    loadAdverts: loadAdverts
  };
})();

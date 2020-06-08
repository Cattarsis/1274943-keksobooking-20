'use strict';
var HOUSE_TYPE = ['place', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_OFFSET_X = 25;
var PIN_OFFSET_Y = 70;

var MAX_PRICE = 3500;
var MAX_ROOMS = 5;

var IMG_CNT_LEN = 2;

var randomInt = function (num) {
  return Math.floor(Math.random() * num);
};

var random = function (min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

var shuffle = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = randomInt(i + 1);
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
};

var getRandomArray = function (array) {
  var len = randomInt(array.length + 1);
  var newArray = array.slice();
  shuffle(newArray);

  return newArray.slice(0, len);
};


var createAdverts = function (cnt, xMin, xMax) {
  var adverts = [];

  for (var i = 0; i < cnt; i++) {
    var num = ((i + 1) + '').padStart(IMG_CNT_LEN, '0');
    var x = random(xMin, xMax);
    var y = random(MIN_Y, MAX_Y);
    var rooms = random(1, MAX_ROOMS);
    var guests = random(0, rooms);

    var element = {
      'author': {
        'avatar': 'img/avatars/user' + num + '.png',
      },
      'offer': {
        'title': 'строка, заголовок предложения',
        'address': x + ', ' + y,
        'price': randomInt(MAX_PRICE),
        'type': HOUSE_TYPE[randomInt(HOUSE_TYPE.length)],
        'rooms': rooms,
        'guests': guests,
        'checkin': TIMES[randomInt(TIMES.length)],
        'checkout': TIMES[randomInt(TIMES.length)],
        'features': getRandomArray(FEATURES),
        'description': 'строка с описанием',
        'photos': getRandomArray(PHOTOS),
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

var createPin = function (pinData) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pin = pinTemplate.cloneNode(true);

  pin.querySelector('img').src = pinData.author.avatar;
  pin.querySelector('img').alt = pinData.offer.title;

  pin.style.left = pinData.location.x - PIN_OFFSET_X + 'px';
  pin.style.top = pinData.location.y - PIN_OFFSET_Y + 'px';

  return pin;
};


var createPinFragment = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    var pin = pins[i];
    fragment.appendChild(createPin(pin));
  }
  return fragment;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var adverts = createAdverts(8, 0, map.offsetWidth);

var pinsFragment = createPinFragment(adverts);

var pins = document.querySelector('.map__pins');
pins.appendChild(pinsFragment);

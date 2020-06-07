'use strict';
let HOUSE_TYPE = ['place', 'flat', 'house', 'bungalo'];
let TIMES = ['12:00', '13:00', '14:00'];
let FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
let PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
]

let randomInt = function(num) {
  return Math.floor(Math.random() * num);
}

let getRandomArray = function(array) {
  let len = randomInt(array.length + 1);
  let newArray = new Set();

  while(newArray.size < len) {
    newArray.add(array[randomInt(array.length)]);
  }

  return Array.from(newArray);
}

let createAdverts = function (cnt, xMin, xMax) {
  let adverts = [];

  for (let i = 0; i < cnt; i++) {
    let num = `${i + 1}`.padStart(2,'0');
    let x = randomInt(1000);
    let y = randomInt(1000);
    let rooms = 1 + randomInt(5);
    let guests = randomInt(rooms);

    let element = {
      'author': {
        'avatar': `img/avatars/user${num}.png`,
      },
      'offer': {
          'title': 'строка, заголовок предложения',
          'address': `${x}, ${y}`,
          'price': randomInt(3500),
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
          'x': xMin + randomInt(xMax+1),
          'y': 130 + randomInt(630)
      }

    }
    adverts.push(element);
  }

  return adverts;
}

let createPin = function(pinData) {
  let pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  let pin = pinTemplate.cloneNode(true);

  pin.querySelector('img').src = pinData.author.avatar;
  pin.querySelector('img').alt = pinData.offer.title;

  //не получается получить размер элемента, пока его нет в разметке
  pin.style.left = pinData.location.x - 25 + "px";
  pin.style.top = pinData.location.y - 70 + "px";

  return pin;
}


let createPinFragment = function(pins){
  let fragment = document.createDocumentFragment();
  for (const pin of pins) {
    fragment.appendChild(createPin(pin));
  }
  return fragment;
}

let map = document.querySelector('.map');
map.classList.remove('map--faded');

let adverts = createAdverts(8,0,map.offsetWidth);

let pinsFragment = createPinFragment(adverts);

let pins = document.querySelector('.map__pins');
pins.appendChild(pinsFragment);




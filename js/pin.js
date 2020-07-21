'use strict';

window.pin = (function () {
  var PIN_OFFSET_X = 25;
  var PIN_OFFSET_Y = 70;
  var MAIN_PIN_OFFSET_Y = 80;
  var MAX_PIN_COUNT = 5;
  var MAIN_PIN_TOP = '375px';
  var MAIN_PIN_LEFT = '570px';
  var LOW_PRICE = 10000;
  var HIEGHT_PRICE = 50000;

  var mainPin = document.querySelector('.map__pin--main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var houseTypeFilter = document.querySelector('#housing-type');
  var housePriceFilter = document.querySelector('#housing-price');
  var houseRoomsFilter = document.querySelector('#housing-rooms');
  var houseGuestsFilter = document.querySelector('#housing-guests');
  var features = document.querySelectorAll('.map__features .map__checkbox');
  var map = document.querySelector('.map');
  var mapRect = map.getBoundingClientRect();

  var lock = function () {
    addInactivePinEventListners();
    removePins();

    mainPin.style.left = MAIN_PIN_LEFT;
    mainPin.style.top = MAIN_PIN_TOP;

    var addres = getMainPinCoordinates(mainPin, true);
    window.form.setAddress(addres.x + ', ' + addres.y);
  };

  var unlock = function () {
    window.form.unlock();
    addPinsToDoc();
    mainPin.removeEventListener('mousedown', onInactivPinClick);
    mainPin.removeEventListener('keydown', onInactivPinKeydown);
  };

  var onInactivPinClick = function (evt) {
    if (evt.button === window.util.LEFT_MOUSE_CLIC) {
      unlock();
      window.map.unlock();
    }
  };

  var onInactivPinKeydown = function (evt) {
    window.util.isEnterEvent(evt, unlock);
  };

  var addInactivePinEventListners = function () {
    mainPin.addEventListener('mousedown', onInactivPinClick);
    mainPin.addEventListener('keydown', onInactivPinKeydown);
  };

  var deactivatePins = function () {
    Array.from(document.querySelectorAll('.map__pin--active')).forEach(function (el) {
      el.classList.remove('map__pin--active');
    });
  };
  var activatePin = function (pin, data) {
    deactivatePins();
    pin.classList.add('map__pin--active');
    window.card.addCartToDOM(data);
  };

  var onPinClick = function (data, evt) {
    activatePin(evt.currentTarget, data);
  };

  var onPinKeydown = function (data, evt) {
    window.util.isEnterEvent(evt, activatePin(evt.currentTarget, data));
  };

  var createPin = function (pinData) {
    var pin = pinTemplate.cloneNode(true);

    var pimImg = pin.querySelector('img');
    pimImg.src = pinData.author.avatar;
    pimImg.alt = pinData.offer.title;

    pin.style.left = pinData.location.x - PIN_OFFSET_X + 'px';
    pin.style.top = pinData.location.y - PIN_OFFSET_Y + 'px';

    pin.addEventListener('click', onPinClick.bind(undefined, pinData));
    pin.addEventListener('keydown', onPinKeydown.bind(undefined, pinData));

    return pin;
  };

  var filterExistOffer = function (el) {
    return el.offer;
  };

  var filterHouseType = function (el) {
    return el.offer.type === houseTypeFilter.value || houseTypeFilter.value === 'any';
  };

  var filterHousePrice = function (el) {
    return housePriceFilter.value === 'middle' && el.offer.price >= LOW_PRICE && el.offer.price < HIEGHT_PRICE
      || housePriceFilter.value === 'low' && el.offer.price < LOW_PRICE
      || housePriceFilter.value === 'high' && el.offer.price >= HIEGHT_PRICE
      || housePriceFilter.value === 'any';
  };

  var filterHouseRooms = function (el) {
    return houseRoomsFilter.value === el.offer.rooms
      || houseRoomsFilter.value === 'any';
  };

  var filterHouseGuests = function (el) {
    return houseGuestsFilter.value === el.offer.guests
      || houseGuestsFilter.value === 'any';
  };

  var filterHouseFeatures = function (el) {
    var result = true;
    for (var i = 0; i < features.length; i++) {
      if (features[i].checked && el.offer.features.indexOf(features[i].value) < 0) {
        result = false;
        break;
      }
    }
    return result;
  };

  var filterPin = function (pins) {

    var newPins = [];
    for (var i = 0; i < pins.length; i++) {
      if (filterExistOffer(pins[i])
          && filterHouseType(pins[i])
          && filterHousePrice(pins[i])
          && filterHouseRooms(pins[i])
          && filterHouseGuests(pins[i])
          && filterHouseFeatures(pins[i])) {
        newPins.push(pins[i]);
      }
      if (newPins.length >= MAX_PIN_COUNT) {
        break;
      }
    }

    return newPins;
  };

  var createPinFragment = function (pins) {
    var pinsToRender = filterPin(pins);
    var fragment = document.createDocumentFragment();

    pinsToRender.forEach(function (pin) {
      fragment.appendChild(createPin(pin));
    });
    return fragment;
  };

  var getXY = function (x, y) {
    y = y > window.data.MAX_Y ? window.data.MAX_Y : y;
    y = y < window.data.MIN_Y ? window.data.MIN_Y : y;

    x = x > map.offsetWidth ? map.offsetWidth : x;
    x = x < 0 ? 0 : x;

    return {
      'x': x,
      'y': y
    };
  };

  var getMainPinCoordinates = function (pin, isCircle) {
    var x = pin.offsetLeft + Math.floor(pin.offsetWidth / 2);
    var y = pin.offsetTop + (isCircle ? Math.floor(pin.offsetHeight / 2) : MAIN_PIN_OFFSET_Y);

    return getXY(x, y);
  };

  var addPinsToDoc = function () {
    window.backend.load(onPinLoad, window.util.showError);
  };

  var removePins = function () {
    Array.from(document.querySelector('.map__pins').querySelectorAll('.map__pin')).forEach(function (element) {
      if (!element.classList.contains('map__pin--main')) {
        element.remove();
      }
    });
  };

  var onPinLoad = function (data) {
    window.data.ADVERTS = data;
    var pinsFragment = createPinFragment(window.data.ADVERTS);

    var pins = document.querySelector('.map__pins');
    removePins();
    pins.appendChild(pinsFragment);


  };

  var isNeedMove = function (evt) {
    return mapHover && mapRect.left <= evt.pageX && mapRect.right >= evt.pageX
    && mapRect.top + window.data.MIN_Y <= evt.pageY && mapRect.top + window.data.MAX_Y >= evt.pageY;
  };

  var newPinXY = function (evt) {
    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var x = (mainPin.offsetLeft - shift.x) + Math.floor(mainPin.offsetWidth / 2);
    var y = (mainPin.offsetTop - shift.y) + MAIN_PIN_OFFSET_Y;

    var pinCoordinats = getXY(x, y);
    window.form.setAddress(pinCoordinats.x + ', ' + pinCoordinats.y);

    mainPin.style.left = pinCoordinats.x - Math.floor(mainPin.offsetWidth / 2) + 'px';
    mainPin.style.top = pinCoordinats.y - MAIN_PIN_OFFSET_Y + 'px';
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    dragged = true;
    if (isNeedMove(moveEvt)) {
      newPinXY(moveEvt);
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    map.removeEventListener('mouseover', onMouseEnter);
    map.removeEventListener('mouseout', onMouseLeave);

    if (dragged) {
      var onClickPreventDefault = function (clickEvt) {
        clickEvt.preventDefault();
        mainPin.removeEventListener('click', onClickPreventDefault);

      };
      mainPin.addEventListener('click', onClickPreventDefault);
    }

    if (isNeedMove(upEvt)) {
      newPinXY(upEvt);
    }
  };

  var dragged;
  var mapHover;
  var startCoords;

  var onMouseLeave = function () {
    mapHover = false;

  };

  var onMouseEnter = function () {
    mapHover = true;
  };
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    dragged = false;
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    map.addEventListener('mouseover', onMouseEnter);
    map.addEventListener('mouseout', onMouseLeave);
  });
  addInactivePinEventListners();
  return {
    getMainPinCoordinates: getMainPinCoordinates,
    addPinsToDoc: addPinsToDoc,
    lock: lock,
    deactivatePins: deactivatePins
  };
})();

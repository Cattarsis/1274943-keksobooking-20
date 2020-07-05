'use strict';

window.pin = (function () {
  var PIN_OFFSET_X = 25;
  var PIN_OFFSET_Y = 70;
  var MAIN_PIN_OFFSET_Y = 80;
  var MAX_PIN_COUNT = 5;
  var MAIN_PIN_TOP = '375px';
  var MAIN_PIN_LEFT = '570px';
  var mainPin = document.querySelector('.map__pin--main');

  var lockPin = function () {
    addInactivePinEventListners();
    removePins();

    // mainPin.style.left = '';
    // mainPin.style.top = '';
    mainPin.style.left = MAIN_PIN_LEFT;
    mainPin.style.top = MAIN_PIN_TOP;

    var addres = getMainPinCoordinates(mainPin, true);
    window.form.setAddress(addres.x + ', ' + addres.y);
  };

  var unlockPin = function () {
    window.form.unlockForm();
    addPinsToDoc();
    mainPin.removeEventListener('mousedown', onInactivPinClick);
    mainPin.removeEventListener('keydown', onInactivPinKeydown);
  };

  var onInactivPinClick = function (evt) {
    if (evt.button === window.util.LEFT_MOUSE_CLIC) {
      unlockPin();
    }
  };

  var onInactivPinKeydown = function (evt) {
    window.util.isEnterEvent(evt, unlockPin);
  };

  var addInactivePinEventListners = function () {
    mainPin.addEventListener('mousedown', onInactivPinClick);
    mainPin.addEventListener('keydown', onInactivPinKeydown);
  };

  var onPinClick = function (data) {
    window.card.addCartToDOM(data);
  };

  var onPinEnterPress = function (evt, data) {
    window.util.isEscEvent(evt, window.card.addCartToDOM(data));
  };

  var map = document.querySelector('.map');
  var createPin = function (pinData) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pin = pinTemplate.cloneNode(true);

    pin.querySelector('img').src = pinData.author.avatar;
    pin.querySelector('img').alt = pinData.offer.title;

    pin.style.left = pinData.location.x - PIN_OFFSET_X + 'px';
    pin.style.top = pinData.location.y - PIN_OFFSET_Y + 'px';

    pin.addEventListener('click', onPinClick.bind(undefined, pinData));
    pin.addEventListener('keydown', onPinEnterPress.bind(undefined, pinData));

    return pin;
  };


  var pinFilter = function (pins) {
    var houseTypeFilter = document.querySelector('#housing-type').value;
    var newPins = pins.filter(function (el) {
      return el.offer.type === houseTypeFilter || houseTypeFilter === 'any';
    }).slice(0, MAX_PIN_COUNT);

    return newPins;
  };

  var createPinFragment = function (pins) {
    var pinsToRender = pinFilter(pins);
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pinsToRender.length; i++) {
      var pin = pinsToRender[i];
      fragment.appendChild(createPin(pin));
    }
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
    window.backend.load(onPinLoad, window.util.errorShow);
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

    window.map.unlockMap();
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

    newPinXY(moveEvt);

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (dragged) {
      var onClickPreventDefault = function (clickEvt) {
        clickEvt.preventDefault();
        mainPin.removeEventListener('click', onClickPreventDefault);

      };
      mainPin.addEventListener('click', onClickPreventDefault);
    }
    newPinXY(upEvt);
  };


  var dragged;
  var startCoords;

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    dragged = false;
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  addInactivePinEventListners();
  return {
    createPinFragment: createPinFragment,
    getMainPinCoordinates: getMainPinCoordinates,
    addPinsToDoc: addPinsToDoc,
    lockPin: lockPin
  };

})();

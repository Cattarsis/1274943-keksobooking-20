'use strict';

window.pin = (function () {
  var PIN_OFFSET_X = 25;
  var PIN_OFFSET_Y = 70;
  var mainPin = document.querySelector('.map__pin--main');

  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.button === window.util.LEFT_MOUSE_CLIC) {
      window.map.unlockMap();
      var pinXY = getPinCoordinates(mainPin, false);
      window.form.setAddress(pinXY.x + ', ' + pinXY.y);
    }
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      window.map.unlockMap();
    }
  });

  var map = document.querySelector('.map');
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

  var getPinCoordinates = function (pin, isCircle) {
    var x = pin.offsetLeft + Math.floor(pin.offsetWidth / 2);
    var y = pin.offsetTop + Math.floor(pin.offsetHeight / (isCircle ? 2 : 1));

    y = y > window.data.MAX_Y ? window.data.MAX_Y : y;
    y = y < window.data.MIN_Y ? window.data.MIN_Y : y;

    x = x > map.offsetWidth ? map.offsetWidth : x;
    x = x < 0 ? 0 : x;

    return {
      'x': x,
      'y': y
    };
  };

  var addPinsToDoc = function () {
    window.backend.load(onPinLoad, window.util.errorShow);
  };

  var onPinLoad = function (data) {
    window.data.ADVERTS = data;
    var pinsFragment = createPinFragment(window.data.ADVERTS);

    var pins = document.querySelector('.map__pins');
    pins.appendChild(pinsFragment);
  };

  return {
    createPinFragment: createPinFragment,
    getPinCoordinates: getPinCoordinates,
    addPinsToDoc: addPinsToDoc,
  };

})();

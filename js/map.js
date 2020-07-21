'use strict';

window.map = function () {
  var mapObj = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');

  var lock = function () {
    mapObj.classList.add('map--faded');
    window.card.cardClose();
    Array.from(mapFilters.children).forEach(function (el) {
      el.disabled = true;
    });

    mapFilters.reset();
    var pinXY = window.pin.getMainPinCoordinates(mainPin, true);
    window.form.setAddress(pinXY.x + ', ' + pinXY.y);
  };

  lock();
  var unlock = function () {
    if (mapObj.classList.contains('map--faded')) {
      mapObj.classList.remove('map--faded');
    }
    Array.from(mapFilters.children).forEach(function (el) {
      el.disabled = '';
    });
  };

  return {
    lock: lock,
    unlock: unlock
  };
}();

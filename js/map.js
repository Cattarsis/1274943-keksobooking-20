'use strict';

window.map = function () {
  var SELECT_DEFAULT_VALUE = 'any';
  var CHECKED_DEFAULT_VALUE = false;
  var mapObj = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');
  var mapFeatures = document.querySelectorAll('.map__features .map__checkbox');

  var lockMap = function () {
    mapObj.classList.add('map--faded');
    window.card.cardClose();
    Array.from(mapFilters.children).forEach(function (el) {
      if (el.tagName.toLowerCase() === 'select') {
        el.value = SELECT_DEFAULT_VALUE;
      }
      el.disabled = true;
    });

    Array.from(mapFeatures).forEach(function (el) {
      el.checked = CHECKED_DEFAULT_VALUE;
    });
    var pinXY = window.pin.getMainPinCoordinates(mainPin, true);
    window.form.setAddress(pinXY.x + ', ' + pinXY.y);
  };

  lockMap();
  var unlockMap = function () {
    if (mapObj.classList.contains('map--faded')) {
      mapObj.classList.remove('map--faded');
    }
    Array.from(mapFilters.children).forEach(function (el) {
      el.disabled = '';
    });
  };

  return {
    lockMap: lockMap,
    unlockMap: unlockMap
  };
}();

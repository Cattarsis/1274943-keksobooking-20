'use strict';

window.map = function () {
  var mapObj = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');

  var lockMap = function () {
    mapObj.classList.add('map--faded');
    Array.from(mapFilters.children).forEach(function (el) {
      el.disabled = true;
    });

    // window.form.lockForm();

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

'use strict';

window.map = function () {
  var mapObj = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  var lockMap = function () {
    mapObj.classList.add('map--faded');

    window.form.lockForm();

    var pinXY = window.pin.getPinCoordinates(mainPin, true);
    window.form.setAddress(pinXY.x + ', ' + pinXY.y);
  };

  lockMap();
  var unlockMap = function () {
    mapObj.classList.remove('map--faded');

    window.form.unlockForm();
    window.pin.addPinsToDoc();
  };

  return {
    lockMap: lockMap,
    unlockMap: unlockMap
  };
}();
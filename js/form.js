'use strict';

window.form = (function () {

  var DEFAULT_GUEST_COUNT = 1;
  var DEFAULT_ROOM_COUNT = 1;
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var adFormHeader = document.querySelector('.ad-form-header__input');
  var addressField = adForm.querySelector('input[name=address]');
  var roomNumber = document.querySelector('#room_number');
  var guestCapacity = document.querySelector('#capacity');
  var submitButton = document.querySelector('.ad-form__submit');


  var setAddress = function (val) {
    addressField.value = val;
  };

  var blockGuestValues = function (roomCount, selector) {
    var options = selector.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      var intVal = +options[i].value;
      if (+roomCount !== window.data.NO_GUEST_ROOM_COUNT && (intVal > roomCount || intVal === window.data.NO_GUEST_VALUE)
        || +roomCount === window.data.NO_GUEST_ROOM_COUNT && intVal !== window.data.NO_GUEST_VALUE) {
        options[i].setAttribute('disabled', true);
      } else {
        options[i].removeAttribute('disabled');
      }
    }
  };

  var lockForm = function () {
    adForm.classList.add('ad-form--disabled');
    adFormHeader.setAttribute('disabled', true);
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].setAttribute('disabled', true);
    }
    adForm.querySelector('#address').setAttribute('disabled', true);
  };

  var unlockForm = function () {
    adForm.classList.remove('ad-form--disabled');
    adFormHeader.removeAttribute('disabled');
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].removeAttribute('disabled');
    }
    roomNumber.value = DEFAULT_ROOM_COUNT;
    guestCapacity.value = DEFAULT_GUEST_COUNT;

    blockGuestValues(roomNumber.value, guestCapacity);
  };

  var onRoomCapacityValidate = function () {
    if (roomNumber.value <= window.data.NO_GUEST_ROOM_COUNT &&
      (guestCapacity.value > roomNumber.value || guestCapacity.value <= window.data.NO_GUEST_VALUE)) {
      guestCapacity.setCustomValidity('Гостей не может быть больше чем комнат, но не менне одного');
    }

    if (+roomNumber.value === window.data.NO_GUEST_ROOM_COUNT && +guestCapacity.value !== window.data.NO_GUEST_VALUE) {
      guestCapacity.setCustomValidity('Не должно быть гостей');
    }

    blockGuestValues(roomNumber.value, guestCapacity);
  };

  var onFilterChange = function () {
    window.pin.addPinsToDoc();

    window.card.cardClose();
  };

  Array.from(document.querySelectorAll('.map__filter')).forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });

  submitButton.addEventListener('click', onRoomCapacityValidate);
  roomNumber.addEventListener('input', onRoomCapacityValidate);
  guestCapacity.addEventListener('input', onRoomCapacityValidate);


  return {
    blockGuestValues: blockGuestValues,
    lockForm: lockForm,
    unlockForm: unlockForm,
    setAddress: setAddress
  };
})();

'use strict';

window.form = (function () {
  var MAX_PRICE = 1000000;
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var MinPrice = {
    PALACE: 10000,
    FLAT: 1000,
    HOUSE: 5000,
    BUNGALO: 0
  };

  var DEFAULT_GUEST_COUNT = 1;
  var DEFAULT_ROOM_COUNT = 1;
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var adFormHeader = document.querySelector('.ad-form-header__input');
  var addressField = adForm.querySelector('input[name=address]');
  var roomNumber = document.querySelector('#room_number');
  var guestCapacity = document.querySelector('#capacity');
  var submitButton = document.querySelector('.ad-form__submit');
  var type = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var avatar = document.querySelector('#avatar');
  var images = document.querySelector('#images');

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


  var formValidationAdd = function () {
    var title = adForm.querySelector('#title');
    title.required = true;
    title.minLength = MIN_TITLE_LENGTH;
    title.maxLength = MAX_TITLE_LENGTH;

    var price = adForm.querySelector('#price');
    price.required = true;
    price.maxValue = MAX_PRICE;
    price.minValue = MinPrice[type.value.toUpperCase()];
    price.placeholder = MinPrice[type.value.toUpperCase()];

    avatar.accept = 'image/*';
    images.accept = 'image/*';

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
    formValidationAdd();
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

  var onTypeChange = function (evt) {
    var price = adForm.querySelector('#price');
    price.minValue = MinPrice[evt.currentTarget.value.toUpperCase()];
    price.placeholder = MinPrice[evt.currentTarget.value.toUpperCase()];
  };

  var onTimeChange = function (evt) {
    if (evt.currentTarget.id === 'timein') {
      timeOut.value = timeIn.value;
    } else {
      timeIn.value = timeOut.value;
    }
  };

  type.addEventListener('change', onTypeChange);

  timeIn.addEventListener('change', onTimeChange);
  timeOut.addEventListener('change', onTimeChange);

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

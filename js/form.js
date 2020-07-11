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
  var IMAGE_ACCEPT = 'image/*';
  var IMAGE_PREVIEW_WIDTH = '100%';
  var IMAGE_PREVIEW_HEIGHT = '100%';

  var DefaultValues = {
    GUEST_COUNT: 1,
    ROOM_COUNT: 1,
    TYPE: 'flat',
    TIME_IN: '12:00',
    TIME_OUT: '12:00',
    AVATAR: '',
    AVATAR_IMAGE: 'img/muffin-grey.svg',
    IMAGES: '',
    PRICE: '',
    DESCRIPTION: '',
    TITLE: '',
    CHECKED: false
  };

  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var adFormHeader = document.querySelector('.ad-form-header__input');
  var addressField = adForm.querySelector('#address');
  var roomNumber = document.querySelector('#room_number');
  var guestCapacity = document.querySelector('#capacity');
  var submitButton = document.querySelector('.ad-form__submit');
  var resetButton = document.querySelector('.ad-form__reset');
  var type = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var avatar = document.querySelector('#avatar');
  var avatarImage = document.querySelector('.ad-form-header__preview img');
  var images = document.querySelector('#images');
  var imagesWrapper = document.querySelector('.ad-form__photo');
  var price = document.querySelector('#price');
  var title = document.querySelector('#title');
  var description = document.querySelector('#description');
  var inputs = adForm.querySelectorAll('input');
  var features = adForm.querySelectorAll('.feature__checkbox');

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

  var formToDefaultState = function () {
    avatar.value = DefaultValues.AVATAR;
    avatarImage.src = DefaultValues.AVATAR_IMAGE;
    title.value = DefaultValues.TITLE;
    type.value = DefaultValues.TYPE;
    price.value = DefaultValues.PRICE;
    timeIn.value = DefaultValues.TIME_IN;
    timeOut.value = DefaultValues.TIME_OUT;
    roomNumber.value = DefaultValues.ROOM_COUNT;
    guestCapacity.value = DefaultValues.GUEST_COUNT;
    description.value = DefaultValues.DESCRIPTION;
    images.value = DefaultValues.IMAGES;
    imagesWrapper.innerHTML = '';

    Array.from(features).forEach(function (el) {
      el.checked = DefaultValues.CHECKED;
    });

    formValidationAdd();
  };

  var onSuccessForm = function () {
    lockForm();
    window.util.successShow();
  };

  var formValidationAdd = function () {
    title.required = true;
    title.minLength = MIN_TITLE_LENGTH;
    title.maxLength = MAX_TITLE_LENGTH;

    price.required = true;
    price.max = MAX_PRICE;
    price.min = MinPrice[type.value.toUpperCase()];
    price.placeholder = MinPrice[type.value.toUpperCase()];

    avatar.accept = IMAGE_ACCEPT;
    images.accept = IMAGE_ACCEPT;

  };

  var lockForm = function () {
    adForm.classList.add('ad-form--disabled');
    adFormHeader.setAttribute('disabled', true);
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].setAttribute('disabled', true);
    }
    adForm.querySelector('#address').setAttribute('readonly', true);
    window.map.lockMap();
    window.pin.lockPin();
    formToDefaultState();
  };

  var unlockForm = function () {
    adForm.classList.remove('ad-form--disabled');
    adFormHeader.removeAttribute('disabled');
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].removeAttribute('disabled');
    }
    formToDefaultState();

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

  var onFilterChange = window.util.debounce(function () {
    window.pin.addPinsToDoc();
    window.card.cardClose();
  });


  var onTypeChange = function (evt) {
    price.min = MinPrice[evt.currentTarget.value.toUpperCase()];
    price.placeholder = MinPrice[evt.currentTarget.value.toUpperCase()];
  };

  var onTimeChange = function (evt) {
    if (evt.currentTarget.id === 'timein') {
      timeOut.value = timeIn.value;
    } else {
      timeIn.value = timeOut.value;
    }
  };

  var loadImage = function (file, pic) {

    var reader = new FileReader();

    reader.addEventListener('load', function () {
      pic.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var onAvatarInputChange = function (evt) {
    var files = evt.currentTarget.files;

    var matches = Array.from(files).filter(function (it) {
      return it.type.match(IMAGE_ACCEPT);
    });

    if (matches) {
      loadImage(matches[0], avatarImage);
    }
  };

  var onImagesInputChange = function (evt) {
    var files = evt.currentTarget.files;

    var matches = Array.from(files).filter(function (it) {
      return it.type.match(IMAGE_ACCEPT);
    });

    var picturesFragment = document.createDocumentFragment();
    if (matches) {
      matches.forEach(function (file) {
        var img = document.createElement('img');
        img.style.width = IMAGE_PREVIEW_WIDTH;
        img.style.height = IMAGE_PREVIEW_HEIGHT;
        loadImage(file, img);
        picturesFragment.appendChild(img);
      });
      imagesWrapper.innerHTML = '';
      imagesWrapper.appendChild(picturesFragment);
    }

  };

  avatar.addEventListener('change', onAvatarInputChange);
  images.addEventListener('change', onImagesInputChange);

  type.addEventListener('change', onTypeChange);

  timeIn.addEventListener('change', onTimeChange);
  timeOut.addEventListener('change', onTimeChange);

  Array.from(document.querySelectorAll('.map__filter')).forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });

  Array.from(document.querySelectorAll('.map__features .map__checkbox')).forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });

  var onSubmitForm = function (evt) {
    onRoomCapacityValidate();
    var isValid = true;

    Array.from(inputs).forEach(function (el) {
      isValid &= el.checkValidity();
    });

    if (isValid) {
      window.backend.save(new FormData(adForm), onSuccessForm, window.util.errorShow);
      evt.preventDefault();
    }
  };

  var onFormClear = function (evt) {
    lockForm();
    evt.preventDefault();
  };

  submitButton.addEventListener('click', onSubmitForm);
  resetButton.addEventListener('click', onFormClear);
  roomNumber.addEventListener('input', onRoomCapacityValidate);
  guestCapacity.addEventListener('input', onRoomCapacityValidate);
  formToDefaultState();

  return {
    blockGuestValues: blockGuestValues,
    lockForm: lockForm,
    unlockForm: unlockForm,
    setAddress: setAddress
  };
})();

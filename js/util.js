'use strict';
window.util = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;

  var modalHandler;
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemlatr = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');

  var getRandomInt = function (num) {
    return Math.floor(Math.random() * num);
  };
  var getRandom = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
  };
  var mix = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = getRandomInt(i + 1);
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  };

  var getRandomArray = function (array) {
    var len = getRandomInt(array.length + 1);
    var newArray = array.slice();
    mix(newArray);

    return newArray.slice(0, len);
  };

  var onErrorButtonClick = function () {
    modalHandler.querySelector('.error__button').removeEventListener('click', onErrorButtonClick);
    modalClose();
  };

  var showError = function (err) {

    modalHandler = errorTemlatr.cloneNode(true);
    modalHandler.querySelector('.error__message').textContent = err;
    modalHandler.querySelector('.error__button').addEventListener('click', onErrorButtonClick);
    document.addEventListener('click', onModalDocumentClick);
    document.addEventListener('keydown', onModalKeydown);

    main.appendChild(modalHandler);
  };

  var onModalDocumentClick = function () {
    modalClose();
  };

  var onModalKeydown = function (evt) {
    window.util.isEscEvent(evt, modalClose);
  };

  var modalClose = function () {
    modalHandler.remove();
    document.removeEventListener('click', onModalDocumentClick);
    document.removeEventListener('keydown', onModalKeydown);

  };

  var showSuccess = function () {
    modalHandler = successTemplate.cloneNode(true);
    document.addEventListener('click', onModalDocumentClick);
    document.addEventListener('keydown', onModalKeydown);
    main.appendChild(modalHandler);

  };

  return {
    LEFT_MOUSE_CLIC: 0,
    getRandomInt: getRandomInt,
    getRandom: getRandom,
    mix: mix,
    getRandomArray: getRandomArray,
    showError: showError,
    showSuccess: showSuccess,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    debounce: function (cb) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();

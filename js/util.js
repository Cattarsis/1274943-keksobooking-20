'use strict';
window.util = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;

  var modalHandler;
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemlatr = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');

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

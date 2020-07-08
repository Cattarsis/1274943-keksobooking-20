'use strict';
window.util = (function () {
  var modalHandler;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;

  var randomInt = function (num) {
    return Math.floor(Math.random() * num);
  };
  var random = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
  };
  var shuffle = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  };

  var getRandomArray = function (array) {
    var len = randomInt(array.length + 1);
    var newArray = array.slice();
    shuffle(newArray);

    return newArray.slice(0, len);
  };

  var onErrorButtonClick = function () {
    modalHandler.querySelector('.error__button').removeEventListener('click', onErrorButtonClick);
    modalClose();
  };

  var errorShow = function (err) {

    var errorTemlatr = document.querySelector('#error').content.querySelector('.error');
    modalHandler = errorTemlatr.cloneNode(true);
    modalHandler.querySelector('.error__message').textContent = err;
    modalHandler.querySelector('.error__button').addEventListener('click', onErrorButtonClick);
    document.addEventListener('click', onModalDocumentClick);
    document.addEventListener('keydown', onModalKeydown);

    document.querySelector('body').appendChild(modalHandler);

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


  var successShow = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    modalHandler = successTemplate.cloneNode(true);
    document.addEventListener('click', onModalDocumentClick);
    document.addEventListener('keydown', onModalKeydown);
    document.querySelector('body').appendChild(modalHandler);

  };

  return {
    LEFT_MOUSE_CLIC: 0,
    randomInt: randomInt,
    random: random,
    shuffle: shuffle,
    getRandomArray: getRandomArray,
    errorShow: errorShow,
    successShow: successShow,
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

'use strict';
window.util = (function () {
  var errorHandler;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

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

  var closeError = function () {
    errorHandler.removeEventListener('click', closeError);
    errorHandler.remove();
  };

  var errorShow = function (err) {

    if (!errorHandler) {
      var errorTemlatr = document.querySelector('#error').content.querySelector('.error');
      errorHandler = errorTemlatr.cloneNode(true);
    }
    errorHandler.querySelector('.error__message').textContent = err;
    errorHandler.querySelector('.error__button').addEventListener('click', closeError);

    document.querySelector('body').appendChild(errorHandler);

  };

  return {
    LEFT_MOUSE_CLIC: 0,
    randomInt: randomInt,
    random: random,
    shuffle: shuffle,
    getRandomArray: getRandomArray,
    errorShow: errorShow,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    }
  };
})();

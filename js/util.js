'use strict';
window.util = (function () {
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

  return {
    LEFT_MOUSE_CLIC: 0,
    randomInt: randomInt,
    random: random,
    shuffle: shuffle,
    getRandomArray: getRandomArray
    // errorShow: function (err) {

    // }
  };
})();

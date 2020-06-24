'use strict';
window.backend = (function () {
  var LOADD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;

  var load = function (onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        // onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    // xhr.addEventListener('error', function () {
    //   onError('Произошла ошибка соединения');
    // });
    // xhr.addEventListener('timeout', function () {
    //   onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    // });
    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open('GET', LOADD_URL);
    xhr.send();
  };

  return {
    load: load
  };
})();

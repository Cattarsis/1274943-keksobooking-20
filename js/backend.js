'use strict';
window.backend = (function () {
  var LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;

  var toServerRequest = function (address, method, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open(method, address);

    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    toServerRequest(LOAD_URL, 'GET', null, onLoad, onError);
  };

  var save = function (data, onLoad, onError) {
    toServerRequest(UPLOAD_URL, 'POST', data, onLoad, onError);
  };

  return {
    load: load,
    save: save
  };
})();

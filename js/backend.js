'use strict';

(function () {
  var NO_ERROR = 200;
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';

  var createXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case NO_ERROR:
          onLoad(xhr.response);
          break;

        default:
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = createXhr(onLoad, onError);
      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = createXhr(onLoad, onError);
      xhr.open('POST', SAVE_URL);
      xhr.send(data);
    }
  };
})();

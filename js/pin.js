'use strict';

(function () {
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;

  window.pin = {
    renderMapPin: function (card, index, template, callback) {
      var pinElement = template.content.querySelector('.map__pin').cloneNode(true);
      var pinImageElement = pinElement.querySelector('img');
      var x = card.location.x - PIN_WIDTH / 2;
      var y = card.location.y - PIN_HEIGHT;

      pinImageElement.src = card.author.avatar;
      pinImageElement.alt = card.offer.title;
      pinElement.style = 'left: ' + x + 'px; top: ' + y + 'px;';
      pinElement.dataset.index = index;

      pinElement.addEventListener('click', function (evt) {
        callback(evt);
      });

      pinElement.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, callback);
      });

      return pinElement;
    }
  };
})();

'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mapPinsElem = map.querySelector('.map__pins');
  var template = document.querySelector('template');
  var OFFERS_COUNT = 8;
  var MAIN_PIN_HEIGHT = 80;
  var MAIN_PIN_WIDTH = 66;

  var showMapPins = function (items) {
    var fragment = document.createDocumentFragment();

    items.forEach(function (item, i) {
      fragment.appendChild(window.pin.renderMapPin(item, i, template, pinActivate));
    });

    mapPinsElem.appendChild(fragment);
  };

  var pinActivate = function (evt) {
    showOffer(window.card.renderOffer(offers[evt.currentTarget.dataset.index], template));
  };

  var showOffer = function (card) {
    removePopup();
    map.appendChild(card, map.querySelector('.map__filters-container'));
    map.querySelector('.popup__close').addEventListener('click', function () {
      removePopup();
    });
    document.addEventListener('keydown', onCloseEscPress);
  };

  var onCloseEscPress = function (evt) {
    window.util.isEscEvent(evt, removePopup);
  };

  var removePopup = function () {
    var popup = map.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
    }

    document.removeEventListener('keydown', onCloseEscPress);
  };

  var offers = window.data.getRandomOffer(OFFERS_COUNT);

  var showMap = function () {
    map.classList.remove('map--faded');
    window.form.disableForm(false);
    showMapPins(offers);
    mainPin.removeEventListener('mouseup', onMainPinClick);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
  };

  var onMainPinClick = function () {
    showMap();
  };

  var onMainPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, showMap);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = checkCoords(mainPin.offsetTop - shift.y, window.data.ADDRESS.Y.MIN - MAIN_PIN_HEIGHT, window.data.ADDRESS.Y.MAX) + 'px';
      mainPin.style.left = checkCoords(mainPin.offsetLeft - shift.x, 0, map.offsetWidth - MAIN_PIN_WIDTH) + 'px';

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
          window.form.setAddress(mainPin, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var checkCoords = function (number, min, max) {
    return Math.min(Math.max(number, min), max);
  };

  window.form.setAddress(mainPin, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
  window.form.disableForm(true);
  mainPin.addEventListener('mouseup', onMainPinClick);
  mainPin.addEventListener('keydown', onMainPinEnterPress);
})();

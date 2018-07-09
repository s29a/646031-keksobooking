'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var MAIN_PIN_HEIGHT = 80;
  var MAIN_PIN_WIDTH = 66;
  var ADDRESS_Y = {
    MIN: 130,
    MAX: 630
  };
  var MAIN_PIN_DEFAULT_POSITION = {
    X: 570,
    Y: 375
  };
  var MAX_OFFERS = 5;

  var mapElem = document.querySelector('.map');
  var mainPinElem = mapElem.querySelector('.map__pin--main');
  var mapPinsElem = mapElem.querySelector('.map__pins');
  var template = document.querySelector('template');
  var mapFiltersElem = document.querySelector('.map__filters');
  var mapFiltersFeaturesElements = mapFiltersElem.querySelectorAll('[name="features"');
  var mapFiltersTypeElem = mapFiltersElem.querySelector('[name="housing-type"]');
  var mapFiltersCostElem = mapFiltersElem.querySelector('[name="housing-price"]');
  var mapFiltersRoomsElem = mapFiltersElem.querySelector('[name="housing-rooms"]');
  var mapFiltersGuestsElem = mapFiltersElem.querySelector('[name="housing-guests"]');
  var filters = {
    type: 'any',
    cost: 'any',
    rooms: 'any',
    guests: 'any',
    features: []
  };

  var updateFilters = function () {
    filters.type = mapFiltersTypeElem.value;
    filters.cost = mapFiltersCostElem.value;
    filters.rooms = mapFiltersRoomsElem.value;
    filters.guests = mapFiltersGuestsElem.value;
    filters.features = Array.from(mapFiltersFeaturesElements).filter(function (checkbox) {
      return checkbox.checked;
    }).map(function (checkbox) {
      return checkbox.value;
    });
    window.util.removeAll(mapPinsElem.querySelectorAll('.map__pin[data-index]'));
    removePopup();
    showMapPins(window.filter(offers, filters), MAX_OFFERS);
  };

  var onFiltersChange = window.debounce(updateFilters, DEBOUNCE_INTERVAL);

  mapFiltersElem.addEventListener('change', onFiltersChange);

  var showMapPins = function (items, count) {
    var fragment = document.createDocumentFragment();
    if (items.length < count) {
      count = items.length;
    }

    for (var i = 0; i < count; i++) {
      fragment.appendChild(window.pin.renderMapPin(items[i], i, template, pinActivate));
    }
    mapPinsElem.appendChild(fragment);
  };

  var pinActivate = function (evt) {
    showOffer(window.card.renderOffer(window.filter(offers, filters)[evt.currentTarget.dataset.index], template));
  };

  var showOffer = function (card) {
    removePopup();
    mapElem.appendChild(card, mapElem.querySelector('.map__filters-container'));
    mapElem.querySelector('.popup__close').addEventListener('click', function () {
      removePopup();
    });
    document.addEventListener('keydown', onCloseEscPress);
  };

  var onCloseEscPress = function (evt) {
    window.util.isEscEvent(evt, removePopup);
  };

  var removePopup = function () {
    var popupElem = mapElem.querySelector('.popup');
    if (popupElem) {
      mapElem.removeChild(popupElem);
    }

    document.removeEventListener('keydown', onCloseEscPress);
  };

  var offers = {};

  var getOffers = function (response) {
    offers = response;
  };

  window.backend.load(getOffers, window.form.onError);

  var showMap = function () {
    mapElem.classList.remove('map--faded');
    window.form.disableForm(false);
    showMapPins(offers, MAX_OFFERS);
    mainPinElem.removeEventListener('mouseup', onMainPinClick);
    mainPinElem.removeEventListener('keydown', onMainPinEnterPress);
  };

  var onMainPinClick = function () {
    showMap();
  };

  var onMainPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, showMap);
  };

  mainPinElem.addEventListener('mousedown', function (evt) {
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

      mainPinElem.style.top = checkCoords(mainPinElem.offsetTop - shift.y, ADDRESS_Y.MIN - MAIN_PIN_HEIGHT, ADDRESS_Y.MAX) + 'px';
      mainPinElem.style.left = checkCoords(mainPinElem.offsetLeft - shift.x, 0, mapElem.offsetWidth - MAIN_PIN_WIDTH) + 'px';

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPinElem.removeEventListener('click', onClickPreventDefault);
          window.form.setAddress(mainPinElem, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
        };
        mainPinElem.addEventListener('click', onClickPreventDefault);
      }

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var checkCoords = function (number, min, max) {
    return Math.min(Math.max(number, min), max);
  };

  var onResetAll = function () {
    mapElem.classList.add('map--faded');
    window.form.disableForm(true);
    mapFiltersElem.reset();
    removePopup();
    window.util.removeAll(document.querySelectorAll('.validation__error'));
    window.util.removeAll(mapPinsElem.querySelectorAll('.map__pin[data-index]'));
    mainPinElem.style.left = MAIN_PIN_DEFAULT_POSITION.X + 'px';
    mainPinElem.style.top = MAIN_PIN_DEFAULT_POSITION.Y + 'px';
    window.form.setAddress(mainPinElem, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
    mainPinElem.addEventListener('mouseup', onMainPinClick);
    mainPinElem.addEventListener('keydown', onMainPinEnterPress);
  };

  window.form.setAddress(mainPinElem, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
  window.form.disableForm(true);
  document.addEventListener('resetAll', onResetAll);
  mainPinElem.addEventListener('mouseup', onMainPinClick);
  mainPinElem.addEventListener('keydown', onMainPinEnterPress);

})();

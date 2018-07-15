'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var MAIN_PIN_SIZE = {
    HEIGHT: 62,
    WIDTH: 62,
    ARROW_HEIGHT: 18
  };
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
  var mapFiltersElem = mapElem.querySelector('.map__filters');
  var mapFiltersFeaturesElements = mapFiltersElem.querySelectorAll('[name="features"');
  var mapFiltersTypeElem = mapFiltersElem.querySelector('[name="housing-type"]');
  var mapFiltersCostElem = mapFiltersElem.querySelector('[name="housing-price"]');
  var mapFiltersRoomsElem = mapFiltersElem.querySelector('[name="housing-rooms"]');
  var mapFiltersGuestsElem = mapFiltersElem.querySelector('[name="housing-guests"]');
  var mainPinActive = false;
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
  };

  var setFiltersDisabled = function (disabled) {
    for (var i = 0; i < mapFiltersElem.children.length; i++) {
      mapFiltersElem.children[i].disabled = disabled;
    }
  };

  setFiltersDisabled(true);

  var filtersChange = function () {
    updateFilters();
    window.util.removeAll(mapPinsElem.querySelectorAll('.map__pin[data-index]'));
    hidePopup();
    showMapPins(window.filter(offers, filters), MAX_OFFERS);
  };

  var onFiltersChange = window.debounce(filtersChange, DEBOUNCE_INTERVAL);

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

  var pinRemoveActiveClass = function () {
    var pins = mapPinsElem.querySelectorAll('.map__pin--active');

    pins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });
  };

  var pinActivate = function (evt) {
    if (evt.currentTarget !== mapPinsElem.querySelector('.map__pin--active')) {
      pinRemoveActiveClass();
      evt.currentTarget.classList.add('map__pin--active');
      window.card.renderOffer(window.filter(offers, filters)[evt.currentTarget.dataset.index]);
      showOffer();
    }
  };

  var hidePopup = function () {
    offerPopupElem.classList.add('hidden');
    pinRemoveActiveClass();
  };

  var offerPopupElem = window.card.createOfferPopup(template);

  mapElem.appendChild(offerPopupElem, mapElem.querySelector('.map__filters-container'));
  hidePopup();

  var showOffer = function () {
    offerPopupElem.classList.remove('hidden');
    mapElem.querySelector('.popup__close').addEventListener('click', function () {
      hidePopup();
    });
    document.addEventListener('keydown', onCloseEscPress);
  };

  var onCloseEscPress = function (evt) {
    window.util.isEscEvent(evt, hidePopup);
  };

  var offers = {};

  var getOffers = function (response) {
    offers = response;
    setFiltersDisabled(false);
  };

  window.backend.load(getOffers, window.form.onError);

  var showMap = function () {
    mapElem.classList.remove('map--faded');
    window.form.disableForm(false);
    updateFilters();
    showMapPins(window.filter(offers, filters), MAX_OFFERS);
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

      var pinHeight = MAIN_PIN_SIZE.HEIGHT + MAIN_PIN_SIZE.ARROW_HEIGHT;

      if (!mainPinActive) {
        pinHeight = MAIN_PIN_SIZE.HEIGHT / 2;
      }

      mainPinElem.style.top = checkCoords(mainPinElem.offsetTop - shift.y, ADDRESS_Y.MIN - pinHeight, ADDRESS_Y.MAX - pinHeight) + 'px';
      mainPinElem.style.left = checkCoords(mainPinElem.offsetLeft - shift.x, 0, mapElem.offsetWidth - MAIN_PIN_SIZE.WIDTH) + 'px';
      window.form.setAddress(mainPinElem, MAIN_PIN_SIZE.WIDTH / 2, pinHeight);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (!mainPinActive) {
        mainPinElem.style.top = parseInt(mainPinElem.style.top.slice(0, -2), 10) - MAIN_PIN_SIZE.HEIGHT / 2 - MAIN_PIN_SIZE.ARROW_HEIGHT + 'px';
        mainPinActive = true;
      }

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPinElem.removeEventListener('click', onClickPreventDefault);
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
    mainPinActive = false;
    mapElem.classList.add('map--faded');
    window.form.disableForm(true);
    mapFiltersElem.reset();
    hidePopup();
    window.validation.clearErrors();
    window.util.removeAll(mapPinsElem.querySelectorAll('.map__pin[data-index]'));
    mainPinElem.style.left = MAIN_PIN_DEFAULT_POSITION.X + 'px';
    mainPinElem.style.top = MAIN_PIN_DEFAULT_POSITION.Y + 'px';
    window.form.setAddress(mainPinElem, MAIN_PIN_SIZE.WIDTH / 2, MAIN_PIN_SIZE.HEIGHT / 2);
    mainPinElem.addEventListener('mouseup', onMainPinClick);
    mainPinElem.addEventListener('keydown', onMainPinEnterPress);
  };

  window.form.setAddress(mainPinElem, MAIN_PIN_SIZE.WIDTH / 2, MAIN_PIN_SIZE.HEIGHT / 2);
  window.form.disableForm(true);
  document.addEventListener('resetAll', onResetAll);
  mainPinElem.addEventListener('mouseup', onMainPinClick);
  mainPinElem.addEventListener('keydown', onMainPinEnterPress);

})();

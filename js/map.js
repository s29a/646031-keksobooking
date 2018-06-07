'use strict';

var OFFERS_COUNT = 8;
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var OFFER_TYPES = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUTS = OFFER_CHECKINS;
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR_URL = 'img/avatars/user';
var AVATAR_FORMAT = '.png';
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var ACTIVE_OFFER_INDEX = 0;

var getRandomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomArrItem = function (arr, del) {
  var randomInt = getRandomInt(0, arr.length - 1);
  var randomItem = arr[randomInt];

  if (del) {
    arr.splice(randomInt, 1);
  }

  return randomItem;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var shuffleArr = function (arr) {
  arr.sort(compareRandom);

  return arr;
};

var addZero = function (num) {
  return (num < 10 ? '0' : '') + num;
};

var getAvatarArr = function (count) {
  var arr = [];

  for (var i = 0; i < count; i++) {
    arr[i] = AVATAR_URL + addZero(i + 1) + AVATAR_FORMAT;
  }

  shuffleArr(arr);

  return arr;
};

var convertArrToRandomString = function (arr, randomLength) {
  var count = randomLength ? getRandomInt(0, arr.length) : arr.length;

  return arr.slice(0, count).join(' ');
};

var getRandomOffer = function (count) {
  var arr = [];
  var avatars = getAvatarArr(count);
  var titles = OFFER_TITLES.slice();

  for (var i = 0; i < count; i++) {
    var x = getRandomInt(300, 900);
    var y = getRandomInt(130, 630);

    arr[i] = {
      author: {avatar: getRandomArrItem(avatars, true)},
      offer: {
        title: getRandomArrItem(titles, true),
        address: x + ', ' + y,
        price: getRandomInt(1000, 1000000),
        type: getRandomArrItem(Object.keys(OFFER_TYPES)),
        rooms: getRandomInt(1, 5),
        guests: getRandomInt(1, 20),
        checkin: getRandomArrItem(OFFER_CHECKINS),
        checkout: getRandomArrItem(OFFER_CHECKOUTS),
        features: convertArrToRandomString(shuffleArr(OFFER_FEATURES.slice()), true),
        description: '',
        photos: shuffleArr(OFFER_PHOTOS.slice())
      },
      location: {
        x: x,
        y: y
      }
    };
  }

  return arr;
};

var renderMapPin = function (card) {
  var pinElement = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
  var pinImage = pinElement.querySelector('img');
  var x = card.location.x - PIN_WIDTH / 2;
  var y = card.location.y - PIN_HEIGHT;

  pinImage.src = card.author.avatar;
  pinImage.alt = card.offer.title;
  pinElement.style = 'left: ' + x + 'px; top: ' + y + 'px;';

  return pinElement;
};

var createFeatureItem = function (item) {
  var featureItem = document.createElement('li');
  featureItem.classList.add('popup__feature', 'popup__feature--' + item);

  return featureItem;
};

var createPhotoItem = function (item) {
  var photoItem = document.querySelector('template').content.querySelector('.popup__photo').cloneNode();
  photoItem.src = item;

  return photoItem;
};

var removeAllChilds = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var renderItemList = function (item, createFunction) {
  var fragment = document.createDocumentFragment();
  if (item) {
    if (!Array.isArray(item)) {
      item = item.split(' ');
    }
    for (var i = 0; i < item.length; i++) {
      fragment.appendChild(createFunction(item[i]));
    }
  }

  return fragment;
};

var renderOffer = function (card) {
  var offerElement = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

  offerElement.querySelector('.popup__avatar').src = card.author.avatar;
  offerElement.querySelector('.popup__title').textContent = card.offer.title;
  offerElement.querySelector('.popup__text--address').textContent = card.offer.address;
  offerElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  offerElement.querySelector('.popup__type').textContent = OFFER_TYPES[card.offer.type];
  offerElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

  var featureList = offerElement.querySelector('.popup__features');
  removeAllChilds(featureList);
  featureList.appendChild(renderItemList(card.offer.features, createFeatureItem));

  offerElement.querySelector('.popup__description').textContent = card.offer.description;

  var photos = offerElement.querySelector('.popup__photos');
  removeAllChilds(photos);
  photos.appendChild(renderItemList(card.offer.photos, createPhotoItem));

  return offerElement;
};

var showMapPins = function (offers) {
  var mapPinsElem = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderMapPin(offers[i]));
  }

  mapPinsElem.appendChild(fragment);
};

var showOffer = function (card) {
  var before = document.querySelector('.map__filters-container');
  document.querySelector('.map').appendChild(card, before);
};

var showMap = function (offerCount, activeOfferIndex) {
  var map = document.querySelector('.map');
  var arr = getRandomOffer(offerCount);
  map.classList.remove('map--faded');
  showOffer(renderOffer(arr[activeOfferIndex]));
  showMapPins(arr);
};

showMap(OFFERS_COUNT, ACTIVE_OFFER_INDEX);

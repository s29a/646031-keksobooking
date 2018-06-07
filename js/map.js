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

var getRandomNum = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomArrItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

  shuffleArr(arr);

  for (var i = 0; i < count; i++) {
    arr[i] = AVATAR_URL + addZero(i + 1) + AVATAR_FORMAT;
  }

  return arr;
};

var convertArrToRandomString = function (arr, randomLength) {
  var count = randomLength ? getRandomNum(0, arr.length) : arr.length;

  return arr.slice(0, count).join(' ');
};

var getRandomOffer = function (count) {
  var arr = [];
  var avatars = getAvatarArr(count);
  var titles = OFFER_TITLES.slice();

  shuffleArr(titles);
  shuffleArr(avatars);

  for (var i = 0; i < count; i++) {
    var x = getRandomNum(300, 900);
    var y = getRandomNum(130, 630);

    arr[i] = {
      author: {avatar: avatars[i]},
      offer: {
        title: titles[i],
        address: x + ', ' + y,
        price: getRandomNum(1000, 1000000),
        type: getRandomArrItem(Object.keys(OFFER_TYPES)),
        rooms: getRandomNum(1, 5),
        guests: getRandomNum(1, 20),
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

var map = document.querySelector('.map');
map.classList.remove('map--faded');

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

var removeAllChilds = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var renderFeatureList = function (features) {
  var featureListFragment = document.createDocumentFragment();
  if (features) {
    var arr = features.split(' ');
    for (var i = 0; i < arr.length; i++) {
      featureListFragment.appendChild(createFeatureItem(arr[i]));
    }
  }

  return featureListFragment;
};

var createPhotoItem = function (item) {
  var photoItem = document.querySelector('template').content.querySelector('.popup__photo').cloneNode();
  photoItem.src = item;

  return photoItem;
};

var renderPhotosList = function (photos) {
  var photoListFragment = document.createDocumentFragment();
  if (photos) {
    for (var i = 0; i < photos.length; i++) {
      photoListFragment.appendChild(createPhotoItem(photos[i]));
    }
  }

  return photoListFragment;
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
  featureList.appendChild(renderFeatureList(card.offer.features));

  offerElement.querySelector('.popup__description').textContent = card.offer.description;

  var photos = offerElement.querySelector('.popup__photos');
  removeAllChilds(photos);
  photos.appendChild(renderPhotosList(card.offer.photos));

  return offerElement;
};

var showMapPins = function (offers) {
  var mapPinsElem = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderMapPin(offers[i]));
  }

  mapPinsElem.appendChild(fragment);
};

var showOffer = function (card) {
  var before = map.querySelector('.map__filters-container');
  map.appendChild(card, before);
};

var showMap = function (offerCount, activeOfferIndex) {
  var arr = getRandomOffer(offerCount);
  showOffer(renderOffer(arr[activeOfferIndex]));
  showMapPins(arr);
};

showMap(OFFERS_COUNT, ACTIVE_OFFER_INDEX);

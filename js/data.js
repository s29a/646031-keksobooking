'use strict';

(function () {

  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var AVATAR_URL = 'img/avatars/user';
  var AVATAR_FORMAT = '.png';
  var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
  var OFFER_CHECKOUTS = OFFER_CHECKINS;
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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


  var convertArrToRandomString = function (arr, randomLength) {
    var count = randomLength ? getRandomInt(0, arr.length) : arr.length;

    return arr.slice(0, count).join(' ');
  };

  var getAvatarArr = function (count) {
    var arr = [];

    for (var i = 0; i < count; i++) {
      arr[i] = AVATAR_URL + addZero(i + 1) + AVATAR_FORMAT;
    }

    shuffleArr(arr);

    return arr;
  };

  window.data = {
    OFFER_TYPES: {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },

    ADDRESS: {
      X: {
        MIN: 300,
        MAX: 900
      },
      Y: {
        MIN: 130,
        MAX: 630
      }
    },
    getRandomOffer: function (count) {
      var arr = [];
      var avatars = getAvatarArr(count);
      var titles = OFFER_TITLES.slice();

      for (var i = 0; i < count; i++) {
        var x = getRandomInt(window.data.ADDRESS.X.MIN, window.data.ADDRESS.X.MAX);
        var y = getRandomInt(window.data.ADDRESS.Y.MIN, window.data.ADDRESS.Y.MAX);

        arr[i] = {
          author: {avatar: getRandomArrItem(avatars, true)},
          offer: {
            title: getRandomArrItem(titles, true),
            address: x + ', ' + y,
            price: getRandomInt(1000, 1000000),
            type: getRandomArrItem(Object.keys(window.data.OFFER_TYPES)),
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
    }
  };

})();

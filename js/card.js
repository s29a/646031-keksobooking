'use strict';

(function () {
  var OFFER_TYPES = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var createFeatureItem = function (item) {
    var featureItemElem = document.createElement('li');
    featureItemElem.classList.add('popup__feature', 'popup__feature--' + item);

    return featureItemElem;
  };

  var createPhotoItem = function (item, template) {
    var photoItemElem = template.content.querySelector('.popup__photo').cloneNode();
    photoItemElem.src = item;

    return photoItemElem;
  };

  var removeAllChilds = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  var renderItemList = function (items, createFunction, template) {
    var fragment = document.createDocumentFragment();
    if (items) {
      if (!Array.isArray(items)) {
        items = items.split(' ');
      }
      items.forEach(function (item) {
        fragment.appendChild(createFunction(item, template));
      });
    }

    return fragment;
  };

  window.card = {
    renderOffer: function (card, template) {
      var offerElement = template.content.querySelector('.map__card').cloneNode(true);

      offerElement.querySelector('.popup__avatar').src = card.author.avatar;
      offerElement.querySelector('.popup__title').textContent = card.offer.title;
      offerElement.querySelector('.popup__text--address').textContent = card.offer.address;
      offerElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
      offerElement.querySelector('.popup__type').textContent = OFFER_TYPES[card.offer.type];
      offerElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
      offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

      var featureListElem = offerElement.querySelector('.popup__features');
      removeAllChilds(featureListElem);
      featureListElem.appendChild(renderItemList(card.offer.features, createFeatureItem, template));

      offerElement.querySelector('.popup__description').textContent = card.offer.description;

      var photosElem = offerElement.querySelector('.popup__photos');
      removeAllChilds(photosElem);
      photosElem.appendChild(renderItemList(card.offer.photos, createPhotoItem, template));

      return offerElement;
    }
  };
})();

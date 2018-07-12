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
    var photoItemElem = template.querySelector('.popup__photo').cloneNode();
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

  var template;
  var photosElem;
  var popupOfferElem;

  window.card = {
    createOfferPopup: function (element) {
      template = element.content.querySelector('.map__card');
      popupOfferElem = template.cloneNode(true);
      photosElem = popupOfferElem.querySelector('.popup__photos');
      return popupOfferElem;
    },
    renderOffer: function (card) {

      popupOfferElem.querySelector('.popup__avatar').src = card.author.avatar;
      popupOfferElem.querySelector('.popup__title').textContent = card.offer.title;
      popupOfferElem.querySelector('.popup__text--address').textContent = card.offer.address;
      popupOfferElem.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
      popupOfferElem.querySelector('.popup__type').textContent = OFFER_TYPES[card.offer.type];
      popupOfferElem.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
      popupOfferElem.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

      var featureListElem = popupOfferElem.querySelector('.popup__features');
      removeAllChilds(featureListElem);

      if (card.offer.features.length > 0) {
        featureListElem.classList.remove('hidden');
        featureListElem.appendChild(renderItemList(card.offer.features, createFeatureItem, template));
      } else {
        featureListElem.classList.add('hidden');
      }

      popupOfferElem.querySelector('.popup__description').textContent = card.offer.description;

      removeAllChilds(photosElem);
      if (card.offer.photos.length > 0) {
        photosElem.appendChild(renderItemList(card.offer.photos, createPhotoItem, template));
        popupOfferElem.appendChild(photosElem);
      } else {
        popupOfferElem.removeChild(photosElem);
      }
    }
  };
})();

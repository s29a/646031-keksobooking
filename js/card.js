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

  var createPhotoItem = function (item) {
    var photoItemElem = template.querySelector('.popup__photo').cloneNode();
    photoItemElem.src = item;

    return photoItemElem;
  };

  var removeAllChilds = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  var renderListElement = function (element, items, beforeElement, createItemFunction) {
    removeAllChilds(element);
    if (items.length > 0) {
      if (!Array.isArray(items)) {
        items = items.split(' ');
      }
      items.forEach(function (item) {
        element.appendChild(createItemFunction(item));
      });
      popupOfferElem.insertBefore(element, beforeElement);
    } else {
      popupOfferElem.removeChild(element);
    }
  };

  var template;
  var photosElem;
  var popupOfferElem;
  var featureListElem;

  window.card = {
    createOfferPopup: function (element) {
      template = element.content.querySelector('.map__card');
      popupOfferElem = template.cloneNode(true);
      photosElem = popupOfferElem.querySelector('.popup__photos');
      featureListElem = popupOfferElem.querySelector('.popup__features');
      return popupOfferElem;
    },
    renderOffer: function (card) {
      var descriptionElem = popupOfferElem.querySelector('.popup__description');

      popupOfferElem.querySelector('.popup__avatar').src = card.author.avatar;
      popupOfferElem.querySelector('.popup__title').textContent = card.offer.title;
      popupOfferElem.querySelector('.popup__text--address').textContent = card.offer.address;
      popupOfferElem.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
      popupOfferElem.querySelector('.popup__type').textContent = OFFER_TYPES[card.offer.type];
      popupOfferElem.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
      popupOfferElem.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

      renderListElement(featureListElem, card.offer.features, descriptionElem, createFeatureItem);

      descriptionElem.textContent = card.offer.description;

      renderListElement(photosElem, card.offer.photos, null, createPhotoItem);
    }
  };
})();

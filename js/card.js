'use strict';

(function () {
  var createFeatureItem = function (item) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature', 'popup__feature--' + item);

    return featureItem;
  };

  var createPhotoItem = function (item, template) {
    var photoItem = template.content.querySelector('.popup__photo').cloneNode();
    photoItem.src = item;

    return photoItem;
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
      offerElement.querySelector('.popup__type').textContent = window.data.OFFER_TYPES[card.offer.type];
      offerElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
      offerElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

      var featureList = offerElement.querySelector('.popup__features');
      removeAllChilds(featureList);
      featureList.appendChild(renderItemList(card.offer.features, createFeatureItem, template));

      offerElement.querySelector('.popup__description').textContent = card.offer.description;

      var photos = offerElement.querySelector('.popup__photos');
      removeAllChilds(photos);
      photos.appendChild(renderItemList(card.offer.photos, createPhotoItem, template));

      return offerElement;
    }
  };
})();

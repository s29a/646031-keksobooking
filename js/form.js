'use strict';

(function () {
  var MIN_PRICES = {
    palace: '10000',
    flat: '1000',
    house: '5000',
    bungalo: '0'
  };
  var formElem = document.querySelector('.ad-form');
  var formPriceElem = formElem.querySelector('[name="price"]');
  var formTypeElem = formElem.querySelector('[name="type"]');
  var formCheckInElem = formElem.querySelector('[name="timein"]');
  var formCheckOutElem = formElem.querySelector('[name="timeout"]');
  var formElements = formElem.querySelectorAll('.ad-form fieldset');
  var formAddressElem = formElem.querySelector('#address');
  var photoChooserElem = formElem.querySelector('input[name=images]');
  var photoPreviewElem = formElem.querySelector('.ad-form__photo');
  var photoContainerElem = formElem.querySelector('.ad-form__photo-container');
  var avatarChooserElem = formElem.querySelector('input[name=avatar]');
  var avatarPrewiewElem = formElem.querySelector('.ad-form-header__preview img');
  var defaultAvatarImg = avatarPrewiewElem.src;

  window.form = {
    disableForm: function (disabled) {
      formElements.forEach(function (item) {
        item.disabled = disabled;
      });

      if (disabled) {
        formElem.classList.add('ad-form--disabled');
      } else {
        formElem.classList.remove('ad-form--disabled');
      }
    },

    setAddress: function (pin, pinWidth, pinHeight) {
      formAddressElem.disabled = true;
      formAddressElem.value = parseInt(Math.floor(pin.style.left.slice(0, -2)) + pinWidth / 2, 10) + ', ' + parseInt(Math.floor(pin.style.top.slice(0, -2)) + pinHeight, 10);
    },

    onError: function (errorMessage) {
      var errorElement = document.querySelector('.success').cloneNode(true);
      errorElement.style.backgroundColor = 'rgba(150, 0, 0, 0.8)';
      errorElement.querySelector('p').textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorElement);
      errorElement.classList.remove('hidden');

      var onErrorElementKeydown = function (evt) {
        window.util.isEscEvent(evt, removeError);
      };

      var removeError = function () {
        errorElement.remove();
        document.removeEventListener('keydown', onErrorElementKeydown);
      };

      errorElement.addEventListener('click', function () {
        removeError();
      });

      document.addEventListener('keydown', onErrorElementKeydown);
    }
  };

  var onFormReset = function () {
    formElem.reset();
    typeChange();
    window.util.removeAll(formElem.querySelectorAll('.ad-form__photo'));
    photoContainerElem.appendChild(photoPreviewElem);
    avatarPrewiewElem.src = defaultAvatarImg;
    document.dispatchEvent(new Event('resetAll'));
  };

  formElem.querySelector('.ad-form__reset').addEventListener('click', function (evt) {
    evt.preventDefault();
    onFormReset();
  });

  var onSubmit = function () {
    var successElement = document.querySelector('.success');
    onFormReset();
    successElement.classList.remove('hidden');

    var onSuccesElementKeydown = function (evt) {
      window.util.isEscEvent(evt, hideElement);
    };

    var hideElement = function () {
      successElement.classList.add('hidden');
      document.removeEventListener('keydown', onSuccesElementKeydown);
    };

    successElement.addEventListener('click', function () {
      hideElement();
    });

    document.addEventListener('keydown', onSuccesElementKeydown);
  };

  formElem.addEventListener('submit', function (evt) {
    formAddressElem.disabled = false;
    window.backend.save(new FormData(formElem), onSubmit, window.form.onError);
    evt.preventDefault();
  });

  formTypeElem.addEventListener('change', function () {
    typeChange();
  });

  formCheckInElem.addEventListener('change', function () {
    syncItem(formCheckInElem, formCheckOutElem);
  });

  formCheckOutElem.addEventListener('change', function () {
    syncItem(formCheckOutElem, formCheckInElem);
  });

  var typeChange = function () {
    formPriceElem.min = MIN_PRICES[formTypeElem.value];
    formPriceElem.placeholder = MIN_PRICES[formTypeElem.value];
  };

  var syncItem = function (changed, syncing) {
    syncing.selectedIndex = changed.selectedIndex;
  };

  photoChooserElem.addEventListener('change', function () {
    window.util.removeAll(formElem.querySelectorAll('.ad-form__photo'));

    for (var i = 0; i < photoChooserElem.files.length; i++) {
      var imgElement = document.createElement('img');
      var newPhotoElement = photoPreviewElem.cloneNode();

      imgElement.width = '70';
      imgElement.height = '70';
      newPhotoElement.appendChild(imgElement);
      window.images.getPreview(photoChooserElem.files[i], imgElement);
      photoContainerElem.appendChild(newPhotoElement);
    }
  });

  avatarChooserElem.addEventListener('change', function () {
    window.images.getPreview(avatarChooserElem.files[0], avatarPrewiewElem);
  });

})();

'use strict';

(function () {
  var MIN_PRICES = {
    palace: '10000',
    flat: '1000',
    house: '5000',
    bungalo: '0'
  };
  var form = document.querySelector('.ad-form');
  var formPrice = form.querySelector('[name="price"]');
  var formType = form.querySelector('[name="type"]');
  var formCheckIn = form.querySelector('[name="timein"]');
  var formCheckOut = form.querySelector('[name="timeout"]');
  var formElements = form.querySelectorAll('.ad-form fieldset');
  var formAddress = form.querySelector('#address');

  window.form = {
    disableForm: function (disabled) {
      formElements.forEach(function (item) {
        item.disabled = disabled;
      });

      if (disabled) {
        form.classList.add('ad-form--disabled');
      } else {
        form.classList.remove('ad-form--disabled');
      }
    },

    setAddress: function (pin, pinWidth, pinHeight) {
      formAddress.disabled = true;
      formAddress.value = parseInt(Math.floor(pin.style.left.slice(0, -2)) + pinWidth / 2, 10) + ', ' + parseInt(Math.floor(pin.style.top.slice(0, -2)) + pinHeight, 10);
    },

    errorHandler: function (errorMessage) {
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
    form.reset();
    typeChange();
    document.dispatchEvent(new Event('resetAll'));
  };

  form.querySelector('.ad-form__reset').addEventListener('click', function (evt) {
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

  form.addEventListener('submit', function (evt) {
    formAddress.disabled = false;
    window.backend.save(new FormData(form), onSubmit, window.form.errorHandler);
    evt.preventDefault();
  });

  formType.addEventListener('change', function () {
    typeChange();
  });

  formCheckIn.addEventListener('change', function () {
    syncItem(formCheckIn, formCheckOut);
  });

  formCheckOut.addEventListener('change', function () {
    syncItem(formCheckOut, formCheckIn);
  });

  var typeChange = function () {
    formPrice.min = MIN_PRICES[formType.value];
    formPrice.placeholder = MIN_PRICES[formType.value];
  };

  var syncItem = function (changed, syncing) {
    syncing.selectedIndex = changed.selectedIndex;
  };

  var photoChooser = form.querySelector('input[name=images]');
  var photoPreview = form.querySelector('.ad-form__photo');
  var photoContainer = form.querySelector('.ad-form__photo-container');

  photoChooser.addEventListener('change', function () {
    var photoPreviews = form.querySelectorAll('.ad-form__photo');

    window.util.removeAll(photoPreviews);

    for (var i = 0; i < photoChooser.files.length; i++) {
      var imgElement = document.createElement('img');
      var newPhoto = photoPreview.cloneNode();

      imgElement.width = '70';
      imgElement.height = '70';
      newPhoto.appendChild(imgElement);
      window.images.getPreview(photoChooser.files[i], imgElement);
      photoContainer.appendChild(newPhoto);
    }
  });

  var avatarChooser = form.querySelector('input[name=avatar]');
  var avatarPrewiew = form.querySelector('.ad-form-header__preview img');

  avatarChooser.addEventListener('change', function () {
    window.images.getPreview(avatarChooser.files[0], avatarPrewiew);
  });

})();

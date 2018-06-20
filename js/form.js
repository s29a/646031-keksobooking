'use strict';

(function () {
  var MIN_PRICES = {
    palace: '10000',
    flat: '1000',
    house: '5000',
    bungalo: '0'
  };
  var ROOMS_CAPACITY = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };
  var form = document.querySelector('.ad-form');
  var formPrice = form.querySelector('[name="price"]');
  var formType = form.querySelector('[name="type"]');
  var formCheckIn = form.querySelector('[name="timein"]');
  var formCheckOut = form.querySelector('[name="timeout"]');
  var formRooms = form.querySelector('[name="rooms"]');
  var formCapacity = form.querySelector('[name="capacity"]');
  var formElements = form.querySelectorAll('.ad-form fieldset');
  var formAddress = form.querySelector('#address');

  formType.addEventListener('change', function () {
    formPrice.min = MIN_PRICES[formType.value];
    formPrice.placeholder = MIN_PRICES[formType.value];
  });

  formCheckIn.addEventListener('change', function () {
    syncItem(formCheckIn, formCheckOut);
  });

  formCheckOut.addEventListener('change', function () {
    syncItem(formCheckOut, formCheckIn);
  });

  formRooms.addEventListener('change', function () {
    roomCheck();
  });

  formCapacity.addEventListener('change', function () {
    roomCheck();
  });

  var roomCheck = function () {
    var arr = ROOMS_CAPACITY[formRooms.value].slice();
    formCapacity.setCustomValidity('');
    if (arr.indexOf(parseInt(formCapacity.value, 10)) < 0) {
      formCapacity.setCustomValidity('Число комнат не соответствует количеству гостей');
    }
  };

  var syncItem = function (changed, syncing) {
    syncing.selectedIndex = changed.selectedIndex;
  };

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
    }
  };
})();

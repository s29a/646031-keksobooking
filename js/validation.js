'use strict';
(function () {
  var ERROR_TEXT_COLOR = 'red';
  var VALIDATION_DEBOUNCE_INTERVAL = 300;
  var ROOMS_CAPACITY = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var formRooms = document.querySelector('[name="rooms"]');

  function CustomValidation() {
    this.invalidities = [];
    this.validityChecks = [];
    this.errorElement = null;
  }

  CustomValidation.prototype = {
    addInvalidity: function (message) {
      this.invalidities.push(message);
    },
    getInvalidities: function () {
      return this.invalidities.join('. \n');
    },
    createElement: function (input) {
      this.errorElement = document.createElement('p');
      this.errorElement.style.color = ERROR_TEXT_COLOR;
      this.errorElement.classList.add('validation__error');
      input.parentElement.appendChild(this.errorElement);
    },
    checkValidity: function (input) {
      for (var i = 0; i < this.validityChecks.length; i++) {
        if (!this.errorElement) {
          this.createElement(input);
        }

        var isInvalid = this.validityChecks[i].isInvalid(input);
        if (isInvalid) {
          this.addInvalidity(this.validityChecks[i].getInvalidityMessage(input));
        }
      }
    }
  };

  var titleValidityChecks = [
    {
      isInvalid: function (input) {
        return input.value.length < input.minLength;
      },
      getInvalidityMessage: function (input) {
        return 'Минимально допустимое количество символов: ' + input.minLength + '. Длина текста сейчас: ' + input.value.length;
      }
    },
    {
      isInvalid: function (input) {
        return input.value.length > input.maxLength;
      },
      getInvalidityMessage: function (input) {
        return 'Максимально допустимое количество символов: ' + input.maxLength + '. Длина текста сейчас: ' + input.value.length;
      }
    }
  ];

  var priceValidityChecks = [
    {
      isInvalid: function (input) {
        return input.value.length === 0;
      },
      getInvalidityMessage: function () {
        return 'Заполните это поле';
      }
    },
    {
      isInvalid: function (input) {
        return parseInt(input.value, 10) < parseInt(input.min, 10);
      },
      getInvalidityMessage: function (input) {
        return 'Минимальная цена не может быть меньше: ' + input.min;
      }
    },
    {
      isInvalid: function (input) {
        return parseInt(input.value, 10) > parseInt(input.max, 10);
      },
      getInvalidityMessage: function (input) {
        return 'Минимальная цена не может быть блольше: ' + input.max;
      }
    }
  ];


  var capacityValidityCheck = [
    {
      isInvalid: function (input) {
        var arr = ROOMS_CAPACITY[formRooms.value].slice();
        return arr.indexOf(parseInt(input.value, 10)) < 0;
      },
      getInvalidityMessage: function () {
        return 'Число комнат не соответствует количеству гостей';
      }
    },
  ];

  function checkInput(input) {
    input.CustomValidation.invalidities = [];
    input.CustomValidation.checkValidity(input);
    if (input.CustomValidation.invalidities.length === 0 && input.value !== '') {
      input.setCustomValidity('');
      input.CustomValidation.errorElement.textContent = '';
    } else {
      var message = input.CustomValidation.getInvalidities();
      input.setCustomValidity(message);
      input.CustomValidation.errorElement.textContent = message;
    }
  }

  var titleInput = document.querySelector('input[name="title"]');
  var priceInput = document.querySelector('input[name="price"]');
  var capacityInput = document.querySelector('[name="capacity"]');

  titleInput.CustomValidation = new CustomValidation();
  titleInput.CustomValidation.validityChecks = titleValidityChecks;

  priceInput.CustomValidation = new CustomValidation();
  priceInput.CustomValidation.validityChecks = priceValidityChecks;

  capacityInput.CustomValidation = new CustomValidation();
  capacityInput.CustomValidation.validityChecks = capacityValidityCheck;

  var inputs = document.querySelectorAll('input:required');
  var submit = document.querySelector('.ad-form__submit');

  var onPriceInputKeyup = window.debounce(function () {
    checkInput(priceInput);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onTitleInputKeyup = window.debounce(function () {
    checkInput(titleInput);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onCapacityInputChange = window.debounce(function () {
    checkInput(capacityInput);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  priceInput.addEventListener('keyup', onPriceInputKeyup);

  titleInput.addEventListener('keyup', onTitleInputKeyup);

  capacityInput.addEventListener('change', onCapacityInputChange);

  submit.addEventListener('click', function (e) {
    var stopSubmit = false;

    for (var i = 0; i < inputs.length; i++) {
      checkInput(inputs[i]);
    }

    if (stopSubmit) {
      e.preventDefault();
    }
  });

})();

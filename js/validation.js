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

  var formRoomsElem = document.querySelector('[name="rooms"]');

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
        var arr = ROOMS_CAPACITY[formRoomsElem.value].slice();
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

  var titleInputElem = document.querySelector('input[name="title"]');
  var priceInputElem = document.querySelector('input[name="price"]');
  var capacityInputElem = document.querySelector('[name="capacity"]');

  titleInputElem.CustomValidation = new CustomValidation();
  titleInputElem.CustomValidation.validityChecks = titleValidityChecks;

  priceInputElem.CustomValidation = new CustomValidation();
  priceInputElem.CustomValidation.validityChecks = priceValidityChecks;

  capacityInputElem.CustomValidation = new CustomValidation();
  capacityInputElem.CustomValidation.validityChecks = capacityValidityCheck;

  var inputs = document.querySelectorAll('input:required');
  var submit = document.querySelector('.ad-form__submit');

  var onPriceInputKeyup = window.debounce(function () {
    checkInput(priceInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onTitleInputKeyup = window.debounce(function () {
    checkInput(titleInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onCapacityInputChange = window.debounce(function () {
    checkInput(capacityInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  priceInputElem.addEventListener('keyup', onPriceInputKeyup);

  titleInputElem.addEventListener('keyup', onTitleInputKeyup);

  capacityInputElem.addEventListener('change', onCapacityInputChange);

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

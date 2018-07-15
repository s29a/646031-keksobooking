'use strict';

(function () {
  var ERROR_TEXT_COLOR = 'red';
  var ERROR_BORDER_STYLE = '1px solid red';
  var VALIDATION_DEBOUNCE_INTERVAL = 300;
  var ROOMS_CAPACITY = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var formElem = document.querySelector('.ad-form');
  var titleInputElem = formElem.querySelector('input[name="title"]');
  var priceInputElem = formElem.querySelector('input[name="price"]');
  var capacityInputElem = formElem.querySelector('[name="capacity"]');
  var inputs = [titleInputElem, priceInputElem, capacityInputElem];
  var submit = formElem.querySelector('.ad-form__submit');

  var roomsInputElem = formElem.querySelector('[name="rooms"]');
  var typeInputElem = formElem.querySelector('[name="type"]');

  window.validation = {
    clearErrors: function () {
      inputs.forEach(function (item) {
        item.CustomValidation.clearErrorElement();
        item.style.border = '';
      });
    }
  };

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
    createErrorElement: function (input) {
      this.errorElement = document.createElement('p');
      this.errorElement.style.color = ERROR_TEXT_COLOR;
      this.errorElement.style.height = '2em';
      this.errorElement.style.margin = '0';
      this.errorElement.style.width = 'calc(100% - 20px)';
      this.errorElement.classList.add('validation__error');
      input.parentElement.appendChild(this.errorElement);
    },
    clearErrorElement: function () {
      this.errorElement.textContent = '';
    },
    checkValidity: function (input) {
      for (var i = 0; i < this.validityChecks.length; i++) {
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
        var arr = ROOMS_CAPACITY[roomsInputElem.value].slice();
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
      input.style.border = '';
      input.setCustomValidity('');
      input.CustomValidation.errorElement.textContent = '';
    } else {
      var message = input.CustomValidation.getInvalidities();
      input.style.border = ERROR_BORDER_STYLE;
      input.setCustomValidity(message);
      input.CustomValidation.errorElement.textContent = message;
    }
  }

  var createCustomValidity = function (input, checkFunction) {
    input.CustomValidation = new CustomValidation();
    input.CustomValidation.validityChecks = checkFunction;
    input.CustomValidation.createErrorElement(input);
  };

  createCustomValidity(titleInputElem, titleValidityChecks);
  createCustomValidity(priceInputElem, priceValidityChecks);
  createCustomValidity(capacityInputElem, capacityValidityCheck);

  var onPriceInputKeyup = window.debounce(function () {
    checkInput(priceInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onTypeInputChange = window.debounce(function () {
    checkInput(priceInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onTitleInputKeyup = window.debounce(function () {
    checkInput(titleInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onCapacityInputChange = window.debounce(function () {
    checkInput(capacityInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  var onRoomsInputChange = window.debounce(function () {
    checkInput(capacityInputElem);
  }, VALIDATION_DEBOUNCE_INTERVAL);

  priceInputElem.addEventListener('keyup', onPriceInputKeyup);

  titleInputElem.addEventListener('keyup', onTitleInputKeyup);

  capacityInputElem.addEventListener('change', onCapacityInputChange);

  roomsInputElem.addEventListener('change', onRoomsInputChange);
  typeInputElem.addEventListener('change', onTypeInputChange);

  submit.addEventListener('click', function () {
    for (var i = 0; i < inputs.length; i++) {
      checkInput(inputs[i]);
    }
  });
})();

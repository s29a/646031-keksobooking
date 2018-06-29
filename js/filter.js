'use strict';

(function () {
  var NONE_FILTRED = 'any';
  var LOW_COST = 'low';
  var MIDDLE_COST = 'middle';
  var HIGH_COST = 'high';
  var PRICE_GRADATION = {
    low: 10000,
    high: 50000
  };

  var checkFilterValue = function (offerValue, filterValue) {
    return filterValue === NONE_FILTRED || filterValue === offerValue.toString();
  };

  var checkFilterRangeValue = function (cost, filterValue) {
    return filterValue === NONE_FILTRED || filterValue === getCostGradation(cost);
  };

  var checkFilterArr = function (arr, filterArr) {
    return filterArr.every(function (futureItem) {
      return arr.indexOf(futureItem) >= 0;
    });
  };

  var getCostGradation = function (cost) {
    switch (true) {
      case cost < PRICE_GRADATION.low:
        return LOW_COST;

      case cost > PRICE_GRADATION.high:
        return HIGH_COST;

      default:
        return MIDDLE_COST;
    }
  };

  window.filter = function (data, filters) {
    return data.filter(function (item) {
      return checkFilterValue(item.offer.type, filters.type) &&
        checkFilterRangeValue(item.offer.price, filters.cost) &&
        checkFilterValue(item.offer.rooms, filters.rooms) &&
        checkFilterValue(item.offer.guests, filters.guests) &&
        checkFilterArr(item.offer.features, filters.features);
    });
  };
})();

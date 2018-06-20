'use strict';

(function () {
  var KEYCODE = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32
  };

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEYCODE.ESC) {
        action(evt);
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KEYCODE.ENTER) {
        action(evt);
      }
    },
    isSpaceEvent: function (evt, action) {
      if (evt.keyCode === KEYCODE.SPACE) {
        action(evt);
      }
    }
  };
})();

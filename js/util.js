'use strict';

(function () {
  var Keycode = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32
  };

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ESC) {
        action(evt);
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ENTER) {
        action(evt);
      }
    },
    isSpaceEvent: function (evt, action) {
      if (evt.keyCode === Keycode.SPACE) {
        action(evt);
      }
    }
  };
})();

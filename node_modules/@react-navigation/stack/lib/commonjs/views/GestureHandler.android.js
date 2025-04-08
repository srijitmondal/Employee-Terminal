"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _GestureHandlerNative = require("./GestureHandlerNative.js");
Object.keys(_GestureHandlerNative).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _GestureHandlerNative[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _GestureHandlerNative[key];
    }
  });
});
//# sourceMappingURL=GestureHandler.android.js.map
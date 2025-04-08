"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GestureHandlerRootView", {
  enumerable: true,
  get: function () {
    return _reactNativeGestureHandler.GestureHandlerRootView;
  }
});
Object.defineProperty(exports, "GestureState", {
  enumerable: true,
  get: function () {
    return _reactNativeGestureHandler.State;
  }
});
exports.PanGestureHandler = PanGestureHandler;
var React = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _GestureHandlerRefContext = require("../utils/GestureHandlerRefContext.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function PanGestureHandler(props) {
  const gestureRef = React.useRef(null);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_GestureHandlerRefContext.GestureHandlerRefContext.Provider, {
    value: gestureRef,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.PanGestureHandler, {
      ...props,
      ref: gestureRef
    })
  });
}
//# sourceMappingURL=GestureHandlerNative.js.map
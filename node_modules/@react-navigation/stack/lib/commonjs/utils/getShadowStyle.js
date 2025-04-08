"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShadowStyle = getShadowStyle;
var _color = _interopRequireDefault(require("color"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getShadowStyle({
  offset,
  radius,
  opacity,
  color = '#000'
}) {
  const result = _reactNative.Platform.select({
    web: {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${(0, _color.default)(color).alpha(opacity).toString()}`
    },
    default: {
      shadowOffset: offset,
      shadowRadius: radius,
      shadowColor: color,
      shadowOpacity: opacity
    }
  });
  return result;
}
//# sourceMappingURL=getShadowStyle.js.map
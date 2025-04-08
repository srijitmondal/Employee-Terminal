"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDistanceForDirection = getDistanceForDirection;
var _getInvertedMultiplier = require("./getInvertedMultiplier.js");
function getDistanceForDirection(layout, gestureDirection, isRTL) {
  const multiplier = (0, _getInvertedMultiplier.getInvertedMultiplier)(gestureDirection, isRTL);
  switch (gestureDirection) {
    case 'vertical':
    case 'vertical-inverted':
      return layout.height * multiplier;
    case 'horizontal':
    case 'horizontal-inverted':
      return layout.width * multiplier;
  }
}
//# sourceMappingURL=getDistanceForDirection.js.map
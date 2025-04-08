"use strict";

import { ResourceSavingView } from '@react-navigation/elements';
import * as React from 'react';
import { View } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
let Screens;
try {
  Screens = require('react-native-screens');
} catch (e) {
  // Ignore
}
export const MaybeScreenContainer = ({
  enabled,
  ...rest
}) => {
  if (Screens?.screensEnabled?.()) {
    return /*#__PURE__*/_jsx(Screens.ScreenContainer, {
      enabled: enabled,
      ...rest
    });
  }
  return /*#__PURE__*/_jsx(View, {
    ...rest
  });
};
export function MaybeScreen({
  visible,
  children,
  ...rest
}) {
  if (Screens?.screensEnabled?.()) {
    return /*#__PURE__*/_jsx(Screens.Screen, {
      activityState: visible ? 2 : 0,
      ...rest,
      children: children
    });
  }
  return /*#__PURE__*/_jsx(ResourceSavingView, {
    visible: visible,
    ...rest,
    children: children
  });
}
//# sourceMappingURL=ScreenFallback.js.map
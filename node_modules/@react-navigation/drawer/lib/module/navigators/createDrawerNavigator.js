"use strict";

import { createNavigatorFactory, DrawerRouter, useNavigationBuilder } from '@react-navigation/native';
import { DrawerView } from "../views/DrawerView.js";
import { jsx as _jsx } from "react/jsx-runtime";
function DrawerNavigator({
  id,
  initialRouteName,
  defaultStatus = 'closed',
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_router,
  ...rest
}) {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent
  } = useNavigationBuilder(DrawerRouter, {
    id,
    initialRouteName,
    defaultStatus,
    backBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_router
  });
  return /*#__PURE__*/_jsx(NavigationContent, {
    children: /*#__PURE__*/_jsx(DrawerView, {
      ...rest,
      defaultStatus: defaultStatus,
      state: state,
      descriptors: descriptors,
      navigation: navigation
    })
  });
}
export function createDrawerNavigator(config) {
  return createNavigatorFactory(DrawerNavigator)(config);
}
//# sourceMappingURL=createDrawerNavigator.js.map
"use strict";

import { DrawerContentScrollView } from "./DrawerContentScrollView.js";
import { DrawerItemList } from "./DrawerItemList.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function DrawerContent({
  descriptors,
  state,
  ...rest
}) {
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const {
    drawerContentStyle,
    drawerContentContainerStyle
  } = focusedOptions;
  return /*#__PURE__*/_jsx(DrawerContentScrollView, {
    ...rest,
    contentContainerStyle: drawerContentContainerStyle,
    style: drawerContentStyle,
    children: /*#__PURE__*/_jsx(DrawerItemList, {
      descriptors: descriptors,
      state: state,
      ...rest
    })
  });
}
//# sourceMappingURL=DrawerContent.js.map
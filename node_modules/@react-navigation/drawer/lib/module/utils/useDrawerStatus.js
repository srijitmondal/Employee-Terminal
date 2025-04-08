"use strict";

import * as React from 'react';
import { DrawerStatusContext } from "./DrawerStatusContext.js";

/**
 * Hook to detect if the drawer's status in a parent navigator.
 * Returns 'open' if the drawer is open, 'closed' if the drawer is closed.
 */
export function useDrawerStatus() {
  const drawerStatus = React.useContext(DrawerStatusContext);
  if (drawerStatus === undefined) {
    throw new Error("Couldn't find a drawer. Is your component inside a drawer navigator?");
  }
  return drawerStatus;
}
//# sourceMappingURL=useDrawerStatus.js.map
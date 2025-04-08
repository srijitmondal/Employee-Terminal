"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardContainer = void 0;
var _elements = require("@react-navigation/elements");
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ModalPresentationContext = require("../../utils/ModalPresentationContext.js");
var _useKeyboardManager = require("../../utils/useKeyboardManager.js");
var _Card = require("./Card.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const EPSILON = 0.1;
function CardContainerInner({
  interpolationIndex,
  index,
  active,
  opening,
  closing,
  gesture,
  focused,
  modal,
  getPreviousScene,
  getFocusedRoute,
  hasAbsoluteFloatHeader,
  headerHeight,
  onHeaderHeightChange,
  isParentHeaderShown,
  isNextScreenTransparent,
  detachCurrentScreen,
  layout,
  onCloseRoute,
  onOpenRoute,
  onGestureCancel,
  onGestureEnd,
  onGestureStart,
  onTransitionEnd,
  onTransitionStart,
  preloaded,
  renderHeader,
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  scene
}) {
  const {
    direction
  } = (0, _native.useLocale)();
  const parentHeaderHeight = React.useContext(_elements.HeaderHeightContext);
  const {
    onPageChangeStart,
    onPageChangeCancel,
    onPageChangeConfirm
  } = (0, _useKeyboardManager.useKeyboardManager)(React.useCallback(() => {
    const {
      options,
      navigation
    } = scene.descriptor;
    return navigation.isFocused() && options.keyboardHandlingEnabled !== false;
  }, [scene.descriptor]));
  const handleOpen = () => {
    const {
      route
    } = scene.descriptor;
    onTransitionEnd({
      route
    }, false);
    onOpenRoute({
      route
    });
  };
  const handleClose = () => {
    const {
      route
    } = scene.descriptor;
    onTransitionEnd({
      route
    }, true);
    onCloseRoute({
      route
    });
  };
  const handleGestureBegin = () => {
    const {
      route
    } = scene.descriptor;
    onPageChangeStart();
    onGestureStart({
      route
    });
  };
  const handleGestureCanceled = () => {
    const {
      route
    } = scene.descriptor;
    onPageChangeCancel();
    onGestureCancel({
      route
    });
  };
  const handleGestureEnd = () => {
    const {
      route
    } = scene.descriptor;
    onGestureEnd({
      route
    });
  };
  const handleTransition = ({
    closing,
    gesture
  }) => {
    const {
      route
    } = scene.descriptor;
    if (!gesture) {
      onPageChangeConfirm?.(true);
    } else if (active && closing) {
      onPageChangeConfirm?.(false);
    } else {
      onPageChangeCancel?.();
    }
    onTransitionStart?.({
      route
    }, closing);
  };
  const insets = {
    top: safeAreaInsetTop,
    right: safeAreaInsetRight,
    bottom: safeAreaInsetBottom,
    left: safeAreaInsetLeft
  };
  const {
    colors
  } = (0, _native.useTheme)();
  const [pointerEvents, setPointerEvents] = React.useState('box-none');
  React.useEffect(() => {
    const listener = scene.progress.next?.addListener?.(({
      value
    }) => {
      setPointerEvents(value <= EPSILON ? 'box-none' : 'none');
    });
    return () => {
      if (listener) {
        scene.progress.next?.removeListener?.(listener);
      }
    };
  }, [pointerEvents, scene.progress.next]);
  const {
    presentation,
    animation,
    cardOverlay,
    cardOverlayEnabled,
    cardShadowEnabled,
    cardStyle,
    cardStyleInterpolator,
    gestureDirection,
    gestureEnabled,
    gestureResponseDistance,
    gestureVelocityImpact,
    headerMode,
    headerShown,
    transitionSpec
  } = scene.descriptor.options;
  const {
    buildHref
  } = (0, _native.useLinkBuilder)();
  const previousScene = getPreviousScene({
    route: scene.descriptor.route
  });
  let backTitle;
  let href;
  if (previousScene) {
    const {
      options,
      route
    } = previousScene.descriptor;
    backTitle = (0, _elements.getHeaderTitle)(options, route.name);
    href = buildHref(route.name, route.params);
  }
  const canGoBack = previousScene != null;
  const headerBack = React.useMemo(() => {
    if (canGoBack) {
      return {
        href,
        title: backTitle
      };
    }
    return undefined;
  }, [canGoBack, backTitle, href]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Card.Card, {
    interpolationIndex: interpolationIndex,
    gestureDirection: gestureDirection,
    layout: layout,
    insets: insets,
    direction: direction,
    gesture: gesture,
    current: scene.progress.current,
    next: scene.progress.next,
    opening: opening,
    closing: closing,
    onOpen: handleOpen,
    onClose: handleClose,
    overlay: cardOverlay,
    overlayEnabled: cardOverlayEnabled,
    shadowEnabled: cardShadowEnabled,
    onTransition: handleTransition,
    onGestureBegin: handleGestureBegin,
    onGestureCanceled: handleGestureCanceled,
    onGestureEnd: handleGestureEnd,
    gestureEnabled: index === 0 ? false : gestureEnabled,
    gestureResponseDistance: gestureResponseDistance,
    gestureVelocityImpact: gestureVelocityImpact,
    transitionSpec: transitionSpec,
    styleInterpolator: cardStyleInterpolator,
    accessibilityElementsHidden: !focused,
    importantForAccessibility: focused ? 'auto' : 'no-hide-descendants',
    pointerEvents: active ? 'box-none' : pointerEvents,
    pageOverflowEnabled: headerMode !== 'float' && presentation !== 'modal',
    preloaded: preloaded,
    containerStyle: hasAbsoluteFloatHeader && headerMode !== 'screen' ? {
      marginTop: headerHeight
    } : null,
    contentStyle: [{
      backgroundColor: presentation === 'transparentModal' ? 'transparent' : colors.background
    }, cardStyle],
    style: [{
      // This is necessary to avoid unfocused larger pages increasing scroll area
      // The issue can be seen on the web when a smaller screen is pushed over a larger one
      overflow: active ? undefined : 'hidden',
      display:
      // Hide unfocused screens when animation isn't enabled
      // This is also necessary for a11y on web
      animation === 'none' && isNextScreenTransparent === false && detachCurrentScreen !== false && !focused ? 'none' : 'flex'
    }, _reactNative.StyleSheet.absoluteFill],
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.container,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ModalPresentationContext.ModalPresentationContext.Provider, {
        value: modal,
        children: [headerMode !== 'float' ? renderHeader({
          mode: 'screen',
          layout,
          scenes: [previousScene, scene],
          getPreviousScene,
          getFocusedRoute,
          onContentHeightChange: onHeaderHeightChange,
          style: styles.header
        }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.scene,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.HeaderBackContext.Provider, {
            value: headerBack,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.HeaderShownContext.Provider, {
              value: isParentHeaderShown || headerShown !== false,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.HeaderHeightContext.Provider, {
                value: headerShown !== false ? headerHeight : parentHeaderHeight ?? 0,
                children: scene.descriptor.render()
              })
            })
          })
        })]
      })
    })
  });
}
const CardContainer = exports.CardContainer = /*#__PURE__*/React.memo(CardContainerInner);
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    zIndex: 1
  },
  scene: {
    flex: 1
  }
});
//# sourceMappingURL=CardContainer.js.map
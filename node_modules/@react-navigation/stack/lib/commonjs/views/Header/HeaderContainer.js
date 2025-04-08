"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderContainer = HeaderContainer;
var _elements = require("@react-navigation/elements");
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _HeaderStyleInterpolators = require("../../TransitionConfigs/HeaderStyleInterpolators.js");
var _Header = require("./Header.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function HeaderContainer({
  mode,
  scenes,
  layout,
  getPreviousScene,
  getFocusedRoute,
  onContentHeightChange,
  style
}) {
  const focusedRoute = getFocusedRoute();
  const parentHeaderBack = React.useContext(_elements.HeaderBackContext);
  const {
    buildHref
  } = (0, _native.useLinkBuilder)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.View, {
    pointerEvents: "box-none",
    style: style,
    children: scenes.slice(-3).map((scene, i, self) => {
      if (mode === 'screen' && i !== self.length - 1 || !scene) {
        return null;
      }
      const {
        header,
        headerMode,
        headerShown = true,
        headerTransparent,
        headerStyleInterpolator
      } = scene.descriptor.options;
      if (headerMode !== mode || !headerShown) {
        return null;
      }
      const isFocused = focusedRoute.key === scene.descriptor.route.key;
      const previousScene = getPreviousScene({
        route: scene.descriptor.route
      });
      let headerBack = parentHeaderBack;
      if (previousScene) {
        const {
          options,
          route
        } = previousScene.descriptor;
        headerBack = previousScene ? {
          title: (0, _elements.getHeaderTitle)(options, route.name),
          href: buildHref(route.name, route.params)
        } : parentHeaderBack;
      }

      // If the screen is next to a headerless screen, we need to make the header appear static
      // This makes the header look like it's moving with the screen
      const previousDescriptor = self[i - 1]?.descriptor;
      const nextDescriptor = self[i + 1]?.descriptor;
      const {
        headerShown: previousHeaderShown = true,
        headerMode: previousHeaderMode
      } = previousDescriptor?.options || {};

      // If any of the next screens don't have a header or header is part of the screen
      // Then we need to move this header offscreen so that it doesn't cover it
      const nextHeaderlessScene = self.slice(i + 1).find(scene => {
        const {
          headerShown: currentHeaderShown = true,
          headerMode: currentHeaderMode
        } = scene?.descriptor.options || {};
        return currentHeaderShown === false || currentHeaderMode === 'screen';
      });
      const {
        gestureDirection: nextHeaderlessGestureDirection
      } = nextHeaderlessScene?.descriptor.options || {};
      const isHeaderStatic = (previousHeaderShown === false || previousHeaderMode === 'screen') &&
      // We still need to animate when coming back from next scene
      // A hacky way to check this is if the next scene exists
      !nextDescriptor || nextHeaderlessScene;
      const props = {
        layout,
        back: headerBack,
        progress: scene.progress,
        options: scene.descriptor.options,
        route: scene.descriptor.route,
        navigation: scene.descriptor.navigation,
        styleInterpolator: mode === 'float' ? isHeaderStatic ? nextHeaderlessGestureDirection === 'vertical' || nextHeaderlessGestureDirection === 'vertical-inverted' ? _HeaderStyleInterpolators.forSlideUp : nextHeaderlessGestureDirection === 'horizontal-inverted' ? _HeaderStyleInterpolators.forSlideRight : _HeaderStyleInterpolators.forSlideLeft : headerStyleInterpolator : _HeaderStyleInterpolators.forNoAnimation
      };
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_native.NavigationContext.Provider, {
        value: scene.descriptor.navigation,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_native.NavigationRouteContext.Provider, {
          value: scene.descriptor.route,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            onLayout: onContentHeightChange ? e => {
              const {
                height
              } = e.nativeEvent.layout;
              onContentHeightChange({
                route: scene.descriptor.route,
                height
              });
            } : undefined,
            pointerEvents: isFocused ? 'box-none' : 'none',
            accessibilityElementsHidden: !isFocused,
            importantForAccessibility: isFocused ? 'auto' : 'no-hide-descendants',
            style:
            // Avoid positioning the focused header absolutely
            // Otherwise accessibility tools don't seem to be able to find it
            mode === 'float' && !isFocused || headerTransparent ? styles.header : null,
            children: header !== undefined ? header(props) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Header.Header, {
              ...props
            })
          })
        })
      }, scene.descriptor.route.key);
    })
  });
}
const styles = _reactNative.StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  }
});
//# sourceMappingURL=HeaderContainer.js.map
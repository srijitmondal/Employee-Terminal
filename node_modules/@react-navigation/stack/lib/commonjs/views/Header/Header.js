"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;
var _elements = require("@react-navigation/elements");
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _ModalPresentationContext = require("../../utils/ModalPresentationContext.js");
var _throttle = require("../../utils/throttle.js");
var _HeaderSegment = require("./HeaderSegment.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Header = exports.Header = /*#__PURE__*/React.memo(function Header({
  back,
  layout,
  progress,
  options,
  route,
  navigation,
  styleInterpolator
}) {
  const insets = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)();
  let previousTitle;

  // The label for the left back button shows the title of the previous screen
  // If a custom label is specified, we use it, otherwise use previous screen's title
  if (options.headerBackTitle !== undefined) {
    previousTitle = options.headerBackTitle;
  } else if (back) {
    previousTitle = back.title;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goBack = React.useCallback((0, _throttle.throttle)(() => {
    if (navigation.isFocused() && navigation.canGoBack()) {
      navigation.dispatch({
        ..._native.StackActions.pop(),
        source: route.key
      });
    }
  }, 50), [navigation, route.key]);
  const isModal = React.useContext(_ModalPresentationContext.ModalPresentationContext);
  const isParentHeaderShown = React.useContext(_elements.HeaderShownContext);
  const statusBarHeight = options.headerStatusBarHeight !== undefined ? options.headerStatusBarHeight : isModal || isParentHeaderShown ? 0 : insets.top;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderSegment.HeaderSegment, {
    ...options,
    title: (0, _elements.getHeaderTitle)(options, route.name),
    progress: progress,
    layout: layout,
    modal: isModal,
    headerBackTitle: options.headerBackTitle !== undefined ? options.headerBackTitle : previousTitle,
    headerStatusBarHeight: statusBarHeight,
    onGoBack: back ? goBack : undefined,
    backHref: back ? back.href : undefined,
    styleInterpolator: styleInterpolator
  });
});
//# sourceMappingURL=Header.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderSegment = HeaderSegment;
var _elements = require("@react-navigation/elements");
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _memoize = require("../../utils/memoize.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function HeaderSegment(props) {
  const {
    direction
  } = (0, _native.useLocale)();
  const [leftLabelLayout, setLeftLabelLayout] = React.useState(undefined);
  const [titleLayout, setTitleLayout] = React.useState(undefined);
  const handleTitleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    setTitleLayout(titleLayout => {
      if (titleLayout && height === titleLayout.height && width === titleLayout.width) {
        return titleLayout;
      }
      return {
        height,
        width
      };
    });
  };
  const handleLeftLabelLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    if (leftLabelLayout && height === leftLabelLayout.height && width === leftLabelLayout.width) {
      return;
    }
    setLeftLabelLayout({
      height,
      width
    });
  };
  const getInterpolatedStyle = (0, _memoize.memoize)((styleInterpolator, layout, current, next, titleLayout, leftLabelLayout, headerHeight) => styleInterpolator({
    current: {
      progress: current
    },
    next: next && {
      progress: next
    },
    direction,
    layouts: {
      header: {
        height: headerHeight,
        width: layout.width
      },
      screen: layout,
      title: titleLayout,
      leftLabel: leftLabelLayout
    }
  }));
  const {
    progress,
    layout,
    modal,
    onGoBack,
    backHref,
    headerTitle: title,
    headerLeft: left = onGoBack ? props => /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.HeaderBackButton, {
      ...props
    }) : undefined,
    headerRight: right,
    headerBackImage,
    headerBackTitle,
    headerBackButtonDisplayMode = _reactNative.Platform.OS === 'ios' ? 'default' : 'minimal',
    headerBackTruncatedTitle,
    headerBackAccessibilityLabel,
    headerBackTestID,
    headerBackAllowFontScaling,
    headerBackTitleStyle,
    headerTitleContainerStyle,
    headerLeftContainerStyle,
    headerRightContainerStyle,
    headerBackgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerStatusBarHeight,
    styleInterpolator,
    ...rest
  } = props;
  const defaultHeight = (0, _elements.getDefaultHeaderHeight)(layout, modal, headerStatusBarHeight);
  const {
    height = defaultHeight
  } = _reactNative.StyleSheet.flatten(customHeaderStyle || {});
  const {
    titleStyle,
    leftButtonStyle,
    leftLabelStyle,
    rightButtonStyle,
    backgroundStyle
  } = getInterpolatedStyle(styleInterpolator, layout, progress.current, progress.next, titleLayout, headerBackTitle ? leftLabelLayout : undefined, typeof height === 'number' ? height : defaultHeight);
  const headerLeft = left ? props => left({
    ...props,
    href: backHref,
    backImage: headerBackImage,
    accessibilityLabel: headerBackAccessibilityLabel,
    testID: headerBackTestID,
    allowFontScaling: headerBackAllowFontScaling,
    onPress: onGoBack,
    label: headerBackTitle,
    truncatedLabel: headerBackTruncatedTitle,
    labelStyle: [leftLabelStyle, headerBackTitleStyle],
    onLabelLayout: handleLeftLabelLayout,
    screenLayout: layout,
    titleLayout,
    canGoBack: Boolean(onGoBack)
  }) : undefined;
  const headerRight = right ? props => right({
    ...props,
    canGoBack: Boolean(onGoBack)
  }) : undefined;
  const headerTitle = typeof title !== 'function' ? props => /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.HeaderTitle, {
    ...props,
    onLayout: handleTitleLayout
  }) : props => title({
    ...props,
    onLayout: handleTitleLayout
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.Header, {
    modal: modal,
    layout: layout,
    headerTitle: headerTitle,
    headerLeft: headerLeft,
    headerRight: headerRight,
    headerTitleContainerStyle: [titleStyle, headerTitleContainerStyle],
    headerLeftContainerStyle: [leftButtonStyle, headerLeftContainerStyle],
    headerRightContainerStyle: [rightButtonStyle, headerRightContainerStyle],
    headerBackButtonDisplayMode: headerBackButtonDisplayMode,
    headerBackgroundContainerStyle: [backgroundStyle, headerBackgroundContainerStyle],
    headerStyle: customHeaderStyle,
    headerStatusBarHeight: headerStatusBarHeight,
    ...rest
  });
}
//# sourceMappingURL=HeaderSegment.js.map
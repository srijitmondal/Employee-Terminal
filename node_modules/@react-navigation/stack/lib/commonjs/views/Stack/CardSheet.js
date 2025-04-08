"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardSheet = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// This component will render a page which overflows the screen
// if the container fills the body by comparing the size
// This lets the document.body handle scrolling of the content
// It's necessary for mobile browsers to be able to hide address bar on scroll
const CardSheet = exports.CardSheet = /*#__PURE__*/React.forwardRef(function CardSheet({
  enabled,
  layout,
  style,
  ...rest
}, ref) {
  const [fill, setFill] = React.useState(false);
  // To avoid triggering a rerender in Card during animation we had to move
  // the state to CardSheet. The `setPointerEvents` is then hoisted back to the Card.
  const [pointerEvents, setPointerEvents] = React.useState('auto');
  React.useImperativeHandle(ref, () => {
    return {
      setPointerEvents
    };
  });
  React.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    // Workaround for mobile Chrome, necessary when a navigation happens
    // when the address bar has already collapsed, which resulted in an
    // empty space at the bottom of the page (matching the height of the
    // address bar). To fix this, it's necessary to update the height of
    // the DOM with the current height of the window.
    // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    const isFullHeight = height === layout.height;
    const id = '__react-navigation-stack-mobile-chrome-viewport-fix';
    let unsubscribe;
    if (isFullHeight && navigator.maxTouchPoints > 0) {
      const style = document.getElementById(id) ?? document.createElement('style');
      style.id = id;
      const updateStyle = () => {
        const vh = window.innerHeight * 0.01;
        style.textContent = [`:root { --vh: ${vh}px; }`, `body { height: calc(var(--vh, 1vh) * 100); }`].join('\n');
      };
      updateStyle();
      if (!document.head.contains(style)) {
        document.head.appendChild(style);
      }
      window.addEventListener('resize', updateStyle);
      unsubscribe = () => {
        window.removeEventListener('resize', updateStyle);
      };
    } else {
      // Remove the workaround if the stack does not occupy the whole
      // height of the page
      document.getElementById(id)?.remove();
    }

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFill(width === layout.width && height === layout.height);
    return unsubscribe;
  }, [layout.height, layout.width]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    ...rest,
    pointerEvents: pointerEvents,
    style: [enabled && fill ? styles.page : styles.card, style]
  });
});
const styles = _reactNative.StyleSheet.create({
  page: {
    minHeight: '100%'
  },
  card: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=CardSheet.js.map
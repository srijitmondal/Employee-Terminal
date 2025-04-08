"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StackView = void 0;
var _elements = require("@react-navigation/elements");
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _ModalPresentationContext = require("../../utils/ModalPresentationContext.js");
var _GestureHandler = require("../GestureHandler");
var _HeaderContainer = require("../Header/HeaderContainer.js");
var _CardStack = require("./CardStack.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const GestureHandlerWrapper = _GestureHandler.GestureHandlerRootView ?? _reactNative.View;

/**
 * Compare two arrays with primitive values as the content.
 * We need to make sure that both values and order match.
 */
const isArrayEqual = (a, b) => a.length === b.length && a.every((it, index) => it === b[index]);
class StackView extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // If there was no change in routes, we don't need to compute anything
    if ((props.state.routes === state.previousRoutes || isArrayEqual(props.state.routes.map(r => r.key), state.previousRoutes.map(r => r.key))) && state.routes.length) {
      let routes = state.routes;
      let previousRoutes = state.previousRoutes;
      let descriptors = props.descriptors;
      let previousDescriptors = state.previousDescriptors;
      if (props.descriptors !== state.previousDescriptors) {
        descriptors = state.routes.reduce((acc, route) => {
          acc[route.key] = props.descriptors[route.key] || state.descriptors[route.key];
          return acc;
        }, {});
        previousDescriptors = props.descriptors;
      }
      if (props.state.routes !== state.previousRoutes) {
        // if any route objects have changed, we should update them
        const map = props.state.routes.reduce((acc, route) => {
          acc[route.key] = route;
          return acc;
        }, {});
        routes = state.routes.map(route => map[route.key] || route);
        previousRoutes = props.state.routes;
      }
      return {
        routes,
        previousRoutes,
        descriptors,
        previousDescriptors
      };
    }

    // Here we determine which routes were added or removed to animate them
    // We keep a copy of the route being removed in local state to be able to animate it

    let routes = props.state.index < props.state.routes.length - 1 ?
    // Remove any extra routes from the state
    // The last visible route should be the focused route, i.e. at current index
    props.state.routes.slice(0, props.state.index + 1) : props.state.routes;

    // Now we need to determine which routes were added and removed
    const {
      previousRoutes
    } = state;
    let {
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys
    } = state;
    const previousFocusedRoute = previousRoutes[previousRoutes.length - 1];
    const nextFocusedRoute = routes[routes.length - 1];
    const isAnimationEnabled = key => {
      const descriptor = props.descriptors[key] || state.descriptors[key];
      return descriptor ? descriptor.options.animation !== 'none' : true;
    };
    const getAnimationTypeForReplace = key => {
      const descriptor = props.descriptors[key] || state.descriptors[key];
      return descriptor.options.animationTypeForReplace ?? 'push';
    };
    if (previousFocusedRoute && previousFocusedRoute.key !== nextFocusedRoute.key) {
      // We only need to animate routes if the focused route changed
      // Animating previous routes won't be visible coz the focused route is on top of everything

      if (previousRoutes.some(r => r.key === nextFocusedRoute.key) && !routes.some(r => r.key === previousFocusedRoute.key)) {
        // The previously focused route was removed, and the new focused route was already present
        // We treat this as a pop

        if (isAnimationEnabled(previousFocusedRoute.key) && !closingRouteKeys.includes(previousFocusedRoute.key)) {
          closingRouteKeys = [...closingRouteKeys, previousFocusedRoute.key];

          // Sometimes a route can be closed before the opening animation finishes
          // So we also need to remove it from the opening list
          openingRouteKeys = openingRouteKeys.filter(key => key !== previousFocusedRoute.key);
          replacingRouteKeys = replacingRouteKeys.filter(key => key !== previousFocusedRoute.key);

          // Keep a copy of route being removed in the state to be able to animate it
          routes = [...routes, previousFocusedRoute];
        }
      } else {
        // A route has come to the focus, we treat this as a push
        // A replace or rearranging can also trigger this
        // The animation should look like push

        if (isAnimationEnabled(nextFocusedRoute.key) && !openingRouteKeys.includes(nextFocusedRoute.key)) {
          // In this case, we need to animate pushing the focused route
          // We don't care about animating any other added routes because they won't be visible
          openingRouteKeys = [...openingRouteKeys, nextFocusedRoute.key];
          closingRouteKeys = closingRouteKeys.filter(key => key !== nextFocusedRoute.key);
          replacingRouteKeys = replacingRouteKeys.filter(key => key !== nextFocusedRoute.key);
          if (!routes.some(r => r.key === previousFocusedRoute.key)) {
            // The previous focused route isn't present in state, we treat this as a replace

            openingRouteKeys = openingRouteKeys.filter(key => key !== previousFocusedRoute.key);
            if (getAnimationTypeForReplace(nextFocusedRoute.key) === 'pop') {
              closingRouteKeys = [...closingRouteKeys, previousFocusedRoute.key];

              // By default, new routes have a push animation, so we add it to `openingRouteKeys` before
              // But since user configured it to animate the old screen like a pop, we need to add this without animation
              // So remove it from `openingRouteKeys` which will remove the animation
              openingRouteKeys = openingRouteKeys.filter(key => key !== nextFocusedRoute.key);

              // Keep the route being removed at the end to animate it out
              routes = [...routes, previousFocusedRoute];
            } else {
              replacingRouteKeys = [...replacingRouteKeys, previousFocusedRoute.key];
              closingRouteKeys = closingRouteKeys.filter(key => key !== previousFocusedRoute.key);

              // Keep the old route in the state because it's visible under the new route, and removing it will feel abrupt
              // We need to insert it just before the focused one (the route being pushed)
              // After the push animation is completed, routes being replaced will be removed completely
              routes = routes.slice();
              routes.splice(routes.length - 1, 0, previousFocusedRoute);
            }
          }
        }
      }
    } else if (replacingRouteKeys.length || closingRouteKeys.length) {
      // Keep the routes we are closing or replacing if animation is enabled for them
      routes = routes.slice();
      routes.splice(routes.length - 1, 0, ...state.routes.filter(({
        key
      }) => isAnimationEnabled(key) ? replacingRouteKeys.includes(key) || closingRouteKeys.includes(key) : false));
    }
    if (!routes.length) {
      throw new Error('There should always be at least one route in the navigation state.');
    }
    const descriptors = routes.reduce((acc, route) => {
      acc[route.key] = props.descriptors[route.key] || state.descriptors[route.key];
      return acc;
    }, {});
    return {
      routes,
      previousRoutes: props.state.routes,
      previousDescriptors: props.descriptors,
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys,
      descriptors
    };
  }
  state = {
    routes: [],
    previousRoutes: [],
    previousDescriptors: {},
    openingRouteKeys: [],
    closingRouteKeys: [],
    replacingRouteKeys: [],
    descriptors: {}
  };
  getPreviousRoute = ({
    route
  }) => {
    const {
      closingRouteKeys,
      replacingRouteKeys
    } = this.state;
    const routes = this.state.routes.filter(r => r.key === route.key || !closingRouteKeys.includes(r.key) && !replacingRouteKeys.includes(r.key));
    const index = routes.findIndex(r => r.key === route.key);
    return routes[index - 1];
  };
  renderHeader = props => {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderContainer.HeaderContainer, {
      ...props
    });
  };
  handleOpenRoute = ({
    route
  }) => {
    const {
      state,
      navigation
    } = this.props;
    const {
      closingRouteKeys,
      replacingRouteKeys
    } = this.state;
    if (closingRouteKeys.some(key => key === route.key) && replacingRouteKeys.every(key => key !== route.key) && state.routeNames.includes(route.name) && !state.routes.some(r => r.key === route.key)) {
      // If route isn't present in current state, but was closing, assume that a close animation was cancelled
      // So we need to add this route back to the state
      navigation.dispatch(state => {
        const routes = [...state.routes.filter(r => r.key !== route.key), route];
        return _native.CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1
        });
      });
    } else {
      this.setState(state => ({
        routes: state.replacingRouteKeys.length ? state.routes.filter(r => !state.replacingRouteKeys.includes(r.key)) : state.routes,
        openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
        closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key),
        replacingRouteKeys: []
      }));
    }
  };
  handleCloseRoute = ({
    route
  }) => {
    const {
      state,
      navigation
    } = this.props;
    if (state.routes.some(r => r.key === route.key)) {
      // If a route exists in state, trigger a pop
      // This will happen in when the route was closed from the card component
      // e.g. When the close animation triggered from a gesture ends
      navigation.dispatch({
        ..._native.StackActions.pop(),
        source: route.key,
        target: state.key
      });
    } else {
      // We need to clean up any state tracking the route and pop it immediately
      this.setState(state => ({
        routes: state.routes.filter(r => r.key !== route.key),
        openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
        closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key)
      }));
    }
  };
  handleTransitionStart = ({
    route
  }, closing) => this.props.navigation.emit({
    type: 'transitionStart',
    data: {
      closing
    },
    target: route.key
  });
  handleTransitionEnd = ({
    route
  }, closing) => this.props.navigation.emit({
    type: 'transitionEnd',
    data: {
      closing
    },
    target: route.key
  });
  handleGestureStart = ({
    route
  }) => {
    this.props.navigation.emit({
      type: 'gestureStart',
      target: route.key
    });
  };
  handleGestureEnd = ({
    route
  }) => {
    this.props.navigation.emit({
      type: 'gestureEnd',
      target: route.key
    });
  };
  handleGestureCancel = ({
    route
  }) => {
    this.props.navigation.emit({
      type: 'gestureCancel',
      target: route.key
    });
  };
  render() {
    const {
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      descriptors: _,
      ...rest
    } = this.props;
    const {
      routes,
      descriptors,
      openingRouteKeys,
      closingRouteKeys
    } = this.state;
    const preloadedDescriptors = state.preloadedRoutes.reduce((acc, route) => {
      acc[route.key] = acc[route.key] || this.props.describe(route, true);
      return acc;
    }, {});
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(GestureHandlerWrapper, {
      style: styles.container,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.SafeAreaProviderCompat, {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSafeAreaContext.SafeAreaInsetsContext.Consumer, {
          children: insets => /*#__PURE__*/(0, _jsxRuntime.jsx)(_ModalPresentationContext.ModalPresentationContext.Consumer, {
            children: isParentModal => /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.HeaderShownContext.Consumer, {
              children: isParentHeaderShown => /*#__PURE__*/(0, _jsxRuntime.jsx)(_CardStack.CardStack, {
                insets: insets,
                isParentHeaderShown: isParentHeaderShown,
                isParentModal: isParentModal,
                getPreviousRoute: this.getPreviousRoute,
                routes: routes,
                openingRouteKeys: openingRouteKeys,
                closingRouteKeys: closingRouteKeys,
                onOpenRoute: this.handleOpenRoute,
                onCloseRoute: this.handleCloseRoute,
                onTransitionStart: this.handleTransitionStart,
                onTransitionEnd: this.handleTransitionEnd,
                renderHeader: this.renderHeader,
                state: state,
                descriptors: descriptors,
                onGestureStart: this.handleGestureStart,
                onGestureEnd: this.handleGestureEnd,
                onGestureCancel: this.handleGestureCancel,
                preloadedDescriptors: preloadedDescriptors,
                ...rest
              })
            })
          })
        })
      })
    });
  }
}
exports.StackView = StackView;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=StackView.js.map
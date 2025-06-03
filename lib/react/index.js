"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VreoProvider = void 0;
exports.useVreoAction = useVreoAction;
exports.useVreoEventCallback = useVreoEventCallback;
exports.useVreoPausedState = useVreoPausedState;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("@realsee/five/react");
var React = _interopRequireWildcard(require("react"));
var _Player = require("../Player");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
var VreoContext = /*#__PURE__*/React.createContext(null);
var VreoProvider = exports.VreoProvider = function VreoProvider(props) {
  var five = (0, _react.unsafe__useFiveInstance)();
  var _React$useState = React.useState(null),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    player = _React$useState2[0],
    setPlayer = _React$useState2[1];
  var playerRef = React.useRef(null);
  React.useEffect(function () {
    playerRef.current = new _Player.Player(five, props.configs || {});
    setPlayer(playerRef.current);
    return function () {
      var _playerRef$current;
      (_playerRef$current = playerRef.current) === null || _playerRef$current === void 0 ? void 0 : _playerRef$current.dispose();
    };
  }, []);
  if (!player) return /*#__PURE__*/React.createElement(React.Fragment, null);
  return /*#__PURE__*/React.createElement(VreoContext.Provider, {
    value: player
  }, props.children);
};
function useVreoInstance() {
  var context = React.useContext(VreoContext);
  if (!context) {
    throw new Error('VreoProvider never found.');
  }
  return context;
}

/**
 * VreoPlayer 命令集合。
 */

function useVreoAction() {
  var player = useVreoInstance();
  var load = React.useCallback(function (vreoUnit, currentTime) {
    return player.load(vreoUnit, currentTime);
  }, [player]);
  var play = React.useCallback(function (currentTime) {
    return player.play(currentTime || 0);
  }, [player]);
  var pause = React.useCallback(function () {
    return player.pause();
  }, [player]);
  var show = React.useCallback(function () {
    return player.show();
  }, [player]);
  var hide = React.useCallback(function () {
    return player.hide();
  }, [player]);
  var dispose = React.useCallback(function () {
    return player.dispose();
  }, [player]);
  return {
    load: load,
    pause: pause,
    show: show,
    play: play,
    hide: hide,
    dispose: dispose
  };
}
function useVreoEventCallback(name, callback, deps) {
  var player = useVreoInstance();
  var dependencyList = [player, name];
  if (deps !== undefined) {
    dependencyList = dependencyList.concat(deps);
  }
  React.useEffect(function () {
    // @ts-ignore
    player.on(name, callback);
    return function () {
      // @ts-ignore
      player.off(name, callback);
    };
  }, dependencyList);
}
function useVreoPausedState() {
  var player = useVreoInstance();
  var _React$useState3 = React.useState(player.paused),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    state = _React$useState4[0],
    setState = _React$useState4[1];
  useVreoEventCallback('paused', function () {
    return setState(true);
  });
  useVreoEventCallback('playing', function () {
    return setState(false);
  });
  return state;
}
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VreoProvider = void 0;
exports.useVreoAction = useVreoAction;
exports.useVreoEventCallback = useVreoEventCallback;
exports.useVreoPausedState = useVreoPausedState;

var _react = require("@realsee/five/react");

var React = _interopRequireWildcard(require("react"));

var _Player = require("../Player");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var VreoContext = /*#__PURE__*/React.createContext(null);

var VreoProvider = function VreoProvider(props) {
  var five = (0, _react.unsafe__useFiveInstance)();

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
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

exports.VreoProvider = VreoProvider;

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
      _React$useState4 = _slicedToArray(_React$useState3, 2),
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
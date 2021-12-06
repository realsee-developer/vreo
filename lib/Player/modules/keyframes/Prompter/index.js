"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Prompter = Prompter;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _hooks = require("../../../hooks");

var _reactTransitionGroup = require("react-transition-group");

var _VreoUnit = require("../../../../typings/VreoUnit");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function Prompter() {
  var _React$useState = React.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      text = _React$useState2[0],
      setText = _React$useState2[1];

  var _React$useState3 = React.useState(true),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      hidden = _React$useState4[0],
      setHidden = _React$useState4[1];

  var ref = React.useRef(null);
  var controller = (0, _hooks.useController)();
  React.useEffect(function () {
    var _controller$configs;

    if (((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.keyframeMap.Prompter) === false) {
      return;
    }

    var callback = function callback(keyframe) {
      var start = keyframe.start,
          end = keyframe.end,
          data = keyframe.data;
      setText(data.text);
      setHidden(false);

      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }

      ref.current = setTimeout(function () {
        setHidden(true);
        setTimeout(function () {
          return setText('');
        }, 500);
        if (ref.current) clearTimeout(ref.current);
        ref.current = null;
      }, end - start);
    };

    controller.on(_VreoUnit.VreoKeyframeEnum.Prompter, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.Prompter, callback);
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('vreo-prompter', {
      'vreo-prompter--hidden': hidden,
      'vreo-prompter--audio': controller.isAudio
    })
  }, text ?
  /*#__PURE__*/

  /* @warning "index.js:1 Warning: findDOMNode is deprecated in StrictMode." */
  React.createElement(_reactTransitionGroup.TransitionGroup, {
    className: "vreo-prompter-text"
  }, /*#__PURE__*/React.createElement(_reactTransitionGroup.CSSTransition, {
    key: text,
    classNames: "vreo-prompter-text-transition",
    timeout: 500,
    addEndListener: function addEndListener(node, done) {
      return node.addEventListener('transitionend', done, false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-prompter-innerText"
  }, text))) : undefined);
}
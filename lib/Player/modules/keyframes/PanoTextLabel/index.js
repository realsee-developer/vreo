"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanoTextLabel = PanoTextLabel;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _three = require("three");

var _VreoUnit = require("../../../../typings/VreoUnit");

var _hooks = require("../../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PanoTextLabel() {
  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var timeoutRef = React.useRef();
  var controller = (0, _hooks.useController)();
  var project2d = (0, _hooks.useFiveProject2d)();
  React.useEffect(function () {
    var _controller$configs;

    if (((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.keyframeMap.PanoTextLabel) === false) {
      return;
    }

    var callback = function callback(keyframe) {
      var start = keyframe.start,
          end = keyframe.end,
          data = keyframe.data;
      var panoTextLabelData = data;
      var _panoTextLabelData$ve = panoTextLabelData.vertex,
          x = _panoTextLabelData$ve.x,
          y = _panoTextLabelData$ve.y,
          z = _panoTextLabelData$ve.z;
      var res = project2d(new _three.Vector3(x, y, z));
      if (!res) return;
      var left = res.x,
          top = res.y;
      Object.assign(window, {
        $PanoTextLabel: {
          setState: setState
        }
      });
      setState({
        left: left,
        top: top,
        text: data.text || '',
        fontSize: data.fontSize || 16
      });
      timeoutRef.current = setTimeout(function () {
        return setState(null);
      }, end - start);
    };

    controller.on(_VreoUnit.VreoKeyframeEnum.PanoTextLabel, callback);
    Object.assign(window, {
      $panoTextLabel: {
        setState: setState
      }
    });
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.PanoTextLabel, callback);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('PanoTextLabel', {
      'PanoTextLabel--notHidden': state
    }),
    style: {
      left: ((state === null || state === void 0 ? void 0 : state.left) || 0) + 'px',
      top: ((state === null || state === void 0 ? void 0 : state.top) || 0) + 'px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "PanoTextLabel-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "".concat((state === null || state === void 0 ? void 0 : state.fontSize) || 16, "px")
    },
    className: "PanoText-innerText"
  }, (state === null || state === void 0 ? void 0 : state.text) || '')));
}
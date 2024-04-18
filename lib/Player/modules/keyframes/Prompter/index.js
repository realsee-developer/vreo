"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Prompter = Prompter;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var React = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _hooks = require("../../../hooks");
var _VreoUnit = require("../../../../typings/VreoUnit");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function Prompter() {
  var _React$useState = React.useState(''),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    text = _React$useState2[0],
    setText = _React$useState2[1];
  var _React$useState3 = React.useState(true),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
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
        setText('');
        // setTimeout(() => setText(''), 500)

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
    className: (0, _classnames["default"])('vreo-prompter', (0, _defineProperty2["default"])({
      'vreo-prompter--hidden': hidden
    }, "vreo-prompter-left--".concat(controller.agentType), true))
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-prompter-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-prompter-innerText"
  }, text)));
}
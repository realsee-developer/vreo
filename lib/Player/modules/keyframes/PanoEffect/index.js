"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanoEffect = PanoEffect;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var React = _interopRequireWildcard(require("react"));
var _three = require("three");
var _classnames = _interopRequireDefault(require("classnames"));
var _lineAnime = _interopRequireDefault(require("./lineAnime"));
var _hooks = require("../../../hooks");
var _VreoUnit = require("../../../../typings/VreoUnit");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function PanoEffect() {
  var _React$useState = React.useState(null),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    state = _React$useState2[0],
    setState = _React$useState2[1];
  var five = (0, _hooks.useFiveInstance)();
  var lineRef = React.useRef(null);
  var _React$useState3 = React.useState(null),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    pos = _React$useState4[0],
    setPos = _React$useState4[1];
  var timeoutRef = React.useRef();
  var controller = (0, _hooks.useController)();
  var project2d = (0, _hooks.useFiveProject2d)();
  var delLine = function delLine() {
    if (lineRef.current) {
      lineRef.current.dispose();
    }
  };
  React.useEffect(function () {
    var callback = function callback(keyframe) {
      var start = keyframe.start,
        end = keyframe.end,
        data = keyframe.data;
      var videoEffectData = data;
      var _videoEffectData$twoV = (0, _slicedToArray2["default"])(videoEffectData.twoVertexs, 2),
        v1 = _videoEffectData$twoV[0],
        v2 = _videoEffectData$twoV[1];
      var p1 = new _three.Vector3(v1.x, v1.y, v1.z);
      var p2 = new _three.Vector3(v2.x, v2.y, v2.z);
      lineRef.current = (0, _lineAnime["default"])(five, p1.clone(), p2.clone());
      lineRef.current.play();
      var center = p1.lerp(p2, 0.5);
      var distance = p1.distanceTo(p2);
      var p = project2d(center);
      if (!p) return;
      var left = p.x,
        top = p.y;
      setState({
        center: center,
        distance: distance
      });
      setPos({
        left: left,
        top: top
      });
      timeoutRef.current = setTimeout(function () {
        setState(null);
        setPos(null);
        delLine();
      }, end - start);
    };
    controller.on(_VreoUnit.VreoKeyframeEnum.PanoEffect, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.PanoEffect, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      delLine();
    };
  }, [controller]);
  React.useEffect(function () {
    var callback = function callback() {
      if (!(state !== null && state !== void 0 && state.center)) return;
      var _state$center = state.center,
        x = _state$center.x,
        y = _state$center.y,
        z = _state$center.z;
      var res = project2d(new _three.Vector3(x, y, z));
      if (!res) return;
      var left = res.x,
        top = res.y;
      setPos({
        left: left,
        top: top
      });
    };
    five.on('currentStateChange', callback);
    return function () {
      five.off('currentStateChange', callback);
    };
  }, [state === null || state === void 0 ? void 0 : state.center]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('PanoEffect', {
      'PanoEffect--notHidden': state
    }),
    style: {
      left: ((pos === null || pos === void 0 ? void 0 : pos.left) || 0) + 'px',
      top: ((pos === null || pos === void 0 ? void 0 : pos.top) || 0) + 'px'
    }
  }, (state === null || state === void 0 ? void 0 : state.distance.toFixed(4)) + 'm'));
}
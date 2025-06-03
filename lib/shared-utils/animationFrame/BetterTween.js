"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BetterTween = void 0;
exports.tweenProgress = tweenProgress;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var TWEEN = _interopRequireWildcard(require("@tweenjs/tween.js"));
var _ = require(".");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var BetterTween = exports.BetterTween = /*#__PURE__*/function (_TWEEN$Tween) {
  (0, _inherits2["default"])(BetterTween, _TWEEN$Tween);
  var _super = _createSuper(BetterTween);
  function BetterTween() {
    var _this;
    (0, _classCallCheck2["default"])(this, BetterTween);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "disposeMethods", []);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onDispose", function (callback) {
      _this.disposeMethods.push(callback);
      return (0, _assertThisInitialized2["default"])(_this);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "play", function () {
      _this.start();
      _this.animationFrameDisposer = (0, _.requestAnimationFrameInterval)(function () {
        return _this.update();
      });
      return (0, _assertThisInitialized2["default"])(_this);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "dispose", function () {
      var _this$animationFrameD, _this2;
      _this.stop();
      (_this$animationFrameD = (_this2 = _this).animationFrameDisposer) === null || _this$animationFrameD === void 0 ? void 0 : _this$animationFrameD.call(_this2);
      _this.disposeMethods.forEach(function (fn) {
        return fn();
      });
      _this.disposeMethods = [];
      TWEEN.remove((0, _assertThisInitialized2["default"])(_this));
    });
    return _this;
  }
  return (0, _createClass2["default"])(BetterTween);
}(TWEEN.Tween);
function tweenProgress(duration) {
  var easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TWEEN.Easing.Linear.None;
  var tween = new BetterTween({
    progress: 0
  }).to({
    progress: 1
  });
  if (duration !== undefined) tween.duration(duration);
  if (easing !== undefined) tween.easing(easing);
  return tween;
}
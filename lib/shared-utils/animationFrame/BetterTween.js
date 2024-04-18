"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
var _tween = _interopRequireDefault(require("@tweenjs/tween.js"));
var _ = require(".");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var BetterTween = /*#__PURE__*/function (_TWEEN$Tween) {
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
      _tween["default"].remove((0, _assertThisInitialized2["default"])(_this));
    });
    return _this;
  }
  return (0, _createClass2["default"])(BetterTween);
}(_tween["default"].Tween);
exports.BetterTween = BetterTween;
function tweenProgress(duration) {
  var easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _tween["default"].Easing.Linear.None;
  var tween = new BetterTween({
    progress: 0
  }).to({
    progress: 1
  });
  if (duration !== undefined) tween.duration(duration);
  if (easing !== undefined) tween.easing(easing);
  return tween;
}
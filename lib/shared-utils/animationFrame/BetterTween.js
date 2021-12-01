"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BetterTween = void 0;
exports.tweenProgress = tweenProgress;

var _tween = _interopRequireDefault(require("@tweenjs/tween.js"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BetterTween = /*#__PURE__*/function (_TWEEN$Tween) {
  _inherits(BetterTween, _TWEEN$Tween);

  var _super = _createSuper(BetterTween);

  function BetterTween() {
    var _this;

    _classCallCheck(this, BetterTween);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "disposeMethods", []);

    _defineProperty(_assertThisInitialized(_this), "onDispose", function (callback) {
      _this.disposeMethods.push(callback);

      return _assertThisInitialized(_this);
    });

    _defineProperty(_assertThisInitialized(_this), "play", function () {
      _this.start();

      _this.animationFrameDisposer = (0, _.requestAnimationFrameInterval)(function () {
        return _this.update();
      });
      return _assertThisInitialized(_this);
    });

    _defineProperty(_assertThisInitialized(_this), "dispose", function () {
      var _this$animationFrameD, _this2;

      _this.stop();

      (_this$animationFrameD = (_this2 = _this).animationFrameDisposer) === null || _this$animationFrameD === void 0 ? void 0 : _this$animationFrameD.call(_this2);

      _this.disposeMethods.forEach(function (fn) {
        return fn();
      });

      _this.disposeMethods = [];

      _tween["default"].remove(_assertThisInitialized(_this));
    });

    return _this;
  }

  return BetterTween;
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
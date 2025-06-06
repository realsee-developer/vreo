import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import * as TWEEN from '@tweenjs/tween.js';
import { requestAnimationFrameInterval } from "./index.js";
export var BetterTween = /*#__PURE__*/function (_TWEEN$Tween) {
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
      _this.animationFrameDisposer = requestAnimationFrameInterval(function () {
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
      TWEEN.remove(_assertThisInitialized(_this));
    });
    return _this;
  }
  return _createClass(BetterTween);
}(TWEEN.Tween);
export function tweenProgress(duration) {
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
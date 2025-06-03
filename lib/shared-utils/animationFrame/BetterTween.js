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
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /**
 * @fileoverview 增强版的 Tween 动画类
 * 
 * 基于 @tweenjs/tween.js 的增强版本，提供更好的生命周期管理和资源清理功能。
 */
/**
 * 销毁回调函数类型
 */
/**
 * 增强版的 Tween 动画类
 * 
 * 继承自 TWEEN.Tween，增加了资源管理和自动清理功能。
 * 提供了更简单的播放接口和完善的销毁机制。
 * 
 * @template G - 要进行动画的对象类型，必须是一个记录类型
 * 
 * @example
 * ```typescript
 * const position = { x: 0, y: 0 };
 * const tween = new BetterTween(position)
 *   .to({ x: 100, y: 100 }, 1000)
 *   .easing(TWEEN.Easing.Quadratic.Out)
 *   .onUpdate(() => console.log('位置更新:', position))
 *   .onDispose(() => console.log('动画已销毁'))
 *   .play();
 * 
 * // 5秒后销毁动画
 * setTimeout(() => tween.dispose(), 5000);
 * ```
 */
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
      _tween["default"].remove((0, _assertThisInitialized2["default"])(_this));
    });
    return _this;
  }
  /**
   * 销毁时需要执行的回调函数列表
   * @private
   */
  /**
   * 动画帧循环的销毁函数
   * @private
   */
  /**
   * 添加销毁时的回调函数
   * 
   * 当调用 dispose() 方法时，所有通过此方法注册的回调都会被执行。
   * 
   * @param callback - 销毁时要执行的回调函数
   * @returns 返回当前实例，支持链式调用
   * 
   * @example
   * ```typescript
   * tween
   *   .onDispose(() => console.log('清理资源1'))
   *   .onDispose(() => console.log('清理资源2'))
   *   .play();
   * ```
   */
  /**
   * 开始播放动画
   * 
   * 自动启动 Tween 并创建动画帧循环来更新动画状态。
   * 相比原生的 start() 方法，这个方法会自动处理动画帧更新。
   * 
   * @returns 返回当前实例，支持链式调用
   * 
   * @example
   * ```typescript
   * const tween = new BetterTween({ opacity: 0 })
   *   .to({ opacity: 1 }, 1000)
   *   .play(); // 立即开始播放
   * ```
   */
  /**
   * 销毁动画并清理所有资源
   * 
   * 停止动画，清理动画帧循环，执行所有注册的销毁回调，
   * 并从全局 TWEEN 管理器中移除当前动画。
   * 
   * @example
   * ```typescript
   * // 手动销毁动画
   * tween.dispose();
   * 
   * // 或者在动画完成时自动销毁
   * tween.onComplete(() => tween.dispose());
   * ```
   */
  return (0, _createClass2["default"])(BetterTween);
}(_tween["default"].Tween);
/**
 * 创建一个进度动画的便捷函数
 * 
 * 创建一个从 0 到 1 的进度动画，常用于控制其他动画的进度。
 * 
 * @param duration - 动画持续时间（毫秒），可选
 * @param easing - 缓动函数，默认为线性缓动
 * @returns 配置好的 BetterTween 实例
 * 
 * @example
 * ```typescript
 * // 创建一个2秒的进度动画
 * const progressTween = tweenProgress(2000, TWEEN.Easing.Quadratic.InOut)
 *   .onUpdate((obj) => {
 *     console.log(`进度: ${(obj.progress * 100).toFixed(1)}%`);
 *   })
 *   .play();
 * ```
 */
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
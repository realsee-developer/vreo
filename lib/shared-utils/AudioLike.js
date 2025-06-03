"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AudioLike = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _five = require("@realsee/five");
var _animationFrame = require("./animationFrame");
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * 模拟 `<Audio>` 事件接口
 * @interface AudioLikeEvent
 */
/**
 * 音频构造函数参数接口
 * @interface AudioLikeOptions
 */
/**
 * 模拟 `<Audio>` 功能的类
 * 
 * 这个类提供了与 HTML Audio 元素相似的接口和行为，但不实际播放音频。
 * 主要用于模拟音频播放的时间控制和事件触发机制。
 * 
 * @class AudioLike
 * @extends {Subscribe<AudioLikeEvent>}
 * 
 * @example
 * ```typescript
 * const audioLike = new AudioLike({ duration: 5000 });
 * audioLike.addEventListener('play', () => console.log('开始播放'));
 * audioLike.addEventListener('ended', () => console.log('播放结束'));
 * audioLike.play();
 * ```
 */
var AudioLike = exports.AudioLike = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(AudioLike, _Subscribe);
  var _super = _createSuper(AudioLike);
  /**
   * 创建 AudioLike 实例
   * @param options - 配置选项
   * @param options.duration - 音频持续时间（毫秒）
   */
  function AudioLike() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      duration = _ref.duration;
    (0, _classCallCheck2["default"])(this, AudioLike);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "$timestamp", 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "$currentTime", 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "$duration", 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "muted", false);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "src", '');
    if (duration) {
      _this.$duration = duration;
    }
    return _this;
  }

  /**
   * 开始播放音频
   * 
   * 如果是第一次播放，会记录开始时间戳。
   * 如果已播放到结尾，会重新开始播放。
   * 
   * @returns {void}
   * @fires AudioLikeEvent#play
   */
  (0, _createClass2["default"])(AudioLike, [{
    key: "setAttribute",
    value:
    /** 
     * 播放开始时的时间戳（毫秒）
     * @private
     */

    /** 
     * 当前播放时间（毫秒）
     * @private
     */

    /** 
     * 音频总时长（毫秒）
     * @private
     */

    /** 
     * 停止动画帧循环的函数
     * @private
     */

    /** 是否静音 */

    /** 音频源URL */

    /**
     * 设置元素属性（兼容性方法）
     * @param name - 属性名
     * @param value - 属性值
     */
    function setAttribute(name, value) {
      // 空实现，保持与 HTML Audio 元素接口兼容
    }
  }, {
    key: "play",
    value: function play() {
      var _this2 = this;
      if (this.$timestamp === 0) {
        this.$timestamp = performance.now();
      }
      if (this.$currentTime === this.$duration) {
        this.$currentTime = 0;
      }
      this.stopInterval = (0, _animationFrame.requestAnimationFrameInterval)(function () {
        return _this2.requestAnimationFrameLoop();
      });
      this.emit('play');
    }

    /**
     * 暂停播放
     * 
     * @returns {void}
     * @fires AudioLikeEvent#pause
     */
  }, {
    key: "pause",
    value: function pause() {
      if (this.stopInterval) {
        this.stopInterval();
        this.emit('pause');
        this.stopInterval = undefined;
      }
      this.$timestamp = 0;
    }

    /**
     * 动画帧循环处理函数
     * 
     * 负责更新播放时间，触发时间更新事件，
     * 并在播放结束时自动暂停并触发结束事件。
     * 
     * @private
     * @fires AudioLikeEvent#timeupdate
     * @fires AudioLikeEvent#ended
     */
  }, {
    key: "requestAnimationFrameLoop",
    value: function requestAnimationFrameLoop() {
      var now = performance.now();
      this.$currentTime = now - this.$timestamp;
      this.emit('timeupdate');
      if (this.$currentTime >= this.$duration - 10) {
        this.$currentTime = this.$duration;
        this.pause();
        this.emit('ended');
      }
    }

    /**
     * 获取当前播放时间
     * @returns {number} 当前播放时间（秒）
     */
  }, {
    key: "currentTime",
    get: function get() {
      return this.$currentTime / 1000;
    }

    /**
     * 设置当前播放时间
     * @param time - 播放时间（秒）
     */,
    set: function set(time) {
      this.$currentTime = time * 1000;
    }

    /**
     * 获取音频总时长
     * @returns {number} 音频总时长（毫秒）
     */
  }, {
    key: "duration",
    get: function get() {
      return this.$duration;
    }

    /**
     * 设置音频总时长
     * 
     * 设置新的时长时会自动重置播放状态
     * 
     * @param duration - 音频时长（毫秒）
     */,
    set: function set(duration) {
      this.pause();
      this.$duration = duration;
      this.$timestamp = 0;
      this.$currentTime = 0;
    }

    /**
     * 检查是否播放结束
     * @returns {boolean} 是否已播放结束
     */
  }, {
    key: "ended",
    get: function get() {
      return this.$currentTime === this.$duration;
    }

    /**
     * 检查是否已暂停
     * @returns {boolean} 是否处于暂停状态
     */
  }, {
    key: "paused",
    get: function get() {
      return !this.stopInterval;
    }

    /**
     * 添加事件监听器
     * 
     * @param evtName - 事件名称
     * @param callback - 回调函数
     * @param useCapture - 是否使用捕获模式（兼容性参数，未使用）
     */
  }, {
    key: "addEventListener",
    value: function addEventListener(evtName, callback) {
      var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.on(evtName, callback);
    }

    /**
     * 移除事件监听器
     * 
     * @param evtName - 事件名称
     * @param callback - 回调函数
     * @param useCapture - 是否使用捕获模式（兼容性参数，未使用）
     */
  }, {
    key: "removeEventListener",
    value: function removeEventListener(evtName, callback) {
      var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.off(evtName, callback);
    }
  }]);
  return AudioLike;
}(_five.Subscribe);
var _default = exports["default"] = AudioLike;
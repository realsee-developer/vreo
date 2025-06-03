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
 * 模拟 `<Audio>` 事件。
 */
/**
 * 模拟 `<Audio>` 功能：没有音频，但执行逻辑跟 `<Audio>` 相似。
 */
var AudioLike = exports.AudioLike = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(AudioLike, _Subscribe);
  var _super = _createSuper(AudioLike);
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
  (0, _createClass2["default"])(AudioLike, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      // nothing todo
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
  }, {
    key: "currentTime",
    get: function get() {
      return this.$currentTime / 1000;
    },
    set: function set(time) {
      this.$currentTime = time;
    }
  }, {
    key: "duration",
    get: function get() {
      return this.$duration;
    },
    set: function set(duration) {
      this.pause();
      this.$duration = duration;
      this.$timestamp = 0;
      this.$currentTime = 0;
    }
  }, {
    key: "ended",
    get: function get() {
      return this.$currentTime === this.$duration;
    }
  }, {
    key: "paused",
    get: function get() {
      return !this.stopInterval;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(evtName, callback) {
      var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.on(evtName, callback);
    }
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
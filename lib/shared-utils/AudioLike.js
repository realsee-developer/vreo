import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = _getPrototypeOf(t); if (r) { var s = _getPrototypeOf(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return _possibleConstructorReturn(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
import { Subscribe } from '@realsee/five';
import { requestAnimationFrameInterval } from "./animationFrame/index.js";
/**
 * 模拟 `<Audio>` 事件。
 */
/**
 * 模拟 `<Audio>` 功能：没有音频，但执行逻辑跟 `<Audio>` 相似。
 */
export var AudioLike = /*#__PURE__*/function (_Subscribe) {
  _inherits(AudioLike, _Subscribe);
  var _super = _createSuper(AudioLike);
  function AudioLike() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      duration = _ref.duration;
    _classCallCheck(this, AudioLike);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "$timestamp", null);
    _defineProperty(_assertThisInitialized(_this), "$currentTime", 0);
    _defineProperty(_assertThisInitialized(_this), "$duration", 0);
    _defineProperty(_assertThisInitialized(_this), "muted", false);
    _defineProperty(_assertThisInitialized(_this), "src", '');
    if (duration) {
      _this.$duration = duration;
    }
    return _this;
  }
  _createClass(AudioLike, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      // nothing todo
    }
  }, {
    key: "play",
    value: function play() {
      var _this2 = this;
      if (this.$currentTime === this.$duration) {
        this.$currentTime = 0;
      }
      if (this.$timestamp === null) {
        this.$timestamp = performance.now();
      }
      this.stopInterval = requestAnimationFrameInterval(function () {
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
      this.$timestamp = null;
    }
  }, {
    key: "requestAnimationFrameLoop",
    value: function requestAnimationFrameLoop() {
      if (this.$timestamp === null) return;
      var now = performance.now();
      this.$currentTime += now - this.$timestamp;
      this.$timestamp = now;
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
      this.$currentTime = time * 1000;
    }
  }, {
    key: "duration",
    get: function get() {
      return this.$duration;
    },
    set: function set(duration) {
      this.$duration = duration;
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
}(Subscribe);
export default AudioLike;
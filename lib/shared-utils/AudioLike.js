"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AudioLike = void 0;
var _five = require("@realsee/five");
var _animationFrame = require("./animationFrame");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * 模拟 `<Audio>` 功能：没有音频，但执行逻辑跟 `<Audio>` 相似。
 */
var AudioLike = /*#__PURE__*/function (_Subscribe) {
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
}(_five.Subscribe);
exports.AudioLike = AudioLike;
var _default = AudioLike;
exports["default"] = _default;
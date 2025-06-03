"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _five = require("@realsee/five");
var _animationFrame = require("../shared-utils/animationFrame");
var _createHTMLAudioElement = require("./createHTMLAudioElement");
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var closures = {};
var PlayController = exports.PlayController = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(PlayController, _Subscribe);
  var _super = _createSuper(PlayController);
  function PlayController() {
    var _this;
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, PlayController);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "config", {});
    if (!config.audio) {
      config.audio = (0, _createHTMLAudioElement.createHTMLAudioElement)();
    }
    _this.config = Object.assign(_this.config, config);
    closures.onPlaying = function () {
      return _this.emit('playing');
    };
    closures.onPaused = function () {
      return _this.emit('paused');
    };
    closures.onEnded = function () {
      return _this.emit('paused', true);
    };
    _this.audioInstance.addEventListener('play', closures.onPlaying);
    _this.audioInstance.addEventListener('pause', closures.onPaused);
    _this.audioInstance.addEventListener('ended', closures.onEnded);
    _this.stopInterval = (0, _animationFrame.requestAnimationFrameInterval)(function () {
      if (_this.audioInstance.paused) {
        return;
      }
      if (!_this.vreoUnit) {
        return;
      }
      var keyframes = _this.vreoUnit.keyframes;
      var currentTime = _this.currentTime;
      // 没有被解析过且开始时间低于当前时间戳 100ms
      var currentKeyframes = keyframes.filter(function (keyframe) {
        if (keyframe.parsed) return false;
        var dur = currentTime - keyframe.start;
        return dur <= 60 && dur >= 0;
      });
      currentKeyframes.forEach(function (keyframe) {
        if (keyframe.parsed) return;
        keyframe.parsed = true;
        _this.emit(keyframe.type, keyframe, _this.currentTime);
      });
    });
    return _this;
  }

  /**
   * 载入数据
   */
  (0, _createClass2["default"])(PlayController, [{
    key: "paused",
    get: function get() {
      return this.audioInstance.paused;
    }
  }, {
    key: "audioInstance",
    get: function get() {
      return this.config.audio;
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this.audioInstance.currentTime * 1000;
    }
  }, {
    key: "currentKeyframes",
    get: function get() {
      var _this2 = this;
      if (!this.vreoUnit) return [];
      var keyframes = this.vreoUnit.keyframes;
      // 没有被解析过且开始时间低于当前时间戳 100ms
      return keyframes.filter(function (keyframe) {
        if (keyframe.parsed) return false;
        var dur = _this2.currentTime - keyframe.start;
        return dur <= 100 && dur >= 0;
      });
    }

    /**
     * 音频时长 不一定能获取得到，建议以 VreoUnit 配置的时长为准。
     */
  }, {
    key: "duration",
    get: function get() {
      return this.audioInstance.duration * 1000;
    }
  }, {
    key: "load",
    value: (function () {
      var _load = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(vreoUnit) {
        var _this3 = this;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.vreoUnit = vreoUnit;
                _context.next = 3;
                return this.pause();
              case 3:
                _context.next = 5;
                return new Promise(function (resolve, reject) {
                  if (vreoUnit.video.url === _this3.audioInstance.src) {
                    return resolve(true);
                  }
                  _this3.audioInstance.src = vreoUnit.video.url;
                  var canplaythrough = function canplaythrough() {
                    resolve(true);
                    _this3.audioInstance.removeEventListener('canplaythrough', canplaythrough);
                  };
                  var error = function error(err) {
                    reject(err);
                    _this3.audioInstance.removeEventListener('error', error);
                  };
                  _this3.audioInstance.addEventListener('canplaythrough', canplaythrough);
                  _this3.audioInstance.addEventListener('error', error);
                });
              case 5:
                return _context.abrupt("return", _context.sent);
              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function load(_x) {
        return _load.apply(this, arguments);
      }
      return load;
    }()
    /**
     * 播放
     */
    )
  }, {
    key: "play",
    value: (function () {
      var _play = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                closures.playPromise = this.audioInstance.play();
              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function play() {
        return _play.apply(this, arguments);
      }
      return play;
    }()
    /**
     * 暂停
     */
    )
  }, {
    key: "pause",
    value: (function () {
      var _pause = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!closures.playPromise) {
                  _context3.next = 3;
                  break;
                }
                _context3.next = 3;
                return closures.playPromise;
              case 3:
                this.audioInstance.pause();
              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      function pause() {
        return _pause.apply(this, arguments);
      }
      return pause;
    }()
    /**
     * 销毁资源
     * @notice 一旦销毁，创建的实例将不可用：需重新创建实例。
     * 
     * @deprecated **慎重执行**
     */
    )
  }, {
    key: "dispose",
    value: function dispose() {
      // 清理事件监听
      this.audioInstance.removeEventListener('play', closures.onPlaying);
      this.audioInstance.removeEventListener('pasue', closures.onPaused);
      this.audioInstance.removeEventListener('ended', closures.onEnded);
      if (this.stopInterval) {
        this.stopInterval();
      }
    }
  }]);
  return PlayController;
}(_five.Subscribe);
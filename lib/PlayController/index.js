"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayController = void 0;

var _five = require("@realsee/five");

var _animationFrame = require("../shared-utils/animationFrame");

var _createHTMLAudioElement = require("./createHTMLAudioElement");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var closures = {};

var PlayController = /*#__PURE__*/function (_Subscribe) {
  _inherits(PlayController, _Subscribe);

  var _super = _createSuper(PlayController);

  function PlayController() {
    var _this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PlayController);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "config", {});

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
      var currentTime = _this.currentTime; // 没有被解析过且开始时间低于当前时间戳 100ms

      var currentKeyframes = keyframes.filter(function (keyframe) {
        if (keyframe.parsed) return false;
        var dur = currentTime - keyframe.start;
        return dur <= 60 && dur >= 0;
      });
      currentKeyframes.forEach(function (keyframe) {
        if (keyframe.parsed) return;
        keyframe.parsed = true;

        _this.emit(keyframe.type, keyframe);
      });
    });
    return _this;
  }
  /**
   * 载入数据
   */


  _createClass(PlayController, [{
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
      var keyframes = this.vreoUnit.keyframes; // 没有被解析过且开始时间低于当前时间戳 100ms

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
    value: function () {
      var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(vreoUnit) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('load', vreoUnit);
                this.vreoUnit = vreoUnit;
                _context.next = 4;
                return this.pause();

              case 4:
                _context.next = 6;
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

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
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

  }, {
    key: "play",
    value: function () {
      var _play = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
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

  }, {
    key: "pause",
    value: function () {
      var _pause = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
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

exports.PlayController = PlayController;
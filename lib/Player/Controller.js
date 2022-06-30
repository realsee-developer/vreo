"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControllerContext = exports.Controller = void 0;

var _five = require("@realsee/five");

var _mobx = require("mobx");

var React = _interopRequireWildcard(require("react"));

var _animationFrame = require("../shared-utils/animationFrame");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

/**
 * 逻辑控制器：内部状态。
 */
var Controller = /*#__PURE__*/function (_Subscribe) {
  _inherits(Controller, _Subscribe);

  var _super = _createSuper(Controller);

  function Controller() {
    var _this;

    _classCallCheck(this, Controller);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "playing", false);

    _defineProperty(_assertThisInitialized(_this), "ended", false);

    _defineProperty(_assertThisInitialized(_this), "visible", false);

    _defineProperty(_assertThisInitialized(_this), "popUp", null);

    _defineProperty(_assertThisInitialized(_this), "drawerConfig", null);

    (0, _mobx.makeObservable)(_assertThisInitialized(_this), {
      visible: _mobx.observable,
      setVisible: _mobx.action,
      playing: _mobx.observable,
      setPlaying: _mobx.action,
      popUp: _mobx.observable.ref,
      openPopUp: _mobx.action,
      drawerConfig: _mobx.observable.ref,
      openDrawer: _mobx.action,
      ended: _mobx.observable,
      setEnded: _mobx.action
    }); // 监听播放情况：抛出触发时机

    (0, _mobx.reaction)(function () {
      return _this.ended;
    }, function (ended) {
      if (ended) {
        _this.emit('paused', true);
      }
    });
    (0, _mobx.reaction)(function () {
      return _this.playing;
    }, function (playing) {
      if (!_this.ended) {
        _this.emit(playing ? 'playing' : 'paused');
      }
    });
    return _this;
  }

  _createClass(Controller, [{
    key: "isAudio",
    get: function get() {
      var _this$videoAgentScene, _this$videoAgentScene2;

      return !((_this$videoAgentScene = this.videoAgentScene) !== null && _this$videoAgentScene !== void 0 && (_this$videoAgentScene2 = _this$videoAgentScene.videoAgentMesh.videoUrl) !== null && _this$videoAgentScene2 !== void 0 && _this$videoAgentScene2.endsWith('.mp4'));
    }
  }, {
    key: "openPopUp",
    value: function openPopUp(popUp) {
      if (!popUp) {
        this.popUp = null;
        return;
      }

      this.popUp = popUp;
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.visible = v;
    }
  }, {
    key: "setPlaying",
    value: function setPlaying(playing) {
      this.playing = playing;
    }
  }, {
    key: "setEnded",
    value: function setEnded(ended) {
      this.ended = ended;
    }
  }, {
    key: "openDrawer",
    value: function openDrawer(drawerConfig) {
      if (!drawerConfig) {
        var _this$drawerConfig;

        this.drawerConfig = {
          content: '',
          height: (_this$drawerConfig = this.drawerConfig) === null || _this$drawerConfig === void 0 ? void 0 : _this$drawerConfig.height
        };
        return;
      }

      this.drawerConfig = drawerConfig;
    }
  }, {
    key: "ready",
    get: function get() {
      return !!this.videoAgentScene;
    }
  }, {
    key: "currentTime",
    get: function get() {
      var _this$videoAgentScene3;

      return ((_this$videoAgentScene3 = this.videoAgentScene) === null || _this$videoAgentScene3 === void 0 ? void 0 : _this$videoAgentScene3.videoAgentMesh.currentTime) || 0;
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
  }, {
    key: "videoInstance",
    get: function get() {
      var _this$videoAgentScene4;

      return (_this$videoAgentScene4 = this.videoAgentScene) === null || _this$videoAgentScene4 === void 0 ? void 0 : _this$videoAgentScene4.videoAgentMesh.videoInstance;
    }
    /**
     * 逐帧任务
     */

  }, {
    key: "requestAnimationFrameLoop",
    value: function requestAnimationFrameLoop(callback) {
      var _this$videoInstance,
          _this$videoInstance4,
          _this3 = this;

      if ((_this$videoInstance = this.videoInstance) !== null && _this$videoInstance !== void 0 && _this$videoInstance.ended) {
        this.setEnded(true);
        this.setPlaying(false);
        this.videoInstance.pause();
        return;
      }

      if (!this.playing) {
        var _this$videoInstance2;

        if (!((_this$videoInstance2 = this.videoInstance) !== null && _this$videoInstance2 !== void 0 && _this$videoInstance2.paused)) {
          var _this$videoInstance3;

          (_this$videoInstance3 = this.videoInstance) === null || _this$videoInstance3 === void 0 ? void 0 : _this$videoInstance3.pause();
        }

        return;
      }

      if ((_this$videoInstance4 = this.videoInstance) !== null && _this$videoInstance4 !== void 0 && _this$videoInstance4.paused && this.playing) {
        this.videoInstance.play();
      }

      var currentKeyframes = this.currentKeyframes;
      currentKeyframes.forEach(function (keyframe) {
        if (keyframe.parsed) return;
        keyframe.parsed = true;

        _this3.emit(keyframe.type, keyframe);

        if (callback) {
          callback(keyframe.type, keyframe);
        }
      });
    }
  }, {
    key: "run",
    value: function run(callback) {
      var _this4 = this;

      if (this.stopInterval) return;
      this.stopInterval = (0, _animationFrame.requestAnimationFrameInterval)(function () {
        return _this4.requestAnimationFrameLoop(callback);
      });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.setPlaying(false);

      if (this.currentKeyframes) {
        this.currentKeyframes.forEach(function (keyframe) {
          return keyframe.parsed = false;
        });
      }
      /**
       * 清理掉数据
       */


      this.vreoUnit = undefined;

      if (this.videoInstance) {
        this.videoInstance.currentTime = 0;
      }

      if (this.stopInterval) {
        this.stopInterval();
        this.stopInterval = undefined;
      }
    }
  }]);

  return Controller;
}(_five.Subscribe);

exports.Controller = Controller;
var ControllerContext = /*#__PURE__*/React.createContext(null);
exports.ControllerContext = ControllerContext;
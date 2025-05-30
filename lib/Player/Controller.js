"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControllerContext = exports.Controller = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _five = require("@realsee/five");

var _mobx = require("mobx");

var React = _interopRequireWildcard(require("react"));

var _animationFrame = require("../shared-utils/animationFrame");

var _VreoUnit = require("../typings/VreoUnit");

var _setElementDataset = _interopRequireDefault(require("../shared-utils/setElementDataset"));

var _getMediaInfo = require("../shared-utils/getMediaInfo");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * 逻辑控制器：内部状态。
 */
var Controller = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(Controller, _Subscribe);

  var _super = _createSuper(Controller);

  function Controller(_ref) {
    var _this;

    var five = _ref.five,
        container = _ref.container,
        configs = _ref.configs;
    (0, _classCallCheck2["default"])(this, Controller);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "playing", false);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ended", false);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "loading", false);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "containerSize", {
      width: 0,
      height: 0
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "waveAppearance", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "appearance", {
      waveStyle: 'wave'
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "avatar", {});
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "visible", false);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "popUp", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "drawerConfig", null);
    _this.configs = configs;
    _this.container = container;
    _this.five = five;
    _this.appSize = configs.appSize;
    _this.appearance = _objectSpread(_objectSpread({}, _this.appearance), configs.appearance);
    (0, _mobx.makeObservable)((0, _assertThisInitialized2["default"])(_this), {
      visible: _mobx.observable,
      setVisible: _mobx.action,
      playing: _mobx.observable,
      setPlaying: _mobx.action,
      loading: _mobx.observable,
      // videoAgentScene: observable.ref,
      setLoading: _mobx.action,
      popUp: _mobx.observable.ref,
      openPopUp: _mobx.action,
      drawerConfig: _mobx.observable.ref,
      openDrawer: _mobx.action,
      ended: _mobx.observable,
      waveAppearance: _mobx.observable,
      avatar: _mobx.observable,
      containerSize: _mobx.observable,
      setContainerSize: _mobx.action,
      appearance: _mobx.observable,
      setAppearance: _mobx.action,
      configs: _mobx.observable.ref,
      setEnded: _mobx.action,
      setAvatar: _mobx.action
    });
    (0, _mobx.reaction)(function () {
      return [_this.appearance.waveStyle, _this.loading];
    }, function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
          waveStyle = _ref3[0],
          loading = _ref3[1];

      if (loading === null) {
        _this.waveAppearance = null;
        return;
      }

      if (waveStyle === 'wave') {
        switch (loading) {
          case true:
            _this.waveAppearance = 'double';
            break;

          case false:
            _this.waveAppearance = 'solid';
            break;
        }
      } else if (waveStyle === 'solid') {
        switch (loading) {
          case true:
            _this.waveAppearance = 'swap';
            break;

          case false:
            _this.waveAppearance = 'expand';
            break;
        }
      }
    }, {
      fireImmediately: true
    });

    if (!_this.appSize) {
      (0, _mobx.reaction)(function () {
        return _this.containerSize;
      }, function (containerSize) {
        if (!(containerSize !== null && containerSize !== void 0 && containerSize.width)) return;
        var width = containerSize.width;
        var height = containerSize.height;

        var size = function () {
          if (width <= 500) return 'S';
          if (width <= 1024) return 'M';
          if (width <= 2048) return 'L';
          return 'XL';
        }();

        var orientation = function () {
          if (height > width) return 'portrait';
          return 'landscape';
        }();

        (0, _setElementDataset["default"])(_this.container, {
          size: size
        });
        (0, _setElementDataset["default"])(_this.container, {
          orientation: orientation
        });
      }, {
        fireImmediately: true
      });
    } else {
      (0, _setElementDataset["default"])(_this.container, {
        size: _this.appSize
      });
    } // 监听播放情况：抛出触发时机


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

  (0, _createClass2["default"])(Controller, [{
    key: "agentType",
    get: // null 表示加载失败
    function get() {
      var _this$videoAgentScene, _this$avatar;

      var type = (0, _getMediaInfo.getMediaType)((_this$videoAgentScene = this.videoAgentScene) === null || _this$videoAgentScene === void 0 ? void 0 : _this$videoAgentScene.videoAgentMesh.videoUrl);
      if ((_this$avatar = this.avatar) !== null && _this$avatar !== void 0 && _this$avatar.force) return 'avatar';
      if (type === 'video') return 'video';
      return 'none';
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
    key: "setLoading",
    value: function setLoading(loading) {
      this.loading = loading;
    }
  }, {
    key: "setAvatar",
    value: function setAvatar(avatar) {
      this.avatar = avatar;
    }
  }, {
    key: "setContainerSize",
    value: function setContainerSize(width, height) {
      this.containerSize = {
        width: width,
        height: height
      };
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
    key: "setAppearance",
    value: function setAppearance(appearance) {
      this.appearance = _objectSpread(_objectSpread({}, this.appearance), appearance);
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
      var _this$videoAgentScene2;

      return ((_this$videoAgentScene2 = this.videoAgentScene) === null || _this$videoAgentScene2 === void 0 ? void 0 : _this$videoAgentScene2.videoAgentMesh.currentTime) || 0;
    }
  }, {
    key: "currentKeyframes",
    get: function get() {
      var _this2 = this;

      if (!this.vreoUnit) return [];
      var keyframes = this.vreoUnit.keyframes; // 没有被解析过且开始时间低于当前时间戳 100ms

      return keyframes.filter(function (keyframe) {
        if (keyframe.parsed) return false; // 检测结束时间

        if (keyframe.end < _this2.currentTime) return false; // 检测开始时间

        if (keyframe.start > _this2.currentTime) return false;
        if (keyframe.type === _VreoUnit.VreoKeyframeEnum.BgMusic) return true; // 开始时间低于当前时间戳 100ms

        var dur = _this2.currentTime - keyframe.start;
        return dur <= 100 && dur >= 0;
      });
    }
  }, {
    key: "mediaInstance",
    get: function get() {
      var _this$videoAgentScene3;

      return (_this$videoAgentScene3 = this.videoAgentScene) === null || _this$videoAgentScene3 === void 0 ? void 0 : _this$videoAgentScene3.videoAgentMesh.mediaInstance;
    }
    /**
     * 逐帧任务
     */

  }, {
    key: "requestAnimationFrameLoop",
    value: function requestAnimationFrameLoop(callback) {
      var _this$mediaInstance,
          _this$mediaInstance4,
          _this3 = this;

      if ((_this$mediaInstance = this.mediaInstance) !== null && _this$mediaInstance !== void 0 && _this$mediaInstance.ended && this.mediaInstance.currentTime !== 0) {
        var _this$vreoUnit;

        if (this.ended) return;
        (_this$vreoUnit = this.vreoUnit) === null || _this$vreoUnit === void 0 ? void 0 : _this$vreoUnit.keyframes.forEach(function (keyframe) {
          return keyframe.parsed = false;
        });
        this.setEnded(true);
        this.setPlaying(false);
        this.mediaInstance.pause();
        this.mediaInstance.currentTime = 0;
        return;
      }

      if (!this.playing) {
        var _this$mediaInstance2;

        if (!((_this$mediaInstance2 = this.mediaInstance) !== null && _this$mediaInstance2 !== void 0 && _this$mediaInstance2.paused)) {
          var _this$mediaInstance3;

          (_this$mediaInstance3 = this.mediaInstance) === null || _this$mediaInstance3 === void 0 ? void 0 : _this$mediaInstance3.pause();
        }

        return;
      }

      if ((_this$mediaInstance4 = this.mediaInstance) !== null && _this$mediaInstance4 !== void 0 && _this$mediaInstance4.paused && this.playing) {
        this.mediaInstance.play();
      }

      var currentKeyframes = this.currentKeyframes;
      currentKeyframes.forEach(function (keyframe) {
        if (keyframe.parsed) return;
        keyframe.parsed = true;

        _this3.emit(keyframe.type, keyframe, _this3.currentTime);

        if (callback) {
          callback(keyframe.type, keyframe, _this3.currentTime);
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
    key: "clear",
    value: function clear() {
      var _this$vreoUnit2, _this$stopInterval;

      this.setPlaying(false);
      (_this$vreoUnit2 = this.vreoUnit) === null || _this$vreoUnit2 === void 0 ? void 0 : _this$vreoUnit2.keyframes.forEach(function (keyframe) {
        return keyframe.parsed = false;
      });
      /**
       * 清理掉数据
       */

      this.vreoUnit = undefined;

      if (this.mediaInstance) {
        this.mediaInstance.pause();
        this.mediaInstance.currentTime = 0;
      }

      (_this$stopInterval = this.stopInterval) === null || _this$stopInterval === void 0 ? void 0 : _this$stopInterval.call(this);
      this.stopInterval = undefined;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.clear();
    }
  }]);
  return Controller;
}(_five.Subscribe);

exports.Controller = Controller;
var ControllerContext = /*#__PURE__*/React.createContext(null);
exports.ControllerContext = ControllerContext;
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * Vreo 播放器逻辑控制器
 * 
 * 负责管理播放器的内部状态、事件处理、UI 控制和剧本执行。
 * 提供播放控制、外观设置、弹窗管理、抽屉控制等功能。
 * 
 * @example
 * ```typescript
 * const controller = new Controller({
 *   five: fiveInstance,
 *   container: document.getElementById('container'),
 *   configs: playerConfigs
 * })
 * 
 * // 设置播放状态
 * controller.setPlaying(true)
 * 
 * // 打开弹窗
 * controller.openPopUp('弹窗内容')
 * 
 * // 打开抽屉
 * controller.openDrawer({ content: '抽屉内容', height: 300 })
 * ```
 */
var Controller = exports.Controller = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(Controller, _Subscribe);
  var _super = _createSuper(Controller);
  /**
   * 创建 Controller 实例
   * @param params - 构造参数对象
   * @param params.five - Five 渲染引擎实例
   * @param params.container - DOM 容器元素
   * @param params.configs - 播放器配置
   */
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
    }

    // 监听播放情况：抛出触发时机
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

  /**
   * 获取播放器是否准备就绪
   * @returns 是否有可用的视频代理场景
   */
  (0, _createClass2["default"])(Controller, [{
    key: "agentType",
    get:
    // null 表示加载失败

    /**
     * 获取当前播放媒体的类型
     * @returns 'video' | 'avatar' | 'none' - 媒体类型
     */
    function get() {
      var _this$videoAgentScene, _this$avatar;
      var type = (0, _getMediaInfo.getMediaType)((_this$videoAgentScene = this.videoAgentScene) === null || _this$videoAgentScene === void 0 ? void 0 : _this$videoAgentScene.videoAgentMesh.videoUrl);
      if ((_this$avatar = this.avatar) !== null && _this$avatar !== void 0 && _this$avatar.force) return 'avatar';
      if (type === 'video') return 'video';
      return 'none';
    }
  }, {
    key: "openPopUp",
    value:
    /**
     * 打开或关闭弹窗
     * @param popUp - 弹窗内容，可以是字符串、JSX元素或false（关闭弹窗）
     */
    function openPopUp(popUp) {
      if (!popUp) {
        this.popUp = null;
        return;
      }
      this.popUp = popUp;
    }

    /**
     * 设置加载状态
     * @param loading - 加载状态：true（加载中）、false（加载完成）、null（加载失败）
     */
  }, {
    key: "setLoading",
    value: function setLoading(loading) {
      this.loading = loading;
    }
  }, {
    key: "setAvatar",
    value:
    /**
     * 设置虚拟形象配置
     * @param avatar - 虚拟形象配置对象
     */
    function setAvatar(avatar) {
      this.avatar = avatar;
    }

    /**
     * 设置容器尺寸
     * @param width - 容器宽度
     * @param height - 容器高度
     */
  }, {
    key: "setContainerSize",
    value: function setContainerSize(width, height) {
      this.containerSize = {
        width: width,
        height: height
      };
    }

    /**
     * 设置播放器可见性
     * @param v - 是否可见
     */
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.visible = v;
    }

    /**
     * 设置播放状态
     * @param playing - 是否正在播放
     */
  }, {
    key: "setPlaying",
    value: function setPlaying(playing) {
      this.playing = playing;
    }

    /**
     * 设置结束状态
     * @param ended - 是否已结束
     */
  }, {
    key: "setEnded",
    value: function setEnded(ended) {
      this.ended = ended;
    }

    /**
     * 设置播放器外观
     * @param appearance - 外观配置对象
     */
  }, {
    key: "setAppearance",
    value: function setAppearance(appearance) {
      this.appearance = _objectSpread(_objectSpread({}, this.appearance), appearance);
    }

    /**
     * 打开或关闭抽屉
     * @param drawerConfig - 抽屉配置对象，false表示关闭抽屉
     */
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

    /**
     * 获取当前播放时间（毫秒）
     * @returns 当前播放时间戳
     */
  }, {
    key: "currentTime",
    get: function get() {
      var _this$videoAgentScene2;
      return ((_this$videoAgentScene2 = this.videoAgentScene) === null || _this$videoAgentScene2 === void 0 ? void 0 : _this$videoAgentScene2.videoAgentMesh.currentTime) || 0;
    }

    /**
     * 获取当前时间点应该触发的关键帧
     * @returns 当前应该执行的关键帧数组
     */
  }, {
    key: "currentKeyframes",
    get: function get() {
      var _this2 = this;
      if (!this.vreoUnit) return [];
      var keyframes = this.vreoUnit.keyframes;
      // 没有被解析过且开始时间低于当前时间戳 100ms
      return keyframes.filter(function (keyframe) {
        if (keyframe.parsed) return false;
        // 检测结束时间
        if (keyframe.end < _this2.currentTime) return false;
        // 检测开始时间
        if (keyframe.start > _this2.currentTime) return false;
        if (keyframe.type === _VreoUnit.VreoKeyframeEnum.BgMusic) return true;
        // 开始时间低于当前时间戳 100ms
        var dur = _this2.currentTime - keyframe.start;
        return dur <= 100 && dur >= 0;
      });
    }

    /**
     * 获取当前媒体实例（音频或视频元素）
     * @returns HTML媒体元素实例
     */
  }, {
    key: "mediaInstance",
    get: function get() {
      var _this$videoAgentScene3;
      return (_this$videoAgentScene3 = this.videoAgentScene) === null || _this$videoAgentScene3 === void 0 ? void 0 : _this$videoAgentScene3.videoAgentMesh.mediaInstance;
    }

    /**
     * 逐帧任务循环处理
     * 
     * 在每个动画帧中检查播放状态、处理关键帧触发等
     * @param callback - 关键帧触发时的回调函数
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

    /**
     * 开始运行播放器逻辑循环
     * 
     * 启动帧循环，持续监听并处理关键帧事件
     * @param callback - 关键帧触发时的回调函数
     */
  }, {
    key: "run",
    value: function run(callback) {
      var _this4 = this;
      if (this.stopInterval) return;
      this.stopInterval = (0, _animationFrame.requestAnimationFrameInterval)(function () {
        return _this4.requestAnimationFrameLoop(callback);
      });
    }

    /**
     * 清理播放器状态
     * 
     * 停止播放、重置关键帧状态、清理数据和定时器
     */
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

    /**
     * 销毁控制器实例
     * 
     * 清理所有状态和资源，释放内存
     */
  }, {
    key: "dispose",
    value: function dispose() {
      this.clear();
    }
  }]);
  return Controller;
}(_five.Subscribe);
var ControllerContext = exports.ControllerContext = /*#__PURE__*/React.createContext(null);
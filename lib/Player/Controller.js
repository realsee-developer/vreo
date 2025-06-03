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
 * 逻辑控制器：内部状态。
 */
var Controller = exports.Controller = /*#__PURE__*/function (_Subscribe) {
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

    // 配置 MobX 观察者模式，设置响应式状态管理
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

    /**
     * 波形外观响应式逻辑
     * 
     * 根据波形样式和加载状态自动计算显示的波形外观：
     * - wave 样式：loading时显示双波形，完成时显示实心波形
     * - solid 样式：loading时显示交换动画，完成时显示展开动画
     */
    (0, _mobx.reaction)(function () {
      return [_this.appearance.waveStyle, _this.loading];
    }, function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
        waveStyle = _ref3[0],
        loading = _ref3[1];
      if (loading === null) {
        _this.waveAppearance = null; // 加载失败时不显示波形
        return;
      }
      if (waveStyle === 'wave') {
        switch (loading) {
          case true:
            _this.waveAppearance = 'double'; // 加载中：双波形动画
            break;
          case false:
            _this.waveAppearance = 'solid'; // 加载完成：实心波形
            break;
        }
      } else if (waveStyle === 'solid') {
        switch (loading) {
          case true:
            _this.waveAppearance = 'swap'; // 加载中：交换动画
            break;
          case false:
            _this.waveAppearance = 'expand'; // 加载完成：展开动画
            break;
        }
      }
    }, {
      fireImmediately: true
    });

    /**
     * 响应式布局管理
     * 
     * 根据容器尺寸自动调整布局和样式：
     * - 计算设备尺寸等级（S/M/L/XL）
     * - 判断屏幕方向（横屏/竖屏）
     * - 设置容器的数据属性用于CSS样式控制
     */
    if (!_this.appSize) {
      (0, _mobx.reaction)(function () {
        return _this.containerSize;
      }, function (containerSize) {
        if (!(containerSize !== null && containerSize !== void 0 && containerSize.width)) return;
        var width = containerSize.width;
        var height = containerSize.height;

        // 根据宽度计算设备尺寸等级
        var size = function () {
          if (width <= 500) return 'S'; // 小屏设备
          if (width <= 1024) return 'M'; // 中等设备
          if (width <= 2048) return 'L'; // 大屏设备
          return 'XL'; // 超大屏设备
        }();

        // 判断屏幕方向
        var orientation = function () {
          if (height > width) return 'portrait'; // 竖屏
          return 'landscape'; // 横屏
        }();

        // 设置CSS数据属性，用于响应式样式
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
      // 如果指定了固定尺寸，直接设置
      (0, _setElementDataset["default"])(_this.container, {
        size: _this.appSize
      });
    }

    /**
     * 播放结束状态管理
     * 
     * 当播放结束时，自动触发暂停事件
     */
    (0, _mobx.reaction)(function () {
      return _this.ended;
    }, function (ended) {
      if (ended) {
        _this.emit('paused', true); // 传递 true 表示是因为结束而暂停
      }
    });

    /**
     * 播放状态管理
     * 
     * 播放状态变化时触发相应事件，但排除结束状态的情况
     */
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
   * 检查播放器是否已准备就绪
   * @returns {boolean} 是否有可用的视频代理场景
   */
  (0, _createClass2["default"])(Controller, [{
    key: "agentType",
    get:
    // null 表示加载失败

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

    /**
     * 获取当前播放时间（毫秒）
     * @returns {number} 当前播放时间，如果没有媒体实例则返回 0
     */
  }, {
    key: "currentTime",
    get: function get() {
      var _this$videoAgentScene2;
      return ((_this$videoAgentScene2 = this.videoAgentScene) === null || _this$videoAgentScene2 === void 0 ? void 0 : _this$videoAgentScene2.videoAgentMesh.currentTime) || 0;
    }

    /**
     * 获取当前需要处理的关键帧列表
     * 
     * 关键帧筛选逻辑：
     * 1. 必须是未解析的关键帧
     * 2. 结束时间必须晚于当前时间
     * 3. 开始时间必须早于或等于当前时间
     * 4. 对于非背景音乐，开始时间与当前时间的差值必须在100ms内
     * 
     * @returns {VreoKeyframe[]} 当前应该处理的关键帧数组
     */
  }, {
    key: "currentKeyframes",
    get: function get() {
      var _this2 = this;
      if (!this.vreoUnit) return [];
      var keyframes = this.vreoUnit.keyframes;
      return keyframes.filter(function (keyframe) {
        // 跳过已解析的关键帧
        if (keyframe.parsed) return false;

        // 检查关键帧是否已过期
        if (keyframe.end < _this2.currentTime) return false;

        // 检查关键帧是否还未到时间
        if (keyframe.start > _this2.currentTime) return false;

        // 背景音乐关键帧特殊处理：只要在时间范围内就处理
        if (keyframe.type === _VreoUnit.VreoKeyframeEnum.BgMusic) return true;

        // 其他关键帧：需要在开始时间的100ms窗口内
        var dur = _this2.currentTime - keyframe.start;
        return dur <= 100 && dur >= 0; // 允许100ms的时间误差
      });
    }

    /**
     * 获取当前活动的媒体实例
     * @returns {HTMLAudioElement | HTMLVideoElement | AudioLike | undefined} 媒体实例
     */
  }, {
    key: "mediaInstance",
    get: function get() {
      var _this$videoAgentScene3;
      return (_this$videoAgentScene3 = this.videoAgentScene) === null || _this$videoAgentScene3 === void 0 ? void 0 : _this$videoAgentScene3.videoAgentMesh.mediaInstance;
    }

    /**
     * 逐帧任务处理函数
     * 
     * 这是播放控制的核心函数，每个动画帧都会被调用。
     * 主要负责：
     * 1. 检查播放结束状态
     * 2. 控制媒体播放/暂停
     * 3. 处理当前时间点的关键帧
     * 
     * @param callback - 关键帧处理回调函数
     */
  }, {
    key: "requestAnimationFrameLoop",
    value: function requestAnimationFrameLoop(callback) {
      var _this$mediaInstance,
        _this$mediaInstance4,
        _this3 = this;
      // 检查播放是否已结束
      if ((_this$mediaInstance = this.mediaInstance) !== null && _this$mediaInstance !== void 0 && _this$mediaInstance.ended && this.mediaInstance.currentTime !== 0) {
        var _this$vreoUnit;
        if (this.ended) return; // 避免重复处理

        // 重置所有关键帧的解析状态，为下次播放做准备
        (_this$vreoUnit = this.vreoUnit) === null || _this$vreoUnit === void 0 ? void 0 : _this$vreoUnit.keyframes.forEach(function (keyframe) {
          return keyframe.parsed = false;
        });

        // 设置结束状态并暂停播放
        this.setEnded(true);
        this.setPlaying(false);
        this.mediaInstance.pause();
        this.mediaInstance.currentTime = 0;
        return;
      }

      // 如果控制器显示暂停，确保媒体实例也暂停
      if (!this.playing) {
        var _this$mediaInstance2;
        if (!((_this$mediaInstance2 = this.mediaInstance) !== null && _this$mediaInstance2 !== void 0 && _this$mediaInstance2.paused)) {
          var _this$mediaInstance3;
          (_this$mediaInstance3 = this.mediaInstance) === null || _this$mediaInstance3 === void 0 ? void 0 : _this$mediaInstance3.pause();
        }
        return;
      }

      // 如果控制器显示播放，但媒体实例暂停了，则恢复播放
      if ((_this$mediaInstance4 = this.mediaInstance) !== null && _this$mediaInstance4 !== void 0 && _this$mediaInstance4.paused && this.playing) {
        this.mediaInstance.play();
      }

      // 处理当前时间点的所有关键帧
      var currentKeyframes = this.currentKeyframes;
      currentKeyframes.forEach(function (keyframe) {
        if (keyframe.parsed) return; // 双重检查，避免重复处理

        // 标记为已解析，防止重复触发
        keyframe.parsed = true;

        // 触发内部事件
        _this3.emit(keyframe.type, keyframe, _this3.currentTime);

        // 调用外部回调
        if (callback) {
          callback(keyframe.type, keyframe, _this3.currentTime);
        }
      });
    }

    /**
     * 启动播放循环
     * 
     * 创建一个动画帧循环来持续处理播放逻辑。
     * 使用防重复启动机制，确保只有一个循环在运行。
     * 
     * @param callback - 关键帧处理回调函数
     */
  }, {
    key: "run",
    value: function run(callback) {
      var _this4 = this;
      if (this.stopInterval) return; // 防止重复启动
      this.stopInterval = (0, _animationFrame.requestAnimationFrameInterval)(function () {
        return _this4.requestAnimationFrameLoop(callback);
      });
    }

    /**
     * 清理播放器状态
     * 
     * 重置所有播放相关的状态和数据：
     * 1. 停止播放
     * 2. 重置关键帧解析状态
     * 3. 清理数据引用
     * 4. 停止动画循环
     */
  }, {
    key: "clear",
    value: function clear() {
      var _this$vreoUnit2, _this$stopInterval;
      this.setPlaying(false);

      // 重置所有关键帧的解析状态
      (_this$vreoUnit2 = this.vreoUnit) === null || _this$vreoUnit2 === void 0 ? void 0 : _this$vreoUnit2.keyframes.forEach(function (keyframe) {
        return keyframe.parsed = false;
      });

      // 清理数据引用
      this.vreoUnit = undefined;

      // 重置媒体实例状态
      if (this.mediaInstance) {
        this.mediaInstance.pause();
        this.mediaInstance.currentTime = 0;
      }

      // 停止动画循环
      (_this$stopInterval = this.stopInterval) === null || _this$stopInterval === void 0 ? void 0 : _this$stopInterval.call(this);
      this.stopInterval = undefined;
    }

    /**
     * 销毁控制器并清理所有资源
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
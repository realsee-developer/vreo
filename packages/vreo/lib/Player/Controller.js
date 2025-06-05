import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import { Subscribe } from '@realsee/five';
import { action, makeObservable, observable, reaction } from 'mobx';
import * as React from 'react';
import { requestAnimationFrameInterval } from "../shared-utils/animationFrame/index.js";
import { VreoKeyframeEnum } from "../typings/VreoUnit.js";
import setElementDataset from "../shared-utils/setElementDataset.js";
import { getMediaType } from "../shared-utils/getMediaInfo.js";
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
export var Controller = /*#__PURE__*/function (_Subscribe) {
  _inherits(Controller, _Subscribe);
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
    _classCallCheck(this, Controller);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "playing", false);
    _defineProperty(_assertThisInitialized(_this), "ended", false);
    _defineProperty(_assertThisInitialized(_this), "loading", false);
    _defineProperty(_assertThisInitialized(_this), "containerSize", {
      width: 0,
      height: 0
    });
    _defineProperty(_assertThisInitialized(_this), "waveAppearance", null);
    _defineProperty(_assertThisInitialized(_this), "appearance", {
      waveStyle: 'wave'
    });
    _defineProperty(_assertThisInitialized(_this), "avatar", {});
    _defineProperty(_assertThisInitialized(_this), "visible", false);
    _defineProperty(_assertThisInitialized(_this), "popUp", null);
    _defineProperty(_assertThisInitialized(_this), "drawerConfig", null);
    _this.configs = configs;
    _this.container = container;
    _this.five = five;
    _this.appSize = configs.appSize;
    _this.appearance = _objectSpread(_objectSpread({}, _this.appearance), configs.appearance);
    makeObservable(_assertThisInitialized(_this), {
      visible: observable,
      setVisible: action,
      playing: observable,
      setPlaying: action,
      loading: observable,
      // videoAgentScene: observable.ref,
      setLoading: action,
      popUp: observable.ref,
      openPopUp: action,
      drawerConfig: observable.ref,
      openDrawer: action,
      ended: observable,
      waveAppearance: observable,
      avatar: observable,
      containerSize: observable,
      setContainerSize: action,
      appearance: observable,
      setAppearance: action,
      configs: observable.ref,
      setEnded: action,
      setAvatar: action
    });
    reaction(function () {
      return [_this.appearance.waveStyle, _this.loading];
    }, function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
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
      reaction(function () {
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
        setElementDataset(_this.container, {
          size: size
        });
        setElementDataset(_this.container, {
          orientation: orientation
        });
      }, {
        fireImmediately: true
      });
    } else {
      setElementDataset(_this.container, {
        size: _this.appSize
      });
    }

    // 监听播放情况：抛出触发时机
    reaction(function () {
      return _this.ended;
    }, function (ended) {
      if (ended) {
        _this.emit('paused', true);
      }
    });
    reaction(function () {
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
  _createClass(Controller, [{
    key: "agentType",
    get:
    // null 表示加载失败

    /**
     * 获取当前播放媒体的类型
     * @returns 'video' | 'avatar' | 'none' - 媒体类型
     */
    function get() {
      var _this$videoAgentScene, _this$avatar;
      var type = getMediaType((_this$videoAgentScene = this.videoAgentScene) === null || _this$videoAgentScene === void 0 ? void 0 : _this$videoAgentScene.videoAgentMesh.videoUrl);
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
        if (keyframe.type === VreoKeyframeEnum.BgMusic) return true;
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
      this.stopInterval = requestAnimationFrameInterval(function () {
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
}(Subscribe);
var ControllerContext = /*#__PURE__*/React.createContext(null);
export { ControllerContext };
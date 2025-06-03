"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var React = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _five = require("@realsee/five");
var _App = require("./App");
var _Controller = require("./Controller");
var _VreoUnit = require("../typings/VreoUnit");
var _mobx = require("mobx");
var _Drawer = require("./modules/Drawer");
var _PopUp = require("./modules/PopUp");
var _Audio = require("../shared-utils/Audio");
var _location$search$matc, _location$search$matc2;
/**
 * @fileoverview Vreo 播放器主类
 * 
 * 这是 Vreo (VR Video) 播放器的核心类，基于如视三维渲染引擎 Five 和 React 构建。
 * 提供了 3D 空间剧本播放的完整功能，包括播放控制、事件管理、配置等。
 */
// 下面这一行不能删
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/** 默认音频缓存长度 */
var DefaultAudioCacheLength = 3;

/** 播放器容器元素的唯一 ID */
var id = "vreo-app-dhjskadhksahdjskahdjksa";

/** 从 URL 参数获取的音频缓存长度，默认使用 DefaultAudioCacheLength */
var audioCacheLength = Number((_location$search$matc = (_location$search$matc2 = location.search.match(/audio_cache=(\d+)/)) === null || _location$search$matc2 === void 0 ? void 0 : _location$search$matc2[1]) !== null && _location$search$matc !== void 0 ? _location$search$matc : DefaultAudioCacheLength);

/**
 * Vreo 播放器主类
 * 
 * 基于如视三维渲染引擎 Five 和 React 实现的 3D 空间剧本播放器。
 * 支持播放包含相机运动、特效、标签等多种关键帧的 VR 视频内容。
 * 
 * @class Player
 * @extends {Subscribe<VreoKeyframeEvent>}
 * 
 * @example
 * ```typescript
 * import { Player } from '@realsee/vreo';
 * import { Five } from '@realsee/five';
 * 
 * // 创建 Five 实例
 * const five = new Five({ /* Five 配置 * / });
 * 
 * // 创建播放器实例
 * const player = new Player(five, {
 *   container: document.getElementById('player-container'),
 *   keyframeMap: { /* 关键帧配置 * / },
 *   autoPreload: true
 * });
 * 
 * // 监听播放事件
 * player.on('playing', () => console.log('开始播放'));
 * player.on('paused', () => console.log('暂停播放'));
 * 
 * // 加载并播放 VR 视频
 * player.load(vreoUnit).then(() => {
 *   console.log('加载完成');
 * });
 * ```
 */
var Player = exports.Player = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(Player, _Subscribe);
  var _super = _createSuper(Player);
  /** 
   * Five 渲染引擎实例
   * @public
   */

  /** 
   * 播放器控制器实例
   * @private
   */

  /** 
   * 播放器配置（只读）
   * @public
   */

  /**
   * 创建 Vreo 播放器实例
   * 
   * @param five - Five 渲染引擎实例
   * @param configs - 播放器配置选项
   * 
   * @example
   * ```typescript
   * const player = new Player(five, {
   *   container: document.getElementById('player'),
   *   keyframeMap: {
   *     // 自定义关键帧配置
   *   },
   *   autoPreload: true,
   *   imageOptions: { size: 1024 }
   * });
   * ```
   */
  function Player(five) {
    var _this;
    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2["default"])(this, Player);
    _this = _super.call(this);
    _this.$five = five;

    // 生成空白音频缓存
    (0, _Audio.generateBlankAudio)(audioCacheLength);

    // 处理容器配置（向后兼容）
    if (!configs.container) {
      configs.container = configs.containter;
    }

    // 如果没有指定容器，创建默认容器
    if (!configs.container) {
      var _five$getElement;
      var oldElement = document.getElementById(id);
      if (oldElement) {
        ReactDOM.unmountComponentAtNode(oldElement);
        oldElement.remove();
      }
      var container = document.createElement('div');
      container.id = id;
      configs.container = container;
      var fiveCanvasDomParent = (_five$getElement = five.getElement()) === null || _five$getElement === void 0 ? void 0 : _five$getElement.parentNode;
      if (fiveCanvasDomParent) {
        fiveCanvasDomParent.append(container);
      } else {
        document.body.append(container);
      }
    }

    // 添加播放器样式类
    if (!configs.container.classList.contains('vreo-app')) {
      configs.container.classList.add('vreo-app');
    }

    // 冻结配置对象，防止意外修改
    _this.configs = Object.freeze(Object.assign({
      keyframeMap: {}
    }, configs));

    // 创建控制器实例
    _this.controller = new _Controller.Controller({
      five: five,
      container: configs.container,
      configs: _this.configs
    });

    // 渲染 React 组件树
    ReactDOM.render(/*#__PURE__*/React.createElement(_Controller.ControllerContext.Provider, {
      value: _this.controller
    }, /*#__PURE__*/React.createElement(_App.App, null), /*#__PURE__*/React.createElement(_Drawer.Drawer, null), /*#__PURE__*/React.createElement(_PopUp.PopUp, null), _this.configs.customKeyframes && _this.configs.customKeyframes.map(function (CustomCmpt, key) {
      return /*#__PURE__*/React.createElement(CustomCmpt, {
        key: key,
        subscribe: {
          on: function on(name, callback) {
            return _this.on(name, callback);
          },
          once: function once(name, callback) {
            return _this.once(name, callback);
          },
          off: function off(name, callback) {
            return _this.off(name, callback);
          }
        },
        five: five
      });
    })), configs.container);

    // 监听播放状态变化，触发对应事件
    (0, _mobx.reaction)(function () {
      return _this.controller.ended;
    }, function (ended) {
      if (ended) {
        _this.emit('paused', true);
      }
    });
    (0, _mobx.reaction)(function () {
      return _this.controller.playing;
    }, function (playing) {
      if (!_this.controller.ended) {
        _this.emit(playing ? 'playing' : 'paused');
      }
    });
    return _this;
  }

  /**
   * 加载并播放 VR 视频内容
   * 
   * 这是播放器的核心方法，负责加载 VreoUnit 数据并开始播放。
   * 包括预处理、预加载、事件设置等完整的加载流程。
   * 
   * @param vreoUnit - VR 视频单元数据，包含关键帧、视频信息等
   * @param currentTime - 开始播放的时间点（毫秒），默认为 0
   * @param preload - 是否预加载点位数据，默认为 false
   * @param force - 是否强制重新创建数据副本，默认为 false
   * @returns Promise<boolean> - 加载完成后返回 true
   * 
   * @fires VreoKeyframeEvent#loaded - 数据加载完成时触发
   * 
   * @example
   * ```typescript
   * // 基本加载
   * await player.load(vreoUnit);
   * 
   * // 从指定时间开始播放
   * await player.load(vreoUnit, 5000); // 从第5秒开始
   * 
   * // 启用预加载
   * await player.load(vreoUnit, 0, true);
   * ```
   */
  (0, _createClass2["default"])(Player, [{
    key: "load",
    value: (function () {
      var _load = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(vreoUnit) {
        var _this$controller$medi,
          _this$configs$imageOp,
          _this$controller$vide,
          _this$controller$vide2,
          _this2 = this;
        var currentTime,
          preload,
          force,
          panoIndexMap,
          panoIndexes,
          i,
          _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentTime = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
                preload = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                force = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
                // === 第一阶段：清理和准备工作 ===

                // 清理之前的播放状态和数据
                this.controller.clear();
                this.controller.setLoading(true);

                // 如果需要强制创建副本，进行深拷贝（避免修改原始数据）
                if (force) {
                  vreoUnit = JSON.parse(JSON.stringify(vreoUnit));
                }

                // 停止当前正在运行的播放循环
                if (this.controller.stopInterval) {
                  this.controller.stopInterval();
                  this.controller.stopInterval = undefined;
                }

                // 设置新的剧本数据
                this.controller.vreoUnit = vreoUnit;

                // 暂停当前的媒体播放
                (_this$controller$medi = this.controller.mediaInstance) === null || _this$controller$medi === void 0 ? void 0 : _this$controller$medi.pause();

                // === 第二阶段：图片分辨率优化 ===

                /**
                 * 图片分辨率优化逻辑
                 * 
                 * 如果播放器配置指定了较低的图片分辨率，
                 * 且 Five 引擎当前使用的分辨率更高，
                 * 则降低 Five 引擎的图片分辨率以提升性能。
                 */
                if (this.$five.imageOptions.size && (_this$configs$imageOp = this.configs.imageOptions) !== null && _this$configs$imageOp !== void 0 && _this$configs$imageOp.size && this.$five.imageOptions.size > this.configs.imageOptions.size) {
                  this.$five.imageOptions.size = this.configs.imageOptions.size;
                }

                // === 第三阶段：智能点位预加载 ===

                /**
                 * 点位预加载逻辑
                 * 
                 * 遍历所有相机运动关键帧，找出涉及的点位索引，
                 * 并提前加载这些点位的数据，确保播放过程中的流畅切换。
                 * 
                 * 预加载条件：
                 * 1. 显式启用预加载 或
                 * 2. 播放器配置启用了自动预加载
                 */
                if (!(preload || preload === undefined && this.configs.autoPreload)) {
                  _context.next = 20;
                  break;
                }
                // 从相机运动关键帧中提取所有点位索引
                panoIndexMap = vreoUnit.keyframes.filter(function (vreoKeyframe) {
                  // 只处理相机运动类型的关键帧
                  if (vreoKeyframe.type !== _VreoUnit.VreoKeyframeEnum.CameraMovement) {
                    return false;
                  }
                  var data = vreoKeyframe.data;
                  // 只处理包含点位索引的关键帧
                  if (data.panoIndex === undefined) {
                    return false;
                  }
                  return true;
                }).reduce(function (accu, curr) {
                  // 使用 Map 结构去重，避免重复预加载同一个点位
                  var panoIndex = curr.data.panoIndex;
                  if (!accu[panoIndex]) {
                    accu[panoIndex] = true;
                  }
                  return accu;
                }, {}); // 串行预加载所有点位（避免并发请求过多导致性能问题）
                panoIndexes = Object.keys(panoIndexMap);
                i = 0;
              case 14:
                if (!(i < panoIndexes.length)) {
                  _context.next = 20;
                  break;
                }
                _context.next = 17;
                return this.$five.preloadPano(Number(panoIndexes[i]));
              case 17:
                i++;
                _context.next = 14;
                break;
              case 20:
                // === 第四阶段：数据就绪通知 ===

                // 触发数据加载完成事件
                this.emit('loaded', vreoUnit);
                this.controller.emit('loaded', vreoUnit);

                // === 第五阶段：媒体初始化 ===

                // 设置媒体实例的起始时间
                if ((_this$controller$vide = this.controller.videoAgentScene) !== null && _this$controller$vide !== void 0 && _this$controller$vide.videoAgentMesh.mediaInstance) {
                  this.controller.videoAgentScene.videoAgentMesh.mediaInstance.currentTime = currentTime / 1000;
                }

                // 设置视频头像信息
                this.controller.setAvatar(vreoUnit.video.avatar);

                // 等待空白音频生成完成（用于音频上下文初始化）
                _context.next = 26;
                return (0, _Audio.waitForBlankAudioGenerated)();
              case 26:
                _context.next = 28;
                return (_this$controller$vide2 = this.controller.videoAgentScene) === null || _this$controller$vide2 === void 0 ? void 0 : _this$controller$vide2.videoAgentMesh.play(vreoUnit.video.url, currentTime / 1000, vreoUnit.video.duration);
              case 28:
                // 重置播放状态
                this.controller.setEnded(false);
                this.play();

                // 启动关键帧处理循环
                this.controller.run(function (type, keyframe) {
                  return _this2.emit(type, keyframe, _this2.controller.currentTime);
                });

                // 完成加载，取消加载状态
                this.controller.setLoading(false);
                return _context.abrupt("return", true);
              case 33:
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
     * 获取播放器是否处于暂停状态
     * @returns {boolean} 是否已暂停
     */
    )
  }, {
    key: "paused",
    get: function get() {
      return !this.controller.playing;
    }

    /**
     * 开始或继续播放
     * 
     * 这个方法处理播放器的播放控制逻辑，包括：
     * - 播放状态检查和防重复播放
     * - 播放时间控制
     * - 背景音乐关键帧的重置逻辑
     * - 调试接口暴露
     * 
     * @param currentTime - 可选的播放起始时间（毫秒）
     * @returns {boolean} 操作是否成功
     * 
     * @fires VreoKeyframeEvent#playing - 开始播放时触发
     * 
     * @example
     * ```typescript
     * // 开始播放
     * player.play();
     * 
     * // 从指定时间开始播放
     * player.play(10000); // 从第10秒开始
     * ```
     */
  }, {
    key: "play",
    value: function play(currentTime) {
      var _this$controller$vreo;
      // 防重复播放：如果已经在播放中，直接返回成功
      if (this.controller.playing) return true;

      // 时间控制：如果指定了播放时间且有媒体实例，则设置播放位置
      if (currentTime && this.controller.mediaInstance) {
        this.controller.mediaInstance.currentTime = currentTime / 1000; // 转换为秒
      }

      // 调试接口：将控制器暴露到全局 window 对象，便于开发时调试
      Object.assign(window, {
        $vreoController: this.controller
      });

      // 重置播放状态
      this.controller.setEnded(false);
      this.controller.setPlaying(true);

      /**
       * 背景音乐关键帧重置逻辑
       * 
       * 背景音乐关键帧需要特殊处理：
       * - 背景音乐通常是长时间播放的
       * - 在播放开始时需要重新触发，即使之前已经解析过
       * - 这确保了背景音乐能在正确的时间点重新开始
       */
      (_this$controller$vreo = this.controller.vreoUnit) === null || _this$controller$vreo === void 0 ? void 0 : _this$controller$vreo.keyframes.forEach(function (keyframe) {
        if (keyframe.type === _VreoUnit.VreoKeyframeEnum.BgMusic) {
          keyframe.parsed = false; // 重置解析状态，使其能够重新触发
        }
      });
      return true;
    }

    /**
     * 设置播放器外观
     * 
     * @param appearance - 外观配置
     * 
     * @example
     * ```typescript
     * player.setAppearance({
     *   waveStyle: 'wave'
     * });
     * ```
     */
  }, {
    key: "setAppearance",
    value: function setAppearance(appearance) {
      this.controller.setAppearance(appearance);
    }

    /**
     * 暂停播放
     * 
     * @fires VreoKeyframeEvent#paused - 暂停时触发
     */
  }, {
    key: "pause",
    value: function pause() {
      this.controller.setPlaying(false);
    }

    /**
     * 显示播放器界面
     */
  }, {
    key: "show",
    value: function show() {
      this.controller.setVisible(true);
    }

    /**
     * 隐藏播放器界面
     */
  }, {
    key: "hide",
    value: function hide() {
      this.controller.setVisible(false);
    }

    /**
     * 获取当前播放时间
     * 
     * @returns {number} 当前播放时间（毫秒）
     */
  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      return this.controller.currentTime;
    }

    /**
     * 销毁播放器实例并清理所有资源
     * 
     * 包括清理控制器、卸载 React 组件等。
     * 调用此方法后，播放器实例将无法再使用。
     */
  }, {
    key: "dispose",
    value: function dispose() {
      this.controller.dispose();
      if (this.configs.container) {
        ReactDOM.unmountComponentAtNode(this.configs.container);
      }
    }
  }]);
  return Player;
}(_five.Subscribe);
console.log("\n    \u250F\u2501\u2501\u2501\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u250F\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2503\u250F\u2501\u2513\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2503\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2503\u2517\u2501\u251B\u2503\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u2501\u2503\u2503\u2501\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\n    \u2503\u250F\u2513\u250F\u251B\u2503\u250F\u2513\u2503\u2517\u2501\u2513\u2503\u2501\u2503\u2503\u2501\u2503\u2501\u2501\u252B\u2503\u250F\u2513\u2503\u2503\u250F\u2513\u2503\n    \u2503\u2503\u2503\u2517\u2513\u2503\u2503\u2501\u252B\u2503\u2517\u251B\u2517\u2513\u2503\u2517\u2513\u2523\u2501\u2501\u2503\u2503\u2503\u2501\u252B\u2503\u2503\u2501\u252B\n    \u2517\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u2501\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\n    \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n");
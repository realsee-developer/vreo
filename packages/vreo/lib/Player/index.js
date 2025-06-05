import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
var _location$search$matc, _location$search$matc2;
import _regeneratorRuntime from "@babel/runtime/regenerator";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
// 下面这一行不能删
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subscribe } from '@realsee/five';
import { App } from "./App.js";
import { Controller, ControllerContext } from "./Controller.js";
import { VreoKeyframeEnum } from "../typings/VreoUnit.js";
import { reaction } from 'mobx';
import { Drawer } from "./modules/Drawer/index.js";
import { PopUp } from "./modules/PopUp/index.js";
import { generateBlankAudio, waitForBlankAudioGenerated } from "../shared-utils/Audio.js";
var DefaultAudioCacheLength = 3;
var id = "vreo-app-dhjskadhksahdjskahdjksa";
var audioCacheLength = Number((_location$search$matc = (_location$search$matc2 = location.search.match(/audio_cache=(\d+)/)) === null || _location$search$matc2 === void 0 ? void 0 : _location$search$matc2[1]) !== null && _location$search$matc !== void 0 ? _location$search$matc : DefaultAudioCacheLength);

/**
 * Vreo 播放器核心类
 * 
 * 提供 VR 视频播放、剧本执行、相机运镜等功能的主要接口。
 * 基于 Five 渲染引擎和 React 构建的 3D 空间剧本播放器。
 * 
 * @example
 * ```typescript
 * import { Five } from '@realsee/five'
 * import { Player } from '@realsee/vreo'
 * 
 * const five = new Five({
 *   // Five 配置选项
 * })
 * const player = new Player(five, {
 *   autoPreload: true,
 *   imageOptions: { size: 1024 }
 * })
 * 
 * await player.load(vreoUnit)
 * player.play()
 * ```
 */
export var Player = /*#__PURE__*/function (_Subscribe) {
  _inherits(Player, _Subscribe);
  var _super = _createSuper(Player);
  /** Five 渲染引擎实例 */

  /** 内部控制器 */

  /** 播放器配置（只读） */

  /**
   * 创建 Vreo 播放器实例
   * 
   * @param five - Five 渲染引擎实例
   * @param configs - 播放器配置选项
   */
  function Player(five) {
    var _this;
    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Player);
    _this = _super.call(this);
    _this.$five = five;
    generateBlankAudio(audioCacheLength);
    if (!configs.container) {
      configs.container = configs.containter;
    }
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
    if (!configs.container.classList.contains('vreo-app')) configs.container.classList.add('vreo-app');
    _this.configs = Object.freeze(Object.assign({
      keyframeMap: {}
    }, configs));
    _this.controller = new Controller({
      five: five,
      container: configs.container,
      configs: _this.configs
    });
    ReactDOM.render( /*#__PURE__*/React.createElement(ControllerContext.Provider, {
      value: _this.controller
    }, /*#__PURE__*/React.createElement(App, null), /*#__PURE__*/React.createElement(Drawer, null), /*#__PURE__*/React.createElement(PopUp, null), _this.configs.customKeyframes && _this.configs.customKeyframes.map(function (CustomCmpt, key) {
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

    // 监听播放情况：抛出触发时机
    reaction(function () {
      return _this.controller.ended;
    }, function (ended) {
      if (ended) {
        _this.emit('paused', true);
      }
    });
    reaction(function () {
      return _this.controller.playing;
    }, function (playing) {
      if (!_this.controller.ended) {
        _this.emit(playing ? 'playing' : 'paused');
      }
    });
    return _this;
  }

  /**
   * 加载剧本数据
   * 
   * 加载 VreoUnit 剧本数据，准备播放器状态，预载资源，并初始化播放环境。
   * 
   * @param vreoUnit - 剧本数据对象，包含视频信息和关键帧序列
   * @param currentTime - 起始播放时间（毫秒），默认为 0
   * @param preload - 是否预载相关资源，默认为 false
   * @param force - 是否强制重新载入（深拷贝数据），默认为 false
   * @returns Promise<boolean> 返回加载是否成功
   * 
   * @example
   * ```typescript
   * // 基本加载
   * await player.load(vreoUnit)
   * 
   * // 从指定时间开始加载，并预载资源
   * await player.load(vreoUnit, 5000, true)
   * 
   * // 强制重新加载
   * await player.load(vreoUnit, 0, false, true)
   * ```
   */
  _createClass(Player, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(vreoUnit) {
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
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentTime = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
                preload = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                force = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
                this.controller.clear();
                this.controller.setLoading(true);
                if (force) {
                  vreoUnit = JSON.parse(JSON.stringify(vreoUnit));
                }
                // if (!this.controller.visible) {
                //     this.controller.setVisible(true)
                //     // 延迟 500ms 规避跟 DOM 动画冲突
                //     await new Promise((resolve) => {
                //         setTimeout(() => resolve(true), 500)
                //     })
                // }

                if (this.controller.stopInterval) {
                  this.controller.stopInterval();
                  this.controller.stopInterval = undefined;
                }
                this.controller.vreoUnit = vreoUnit;
                (_this$controller$medi = this.controller.mediaInstance) === null || _this$controller$medi === void 0 ? void 0 : _this$controller$medi.pause();

                // 预载逻辑
                // 是否降低图片分辨率
                if (this.$five.imageOptions.size && (_this$configs$imageOp = this.configs.imageOptions) !== null && _this$configs$imageOp !== void 0 && _this$configs$imageOp.size && this.$five.imageOptions.size > this.configs.imageOptions.size) {
                  this.$five.imageOptions.size = this.configs.imageOptions.size;
                }

                // 预载数据中的点位
                if (!(preload || preload === undefined && this.configs.autoPreload)) {
                  _context.next = 20;
                  break;
                }
                panoIndexMap = vreoUnit.keyframes.filter(function (vreoKeyframe) {
                  if (vreoKeyframe.type !== VreoKeyframeEnum.CameraMovement) {
                    return false;
                  }
                  var data = vreoKeyframe.data;
                  if (data.panoIndex === undefined) {
                    return false;
                  }
                  return true;
                }).reduce(function (accu, curr) {
                  var panoIndex = curr.data.panoIndex;
                  if (!accu[panoIndex]) {
                    accu[panoIndex] = true;
                  }
                  return accu;
                }, {});
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
                // 新数据载入就绪
                this.emit('loaded', vreoUnit);
                this.controller.emit('loaded', vreoUnit);
                if ((_this$controller$vide = this.controller.videoAgentScene) !== null && _this$controller$vide !== void 0 && _this$controller$vide.videoAgentMesh.mediaInstance) {
                  this.controller.videoAgentScene.videoAgentMesh.mediaInstance.currentTime = currentTime / 1000;
                }
                this.controller.setAvatar(vreoUnit.video.avatar);
                _context.next = 26;
                return waitForBlankAudioGenerated();
              case 26:
                _context.next = 28;
                return (_this$controller$vide2 = this.controller.videoAgentScene) === null || _this$controller$vide2 === void 0 ? void 0 : _this$controller$vide2.videoAgentMesh.play(vreoUnit.video.url, currentTime / 1000, vreoUnit.video.duration);
              case 28:
                this.controller.setEnded(false);
                this.play();
                this.controller.run(function (type, keyframe) {
                  return _this2.emit(type, keyframe, _this2.controller.currentTime);
                });
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
     * @returns 是否暂停中
     */
  }, {
    key: "paused",
    get: function get() {
      return !this.controller.playing;
    }

    /**
     * 开始播放
     * 
     * @param currentTime - 可选的播放起始时间（毫秒）
     * @returns 是否开始播放成功
     * 
     * @example
     * ```typescript
     * // 从当前位置播放
     * player.play()
     * 
     * // 从指定时间开始播放
     * player.play(10000) // 从10秒处开始
     * ```
     */
  }, {
    key: "play",
    value: function play(currentTime) {
      var _this$controller$vreo;
      if (this.controller.playing) return true;
      if (currentTime && this.controller.mediaInstance) {
        this.controller.mediaInstance.currentTime = currentTime / 1000;
      }
      Object.assign(window, {
        $vreoController: this.controller
      });
      this.controller.setEnded(false);
      this.controller.setPlaying(true);
      (_this$controller$vreo = this.controller.vreoUnit) === null || _this$controller$vreo === void 0 ? void 0 : _this$controller$vreo.keyframes.forEach(function (keyframe) {
        if (keyframe.type === VreoKeyframeEnum.BgMusic) {
          keyframe.parsed = false;
        }
      });
      return true;
    }

    /**
     * 设置播放器外观
     * @param appearance - 外观配置对象
     * 
     * @example
     * ```typescript
     * player.setAppearance({
     *   waveStyle: 'solid'
     * })
     * ```
     */
  }, {
    key: "setAppearance",
    value: function setAppearance(appearance) {
      this.controller.setAppearance(appearance);
    }

    /**
     * 暂停播放
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
     * @returns 当前播放时间（毫秒）
     */
  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      return this.controller.currentTime;
    }

    /**
     * 销毁播放器实例
     * 
     * 清理所有资源、事件监听器和DOM元素
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
}(Subscribe);
console.log("\n    \u250F\u2501\u2501\u2501\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u250F\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2503\u250F\u2501\u2513\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2503\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2503\u2517\u2501\u251B\u2503\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u2501\u2503\u2503\u2501\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\n    \u2503\u250F\u2513\u250F\u251B\u2503\u250F\u2513\u2503\u2517\u2501\u2513\u2503\u2501\u2503\u2503\u2501\u2503\u2501\u2501\u252B\u2503\u250F\u2513\u2503\u2503\u250F\u2513\u2503\n    \u2503\u2503\u2503\u2517\u2513\u2503\u2503\u2501\u252B\u2503\u2517\u251B\u2517\u2513\u2503\u2517\u2513\u2523\u2501\u2501\u2503\u2503\u2503\u2501\u252B\u2503\u2503\u2501\u252B\n    \u2517\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u2501\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\n    \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n");
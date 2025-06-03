import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _regeneratorRuntime from "@babel/runtime/regenerator";
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = _getPrototypeOf(t); if (r) { var s = _getPrototypeOf(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return _possibleConstructorReturn(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
import * as THREE from 'three';
import { Preloader } from "../../../shared-utils/Preloader.js";
import { makeObservable, observable, runInAction } from 'mobx';
import AudioLike from "../../../shared-utils/AudioLike.js";
import { getMediaType } from "../../../shared-utils/getMediaInfo.js";
var vertexShader = "\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\nvoid main(){\n  vUv = uv;\n  vColorUv = vec2(uv.x / 2.0, uv.y);\n  vMaskUv = vec2(0.5 + uv.x / 2.0, uv.y);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
var fragmentShaderTpl = function fragmentShaderTpl() {
  return "\nuniform int enable;\nuniform sampler2D map;\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\n\nvec3 hsv2rgb(vec3 c) {\n  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvec3 rgb2hsv(vec3 c) {\n  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);\n}\n\nvoid main(void) {\n  vec3 color = texture2D(map, vUv).xyz;\n  float amask = 1.0;\n\n  float ref = color.r;\n  if (ref < color.b) ref = color.b;\n  amask = color.g - ref + 0.1;\n  amask = smoothstep(0.1, 0.3, amask);\n  amask = 1.0 - amask;\n\n  vec3 target = rgb2hsv(vec3(0.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0));\n  vec3 hsv = rgb2hsv(color);\n  float distance = abs(hsv.x - target.x);\n  if (distance < 0.15) {\n    hsv.y = 0.0;\n  }\n  color = hsv2rgb(hsv);\n\n  gl_FragColor = vec4(color.rgb, amask * float(enable));\n}\n";
};
var cacheInstance = {};

/**
 * 视频经纪人贴片的配置选项
 */

/**
 * 视频经纪人贴片类
 * 
 * 基于 THREE.js 的网格对象，作为 VR 视频播放的核心媒体管理组件。
 * 负责视频和音频的播放控制、时间同步、绿幕抠图渲染等功能。
 * 
 * 主要特性：
 * - 支持绿幕抠图渲染（ChromaKey）
 * - 音视频同步播放管理
 * - 媒体预载优化策略
 * - 跨平台播放兼容性
 * 
 * @example
 * ```typescript
 * const videoMesh = new VideoAgentMesh(1920, 1080, 32, 18, {
 *   preload: true,
 *   videoInstance: customVideoElement
 * })
 * 
 * // 播放视频
 * await videoMesh.play('https://example.com/video.mp4', 0, 60)
 * 
 * // 获取当前时间
 * console.log(videoMesh.currentTime)
 * 
 * // 销毁资源
 * videoMesh.dispose()
 * ```
 */
export var VideoAgentMesh = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(VideoAgentMesh, _THREE$Mesh);
  var _super = _createSuper(VideoAgentMesh);
  /**
   * 创建视频经纪人贴片实例
   * 
   * @param width - 网格宽度
   * @param height - 网格高度  
   * @param widthSegments - 宽度方向分段数
   * @param heightSegments - 高度方向分段数
   * @param options - 配置选项
   * 
   * @example
   * ```typescript
   * const mesh = new VideoAgentMesh(1920, 1080, 32, 18, {
   *   preload: true,
   *   videoInstance: document.getElementById('video')
   * })
   * ```
   */
  function VideoAgentMesh(width, height, widthSegments, heightSegments) {
    var _this$options$videoIn, _this$options$videoIn2;
    var _this;
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      preload: true
    };
    _classCallCheck(this, VideoAgentMesh);
    if (!options.videoInstance) {
      if (cacheInstance.videoInstance) {
        options.videoInstance = cacheInstance.videoInstance;
      } else {
        var videoInstance = document.createElement('video');
        videoInstance.style.opacity = '0';
        videoInstance.style.pointerEvents = 'none';
        videoInstance.style.display = 'none';
        document.body.append(videoInstance);
        options.videoInstance = videoInstance;
        cacheInstance.videoInstance = videoInstance;
        videoInstance.playsInline = true;
        videoInstance.controls = false;
      }
    }
    var geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    var videoTexture = new THREE.VideoTexture(options.videoInstance);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          value: videoTexture
        },
        enable: {
          value: 0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderTpl(),
      transparent: true
    });
    _this = _super.call(this, geometry, material);
    _this.options = options;
    _this.freeze = false;
    _this.paused = true;
    if (!options.audioInstance) {
      if (cacheInstance.audioInstance) {
        _this.audioInstance = cacheInstance.audioInstance;
      } else {
        var audioInstance = document.createElement('audio');
        audioInstance.crossOrigin = '';
        // videoInstance.muted = true
        audioInstance.muted = false;
        audioInstance.autoplay = false;
        audioInstance.style.display = 'none';
        document.body.appendChild(audioInstance);
        _this.audioInstance = audioInstance;
        cacheInstance.audioInstance = audioInstance;
      }
    } else {
      _this.audioInstance = options.audioInstance;
    }
    _this.audioLikeInstance = new AudioLike();
    makeObservable(_assertThisInitialized(_this), {
      paused: observable
    });
    var updatePaused = function updatePaused(paused) {
      return runInAction(function () {
        return _this.paused = paused;
      });
    };
    var onPause = function onPause() {
      return updatePaused(true);
    };
    var onPlay = function onPlay() {
      return updatePaused(false);
    };
    _this.audioInstance.addEventListener('pause', onPause);
    _this.audioInstance.addEventListener('play', onPlay);
    (_this$options$videoIn = _this.options.videoInstance) === null || _this$options$videoIn === void 0 ? void 0 : _this$options$videoIn.addEventListener('pause', onPause);
    (_this$options$videoIn2 = _this.options.videoInstance) === null || _this$options$videoIn2 === void 0 ? void 0 : _this$options$videoIn2.addEventListener('play', onPlay);
    _this.audioLikeInstance.addEventListener('pause', onPause);
    _this.audioLikeInstance.addEventListener('play', onPlay);
    _this.$removeEventListener = function () {
      var _this$options$videoIn3, _this$options$videoIn4;
      _this.audioInstance.removeEventListener('pause', onPause);
      _this.audioInstance.removeEventListener('play', onPlay);
      (_this$options$videoIn3 = _this.options.videoInstance) === null || _this$options$videoIn3 === void 0 ? void 0 : _this$options$videoIn3.removeEventListener('pause', onPause);
      (_this$options$videoIn4 = _this.options.videoInstance) === null || _this$options$videoIn4 === void 0 ? void 0 : _this$options$videoIn4.removeEventListener('play', onPlay);
      _this.audioLikeInstance.removeEventListener('pause', onPause);
      _this.audioLikeInstance.removeEventListener('play', onPlay);
    };
    return _this;
  }

  /**
   * 更新媒体资源
   * 
   * 内部方法，负责加载新的视频/音频资源，处理预载逻辑和着色器设置
   * @param videoUrl - 媒体文件URL
   * @private
   */
  _createClass(VideoAgentMesh, [{
    key: "mediaInstance",
    get: /** 配置选项 */

    /** 当前视频URL */

    /** 是否冻结状态 */

    /** 是否暂停状态 */

    /** 音频实例 */

    /** AudioLike 实例 */

    /** 移除事件监听器的函数 */

    /**
     * 获取当前的媒体实例
     * 
     * 根据媒体类型自动返回对应的播放实例：
     * - 无媒体时返回 AudioLike 实例
     * - 音频文件返回 HTMLAudioElement
     * - 视频文件返回 HTMLVideoElement
     * 
     * @returns 当前活跃的媒体播放实例
     */
    function get() {
      if (!this.videoUrl) {
        return this.audioLikeInstance;
      }
      if (getMediaType(this.videoUrl) === 'audio') {
        return this.audioInstance;
      }
      var uniforms = this.material.uniforms;
      var videoInstance = uniforms.map.value.image;
      return videoInstance;
    }
  }, {
    key: "update",
    value: (function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(videoUrl) {
        var _this2 = this;
        var uniforms, onStart;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.videoUrl === videoUrl)) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return");
              case 2:
                this.videoUrl = videoUrl;

                // // 兼容非视频场景
                // if (this.mediaInstance instanceof HTMLAudioElement) {
                //   this.mediaInstance.style.display = 'none'
                // } else if (this.mediaInstance instanceof HTMLVideoElement) {
                //   this.mediaInstance.style.display = 'block'
                // }

                this.freeze = true;
                _context.next = 6;
                return this.mediaInstance.pause();
              case 6:
                uniforms = this.material.uniforms;
                this.mediaInstance.muted = true;
                if (!(this.options.preload || this.options.preload === undefined || getMediaType(this.videoUrl) === 'video')) {
                  _context.next = 18;
                  break;
                }
                _context.t1 = URL;
                _context.next = 12;
                return Preloader.blob(this.videoUrl);
              case 12:
                _context.t2 = _context.sent;
                _context.next = 15;
                return _context.t1.createObjectURL.call(_context.t1, _context.t2);
              case 15:
                _context.t0 = _context.sent;
                _context.next = 19;
                break;
              case 18:
                _context.t0 = this.videoUrl;
              case 19:
                this.mediaInstance.src = _context.t0;
                this.mediaInstance.setAttribute('data-src', this.videoUrl);
                onStart = function onStart() {
                  if (_this2.mediaInstance.currentTime === 0) return;
                  _this2.freeze = false;
                  _this2.mediaInstance.muted = false;
                  uniforms.enable.value = getMediaType(_this2.videoUrl) ? 1 : 0;
                  _this2.mediaInstance.removeEventListener('timeupdate', onStart, false);
                };
                this.mediaInstance.addEventListener('timeupdate', onStart, false);
              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function update(_x) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
    /**
     * 播放媒体内容
     * 
     * 支持多种播放模式：
     * - 播放指定视频/音频文件
     * - 仅设置时长（无媒体文件）
     * - 继续播放当前媒体
     * 
     * @param videoUrl - 媒体文件URL，默认为空字符串
     * @param currentTime - 播放起始时间（秒），默认为 0
     * @param duration - 媒体总时长（秒），可选
     * @returns Promise<boolean> 播放是否成功
     * 
     * @example
     * ```typescript
     * // 播放视频文件
     * await mesh.play('video.mp4', 10, 120)
     * 
     * // 仅设置时长（音频跟踪）
     * await mesh.play('', 0, 60)
     * 
     * // 继续播放当前媒体
     * await mesh.play()
     * ```
     */
    )
  }, {
    key: "play",
    value: (function () {
      var _play = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        var _this3 = this;
        var videoUrl,
          currentTime,
          duration,
          _args3 = arguments;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                videoUrl = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';
                currentTime = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
                duration = _args3.length > 2 ? _args3[2] : undefined;
                videoUrl = videoUrl || '';
                if (!(duration && !videoUrl)) {
                  _context3.next = 10;
                  break;
                }
                if (this.currentTime) {
                  this.mediaInstance.currentTime = currentTime;
                }
                this.mediaInstance.duration = duration;
                this.videoUrl = '';
                this.mediaInstance.play();
                return _context3.abrupt("return", true);
              case 10:
                if (videoUrl) {
                  _context3.next = 18;
                  break;
                }
                if (!this.videoUrl) {
                  _context3.next = 16;
                  break;
                }
                _context3.next = 14;
                return this.mediaInstance.play();
              case 14:
                _context3.next = 17;
                break;
              case 16:
                console.warn('警告：视频资源未初始化。');
              case 17:
                return _context3.abrupt("return", true);
              case 18:
                if (!(videoUrl === this.videoUrl)) {
                  _context3.next = 23;
                  break;
                }
                this.mediaInstance.currentTime = currentTime;
                _context3.next = 22;
                return this.mediaInstance.play();
              case 22:
                return _context3.abrupt("return", true);
              case 23:
                _context3.next = 25;
                return this.update(videoUrl);
              case 25:
                this.mediaInstance.pause();
                _context3.next = 28;
                return new Promise(function (resolve) {
                  return setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _this3.mediaInstance.currentTime = currentTime;
                            _context2.next = 3;
                            return _this3.mediaInstance.play();
                          case 3:
                            resolve(true);
                          case 4:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  })), 20);
                });
              case 28:
                return _context3.abrupt("return", _context3.sent);
              case 29:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      function play() {
        return _play.apply(this, arguments);
      }
      return play;
    }()
    /**
     * 获取当前播放时间（毫秒）
     * 
     * 将媒体实例的秒级时间转换为毫秒，提供更高精度的时间控制
     * @returns 当前播放时间戳（毫秒）
     */
    )
  }, {
    key: "currentTime",
    get: function get() {
      return this.mediaInstance.currentTime * 1000;
    }

    /**
     * 销毁视频经纪人贴片实例
     * 
     * 清理所有事件监听器、DOM元素和缓存实例，释放内存资源
     * 
     * @example
     * ```typescript
     * // 在组件卸载时调用
     * videoMesh.dispose()
     * ```
     */
  }, {
    key: "dispose",
    value: function dispose() {
      // 销毁事件监听
      this.$removeEventListener();
      if (cacheInstance.audioInstance) {
        document.body.removeChild(cacheInstance.audioInstance);
        cacheInstance.audioInstance = undefined;
      }
      if (cacheInstance.videoInstance) {
        document.body.removeChild(cacheInstance.videoInstance);
        cacheInstance.videoInstance = undefined;
      }
    }
  }]);
  return VideoAgentMesh;
}(THREE.Mesh);
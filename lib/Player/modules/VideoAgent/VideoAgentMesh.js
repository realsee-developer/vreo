"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgentMesh = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var THREE = _interopRequireWildcard(require("three"));
var _Preloader = require("../../../shared-utils/Preloader");
var _mobx = require("mobx");
var _AudioLike = _interopRequireDefault(require("../../../shared-utils/AudioLike"));
var _getMediaInfo = require("../../../shared-utils/getMediaInfo");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var vertexShader = "\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\nvoid main(){\n  vUv = uv;\n  vColorUv = vec2(uv.x / 2.0, uv.y);\n  vMaskUv = vec2(0.5 + uv.x / 2.0, uv.y);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
var fragmentShaderTpl = function fragmentShaderTpl() {
  return "\nuniform int enable;\nuniform sampler2D map;\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\n\nvec3 hsv2rgb(vec3 c) {\n  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvec3 rgb2hsv(vec3 c) {\n  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);\n}\n\nvoid main(void) {\n  vec3 color = texture2D(map, vUv).xyz;\n  float amask = 1.0;\n\n  float ref = color.r;\n  if (ref < color.b) ref = color.b;\n  amask = color.g - ref + 0.1;\n  amask = smoothstep(0.1, 0.3, amask);\n  amask = 1.0 - amask;\n\n  vec3 target = rgb2hsv(vec3(0.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0));\n  vec3 hsv = rgb2hsv(color);\n  float distance = abs(hsv.x - target.x);\n  if (distance < 0.15) {\n    hsv.y = 0.0;\n  }\n  color = hsv2rgb(hsv);\n\n  gl_FragColor = vec4(color.rgb, amask * float(enable));\n}\n";
};
var cacheInstance = {};
/**
 * 视频经纪人MESH
 */
var VideoAgentMesh = exports.VideoAgentMesh = /*#__PURE__*/function (_THREE$Mesh) {
  (0, _inherits2["default"])(VideoAgentMesh, _THREE$Mesh);
  var _super = _createSuper(VideoAgentMesh);
  /**
   * 创建视频代理网格
   * 
   * @param width - 网格宽度
   * @param height - 网格高度  
   * @param widthSegments - 宽度分段数
   * @param heightSegments - 高度分段数
   * @param options - 配置选项
   */
  function VideoAgentMesh(width, height, widthSegments, heightSegments) {
    var _this$options$videoIn, _this$options$videoIn2;
    var _this;
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      preload: true
    };
    (0, _classCallCheck2["default"])(this, VideoAgentMesh);
    // 初始化或复用视频实例（单例模式，避免重复创建）
    if (!options.videoInstance) {
      if (cacheInstance.videoInstance) {
        // 复用已存在的视频实例
        options.videoInstance = cacheInstance.videoInstance;
      } else {
        // 创建新的视频实例并进行必要配置
        var videoInstance = document.createElement('video');
        videoInstance.style.opacity = '0'; // 隐藏视频元素（仅作为纹理源）
        videoInstance.style.pointerEvents = 'none'; // 禁用鼠标事件
        videoInstance.style.display = 'none'; // 不显示在页面中
        document.body.append(videoInstance);
        options.videoInstance = videoInstance;
        cacheInstance.videoInstance = videoInstance;
        videoInstance.playsInline = true; // 启用内联播放（移动端重要）
        videoInstance.controls = false; // 禁用默认控件
      }
    }

    // 创建平面几何体和视频纹理
    var geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    var videoTexture = new THREE.VideoTexture(options.videoInstance);

    // 创建自定义着色器材质，用于视频处理和透明度控制
    var material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          value: videoTexture
        },
        enable: {
          value: 0
        } // 控制是否启用视频显示
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderTpl(),
      // 自定义片段着色器，处理绿幕等效果
      transparent: true
    });
    _this = _super.call(this, geometry, material);
    _this.options = options;
    _this.freeze = false; // 是否冻结状态（用于控制播放流程）
    _this.paused = true; // 暂停状态

    // 初始化或复用音频实例（类似视频实例的处理）
    if (!options.audioInstance) {
      if (cacheInstance.audioInstance) {
        _this.audioInstance = cacheInstance.audioInstance;
      } else {
        var audioInstance = document.createElement('audio');
        audioInstance.crossOrigin = ''; // 设置跨域属性
        audioInstance.muted = false; // 默认不静音
        audioInstance.autoplay = false; // 禁用自动播放
        audioInstance.style.display = 'none';
        document.body.appendChild(audioInstance);
        _this.audioInstance = audioInstance;
        cacheInstance.audioInstance = audioInstance;
      }
    } else {
      _this.audioInstance = options.audioInstance;
    }

    // 创建音频模拟实例（用于无实际音频时的时间控制）
    _this.audioLikeInstance = new _AudioLike["default"]();

    // 设置 MobX 观察者模式，用于响应式状态管理
    (0, _mobx.makeObservable)((0, _assertThisInitialized2["default"])(_this), {
      paused: _mobx.observable
    });

    // 创建播放状态同步机制
    var updatePaused = function updatePaused(paused) {
      return (0, _mobx.runInAction)(function () {
        return _this.paused = paused;
      });
    };
    var onPause = function onPause() {
      return updatePaused(true);
    };
    var onPlay = function onPlay() {
      return updatePaused(false);
    };

    // 为所有媒体实例添加播放状态监听器，确保状态同步
    _this.audioInstance.addEventListener('pause', onPause);
    _this.audioInstance.addEventListener('play', onPlay);
    (_this$options$videoIn = _this.options.videoInstance) === null || _this$options$videoIn === void 0 ? void 0 : _this$options$videoIn.addEventListener('pause', onPause);
    (_this$options$videoIn2 = _this.options.videoInstance) === null || _this$options$videoIn2 === void 0 ? void 0 : _this$options$videoIn2.addEventListener('play', onPlay);
    _this.audioLikeInstance.addEventListener('pause', onPause);
    _this.audioLikeInstance.addEventListener('play', onPlay);

    // 保存事件清理函数，用于销毁时清理所有监听器
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
   * 更新视频源
   * 
   * 这是一个复杂的异步过程，包括：
   * 1. 检查是否需要更新
   * 2. 冻结当前播放状态
   * 3. 预加载或直接设置视频源
   * 4. 设置播放开始监听器
   * 
   * @private
   */
  (0, _createClass2["default"])(VideoAgentMesh, [{
    key: "mediaInstance",
    get:
    /**
     * 获取当前活动的媒体实例
     * 
     * 根据当前状态返回不同类型的媒体实例：
     * - 如果没有视频URL，返回音频模拟实例 (AudioLike)
     * - 如果是音频文件，返回 HTML Audio 元素
     * - 如果是视频文件，返回 HTML Video 元素
     */
    function get() {
      // 没有视频URL时，使用音频模拟实例
      if (!this.videoUrl) {
        return this.audioLikeInstance;
      }

      // 音频文件使用专门的音频实例
      if ((0, _getMediaInfo.getMediaType)(this.videoUrl) === 'audio') {
        return this.audioInstance;
      }

      // 视频文件从材质纹理中获取视频实例
      var uniforms = this.material.uniforms;
      var videoInstance = uniforms.map.value.image;
      return videoInstance;
    }
  }, {
    key: "update",
    value: (function () {
      var _update = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(videoUrl) {
        var _this2 = this;
        var uniforms, onStart;
        return _regenerator["default"].wrap(function _callee$(_context) {
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

                // 设置冻结状态，阻止不必要的更新
                this.freeze = true;
                _context.next = 6;
                return this.mediaInstance.pause();
              case 6:
                uniforms = this.material.uniforms; // 临时静音，避免播放过程中的音频干扰
                this.mediaInstance.muted = true;

                // 智能资源加载策略：
                // - 如果启用预加载 或 文件是视频格式，使用Blob方式预加载
                // - 否则直接使用URL（适用于音频文件，避免iOS兼容性问题）
                if (!(this.options.preload || this.options.preload === undefined || (0, _getMediaInfo.getMediaType)(this.videoUrl) === 'video')) {
                  _context.next = 18;
                  break;
                }
                _context.t1 = URL;
                _context.next = 12;
                return _Preloader.Preloader.blob(this.videoUrl);
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
                // 设置数据源属性，用于调试和状态追踪
                this.mediaInstance.setAttribute('data-src', this.videoUrl);

                // 播放开始回调函数
                onStart = function onStart() {
                  // 确保已经开始播放（currentTime > 0）
                  if (_this2.mediaInstance.currentTime === 0) return;

                  // 解除冻结状态
                  _this2.freeze = false;

                  // 恢复音频
                  _this2.mediaInstance.muted = false;

                  // 根据媒体类型启用着色器效果（视频文件启用，音频文件不启用）
                  uniforms.enable.value = (0, _getMediaInfo.getMediaType)(_this2.videoUrl) ? 1 : 0;

                  // 移除临时监听器，避免重复触发
                  _this2.mediaInstance.removeEventListener('timeupdate', onStart, false);
                }; // 监听时间更新事件，等待播放真正开始
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
     * 1. 仅时长播放（AudioLike模式）
     * 2. 继续播放当前视频
     * 3. 播放新的视频内容
     * 
     * @param videoUrl - 视频URL，空字符串表示继续播放或仅时长模式
     * @param currentTime - 开始播放时间（秒）
     * @param duration - 播放时长（毫秒），用于AudioLike模式
     * @returns Promise<boolean> - 播放操作是否成功
     */
    )
  }, {
    key: "play",
    value: (function () {
      var _play = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var _this3 = this;
        var videoUrl,
          currentTime,
          duration,
          _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                videoUrl = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';
                currentTime = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
                duration = _args3.length > 2 ? _args3[2] : undefined;
                videoUrl = videoUrl || '';

                // 模式1：仅时长播放（使用AudioLike进行时间控制，无实际媒体）
                if (!(duration && !videoUrl)) {
                  _context3.next = 10;
                  break;
                }
                if (this.currentTime) {
                  this.mediaInstance.currentTime = currentTime;
                }
                // 设置AudioLike的时长并开始播放
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
                // 先暂停，准备新的播放
                this.mediaInstance.pause();

                // 使用短暂延迟确保媒体元素状态更新完成
                _context3.next = 28;
                return new Promise(function (resolve) {
                  return setTimeout(/*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
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
                }) // 20ms延迟，确保DOM更新完成
                ;
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
     * 将媒体元素的秒数转换为毫秒，提供更精确的时间控制
     */
    )
  }, {
    key: "currentTime",
    get: function get() {
      return this.mediaInstance.currentTime * 1000;
    }

    /**
     * 销毁实例并清理所有资源
     * 
     * 包括：
     * 1. 移除所有事件监听器
     * 2. 清理缓存的媒体实例
     * 3. 从DOM中移除元素
     */
  }, {
    key: "dispose",
    value: function dispose() {
      // 清理事件监听器
      this.$removeEventListener();

      // 清理缓存的音频实例
      if (cacheInstance.audioInstance) {
        document.body.removeChild(cacheInstance.audioInstance);
        cacheInstance.audioInstance = undefined;
      }

      // 清理缓存的视频实例
      if (cacheInstance.videoInstance) {
        document.body.removeChild(cacheInstance.videoInstance);
        cacheInstance.videoInstance = undefined;
      }
    }
  }]);
  return VideoAgentMesh;
}(THREE.Mesh);
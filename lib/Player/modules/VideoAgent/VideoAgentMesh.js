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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var vertexShader = "\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\nvoid main(){\n  vUv = uv;\n  vColorUv = vec2(uv.x / 2.0, uv.y);\n  vMaskUv = vec2(0.5 + uv.x / 2.0, uv.y);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

var fragmentShaderTpl = function fragmentShaderTpl() {
  return "\nuniform int enable;\nuniform sampler2D map;\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\n\nvec3 hsv2rgb(vec3 c) {\n  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvec3 rgb2hsv(vec3 c) {\n  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);\n}\n\nvoid main(void) {\n  vec3 color = texture2D(map, vUv).xyz;\n  float amask = 1.0;\n\n  float ref = color.r;\n  if (ref < color.b) ref = color.b;\n  amask = color.g - ref + 0.1;\n  amask = smoothstep(0.1, 0.3, amask);\n  amask = 1.0 - amask;\n\n  vec3 target = rgb2hsv(vec3(0.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0));\n  vec3 hsv = rgb2hsv(color);\n  float distance = abs(hsv.x - target.x);\n  if (distance < 0.15) {\n    hsv.y = 0.0;\n  }\n  color = hsv2rgb(hsv);\n\n  gl_FragColor = vec4(color.rgb, amask * float(enable));\n}\n";
};

var cacheInstance = {};

/**
 * 视频经纪人MESH
 */
var VideoAgentMesh = /*#__PURE__*/function (_THREE$Mesh) {
  (0, _inherits2["default"])(VideoAgentMesh, _THREE$Mesh);

  var _super = _createSuper(VideoAgentMesh);

  /**
   *
   * @param width
   * @param height
   * @param widthSegments
   * @param heightSegments
   * @param options
   */
  function VideoAgentMesh(width, height, widthSegments, heightSegments) {
    var _this$options$videoIn, _this$options$videoIn2;

    var _this;

    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      preload: true
    };
    (0, _classCallCheck2["default"])(this, VideoAgentMesh);

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
        audioInstance.crossOrigin = ''; // videoInstance.muted = true

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

    _this.audioLikeInstance = new _AudioLike["default"]();
    (0, _mobx.makeObservable)((0, _assertThisInitialized2["default"])(_this), {
      paused: _mobx.observable
    });

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

  (0, _createClass2["default"])(VideoAgentMesh, [{
    key: "mediaInstance",
    get: function get() {
      if (!this.videoUrl) {
        return this.audioLikeInstance;
      }

      if ((0, _getMediaInfo.getMediaType)(this.videoUrl) === 'audio') {
        return this.audioInstance;
      }

      var uniforms = this.material.uniforms;
      var videoInstance = uniforms.map.value.image;
      return videoInstance;
    }
  }, {
    key: "update",
    value: function () {
      var _update = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(videoUrl) {
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
                this.videoUrl = videoUrl; // // 兼容非视频场景
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
                this.mediaInstance.setAttribute('data-src', this.videoUrl);

                onStart = function onStart() {
                  if (_this2.mediaInstance.currentTime === 0) return;
                  _this2.freeze = false;
                  _this2.mediaInstance.muted = false;
                  uniforms.enable.value = (0, _getMediaInfo.getMediaType)(_this2.videoUrl) ? 1 : 0;

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
  }, {
    key: "play",
    value: function () {
      var _play = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
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
                  return setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
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
     * 秒转成毫秒，保障精准度
     */

  }, {
    key: "currentTime",
    get: function get() {
      return this.mediaInstance.currentTime * 1000;
    }
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

exports.VideoAgentMesh = VideoAgentMesh;
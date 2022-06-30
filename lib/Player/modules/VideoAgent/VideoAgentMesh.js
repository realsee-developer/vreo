"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgentMesh = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _Preloader = require("../../../shared-utils/Preloader");

var _mobx = require("mobx");

var _AduioLike = _interopRequireDefault(require("../../../shared-utils/AduioLike"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

var vertexShader = "\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\nvoid main(){\n  vUv = uv;\n  vColorUv = vec2(uv.x / 2.0, uv.y);\n  vMaskUv = vec2(0.5 + uv.x / 2.0, uv.y);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

var fragmentShaderTpl = function fragmentShaderTpl() {
  return "\nuniform int enable;\nuniform sampler2D map;\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\n\nvec3 hsv2rgb(vec3 c) {\n  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvec3 rgb2hsv(vec3 c) {\n  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);\n}\n\nvoid main(void) {\n  vec3 color = texture2D(map, vUv).xyz;\n  float amask = 1.0;\n\n  float ref = color.r;\n  if (ref < color.b) ref = color.b;\n  amask = color.g - ref + 0.1;\n  amask = smoothstep(0.1, 0.3, amask);\n  amask = 1.0 - amask;\n\n  vec3 target = rgb2hsv(vec3(0.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0));\n  vec3 hsv = rgb2hsv(color);\n  float distance = abs(hsv.x - target.x);\n  if (distance < 0.15) {\n    hsv.y = 0.0;\n  }\n  color = hsv2rgb(hsv);\n\n  gl_FragColor = vec4(color.rgb, amask * float(enable));\n}\n";
};

var cacheInstance = {};

/**
 * 视频经纪人MESH
 */
var VideoAgentMesh = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(VideoAgentMesh, _THREE$Mesh);

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
    var _this$options$videoIn, _this$options$videoIn2, _this$options$videoIn3;

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
        audioInstance.setAttribute('playsinline', 'true');
        audioInstance.setAttribute('webkit-playsinline', 'true');
        audioInstance.setAttribute('autoplay', 'false');
        audioInstance.setAttribute('style', 'display: none;');
        document.body.appendChild(audioInstance);
        _this.audioInstance = audioInstance;
        cacheInstance.audioInstance = audioInstance;
      }
    } else {
      _this.audioInstance = options.audioInstance;
    }

    _this.audioLikeInstance = new _AduioLike["default"]();
    (0, _mobx.makeObservable)(_assertThisInitialized(_this), {
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

    var onEnded = function onEnded() {
      console.log('vreo: video 播放结束');
    };

    _this.audioInstance.addEventListener('pause', onPause);

    _this.audioInstance.addEventListener('play', onPlay);

    (_this$options$videoIn = _this.options.videoInstance) === null || _this$options$videoIn === void 0 ? void 0 : _this$options$videoIn.addEventListener('pause', onPause);
    (_this$options$videoIn2 = _this.options.videoInstance) === null || _this$options$videoIn2 === void 0 ? void 0 : _this$options$videoIn2.addEventListener('play', onPlay);

    _this.audioLikeInstance.addEventListener('pause', onPause);

    _this.audioLikeInstance.addEventListener('play', onPlay);

    (_this$options$videoIn3 = _this.options.videoInstance) === null || _this$options$videoIn3 === void 0 ? void 0 : _this$options$videoIn3.addEventListener('ended', onEnded);

    _this.$removeEventListener = function () {
      var _this$options$videoIn4, _this$options$videoIn5, _this$options$videoIn6;

      _this.audioInstance.removeEventListener('pause', onPause);

      _this.audioInstance.removeEventListener('play', onPlay);

      (_this$options$videoIn4 = _this.options.videoInstance) === null || _this$options$videoIn4 === void 0 ? void 0 : _this$options$videoIn4.removeEventListener('pause', onPause);
      (_this$options$videoIn5 = _this.options.videoInstance) === null || _this$options$videoIn5 === void 0 ? void 0 : _this$options$videoIn5.removeEventListener('play', onPlay);

      _this.audioLikeInstance.removeEventListener('pause', onPause);

      _this.audioLikeInstance.removeEventListener('play', onPlay);

      (_this$options$videoIn6 = _this.options.videoInstance) === null || _this$options$videoIn6 === void 0 ? void 0 : _this$options$videoIn6.removeEventListener('ended', onEnded);
    };

    return _this;
  }

  _createClass(VideoAgentMesh, [{
    key: "videoInstance",
    get: function get() {
      var _this$videoUrl;

      if (!this.videoUrl) {
        return this.audioLikeInstance;
      }

      if ((_this$videoUrl = this.videoUrl) !== null && _this$videoUrl !== void 0 && _this$videoUrl.endsWith('mp3')) {
        return this.audioInstance;
      }

      var uniforms = this.material.uniforms;
      var videoInstance = uniforms.map.value.image;
      return videoInstance;
    }
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(videoUrl) {
        var _this2 = this;

        var uniforms, onStart;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
                this.freeze = true;
                _context.next = 6;
                return this.videoInstance.pause();

              case 6:
                uniforms = this.material.uniforms;
                this.videoInstance.muted = true;

                if (!(this.options.preload || this.options.preload === undefined || this.videoUrl.endsWith('.mp4'))) {
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
                this.videoInstance.src = _context.t0;
                this.videoInstance.setAttribute('data-src', this.videoUrl);

                onStart = function onStart() {
                  var _this2$videoUrl;

                  if (_this2.videoInstance.currentTime === 0) return;
                  _this2.freeze = false;
                  _this2.videoInstance.muted = false;
                  uniforms.enable.value = (_this2$videoUrl = _this2.videoUrl) !== null && _this2$videoUrl !== void 0 && _this2$videoUrl.endsWith('.mp4') ? 1 : 0;

                  _this2.videoInstance.removeEventListener('timeupdate', onStart, false);
                };

                this.videoInstance.addEventListener('timeupdate', onStart, false);

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
      var _play = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this3 = this;

        var videoUrl,
            currentTime,
            duration,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
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
                  this.videoInstance.currentTime = currentTime;
                }

                this.videoInstance.duration = duration;
                this.videoUrl = '';
                this.videoInstance.play();
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
                return this.videoInstance.play();

              case 14:
                _context3.next = 17;
                break;

              case 16:
                console.warn('警告：视频资源未初始化。');

              case 17:
                return _context3.abrupt("return", true);

              case 18:
                console.log('play', videoUrl, this.videoUrl);

                if (!(videoUrl === this.videoUrl)) {
                  _context3.next = 24;
                  break;
                }

                this.videoInstance.currentTime = currentTime;
                _context3.next = 23;
                return this.videoInstance.play();

              case 23:
                return _context3.abrupt("return", true);

              case 24:
                _context3.next = 26;
                return this.update(videoUrl);

              case 26:
                this.videoInstance.pause();
                _context3.next = 29;
                return new Promise(function (resolve) {
                  return setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _this3.videoInstance.currentTime = currentTime;
                            _context2.next = 3;
                            return _this3.videoInstance.play();

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

              case 29:
                return _context3.abrupt("return", _context3.sent);

              case 30:
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
     * 转成毫秒，保障精准度
     */

  }, {
    key: "currentTime",
    get: function get() {
      return this.videoInstance.currentTime * 1000;
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
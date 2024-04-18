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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var DefaultAudioCacheLength = 3;
var id = "vreo-app-dhjskadhksahdjskahdjksa";
var audioCacheLength = Number((_location$search$matc = (_location$search$matc2 = location.search.match(/audio_cache=(\d+)/)) === null || _location$search$matc2 === void 0 ? void 0 : _location$search$matc2[1]) !== null && _location$search$matc !== void 0 ? _location$search$matc : DefaultAudioCacheLength);
var Player = /*#__PURE__*/function (_Subscribe) {
  (0, _inherits2["default"])(Player, _Subscribe);
  var _super = _createSuper(Player);
  function Player(five) {
    var _this;
    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2["default"])(this, Player);
    _this = _super.call(this);
    _this.$five = five;
    (0, _Audio.generateBlankAudio)(audioCacheLength);
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
    _this.controller = new _Controller.Controller({
      five: five,
      container: configs.container,
      configs: _this.configs
    });
    ReactDOM.render( /*#__PURE__*/React.createElement(_Controller.ControllerContext.Provider, {
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

    // 监听播放情况：抛出触发时机
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
  (0, _createClass2["default"])(Player, [{
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(vreoUnit) {
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
                  if (vreoKeyframe.type !== _VreoUnit.VreoKeyframeEnum.CameraMovement) {
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
                return (0, _Audio.waitForBlankAudioGenerated)();
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
  }, {
    key: "paused",
    get: function get() {
      return !this.controller.playing;
    }
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
        if (keyframe.type === _VreoUnit.VreoKeyframeEnum.BgMusic) {
          keyframe.parsed = false;
        }
      });
      return true;
    }
  }, {
    key: "setAppearance",
    value: function setAppearance(appearance) {
      this.controller.setAppearance(appearance);
    }
  }, {
    key: "pause",
    value: function pause() {
      this.controller.setPlaying(false);
    }
  }, {
    key: "show",
    value: function show() {
      this.controller.setVisible(true);
    }
  }, {
    key: "hide",
    value: function hide() {
      this.controller.setVisible(false);
    }
  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      return this.controller.currentTime;
    }
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
exports.Player = Player;
console.log("\n    \u250F\u2501\u2501\u2501\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u250F\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2503\u250F\u2501\u2513\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2503\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2503\u2517\u2501\u251B\u2503\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u2501\u2503\u2503\u2501\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\n    \u2503\u250F\u2513\u250F\u251B\u2503\u250F\u2513\u2503\u2517\u2501\u2513\u2503\u2501\u2503\u2503\u2501\u2503\u2501\u2501\u252B\u2503\u250F\u2513\u2503\u2503\u250F\u2513\u2503\n    \u2503\u2503\u2503\u2517\u2513\u2503\u2503\u2501\u252B\u2503\u2517\u251B\u2517\u2513\u2503\u2517\u2513\u2523\u2501\u2501\u2503\u2503\u2503\u2501\u252B\u2503\u2503\u2501\u252B\n    \u2517\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u2501\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\n    \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n    \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n");
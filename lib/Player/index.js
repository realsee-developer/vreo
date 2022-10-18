"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _five = require("@realsee/five");

var _App = require("./App");

var _Controller = require("./Controller");

var _VreoUnit = require("../typings/VreoUnit");

var _mobx = require("mobx");

var _Drawer = require("./modules/Drawer");

var _PopUp = require("./modules/PopUp");

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

var Player = /*#__PURE__*/function (_Subscribe) {
  _inherits(Player, _Subscribe);

  var _super = _createSuper(Player);

  function Player(five) {
    var _this;

    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Player);

    _this = _super.call(this);
    _this.$five = five;

    if (!configs.container) {
      configs.container = configs.containter;
    }

    if (!configs.container) {
      var _five$getElement;

      var container = document.getElementById('vreo-app') || document.createElement('div');
      ReactDOM.unmountComponentAtNode(container);
      container.setAttribute('id', 'vreo-app');
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
    })), configs.container); // 监听播放情况：抛出触发时机

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

  _createClass(Player, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(vreoUnit) {
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
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentTime = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
                preload = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                force = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
                this.controller.setLoading(true);

                if (force) {
                  vreoUnit = JSON.parse(JSON.stringify(vreoUnit));
                }

                if (this.controller.visible) {
                  _context.next = 9;
                  break;
                }

                this.controller.setVisible(true); // 延迟 500ms 规避跟 DOM 动画冲突

                _context.next = 9;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    return resolve(true);
                  }, 500);
                });

              case 9:
                if (this.controller.stopInterval) {
                  this.controller.stopInterval();
                  this.controller.stopInterval = undefined;
                }

                this.controller.vreoUnit = vreoUnit;
                (_this$controller$medi = this.controller.mediaInstance) === null || _this$controller$medi === void 0 ? void 0 : _this$controller$medi.pause(); // 预载逻辑
                // 是否降低图片分辨率

                if (this.$five.imageOptions.size && (_this$configs$imageOp = this.configs.imageOptions) !== null && _this$configs$imageOp !== void 0 && _this$configs$imageOp.size && this.$five.imageOptions.size > this.configs.imageOptions.size) {
                  this.$five.imageOptions.size = this.configs.imageOptions.size;
                } // 预载数据中的点位


                if (!(preload || preload === undefined && this.configs.autoPreload)) {
                  _context.next = 23;
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

              case 17:
                if (!(i < panoIndexes.length)) {
                  _context.next = 23;
                  break;
                }

                _context.next = 20;
                return this.$five.preloadPano(Number(panoIndexes[i]));

              case 20:
                i++;
                _context.next = 17;
                break;

              case 23:
                // 新数据载入就绪
                this.emit('loaded', vreoUnit);
                this.controller.emit('loaded', vreoUnit);

                if ((_this$controller$vide = this.controller.videoAgentScene) !== null && _this$controller$vide !== void 0 && _this$controller$vide.videoAgentMesh.mediaInstance) {
                  this.controller.videoAgentScene.videoAgentMesh.mediaInstance.currentTime = currentTime / 1000;
                }

                this.controller.setAvatar(vreoUnit.video.avatar);
                _context.next = 29;
                return (_this$controller$vide2 = this.controller.videoAgentScene) === null || _this$controller$vide2 === void 0 ? void 0 : _this$controller$vide2.videoAgentMesh.play(vreoUnit.video.url, currentTime / 1000, vreoUnit.video.duration);

              case 29:
                this.controller.setEnded(false);
                this.play();
                this.controller.run(function (type, keyframe) {
                  return _this2.emit(type, keyframe);
                });
                this.controller.setLoading(false);
                return _context.abrupt("return", true);

              case 34:
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
      if (this.controller.playing) return true;

      if (currentTime && this.controller.mediaInstance) {
        this.controller.mediaInstance.currentTime = currentTime / 1000;
      }

      Object.assign(window, {
        $vreoController: this.controller
      });
      this.controller.setPlaying(true);
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
      this.pause();
      this.controller.dispose();

      if (this.configs.container) {
        ReactDOM.unmountComponentAtNode(this.configs.container);
      }
    }
  }]);

  return Player;
}(_five.Subscribe);

exports.Player = Player;
console.log("\n\n\u250F\u2501\u2501\u2501\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u250F\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503\u250F\u2501\u2513\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2503\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503\u2517\u2501\u251B\u2503\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u2501\u2503\u2503\u2501\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\n\u2503\u250F\u2513\u250F\u251B\u2503\u250F\u2513\u2503\u2517\u2501\u2513\u2503\u2501\u2503\u2503\u2501\u2503\u2501\u2501\u252B\u2503\u250F\u2513\u2503\u2503\u250F\u2513\u2503\n\u2503\u2503\u2503\u2517\u2513\u2503\u2503\u2501\u252B\u2503\u2517\u251B\u2517\u2513\u2503\u2517\u2513\u2523\u2501\u2501\u2503\u2503\u2503\u2501\u252B\u2503\u2503\u2501\u252B\n\u2517\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u2501\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n");
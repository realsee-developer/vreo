"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var React = _interopRequireWildcard(require("react"));

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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
    _this.controller = new _Controller.Controller();
    _this.$five = _this.controller.$five = five;

    if (!configs.containter) {
      var _five$getElement;

      var containter = document.getElementById('vreo-app') || document.createElement('div');
      ReactDOM.unmountComponentAtNode(containter);
      containter.setAttribute('id', 'vreo-app');
      configs.containter = containter;
      var fiveCanvasDomParent = (_five$getElement = five.getElement()) === null || _five$getElement === void 0 ? void 0 : _five$getElement.parentNode;

      if (fiveCanvasDomParent) {
        fiveCanvasDomParent.append(containter);
      } else {
        document.body.append(containter);
      } // document.body.append(containter)

    }

    _this.configs = Object.freeze(Object.assign({
      keyframeMap: {}
    }, configs));
    _this.controller.configs = _this.configs;
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
    })), configs.containter); // 监听播放情况：抛出触发时机

    (0, _mobx.reaction)(function () {
      return [_this.controller.playing, _this.controller.ended];
    }, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          playing = _ref2[0],
          ended = _ref2[1];

      if (ended) {
        _this.emit('paused', true);
      } else {
        _this.emit(playing ? 'playing' : 'paused');
      }
    });
    return _this;
  }

  _createClass(Player, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(vreoUnit) {
        var _this$controller$vide,
            _this$configs$imageOp,
            _this$controller$vide2,
            _this$controller$vide3,
            _this2 = this;

        var currentTime,
            preload,
            force,
            panoIndexMap,
            panoIndexs,
            i,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentTime = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
                preload = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                force = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;

                if (force) {
                  vreoUnit = JSON.parse(JSON.stringify(vreoUnit));
                }

                if (this.controller.visible) {
                  _context.next = 8;
                  break;
                }

                this.controller.setVisible(true); // 延迟 500ms 规避跟 DOM 动画冲突

                _context.next = 8;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    return resolve(true);
                  }, 500);
                });

              case 8:
                if (this.controller.stopInterval) {
                  this.controller.stopInterval();
                  this.controller.stopInterval = undefined;
                }

                this.controller.vreoUnit = vreoUnit;
                (_this$controller$vide = this.controller.videoInstance) === null || _this$controller$vide === void 0 ? void 0 : _this$controller$vide.pause(); // 预载逻辑
                // 是否降低图片分辨率

                if (this.$five.imageOptions.size && (_this$configs$imageOp = this.configs.imageOptions) !== null && _this$configs$imageOp !== void 0 && _this$configs$imageOp.size && this.$five.imageOptions.size > this.configs.imageOptions.size) {
                  this.$five.imageOptions.size = this.configs.imageOptions.size;
                } // 预载数据中的点位


                if (!(preload || preload === undefined && this.configs.autoPreload)) {
                  _context.next = 22;
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
                panoIndexs = Object.keys(panoIndexMap);
                i = 0;

              case 16:
                if (!(i < panoIndexs.length)) {
                  _context.next = 22;
                  break;
                }

                _context.next = 19;
                return this.$five.preloadPano(Number(panoIndexs[i]));

              case 19:
                i++;
                _context.next = 16;
                break;

              case 22:
                // 新数据载入就绪
                this.emit('loaded', vreoUnit);
                this.controller.emit('loaded', vreoUnit);

                if ((_this$controller$vide2 = this.controller.videoAgentScene) !== null && _this$controller$vide2 !== void 0 && _this$controller$vide2.videoAgentMesh.videoInstance) {
                  this.controller.videoAgentScene.videoAgentMesh.videoInstance.currentTime = currentTime / 1000;
                }

                _context.next = 27;
                return (_this$controller$vide3 = this.controller.videoAgentScene) === null || _this$controller$vide3 === void 0 ? void 0 : _this$controller$vide3.videoAgentMesh.play(vreoUnit.video.url, currentTime / 1000, vreoUnit.video.duration);

              case 27:
                this.controller.setEnded(false);
                this.play();
                this.controller.run(function (type, keyframe) {
                  return _this2.emit(type, keyframe);
                });
                return _context.abrupt("return", true);

              case 31:
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

      if (currentTime && this.controller.videoInstance) {
        this.controller.videoInstance.currentTime = currentTime / 1000;
      }

      Object.assign(window, {
        $vreoController: this.controller
      });
      this.controller.setPlaying(true);
      return true;
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

      if (this.configs.containter) {
        ReactDOM.unmountComponentAtNode(this.configs.containter);
      }
    }
  }]);

  return Player;
}(_five.Subscribe);

exports.Player = Player;
console.log("\n\n\u250F\u2501\u2501\u2501\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u250F\u2513\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503\u250F\u2501\u2513\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2503\u2503\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2503\u2517\u2501\u251B\u2503\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u2501\u2503\u2503\u2501\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\u250F\u2501\u2501\u2513\n\u2503\u250F\u2513\u250F\u251B\u2503\u250F\u2513\u2503\u2517\u2501\u2513\u2503\u2501\u2503\u2503\u2501\u2503\u2501\u2501\u252B\u2503\u250F\u2513\u2503\u2503\u250F\u2513\u2503\n\u2503\u2503\u2503\u2517\u2513\u2503\u2503\u2501\u252B\u2503\u2517\u251B\u2517\u2513\u2503\u2517\u2513\u2523\u2501\u2501\u2503\u2503\u2503\u2501\u252B\u2503\u2503\u2501\u252B\n\u2517\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u2501\u251B\u2517\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\u2517\u2501\u2501\u251B\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501 \n\n");
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var React = _interopRequireWildcard(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _five = require("@realsee/five");

var _App = require("./App");

var _Controller = require("./Controller");

var _mobx = require("mobx");

var _Drawer = require("./modules/Drawer");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

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
      var containter = document.querySelector('#vreo-app') || document.createElement('div');
      ReactDOM.unmountComponentAtNode(containter);
      containter.setAttribute('id', 'vreo-app');
      configs.containter = containter;
      document.body.append(containter);
    }

    _this.configs = Object.freeze(Object.assign({
      keyframeMap: {}
    }, configs));
    _this.controller.configs = _this.configs;
    ReactDOM.render( /*#__PURE__*/React.createElement(_Controller.ControllerContext.Provider, {
      value: _this.controller
    }, /*#__PURE__*/React.createElement(_App.App, null), /*#__PURE__*/React.createElement(_Drawer.Drawer, null)), configs.containter); // 监听播放情况：抛出触发时机

    (0, _mobx.reaction)(function () {
      return _this.controller.playing;
    }, function (playing) {
      _this.emit(playing ? 'playing' : 'paused');
    });
    return _this;
  }

  _createClass(Player, [{
    key: "load",
    value: function () {
      var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(vreoUnit) {
        var _this$controller$vide,
            _this2 = this;

        var currentTime,
            _this$controller$vide2,
            _this$controller$vide3,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentTime = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;

                if (this.controller.visible) {
                  _context.next = 5;
                  break;
                }

                this.controller.setVisible(true);
                _context.next = 5;
                return new Promise(function (resolve) {
                  setTimeout(function () {
                    return resolve(true);
                  }, 500);
                });

              case 5:
                if (this.controller.stopInterval) {
                  this.controller.stopInterval();
                  this.controller.stopInterval = undefined;
                }

                this.controller.vreoUnit = vreoUnit;
                (_this$controller$vide = this.controller.videoInstance) === null || _this$controller$vide === void 0 ? void 0 : _this$controller$vide.pause();

                if (!vreoUnit.video.url) {
                  _context.next = 13;
                  break;
                }

                if ((_this$controller$vide2 = this.controller.videoAgentScene) !== null && _this$controller$vide2 !== void 0 && _this$controller$vide2.videoAgentMesh.videoInstance) {
                  this.controller.videoAgentScene.videoAgentMesh.videoInstance.currentTime = currentTime / 1000;
                }

                _context.next = 12;
                return (_this$controller$vide3 = this.controller.videoAgentScene) === null || _this$controller$vide3 === void 0 ? void 0 : _this$controller$vide3.videoAgentMesh.play(vreoUnit.video.url);

              case 12:
                this.play();

              case 13:
                this.controller.run(function (type, keyframe) {
                  return _this2.emit(type, keyframe);
                });
                return _context.abrupt("return", true);

              case 15:
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
    value: function play() {
      if (this.controller.playing) return true;
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
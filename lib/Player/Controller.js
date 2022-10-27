"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControllerContext = exports.Controller = void 0;
var _five = require("@realsee/five");
var _mobx = require("mobx");
var React = _interopRequireWildcard(require("react"));
var _animationFrame = require("../shared-utils/animationFrame");
var _setElementDataset = _interopRequireDefault(require("../shared-utils/setElementDataset"));
var _getMediaInfo = require("../shared-utils/getMediaInfo");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * 逻辑控制器：内部状态。
 */
var Controller = /*#__PURE__*/function (_Subscribe) {
  _inherits(Controller, _Subscribe);
  var _super = _createSuper(Controller);
  function Controller(_ref) {
    var _this;
    var five = _ref.five,
      container = _ref.container,
      configs = _ref.configs;
    _classCallCheck(this, Controller);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "playing", false);
    _defineProperty(_assertThisInitialized(_this), "ended", false);
    _defineProperty(_assertThisInitialized(_this), "loading", false);
    _defineProperty(_assertThisInitialized(_this), "containerSize", {
      width: 0,
      height: 0
    });
    _defineProperty(_assertThisInitialized(_this), "waveAppearance", null);
    _defineProperty(_assertThisInitialized(_this), "appearance", {
      waveStyle: 'wave'
    });
    _defineProperty(_assertThisInitialized(_this), "avatar", {});
    _defineProperty(_assertThisInitialized(_this), "visible", false);
    _defineProperty(_assertThisInitialized(_this), "popUp", null);
    _defineProperty(_assertThisInitialized(_this), "drawerConfig", null);
    _this.configs = configs;
    _this.container = container;
    _this.five = five;
    _this.appSize = configs.appSize;
    _this.appearance = _objectSpread(_objectSpread({}, _this.appearance), configs.appearance);
    (0, _mobx.makeObservable)(_assertThisInitialized(_this), {
      visible: _mobx.observable,
      setVisible: _mobx.action,
      playing: _mobx.observable,
      setPlaying: _mobx.action,
      loading: _mobx.observable,
      setLoading: _mobx.action,
      popUp: _mobx.observable.ref,
      openPopUp: _mobx.action,
      drawerConfig: _mobx.observable.ref,
      openDrawer: _mobx.action,
      ended: _mobx.observable,
      waveAppearance: _mobx.observable,
      avatar: _mobx.observable,
      containerSize: _mobx.observable,
      setContainerSize: _mobx.action,
      appearance: _mobx.observable,
      setAppearance: _mobx.action,
      configs: _mobx.observable.ref,
      setEnded: _mobx.action,
      setAvatar: _mobx.action
    });
    (0, _mobx.reaction)(function () {
      return [_this.appearance.waveStyle, _this.loading];
    }, function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        waveStyle = _ref3[0],
        loading = _ref3[1];
      if (loading === null) {
        _this.waveAppearance = null;
        return;
      }
      if (waveStyle === 'wave') {
        switch (loading) {
          case true:
            _this.waveAppearance = 'double';
            break;
          case false:
            _this.waveAppearance = 'solid';
            break;
        }
      } else if (waveStyle === 'solid') {
        switch (loading) {
          case true:
            _this.waveAppearance = 'swap';
            break;
          case false:
            _this.waveAppearance = 'expand';
            break;
        }
      }
    }, {
      fireImmediately: true
    });
    if (!_this.appSize) {
      (0, _mobx.reaction)(function () {
        return _this.containerSize;
      }, function (containerSize) {
        if (!(containerSize !== null && containerSize !== void 0 && containerSize.width)) return;
        var width = containerSize.width;
        var height = containerSize.height;
        var size = function () {
          if (width <= 500) return 'S';
          if (width <= 1024) return 'M';
          if (width <= 2048) return 'L';
          return 'XL';
        }();
        var orientation = function () {
          if (height > width) return 'portrait';
          return 'landscape';
        }();
        (0, _setElementDataset["default"])(_this.container, {
          size: size
        });
        (0, _setElementDataset["default"])(_this.container, {
          orientation: orientation
        });
      }, {
        fireImmediately: true
      });
    } else {
      (0, _setElementDataset["default"])(_this.container, {
        size: _this.appSize
      });
    }

    // 监听播放情况：抛出触发时机
    (0, _mobx.reaction)(function () {
      return _this.ended;
    }, function (ended) {
      if (ended) {
        _this.emit('paused', true);
      }
    });
    (0, _mobx.reaction)(function () {
      return _this.playing;
    }, function (playing) {
      if (!_this.ended) {
        _this.emit(playing ? 'playing' : 'paused');
      }
    });
    return _this;
  }
  _createClass(Controller, [{
    key: "agentType",
    get:
    // null 表示加载失败

    function get() {
      var _this$videoAgentScene, _this$avatar;
      var type = (0, _getMediaInfo.getMediaType)((_this$videoAgentScene = this.videoAgentScene) === null || _this$videoAgentScene === void 0 ? void 0 : _this$videoAgentScene.videoAgentMesh.videoUrl);
      if ((_this$avatar = this.avatar) !== null && _this$avatar !== void 0 && _this$avatar.force) return 'avatar';
      if (type === 'video') return 'video';
      return 'none';
    }
  }, {
    key: "openPopUp",
    value: function openPopUp(popUp) {
      if (!popUp) {
        this.popUp = null;
        return;
      }
      this.popUp = popUp;
    }
  }, {
    key: "setLoading",
    value: function setLoading(loading) {
      this.loading = loading;
    }
  }, {
    key: "setAvatar",
    value: function setAvatar(avatar) {
      this.avatar = avatar;
    }
  }, {
    key: "setContainerSize",
    value: function setContainerSize(width, height) {
      this.containerSize = {
        width: width,
        height: height
      };
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.visible = v;
    }
  }, {
    key: "setPlaying",
    value: function setPlaying(playing) {
      this.playing = playing;
    }
  }, {
    key: "setEnded",
    value: function setEnded(ended) {
      this.ended = ended;
    }
  }, {
    key: "setAppearance",
    value: function setAppearance(appearance) {
      this.appearance = _objectSpread(_objectSpread({}, this.appearance), appearance);
    }
  }, {
    key: "openDrawer",
    value: function openDrawer(drawerConfig) {
      if (!drawerConfig) {
        var _this$drawerConfig;
        this.drawerConfig = {
          content: '',
          height: (_this$drawerConfig = this.drawerConfig) === null || _this$drawerConfig === void 0 ? void 0 : _this$drawerConfig.height
        };
        return;
      }
      this.drawerConfig = drawerConfig;
    }
  }, {
    key: "ready",
    get: function get() {
      return !!this.videoAgentScene;
    }
  }, {
    key: "currentTime",
    get: function get() {
      var _this$videoAgentScene2;
      return ((_this$videoAgentScene2 = this.videoAgentScene) === null || _this$videoAgentScene2 === void 0 ? void 0 : _this$videoAgentScene2.videoAgentMesh.currentTime) || 0;
    }
  }, {
    key: "currentKeyframes",
    get: function get() {
      var _this2 = this;
      if (!this.vreoUnit) return [];
      var keyframes = this.vreoUnit.keyframes;
      // 没有被解析过且开始时间低于当前时间戳 100ms
      return keyframes.filter(function (keyframe) {
        if (keyframe.parsed) return false;
        var dur = _this2.currentTime - keyframe.start;
        return dur <= 100 && dur >= 0;
      });
    }
  }, {
    key: "mediaInstance",
    get: function get() {
      var _this$videoAgentScene3;
      return (_this$videoAgentScene3 = this.videoAgentScene) === null || _this$videoAgentScene3 === void 0 ? void 0 : _this$videoAgentScene3.videoAgentMesh.mediaInstance;
    }

    /**
     * 逐帧任务
     */
  }, {
    key: "requestAnimationFrameLoop",
    value: function requestAnimationFrameLoop(callback) {
      var _this$mediaInstance,
        _this$mediaInstance4,
        _this3 = this;
      if ((_this$mediaInstance = this.mediaInstance) !== null && _this$mediaInstance !== void 0 && _this$mediaInstance.ended) {
        this.setEnded(true);
        this.setPlaying(false);
        this.mediaInstance.pause();
        return;
      }
      if (!this.playing) {
        var _this$mediaInstance2;
        if (!((_this$mediaInstance2 = this.mediaInstance) !== null && _this$mediaInstance2 !== void 0 && _this$mediaInstance2.paused)) {
          var _this$mediaInstance3;
          (_this$mediaInstance3 = this.mediaInstance) === null || _this$mediaInstance3 === void 0 ? void 0 : _this$mediaInstance3.pause();
        }
        return;
      }
      if ((_this$mediaInstance4 = this.mediaInstance) !== null && _this$mediaInstance4 !== void 0 && _this$mediaInstance4.paused && this.playing) {
        this.mediaInstance.play();
      }
      var currentKeyframes = this.currentKeyframes;
      currentKeyframes.forEach(function (keyframe) {
        if (keyframe.parsed) return;
        keyframe.parsed = true;
        _this3.emit(keyframe.type, keyframe);
        if (callback) {
          callback(keyframe.type, keyframe);
        }
      });
    }
  }, {
    key: "run",
    value: function run(callback) {
      var _this4 = this;
      if (this.stopInterval) return;
      this.stopInterval = (0, _animationFrame.requestAnimationFrameInterval)(function () {
        return _this4.requestAnimationFrameLoop(callback);
      });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.setPlaying(false);
      if (this.currentKeyframes) {
        this.currentKeyframes.forEach(function (keyframe) {
          return keyframe.parsed = false;
        });
      }

      /**
       * 清理掉数据
       */
      this.vreoUnit = undefined;
      if (this.mediaInstance) {
        this.mediaInstance.currentTime = 0;
      }
      if (this.stopInterval) {
        this.stopInterval();
        this.stopInterval = undefined;
      }
    }
  }]);
  return Controller;
}(_five.Subscribe);
exports.Controller = Controller;
var ControllerContext = /*#__PURE__*/React.createContext(null);
exports.ControllerContext = ControllerContext;
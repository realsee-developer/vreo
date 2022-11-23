"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateBlankAudio = generateBlankAudio;
exports.getAudio = getAudio;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var blankAudioSrc = 'data:audio/mpeg;base64,//AAAAHGZ0eXBNNEEgAAAAAE00QSBpc29tbXA0MgAAAAFtZGF0AAAAAAAAABwA0AAHANAABwDQAAcAAAM+bW9vdgAAAGxtdmhkAAAAAN+jti7fo7YuAACsRAAADAAAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAdB0cmFrAAAAXHRraGQAAAAB36O2Lt+jti4AAAABAAAAAAAADAAAAAAAAAAAAAAAAAABAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAFsbWRpYQAAACBtZGhkAAAAAN+jti7fo7YuAACsRAAADABVxAAAAAAAMWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABDb3JlIE1lZGlhIEF1ZGlvAAAAARNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAANdzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAAABICAgBRAFAAYAAAA+gAAAPoABYCAgAISCAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAADAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAwAAAAEAAAAgc3RzegAAAAAAAAAAAAAAAwAAAAQAAAAEAAAABAAAABRzdGNvAAAAAAAAAAEAAAAsAAAA+nVkdGEAAADybWV0YQAAAAAAAAAiaGRscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAAAAAAAAAxGlsc3QAAAC8LS0tLQAAABxtZWFuAAAAAGNvbS5hcHBsZS5pVHVuZXMAAAAUbmFtZQAAAABpVHVuU01QQgAAAIRkYXRhAAAAAQAAAAAgMDAwMDAwMDAgMDAwMDA4NDAgMDAwMDAzQzAgMDAwMDAwMDAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMA==';
var audioList = [];

function getAudio(src) {
  var audio = audioList.find(function (audio) {
    return !audio.realSrc || audio.realSrc === blankAudioSrc;
  });

  if (!audio) {
    console.warn('未找到缓存音频，已新建');
    audio = new IAudio(blankAudioSrc);
  }

  if (src) audio.src = src;
  return audio;
}

function generateBlankAudio(length) {
  // 判断一下已经生成几个了，防止重复生成
  var generateLength = length - audioList.length;
  if (generateLength <= 0) return;

  for (var i = 0; i < generateLength; i++) {
    audioList.push(new IAudio(blankAudioSrc));
  }
}

var IAudio = /*#__PURE__*/function (_Audio) {
  _inherits(IAudio, _Audio);

  var _super = _createSuper(IAudio);

  function IAudio(src) {
    var _this;

    _classCallCheck(this, IAudio);

    _this = _super.call(this, src);

    _defineProperty(_assertThisInitialized(_this), "preload", 'auto');

    _defineProperty(_assertThisInitialized(_this), "realSrc", '');

    _defineProperty(_assertThisInitialized(_this), "inited", false);

    _this.realSrc = src !== null && src !== void 0 ? src : '';
    console.log('create audio', src);

    _this.addEventListener('end', function () {
      return _this.src = '';
    });

    var init = _this.init.bind(_assertThisInitialized(_this));

    document.addEventListener('click', init);
    document.addEventListener('touchstart', init);

    _this.removeDocumentEventListener = function () {
      document.removeEventListener('click', init);
      document.removeEventListener('touchstart', init);
    };

    return _this;
  }

  _createClass(IAudio, [{
    key: "src",
    get: function get() {
      return _get(_getPrototypeOf(IAudio.prototype), "src", this);
    },
    set: function set(paramsSrc) {
      _set(_getPrototypeOf(IAudio.prototype), "src", paramsSrc, this, true);

      this.realSrc = paramsSrc;
    }
  }, {
    key: "init",
    value: function init() {
      if (this.inited) return;

      if (this.src) {
        this.inited = true;
        this.removeDocumentEventListener();
      }

      if (this.src === blankAudioSrc) {
        this.play();
      }
    }
  }]);

  return IAudio;
}( /*#__PURE__*/_wrapNativeSuper(Audio));
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _get from "@babel/runtime/helpers/esm/get";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _wrapNativeSuper from "@babel/runtime/helpers/esm/wrapNativeSuper";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var blankAudioSrc = 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA5TEFNRTMuOThyAc0AAAAAAAAAABSAJAiqQgAAgAAABobxtI73AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAACFEII9ACZ/sJZwWEoEb8w/////N//////JcxjHjf+7/v/H2PzCCFAiDtGeyBCIx7bJJ1mmEEMy6g8mm2c8nrGABB4h2Mkmn//4z/73u773R5qHHu/j/w7Kxkzh5lWRWdsifCkNAnY9Zc1HvDAhjhSHdFkHFzLmabt/AQxSg2wwzLhHIJOBnAWwVY4zrhIYhhc2kvhYDfQ4hDi2Gmh5KyFn8EcGIrHAngNgIwVIEMf5bzbAiTRoAD///8z/KVhkkWEle6IX+d/z4fvH3BShK1e5kmjkCMoxVmXhd4ROlTKo3iipasvTilY21q19ta30/v/0/idPX1v8PNxJL6ramnOVsdvMv2akO0iSYIzdJFirtzWXCZicS9vHqvSKyqm5XJBdqBwPxyfJdykhWTZ0G0ZyTZGpLKxsNwwoRhsx3tZfhwmeOBVISm3impAC/IT/8hP/EKEM1KMdVdVKM2rHV4x7HVXZvbVVKN/qq8CiV9VL9jjH/6l6qf7MBCjZmOqsAibjcP+qqqv0oxqpa/NVW286hPo1nz2L/h8+jXt//uSxCmDU2IK/ECN98KKtE5IYzNoCfbw+u9i5r8PoadUMFPKqWL4LK3T/LCraMSHGkW4bpLXR/E6LlHOVQxmslKVJ8IULktMN06N0FKCpHCoYsjC4F+Z0NVqdNFoGSTjSiyjzLdnZ2fNqTi2eHKONONKLMPMKLONKLMPQRJGlFxZRoKcJFAYEeIFiRQkUWUeYfef//Ko04soswso40UJAgMw8wosososy0EalnZyjQUGBRQGIFggOWUacWUeYmuadrZziQKKEgQsQLAhQkUJAgMQDghltLO1onp0cpkNInSFMqlYeSEJ5AHsqFdOwy1DA2sRmRJKxdKRfLhfLw5BzUxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksRRA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
// 下面这段空音频居然在11pro和xr上播不出来
// const blankAudioSrc = 'data:audio/mpeg;base64,//AAAAHGZ0eXBNNEEgAAAAAE00QSBpc29tbXA0MgAAAAFtZGF0AAAAAAAAABwA0AAHANAABwDQAAcAAAM+bW9vdgAAAGxtdmhkAAAAAN+jti7fo7YuAACsRAAADAAAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAdB0cmFrAAAAXHRraGQAAAAB36O2Lt+jti4AAAABAAAAAAAADAAAAAAAAAAAAAAAAAABAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAFsbWRpYQAAACBtZGhkAAAAAN+jti7fo7YuAACsRAAADABVxAAAAAAAMWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABDb3JlIE1lZGlhIEF1ZGlvAAAAARNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAANdzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAAABICAgBRAFAAYAAAA+gAAAPoABYCAgAISCAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAADAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAwAAAAEAAAAgc3RzegAAAAAAAAAAAAAAAwAAAAQAAAAEAAAABAAAABRzdGNvAAAAAAAAAAEAAAAsAAAA+nVkdGEAAADybWV0YQAAAAAAAAAiaGRscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAAAAAAAAAxGlsc3QAAAC8LS0tLQAAABxtZWFuAAAAAGNvbS5hcHBsZS5pVHVuZXMAAAAUbmFtZQAAAABpVHVuU01QQgAAAIRkYXRhAAAAAQAAAAAgMDAwMDAwMDAgMDAwMDA4NDAgMDAwMDAzQzAgMDAwMDAwMDAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMA=='

export var audioList = [];
export function getAudio(src) {
  var audio = audioList.find(function (audio) {
    return !audio.realSrc || audio.realSrc === blankAudioSrc;
  });
  if (!audio) {
    // console.warn('未找到缓存音频，已新建', audioList)
    audio = new IAudio(blankAudioSrc);
    audioList.push(audio);
  }
  if (src) {
    audio.src = src;
  }
  return audio;
}
export function waitForBlankAudioGenerated() {
  return _waitForBlankAudioGenerated.apply(this, arguments);
}
function _waitForBlankAudioGenerated() {
  _waitForBlankAudioGenerated = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var checkInterval,
      timeout,
      startTime,
      isTimedOut,
      _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            checkInterval = _args.length > 0 && _args[0] !== undefined ? _args[0] : 100;
            timeout = _args.length > 1 && _args[1] !== undefined ? _args[1] : 2000;
            console.log('waitForBlankAudioGenerated, needGenerate: ', audioList.some(function (audio) {
              return !audio.ended && audio.src === blankAudioSrc;
            }));
            // while any audioList not ended
            startTime = Date.now();
            isTimedOut = false;
          case 5:
            if (!(audioList.some(function (audio) {
              return !audio.ended && audio.src === blankAudioSrc;
            }) && !isTimedOut)) {
              _context.next = 13;
              break;
            }
            if (!(Date.now() - startTime > timeout)) {
              _context.next = 9;
              break;
            }
            isTimedOut = true;
            return _context.abrupt("return", Promise.resolve());
          case 9:
            _context.next = 11;
            return new Promise(function (resolve) {
              return setTimeout(resolve, checkInterval);
            });
          case 11:
            _context.next = 5;
            break;
          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _waitForBlankAudioGenerated.apply(this, arguments);
}
export function generateBlankAudio(length) {
  // 判断一下已经生成几个了，防止重复生成
  var generateLength = length - audioList.length;
  if (generateLength <= 0) return;
  for (var i = 0; i < generateLength; i++) {
    audioList.push(new IAudio(blankAudioSrc));
  }
}
function initAudio(audio) {
  if (audio.inited) return;
  if (audio.src) {
    audio.inited = true;
    audio.removeDocumentEventListener();
  }
  if (audio.src === blankAudioSrc) {
    audio.play();
  }
}
var IAudio = /*#__PURE__*/function (_Audio) {
  _inherits(IAudio, _Audio);
  var _super = _createSuper(IAudio);
  function IAudio(src) {
    var _thisSuper, _this;
    _classCallCheck(this, IAudio);
    _this = _super.call(this, src);
    _defineProperty(_assertThisInitialized(_this), "preload", 'auto');
    _defineProperty(_assertThisInitialized(_this), "realSrc", '');
    _defineProperty(_assertThisInitialized(_this), "inited", false);
    _this.realSrc = src !== null && src !== void 0 ? src : '';
    _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(IAudio.prototype)), "addEventListener", _thisSuper).call(_thisSuper, 'ended', function () {
      _this.src = '';
    });
    var init = function init() {
      return initAudio(_assertThisInitialized(_this));
    };
    document.addEventListener('click', init);
    document.addEventListener('touchend', init);
    _this.removeDocumentEventListener = function () {
      document.removeEventListener('click', init);
      document.removeEventListener('touchend', init);
    };
    return _this;
  }
  _createClass(IAudio, [{
    key: "src",
    get:
    /**
     * 获取音频源 URL
     * @returns {string} 当前音频源 URL
     */
    function get() {
      return this.getAttribute('src') || '';
    }

    /**
     * 设置音频源 URL
     * @param paramsSrc - 音频源 URL
     */,
    set: function set(paramsSrc) {
      this.setAttribute('src', paramsSrc);
      this.realSrc = paramsSrc;
    }
  }]);
  return IAudio;
}( /*#__PURE__*/_wrapNativeSuper(Audio));
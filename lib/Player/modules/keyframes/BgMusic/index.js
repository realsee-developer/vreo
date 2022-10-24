"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BgMusic = BgMusic;
var React = _interopRequireWildcard(require("react"));
var _VreoUnit = require("../../../../typings/VreoUnit");
var _hooks = require("../../../hooks");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function BgMusic() {
  var controller = (0, _hooks.useController)();
  var timeoutIdRef = React.useRef(null);
  var cleanTimeout = React.useCallback(function () {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);
  React.useEffect(function () {
    var audio = new Audio();
    audio.setAttribute('id', 'vreo-singleton-bgmusic');
    audio.style.display = 'none';
    audio.setAttribute('playsinline', 'true');
    audio.loop = true;
    document.body.append(audio);
    var callback = function callback(keyframe) {
      var start = keyframe.start,
        end = keyframe.end;
      var _ref = keyframe.data,
        url = _ref.url;
      audio.src = url;
      var playCallback = function playCallback() {
        audio.play();
      };
      audio.addEventListener('canplaythrough', playCallback);
      cleanTimeout();
      var cleanAudio = function cleanAudio() {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        cleanTimeout();
        audio.removeEventListener('canplaythrough', playCallback);
      };
      var duration = end - start || 5000;
      timeoutIdRef.current = setTimeout(function () {
        cleanAudio();
      }, duration);
      controller.once('paused', function () {
        cleanAudio();
      });
    };
    controller.on(_VreoUnit.VreoKeyframeEnum.BgMusic, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.BgMusic, callback);
      document.body.removeChild(audio);
      cleanTimeout();
    };
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
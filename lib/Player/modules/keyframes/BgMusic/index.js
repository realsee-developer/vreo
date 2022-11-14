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

var audioList = [];

function getAudio() {
  var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var currentTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var audio = function () {
    var audio = audioList.find(function (audio) {
      return audio.src === src && audio.paused;
    });
    if (audio) return audio;else {
      var newAudio = new Audio(src);
      audioList.push(newAudio);
      return newAudio;
    }
  }();

  audio.currentTime = currentTime;
  audio.setAttribute('playsinline', 'true');
  return audio;
}

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
    var callback = function callback(keyframe, currentTime) {
      console.log({
        currentTime: currentTime
      });
      var start = keyframe.start,
          end = keyframe.end;
      var audio = getAudio(keyframe.data.url, Math.max(currentTime - start, 0));

      var playCallback = function playCallback() {
        audio.play();
      };

      audio.addEventListener('canplaythrough', playCallback);
      cleanTimeout();

      var cleanAudio = function cleanAudio() {
        console.log('cleanAudio', keyframe.start);
        audio.removeEventListener('canplaythrough', playCallback);
        audio.pause();
        cleanTimeout();
      };

      var duration = end - start;
      timeoutIdRef.current = setTimeout(function () {
        console.log('timeout', duration);
        cleanAudio();
      }, duration);
      controller.once('paused', function () {
        cleanAudio();
      });
    };

    controller.on(_VreoUnit.VreoKeyframeEnum.BgMusic, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.BgMusic, callback);
      cleanTimeout();
    };
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
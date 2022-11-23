"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BgMusic = BgMusic;

var React = _interopRequireWildcard(require("react"));

var _Audio = require("../../../../shared-utils/Audio");

var _VreoUnit = require("../../../../typings/VreoUnit");

var _hooks = require("../../../hooks");

var _location$search$matc, _location$search$matc2;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var audioCacheLength = Number((_location$search$matc = (_location$search$matc2 = location.search.match(/audio_cache=(\d+)/)) === null || _location$search$matc2 === void 0 ? void 0 : _location$search$matc2[1]) !== null && _location$search$matc !== void 0 ? _location$search$matc : 5);
(0, _Audio.generateBlankAudio)(audioCacheLength);

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
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keyframe, currentTime) {
        var start, end, audio, play, cleanAudio;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                start = keyframe.start, end = keyframe.end;
                audio = (0, _Audio.getAudio)(keyframe.data.url);
                audio.currentTime = Math.max((currentTime - start) / 1000, 0);
                audio.play();

                play = function play() {
                  return audio.play();
                };

                audio.addEventListener('canplaythrough', play);
                audio.addEventListener('ended', function () {
                  audio.src = '';
                });
                cleanTimeout();

                cleanAudio = function cleanAudio() {
                  audio.removeEventListener('canplaythrough', play);
                  audio.pause();
                  cleanTimeout();
                }; // const duration = end - start
                // audio.addEventListener('ended', cleanAudio)
                // 音频加载会有时间，所以不通过这种方式停止，而是等播完停止
                // timeoutIdRef.current = setTimeout(() => {
                //   cleanAudio()
                // }, duration)


                controller.once('paused', function () {
                  cleanAudio();
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function callback(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    controller.on(_VreoUnit.VreoKeyframeEnum.BgMusic, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.BgMusic, callback);
      cleanTimeout();
    };
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
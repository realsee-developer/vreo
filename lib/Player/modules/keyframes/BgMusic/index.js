"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BgMusic = BgMusic;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var React = _interopRequireWildcard(require("react"));

var _Audio = require("../../../../shared-utils/Audio");

var _VreoUnit = require("../../../../typings/VreoUnit");

var _hooks = require("../../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function BgMusic() {
  var controller = (0, _hooks.useController)();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(keyframe, currentTime) {
        var start, end, _currentTime, audio, cleanAudio, play;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                start = keyframe.start, end = keyframe.end;
                _currentTime = (currentTime - start) / 1000;

                if (!(_currentTime < 0 || _currentTime >= keyframe.end - keyframe.start)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                audio = (0, _Audio.getAudio)(keyframe.data.url);
                audio.currentTime = Math.max(0, _currentTime); // console.log('play', audio.src)
                // const play = () => audio.play()

                audio.play();

                cleanAudio = function cleanAudio() {
                  // audio.removeEventListener('canplaythrough', play)
                  audio.removeEventListener('pause', play);
                  audio.pause();
                  audio.src = ''; // cleanTimeout()
                }; // audio.addEventListener('canplaythrough', play)


                audio.addEventListener('ended', function () {
                  cleanAudio();
                });

                play = function play() {
                  if (audio.realSrc === keyframe.data.url) {
                    // 有可能会被其他音轨打断
                    audio.play();
                  }
                };

                audio.addEventListener('pause', play);
                controller.once('paused', function () {
                  cleanAudio();
                });

              case 12:
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
    };
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
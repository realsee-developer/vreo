import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import { getAudio } from "../../../../shared-utils/Audio.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
import { useController } from "../../../hooks.js";
export function BgMusic() {
  var controller = useController();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(keyframe, currentTime) {
        var start, end, _currentTime, audio, cleanAudio, play;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                audio = getAudio(keyframe.data.url);
                audio.currentTime = Math.max(0, _currentTime);
                // console.log('play', audio.src)
                // const play = () => audio.play()

                audio.play();
                cleanAudio = function cleanAudio() {
                  // audio.removeEventListener('canplaythrough', play)
                  audio.removeEventListener('pause', play);
                  audio.pause();
                  audio.src = '';
                  // cleanTimeout()
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
    controller.on(VreoKeyframeEnum.BgMusic, callback);
    return function () {
      controller.off(VreoKeyframeEnum.BgMusic, callback);
    };
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
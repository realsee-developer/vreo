import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import { CameraMovementPlugin } from "../../../../fivePlugins/CameraMovementPlugin/index.js";
import { CameraMovementEffect } from "../../../../fivePlugins/CameraMovementPlugin/typings.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
import { useController, useFiveInstance } from "../../../hooks.js";
export function CameraMovement() {
  var controller = useController();
  var five = useFiveInstance();
  var ref = React.useRef();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(keyframe) {
        var start, end, data, cameraMovementData, effect;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!ref.current) {
                  ref.current = CameraMovementPlugin(five, {});
                }
                start = keyframe.start, end = keyframe.end, data = keyframe.data;
                cameraMovementData = data;
                effect = cameraMovementData.effect;
                if (!(effect === CameraMovementEffect.Rotate)) {
                  _context.next = 9;
                  break;
                }
                _context.next = 7;
                return ref.current.rotate(data, end - start);
              case 7:
                _context.next = 21;
                break;
              case 9:
                if (!(effect === CameraMovementEffect.Move)) {
                  _context.next = 14;
                  break;
                }
                _context.next = 12;
                return ref.current.move(data, end - start);
              case 12:
                _context.next = 21;
                break;
              case 14:
                if (!(cameraMovementData.panoIndex !== undefined && cameraMovementData.panoIndex !== five.panoIndex)) {
                  _context.next = 19;
                  break;
                }
                _context.next = 17;
                return ref.current.move(data, end - start);
              case 17:
                _context.next = 21;
                break;
              case 19:
                _context.next = 21;
                return ref.current.rotate(data, end - start);
              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function callback(_x) {
        return _ref.apply(this, arguments);
      };
    }();
    controller.on(VreoKeyframeEnum.CameraMovement, callback);
    return function () {
      controller.off(VreoKeyframeEnum.CameraMovement, callback);
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
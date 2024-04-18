"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraMovement = CameraMovement;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var React = _interopRequireWildcard(require("react"));
var _CameraMovementPlugin = require("../../../../fivePlugins/CameraMovementPlugin");
var _typings = require("../../../../fivePlugins/CameraMovementPlugin/typings");
var _VreoUnit = require("../../../../typings/VreoUnit");
var _hooks = require("../../../hooks");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function CameraMovement() {
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();
  var ref = React.useRef();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(keyframe) {
        var start, end, data, cameraMovementData, effect;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!ref.current) {
                  ref.current = (0, _CameraMovementPlugin.CameraMovementPlugin)(five, {});
                }
                start = keyframe.start, end = keyframe.end, data = keyframe.data;
                cameraMovementData = data;
                effect = cameraMovementData.effect;
                if (!(effect === _typings.CameraMovementEffect.Rotate)) {
                  _context.next = 9;
                  break;
                }
                _context.next = 7;
                return ref.current.rotate(data, end - start);
              case 7:
                _context.next = 21;
                break;
              case 9:
                if (!(effect === _typings.CameraMovementEffect.Move)) {
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
    controller.on(_VreoUnit.VreoKeyframeEnum.CameraMovement, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.CameraMovement, callback);
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
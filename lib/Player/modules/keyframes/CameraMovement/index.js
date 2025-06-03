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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function CameraMovement() {
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();
  var ref = React.useRef();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(keyframe) {
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
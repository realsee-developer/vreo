"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraMovement = CameraMovement;

var React = _interopRequireWildcard(require("react"));

var _CameraMovementPlugin = require("../../../../fivePlugins/CameraMovementPlugin");

var _typings = require("../../../../fivePlugins/CameraMovementPlugin/typings");

var _VreoUnit = require("../../../../typings/VreoUnit");

var _hooks = require("../../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function CameraMovement() {
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();
  var ref = React.useRef();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keyframe) {
        var start, end, data, cameraMovementData, effect;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
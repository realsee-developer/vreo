"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeObserver = ResizeObserver;
var _react = _interopRequireDefault(require("react"));
var _addResizeListener = require("../../../shared-utils/addResizeListener");
var _hooks = require("../../hooks");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ResizeObserver() {
  var ref = _react["default"].useRef(null);
  var controller = (0, _hooks.useController)();
  _react["default"].useEffect(function () {
    if (!ref.current) return;
    var resizeElement = controller.container.parentElement;
    if ((0, _addResizeListener.hasResizeListener)(resizeElement)) return;
    var dispose = (0, _addResizeListener.addResizeListener)(resizeElement, function (width, height) {
      controller.setContainerSize(width, height);
    });
    return function () {
      dispose();
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "resizeObserver-element",
    ref: ref
  });
}
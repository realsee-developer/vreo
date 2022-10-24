"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = Drawer;
var React = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _mobxReact = require("mobx-react");
var _hooks = require("../../hooks");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DrawerView = (0, _mobxReact.observer)(function (_ref) {
  var _controller$drawerCon2;
  var controller = _ref.controller;
  var maxHeight = '400px';
  var height = function () {
    var _controller$drawerCon;
    var height = (_controller$drawerCon = controller.drawerConfig) === null || _controller$drawerCon === void 0 ? void 0 : _controller$drawerCon.height;
    if (!height) {
      return 'max-content';
    }
    if (typeof height === 'number') {
      return height + 'px';
    }
    return height;
  }();
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('vreo-drawer', {
      'vreo-drawer-visible': controller.drawerConfig && controller.drawerConfig.content
    }),
    onClick: function onClick() {
      return controller.openDrawer(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-drawer-inner",
    style: {
      height: height,
      maxHeight: maxHeight
    }
  }, ((_controller$drawerCon2 = controller.drawerConfig) === null || _controller$drawerCon2 === void 0 ? void 0 : _controller$drawerCon2.content) || ''));
});
function Drawer() {
  var controller = (0, _hooks.useController)();
  return /*#__PURE__*/React.createElement(DrawerView, {
    controller: controller
  });
}
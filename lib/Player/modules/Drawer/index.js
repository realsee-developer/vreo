"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = Drawer;
var React = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _mobxReact = require("mobx-react");
var _hooks = require("../../hooks");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
var DrawerView = (0, _mobxReact.observer)(function (_ref) {
  var _controller$drawerCon2;
  var controller = _ref.controller;
  var maxHeight = '400px';
  var height = function (_controller$drawerCon) {
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
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopUp = PopUp;
var React = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _mobxReact = require("mobx-react");
var _hooks = require("../../hooks");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
var PopUpView = (0, _mobxReact.observer)(function (_ref) {
  var controller = _ref.controller;
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('vreo-PopUp', {
      'vreo-PopUp-visible': controller.popUp
    }),
    onClick: function onClick() {
      return controller.openPopUp(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-PopUp-inner"
  }, controller.popUp || ''));
});
function PopUp() {
  var controller = (0, _hooks.useController)();
  return /*#__PURE__*/React.createElement(PopUpView, {
    controller: controller
  });
}
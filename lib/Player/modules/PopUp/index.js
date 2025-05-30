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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
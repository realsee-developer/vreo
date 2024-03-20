"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useController = useController;
exports.useFiveInstance = useFiveInstance;
exports.useFiveProject2d = useFiveProject2d;

var _react = _interopRequireDefault(require("react"));

var _Controller = require("./Controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function useController() {
  var controller = _react["default"].useContext(_Controller.ControllerContext);

  if (!controller) {
    throw new Error('没有找到 "ControllerContext"');
  }

  return controller;
}

function useFiveInstance() {
  var controller = useController();

  if (!controller.five) {
    throw new Error('没有找到 "five" 实例');
  }

  return controller.five;
}

function useFiveProject2d() {
  var five = useFiveInstance();
  return function (vector) {
    return five.project2d(vector, false);
  };
}
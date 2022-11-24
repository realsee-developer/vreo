"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _three = require("three");
var transformPositionToVector3 = function transformPositionToVector3(_ref) {
  var x = _ref.x,
    y = _ref.y,
    z = _ref.z;
  return new _three.Vector3(x, y, z);
};
var _default = transformPositionToVector3;
exports["default"] = _default;
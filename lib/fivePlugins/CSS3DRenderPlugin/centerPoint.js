"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = centerPoint;

var _three = require("three");

function centerPoint(point1, point2) {
  return new _three.Vector3((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.z + point2.z) / 2);
}
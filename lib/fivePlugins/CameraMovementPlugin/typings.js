"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rotation = exports.CameraMovementEffect = void 0;

/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
var CameraMovementEffect;
exports.CameraMovementEffect = CameraMovementEffect;

(function (CameraMovementEffect) {
  CameraMovementEffect["Move"] = "Move";
  CameraMovementEffect["Rotate"] = "Rotate";
})(CameraMovementEffect || (exports.CameraMovementEffect = CameraMovementEffect = {}));

var Rotation;
exports.Rotation = Rotation;

(function (Rotation) {
  Rotation["Clockwise"] = "Clockwise";
  Rotation["Anticlockwise"] = "Anticlockwise";
  Rotation["Loop"] = "Loop";
})(Rotation || (exports.Rotation = Rotation = {}));
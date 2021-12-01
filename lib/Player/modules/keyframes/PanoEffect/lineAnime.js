"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = lineAnime;

var THREE = _interopRequireWildcard(require("three"));

var _line = require("@realsee/five/line");

var _BetterTween = require("../../../../shared-utils/animationFrame/BetterTween");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function lineAnime(five, startPoint, endPoint) {
  var pointImage = 'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMAG/Py2baba05un7UgfgAAAHJJREFUKM9joBpgLHVSCRdA4metAoJlCJHmVWBgAeNzroKCCVCBLpjACqgJVjCBxRBT2FbBQQJYQAohsBAsUIUQWA4WiEIILAULeCEEloAFtBACizAEMLRgGIphLabDMJ2O6TlM72MGECIIMQIZIxqoBQCPvpJ/e9FaAAAAAABJRU5ErkJggg==';
  var pointTexture = new THREE.TextureLoader().load(pointImage);
  var color = new THREE.Color(0xffffff);
  var line = new _line.Line();
  line.setMaterial({
    linewidth: 2,
    color: color
  });
  var pointMaterial = line.points.material;
  pointMaterial.map = pointTexture;
  pointMaterial.color.set(color);
  line.line.material.depthTest = false;
  return (0, _BetterTween.tweenProgress)().onUpdate(function (_ref) {
    var progress = _ref.progress;
    var lerpLeft = 0.5 - progress / 2;
    var lerpRight = 0.5 + progress / 2;
    var leftPoint = startPoint.clone().lerp(endPoint, lerpLeft);
    var rightPoint = startPoint.clone().lerp(endPoint, lerpRight);
    line.setPoints(leftPoint, rightPoint);
  }).onStart(function () {
    return five.scene.add(line);
  }).onDispose(function () {
    five.scene.remove(line);
    five.needsRender = true;
  });
}
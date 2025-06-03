"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = lineAnime;
var THREE = _interopRequireWildcard(require("three"));
var _line = require("@realsee/five/line");
var _BetterTween = require("../../../../shared-utils/animationFrame/BetterTween");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
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
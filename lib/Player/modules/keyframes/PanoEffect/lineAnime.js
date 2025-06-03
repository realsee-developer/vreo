import * as THREE from 'three';
import { Line as FiveLine } from '@realsee/five/line';
import { tweenProgress } from "../../../../shared-utils/animationFrame/BetterTween.js";
export default function lineAnime(five, startPoint, endPoint) {
  var pointImage = 'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMAG/Py2baba05un7UgfgAAAHJJREFUKM9joBpgLHVSCRdA4metAoJlCJHmVWBgAeNzroKCCVCBLpjACqgJVjCBxRBT2FbBQQJYQAohsBAsUIUQWA4WiEIILAULeCEEloAFtBACizAEMLRgGIphLabDMJ2O6TlM72MGECIIMQIZIxqoBQCPvpJ/e9FaAAAAAABJRU5ErkJggg==';
  var pointTexture = new THREE.TextureLoader().load(pointImage);
  var color = new THREE.Color(0xffffff);
  var line = new FiveLine();
  line.setMaterial({
    linewidth: 2,
    color: color
  });
  var pointMaterial = line.points.material;
  pointMaterial.map = pointTexture;
  pointMaterial.color.set(color);
  line.line.material.depthTest = false;
  return tweenProgress().onUpdate(function (_ref) {
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
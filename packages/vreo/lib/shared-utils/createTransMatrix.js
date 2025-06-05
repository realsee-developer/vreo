import _construct from "@babel/runtime/helpers/esm/construct";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as THREE from 'three';
export function createTransMatrix(arr1) {
  var matrix4 = new THREE.Matrix4();
  matrix4.fromArray(arr1);
  return function (arr2) {
    var vector3 = _construct(THREE.Vector3, _toConsumableArray(arr2));
    vector3.applyMatrix4(matrix4);
    return vector3.toArray();
  };
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransMatrix = createTransMatrix;
var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var THREE = _interopRequireWildcard(require("three"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function createTransMatrix(arr1) {
  var matrix4 = new THREE.Matrix4();
  matrix4.fromArray(arr1);
  return function (arr2) {
    var vector3 = (0, _construct2["default"])(THREE.Vector3, (0, _toConsumableArray2["default"])(arr2));
    vector3.applyMatrix4(matrix4);
    return vector3.toArray();
  };
}
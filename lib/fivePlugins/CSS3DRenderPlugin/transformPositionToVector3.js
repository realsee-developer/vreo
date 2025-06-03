import { Vector3 } from 'three';
var transformPositionToVector3 = function transformPositionToVector3(_ref) {
  var x = _ref.x,
    y = _ref.y,
    z = _ref.z;
  return new Vector3(x, y, z);
};
export default transformPositionToVector3;
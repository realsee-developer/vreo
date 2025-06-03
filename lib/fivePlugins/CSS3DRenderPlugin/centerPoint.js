import { Vector3 } from 'three';
export default function centerPoint(point1, point2) {
  return new Vector3((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.z + point2.z) / 2);
}
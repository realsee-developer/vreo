import { Vector3 } from 'three'

export default function centerPoint(point1: Vector3, point2: Vector3): Vector3 {
  return new Vector3((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.z + point2.z) / 2)
}

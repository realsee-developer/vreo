import * as THREE from 'three'

export function createTransMatrix(arr1: number[]) {
  const matrix4 = new THREE.Matrix4()
  matrix4.fromArray(arr1)

  return (arr2: number[]) => {
    const vector3 = new THREE.Vector3(...arr2)
    vector3.applyMatrix4(matrix4)
    return vector3.toArray()
  }
}
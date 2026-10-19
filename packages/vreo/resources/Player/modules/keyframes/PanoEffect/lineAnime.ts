import * as THREE from 'three/webgpu'
import { Line2 } from 'three/addons/lines/webgpu/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { Five } from '@realsee/five-webgpu'
import { tweenProgress } from '../../../../shared-utils/animationFrame/BetterTween'

export default function lineAnime(five: Five, startPoint: THREE.Vector3, endPoint: THREE.Vector3) {
  const pointImage = 'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMAG/Py2baba05un7UgfgAAAHJJREFUKM9joBpgLHVSCRdA4metAoJlCJHmVWBgAeNzroKCCVCBLpjACqgJVjCBxRBT2FbBQQJYQAohsBAsUIUQWA4WiEIILAULeCEEloAFtBACizAEMLRgGIphLabDMJ2O6TlM72MGECIIMQIZIxqoBQCPvpJ/e9FaAAAAAABJRU5ErkJggg=='
  const pointTexture = new THREE.TextureLoader().load(pointImage)
  const lineGeometry = new LineGeometry()
  const lineMaterial = new THREE.Line2NodeMaterial({ color: 0xffffff, linewidth: 2, depthTest: false })
  const line = new Line2(lineGeometry, lineMaterial)
  const pointGeometry = new THREE.BufferGeometry()
  const pointMaterial = new THREE.PointsNodeMaterial({ color: 0xffffff, map: pointTexture, transparent: true })
  const points = new THREE.Points(pointGeometry, pointMaterial)
  const group = new THREE.Group()
  group.add(line, points)
  const setPoints = (left: THREE.Vector3, right: THREE.Vector3) => {
    const positions = [...left.toArray(), ...right.toArray()]
    lineGeometry.setPositions(positions)
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  }
  setPoints(startPoint, endPoint)
  return tweenProgress()
    .onUpdate(({ progress }) => {
      setPoints(startPoint.clone().lerp(endPoint, 0.5 - progress / 2), startPoint.clone().lerp(endPoint, 0.5 + progress / 2))
      five.needsRender = true
    })
    .onStart(() => five.scene.add(group))
    .onDispose(() => {
      five.scene.remove(group)
      lineGeometry.dispose(); lineMaterial.dispose(); pointGeometry.dispose(); pointMaterial.dispose(); pointTexture.dispose()
      five.needsRender = true
    })
}

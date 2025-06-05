import * as THREE from 'three'
import { Five } from '@realsee/five'
import { Line as FiveLine } from '@realsee/five/line'
import { tweenProgress } from '../../../../shared-utils/animationFrame/BetterTween'

export default function lineAnime(five: Five, startPoint: THREE.Vector3, endPoint: THREE.Vector3) {
  const pointImage =
    'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMAG/Py2baba05un7UgfgAAAHJJREFUKM9joBpgLHVSCRdA4metAoJlCJHmVWBgAeNzroKCCVCBLpjACqgJVjCBxRBT2FbBQQJYQAohsBAsUIUQWA4WiEIILAULeCEEloAFtBACizAEMLRgGIphLabDMJ2O6TlM72MGECIIMQIZIxqoBQCPvpJ/e9FaAAAAAABJRU5ErkJggg=='
  const pointTexture = new THREE.TextureLoader().load(pointImage)
  const color = new THREE.Color(0xffffff) as any
  const line = new FiveLine()
  line.setMaterial({ linewidth: 2, color })
  const pointMaterial = line.points.material as THREE.PointsMaterial
  pointMaterial.map = pointTexture
  pointMaterial.color.set(color)
  line.line.material.depthTest = false
  return tweenProgress()
    .onUpdate(({ progress }) => {
      const lerpLeft = 0.5 - progress / 2
      const lerpRight = 0.5 + progress / 2
      const leftPoint = startPoint.clone().lerp(endPoint, lerpLeft)
      const rightPoint = startPoint.clone().lerp(endPoint, lerpRight)
      line.setPoints(leftPoint, rightPoint)
    })
    .onStart(() => five.scene.add(line))
    .onDispose(() => {
      five.scene.remove(line)
      five.needsRender = true
    })
}

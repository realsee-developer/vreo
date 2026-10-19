import * as React from 'react'
import * as THREE from 'three/webgpu'
import { createRoot } from 'react-dom/client'
import { Vector3, Quaternion } from 'three/webgpu'

import { useController, useFiveInstance } from '../../../hooks'
import { CSS3DRenderPlugin } from '../../../../fivePlugins/CSS3DRenderPlugin'
import { PanoTextLabelData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

/**
 * 通过传入中心点确定矩形框架容器的四个点：
 *  1. 已知矩形长宽和中心点
 *  2. 借助planeGeometry生成垂直相机视角的平面上的四个点
 *  3. 通过向量相加，平行四边形法则获取到移动position后的面上四个点
 */
const calcPoints = (
  centerPoint: Vector3,
  normal: THREE.Vector3 | undefined,
  wrapperLength: number,
  wrapperWidth: number
) => {
  // 375px 对应 1m
  const length = wrapperLength / 375
  const width = wrapperWidth / 375

  const geometry = new THREE.PlaneGeometry(length, width)
  if (normal) {
    const lookPoint = new THREE.Vector3(normal.x + centerPoint.x, normal.y + centerPoint.y, normal.z + centerPoint.z)
    geometry.lookAt(lookPoint)
  }
  // const pointgeometry = new THREE.Geometry()
  // pointgeometry.vertices.push(cameraPosition)
  // const pointmaterial = new THREE.PointsMaterial({
  //   color: 0xffffff,
  //   size: 0.4,
  // })
  // _point = new THREE.Points(pointgeometry, pointmaterial)
  // console.log(cameraPosition)

  const positions = geometry.getAttribute('position')
  const point = (index: number) => centerPoint.clone().add(
    new THREE.Vector3().fromBufferAttribute(positions, index),
  )
  // PlaneGeometry positions: 左上、右上、左下、右下。
  return [point(2), point(3), point(1), point(0)]
}

/**
 * 空间文本标签。
 */
export function PanoTextLabel() {
  const controller = useController()
  const five = useFiveInstance()
  const ref = React.useRef<ReturnType<typeof CSS3DRenderPlugin> | undefined>(undefined)

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.PanoTextLabel === false) {
      return
    }
    const labels = new Set<() => void>()
    const clearLabels = () => {
      for (const dispose of [...labels]) dispose()
    }
    const removePlaybackCleanup = controller.playback.add(clearLabels)
    const callback = (keyframe: VreoKeyframe, currentTime = keyframe.start) => {
      const { end, data } = keyframe
      const panoTextLabelData = data as PanoTextLabelData
      // 增加无文本情况的判断
      if (data.text === '') return

      const { x, y, z } = panoTextLabelData.vertex
      const centerPoint = new Vector3(x, y, z)
      const normal = new Vector3(panoTextLabelData.normal?.x, panoTextLabelData.normal?.y, panoTextLabelData.normal?.z)
      // 生成传入的四个点，将文本框最大宽度定在200px，最高高度在30px
      const wrapperLength = 200
      const wrapperWidth = 30
      const points = calcPoints(centerPoint, panoTextLabelData.normal && normal, wrapperLength, wrapperWidth)

      if (!ref.current) ref.current = CSS3DRenderPlugin(five)
      const container = ref.current.create3DDomContainer(points)
      const css3DObject = container?.css3DObject
      // 将获取的mesh进行旋转操作，根据欧拉角去进行mesh的变换
      if (data.quaternion) {
        const quaternion = new Quaternion(data.quaternion.x, data.quaternion.y, data.quaternion.z, data.quaternion.w)
        css3DObject?.quaternion.copy(quaternion)
      }
      if (!container?.container) return
      const root = createRoot(container.container)
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disposed = false
      const dispose = () => {
        if (disposed) return
        disposed = true
        if (timeout !== undefined) clearTimeout(timeout)
        labels.delete(dispose)
        container.dispose()
        // The parent player can unmount this component during its own React
        // cleanup. Release the CSS3D layer now, then unmount this nested root.
        queueMicrotask(() => root.unmount())
      }
      labels.add(dispose)
      root.render(
        <div className="PanoTextLabel PanoTextLabel--notHidden">
          <div className="PanoTextLabel-wrapper">
            <div style={{ fontSize: `${data.fontSize || 16}px` }} className="PanoText-innerText">
              {data.text || ''}
            </div>
          </div>
        </div>
      )
      timeout = setTimeout(dispose, Math.max(0, end - currentTime))
    }
    controller.on(VreoKeyframeEnum.PanoTextLabel, callback)

    return () => {
      controller.off(VreoKeyframeEnum.PanoTextLabel, callback)
      removePlaybackCleanup()
      clearLabels()
      ref.current = undefined
    }
  }, [controller])

  return <></>
}

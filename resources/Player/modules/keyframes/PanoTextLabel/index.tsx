import * as React from 'react'
import * as THREE from 'three'
import ReactDOM from 'react-dom'
import { Vector3, Quaternion } from 'three'

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

  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)
  const v0 = centerPoint.clone()
  plane.position.copy(v0)

  // 计算传入的四个点的坐标
  const [v1, v2, v3, v4] = plane.geometry.vertices
  const downLeft = v0.clone().add(v4)
  const downRight = v0.clone().add(v3)
  const upLeft = v0.clone().add(v2)
  const upRight = v0.clone().add(v1)

  // 插件使用要求：矩形四个点位数据，顺序为**必须**为左下、右下、右上、左上
  return [downLeft, downRight, upRight, upLeft]
}

/**
 * 空间文本标签。
 */
export function PanoTextLabel() {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()
  const controller = useController()
  const five = useFiveInstance()
  const ref = React.useRef<ReturnType<typeof CSS3DRenderPlugin>>()

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.PanoTextLabel === false) {
      return
    }
    const callback = (keyframe: VreoKeyframe) => {
      const { start, end, data } = keyframe
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
      if (container?.container)
        ReactDOM.render(
          <div className="PanoTextLabel PanoTextLabel--notHidden">
            <div className="PanoTextLabel-wrapper">
              <div style={{ fontSize: `${data.fontSize || 16}px` }} className="PanoText-innerText">
                {data.text || ''}
              </div>
            </div>
          </div>,
          container?.container
        )

      timeoutRef.current = setTimeout(() => {
        ref.current?.disposeAll()
      }, end - start)
    }
    controller.on(VreoKeyframeEnum.PanoTextLabel, callback)

    return () => {
      controller.off(VreoKeyframeEnum.PanoTextLabel, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

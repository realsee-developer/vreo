import * as React from 'react'
import * as THREE from 'three'
import { useController, useFiveInstance } from '../../../hooks'
import { ModelTVVideoPlugin } from '../../../../fivePlugins/ModelTVVideoPlugin'
import { createTransMatrix } from '../../../../shared-utils/createTransMatrix'
import { ModelVideoData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

export function ModelVideo() {
  const controller = useController()
  const five = useFiveInstance()
  const ref = React.useRef<ReturnType<typeof ModelTVVideoPlugin>>()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()

  React.useEffect(() => {
    const callback = async (keyframe: VreoKeyframe) => {
      if (!ref.current) {
        ref.current = ModelTVVideoPlugin(five, {})
      }
      const { start, end } = keyframe
      const { videoSrc, videoPosterSrc, vertexs, matrixWorld } = keyframe.data as ModelVideoData

      const position = (() => {
        if (vertexs.length < 4) {
          throw new Error('ModelVideo: 顶点数据集合不够，无法组成矩形 ....')
        }
        if (vertexs.length === 4) {
          return vertexs
        }

        const box = new THREE.Box3()
        vertexs.forEach((v) => box.expandByPoint(new THREE.Vector3(v.x, v.y, v.z)))
        return [
          new THREE.Vector3(box.min.x, box.max.y, box.max.z),
          new THREE.Vector3(box.min.x, box.min.y, box.max.z),
          new THREE.Vector3(box.max.x, box.min.y, box.max.z),
          new THREE.Vector3(box.max.x, box.max.y, box.max.z),
        ]
      })()

      const points = (() => {
        if (matrixWorld) {
          const transMatrix = createTransMatrix(matrixWorld)
          return [
            position.map((p) => {
              const res = transMatrix([p.x, p.y, p.z])
              return { x: res[0], y: res[1], z: res[2] }
            }),
          ]
        }
        return [position]
      })()

      ref.current.disable()
      await ref.current.load(
        {
          video_src: videoSrc,
          video_poster_src: videoPosterSrc,
          points,
        },
        controller.configs?.videos?.modelTVVideo
      )

      ref.current.enable()
      timeoutRef.current = setTimeout(() => ref.current?.disable(), end - start)
    }

    controller.on(VreoKeyframeEnum.ModelVideo, callback)
    return () => {
      controller.off(VreoKeyframeEnum.ModelVideo, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

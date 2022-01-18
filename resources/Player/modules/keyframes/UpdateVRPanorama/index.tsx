import * as React from 'react'
import { parseWork, WorkCubeImage } from '@realsee/five'
import { useController, useFiveInstance } from '../../../hooks'
import { UpdateVRPanoramaData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

export function UpdateVRPanorama() {
  const controller = useController()
  const five = useFiveInstance()

  React.useEffect(() => {
    const callback = (keyframe: VreoKeyframe) => {
      const { panoIndex, images, work } = keyframe.data as UpdateVRPanoramaData

      if (work) {
        five.load(work)
        return
      }

      console.warn('not support.')
      Object.keys(images).forEach((_key) => {
        const key = _key as keyof WorkCubeImage
        images[key] = images[key].replace(/https*:\/\//, '//')
      })
      const newWorkJSON = JSON.parse(JSON.stringify(five.work?.raw.work))

      // // 原Work数据不能被修改
      if (newWorkJSON.panorama && newWorkJSON.panorama.list && newWorkJSON.panorama.list[panoIndex]) {
        Object.assign(newWorkJSON.panorama.list[panoIndex], images)
      } else if (newWorkJSON.observers && newWorkJSON.observers[panoIndex] && newWorkJSON.observers[panoIndex].images) {
        Object.assign(newWorkJSON.observers[panoIndex].images, images)
      }

      const newWork = parseWork(newWorkJSON)

      // // 需要还原么？待定 ...
      five.load(newWork)
    }

    controller.on(VreoKeyframeEnum.UpdateVRPanorama, callback)
    return () => {
      controller.off(VreoKeyframeEnum.UpdateVRPanorama, callback)
    }
  }, [controller])

  return <></>
}

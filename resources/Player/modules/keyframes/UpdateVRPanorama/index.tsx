import * as React from 'react'
import { parseWork, Work } from '@realsee/five'
import { useController, useFiveInstance } from '../../../hooks'
import { UpdateVRPanoramaData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

export function UpdateVRPanorama() {
  const controller = useController()
  const five = useFiveInstance()
  const rawRef = React.useRef<string[] | null>(null)
  const workRef = React.useRef<Work | null>(null)

  const restoreCallback = React.useCallback(() => {
    if (rawRef.current) {
      const work = parseWork(rawRef.current)
      five.load(work)
    }
   
    workRef.current = null
  }, [])

  const pausedCallback = React.useCallback(() => {
    if (rawRef.current) {
      const work = parseWork(rawRef.current)
      five.load(work)
    }
  }, [])

  const playingCallback = React.useCallback(() => {
    if (!workRef.current) {
      return
    }
    five.load(workRef.current)
  }, [])

  React.useEffect(() => {
    const callback = (keyframe: VreoKeyframe) => {
      if (!rawRef.current) {
        rawRef.current = five.work.raw.works
      }

      const data = keyframe.data as UpdateVRPanoramaData

      // 如果数据中有新 work 数据，则直接载入
      if (data.work) {
        workRef.current = parseWork(data.work)
        five.load(workRef.current)
        return
      }

      const lastRawWork = five.work?.raw.works[0]

      // 动态场景：不提供完成的签名数据，需重新整理
      if (data.dynamic_scene && !data.panorama) {
        const lastWork = JSON.parse(lastRawWork)
        const panorama = lastWork.panorama
        const index = data.dynamic_scene.images.index
        panorama.list[index] = data.dynamic_scene.images
        data.panorama = panorama
        delete data.dynamic_scene
      }

      workRef.current = parseWork([lastRawWork, data])
      five.load(workRef.current)
    }

    controller.on(VreoKeyframeEnum.UpdateVRPanorama, callback)

    // 离开 将之前的内容清空
    controller.on(VreoKeyframeEnum.Exit, restoreCallback)
  
    // 新载入数据 将之前的内容清空
    controller.on('loaded', restoreCallback)

    // 暂停 回到默认状态
    controller.on('paused', pausedCallback)
    // 播放 回归暂停前状态
    controller.on('playing', playingCallback)

    return () => {
      // 清理事件监听
      controller.off(VreoKeyframeEnum.UpdateVRPanorama, callback)
      controller.off(VreoKeyframeEnum.Exit, restoreCallback)
      controller.off('loaded', restoreCallback)
      controller.off('paused', pausedCallback)
      controller.off('playing', playingCallback)
    }
  }, [controller])

  return <></>
}

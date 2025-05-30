import * as React from 'react'
import { parseWork, Work } from '@realsee/five'
import { useController, useFiveInstance } from '../../../hooks'
import { UpdateVRPanoramaData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

export function UpdateVRPanorama() {
  const controller = useController()
  const five = useFiveInstance()
  const deafultWorkRef = React.useRef<string[] | null>(null)
  const updateWorkRef = React.useRef<Work | null>(null)

  // 恢复默认 VR
  const restoreCallback = React.useCallback(() => {
    // 先清理掉 之前的 VR 数据备份
    updateWorkRef.current = null

    if (deafultWorkRef.current) {
      const work = parseWork(deafultWorkRef.current)
      five.load(work)
    }
   
  }, [])

  // 暂停时： 恢复默认 VR 
  const pausedCallback = React.useCallback(() => {
    if (deafultWorkRef.current) {
      const work = parseWork(deafultWorkRef.current)
      Object.assign(window, {$rawWork: work})
      five.load(work)
    }
  }, [])

  // 播放时：如果暂停前有更新 VR 需要还原
  const playingCallback = React.useCallback(() => {
    if (!updateWorkRef.current) {
      return
    }
    five.load(updateWorkRef.current)
  }, [])

  React.useEffect(() => {
    const callback = (keyframe: VreoKeyframe) => {
      if (!deafultWorkRef.current && five.work?.raw.works) {
        deafultWorkRef.current = five.work.raw.works
      }

      const data = keyframe.data as UpdateVRPanoramaData

      // 如果数据中有新 work 数据，则直接载入
      if (data.work) {
        updateWorkRef.current = parseWork(data.work)
        five.load(updateWorkRef.current)
        return
      }

      const lastRawWork = five.work?.raw.works?.[0]
      if (!lastRawWork) {
        console.warn('No raw work data available')
        return
      }

      // 动态场景：不提供完成的签名数据，需重新整理
      if (data.dynamic_scene && !data.panorama) {
        const lastWork = JSON.parse(lastRawWork)
        const panorama = lastWork.panorama
        const index = data.dynamic_scene.images.index
        panorama.list[index] = data.dynamic_scene.images
        data.panorama = panorama
        delete data.dynamic_scene
      }

      Object.assign(window, {$work1: JSON.parse(lastRawWork), $work2: data, parseWork: parseWork})

      updateWorkRef.current = parseWork([lastRawWork, data])
      five.load(updateWorkRef.current)
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
  }, [])

  return <></>
}

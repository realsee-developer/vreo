/**
 * @fileoverview VR 全景图更新关键帧组件
 * 
 * 处理 VR 全景图的动态更新逻辑，支持：
 * 1. 动态场景图片替换
 * 2. 完整全景数据替换
 * 3. 播放状态的数据切换管理
 */

import * as React from 'react'
import { parseWork, Work } from '@realsee/five'
import { useController, useFiveInstance } from '../../../hooks'
import { UpdateVRPanoramaData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

/**
 * VR 全景图更新组件
 * 
 * 这个组件负责处理播放过程中的 VR 全景图动态更新。
 * 主要功能包括：
 * - 保存和恢复默认 VR 数据
 * - 处理动态场景图片替换
 * - 管理播放/暂停状态下的数据切换
 * 
 * @component
 * @example
 * ```tsx
 * // 在播放器中自动使用，无需手动调用
 * <UpdateVRPanorama />
 * ```
 */
export function UpdateVRPanorama() {
  const controller = useController()
  const five = useFiveInstance()
  
  // 保存默认的 VR Work 数据（原始状态）
  const defaultWorkRef = React.useRef<string[] | null>(null)
  
  // 保存更新后的 VR Work 数据（修改状态）
  const updateWorkRef = React.useRef<Work | null>(null)

  /**
   * 恢复到默认 VR 状态的回调函数
   * 
   * 在以下情况下被调用：
   * - 退出当前剧本
   * - 加载新的剧本数据
   * - 需要清除临时的 VR 修改
   */
  const restoreCallback = React.useCallback(() => {
    // 清理临时的更新数据
    updateWorkRef.current = null

    // 如果有默认数据，则恢复到默认状态
    if (defaultWorkRef.current) {
      const work = parseWork(defaultWorkRef.current)
      five.load(work)
    }
  }, [])

  /**
   * 暂停时的回调函数
   * 
   * 暂停时恢复到默认 VR 状态，确保用户看到的是原始场景。
   * 这样可以避免暂停时显示临时修改的场景，提供更好的用户体验。
   */
  const pausedCallback = React.useCallback(() => {
    if (defaultWorkRef.current) {
      const work = parseWork(defaultWorkRef.current)
      // 将工作数据暴露到全局（用于调试）
      Object.assign(window, {$rawWork: work})
      five.load(work)
    }
  }, [])

  /**
   * 播放时的回调函数
   * 
   * 播放时如果有更新的 VR 数据，则恢复到更新后的状态。
   * 这确保了播放/暂停之间的状态一致性。
   */
  const playingCallback = React.useCallback(() => {
    if (!updateWorkRef.current) {
      return
    }
    five.load(updateWorkRef.current)
  }, [])

  React.useEffect(() => {
    /**
     * UpdateVRPanorama 关键帧处理函数
     * 
     * 这是核心的业务逻辑，处理两种类型的 VR 更新：
     * 1. 完整的 work 数据替换
     * 2. 动态场景的部分图片替换
     */
    const callback = (keyframe: VreoKeyframe) => {
      // 首次运行时，保存默认的 VR 数据作为备份
      if (!defaultWorkRef.current && five.work?.raw?.works) {
        defaultWorkRef.current = five.work.raw.works
      }

      const data = keyframe.data as UpdateVRPanoramaData

      // 情况1：直接替换完整的 work 数据
      // 这种情况下，关键帧数据包含完整的新场景配置
      if (data.work) {
        updateWorkRef.current = parseWork(data.work)
        five.load(updateWorkRef.current)
        return
      }

      // 获取当前的原始工作数据
      const lastRawWork = five.work?.raw?.works?.[0]
      if (!lastRawWork) {
        console.warn('No raw work found')
        return
      }

      // 情况2：动态场景的部分替换
      // 当有动态场景数据但没有完整全景数据时，需要进行数据合并
      if (data.dynamic_scene && !data.panorama) {
        // 解析当前的工作数据
        const lastWork = JSON.parse(lastRawWork)
        const panorama = lastWork.panorama
        
        // 获取要替换的图片索引
        const index = data.dynamic_scene.images.index
        
        // 将新的图片数据替换到指定位置
        panorama.list[index] = data.dynamic_scene.images
        
        // 更新关键帧数据，使用合并后的全景数据
        data.panorama = panorama
        
        // 清除临时的动态场景数据，避免重复处理
        delete data.dynamic_scene
      }

      // 调试信息：将处理过程中的数据暴露到全局对象
      Object.assign(window, {
        $work1: JSON.parse(lastRawWork),  // 原始工作数据
        $work2: data,                     // 关键帧数据
        parseWork: parseWork              // 解析函数
      })

      // 合并原始数据和关键帧数据，生成新的工作配置
      updateWorkRef.current = parseWork([lastRawWork, data])
      five.load(updateWorkRef.current)
    }

    // 注册关键帧事件监听器
    controller.on(VreoKeyframeEnum.UpdateVRPanorama, callback)

    // 注册状态管理事件监听器
    controller.on(VreoKeyframeEnum.Exit, restoreCallback)      // 退出时恢复默认状态
    controller.on('loaded', restoreCallback)                   // 新数据加载时清理
    controller.on('paused', pausedCallback)                    // 暂停时恢复默认状态
    controller.on('playing', playingCallback)                  // 播放时恢复更新状态

    // 清理函数：组件卸载时移除所有事件监听器
    return () => {
      controller.off(VreoKeyframeEnum.UpdateVRPanorama, callback)
      controller.off(VreoKeyframeEnum.Exit, restoreCallback)
      controller.off('loaded', restoreCallback)
      controller.off('paused', pausedCallback)
      controller.off('playing', playingCallback)
    }
  }, [])

  // 这是一个无渲染组件，仅处理逻辑
  return <></>
}

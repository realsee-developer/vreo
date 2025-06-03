/**
 * @fileoverview 相机运动关键帧组件
 * 
 * 处理 VR 场景中的相机运动动画，包括：
 * - 相机旋转动画
 * - 相机移动动画（含点位切换）
 * - 智能动画类型识别
 */

import * as React from 'react'
import { CameraMovementPlugin } from '../../../../fivePlugins/CameraMovementPlugin'
import { CameraMovementEffect, MoveArgs, RotateArgs } from '../../../../fivePlugins/CameraMovementPlugin/typings'
import { CameraMovementData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController, useFiveInstance } from '../../../hooks'

/**
 * 相机运动组件
 * 
 * 这个组件负责处理播放过程中的相机运动关键帧。
 * 根据关键帧数据自动选择合适的动画类型：
 * - 显式指定的旋转/移动效果
 * - 基于点位切换的智能判断
 * - 默认的旋转动画
 * 
 * @component
 * @example
 * ```tsx
 * // 在播放器中自动使用，无需手动调用
 * <CameraMovement />
 * ```
 */
export function CameraMovement() {
  const controller = useController()
  const five = useFiveInstance()
  
  // 缓存相机运动插件实例，避免重复创建
  const ref = React.useRef<ReturnType<typeof CameraMovementPlugin>>()

  React.useEffect(() => {
    /**
     * 相机运动关键帧处理函数
     * 
     * 这是相机运动的核心逻辑，根据关键帧数据智能选择动画类型：
     * 1. 优先使用显式指定的效果类型
     * 2. 如果涉及点位切换，则执行移动动画
     * 3. 默认执行旋转动画
     */
    const callback = async (keyframe: VreoKeyframe) => {
      // 延迟初始化插件实例，避免不必要的创建
      if (!ref.current) {
        ref.current = CameraMovementPlugin(five, {})
      }
      
      const { start, end, data } = keyframe
      const cameraMovementData = data as CameraMovementData
      const effect = cameraMovementData.effect
      
      // 计算动画持续时间（毫秒）
      const duration = end - start
      
      // 情况1：显式指定旋转效果
      if (effect === CameraMovementEffect.Rotate) {
        await ref.current.rotate(data as RotateArgs, duration)
      } 
      // 情况2：显式指定移动效果
      else if (effect === CameraMovementEffect.Move) {
        await ref.current.move(data as MoveArgs, duration)
      } 
      // 情况3：智能判断 - 涉及点位切换时使用移动动画
      else if (cameraMovementData.panoIndex !== undefined && cameraMovementData.panoIndex !== five.panoIndex) {
        // 当目标点位与当前点位不同时，执行移动动画（包含点位切换）
        await ref.current.move(data as MoveArgs, duration)
      } 
      // 情况4：默认情况 - 执行旋转动画
      else {
        // 在同一点位内的视角调整，使用旋转动画
        await ref.current.rotate(data as RotateArgs, duration)
      }
    }

    // 注册相机运动关键帧监听器
    controller.on(VreoKeyframeEnum.CameraMovement, callback)
    
    // 清理函数：组件卸载时移除事件监听器
    return () => {
      controller.off(VreoKeyframeEnum.CameraMovement, callback)
    }
  }, [controller])
  
  // 这是一个无渲染组件，仅处理逻辑
  return <></>
}

/**
 * @fileoverview 相机运动关键帧组件
 *
 * 处理 VR 场景中的相机运动动画，包括：
 * - 相机旋转动画
 * - 相机移动动画（含点位切换）
 * - 智能动画类型识别
 */
import * as React from 'react';
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
export declare function CameraMovement(): React.JSX.Element;

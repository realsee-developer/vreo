/**
 * @fileoverview VR 全景图更新关键帧组件
 *
 * 处理 VR 全景图的动态更新逻辑，支持：
 * 1. 动态场景图片替换
 * 2. 完整全景数据替换
 * 3. 播放状态的数据切换管理
 */
import * as React from 'react';
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
export declare function UpdateVRPanorama(): React.JSX.Element;

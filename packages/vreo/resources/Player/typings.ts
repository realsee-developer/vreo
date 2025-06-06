import React, { ReactNode } from 'react';
import { Subscribe, Five } from '@realsee/five';

import { VreoKeyframe, VreoKeyframeConfigMap, VreoKeyframeEvent } from '../typings/VreoUnit'
import { VideoAgentMeshOptions } from './modules/VideoAgent/VideoAgentMesh';
import { Overwrite } from '@realsee/dnalogel/libs/typings/utils.type';

export interface PlayerConfigs {
/**
 * @deprecated rename to container
 */
  containter?: Element
  container?: Element
  keyframeMap: VreoKeyframeConfigMap
  /**
   * 微信端自动播放功能实现需要提前初始化 Video 实例。
   *
   * 如果需要支持微信浏览器端自动播放需要接入微信SDK及提前初始化好相关 Video 实例。
   */
  videos?: {
    videoEffect?: HTMLVideoElement
    modelTVVideo?: HTMLVideoElement
    videoPanel?: HTMLVideoElement
  }

  videoAgentMeshOptions?: VideoAgentMeshOptions
  /**
   * 如果需要在 底部面板添加自定义内容，可以传递个 React 组件。
   */
  customPanelChildren?: ReactNode
  customKeyframes?: React.FC<CustomVreoKeyframeProps>[]
  imageOptions?: { size: number }
  autoPreload?: boolean
  appSize?: AppSize
  appearance?: Appearance
  /**
   * @description: 波浪UI 静态资源前缀
   */
  waveStaticPrefix?: string
  onAvatarClick?: () => any
  onWaveClick?: () => any
}

export type AppSize = 'S' | 'M' | 'L' | 'XL'

export type WaveAppearance = 'single' | 'double' | 'solid' | 'swap' | 'expand'

export interface Appearance {
  waveStyle?: 'wave' | 'solid'
}

export type VreoSubscribe = Pick<Subscribe<VreoKeyframeEvent>, 'on' | 'once' | 'off'>

export interface CustomVreoKeyframeProps {
  subscribe: Pick<Subscribe<{[key: string]: (data: VreoKeyframe, currentTime: number) => any}>, 'on' | 'once' | 'off'>
  five: Five
}
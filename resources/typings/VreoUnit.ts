import { Mode, Pose } from '@realsee/five'
import { CameraMovementEffect, Rotation } from '../fivePlugins/CameraMovementPlugin/typings'

export enum VreoKeyframeEnum {
  /** 运镜 */
  CameraMovement = 'CameraMovement',
  /**
   * 全景标签
   */
  PanoTag = 'PanoTag',
  /**
   * 全景文本标签
   */
  PanoTextLabel = 'PanoTextLabel',
  /**
   * 提词器
   */
  Prompter = 'Prompter',
  /**
   * 更新 VR 全景
   */
  UpdateVRPanorama = 'UpdateVRPanorama',
  /**
   * 视频广告
   */
  ModelVideo = 'ModelVideo',
  /**
   * 全景特效
   */
  PanoEffect = 'PanoEffect',
  /**
   * 信息面板
   */
  InfoPanel = 'InfoPanel',
  /**
   * 视频特效
   */
  VideoEffect = 'VideoEffect',
  /**
   * 背景音乐
   */
  BgMusic = 'BgMusic',
  /**
   * 结束
   */
  Exit = 'Exit',
  /**
   * 自定义剧本帧
   */
  Custom = 'Custom',
}

/**
 * 支持自定义剧本关键帧配置项
 */
export type VreoKeyframeConfigMap = {
  PanoTag?: false
  PanoTextLabel?: false
  Prompter?: false
  InfoPanel?: false
}


/**
 * 剧本关键帧
 */
export interface VreoKeyframe {
  uuid: string
  type: VreoKeyframeEnum
  start: number
  end: number
  parsed?: boolean
  data: Record<string, any>
}

/**
 * 虚拟视频角色
 */
export interface VreoVideo {
  duration: number
  start: number
  end: number
  url: string
}

/**
 * 剧本结构
 */
export interface VreoUnit {
  categoryId: string
  categoryText: string
  frontRequestId: string
  index: string | number
  keyframes: VreoKeyframe[]
  video: VreoVideo
}



/**
 * 剧本事件
 */
export type VreoKeyframeEvent = { [key in VreoKeyframeEnum]: (keyframe: VreoKeyframe) => void } & {
  // 新数据载入完成
  loaded: (vreoUnit: VreoUnit) => void
  // 语音状态 播放 -> 暂停
  paused: () => void
  // 语音状态 暂停 -> 播放
  playing: () => void
  // 未知的 剧本帧类型
  unknownKeyframeType: (keyframe: Record<string, any>) => void
}

/**
 * 相机运动
 */
export type CameraMovementData = {
  effect: CameraMovementEffect
  mode: Mode
  panoIndex: number
  loop?: boolean
  rotateSpeed?: number
  rotation?: Rotation
} & Partial<Pose>

/**
 * 提词器
 */
export type PrompterData = {
  text: string
}

/**
 * VR 全景切换
 */
export type UpdateVRPanoramaData = {
  _signature: string
  allow_hosts: string[]
  certificate: string
  expire_at: string
  // 动态场景
  dynamic_scene?: {
    images: {
      index: number
      right: string
      left: string
      up: string
      down: string
      front: string
      back: string
    }
  }
  [key: string]: any
}

/**
 * 顶点
 */
export interface Vertex {
  x: number
  y: number
  z: number
}

/**
 * 四个顶点元组
 */
export type QuadrangleVertexs = [Vertex, Vertex, Vertex, Vertex]

/**
 * 视频广告
 */
export type ModelVideoData = {
  /**
   * 视频素材
   */
  videoSrc: string
  /**
   * 视频封面
   */
  videoPosterSrc: string
  /**
   * 视频映射在模型中的顶点
   */
  vertexs: QuadrangleVertexs
}

/**
 * 全景文本标签
 */
export type PanoTextLabelData = {
  text: string
  vertex: Vertex
  fontSize?: number
}

/**
 * 全景标签枚举
 */
export enum PanoTagEnum {
  Text = 'Text',
  Image = 'Image',
}

export type PanoTagData = {
  type: PanoTagEnum
  text: string
  vertex: Vertex
  imgUrl?: string
}

/**
 * 全景特效枚举
 */
export enum PanoEffectEnum {
  /**
   * 两点距离
   */
  Distance = 'Distance',
}

/**
 * 全景特效
 */
export type PanoEffectData = {
  effect: PanoEffectEnum
  twoVertexs: [Vertex, Vertex]
}

/**
 * 信息面板类型枚举
 */
export enum InfoPanelTypeEnum {
  Image = 'Image',
  Video = 'Video',
}

export enum InfoPanelStyleEnum {
  Drawer = 'Drawer',
  PopUp = 'PopUp',
}

/**
 * 信息面板
 */
export type InfoPanelData = {
  type: InfoPanelTypeEnum
  style?: InfoPanelStyleEnum
  url: string
  // 标题
  title?: string
  // 副标题
  subTitle?: string
}

/**
 * 视频特效
 */
export type VideoEffectData = {
  videoSrc: string
  panoIndex: number
  fov: number
  direction?: Vertex
  vector?: Pick<Pose, 'longitude' | 'latitude'>
}

/**
 * 背景音乐
 */
export type BgMusicData = {
  url: string
}

/** 自定义序列帧 */
export type CustomData = Record<string, any>

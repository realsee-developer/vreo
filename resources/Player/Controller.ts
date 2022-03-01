import { Five, Subscribe } from '@realsee/five'
import { action, computed, makeObservable, observable, reaction } from 'mobx'
import * as React from 'react'
import { requestAnimationFrameInterval } from '../shared-utils/animationFrame'
import { VreoKeyframe, VreoKeyframeEnum, VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'
import { VideoAgentScene } from './modules/VideoAgent/VideoAgentScene'
import { PlayerConfigs } from './typings'

/**
 * 逻辑控制器：内部状态。
 */
export class Controller extends Subscribe<VreoKeyframeEvent> {

  $five?: Five
  configs?: PlayerConfigs
  videoAgentScene?: VideoAgentScene
  vreoUnit?: VreoUnit
  stopInterval?: () => void
  playing = false

  visible = false

  get isAudio() {
    return !this.videoAgentScene?.videoAgentMesh.videoUrl?.endsWith('.mp4')
  }

  popUp: string | JSX.Element | null = null

  openPopUp(popUp: string | JSX.Element | false) {
    if (!popUp) {
      this.popUp = null
      return
    }
    this.popUp = popUp
  }

  drawerConfig: {
    content: string | JSX.Element
    height?: number | string
  } | null = null

  setVisible(v: boolean) {
    this.visible = v
  }

  setPlaying(playing: boolean) {
    this.playing = playing
  }

  openDrawer(drawerConfig?: false | { content: string | JSX.Element; height?: number | string }) {
    if (!drawerConfig) {
      this.drawerConfig = {
        content: '',
        height: this.drawerConfig?.height
      }
      return
    }

    this.drawerConfig = drawerConfig
  }

  constructor() {
    super()

    makeObservable(this, {
      visible: observable,
      setVisible: action,
      playing: observable,
      setPlaying: action,
      popUp: observable.ref,
      openPopUp: action,
      drawerConfig: observable.ref,
      openDrawer: action,
    })

    // 监听播放情况：抛出触发时机
    reaction(
      () => this.playing,
      (playing) => {
        this.emit(playing ? 'playing' : 'paused')
      }
    )
  }

  get ready() {
    return !!this.videoAgentScene
  }

  get currentTime() {
    return this.videoAgentScene?.videoAgentMesh.currentTime || 0
  }

  get currentKeyframes() {
    if (!this.vreoUnit) return []
    const keyframes = this.vreoUnit.keyframes
    // 没有被解析过且开始时间低于当前时间戳 100ms
    return keyframes.filter((keyframe: VreoKeyframe) => {
      if (keyframe.parsed) return false
      const dur = this.currentTime - keyframe.start
      return dur <= 100 && dur >= 0
    })
  }

  get videoInstance() {
    return this.videoAgentScene?.videoAgentMesh.videoInstance
  }

  /**
   * 逐帧任务
   */
  requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void) {
    if (this.videoInstance?.ended) {
      this.setPlaying(false)
      this.videoInstance.pause()
      return
    }
    if (!this.playing) {
      if (!this.videoInstance?.paused) {
        this.videoInstance?.pause()
      }
      return
    }
    if (this.videoInstance?.paused && this.playing) {
      this.videoInstance.play()
    }

    const currentKeyframes = this.currentKeyframes

    currentKeyframes.forEach((keyframe) => {
      if (keyframe.parsed) return
      keyframe.parsed = true
      this.emit(keyframe.type, keyframe)
      if (callback) {
        callback(keyframe.type, keyframe)
      }
    })
  }

  run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void) {
    if (this.stopInterval) return
    this.stopInterval = requestAnimationFrameInterval(() => this.requestAnimationFrameLoop(callback))
  }

  dispose() {
    this.setPlaying(false)

    if (this.currentKeyframes) {
      this.currentKeyframes.forEach((keyframe) => (keyframe.parsed = false))
    }

    /**
     * 清理掉数据
     */
    this.vreoUnit = undefined
    if (this.videoInstance) {
      this.videoInstance.currentTime = 0
    }

    if (this.stopInterval) {
      this.stopInterval()
      this.stopInterval = undefined
    }
  }
}

export const ControllerContext = React.createContext<Controller | null>(null)

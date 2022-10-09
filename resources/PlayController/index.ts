import { Subscribe } from '@realsee/five'
import { requestAnimationFrameInterval } from '../shared-utils/animationFrame'
import { VreoKeyframe, VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'
import { createHTMLAudioElement } from './createHTMLAudioElement'

export interface PlayControllerConfig {
  audio?: HTMLAudioElement
}

const closures: Record<string, any> = {}

export class PlayController extends Subscribe<VreoKeyframeEvent> {

  vreoUnit?: VreoUnit

  config: PlayControllerConfig = {}
  stopInterval: () => void

  get paused() {
    return this.audioInstance.paused
  }

  get audioInstance() {
    return this.config.audio!
  }

  get currentTime() {
    return this.audioInstance.currentTime * 1000
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

  /**
   * 音频时长 不一定能获取得到，建议以 VreoUnit 配置的时长为准。
   */
  get duration() {
    return this.audioInstance.duration * 1000
  }

  constructor(config: PlayControllerConfig = {}) {
    super()

    if (!config.audio) {
      config.audio = createHTMLAudioElement()
    }

    this.config = Object.assign(this.config, config)

    closures.onPlaying = () => this.emit('playing')
    closures.onPaused = () => this.emit('paused')
    closures.onEnded = () => this.emit('paused', true)

    this.audioInstance.addEventListener('play', closures.onPlaying)
    this.audioInstance.addEventListener('pause', closures.onPaused)
    this.audioInstance.addEventListener('ended', closures.onEnded)

    this.stopInterval = requestAnimationFrameInterval(() => {
      if (this.audioInstance.paused) {
        return
      }

      if (!this.vreoUnit) {
        return
      }

      const keyframes = this.vreoUnit.keyframes
      const currentTime = this.currentTime
      // 没有被解析过且开始时间低于当前时间戳 100ms
      const currentKeyframes = keyframes.filter((keyframe: VreoKeyframe) => {
        if (keyframe.parsed) return false

        const dur = currentTime - keyframe.start
        return dur <= 60 && dur >= 0
      })
  
      currentKeyframes.forEach((keyframe) => {
        if (keyframe.parsed) return
        keyframe.parsed = true
        this.emit(keyframe.type, keyframe)
      })
    })

  }



  /**
   * 载入数据
   */
  async load(vreoUnit: VreoUnit): Promise<boolean> {
    this.vreoUnit = vreoUnit

    await this.pause()
    return await new Promise((resolve, reject) => {
      if (vreoUnit.video.url === this.audioInstance.src) {
        return resolve(true)
      }

      this.audioInstance.src = vreoUnit.video.url
      const canplaythrough = () => {
        resolve(true)
        this.audioInstance.removeEventListener('canplaythrough', canplaythrough)
      }
      const error = (err: any) => {
        reject(err)
        this.audioInstance.removeEventListener('error', error)
      }
      this.audioInstance.addEventListener('canplaythrough', canplaythrough)
      this.audioInstance.addEventListener('error', error)
    })
  }

  /**
   * 播放
   */
  async play() {
    closures.playPromise = this.audioInstance.play()
  }

  /**
   * 暂停
   */
  async pause() {
    if (closures.playPromise) {
      await closures.playPromise
    }
    this.audioInstance.pause()
  }

  /**
   * 销毁资源
   * @notice 一旦销毁，创建的实例将不可用：需重新创建实例。
   * 
   * @deprecated **慎重执行**
   */
  dispose() {
    // 清理事件监听
    this.audioInstance.removeEventListener('play', closures.onPlaying)
    this.audioInstance.removeEventListener('pasue', closures.onPaused)
    this.audioInstance.removeEventListener('ended', closures.onEnded)
    if (this.stopInterval) {
      this.stopInterval()
    }
  }
}

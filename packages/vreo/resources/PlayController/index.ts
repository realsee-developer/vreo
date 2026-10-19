import { Subscribe } from '@realsee/five-webgpu'
import { requestAnimationFrameInterval } from '../shared-utils/animationFrame'
import { Timeline } from '../timeline'
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'
import { createHTMLAudioElement } from './createHTMLAudioElement'

export interface PlayControllerConfig {
  audio?: HTMLAudioElement
}

export class PlayController extends Subscribe<VreoKeyframeEvent> {
  vreoUnit?: VreoUnit
  readonly config: PlayControllerConfig
  private readonly timeline = new Timeline<VreoUnit['keyframes'][number]>()
  private readonly ownsAudio: boolean
  private readonly stopInterval: () => void
  private playPromise?: Promise<void>
  private disposed = false

  private readonly onPlaying = () => this.emit('playing')
  private readonly onPaused = () => this.emit('paused')
  private readonly onEnded = () => this.emit('paused', true)

  get paused() { return this.audioInstance.paused }
  get audioInstance() { return this.config.audio! }
  get currentTime() { return this.audioInstance.currentTime * 1000 }
  get currentKeyframes() { return this.timeline.pendingAt(this.currentTime) }
  get duration() { return this.audioInstance.duration * 1000 }

  constructor(config: PlayControllerConfig = {}) {
    super()
    const audio = config.audio ?? createHTMLAudioElement()
    this.ownsAudio = !config.audio
    this.config = { ...config, audio }

    audio.addEventListener('play', this.onPlaying)
    audio.addEventListener('pause', this.onPaused)
    audio.addEventListener('ended', this.onEnded)

    this.stopInterval = requestAnimationFrameInterval(() => {
      if (audio.paused) return
      const currentTime = this.currentTime
      for (const keyframe of this.timeline.take(currentTime)) {
        this.emit(keyframe.type, keyframe, currentTime)
      }
    })
  }

  async load(vreoUnit: VreoUnit): Promise<boolean> {
    if (this.disposed) return false
    await this.pause()
    this.vreoUnit = vreoUnit
    this.timeline.load(vreoUnit.keyframes)
    if (vreoUnit.video.url === this.audioInstance.src) return true

    return new Promise((resolve, reject) => {
      const clean = () => {
        this.audioInstance.removeEventListener('canplaythrough', ready)
        this.audioInstance.removeEventListener('error', error)
      }
      const ready = () => { clean(); resolve(true) }
      const error = (event: Event) => { clean(); reject(event) }
      this.audioInstance.addEventListener('canplaythrough', ready)
      this.audioInstance.addEventListener('error', error)
      this.audioInstance.src = vreoUnit.video.url
    })
  }

  async play() {
    if (this.disposed) return false
    this.playPromise = this.audioInstance.play()
    await this.playPromise
    return true
  }

  async pause() {
    try {
      await this.playPromise
    } finally {
      this.playPromise = undefined
      this.audioInstance.pause()
    }
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true
    this.stopInterval()
    this.audioInstance.removeEventListener('play', this.onPlaying)
    this.audioInstance.removeEventListener('pause', this.onPaused)
    this.audioInstance.removeEventListener('ended', this.onEnded)
    this.audioInstance.pause()
    if (this.ownsAudio) this.audioInstance.remove()
    this.timeline.clear()
  }
}

import { Subscribe } from '@realsee/five'
import { requestAnimationFrameInterval } from './animationFrame'

export type AudioLikeEvent = {
  // 播放
  play: () => void
  // 语音状态 播放 -> 暂停
  pause: () => void
  // 语音时间刷新
  timeupdate: () => void
  // 播放
  ended: () => void
}


/**
 * 模拟 `<Audio>` 功能
 */
export class AudioLike extends Subscribe<AudioLikeEvent> {
  private $timestamp = 0
  private $currentTime = 0
  private $duration = 0
  private stopInterval?: () => void
  muted = false
  src = ''

  setAttribute(name: string, value: string) {

  }

  constructor({ duration }: { duration?: number } = {}) {
    super()
    if (duration) {
      this.$duration = duration
    }
  }

  play() {
    if (this.$timestamp === 0) {
      this.$timestamp = performance.now()
    }
    if (this.$currentTime === this.$duration) {
      this.$currentTime = 0
    }
    this.stopInterval = requestAnimationFrameInterval(() => this.requestAnimationFrameLoop())
    this.emit('play')
  }

  pause() {
    if (this.stopInterval) {
      this.stopInterval()
      this.emit('pause')
      this.stopInterval = undefined
    }
    this.$timestamp = 0
  }

  requestAnimationFrameLoop() {
    const now = performance.now()
    this.$currentTime = now - this.$timestamp
    this.emit('timeupdate')
    if (this.$currentTime >= this.$duration - 10) {
      this.$currentTime = this.$duration
      this.pause()
      this.emit('ended')
    }
  }

  get currentTime() {
    return this.$currentTime / 1000
  }

  set currentTime(time: number) {
    this.$currentTime = time
  }

  get duration() {
    return this.$duration
  }

  set duration(duration: number) {
    this.pause()
    this.$duration = duration
    this.$timestamp = 0
    this.$currentTime = 0
  }

  get ended() {
    return this.$currentTime === this.$duration
  }

  get paused() {
    return !this.stopInterval
  }

  addEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture = false) {
    this.on(evtName, callback)
  }

  removeEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture = false) {
    this.off(evtName, callback)
  }
}

export default AudioLike

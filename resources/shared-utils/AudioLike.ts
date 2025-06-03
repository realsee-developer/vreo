import { Subscribe } from '@realsee/five'
import { requestAnimationFrameInterval } from './animationFrame'

/**
 * 模拟 `<Audio>` 事件接口
 * @interface AudioLikeEvent
 */
export type AudioLikeEvent = {
  /** 音频开始播放事件 */
  play: () => void
  /** 音频暂停事件 */
  pause: () => void
  /** 音频时间更新事件 */
  timeupdate: () => void
  /** 音频播放结束事件 */
  ended: () => void
}

/**
 * 音频构造函数参数接口
 * @interface AudioLikeOptions
 */
export interface AudioLikeOptions {
  /** 音频持续时间（毫秒） */
  duration?: number
}

/**
 * 模拟 `<Audio>` 功能的类
 * 
 * 这个类提供了与 HTML Audio 元素相似的接口和行为，但不实际播放音频。
 * 主要用于模拟音频播放的时间控制和事件触发机制。
 * 
 * @class AudioLike
 * @extends {Subscribe<AudioLikeEvent>}
 * 
 * @example
 * ```typescript
 * const audioLike = new AudioLike({ duration: 5000 });
 * audioLike.addEventListener('play', () => console.log('开始播放'));
 * audioLike.addEventListener('ended', () => console.log('播放结束'));
 * audioLike.play();
 * ```
 */
export class AudioLike extends Subscribe<AudioLikeEvent> {
  /** 
   * 播放开始时的时间戳（毫秒）
   * @private
   */
  private $timestamp: number = 0
  
  /** 
   * 当前播放时间（毫秒）
   * @private
   */
  private $currentTime: number = 0
  
  /** 
   * 音频总时长（毫秒）
   * @private
   */
  private $duration: number = 0
  
  /** 
   * 停止动画帧循环的函数
   * @private
   */
  private stopInterval?: () => void
  
  /** 是否静音 */
  public muted: boolean = false
  
  /** 音频源URL */
  public src: string = ''

  /**
   * 设置元素属性（兼容性方法）
   * @param name - 属性名
   * @param value - 属性值
   */
  public setAttribute(name: string, value: string): void {
    // 空实现，保持与 HTML Audio 元素接口兼容
  }

  /**
   * 创建 AudioLike 实例
   * @param options - 配置选项
   * @param options.duration - 音频持续时间（毫秒）
   */
  constructor({ duration }: AudioLikeOptions = {}) {
    super()
    if (duration) {
      this.$duration = duration
    }
  }

  /**
   * 开始播放音频
   * 
   * 如果是第一次播放，会记录开始时间戳。
   * 如果已播放到结尾，会重新开始播放。
   * 
   * @returns {void}
   * @fires AudioLikeEvent#play
   */
  public play(): void {
    if (this.$timestamp === 0) {
      this.$timestamp = performance.now()
    }
    if (this.$currentTime === this.$duration) {
      this.$currentTime = 0
    }
    this.stopInterval = requestAnimationFrameInterval(() => this.requestAnimationFrameLoop())
    this.emit('play')
  }

  /**
   * 暂停播放
   * 
   * @returns {void}
   * @fires AudioLikeEvent#pause
   */
  public pause(): void {
    if (this.stopInterval) {
      this.stopInterval()
      this.emit('pause')
      this.stopInterval = undefined
    }
    this.$timestamp = 0
  }

  /**
   * 动画帧循环处理函数
   * 
   * 负责更新播放时间，触发时间更新事件，
   * 并在播放结束时自动暂停并触发结束事件。
   * 
   * @private
   * @fires AudioLikeEvent#timeupdate
   * @fires AudioLikeEvent#ended
   */
  private requestAnimationFrameLoop(): void {
    const now = performance.now()
    this.$currentTime = now - this.$timestamp
    this.emit('timeupdate')
    if (this.$currentTime >= this.$duration - 10) {
      this.$currentTime = this.$duration
      this.pause()
      this.emit('ended')
    }
  }

  /**
   * 获取当前播放时间
   * @returns {number} 当前播放时间（秒）
   */
  public get currentTime(): number {
    return this.$currentTime / 1000
  }

  /**
   * 设置当前播放时间
   * @param time - 播放时间（秒）
   */
  public set currentTime(time: number) {
    this.$currentTime = time * 1000
  }

  /**
   * 获取音频总时长
   * @returns {number} 音频总时长（毫秒）
   */
  public get duration(): number {
    return this.$duration
  }

  /**
   * 设置音频总时长
   * 
   * 设置新的时长时会自动重置播放状态
   * 
   * @param duration - 音频时长（毫秒）
   */
  public set duration(duration: number) {
    this.pause()
    this.$duration = duration
    this.$timestamp = 0
    this.$currentTime = 0
  }

  /**
   * 检查是否播放结束
   * @returns {boolean} 是否已播放结束
   */
  public get ended(): boolean {
    return this.$currentTime === this.$duration
  }

  /**
   * 检查是否已暂停
   * @returns {boolean} 是否处于暂停状态
   */
  public get paused(): boolean {
    return !this.stopInterval
  }

  /**
   * 添加事件监听器
   * 
   * @param evtName - 事件名称
   * @param callback - 回调函数
   * @param useCapture - 是否使用捕获模式（兼容性参数，未使用）
   */
  public addEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture: boolean = false): void {
    this.on(evtName, callback)
  }

  /**
   * 移除事件监听器
   * 
   * @param evtName - 事件名称
   * @param callback - 回调函数
   * @param useCapture - 是否使用捕获模式（兼容性参数，未使用）
   */
  public removeEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture: boolean = false): void {
    this.off(evtName, callback)
  }
}

export default AudioLike

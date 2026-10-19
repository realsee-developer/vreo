import type { PlaybackRun } from '../../PlaybackLifecycle'
import type { MediaOperations } from '../../playback-types'
import * as THREE from 'three/webgpu'
import { float, max, smoothstep, texture, uniform, uv } from 'three/tsl'
import { Preloader } from '../../../shared-utils/Preloader'
import { makeObservable, observable, observableRef, runInAction } from 'mobx'
import AudioLike from '../../../shared-utils/AudioLike'
import { getMediaType } from '../../../shared-utils/getMediaInfo'

/**
 * 视频经纪人贴片的配置选项
 */
export interface VideoAgentMeshOptions {
  getPlayback?: () => PlaybackRun | undefined
  /**
   * 自定义视频实例。
   */
  videoInstance?: HTMLVideoElement
  /**
   * 自定义音频实例。
   */
  audioInstance?: HTMLAudioElement
  /**
   * 是否开启音频预载能力。**仅对`.mp3`有效**。
   *
   * @description 开启预载能力后会通过 `Fetch/XHR` 方式将音频文件下载转成二进制 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 提供给多媒体实例。这样的好处是 **能够保障音视频播放过程中不卡顿**。 但在部分 iOS 系统中会存在兼容问题——播 25s 之后会静音（`muted` 为 `false`，但是没有声音）。
   */
  preload?: boolean
}

/**
 * 视频经纪人贴片类
 * 
 * 基于 THREE.js 的网格对象，作为 VR 视频播放的核心媒体管理组件。
 * 负责视频和音频的播放控制、时间同步、绿幕抠图渲染等功能。
 * 
 * 主要特性：
 * - 支持绿幕抠图渲染（ChromaKey）
 * - 音视频同步播放管理
 * - 媒体预载优化策略
 * - 跨平台播放兼容性
 * 
 * @example
 * ```typescript
 * const videoMesh = new VideoAgentMesh(1920, 1080, 32, 18, {
 *   preload: true,
 *   videoInstance: customVideoElement
 * })
 * 
 * // 播放视频
 * await videoMesh.play('https://example.com/video.mp4', 0, 60)
 * 
 * // 获取当前时间
 * console.log(videoMesh.currentTime)
 * 
 * // 销毁资源
 * videoMesh.dispose()
 * ```
 */
export class VideoAgentMesh extends THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicNodeMaterial> {
  private videoTexture: THREE.VideoTexture
  private enableNode: ReturnType<typeof uniform>
  /** 配置选项 */
  options: VideoAgentMeshOptions
  /** 当前视频URL */
  videoUrl?: string
  /** 是否冻结状态 */
  freeze: boolean 
  /** 是否暂停状态 */
  paused: boolean
  /** 音频实例 */
  private outputs = new Map<HTMLMediaElement, MediaOperations>()
  private operations(run: PlaybackRun | undefined, element: HTMLMediaElement) {
    const operations = run ? run.bind(element) : element
    this.outputs.set(element, operations)
    return operations
  }
  private ownsVideo = false
  private ownsAudio = false
  private generation = 0
  private removeStart?: () => void
  private objectURL?: string
  audioInstance: HTMLAudioElement
  /** AudioLike 实例 */
  audioLikeInstance: AudioLike
  /** 移除事件监听器的函数 */
  $removeEventListener: () => void

  /**
   * 获取当前的媒体实例
   * 
   * 根据媒体类型自动返回对应的播放实例：
   * - 无媒体时返回 AudioLike 实例
   * - 音频文件返回 HTMLAudioElement
   * - 视频文件返回 HTMLVideoElement
   * 
   * @returns 当前活跃的媒体播放实例
   */
  get mediaInstance(): HTMLAudioElement | HTMLVideoElement | AudioLike {
    if (!this.videoUrl) {
      return this.audioLikeInstance
    }

    if (getMediaType(this.videoUrl) === 'audio') {
      return this.audioInstance
    }

    return this.videoTexture.image as HTMLVideoElement
  }

  /**
   * 创建视频经纪人贴片实例
   * 
   * @param width - 网格宽度
   * @param height - 网格高度  
   * @param widthSegments - 宽度方向分段数
   * @param heightSegments - 高度方向分段数
   * @param options - 配置选项
   * 
   * @example
   * ```typescript
   * const mesh = new VideoAgentMesh(1920, 1080, 32, 18, {
   *   preload: true,
   *   videoInstance: document.getElementById('video')
   * })
   * ```
   */
  constructor(
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number,
    options: VideoAgentMeshOptions = {
      preload: true
    },
  ) {
    const ownsVideo = !options.videoInstance
    if (!options.videoInstance) {
      const videoInstance = document.createElement('video')
      videoInstance.style.display = 'none'
      videoInstance.playsInline = true
      videoInstance.muted = true
      document.body.append(videoInstance)
      options.videoInstance = videoInstance
    }

    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
    const videoTexture = new THREE.VideoTexture(options.videoInstance)
    videoTexture.colorSpace = THREE.SRGBColorSpace
    const enableNode = uniform(0)
    const videoNode = texture(videoTexture)
    const sampled = videoNode.sample(uv())
    const chromaMask = float(1).sub(
      smoothstep(0.1, 0.3, sampled.g.sub(max(sampled.r, sampled.b)).add(0.1)),
    )
    const material = new THREE.MeshBasicNodeMaterial({ transparent: true })
    material.colorNode = sampled.rgb
    material.opacityNode = chromaMask.mul(enableNode)

    super(geometry, material)
    this.videoTexture = videoTexture
    this.enableNode = enableNode
    this.ownsVideo = ownsVideo
    this.ownsAudio = !options.audioInstance
    this.options = options
    this.freeze = false
    this.paused = true

    if (!options.audioInstance) {
      this.audioInstance = document.createElement('audio')
      this.audioInstance.crossOrigin = ''
      this.audioInstance.muted = true
      this.audioInstance.autoplay = false
    } else {
      this.audioInstance = options.audioInstance
    }

    this.audioLikeInstance = new AudioLike()

    makeObservable(this, { paused: observable, videoUrl: observableRef })

    const updatePaused = (paused: boolean) => runInAction(() => (this.paused = paused))
    const onPause = () => updatePaused(true)
    const onPlay = () => updatePaused(false)

    this.audioInstance.addEventListener('pause', onPause)
    this.audioInstance.addEventListener('play', onPlay)
    this.options.videoInstance?.addEventListener('pause', onPause)
    this.options.videoInstance?.addEventListener('play', onPlay)
    this.audioLikeInstance.addEventListener('pause', onPause)
    this.audioLikeInstance.addEventListener('play', onPlay)

    this.$removeEventListener = () => {
      this.audioInstance.removeEventListener('pause', onPause)
      this.audioInstance.removeEventListener('play', onPlay)
      this.options.videoInstance?.removeEventListener('pause', onPause)
      this.options.videoInstance?.removeEventListener('play', onPlay)
      this.audioLikeInstance.removeEventListener('pause', onPause)
      this.audioLikeInstance.removeEventListener('play', onPlay)
    }
  }

  /**
   * 更新媒体资源
   * 
   * 内部方法，负责加载新的视频/音频资源，处理预载逻辑和着色器设置
   * @param videoUrl - 媒体文件URL
   * @private
   */
  private async update(videoUrl: string, valid: () => boolean, run?: PlaybackRun) {
    if (this.videoUrl === videoUrl) return
    this.stop()
    this.freeze = true
    const element = getMediaType(videoUrl) === 'audio' ? this.audioInstance : this.options.videoInstance!
    const media = this.operations(run, element)
    media.muted = true
    const src = (this.options.preload !== false || getMediaType(videoUrl) === 'video')
      ? URL.createObjectURL(await Preloader.blob(videoUrl) as unknown as Blob) : videoUrl
    if (!valid()) { if (src !== videoUrl) URL.revokeObjectURL(src); return }
    runInAction(() => { this.videoUrl = videoUrl })
    if (this.objectURL) URL.revokeObjectURL(this.objectURL)
    this.objectURL = src !== videoUrl ? src : undefined
    media.src = src
    element.setAttribute('data-src', videoUrl)
    const onStart = () => {
      if (!valid() || media.currentTime === 0) return
      this.freeze = false
      media.muted = false
      this.enableNode.value = getMediaType(videoUrl) ? 1 : 0
      this.removeStart?.()
    }
    this.removeStart = () => element.removeEventListener('timeupdate', onStart)
    element.addEventListener('timeupdate', onStart)
  }

  /**
   * 播放媒体内容
   * 
   * 支持多种播放模式：
   * - 播放指定视频/音频文件
   * - 仅设置时长（无媒体文件）
   * - 继续播放当前媒体
   * 
   * @param videoUrl - 媒体文件URL，默认为空字符串
   * @param currentTime - 播放起始时间（秒），默认为 0
   * @param duration - 媒体总时长（秒），可选
   * @returns Promise<boolean> 播放是否成功
   * 
   * @example
   * ```typescript
   * // 播放视频文件
   * await mesh.play('video.mp4', 10, 120)
   * 
   * // 仅设置时长（音频跟踪）
   * await mesh.play('', 0, 60)
   * 
   * // 继续播放当前媒体
   * await mesh.play()
   * ```
   */
  async play(videoUrl = '', currentTime = 0, duration?: number) {
    const run = this.options.getPlayback?.()
    if (this.options.getPlayback && !run?.valid()) return false
    // stop() invalidates all earlier loads before the new generation is captured.
    if (videoUrl && videoUrl !== this.videoUrl) this.stop()
    let generation = this.generation
    const valid = () => generation === this.generation && (!this.options.getPlayback || !!run?.valid())
    if (videoUrl && videoUrl !== this.videoUrl) {
      // update's synchronous stop is accounted for before awaiting its load.
      generation++
      await this.update(videoUrl, valid, run)
    }
    if (!valid()) return false
    if (duration && !videoUrl) {
      runInAction(() => { this.videoUrl = '' })
      this.audioLikeInstance.duration = duration
    }
    const media = this.videoUrl ? this.operations(run, this.mediaInstance as HTMLMediaElement) : this.audioLikeInstance
    if (videoUrl || duration) media.currentTime = currentTime
    media.muted = true
    await media.play()
    if (!valid()) return false
    media.muted = false
    return true
  }

  get mediaOperations(): MediaOperations | AudioLike | undefined {
    const run = this.options.getPlayback?.()
    if (this.options.getPlayback && !run?.valid()) return undefined
    return this.videoUrl ? this.operations(run, this.mediaInstance as HTMLMediaElement) : this.audioLikeInstance
  }

  stop() {
    ++this.generation
    this.removeStart?.()
    this.removeStart = undefined
    for (const output of this.outputs.values()) { output.muted = true; output.pause() }
    this.outputs.clear()
    this.audioLikeInstance.pause()
  }

  /**
   * 获取当前播放时间（毫秒）
   * 
   * 将媒体实例的秒级时间转换为毫秒，提供更高精度的时间控制
   * @returns 当前播放时间戳（毫秒）
   */
  get currentTime() {
    return this.mediaInstance.currentTime * 1000
  }

  /**
   * 销毁视频经纪人贴片实例
   * 
   * 清理所有事件监听器、DOM元素和缓存实例，释放内存资源
   * 
   * @example
   * ```typescript
   * // 在组件卸载时调用
   * videoMesh.dispose()
   * ```
   */
  dispose() {
    this.stop()
    this.$removeEventListener()
    if (this.ownsVideo) this.options.videoInstance?.remove()
    if (this.ownsAudio) this.audioInstance.remove()
    if (this.objectURL) URL.revokeObjectURL(this.objectURL)
    this.geometry.dispose()
    this.videoTexture.dispose()
    this.material.dispose()
  }
}

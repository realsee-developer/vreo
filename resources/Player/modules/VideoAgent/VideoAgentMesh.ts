import * as THREE from 'three'
import { Preloader } from '../../../shared-utils/Preloader'
import { makeObservable, observable, runInAction } from 'mobx'
import AudioLike from '../../../shared-utils/AudioLike'
import { getMediaType } from '../../../shared-utils/getMediaInfo'

const vertexShader = `
varying vec2 vUv;
varying vec2 vColorUv;
varying vec2 vMaskUv;
void main(){
  vUv = uv;
  vColorUv = vec2(uv.x / 2.0, uv.y);
  vMaskUv = vec2(0.5 + uv.x / 2.0, uv.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const fragmentShaderTpl = () => `
uniform int enable;
uniform sampler2D map;
varying vec2 vUv;
varying vec2 vColorUv;
varying vec2 vMaskUv;

vec3 hsv2rgb(vec3 c) {
  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);
}

void main(void) {
  vec3 color = texture2D(map, vUv).xyz;
  float amask = 1.0;

  float ref = color.r;
  if (ref < color.b) ref = color.b;
  amask = color.g - ref + 0.1;
  amask = smoothstep(0.1, 0.3, amask);
  amask = 1.0 - amask;

  vec3 target = rgb2hsv(vec3(0.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0));
  vec3 hsv = rgb2hsv(color);
  float distance = abs(hsv.x - target.x);
  if (distance < 0.15) {
    hsv.y = 0.0;
  }
  color = hsv2rgb(hsv);

  gl_FragColor = vec4(color.rgb, amask * float(enable));
}
`

const cacheInstance: {
  videoInstance?: HTMLVideoElement
  audioInstance?: HTMLAudioElement
} = {}

/**
 * 视频经纪人贴片的配置选项
 */
export interface VideoAgentMeshOptions {
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
export class VideoAgentMesh extends THREE.Mesh {
  /** 配置选项 */
  options: VideoAgentMeshOptions
  /** 当前视频URL */
  videoUrl?: string
  /** 是否冻结状态 */
  freeze: boolean 
  /** 是否暂停状态 */
  paused: boolean
  /** 音频实例 */
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

    const uniforms = (this.material as THREE.ShaderMaterial).uniforms
    const videoInstance = uniforms.map.value.image as HTMLVideoElement

    return videoInstance
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
    if (!options.videoInstance) {
      if (cacheInstance.videoInstance) {
        options.videoInstance = cacheInstance.videoInstance
      } else {
        const videoInstance = document.createElement('video')
        videoInstance.style.opacity = '0'
        videoInstance.style.pointerEvents = 'none'
        videoInstance.style.display = 'none'
        document.body.append(videoInstance)
        options.videoInstance = videoInstance
        cacheInstance.videoInstance = videoInstance
        videoInstance.playsInline = true
        videoInstance.controls = false
      }
    }

    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
    const videoTexture = new THREE.VideoTexture(options.videoInstance)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: videoTexture },
        enable: { value: 0 },
      },
      vertexShader,
      fragmentShader: fragmentShaderTpl(),
      transparent: true,
    })

    super(geometry, material)
    this.options = options
    this.freeze = false
    this.paused = true

    if (!options.audioInstance) {
      if (cacheInstance.audioInstance) {
        this.audioInstance = cacheInstance.audioInstance
      } else {
        const audioInstance = document.createElement('audio')
        audioInstance.crossOrigin = ''
        // videoInstance.muted = true
        audioInstance.muted = false
        audioInstance.autoplay = false
        audioInstance.style.display = 'none'
        document.body.appendChild(audioInstance)
        this.audioInstance = audioInstance
        cacheInstance.audioInstance = audioInstance
      }
    } else {
      this.audioInstance = options.audioInstance
    }

    this.audioLikeInstance = new AudioLike()

    makeObservable(this, { paused: observable })

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
  private async update(videoUrl: string) {

    if (this.videoUrl === videoUrl) {
      return
    }

    this.videoUrl = videoUrl

    // // 兼容非视频场景
    // if (this.mediaInstance instanceof HTMLAudioElement) {
    //   this.mediaInstance.style.display = 'none'
    // } else if (this.mediaInstance instanceof HTMLVideoElement) {
    //   this.mediaInstance.style.display = 'block'
    // }

    this.freeze = true
    await this.mediaInstance.pause()

    const uniforms = (this.material as THREE.ShaderMaterial).uniforms
    this.mediaInstance.muted = true

    this.mediaInstance.src = (this.options.preload || this.options.preload === undefined || getMediaType(this.videoUrl) === 'video') ?
      await URL.createObjectURL((await Preloader.blob(this.videoUrl)) as unknown as Blob) : this.videoUrl
    this.mediaInstance.setAttribute('data-src', this.videoUrl)

    const onStart = () => {
      if (this.mediaInstance.currentTime === 0) return
      this.freeze = false
      this.mediaInstance.muted = false
      uniforms.enable.value = getMediaType(this.videoUrl) ? 1 : 0
      this.mediaInstance.removeEventListener('timeupdate', onStart, false)

    }

    this.mediaInstance.addEventListener('timeupdate', onStart, false)
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
    videoUrl = videoUrl || ''

    if (duration && !videoUrl) {
      if (this.currentTime) {
        this.mediaInstance.currentTime = currentTime
      }
      (this.mediaInstance as AudioLike).duration = duration
      this.videoUrl = ''
      this.mediaInstance.play()
      return true
    }

    if (!videoUrl) {
      if (this.videoUrl) await this.mediaInstance.play()
      else console.warn('警告：视频资源未初始化。')
      return true
    }

    if (videoUrl === this.videoUrl) {
      this.mediaInstance.currentTime = currentTime
      await this.mediaInstance.play()
      return true
    }

    await this.update(videoUrl)

    this.mediaInstance.pause()

    return await new Promise((resolve) =>
      setTimeout(async () => {
        this.mediaInstance.currentTime = currentTime
        await this.mediaInstance.play()
        resolve(true)
      }, 20),
    )
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
    // 销毁事件监听
    this.$removeEventListener()
    if (cacheInstance.audioInstance) {
      document.body.removeChild(cacheInstance.audioInstance)
      cacheInstance.audioInstance = undefined
    }

    if (cacheInstance.videoInstance) {
      document.body.removeChild(cacheInstance.videoInstance)
      cacheInstance.videoInstance = undefined
    }
  }
}

import * as THREE from 'three'
import { Preloader } from '../../../shared-utils/Preloader'
import { makeObservable, observable, runInAction } from 'mobx'
import AudioLike from '../../../shared-utils/AudioLike'
import { getMediaType } from '../../../shared-utils/getMediaInfo'
import { Five, parseWork, Work } from '@realsee/five'

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
 * 视频经纪人MESH
 */
export class VideoAgentMesh extends THREE.Mesh {
  options: VideoAgentMeshOptions
  videoUrl?: string
  freeze: boolean 
  paused: boolean
  audioInstance: HTMLAudioElement
  audioLikeInstance: AudioLike
  $removeEventListener: () => void

  /**
   * 获取当前活动的媒体实例
   * 
   * 根据当前状态返回不同类型的媒体实例：
   * - 如果没有视频URL，返回音频模拟实例 (AudioLike)
   * - 如果是音频文件，返回 HTML Audio 元素
   * - 如果是视频文件，返回 HTML Video 元素
   */
  get mediaInstance(): HTMLAudioElement | HTMLVideoElement | AudioLike {
    // 没有视频URL时，使用音频模拟实例
    if (!this.videoUrl) {
      return this.audioLikeInstance
    }

    // 音频文件使用专门的音频实例
    if (getMediaType(this.videoUrl) === 'audio') {
      return this.audioInstance
    }

    // 视频文件从材质纹理中获取视频实例
    const uniforms = (this.material as THREE.ShaderMaterial).uniforms
    const videoInstance = uniforms.map.value.image as HTMLVideoElement

    return videoInstance
  }

  /**
   * 创建视频代理网格
   * 
   * @param width - 网格宽度
   * @param height - 网格高度  
   * @param widthSegments - 宽度分段数
   * @param heightSegments - 高度分段数
   * @param options - 配置选项
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
    // 初始化或复用视频实例（单例模式，避免重复创建）
    if (!options.videoInstance) {
      if (cacheInstance.videoInstance) {
        // 复用已存在的视频实例
        options.videoInstance = cacheInstance.videoInstance
      } else {
        // 创建新的视频实例并进行必要配置
        const videoInstance = document.createElement('video')
        videoInstance.style.opacity = '0'           // 隐藏视频元素（仅作为纹理源）
        videoInstance.style.pointerEvents = 'none'  // 禁用鼠标事件
        videoInstance.style.display = 'none'        // 不显示在页面中
        document.body.append(videoInstance)
        options.videoInstance = videoInstance
        cacheInstance.videoInstance = videoInstance
        videoInstance.playsInline = true           // 启用内联播放（移动端重要）
        videoInstance.controls = false             // 禁用默认控件
      }
    }

    // 创建平面几何体和视频纹理
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
    const videoTexture = new THREE.VideoTexture(options.videoInstance)
    
    // 创建自定义着色器材质，用于视频处理和透明度控制
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: videoTexture },
        enable: { value: 0 },              // 控制是否启用视频显示
      },
      vertexShader,
      fragmentShader: fragmentShaderTpl(),  // 自定义片段着色器，处理绿幕等效果
      transparent: true,
    })

    super(geometry, material)
    this.options = options
    this.freeze = false    // 是否冻结状态（用于控制播放流程）
    this.paused = true     // 暂停状态

    // 初始化或复用音频实例（类似视频实例的处理）
    if (!options.audioInstance) {
      if (cacheInstance.audioInstance) {
        this.audioInstance = cacheInstance.audioInstance
      } else {
        const audioInstance = document.createElement('audio')
        audioInstance.crossOrigin = ''      // 设置跨域属性
        audioInstance.muted = false         // 默认不静音
        audioInstance.autoplay = false      // 禁用自动播放
        audioInstance.style.display = 'none'
        document.body.appendChild(audioInstance)
        this.audioInstance = audioInstance
        cacheInstance.audioInstance = audioInstance
      }
    } else {
      this.audioInstance = options.audioInstance
    }

    // 创建音频模拟实例（用于无实际音频时的时间控制）
    this.audioLikeInstance = new AudioLike()

    // 设置 MobX 观察者模式，用于响应式状态管理
    makeObservable(this, { paused: observable })

    // 创建播放状态同步机制
    const updatePaused = (paused: boolean) => runInAction(() => (this.paused = paused))
    const onPause = () => updatePaused(true)
    const onPlay = () => updatePaused(false)

    // 为所有媒体实例添加播放状态监听器，确保状态同步
    this.audioInstance.addEventListener('pause', onPause)
    this.audioInstance.addEventListener('play', onPlay)
    this.options.videoInstance?.addEventListener('pause', onPause)
    this.options.videoInstance?.addEventListener('play', onPlay)
    this.audioLikeInstance.addEventListener('pause', onPause)
    this.audioLikeInstance.addEventListener('play', onPlay)

    // 保存事件清理函数，用于销毁时清理所有监听器
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
   * 更新视频源
   * 
   * 这是一个复杂的异步过程，包括：
   * 1. 检查是否需要更新
   * 2. 冻结当前播放状态
   * 3. 预加载或直接设置视频源
   * 4. 设置播放开始监听器
   * 
   * @private
   */
  private async update(videoUrl: string) {
    // 如果URL相同，无需重复更新
    if (this.videoUrl === videoUrl) {
      return
    }

    this.videoUrl = videoUrl

    // 设置冻结状态，阻止不必要的更新
    this.freeze = true
    await this.mediaInstance.pause()

    const uniforms = (this.material as THREE.ShaderMaterial).uniforms
    
    // 临时静音，避免播放过程中的音频干扰
    this.mediaInstance.muted = true

    // 智能资源加载策略：
    // - 如果启用预加载 或 文件是视频格式，使用Blob方式预加载
    // - 否则直接使用URL（适用于音频文件，避免iOS兼容性问题）
    this.mediaInstance.src = (this.options.preload || this.options.preload === undefined || getMediaType(this.videoUrl) === 'video') ?
      await URL.createObjectURL((await Preloader.blob(this.videoUrl)) as unknown as Blob) : this.videoUrl
    
    // 设置数据源属性，用于调试和状态追踪
    this.mediaInstance.setAttribute('data-src', this.videoUrl)

    // 播放开始回调函数
    const onStart = () => {
      // 确保已经开始播放（currentTime > 0）
      if (this.mediaInstance.currentTime === 0) return
      
      // 解除冻结状态
      this.freeze = false
      
      // 恢复音频
      this.mediaInstance.muted = false
      
      // 根据媒体类型启用着色器效果（视频文件启用，音频文件不启用）
      uniforms.enable.value = getMediaType(this.videoUrl) ? 1 : 0
      
      // 移除临时监听器，避免重复触发
      this.mediaInstance.removeEventListener('timeupdate', onStart, false)
    }

    // 监听时间更新事件，等待播放真正开始
    this.mediaInstance.addEventListener('timeupdate', onStart, false)
  }

  /**
   * 播放媒体内容
   * 
   * 支持多种播放模式：
   * 1. 仅时长播放（AudioLike模式）
   * 2. 继续播放当前视频
   * 3. 播放新的视频内容
   * 
   * @param videoUrl - 视频URL，空字符串表示继续播放或仅时长模式
   * @param currentTime - 开始播放时间（秒）
   * @param duration - 播放时长（毫秒），用于AudioLike模式
   * @returns Promise<boolean> - 播放操作是否成功
   */
  async play(videoUrl = '', currentTime = 0, duration?: number) {
    videoUrl = videoUrl || ''

    // 模式1：仅时长播放（使用AudioLike进行时间控制，无实际媒体）
    if (duration && !videoUrl) {
      if (this.currentTime) {
        this.mediaInstance.currentTime = currentTime
      }
      // 设置AudioLike的时长并开始播放
      (this.mediaInstance as AudioLike).duration = duration
      this.videoUrl = ''
      this.mediaInstance.play()
      return true
    }

    // 模式2：继续播放当前视频
    if (!videoUrl) {
      if (this.videoUrl) await this.mediaInstance.play()
      else console.warn('警告：视频资源未初始化。')
      return true
    }

    // 模式3：播放相同URL的视频（仅调整时间）
    if (videoUrl === this.videoUrl) {
      this.mediaInstance.currentTime = currentTime
      await this.mediaInstance.play()
      return true
    }

    // 模式4：播放新视频
    await this.update(videoUrl)

    // 先暂停，准备新的播放
    this.mediaInstance.pause()

    // 使用短暂延迟确保媒体元素状态更新完成
    return await new Promise((resolve) =>
      setTimeout(async () => {
        this.mediaInstance.currentTime = currentTime
        await this.mediaInstance.play()
        resolve(true)
      }, 20),  // 20ms延迟，确保DOM更新完成
    )
  }

  /**
   * 获取当前播放时间（毫秒）
   * 将媒体元素的秒数转换为毫秒，提供更精确的时间控制
   */
  get currentTime() {
    return this.mediaInstance.currentTime * 1000
  }

  /**
   * 销毁实例并清理所有资源
   * 
   * 包括：
   * 1. 移除所有事件监听器
   * 2. 清理缓存的媒体实例
   * 3. 从DOM中移除元素
   */
  dispose() {
    // 清理事件监听器
    this.$removeEventListener()
    
    // 清理缓存的音频实例
    if (cacheInstance.audioInstance) {
      document.body.removeChild(cacheInstance.audioInstance)
      cacheInstance.audioInstance = undefined
    }

    // 清理缓存的视频实例
    if (cacheInstance.videoInstance) {
      document.body.removeChild(cacheInstance.videoInstance)
      cacheInstance.videoInstance = undefined
    }
  }
}

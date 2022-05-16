import * as THREE from 'three'
import { Preloader } from '../../../shared-utils/Preloader'
import { makeObservable, observable, runInAction } from 'mobx'
import AudioLike from '../../../shared-utils/AduioLike'

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
   * 是否开启音视频预载能力。
   * 
   * @description 开启预载能力后会通过 `Fetch/XHR` 方式将音视频文件下载下载转成二进制 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 提供给多媒体实例。这样的好处是 **能够保障音视频播放过程中不卡顿**。 但在部分 iOS 系统中会存在兼容问题——播 25s 之后会静音（`muted` 为 `false`，但是没有声音）。
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

  get videoInstance(): HTMLAudioElement | AudioLike {
    if (!this.videoUrl) {
      return this.audioLikeInstance
    }

    if (this.videoUrl?.endsWith('mp3')) {
      return this.audioInstance
    }

    const uniforms = (this.material as THREE.ShaderMaterial).uniforms
    const videoInstance = uniforms.map.value.image as HTMLVideoElement

    return videoInstance
  }

  /**
   *
   * @param width
   * @param height
   * @param widthSegments
   * @param heightSegments
   * @param options
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
        audioInstance.setAttribute('playsinline', 'true')
        audioInstance.setAttribute('webkit-playsinline', 'true')
        audioInstance.setAttribute('autoplay', 'false')
        audioInstance.setAttribute('style', 'display: none;')
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

  private async update(videoUrl: string) {

    if (this.videoUrl === videoUrl) {
      return
    }

    this.videoUrl = videoUrl
    this.freeze = true
    await this.videoInstance.pause()

    const uniforms = (this.material as THREE.ShaderMaterial).uniforms
    this.videoInstance.muted = true

    this.videoInstance.src = this.options.preload ? await URL.createObjectURL((await Preloader.blob(this.videoUrl)) as unknown as Blob) : this.videoUrl
    this.videoInstance.setAttribute('data-src', this.videoUrl)

    const onStart = () => {
      if (this.videoInstance.currentTime === 0) return
      this.freeze = false
      this.videoInstance.muted = false
      uniforms.enable.value = this.videoUrl?.endsWith('.mp4') ? 1 : 0
      this.videoInstance.removeEventListener('timeupdate', onStart, false)

    }

    this.videoInstance.addEventListener('timeupdate', onStart, false)
  }

  async play(videoUrl = '', currentTime = 0, duration?: number) {
    videoUrl = videoUrl || ''
    if (duration && !videoUrl) {
      if (this.currentTime) {
        this.videoInstance.currentTime = currentTime
      }
      (this.videoInstance as AudioLike).duration = duration
      this.videoUrl = ''
      this.videoInstance.play()
      return true
    }

    if (!videoUrl) {
      if (this.videoUrl) await this.videoInstance.play()
      else console.warn('警告：视频资源未初始化。')
      return true
    }

    console.log('play', videoUrl, this.videoUrl)
    if (videoUrl === this.videoUrl) {
      this.videoInstance.currentTime = currentTime
      await this.videoInstance.play()
      return true
    }

    await this.update(videoUrl)

    this.videoInstance.pause()

    return await new Promise((resolve) =>
      setTimeout(async () => {
        this.videoInstance.currentTime = currentTime
        await this.videoInstance.play()
        resolve(true)
      }, 20),
    )
  }

  /**
   * 转成毫秒，保障精准度
   */
  get currentTime() {
    return this.videoInstance.currentTime * 1000
  }

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

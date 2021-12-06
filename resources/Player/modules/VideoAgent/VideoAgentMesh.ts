import * as THREE from 'three'
import { Preloader } from '../../../shared-utils/Preloader'
import { makeObservable, observable, runInAction } from 'mobx'

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

export interface VideoAgentMeshOptions {
  videoInstance?: HTMLVideoElement
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

  get videoInstance(): HTMLAudioElement {
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
    options: VideoAgentMeshOptions = {},
  ) {
    if (!options.videoInstance) {
      const videoInstance = document.createElement('video')
      videoInstance.style.opacity = '0'
      videoInstance.style.display = 'none'
      document.body.append(videoInstance)
      options.videoInstance = videoInstance
      videoInstance.playsInline = true
      videoInstance.controls = false
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

    {
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
    }
    makeObservable(this, { paused: observable })

    const updatePaused = (paused: boolean) => runInAction(() => (this.paused = paused))
    this.videoInstance.addEventListener('pause', () => updatePaused(true))
    this.videoInstance.addEventListener('play', () => updatePaused(false))
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
    this.videoInstance.src = await URL.createObjectURL((await Preloader.blob(this.videoUrl)) as unknown as Blob)
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

  async play(videoUrl = '') {
    videoUrl = (videoUrl || '').replace(/https*:/, '')
    if (!videoUrl) {
      if (this.videoUrl) await this.videoInstance.play()
      else console.warn('警告：视频资源未初始化。')
      return true
    }

    if (videoUrl === this.videoUrl) {
      this.videoInstance.currentTime = 0
      await this.videoInstance.play()
      return true
    }

    await this.update(videoUrl)

    this.videoInstance.pause()

    return await new Promise((resolve) =>
      setTimeout(async () => {
        this.videoInstance.currentTime = 0
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
}

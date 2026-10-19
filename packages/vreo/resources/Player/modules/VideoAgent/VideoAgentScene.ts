import { OrthographicCamera, Scene, WebGPURenderer } from 'three/webgpu'
import { addResizeListener } from '../../../shared-utils/addResizeListener'
import { VideoAgentMesh, VideoAgentMeshOptions } from './VideoAgentMesh'

export class VideoAgentScene {
  videoAgentMesh: VideoAgentMesh
  scene = new Scene()
  camera = new OrthographicCamera(-240, 240, 135, -135)
  renderer: WebGPURenderer
  private frame: number | undefined
  private disposed = false
  disposers: (() => void)[] = []

  constructor(container?: HTMLElement, options?: VideoAgentMeshOptions, forceWebGL = false) {
    this.renderer = new WebGPURenderer({ alpha: true, forceWebGL })
    this.videoAgentMesh = new VideoAgentMesh(480, 270, 1, 1, options)
    if (!container) return

    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(0, 0, 0)
    const domElement = this.renderer.domElement
    domElement.classList.add('VideoAgent-canvas')
    const dispose = addResizeListener(container, (width, height) => {
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(width, height, false)
      domElement.style.width = `${width}px`
      domElement.style.height = `${height}px`
    })
    this.disposers.push(dispose)
    container.append(domElement)
    this.scene.add(this.videoAgentMesh)
    void this.renderer.init().then(() => {
      if (this.disposed) return
      const backend = this.renderer.backend as { isWebGPUBackend?: boolean; isWebGLBackend?: boolean }
      if (!backend.isWebGPUBackend && !backend.isWebGLBackend) {
        throw new Error('VideoAgent renderer initialized with an unsupported backend')
      }
      this.run()
    }).catch(this.fail)
  }

  private fail = (error: unknown) => {
    if (this.disposed) return
    this.dispose()
    console.error('VideoAgent renderer initialization failed', error)
  }

  run = () => {
    if (this.disposed) return
    if (!(this.videoAgentMesh.paused || this.videoAgentMesh.freeze) && this.videoAgentMesh.currentTime > 1000) {
      this.renderer.render(this.scene, this.camera)
    }
    this.frame = requestAnimationFrame(this.run)
  }

  dispose = () => {
    if (this.disposed) return
    this.disposed = true
    if (this.frame !== undefined) cancelAnimationFrame(this.frame)
    this.frame = undefined
    this.disposers.splice(0).forEach(dispose => dispose())
    this.videoAgentMesh.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}

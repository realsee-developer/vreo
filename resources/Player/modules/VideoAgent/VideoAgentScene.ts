import * as THREE from 'three'
import { addResizeListener } from '../../../shared-utils/addResizeListener'
import { getMediaType } from '../../../shared-utils/getMediaInfo'
import { VideoAgentMesh, VideoAgentMeshOptions } from './VideoAgentMesh'

export class VideoAgentScene {
  videoAgentMesh: VideoAgentMesh

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-240, 240, 135, -135)
  renderer = new THREE.WebGLRenderer({ alpha: true })
  disposers: (() => void)[] = []

  constructor(container?: HTMLElement, options?: VideoAgentMeshOptions) {

    this.videoAgentMesh = new VideoAgentMesh(480, 270, 1, 1, options)

    // const needRender = getMediaType(this.videoAgentMesh.videoUrl) === 'video'

    if (container) {

      this.camera.position.set(0, 0, 10)
      this.camera.lookAt(0, 0, 0)

      const domElement = this.renderer.domElement
      domElement.classList.add('VideoAgent-canvas')

      const dispose = addResizeListener(container, (width, height) => {
        this.renderer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio)
        domElement.style.width = `${width}px`
        domElement.style.height = `${height}px`
      } )

      this.disposers.push(dispose)

      container.append(domElement)
      this.scene.add(this.videoAgentMesh)
      
      this.run()
    }
  }

  run = () => {
    // 视频开始 1s 不渲染：规避某些设备黑屏闪烁问题。视频前 2s 是最好是静默的。
    if (!(this.videoAgentMesh.paused || this.videoAgentMesh.freeze) && this.videoAgentMesh.currentTime > 1000) {
      this.renderer.render(this.scene, this.camera)
    }

    requestAnimationFrame(this.run)
  }

  dispose = () => {
    this.videoAgentMesh?.dispose()
    this.disposers.forEach(disposer => disposer?.())
  }
}

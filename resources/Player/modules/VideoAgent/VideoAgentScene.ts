import * as THREE from 'three'
import { VideoAgentMesh } from './VideoAgentMesh'

export class VideoAgentScene {
  videoAgentMesh: VideoAgentMesh

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-240, 240, 135, -135)
  renderer = new THREE.WebGLRenderer({ alpha: true })
  container: HTMLElement

  constructor(container: HTMLElement, needRender = true) {
    this.container = container
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(0, 0, 0)
    const state = {
      width: container.offsetWidth,
      height: container.offsetHeight,
    }
    const domElement = this.renderer.domElement
    domElement.classList.add('VideoAgent-canvas')
    this.renderer.setSize(state.width * window.devicePixelRatio, state.height * window.devicePixelRatio)
    domElement.setAttribute('style', `width: ${state.width}px;height: ${state.height}px;`)

    this.videoAgentMesh = new VideoAgentMesh(480, 270, 1, 1)
    if (needRender) {
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
}

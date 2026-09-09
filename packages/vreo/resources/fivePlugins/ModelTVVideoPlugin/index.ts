import * as THREE from 'three'
import type { FivePlugin } from '@realsee/five'
import type { PlaybackManager, PlaybackSession, MediaOperations } from '../../Player/playback-types'

export interface ModelTVVideoPluginData {
  enable?: boolean
  video_src: string
  video_poster_src: string
  points: { x: number; y: number; z: number }[][]
}

export interface ModelTVVideoPluginParameterType {
  videoElement?: HTMLVideoElement
  mediaManager?: PlaybackManager
}
export interface ModelTVVideoPluginExportType {
  enable: () => void
  disable: () => void
  dispose: () => void
  load: (data: ModelTVVideoPluginData, videoElement?: HTMLVideoElement) => Promise<void>
}

type ModelTVVideoPluginPoints = THREE.Vector3[][]

type ModelTVVideoPluginState = {
  videoMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>[]
  videoTextureEnabled: boolean
  videoSource: string
  rectPoints: ModelTVVideoPluginPoints
  enabled: boolean
  imageTexture?: THREE.Texture
  videoTexture?: THREE.VideoTexture
  videoElement?: HTMLVideoElement
}

export const ModelTVVideoPlugin: FivePlugin<ModelTVVideoPluginParameterType, ModelTVVideoPluginExportType> = (
  five,
  { videoElement, mediaManager },
) => {
  const listeners: (() => void)[] = []
  const on: typeof five.on = (name, callback) => {
    listeners.push(() => { five.off(name, callback) })
    return five.on(name, callback)
  }
  let generation = 0
  let disposed = false
  const state: ModelTVVideoPluginState = {
    videoMeshes: [],
    videoTextureEnabled: false,
    videoSource: '',
    rectPoints: [],
    enabled: false,
    videoElement: videoElement,
  }

  let session: PlaybackSession | undefined
  let output: MediaOperations | undefined
  let removeReady: (() => void) | undefined
  const stop = () => {
    ++generation
    removeReady?.()
    removeReady = undefined
    if (output) { output.muted = true; output.pause() }
    output = undefined
    session = undefined
    state.enabled = false
    state.videoMeshes.forEach(mesh => {
      mesh.geometry.dispose()
      mesh.material.dispose()
      five.scene.remove(mesh)
    })
    state.videoMeshes = []
    five.needsRender = true
  }
  const controller = mediaManager?.createController({ label: 'vreo-model-video', onCancel: stop })
  const bind = (userAction: boolean, audible: boolean) => {
    const element = state.videoTexture?.image as HTMLVideoElement | undefined
    if (!element) return undefined
    const next = controller?.begin({ userAction, audible }) ?? undefined
    if (controller && !next) return undefined
    session = next
    return output = next ? next.bind(element) : element
  }
  const setMuted = (muted: boolean, userAction = false) => {
    const wasEnabled = state.enabled
    const media = !muted ? bind(userAction, true) : output
    if (!media) return
    media.muted = muted
    if (wasEnabled && !state.enabled) {
      state.enabled = true
      state.videoMeshes = createPanoVideoMeshes()
      state.videoMeshes.forEach(mesh => five.scene.add(mesh))
    }
    const run = session
    const current = generation
    if (state.enabled) void media.play().catch(error => { if (current === generation && !run?.signal.aborted) { disable(); console.error(error) } })
  }
  const getMuted = () => output?.muted ?? true
  const enable = () => {
    if (disposed || state.enabled || !state.videoTexture) return
    const media = bind(false, false)
    if (!media) return
    const current = generation
    const run = session
    const element = state.videoTexture.image as HTMLVideoElement
    const valid = () => current === generation && !disposed && state.enabled && !run?.signal.aborted
    state.enabled = true
    state.videoMeshes = createPanoVideoMeshes()
    state.videoMeshes.forEach(mesh => five.scene.add(mesh))
    const timeupdate = () => {
      element.removeEventListener('timeupdate', timeupdate)
      if (!valid()) return
      state.videoTextureEnabled = true
      state.videoMeshes.forEach(mesh => { mesh.material.map = state.videoTexture! })
      five.needsRender = true
    }
    const play = () => {
      five.off('modelLoaded', play)
      if (!valid()) return
      element.addEventListener('timeupdate', timeupdate)
      void media.play().catch(error => { if (valid()) { disable(); console.error(error) } })
    }
    removeReady = () => { five.off('modelLoaded', play); element.removeEventListener('timeupdate', timeupdate) }
    if (five.model.loaded) play()
    else five.on('modelLoaded', play)
  }
  const disable = () => { controller?.cancel(); stop() }

  const createPanoVideoMeshes = () => {
    return state.rectPoints.map((points, index) => {
      const geometry = new THREE.BufferGeometry()
      const segments = 128

      const verticesArray: number[] = []
      verticesArray.push(points[0].x, points[0].y, points[0].z)
      for (let i = 1; i < segments; i++) {
        verticesArray.push(
          points[0].x + ((points[1].x - points[0].x) * i) / segments,
          points[0].y + ((points[1].y - points[0].y) * i) / segments,
          points[0].z + ((points[1].z - points[0].z) * i) / segments,
        )
      }
      verticesArray.push(points[1].x, points[1].y, points[1].z)
      verticesArray.push(points[2].x, points[2].y, points[2].z)
      for (let i = 1; i < segments; i++) {
        verticesArray.push(
          points[2].x + ((points[3].x - points[2].x) * i) / segments,
          points[2].y + ((points[3].y - points[2].y) * i) / segments,
          points[2].z + ((points[3].z - points[2].z) * i) / segments,
        )
      }
      verticesArray.push(points[3].x, points[3].y, points[3].z)

      const uvArray: number[] = []
      uvArray.push(0, 1)
      for (let i = 1; i < segments; i++) {
        uvArray.push(0, 1 - i / segments)
      }
      uvArray.push(0, 0)
      uvArray.push(1, 0)
      for (let i = 1; i < segments; i++) {
        uvArray.push(1, i / segments)
      }
      uvArray.push(1, 1)

      const indicesArray: number[] = []
      for (let i = 0; i < segments; i++) {
        indicesArray.push(i, i + 1, segments * 2 - i, i, segments * 2 - i, segments * 2 + 1 - i)
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verticesArray), 3))
      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvArray), 2))
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indicesArray), 1))
      const material = new THREE.MeshBasicMaterial({
        map: state.videoTextureEnabled ? state.videoTexture : state.imageTexture,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.renderOrder = 1
      mesh.name = `video-${index}-${performance.now()}`
      return mesh
    })
  }

  const getImageTexture = (source: string) => {
    const texture = new THREE.TextureLoader().load(source)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat
    return texture
  }

  const getVideoTexture = (
    source: string,
    video?: HTMLVideoElement,
    valid = () => true,
  ): Promise<THREE.VideoTexture & { videoSource: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (!valid()) { reject(new DOMException('Playback cancelled', 'AbortError')); return }
          if (xhr.status == 200) {
            const url = window.URL || window.webkitURL
            video = video || document.createElement('video')
            video.crossOrigin = 'anonymous'
            video.autoplay = false
            video.muted = true
            video.loop = true
            video.playsInline = true
            video.src = url.createObjectURL(xhr.response)
            const texture = new THREE.VideoTexture(video)
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.format = THREE.RGBFormat
            resolve(Object.assign(texture, { videoSource: source }))
          } else {
            reject(new Error('Video download Error: ' + xhr.status))
          }
        }
      }
      xhr.onerror = (error) => reject(error)
      xhr.open('GET', source)
      xhr.responseType = 'blob'
      xhr.send()
    })
  }

  const load = async (data: ModelTVVideoPluginData, videoElement?: HTMLVideoElement) => {
    const current = ++generation
    const { video_src, video_poster_src, points } = data
    state.videoSource = video_src
    state.rectPoints = points.map((items) => items.map(({ x, y, z }) => new THREE.Vector3(x, y, z)))
    state.imageTexture = getImageTexture(video_poster_src)

    if (videoElement) {
      state.videoElement = videoElement
    }

    const texture = await getVideoTexture(state.videoSource, state.videoElement, () => !disposed && current === generation)
    if (disposed || current !== generation) {
      texture.image.muted = true
      texture.image.pause()
      URL.revokeObjectURL(texture.image.src)
      texture.dispose()
      return
    }
    if (state.videoTexture) {
      state.videoTexture.image.pause()
      URL.revokeObjectURL(state.videoTexture.image.src)
      state.videoTexture.dispose()
    }
    state.videoTexture = texture

    if (data.enable) enable()
  }

  on('modeChange', () => setMuted(true))

  on('wantsTapGesture', (raycaster) => {
    if (!state.enabled) return
    const [intersect] = raycaster.intersectObjects(five.scene.children, true)
    if (!!intersect && /^video/.test(intersect.object.name)) {
      if (state.videoTexture) setMuted(!state.videoTexture.image.muted, true)
      return false
    }
  })

  on('panoArrived', () => {
    if (!state.enabled) return
    if (getMuted()) return
    const cameraPosition = five.camera.position

    const visible = state.rectPoints.find((points) => {
      const centerVector = points.reduce(
        (total, curr) =>
          new THREE.Vector3(
            total.x + curr.x / points.length,
            total.y + curr.y / points.length,
            total.z + curr.z / points.length,
          ),
        new THREE.Vector3(),
      )

      return (
        points
          .map(
            (point) =>
              new THREE.Vector3(
                (point.x + centerVector.x) / 2,
                (point.y + centerVector.y) / 2,
                (point.z + centerVector.z) / 2,
              ),
          )
          .filter((vector) => {
            vector = vector.clone().sub(cameraPosition).normalize()
            const raycaster = new THREE.Raycaster(cameraPosition, vector)
            const [intersect] = raycaster.intersectObjects(five.scene.children, true)
            return !!intersect && /^video/.test(intersect.object.name)
          }).length >= 2
      )
    })
    if (!visible) setMuted(true)
  })

  on('renderFrame', () => {
    state.videoMeshes.forEach((meshes) => {
      if (meshes)
        //@ts-ignore
        meshes.needsRender = true
    })
  })

  on('load', (input) => {
    if (input.modelTVVideoData) {
      load(input.modelTVVideoData)
    }
  })

  const dispose = () => {
    disposed = true
    ++generation
    disable()
    controller?.dispose()
    listeners.splice(0).forEach(remove => remove())
    state.imageTexture?.dispose()
    if (state.videoTexture) {
      URL.revokeObjectURL(state.videoTexture.image.src)
      state.videoTexture.dispose()
    }
  }
  return { enable, disable, load, dispose }
}

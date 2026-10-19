import { FivePlugin } from '@realsee/five-webgpu'
import * as THREE from 'three/webgpu'
import { Scene, Vector3 } from 'three/webgpu'
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import evenNumber from './evenNumber'
import centerPoint from './centerPoint'
import transformPositionToVector3 from './transformPositionToVector3'
import createResizeObserver from './createResizeObserver'

export interface Vector3Position {
  x: number
  y: number
  z: number
}

export type CSS3DRenderPluginParameterType = undefined
export interface CSS3DRenderPluginExportType {
  create3DDomContainer: (
    points: Vector3[] | Vector3Position[],
    config?: { ratio?: number; dpr?: number; autoRender?: boolean; container?: HTMLElement; [key: string]: any } & (
      | { mode?: 'front' }
      | { mode: 'behind'; behindFiveContainer: HTMLElement }
    ),
  ) => { container: HTMLElement; dispose: () => void; css3DObject: CSS3DObject; render?: () => void } | void
  disposeAll: () => void
}

type CreateContainer = CSS3DRenderPluginExportType['create3DDomContainer']
type CreateContainerConfig = NonNullable<Parameters<CreateContainer>[1]>
interface RenderLayer {
  scene: Scene
  renderer: CSS3DRenderer
  entries: Set<object>
  start: () => void
  stop: () => void
  dispose: () => void
}
interface CSS3DRenderPluginState {
  disposers: Set<() => void>
  front?: RenderLayer
  behind?: RenderLayer
}

/** Renders DOM overlays in a Five scene. One renderer is shared by each front/behind layer. */
export const CSS3DRenderPlugin: FivePlugin<CSS3DRenderPluginParameterType, CSS3DRenderPluginExportType> = (five) => {
  const state: CSS3DRenderPluginState = { disposers: new Set() }

  const createLayer = (wrapper: HTMLElement, fiveElement: HTMLElement): RenderLayer => {
    const scene = new Scene()
    const renderer = new CSS3DRenderer()
    const setSize = () => renderer.setSize(
      evenNumber(fiveElement.clientWidth, { smaller: true }),
      evenNumber(fiveElement.clientHeight, { smaller: true }),
    )
    setSize()
    const resize = createResizeObserver(setSize, fiveElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.userSelect = 'none'
    renderer.domElement.style.pointerEvents = 'none'
    wrapper.appendChild(renderer.domElement)

    let running = false
    let frame: number | undefined
    const layer: RenderLayer = {
      scene,
      renderer,
      entries: new Set(),
      start() {
        if (running) return
        running = true
        resize.observe()
        const render = () => {
          if (!running) return
          renderer.render(scene, five.camera)
          frame = requestAnimationFrame(render)
        }
        render()
      },
      stop() {
        if (!running) return
        running = false
        if (frame !== undefined) cancelAnimationFrame(frame)
        frame = undefined
        resize.unobserve()
      },
      dispose() {
        layer.stop()
        resize.disconnect()
        renderer.domElement.remove()
      },
    }
    return layer
  }

  const create3DDomContainer = (...params: Parameters<CreateContainer>): ReturnType<CreateContainer> => {
    const points = params[0].map(point => point instanceof Vector3 ? point : transformPositionToVector3(point))
    const config = params[1]
    if (points.length < 4) return console.error('points must be equal or greater than 4')
    if (!five.model.loaded) return console.error('five.model.loaded is false')
    const fiveElement = five.getElement()
    if (!fiveElement) return console.error('five.getElement() is empty')

    const ratio = config?.ratio ?? 0.00216
    if (ratio <= 0.00215) console.warn('if you need click css3DElement on safari, ratio must be greater than 0.00215')
    const dpr = config?.dpr ?? 1
    const mode = config?.mode ?? 'front'
    const autoRender = config?.autoRender ?? true
    const container = config?.container ?? document.createElement('div')
    container.classList.add('__Dnalogel-plugin--CSS3DRenderPlugin')
    const { css3DObject, mesh } = createObject(points, { ratio, dpr, container, mode })

    let layer = mode === 'behind' ? state.behind : state.front
    if (!layer) {
      const wrapper = mode === 'behind'
        ? config?.behindFiveContainer ?? fiveElement.parentElement ?? document.body
        : fiveElement.parentElement ?? document.body
      layer = createLayer(wrapper, fiveElement)
      if (mode === 'behind') state.behind = layer
      else state.front = layer
    }

    const entry = {}
    layer.entries.add(entry)
    let rendered = false
    let disposed = false
    const render = () => {
      if (disposed || rendered) return
      rendered = true
      layer!.scene.add(css3DObject)
      if (mesh) five.scene.add(mesh)
      layer!.start()
    }
    const dispose = () => {
      if (disposed) return
      disposed = true
      state.disposers.delete(dispose)
      layer!.entries.delete(entry)
      if (rendered) {
        layer!.scene.remove(css3DObject)
        if (mesh) five.scene.remove(mesh)
      }
      mesh?.geometry.dispose()
      mesh?.material.dispose()
      if (layer!.scene.children.length === 0) layer!.stop()
      if (layer!.entries.size === 0) {
        layer!.dispose()
        if (mode === 'behind' && state.behind === layer) state.behind = undefined
        if (mode === 'front' && state.front === layer) state.front = undefined
      }
    }
    state.disposers.add(dispose)
    if (autoRender) render()
    return { container, dispose, css3DObject, render: autoRender ? undefined : render }
  }

  const createObject = (
    points: Vector3[],
    config: Required<Pick<CreateContainerConfig, 'ratio' | 'dpr' | 'container'>> & Pick<CreateContainerConfig, 'mode'>,
  ) => {
    const { ratio, dpr, container: element, mode } = config
    const planeWidth = points[0].distanceTo(points[1])
    const planeHeight = points[1].distanceTo(points[2])
    const domWidthPx = evenNumber((planeWidth / ratio) * dpr)
    const domHeightPx = evenNumber((planeHeight / ratio) * dpr)
    const css3DObject = new CSS3DObject(element)
    css3DObject.scale.set(ratio, ratio, ratio)
    element.style.width = domWidthPx + 'px'
    element.style.height = domHeightPx + 'px'
    element.style.pointerEvents = 'none'

    const centerPosition = centerPoint(points[0], points[2])
    const vector01 = points[1].clone().sub(points[0])
    const vector12 = points[2].clone().sub(points[1])
    const rotateXAngle = new Vector3(0, 1, 0).angleTo(new Vector3(0, vector12.y, vector12.z))
    const rotateYAngle = new Vector3(1, 0, 0).angleTo(new Vector3(vector01.x, 0, vector01.z))
    const rotateZAngle = vector01.angleTo(new Vector3(vector01.x, 0, vector01.z))
    const rotateX = (vector12.z > 0 ? -1 : 1) * rotateXAngle
    const rotateY = (vector01.z < 0 ? 1 : -1) * rotateYAngle
    const rotateZ = ((vector01.x > 0 && vector01.y < 0) || (vector01.x < 0 && vector01.y > 0) ? -1 : 1) * rotateZAngle
    css3DObject.rotateOnWorldAxis(new Vector3(1, 0, 0), rotateX)
    css3DObject.rotateOnWorldAxis(new Vector3(0, 1, 0), rotateY)
    css3DObject.rotateOnWorldAxis(new Vector3(0, 0, 1), rotateZ)
    css3DObject.position.set(centerPosition.x, centerPosition.y, centerPosition.z)

    let mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicNodeMaterial> | undefined
    if (mode === 'behind') {
      const material = new THREE.MeshBasicNodeMaterial({ opacity: 0, transparent: false, side: THREE.DoubleSide })
      const geometry = new THREE.PlaneGeometry(domWidthPx, domHeightPx)
      mesh = new THREE.Mesh(geometry, material)
      mesh.name = 'CSS3DRenderPlugin-mesh'
      mesh.position.copy(css3DObject.position)
      mesh.rotation.copy(css3DObject.rotation)
      mesh.scale.copy(css3DObject.scale)
    }
    return { css3DObject, mesh }
  }

  return {
    create3DDomContainer,
    disposeAll: () => [...state.disposers].forEach(dispose => dispose()),
  }
}

export default CSS3DRenderPlugin

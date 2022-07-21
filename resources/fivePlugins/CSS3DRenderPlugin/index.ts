import { FivePlugin } from '@realsee/five'
import * as THREE from 'three'
import { Scene, Vector3 } from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import evenNumber from './evenNumber'
import centerPoint from './centerPoint'
import transformPositionToVector3 from './transformPositionToVector3'
import createResizeObserver from './createResizeObserver'

/**
 * 三维向量
 */
 export interface Vector3Position {
  x: number
  y: number
  z: number
}

export type CSS3DRenderPluginParameterType = undefined
export interface CSS3DRenderPluginExportType {
  /**
   * @description: 根据传入的四个点位创建一个3d dom容器，可以通过ReactDom.render()的方式将react组件放到容器中
   * @param {Five} five
   * @param {Vector3[] | Vector3Position[]} points: 矩形四个点坐标
   * @param {number} config.ratio: 1px对应多少米，默认为 0.002，即1px对应2mm
   * @param {number} config.dpr: dpr, 默认为1
   * @param {HTMLElement} config.container: HTMLElement
   * @param {number} config.autoRender: 默认为true，如果需要手动render则传false
   * @param {'front' | 'behind'} config.mode: 两种模式
   * @param {HTMLElement} config.behindFiveContainer: 如果config.mode为'behind'，需要传入容器，并确保此容器位five下方，且中间没有其他dom元素遮挡
   * @return {{ container: HTMLElement; dispose: () => void }}: container: dom容器, dispose: 清理函数
   */
  create3DDomContainer: (
    points: Vector3[] | Vector3Position[],
    config?: { ratio?: number; dpr?: number; autoRender?: boolean; container?: HTMLElement; [key: string]: any } & (
      | { mode?: 'front' }
      | { mode: 'behind'; behindFiveContainer: HTMLElement }
    ),
  ) => { container: HTMLElement; dispose: () => void; css3DObject: CSS3DObject; render?: () => void } | void

  /**
   * @description: 销毁所有的渲染内容
   * @return {void}
   */
  disposeAll: () => void
}

type Create3DDomContainerInterface = CSS3DRenderPluginExportType['create3DDomContainer']
type Create3DDomContainerConfigInterface = NonNullable<Parameters<Create3DDomContainerInterface>[1]>
interface CSS3DRenderPluginState {
  disposeCallbacks: (() => boolean)[]
  frontMode?: {
    scene: Scene
    css3DRenderer: CSS3DRenderer
  }
  behindMode?: {
    scene: Scene
    css3DRenderer: CSS3DRenderer
  }
}

/**
 * **CSS3DRenderPlugin** 提供矩形区域（三维空间四个坐标点），你可以在此矩形区域中渲染 DOM 内容。
 * 实现原理参考[CSS3DRenderer](https://threejs.org/docs/index.html?q=CSS3D#examples/en/renderers/CSS3DRenderer)。
 *
 * @returns
 */
export const CSS3DRenderPlugin: FivePlugin<CSS3DRenderPluginParameterType, CSS3DRenderPluginExportType> = (five) => {
  const state: CSS3DRenderPluginState = { disposeCallbacks: [] }
  const create3DDomContainer = (
    ...params: Parameters<Create3DDomContainerInterface>
  ): ReturnType<Create3DDomContainerInterface> => {
    const points = params[0].map((point) => (point instanceof Vector3 ? point : transformPositionToVector3(point)))
    const config = params[1]
    if (points?.length < 4) return console.error('points must be equal or greater than than 4')
    if (!five?.model?.loaded) return console.error('five.model.loaded is: ', five?.model?.loaded)
    const fiveElement = five.getElement()
    if (!fiveElement) return console.error('five.getElement() is ' + fiveElement)

    const disposers: any[] = []
    const ratio = config?.ratio || 0.00216
    if (ratio <= 0.00215) console.warn('if you need click css3DElement on safari, ratio must be greater than 0.00215')
    const dpr = config?.dpr || 1
    const mode = config?.mode || 'front'
    const autoRender = config?.autoRender ?? true
    const behindFiveContainer = config?.behindFiveContainer || fiveElement.parentElement || document.body
    const container = config?.container || document.createElement('div')
    container.classList.add('__Vreo-plugin--CSS3DRenderPlugin')

    // 获取css3DObject, 如果mode为behind的话，一起获取mesh
    const { css3DObject, mesh } = createObject(points, { ratio, dpr, container, mode })

    // ======= INIT START =======
    let resizeObserver:
      | {
          observe?: () => void
          unobserve?: () => void
        }
      | undefined
    const frontModeUnInited = mode === 'front' && !state.frontMode
    const behindModeUnInited = mode === 'behind' && !state.behindMode
    const inited = !(frontModeUnInited || behindModeUnInited)
    let stopRenderFlag = false
    let requestAnimationFrameId: number | null = null

    if (behindModeUnInited) {
      state.behindMode = { scene: new Scene(), css3DRenderer: new CSS3DRenderer() }
    }
    if (frontModeUnInited) {
      state.frontMode = { scene: new Scene(), css3DRenderer: new CSS3DRenderer() }
    }
    const { scene, css3DRenderer } = mode === 'behind' ? state.behindMode! : state.frontMode!

    const render = (() => {
      if (!inited) {
        const css3DRendererSetSize = () => {
          // 这里evenNumber策略是遇到奇数会加1，不知道为啥会触发滚动条显示，导致fiveElement变小，fiveElement变小又触发了这里的resize，宽高变小，滚动条消失，然后又触发resize。。。无限循环
          // 为了规避上面这种情况，evenNumber设置了一个参数，遇到奇数可选择减一
          const rendererWidth = evenNumber(fiveElement.clientWidth, { smaller: true })
          const rendererHeight = evenNumber(fiveElement.clientHeight, { smaller: true })
          css3DRenderer.setSize(rendererWidth, rendererHeight)
        }
        css3DRendererSetSize()
        resizeObserver = createResizeObserver(css3DRendererSetSize, fiveElement)
        css3DRenderer.domElement.style.position = 'absolute'
        css3DRenderer.domElement.style.top = '0'
        css3DRenderer.domElement.style.userSelect = 'none'
        css3DRenderer.domElement.style.pointerEvents = 'none'

        const renderEveryFrame = () => {
          if (stopRenderFlag) return
          requestAnimationFrameId = requestAnimationFrame(renderEveryFrame)
          css3DRenderer.render(scene!, five.camera)
        }
        return () => {
          scene.add(css3DObject)
          resizeObserver?.observe?.()
          renderEveryFrame()
          if (mode === 'behind' && mesh) {
            five.scene.add(mesh)
            disposers.push(() => mesh && five.scene.remove(mesh))
          }
        }
      } else {
        return () => {
          scene.add(css3DObject)
        }
      }
    })()
    if (frontModeUnInited) {
      const wrapper = fiveElement.parentElement || document.body
      wrapper.appendChild(css3DRenderer.domElement)
    }
    if (behindModeUnInited) {
      const wrapper = behindFiveContainer
      wrapper.appendChild(css3DRenderer.domElement)
    }
    // ======= INIT END =======

    const dispose = () => {
      stopRenderFlag = true
      disposers.forEach((d) => d?.())
      scene.remove(css3DObject)
      if (typeof requestAnimationFrameId === 'number') cancelAnimationFrame(requestAnimationFrameId)
      if (scene.children.length === 0) {
        css3DRenderer.domElement.remove()
        if (mode === 'front') state.frontMode = undefined
        if (mode === 'behind') state.behindMode = undefined
        if (!state.behindMode && !state.frontMode) {
          resizeObserver?.unobserve?.()
        }
      }
      return true
    }
    const idx = state.disposeCallbacks.findIndex((item) => item === dispose)
    if (idx !== -1) {
      state.disposeCallbacks.splice(idx, 1)
    } else {
      state.disposeCallbacks.push(dispose)
    }

    if (autoRender) render()
    return { container, dispose, css3DObject, render: autoRender ? undefined : render }
  }

  const createObject = (
    points: Vector3[],
    config: Required<Pick<Create3DDomContainerConfigInterface, 'ratio' | 'dpr' | 'container'>> &
      Pick<Create3DDomContainerConfigInterface, 'mode'>,
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

    const vector01 = points[1].clone().sub(points[0]) // 点0 -> 点1 的向量
    const vector12 = points[2].clone().sub(points[1]) // 点1 -> 点2 的向量

    // 旋转
    const rotateXAngle = new Vector3(0, 1, 0).angleTo(new Vector3(0, vector12.y, vector12.z))
    const rotateYAngle = new Vector3(1, 0, 0).angleTo(new Vector3(vector01.x, 0, vector01.z))
    const rotateZAngle = vector01.angleTo(new Vector3(vector01.x, 0, vector01.z))
    /**
     * [0,1,0] => [0,0,1]  为rolate Worldx正方向
     * [0,0,1] => [0,1,0]  为rolate Worldy正方向
     * [0,1,1] => [-1,0,0] 为rolate Worldz正方向
     */
    const rotateX = (vector12.z > 0 ? -1 : 1) * rotateXAngle
    const rotateY = (vector01.z < 0 ? 1 : -1) * rotateYAngle
    const rotateZ = ((vector01.x > 0 && vector01.y < 0) || (vector01.x < 0 && vector01.y > 0) ? -1 : 1) * rotateZAngle

    css3DObject.rotateOnWorldAxis(new Vector3(1, 0, 0), rotateX) // x
    css3DObject.rotateOnWorldAxis(new Vector3(0, 1, 0), rotateY) // y
    css3DObject.rotateOnWorldAxis(new Vector3(0, 0, 1), rotateZ) // z

    css3DObject.position.set(centerPosition.x, centerPosition.y, centerPosition.z)

    let mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | undefined
    if (mode === 'behind') {
      const material = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: false,
        side: THREE.DoubleSide,
      })
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
    disposeAll: () => {
      state.disposeCallbacks.forEach((d) => d?.())
      state.disposeCallbacks = []
    },
  }
}

export default CSS3DRenderPlugin

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => ({
  controller: undefined as any,
  context: undefined as any,
  renderers: [] as any[],
  pending: false,
  observers: new Set<any>(),
}))
vi.mock('vreo-audit/Player/hooks', async () => {
  const React = await import('react')
  h.context = React.createContext<any>(undefined)
  return { useController: () => React.useContext(h.context) }
})
vi.mock('three/webgpu', async () => {
  const actual = await vi.importActual<typeof import('three/webgpu')>('three/webgpu')
  // JSDOM cannot create a GPU device/context. Only this renderer platform I/O
  // is a carrier; actual Scene, camera, Mesh, node material, media and disposal run.
  class RendererPlatform {
    domElement = document.createElement('canvas')
    backend: { isWebGPUBackend?: boolean; isWebGLBackend?: boolean }
    disposed = 0
    parameters: any
    resolveInit!: () => void
    rejectInit!: (reason: Error) => void
    initialization: Promise<void>
    constructor(parameters: any) {
      this.parameters = parameters
      this.backend = parameters.forceWebGL ? { isWebGLBackend: true } : { isWebGPUBackend: true }
      this.initialization = h.pending
        ? new Promise((resolve, reject) => {
            this.resolveInit = resolve
            this.rejectInit = reject
          })
        : Promise.resolve()
      h.renderers.push(this)
    }
    init() {
      return this.initialization
    }
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {
      this.disposed++
    }
  }
  return { ...actual, WebGPURenderer: RendererPlatform }
})

import { VideoAgent } from 'vreo-audit/Player/modules/VideoAgent'
import { VideoAgentMesh } from 'vreo-audit/Player/modules/VideoAgent/VideoAgentMesh'
import { hasResizeListener } from 'vreo-audit/shared-utils/addResizeListener'

let root: Root | undefined
let container: HTMLDivElement
const frames = () => (globalThis as any).__VREO_VIDEOAGENT_RAF__.frames as Map<number, FrameRequestCallback>
function controller(gl2: boolean) {
  return {
    five: { renderer: { backend: gl2 ? { isWebGLBackend: true } : { isWebGPUBackend: true } } },
    playback: { capture: () => undefined },
    videoAgentScene: undefined,
  }
}
function view(options?: any) {
  return (
    <h.context.Provider value={h.controller}>
      <VideoAgent options={options} />
    </h.context.Provider>
  )
}
async function mount(gl2 = true) {
  h.controller = controller(gl2)
  await act(async () => root!.render(view()))
  return h.controller.videoAgentScene as any
}
async function unmount() {
  await act(async () => {
    root!.unmount()
    root = undefined
  })
}
beforeEach(() => {
  h.renderers.length = 0
  h.pending = false
  h.observers.clear()
  frames().clear()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor() {
        h.observers.add(this)
      }
      observe() {}
      disconnect() {
        h.observers.delete(this)
      }
    },
  )
  // Only native media I/O unavailable in JSDOM; actual element sources and
  // VideoAgentMesh lifecycle/owned resource disposal are not supplied by mocks.
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined)
  vi.stubGlobal('navigator', { gpu: {} })
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(async () => {
  if (root) await unmount()
  document.body.innerHTML = ''
  frames().clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('follows a real host-backend decision for GL2 even when navigator.gpu exists', async () => {
  const scene = await mount(true)
  expect(navigator.gpu).toBeDefined()
  expect(scene.videoAgentMesh).toBeInstanceOf(VideoAgentMesh)
  expect(h.renderers[0].parameters.forceWebGL).toBe(true)
  expect(h.renderers[0].parameters.alpha).toBe(true)
  expect(scene.renderer.backend.isWebGLBackend).toBe(true)
  expect(frames().size).toBe(1)
})
it('keeps the GPU host on the GPU route without forcing GL2', async () => {
  const scene = await mount(false)
  expect(h.renderers[0].parameters.forceWebGL).not.toBe(true)
  expect(scene.renderer.backend.isWebGPUBackend).toBe(true)
  expect(frames().size).toBe(1)
})
it('preserves default renderer selection when a public Five has not initialized its renderer yet', async () => {
  h.controller = { five: {}, playback: { capture: () => undefined }, videoAgentScene: undefined }
  await act(async () => root!.render(view()))
  expect(h.renderers).toHaveLength(1)
  expect(h.renderers[0].parameters.forceWebGL).not.toBe(true)
  expect(frames().size).toBe(1)
})
it('also directly follows the GL2 host when navigator.gpu is absent', async () => {
  vi.stubGlobal('navigator', {})
  await mount(true)
  expect(h.renderers[0].parameters.forceWebGL).toBe(true)
})
it('ordinary rerenders retain one existing Scene/effect owner and one RAF', async () => {
  const scene = await mount(true)
  await act(async () => root!.render(view({ preload: false })))
  expect(h.controller.videoAgentScene).toBe(scene)
  expect(h.renderers).toHaveLength(1)
  expect(h.renderers[0].disposed).toBe(0)
  expect(frames().size).toBe(1)
  expect(document.querySelectorAll('.VideoAgent-canvas')).toHaveLength(1)
})
it('normal unmount releases actual Mesh resources, canvas, resize owner and RAF exactly once', async () => {
  const scene = await mount(true)
  const element = scene.renderer.domElement.parentElement!
  const resources = { geometry: 0, material: 0 }
  scene.videoAgentMesh.geometry.addEventListener('dispose', () => resources.geometry++)
  scene.videoAgentMesh.material.addEventListener('dispose', () => resources.material++)
  expect(hasResizeListener(element)).toBe(true)
  await unmount()
  expect(h.controller.videoAgentScene).toBeUndefined()
  expect(resources).toEqual({ geometry: 1, material: 1 })
  expect(h.renderers[0].disposed).toBe(1)
  expect(scene.renderer.domElement.isConnected).toBe(false)
  expect(hasResizeListener(element)).toBe(false)
  expect(h.observers.size).toBe(0)
  expect(frames().size).toBe(0)
  expect(document.querySelectorAll('video')).toHaveLength(0)
})
it('unmount before renderer initialization cannot attach a late RAF or resurrect its canvas', async () => {
  h.pending = true
  const scene = await mount(true)
  expect(frames().size).toBe(0)
  await unmount()
  await act(async () => h.renderers[0].resolveInit())
  expect(h.renderers[0].disposed).toBe(1)
  expect(scene.renderer.domElement.isConnected).toBe(false)
  expect(h.observers.size).toBe(0)
  expect(frames().size).toBe(0)
})
it('initialization failure releases actual owned media/canvas/resize without starting frames', async () => {
  h.pending = true
  const expected = new Error('QA renderer initialization failure')
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  const scene = await mount(true)
  await act(async () => h.renderers[0].rejectInit(expected))
  expect(errors).toHaveBeenCalledWith('VideoAgent renderer initialization failed', expected)
  expect(h.renderers[0].disposed).toBe(1)
  expect(scene.renderer.domElement.isConnected).toBe(false)
  expect(h.observers.size).toBe(0)
  expect(frames().size).toBe(0)
  expect(document.querySelectorAll('video')).toHaveLength(0)
  await unmount()
  expect(h.renderers[0].disposed).toBe(1)
})
it('controller replacement releases its old Scene and follows the new backend once', async () => {
  const first = await mount(false)
  h.controller = controller(true)
  await act(async () => root!.render(view()))
  expect(first.renderer.domElement.isConnected).toBe(false)
  expect(h.renderers[0].disposed).toBe(1)
  expect(h.renderers).toHaveLength(2)
  expect(h.renderers[1].parameters.forceWebGL).toBe(true)
  expect(frames().size).toBe(1)
  expect(document.querySelectorAll('.VideoAgent-canvas')).toHaveLength(1)
})

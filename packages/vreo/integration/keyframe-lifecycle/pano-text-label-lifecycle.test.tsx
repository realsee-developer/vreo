import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { PerspectiveCamera, Scene } from 'three/webgpu'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const h = vi.hoisted(() => ({
  controller: undefined as any,
  roots: [] as Array<{ container: Element; root: any; unmounts: number }>,
  frames: new Map<number, FrameRequestCallback>(),
  nextFrame: 1,
  resizeListeners: new Set<EventListenerOrEventListenerObject>(),
}))

vi.mock('vreo-audit/Player/hooks', () => ({
  useController: () => h.controller,
  useFiveInstance: () => h.controller.five,
}))

// Actual React 18 roots render the actual label component. This wrapper only
// records calls to their real unmount methods; it never supplies cleanup.
vi.mock('react-dom/client', async () => {
  const actual = await vi.importActual<typeof import('react-dom/client')>('react-dom/client')
  return {
    ...actual,
    createRoot(container: Element, options?: any) {
      const root = actual.createRoot(container, options)
      const record = { container, root, unmounts: 0 }
      const unmount = root.unmount.bind(root)
      root.unmount = () => { ++record.unmounts; unmount() }
      h.roots.push(record)
      return root
    },
  }
})

import { PanoTextLabel } from 'vreo-audit/Player/modules/keyframes/PanoTextLabel'
import { PlaybackLifecycle } from 'vreo-audit/Player/PlaybackLifecycle'
import { Timeline } from 'vreo-audit/timeline'

function createController() {
  const events = new Map<string, Set<(value: any) => void>>()
  const host = document.createElement('div')
  const canvas = document.createElement('canvas')
  Object.defineProperties(canvas, {
    clientWidth: { value: 800 }, clientHeight: { value: 600 },
  })
  host.appendChild(canvas)
  document.body.appendChild(host)
  const camera = new PerspectiveCamera(60, 800 / 600, 0.1, 100)
  const five = { model: { loaded: true }, scene: new Scene(), camera, getElement: () => canvas }
  return {
    five,
    playback: new PlaybackLifecycle(undefined, () => undefined),
    configs: { keyframeMap: {} },
    on(type: string, listener: (value: any) => void) {
      const list = events.get(type) ?? new Set()
      list.add(listener); events.set(type, list)
    },
    off(type: string, listener: (value: any) => void) { events.get(type)?.delete(listener) },
    emit(type: string, value: any) { for (const listener of [...events.get(type) ?? []]) listener(value) },
    listenerCount() { return [...events.values()].reduce((sum, list) => sum + list.size, 0) },
  }
}

function label(text: string, start = 0, end = 8000) {
  return { type: 'PanoTextLabel', start, end, data: { text, fontSize: 16, vertex: { x: 0, y: 0, z: -3 } } }
}

function labels() { return [...document.querySelectorAll('.PanoText-innerText')].map(node => node.textContent) }
function runCSSFrame() {
  const scheduled = [...h.frames.values()]
  h.frames.clear()
  for (const frame of scheduled) frame(performance.now())
}
function labelRoots() {
  return h.roots.filter(({ container }) => container.classList.contains('__Dnalogel-plugin--CSS3DRenderPlugin'))
}

let root: Root | undefined
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  h.roots.length = 0; h.frames.clear(); h.resizeListeners.clear(); h.nextFrame = 1
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = h.nextFrame++; h.frames.set(id, callback); return id
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => h.frames.delete(id))
  vi.stubGlobal('ResizeObserver', undefined)
  const add = window.addEventListener.bind(window), remove = window.removeEventListener.bind(window)
  vi.spyOn(window, 'addEventListener').mockImplementation((type: any, callback: any, options: any) => {
    if (type === 'resize') h.resizeListeners.add(callback)
    return add(type, callback, options)
  })
  vi.spyOn(window, 'removeEventListener').mockImplementation((type: any, callback: any, options: any) => {
    if (type === 'resize') h.resizeListeners.delete(callback)
    return remove(type, callback, options)
  })
  h.controller = createController()
  h.controller.playback.begin(true)
  const container = document.createElement('div'); document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => root!.render(<PanoTextLabel />))
})

afterEach(async () => {
  // Test-only isolation after assertions. This does not make a failing product
  // cleanup pass: all checks happen before this explicit root/DOM restoration.
  await act(async () => {
    root?.unmount(); root = undefined
    for (const record of labelRoots()) if (record.unmounts === 0) record.root.unmount()
  })
  for (const listener of h.resizeListeners) window.removeEventListener('resize', listener)
  h.frames.clear(); h.resizeListeners.clear(); document.body.innerHTML = ''
  vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals()
})

describe('actual PanoTextLabel + actual CSS3DRenderPlugin lifecycle, React 18 DOM', () => {
  it('removes an active CSS3D layer and stops its RAF/resize listener on early unmount', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA early close')))
    expect(labels()).toEqual(['QA early close'])
    expect(h.frames.size).toBe(1)
    expect(h.resizeListeners.size).toBe(1)

    await act(async () => { root!.unmount(); root = undefined })
    expect(h.controller.listenerCount()).toBe(0)
    expect.soft(labels()).toEqual([])
    expect.soft(h.frames.size).toBe(0)
    expect.soft(h.resizeListeners.size).toBe(0)
  })

  it('expires each overlapping label without deleting the later live label', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA A', 0, 4000)))
    await act(async () => vi.advanceTimersByTime(1000))
    await act(async () => h.controller.emit('PanoTextLabel', label('QA B', 1000, 8000)))
    // The real CSS3D renderer appends a new object to its DOM on the next
    // existing layer frame; merely committing React B is not enough.
    await act(async () => runCSSFrame())
    expect(labels()).toEqual(['QA A', 'QA B'])

    await act(async () => vi.advanceTimersByTime(3000))
    expect.soft(labels()).toEqual(['QA B'])
    expect.soft(h.frames.size).toBe(1)

    await act(async () => vi.advanceTimersByTime(4000))
    expect(labels()).toEqual([])
    expect(h.frames.size).toBe(0)
  })

  it('unmounts every real nested React root when its label naturally expires', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA root release')))
    const owned = labelRoots()
    expect(owned).toHaveLength(1)
    expect(owned[0].unmounts).toBe(0)
    await act(async () => vi.advanceTimersByTime(8000))
    expect(labels()).toEqual([])
    expect(owned[0].unmounts).toBe(1)
  })

  it('positive control: a naturally expired single overlay releases the actual CSS3D layer', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA natural control')))
    expect(labels()).toEqual(['QA natural control'])
    expect(h.frames.size).toBe(1)
    await act(async () => vi.advanceTimersByTime(8000))
    expect(labels()).toEqual([])
    expect(h.frames.size).toBe(0)
    expect(h.resizeListeners.size).toBe(0)
  })

  it('uses actual PlaybackLifecycle.cancel to clear labels without unmounting the component', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA cancelled')))
    const owned = labelRoots()
    await act(async () => h.controller.playback.cancel())
    expect.soft(labels()).toEqual([])
    expect.soft(h.frames.size).toBe(0)
    expect.soft(h.resizeListeners.size).toBe(0)
    expect.soft(owned[0].unmounts).toBe(1)
    expect(h.controller.listenerCount()).toBe(1)
    await act(async () => h.controller.playback.cancel())
    expect.soft(owned[0].unmounts).toBe(1)
  })

  it('does not let an old cancelled timer remove the label in a later playback run', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA old run', 0, 2000)))
    const oldRoot = labelRoots()[0]
    await act(async () => vi.advanceTimersByTime(1000))
    await act(async () => h.controller.playback.cancel())
    await act(async () => {
      h.controller.playback.begin(true)
      h.controller.emit('PanoTextLabel', label('QA new run', 1000, 5000))
    })
    await act(async () => runCSSFrame())
    expect.soft(labels()).toEqual(['QA new run'])
    await act(async () => vi.advanceTimersByTime(1000))
    expect.soft(labels()).toEqual(['QA new run'])
    expect.soft(oldRoot.unmounts).toBe(1)
    await act(async () => vi.advanceTimersByTime(3000))
    expect(labels()).toEqual([])
    expect.soft(labelRoots().map(record => record.unmounts)).toEqual([1, 1])
  })

  it('releases the old controller and Five owner when the controller identity changes', async () => {
    await act(async () => h.controller.emit('PanoTextLabel', label('QA old controller')))
    const oldController = h.controller
    const oldRoot = labelRoots()[0]
    h.controller = createController()
    h.controller.playback.begin(true)
    await act(async () => root!.render(<PanoTextLabel />))
    expect(oldController.listenerCount()).toBe(0)
    expect.soft(labels()).toEqual([])
    expect.soft(oldRoot.unmounts).toBe(1)
    await act(async () => h.controller.emit('PanoTextLabel', label('QA new controller')))
    expect.soft(labels()).toEqual(['QA new controller'])
    await act(async () => oldController.playback.cancel())
    expect.soft(labels()).toEqual(['QA new controller'])
    await act(async () => h.controller.playback.cancel())
    expect.soft(labels()).toEqual([])
    expect.soft(labelRoots().map(record => record.unmounts)).toEqual([1, 1])
  })

  it('releases each root once across natural expiry, repeated cancellation and component unmount', async () => {
    const errors = vi.spyOn(console, 'error')
    await act(async () => h.controller.emit('PanoTextLabel', label('QA expires', 0, 1000)))
    await act(async () => vi.advanceTimersByTime(1000))
    await act(async () => h.controller.emit('PanoTextLabel', label('QA closes', 1000, 8000)))
    await act(async () => h.controller.playback.cancel())
    await act(async () => h.controller.playback.cancel())
    await act(async () => { root!.unmount(); root = undefined })
    await act(async () => vi.advanceTimersByTime(10000))
    expect.soft(labelRoots().map(record => record.unmounts)).toEqual([1, 1])
    expect.soft(h.frames.size).toBe(0)
    expect.soft(h.resizeListeners.size).toBe(0)
    expect.soft(vi.getTimerCount()).toBe(0)
    expect(errors).not.toHaveBeenCalled()
  })

  it.skipIf(process.env.VREO_AUDIT_SEEK_ONLY !== '1')(
    'actual current Player.play seek boundary: changing timeline position clears an expired active label',
    async () => {
      const source = process.env.VREO_AUDIT_SOURCE || fileURLToPath(new URL('../../', import.meta.url))
      const require = createRequire(new URL('../../package.json', import.meta.url))
      const ts = require('typescript')
      const loadMethods = (file: string) => {
        const code = ts.transpileModule(readFileSync(file, 'utf8'), {
          compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
        }).outputText
        const exports: any = {}
        vm.runInNewContext(code, {
          exports,
          require: (name: string) => name === '@realsee/five-webgpu'
            ? { Subscribe: class {} }
            : name === 'react' ? React : {},
          console: { log() {} },
        })
        return exports
      }
      // Execute the two real prototype methods without constructing unrelated
      // MobX/VideoAgent/Player UI. Neither fixture method adds a cancel or event.
      const { Controller } = loadMethods(`${source}/resources/Player/Controller.ts`)
      const { Player } = loadMethods(`${source}/resources/Player/index.tsx`)
      const controller = h.controller
      controller.timeline = new Timeline()
      controller.timeline.load([label('QA seek expires')])
      controller.seekTimeline = Controller.prototype.seekTimeline
      controller.playing = true
      controller.videoAgentScene = { videoAgentMesh: { mediaOperations: { currentTime: 0 } } }
      await act(async () => controller.emit('PanoTextLabel', label('QA seek expires')))
      expect(labels()).toEqual(['QA seek expires'])
      await act(async () => Player.prototype.play.call({ disposed: false, controller }, 9000, true))
      expect(controller.videoAgentScene.videoAgentMesh.mediaOperations.currentTime).toBe(9)
      expect(controller.timeline.pendingAt(9000)).toEqual([])
      expect(labels()).toEqual([])
    },
  )
})

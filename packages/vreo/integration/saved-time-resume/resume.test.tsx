import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'zustand'
import { Scene, PerspectiveCamera, Vector2, Matrix4, Quaternion, Vector3 } from 'three/webgpu'
import { Player } from '@realsee/vreo/Player'
import aiInitializer from '@/app/(vr)/_app-shared/stores/ai-player'
import { PlaybackRuntime } from '@/shared/audio-focus/playback'
import { AudioFocusCoordinator } from '@/shared/audio-focus/coordinator'
vi.mock('three/webgpu', async () => {
  const actual = await vi.importActual<any>('three/webgpu')
  // Only unavailable GPU platform I/O is a carrier. Actual Player/Controller,
  // Timeline/PlaybackLifecycle, React keyframes, CSS3D and SDK15 PanoTag execute.
  class RendererPlatform {
    domElement = document.createElement('canvas')
    backend = { isWebGLBackend: true }
    init() {
      return Promise.resolve()
    }
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {}
  }
  return { ...actual, WebGPURenderer: RendererPlatform }
})
const actualTagInstances = vi.hoisted(() => [] as any[])
vi.mock('@realsee/dnalogel/plugins/pano-tag', async () => {
  const actual = await vi.importActual<any>('@realsee/dnalogel/plugins/pano-tag')
  return {
    ...actual,
    PanoTagPlugin(...args: any[]) {
      const instance = actual.PanoTagPlugin(...args)
      actualTagInstances.push(instance)
      return instance
    },
  }
})
let now = 0,
  player: any,
  store: any,
  currentFive: any
const frames = () => (globalThis as any).__RESUME_FRAMES__ as Map<number, FrameRequestCallback>
function fiveCarrier() {
  const host = document.createElement('div'),
    canvas = document.createElement('canvas')
  host.append(canvas)
  document.body.append(host)
  Object.defineProperties(canvas, {
    clientWidth: { value: 800 },
    clientHeight: { value: 600 },
  })
  const listeners = new Map<string, Set<(...args: any[]) => void>>()
  const work = {
    workCode: 'qa-work',
    transform: new Matrix4(),
    observers: [
      {
        index: 0,
        panoIndex: 0,
        position: new Vector3(),
        quaternion: new Quaternion(),
      },
    ],
  }
  const five: any = {
    plugins: {},
    panoIndex: 0,
    currentMode: 'Panorama',
    scene: new Scene(),
    camera: new PerspectiveCamera(60, 800 / 600, 0.1, 100),
    model: { name: 'qa-work', loaded: true },
    models: [],
    renderer: {
      backend: { isWebGLBackend: true },
      getSize: (v: Vector2) => v.set(800, 600),
      getPixelRatio: () => 1,
    },
    imageOptions: {},
    state: {
      mode: 'Panorama',
      workCode: 'qa-work',
      panoIndex: 0,
      longitude: 0,
      latitude: 0,
      fov: 60,
    },
    work,
    works: [work],
    getCurrentState: () => five.state,
    getElement: () => canvas,
    ready: () => Promise.resolve(),
    setState: () => {},
    on(name: string, fn: any) {
      if (!listeners.has(name)) listeners.set(name, new Set())
      listeners.get(name)!.add(fn)
      return () => five.off(name, fn)
    },
    emit(name: string, ...args: any[]) {
      for (const fn of listeners.get(name) ?? []) fn(...args)
    },
    off(name: string, fn: any) {
      listeners.get(name)?.delete(fn)
    },
    once(name: string, fn: any) {
      const once = (...args: any[]) => {
        five.off(name, once)
        fn(...args)
      }
      five.on(name, once)
    },
  }
  return (currentFive = five)
}
const unit = {
  video: { url: '', duration: 10000, avatar: {} },
  configure: { pageTitle: 'QA active interval' },
  keyframes: [
    {
      type: 'PanoTextLabel',
      start: 0,
      end: 8000,
      data: { text: 'QA resume text', vertex: { x: 0, y: 0, z: -3 } },
    },
    {
      type: 'Prompter',
      start: 0,
      end: 8000,
      data: { text: 'QA resume subtitle' },
    },
    {
      type: 'PanoTag',
      start: 0,
      end: 8000,
      data: { text: 'QA resume tag', vertex: { x: 0, y: 0, z: -3 } },
    },
  ],
}
function visible() {
  return {
    text: [...document.querySelectorAll('.PanoText-innerText')].map((x) => x.textContent),
    subtitle:
      document.querySelector('.vreo-prompter:not(.vreo-prompter--hidden) .vreo-prompter-innerText')?.textContent ??
      null,
    body: document.body.textContent,
  }
}
async function frame(time: number) {
  const delta = time - now
  now = time
  await act(async () => {
    vi.advanceTimersByTime(delta)
    const scheduled = [...frames().values()]
    frames().clear()
    for (const cb of scheduled) cb(now)
  })
  await act(async () => {
    currentFive.emit('cameraUpdate')
    currentFive.emit('render.prepare')
  })
  await act(async () => {})
}
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })
  now = 0
  frames().clear()
  actualTagInstances.length = 0
  vi.spyOn(performance, 'now').mockImplementation(() => now)
  vi.spyOn(HTMLMediaElement.prototype, 'ended', 'get').mockImplementation(function () {
    return this.getAttribute('src')?.startsWith('data:audio') ?? false
  })
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  const mediaManager = new PlaybackRuntime(new AudioFocusCoordinator())
  await act(async () => {
    player = new Player(fiveCarrier(), {
      mediaManager,
      autoPreload: false,
      appSize: 'M',
      keyframeMap: {
        ModelVideo: false,
        VideoEffect: false,
        InfoPanel: false,
        PanoEffect: false,
        BgMusic: false,
      },
      videoAgentMeshOptions: { preload: false },
    } as any)
  })
  store = createStore(aiInitializer)
  store.setState({
    vreoPlayer: player,
    sceneDetail: [unit],
    currentSceneIndex: 0,
    scenePlayTimes: {},
    playing: false,
  })
})
afterEach(async () => {
  await act(async () => player?.dispose())
  document.body.innerHTML = ''
  frames().clear()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
function expectVisuals(prefix = 'QA resume') {
  expect.soft(visible().text).toEqual([`${prefix} text`])
  expect.soft(visible().subtitle).toBe(`${prefix} subtitle`)
  expect.soft(document.body.textContent?.replace(/\s/g, ' ')).toContain(`${prefix} tag`)
  const tags = actualTagInstances.flatMap((p) => p.tags)
  expect.soft(tags.map((t) => t.data.title)).toEqual([`${prefix} tag`])
  expect.soft(tags.every((t) => t.currentVisible && t.state.unfolded && t.screenPosition)).toBe(true)
}
function expectCleared() {
  expect(visible().text).toEqual([])
  expect(visible().subtitle).toBeNull()
  expect(actualTagInstances.flatMap((p) => p.tags)).toEqual([])
}
function snapshot(label: string) {
  console.log(
    'CONTRACT',
    JSON.stringify({
      label,
      time: player.getCurrentTime(),
      playing: store.getState().playing,
      saved: store.getState().scenePlayTimes,
      ...visible(),
      actualTags: actualTagInstances.flatMap((p) =>
        p.tags.map((t) => ({
          title: t.data.title,
          visible: t.currentVisible,
          unfolded: t.state.unfolded,
          screen: t.screenPosition,
        })),
      ),
    }),
  )
}
describe('actual public Player and actual Next store saved-time resume', () => {
  it('cold start renders actual text subtitle and SDK15 Svelte tag', async () => {
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    expectVisuals()
    expect(player.getCurrentTime()).toBe(80)
    expect(store.getState().playing).toBe(true)
    snapshot('cold-positive')
  })
  it('a short pause inside the 100ms selection boundary restores all three actual visuals', async () => {
    await act(async () => store.getState().playVreo(true))
    await frame(20)
    await frame(40)
    await frame(60)
    await frame(80)
    expectVisuals()
    await act(async () => store.getState().pauseVreo())
    expect(store.getState().scenePlayTimes[0]).toBe(80)
    expectCleared()
    await act(async () => store.getState().playVreo(true))
    await frame(90)
    await frame(110)
    expect(player.getCurrentTime()).toBe(110)
    expect(store.getState().playing).toBe(true)
    snapshot('short-resume-positive')
    expectVisuals()
  })
  it('restores text subtitle and tag still active at saved 2500ms', async () => {
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    expectVisuals()
    await frame(2500)
    await act(async () => store.getState().pauseVreo())
    expect(store.getState().scenePlayTimes[0]).toBe(2500)
    expectCleared()
    snapshot('paused-active-interval')
    await act(async () => store.getState().playVreo(true))
    await frame(2540)
    await frame(2580)
    expect(player.getCurrentTime()).toBe(2580)
    expect(store.getState().playing).toBe(true)
    snapshot('mid-interval-resume')
    expectVisuals()
  })
  it('resuming after expired cues still emits future cues and never revives expired ones', async () => {
    const nextUnit = {
      ...unit,
      keyframes: [
        ...unit.keyframes.map((k) => ({ ...k, end: 2000 })),
        ...unit.keyframes.map((k) => ({
          ...k,
          start: 3000,
          data: {
            ...k.data,
            text: k.data.text.replace('QA resume', 'QA future'),
          },
        })),
      ],
    }
    store.setState({ sceneDetail: [nextUnit] })
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    expectVisuals()
    await frame(2500)
    await act(async () => store.getState().pauseVreo())
    expect(store.getState().scenePlayTimes[0]).toBe(2500)
    expectCleared()
    await act(async () => store.getState().playVreo(true))
    await frame(2540)
    await frame(2580)
    expectCleared()
    await frame(3000)
    await frame(3040)
    snapshot('future-cue-positive')
    expectVisuals('QA future')
    expect(document.body.textContent?.replace(/\s/g, ' ')).not.toContain('QA resume tag')
  })
  it('restored visuals expire at the original media end and the tag keeps only its existing fold grace', async () => {
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    await frame(2500)
    await act(async () => store.getState().pauseVreo())
    await act(async () => store.getState().playVreo(true))
    await frame(2540)
    await frame(2580)
    expectVisuals()
    await frame(7999)
    expectVisuals()
    await frame(8000)
    expect(visible().text).toEqual([])
    expect(visible().subtitle).toBeNull()
    const tag = actualTagInstances.flatMap((p) => p.tags)[0]
    expect(tag).toBeDefined()
    expect(tag.state.unfolded).toBe(false)
    await frame(9499)
    expect(actualTagInstances.flatMap((p) => p.tags)).toHaveLength(1)
    await frame(9500)
    expectCleared()
  })
  it('two pause/resume cycles preserve the saved position, one owner and remaining media lifetime', async () => {
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    await frame(2000)
    await act(async () => store.getState().pauseVreo())
    await frame(3000)
    expect(player.getCurrentTime()).toBe(2000)
    await act(async () => store.getState().playVreo(true))
    await frame(3040)
    await frame(3080)
    expectVisuals()
    await frame(3200)
    await act(async () => store.getState().pauseVreo())
    expect(store.getState().scenePlayTimes[0]).toBe(2200)
    expectCleared()
    await frame(3900)
    await act(async () => store.getState().playVreo(true))
    await frame(3940)
    await frame(3980)
    expectVisuals()
    expect(player.getCurrentTime()).toBe(2280)
    await frame(9699)
    expect(player.getCurrentTime()).toBe(7999)
    expectVisuals()
    await frame(9700)
    expect(visible().text).toEqual([])
    expect(visible().subtitle).toBeNull()
    expect(actualTagInstances.flatMap((p) => p.tags)[0].state.unfolded).toBe(false)
  })
  it('restoring overlapping intervals keeps all text layers and the existing last subtitle/tag policy', async () => {
    const overlapping = {
      ...unit,
      keyframes: [
        ...unit.keyframes,
        ...unit.keyframes.map((k) => ({
          ...k,
          start: 1000,
          data: { ...k.data, text: k.data.text.replace('QA resume', 'QA overlap') },
        })),
      ],
    }
    store.setState({ sceneDetail: [overlapping], scenePlayTimes: { 0: 2500 } })
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    expect(player.getCurrentTime()).toBe(2580)
    expect(visible().text).toEqual(['QA resume text', 'QA overlap text'])
    expect(visible().subtitle).toBe('QA overlap subtitle')
    const tags = actualTagInstances.flatMap((p) => p.tags)
    expect(tags.map((t) => t.data.title)).toEqual(['QA overlap tag'])
    expect(tags[0].currentVisible).toBe(true)
    expect(tags[0].state.unfolded).toBe(true)
    expect(document.body.textContent?.replace(/\s/g, ' ')).toContain('QA overlap tag')
  })
  it('restoring visual intervals does not replay old action events while future actions still fire', async () => {
    const events: number[] = []
    player.on('CameraMovement', (_keyframe: any, time: number) => events.push(time))
    const actions = {
      ...unit,
      keyframes: [
        ...unit.keyframes,
        { type: 'CameraMovement', start: 0, end: 8000, data: { panoIndex: 0 } },
        { type: 'CameraMovement', start: 3000, end: 4000, data: { panoIndex: 0 } },
      ],
    }
    // Real CameraMovement registers against the Five event carrier; these
    // assertions concern real public event delivery, not native camera pixels.
    store.setState({ sceneDetail: [actions] })
    await act(async () => store.getState().playVreo(true))
    await frame(40)
    await frame(80)
    expect(events).toEqual([40])
    await frame(2500)
    await act(async () => store.getState().pauseVreo())
    await act(async () => store.getState().playVreo(true))
    await frame(2540)
    await frame(2580)
    expectVisuals()
    expect(events).toEqual([40])
    await frame(3000)
    await frame(3040)
    expect(events).toEqual([40, 3000])
  })
})

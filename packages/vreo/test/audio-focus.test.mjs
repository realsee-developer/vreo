import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
const require = createRequire(import.meta.url)
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript')
function load(path, imports = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, { exports, require: name => imports[name], AbortController, performance, URL, ...globals })
  return exports
}
const { PlaybackLifecycle } = load('../resources/Player/PlaybackLifecycle.ts')
test('narration delegates one session and binds mixed members through it', () => {
  let cancel, requests = [], grouped = 0, bindings = []
  const abort = new AbortController()
  const childManager = {}
  const session = { signal: abort.signal, get mediaManager() { grouped++; return childManager },
    bind(element) { bindings.push(element); return element }, finish() {} }
  const manager = { createController({ onCancel }) { cancel = () => { abort.abort(); onCancel() }; return {
    begin(request) { requests.push(request); return session }, cancel, dispose: cancel,
  } } }
  let stopped = 0
  const group = new PlaybackLifecycle(manager, () => stopped++)
  assert.equal(group.begin(true), true)
  const run = group.capture()
  const a = {}, b = {}
  run.bind(a); run.bind(b)
  group.add(() => stopped++)
  group.add(() => stopped++)
  assert.deepEqual(requests.map(x => [x.userAction, x.audible]), [[true, true]])
  assert.equal(grouped, 1)
  assert.equal(run.mediaManager, childManager)
  assert.deepEqual(bindings, [a,b])
  cancel()
  assert.equal(stopped, 3)
  assert.equal(run.valid(), false)
})
test('captured native run remains invalid after a later narration begins', () => {
  const group = new PlaybackLifecycle(undefined, () => {})
  group.begin(true)
  const old = group.capture()
  group.cancel()
  group.begin(true)
  assert.equal(old.valid(), false)
  assert.equal(group.capture().valid(), true)
  group.dispose()
  assert.equal(group.begin(true), false)
})
test('host denial never starts a narration', () => {
  const group = new PlaybackLifecycle({ createController() { return { begin: () => null, cancel() {}, dispose() {} } } }, () => {})
  assert.equal(group.begin(false), false)
  assert.equal(group.active, false)
})
test('AudioLike repeated play has one frame loop, pause cancels it', () => {
  const loops = new Set()
  class Subscribe { emit() {} on() {} off() {} }
  const { AudioLike } = load('../resources/shared-utils/AudioLike.ts', {
    '@realsee/five': { Subscribe },
    './animationFrame': { requestAnimationFrameInterval(fn) { loops.add(fn); return () => loops.delete(fn) } },
  })
  const audio = new AudioLike({ duration: 100 })
  audio.play(); audio.play()
  assert.equal(loops.size, 1)
  audio.pause()
  assert.equal(loops.size, 0)
})

function meshFixture(blob) {
  const { VideoAgentMesh } = load('../resources/Player/modules/VideoAgent/VideoAgentMesh.ts', {
    three: { Mesh: class {} }, mobx: {},
    '../../../shared-utils/Preloader': { Preloader: { blob } },
    '../../../shared-utils/AudioLike': {},
    '../../../shared-utils/getMediaInfo': { getMediaType: () => 'audio' },
  })
  const audio = { muted: true, pause() {}, play() { this.plays++; return Promise.resolve() }, plays: 0,
    setAttribute() {}, addEventListener() {}, removeEventListener() {} }
  const mesh = Object.assign(Object.create(VideoAgentMesh.prototype), {
    generation: 0, videoUrl: '', outputs: new Map(), options: { videoInstance: { pause() {} } },
    audioInstance: audio, audioLikeInstance: { pause() {} }, material: { uniforms: { enable: { value: 0 } } },
  })
  return { mesh, audio }
}
test('VideoAgent stop cancels a pending resource load before play', async () => {
  let finish
  const { mesh, audio } = meshFixture(() => new Promise(resolve => { finish = resolve }))
  const playing = mesh.play('voice.mp3')
  mesh.stop()
  finish(new Blob(['audio']))
  assert.equal(await playing, false)
  assert.equal(audio.plays, 0)
  assert.equal(audio.muted, true)
})
test('VideoAgent native play settlement cannot unmute after stop', async () => {
  const { mesh, audio } = meshFixture(() => Promise.resolve(new Blob(['audio'])))
  mesh.videoUrl = 'voice.mp3'
  let finish
  audio.play = () => new Promise(resolve => { finish = resolve })
  const playing = mesh.play()
  mesh.stop()
  finish()
  assert.equal(await playing, false)
  assert.equal(audio.muted, true)
})

test('member stop failure still stops other members and rejects the transition', () => {
  const group = new PlaybackLifecycle(undefined, () => {})
  group.begin(true)
  let stopped = false
  group.add(() => { throw new Error('failed stop') })
  group.add(() => { stopped = true })
  assert.throws(() => group.cancel(), /failed stop/)
  assert.equal(stopped, true)
  assert.equal(group.active, false)
})

test('VideoEffect expiry cancels readiness callbacks while narration stays active', async () => {
  const effects = [], callbacks = new Map(), timers = new Map()
  let timerId = 0, plays = 0
  const video = {
    muted: true, src: '', pause() {}, load() {}, remove() {}, setAttribute() {},
    play() { plays++; return Promise.resolve() },
    addEventListener(name, callback) { callbacks.set(name, callback) },
    removeEventListener(name, callback) { if (callbacks.get(name) === callback) callbacks.delete(name) },
  }
  const group = new PlaybackLifecycle(undefined, () => {})
  group.begin(true)
  const events = new Map()
  const controller = { playback: group, configs: {}, on(name, callback) { events.set(name, callback) }, off() {} }
  let refIndex = 0
  const React = {
    useRef(value) { return { current: refIndex++ === 0 ? { append() {} } : value } },
    useEffect(callback) { effects.push(callback) }, useState() { return [false, () => {}] }, createElement() {},
  }
  const { VideoEffect } = load('../resources/Player/modules/keyframes/VideoEffect/index.tsx', {
    react: React, classnames: { default: () => '' },
    '../../../../typings/VreoUnit': { VreoKeyframeEnum: { VideoEffect: 'VideoEffect' } },
    '../../../hooks': { useController: () => controller, useFiveInstance: () => ({ setState() {} }) },
  }, { document: { createElement: () => video },
    setTimeout(callback) { timers.set(++timerId, callback); return timerId }, clearTimeout(id) { timers.delete(id) } })
  VideoEffect()
  const cleanup = effects.map(effect => effect())
  await events.get('VideoEffect')({ start: 0, end: 10, data: { videoSrc: 'slow.mp4' } })
  const lateReady = callbacks.get('canplaythrough')
  for (const callback of [...timers.values()]) callback()
  lateReady()
  assert.equal(plays, 0)
  assert.equal(callbacks.has('canplaythrough'), false)
  assert.equal(group.active, true)
  cleanup.forEach(fn => fn?.())
})

test('VideoAgent uses injected operations for play and never unmutes an expired session', async () => {
  const { mesh, audio } = meshFixture(() => Promise.resolve(new Blob(['audio'])))
  mesh.videoUrl = 'voice.mp3'
  const abort = new AbortController()
  let finish, controlledPlays = 0, unmuted = 0
  const operations = {
    muted: true, pause() {}, currentTime: 0,
    play() { controlledPlays++; return new Promise(resolve => { finish = resolve }) },
  }
  Object.defineProperty(operations, 'muted', { get() { return true }, set(value) { if (!value) unmuted++ } })
  const run = { valid: () => !abort.signal.aborted, bind: () => operations }
  mesh.options.getPlayback = () => run
  const playing = mesh.play()
  assert.equal(controlledPlays, 1)
  assert.equal(audio.plays, 0)
  abort.abort()
  finish()
  assert.equal(await playing, false)
  assert.equal(unmuted, 0)
})

test('finish notifies local members and finishes exactly the captured parent session', () => {
  let finished = 0, stops = 0
  const session = { signal: new AbortController().signal, mediaManager: {}, finish() { finished++ }, bind(x) { return x } }
  const manager = { createController() { return { begin() { return session }, cancel() {}, dispose() {} } } }
  const group = new PlaybackLifecycle(manager, () => stops++)
  group.begin(true)
  const captured = group.capture()
  group.add(() => stops++)
  group.finish()
  assert.equal(finished, 1)
  assert.equal(stops, 2)
  assert.equal(captured.valid(), false)
})

for (const replaced of [false, true]) {
  test(`Player load AbortError ${replaced ? 'does not cancel a newer narration' : 'cancels the active narration'}`, async () => {
    const { Player } = load('../resources/Player/index.tsx', {
      '@realsee/five': { Subscribe: class { emit() {} } },
      '../shared-utils/Audio': { waitForBlankAudioGenerated: async () => {} },
    }, { location: { search: '' } })
    const group = new PlaybackLifecycle(undefined, () => {})
    let reject
    const controller = {
      playback: group, clear() {}, setLoading() {}, emit() {}, setAvatar() {},
      videoAgentScene: { videoAgentMesh: { play: () => new Promise((_, fail) => { reject = fail }) } },
    }
    const player = Object.assign(Object.create(Player.prototype), {
      controller, configs: {}, $five: { imageOptions: {} }, loadGeneration: 0, disposed: false,
    })
    const result = player.load({ video: { url: 'voice.mp3', duration: 1 }, keyframes: [] })
    await new Promise(resolve => setImmediate(resolve))
    if (replaced) { group.cancel(); group.begin(true) }
    const error = new DOMException('native interrupted', 'AbortError')
    reject(error)
    if (replaced) assert.equal(await result, false)
    else await assert.rejects(result, error)
    assert.equal(group.active, replaced)
  })
  test(`Controller resume AbortError ${replaced ? 'does not cancel a newer narration' : 'cancels the active narration'}`, async () => {
    const { Controller } = load('../resources/Player/Controller.ts', {
      '@realsee/five': { Subscribe: class {} }, react: { createContext() {} },
    }, { console: { error() {} } })
    const group = new PlaybackLifecycle(undefined, () => {})
    group.begin(true)
    let reject
    const controller = Object.assign(Object.create(Controller.prototype), {
      playback: group, playing: true, resuming: undefined, resumeGeneration: 0,
      videoAgentScene: { videoAgentMesh: {
        mediaInstance: { paused: true }, play: () => new Promise((_, fail) => { reject = fail }),
      } },
    })
    controller.resumeMedia()
    if (replaced) { group.cancel(); group.begin(true) }
    reject(new DOMException('native interrupted', 'AbortError'))
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(group.active, replaced)
  })
}

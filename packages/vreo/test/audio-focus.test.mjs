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
const { NarrationAudioFocus } = load('../resources/Player/AudioFocus.ts')
test('narration permits internal mixing and synchronously stops every member', () => {
  let externalStops, acquisitions = 0
  const host = { register({ stop }) { externalStops = stop; return {
    acquire() { acquisitions++; return { isCurrent: () => true, signal: new AbortController().signal, release() {} } },
    cancel() {}, dispose() {},
  } } }
  let stopped = 0
  const group = new NarrationAudioFocus(host, () => stopped++)
  group.acquire('user')
  const a = group.host.register({ label: 'a', stop() { stopped++ } }).acquire('auto')
  const b = group.host.register({ label: 'b', stop() { stopped++ } }).acquire('user')
  assert.equal(acquisitions, 1)
  assert.equal(a.isCurrent() && b.isCurrent(), true)
  externalStops('preempted')
  assert.equal(stopped, 3)
  assert.equal(a.isCurrent() || b.isCurrent(), false)
  assert.equal(a.signal.aborted && b.signal.aborted, true)
})
test('late child completion cannot release a new narration', () => {
  const group = new NarrationAudioFocus(undefined, () => {})
  group.acquire('user')
  const source = group.host.register({ label: 'video', stop() {} })
  const old = source.acquire('auto')
  const deferred = group.capture()
  group.cancel('paused')
  assert.equal(source.acquire('auto'), null)
  group.acquire('user')
  const current = source.acquire('auto')
  old.release()
  assert.equal(deferred(), false)
  assert.equal(current.isCurrent(), true)
  source.dispose()
  assert.equal(source.acquire('user'), null)
})
test('auto denial never starts a narration', () => {
  const group = new NarrationAudioFocus({ register() { return { acquire: () => null, cancel() {}, dispose() {} } } }, () => {})
  assert.equal(group.acquire('auto'), false)
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
    generation: 0, videoUrl: '', options: { canPlay: () => true, videoInstance: { pause() {} } },
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
  const group = new NarrationAudioFocus(undefined, () => {})
  group.acquire('user')
  let stopped = false
  group.add(() => { throw new Error('failed stop') })
  group.add(() => { stopped = true })
  assert.throws(() => group.cancel('preempted'), /failed stop/)
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
  const group = new NarrationAudioFocus(undefined, () => {})
  group.acquire('user')
  const events = new Map()
  const controller = { audioFocus: group, configs: {}, on(name, callback) { events.set(name, callback) }, off() {} }
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

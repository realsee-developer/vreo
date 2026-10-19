import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript')
function load(path, imports = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, { exports, require: name => imports[name] })
  return exports
}
class Subscribe {
  listeners = new Map()
  on(name, callback) { this.listeners.set(name, callback) }
  emit(name, ...args) { this.listeners.get(name)?.(...args) }
}
function media() {
  const listeners = new Map()
  return { paused: true, currentTime: 0, duration: 1, src: '', removed: false,
    addEventListener(name, callback) { listeners.set(name, callback) },
    removeEventListener(name, callback) { if (listeners.get(name) === callback) listeners.delete(name) },
    play() { this.paused = false; listeners.get('play')?.(); return Promise.resolve() },
    pause() { this.paused = true; listeners.get('pause')?.() },
    remove() { this.removed = true },
    fire(name, value) { listeners.get(name)?.(value) },
  }
}
const ticks = []
const { PlayController } = load('../resources/PlayController/index.ts', {
  '@realsee/five-webgpu': { Subscribe }, '../timeline': load('../resources/timeline/index.ts'),
  '../shared-utils/animationFrame': { requestAnimationFrameInterval(callback) { ticks.push(callback); return () => {} } },
  './createHTMLAudioElement': { createHTMLAudioElement: media },
})

test('PlayController instances own listeners and pending play independently', async () => {
  const firstMedia = media(), secondMedia = media()
  const first = new PlayController({ audio: firstMedia })
  const second = new PlayController({ audio: secondMedia })
  let firstEvents = 0, secondEvents = 0
  first.on('playing', () => firstEvents++)
  second.on('playing', () => secondEvents++)
  await first.play()
  assert.deepEqual([firstEvents, secondEvents], [1, 0])
  first.dispose()
  secondMedia.fire('play')
  assert.deepEqual([firstEvents, secondEvents], [1, 1])
  assert.equal(firstMedia.removed, false)
  second.dispose()
})

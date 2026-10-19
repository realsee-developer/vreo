import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript')

function load(path, imports = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, { exports, require: name => imports[name], ...globals })
  return exports
}

const { Timeline } = load('../resources/timeline/index.ts')

test('timeline dispatch is deterministic without mutating input', () => {
  const keyframes = [
    { type: 'Prompter', start: 100, end: 500, data: {} },
    { type: 'BgMusic', start: 100, end: 1000, data: {} },
  ]
  const snapshot = structuredClone(keyframes)
  const timeline = new Timeline()
  timeline.load(keyframes)

  assert.deepEqual(timeline.take(150).map(frame => frame.type), ['Prompter', 'BgMusic'])
  assert.deepEqual(timeline.take(150), [])
  assert.deepEqual(keyframes, snapshot)

  timeline.reset('BgMusic')
  assert.deepEqual(timeline.take(700).map(frame => frame.type), ['BgMusic'])

  timeline.seek(100)
  assert.deepEqual(timeline.take(100).map(frame => frame.type), ['Prompter', 'BgMusic'])
  timeline.seek(501)
  assert.deepEqual(timeline.take(501).map(frame => frame.type), ['BgMusic'])
  assert.deepEqual(keyframes, snapshot)
})

test('timeline preserves expiry and legacy parsed input semantics', () => {
  const parsed = { type: 'Prompter', start: 0, end: 1000, parsed: true, data: {} }
  const expired = { type: 'Prompter', start: 0, end: 50, data: {} }
  const late = { type: 'Prompter', start: 0, end: 1000, data: {} }
  const lateAction = { type: 'CameraMovement', start: 0, end: 1000, data: {} }
  const timeline = new Timeline()
  timeline.load([parsed, expired, late, lateAction])
  assert.deepEqual(timeline.take(200), [late])
  assert.deepEqual(timeline.take(200), [])
  timeline.reset()
  assert.deepEqual(timeline.take(0).length, 4)
})

test('animation frame module imports without window', () => {
  const scheduled = []
  const animation = load('../resources/shared-utils/animationFrame/index.ts', {}, {
    globalThis: {}, performance: { now: () => 1 },
    setTimeout(callback) { scheduled.push(callback); return scheduled.length },
    clearTimeout() {},
  })
  const stop = animation.requestAnimationFrameInterval(() => {})
  assert.equal(typeof stop, 'function')
  stop()
})

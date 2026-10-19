import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const ts = require(process.env.TYPESCRIPT_PATH || 'typescript')
function load(path, imports, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, { exports, require: name => imports[name], console, ...globals })
  return exports
}

function element() {
  return {
    children: [], style: {}, classList: { add() {} }, clientWidth: 801, clientHeight: 601,
    appendChild(child) { this.children.push(child); child.parentElement = this },
    append(child) { this.appendChild(child) },
    remove() {
      this.removed = true
      if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(item => item !== this)
    },
  }
}
class Vector3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z }
  clone() { return new Vector3(this.x, this.y, this.z) }
  sub(value) { this.x -= value.x; this.y -= value.y; this.z -= value.z; return this }
  distanceTo(value) { return Math.hypot(this.x - value.x, this.y - value.y, this.z - value.z) }
  angleTo() { return 0 }
  set(x, y, z) { this.x = x; this.y = y; this.z = z }
  copy(value) { Object.assign(this, value); return this }
}
class Scene {
  children = []
  add(value) { if (!this.children.includes(value)) this.children.push(value) }
  remove(value) { this.children = this.children.filter(item => item !== value) }
}
class CSS3DObject {
  constructor(value) {
    this.element = value
    this.scale = new Vector3()
    this.position = new Vector3()
    this.rotation = new Vector3()
  }
  rotateOnWorldAxis() {}
}

test('CSS3D shares one layer and releases it after the final overlay', () => {
  const frames = new Map()
  let nextFrame = 0
  const renderers = []
  const observers = []
  class CSS3DRenderer {
    constructor() { this.domElement = element(); this.renderCount = 0; renderers.push(this) }
    init() { return Promise.resolve() }
    setPixelRatio(value) { this.pixelRatio = value }
    setSize(width, height) { this.size = [width, height] }
    render() { this.renderCount++ }
  }
  const createResizeObserver = () => {
    const value = {
      observing: false, disconnected: false,
      observe() { this.observing = true },
      unobserve() { this.observing = false },
      disconnect() { this.disconnected = true; this.observing = false },
    }
    observers.push(value)
    return value
  }
  const parent = element()
  const fiveElement = element()
  parent.appendChild(fiveElement)
  const five = { model: { loaded: true }, camera: {}, scene: new Scene(), getElement: () => fiveElement }
  const three = {
    Vector3, Scene,
    PlaneGeometry: class { dispose() {} },
    MeshBasicMaterial: class { dispose() {} },
    Mesh: class {}, DoubleSide: 2,
  }
  const { CSS3DRenderPlugin } = load('../resources/fivePlugins/CSS3DRenderPlugin/index.ts', {
    '@realsee/five-webgpu': {},
    'three/webgpu': three,
    'three/addons/renderers/CSS3DRenderer.js': { CSS3DObject, CSS3DRenderer },
    './evenNumber': { __esModule: true, default: value => Math.floor(value / 2) * 2 },
    './centerPoint': { __esModule: true, default: (a, b) => new Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2) },
    './transformPositionToVector3': { __esModule: true, default: value => new Vector3(value.x, value.y, value.z) },
    './createResizeObserver': { __esModule: true, default: createResizeObserver },
  }, {
    document: { createElement: element, body: parent },
    requestAnimationFrame(callback) { const id = ++nextFrame; frames.set(id, callback); return id },
    cancelAnimationFrame(id) { frames.delete(id) },
  })
  const plugin = CSS3DRenderPlugin(five)
  const points = [
    new Vector3(0, 1, 0), new Vector3(0, 0, 0),
    new Vector3(1, 0, 0), new Vector3(1, 1, 0),
  ]
  const first = plugin.create3DDomContainer(points)
  const second = plugin.create3DDomContainer(points)
  assert.equal(renderers.length, 1)
  assert.equal(observers.length, 1)
  assert.equal(observers[0].observing, true)
  first.dispose()
  assert.equal(renderers[0].domElement.removed, undefined)
  assert.equal(observers[0].observing, true)
  second.dispose()
  assert.equal(renderers[0].domElement.removed, true)
  assert.equal(observers[0].disconnected, true)
  assert.equal(frames.size, 0)
  plugin.disposeAll()
})

test('VideoAgentScene owns resize, frame, renderer, mesh and DOM exactly once', async () => {
  const frames = new Map()
  let nextFrame = 0
  let resizeDisposed = 0
  const renderers = []
  const meshes = []
  class Renderer {
    constructor() { this.domElement = element(); this.backend = { isWebGPUBackend: true }; this.disposeCount = 0; renderers.push(this) }
    init() { return Promise.resolve() }
    setPixelRatio(value) { this.pixelRatio = value }
    setSize(width, height) { this.size = [width, height] }
    render() { this.rendered = true }
    dispose() { this.disposeCount++ }
  }
  class Mesh {
    constructor() { this.paused = true; this.freeze = false; this.currentTime = 0; this.disposeCount = 0; meshes.push(this) }
    dispose() { this.disposeCount++ }
  }
  class Camera {
    constructor() { this.position = { set() {} } }
    lookAt() {}
  }
  const container = element()
  const { VideoAgentScene } = load('../resources/Player/modules/VideoAgent/VideoAgentScene.ts', {
    'three/webgpu': { Scene, OrthographicCamera: Camera, WebGPURenderer: Renderer },
    '../../../shared-utils/addResizeListener': {
      addResizeListener(_element, callback) { callback(320, 180); return () => resizeDisposed++ },
    },
    '../../../shared-utils/getMediaInfo': { getMediaType() {} },
    './VideoAgentMesh': { VideoAgentMesh: Mesh },
  }, {
    navigator: { gpu: {} },
    window: { devicePixelRatio: 2 },
    requestAnimationFrame(callback) { const id = ++nextFrame; frames.set(id, callback); return id },
    cancelAnimationFrame(id) { frames.delete(id) },
  })
  const scene = new VideoAgentScene(container)
  assert.deepEqual(renderers[0].size, [320, 180])
  assert.equal(renderers[0].pixelRatio, 2)
  await Promise.resolve()
  assert.equal(frames.size, 1)
  scene.dispose()
  scene.dispose()
  assert.equal(resizeDisposed, 1)
  assert.equal(renderers[0].disposeCount, 1)
  assert.equal(meshes[0].disposeCount, 1)
  assert.equal(renderers[0].domElement.removed, true)
  assert.equal(frames.size, 0)
})

test('VideoAgentScene stops and releases its canvas when the backend is unsupported', async () => {
  const renderers = []
  let resizeDisposed = 0
  let frames = 0
  class Renderer {
    constructor() { this.domElement = element(); this.backend = { isWebGPUBackend: false }; this.disposeCount = 0; renderers.push(this) }
    init() { return Promise.resolve() }
    setPixelRatio() {}
    setSize() {}
    dispose() { this.disposeCount++ }
  }
  class Mesh {
    constructor() { this.disposeCount = 0 }
    dispose() { this.disposeCount++ }
  }
  class Camera {
    constructor() { this.position = { set() {} } }
    lookAt() {}
  }
  const errors = []
  const container = element()
  const { VideoAgentScene } = load('../resources/Player/modules/VideoAgent/VideoAgentScene.ts', {
    'three/webgpu': { Scene, OrthographicCamera: Camera, WebGPURenderer: Renderer },
    '../../../shared-utils/addResizeListener': { addResizeListener() { return () => resizeDisposed++ } },
    './VideoAgentMesh': { VideoAgentMesh: Mesh },
  }, {
    navigator: { gpu: {} },
    window: { devicePixelRatio: 1 },
    console: { error: (...args) => errors.push(args) },
    requestAnimationFrame() { frames++ },
    cancelAnimationFrame() {},
  })
  new VideoAgentScene(container)
  await Promise.resolve()
  await Promise.resolve()
  assert.equal(renderers[0].disposeCount, 1)
  assert.equal(renderers[0].domElement.removed, true)
  assert.equal(resizeDisposed, 1)
  assert.equal(frames, 0)
  assert.match(errors[0][1].message, /unsupported backend/)
})

for (const gpuPresent of [false, true]) {
  test(`VideoAgentScene renders and releases WebGL2 with navigator.gpu=${gpuPresent}`, async () => {
    let rendered = 0, released = 0
    const errors = []
    class Renderer {
      domElement = element()
      backend = { isWebGLBackend: true }
      init() { return Promise.resolve() }
      setPixelRatio() {} setSize() {}
      render() { rendered++ }
      dispose() { released++ }
    }
    class Mesh { paused = false; freeze = false; currentTime = 1200; dispose() {} }
    class Camera { position = { set() {} }; lookAt() {} }
    const { VideoAgentScene } = load('../resources/Player/modules/VideoAgent/VideoAgentScene.ts', {
      'three/webgpu': { Scene, OrthographicCamera: Camera, WebGPURenderer: Renderer },
      '../../../shared-utils/addResizeListener': { addResizeListener() { return () => {} } },
      './VideoAgentMesh': { VideoAgentMesh: Mesh },
    }, { navigator: gpuPresent ? { gpu: {} } : {}, window: { devicePixelRatio: 1 },
      console: { error: (...args) => errors.push(args) }, requestAnimationFrame() { return 1 }, cancelAnimationFrame() {} })
    const scene = new VideoAgentScene(element())
    await Promise.resolve(); await Promise.resolve()
    assert.equal(rendered, 1)
    assert.equal(released, 0)
    assert.deepEqual(errors, [])
    scene.dispose(); assert.equal(released, 1)
  })
}

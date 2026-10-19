import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const expected = [
  '.', './Player', './PlayController', './react',
  './plugins/CameraMovementPlugin', './plugins/CSS3DRenderPlugin',
  './plugins/ModelTVVideoPlugin', './types', './styles/default.css',
  './styles/SpatialScenePanel.css', './package.json',
]

test('package exposes only the designed public entrypoints', () => {
  assert.deepEqual(Object.keys(manifest.exports), expected)
  assert.equal(manifest.exports['./lib/*'], undefined)
  assert.equal(manifest.exports['./typings'], undefined)
  assert.equal(manifest.exports['./stylesheets/*'], undefined)
})

test('runtime peers stay external to the library bundle', () => {
  for (const name of ['react', 'react-dom', 'mobx', 'mobx-react-lite', '@realsee/five-webgpu', '@realsee/dnalogel', 'three']) {
    assert.ok(manifest.peerDependencies[name], name)
    assert.equal(manifest.dependencies?.[name], undefined, name)
  }
  assert.deepEqual(manifest.sideEffects, ['./stylesheets/**/*.css'])
  assert.equal(JSON.stringify(manifest).includes('file:'), false)
  assert.equal(JSON.stringify(manifest).includes('workspace:'), false)
})

test('Dnalogel peer admits the integrated 4.0.0 prerelease without adding a runtime dependency', async () => {
  const { createRequire } = await import('node:module')
  const semver = createRequire(import.meta.url)(process.env.SEMVER_PATH || 'semver')
  const range = manifest.peerDependencies['@realsee/dnalogel']
  assert.equal(range, '^4.0.0-webgpu.0')
  for (const version of ['4.0.0-webgpu.0', '4.0.0-webgpu.2-overseas.20261014.1']) assert.ok(semver.satisfies(version, range), version)
  assert.equal(semver.satisfies('5.0.0-webgpu.0', range), false)
  assert.equal(manifest.dependencies?.['@realsee/dnalogel'], undefined)
  assert.equal(manifest.bundledDependencies, undefined)
})

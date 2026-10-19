import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const sdk = fileURLToPath(new URL('../../', import.meta.url))
const deps = resolve(sdk, 'node_modules')
const legacy = process.env.VREO_LEGACY_DNALOGEL
if (!legacy) throw new Error('Set VREO_LEGACY_DNALOGEL to the actual Dnalogel 3.81.12 package root for saved text parity controls')
export default defineConfig({
  root: sdk,
  esbuild: { jsx: 'automatic' },
  resolve: { alias: [
    { find: /^vreo-audit\//, replacement: `${sdk}/resources/` },
    { find: /^@realsee\/dnalogel\/plugins\/pano-tag$/, replacement: `${deps}/@realsee/dnalogel/dist/plugins/pano-tag.js` },
    { find: /^@realsee\/five-webgpu$/, replacement: resolve(sdk, 'integration/keyframe-lifecycle/five-carrier.ts') },
    { find: /^vreo-legacy-text-tag$/, replacement: resolve(legacy, 'libs/PanoTagPlugin/Components/Tag/TextTag/TextTag.js') },
    { find: /^vreo-legacy-image-text-tag$/, replacement: resolve(legacy, 'libs/PanoTagPlugin/Components/Tag/ImageTextTag.js') },
    { find: /^react$/, replacement: `${deps}/react/index.js` },
    { find: /^react\/jsx-runtime$/, replacement: `${deps}/react/jsx-runtime.js` },
    { find: /^react\/jsx-dev-runtime$/, replacement: `${deps}/react/jsx-dev-runtime.js` },
    { find: /^react-dom$/, replacement: `${deps}/react-dom/index.js` },
    { find: /^react-dom\/client$/, replacement: `${deps}/react-dom/client.js` },
    { find: /^three$/, replacement: `${deps}/three/build/three.module.js` },
    { find: /^three\/webgpu$/, replacement: `${deps}/three/build/three.webgpu.js` },
    { find: /^three\/addons\//, replacement: `${deps}/three/examples/jsm/` },
  ] },
  test: {
    setupFiles: ['integration/keyframe-lifecycle/setup.ts'],
    server: { deps: { inline: [/dnalogel/] } },
    environment: 'jsdom', include: ['integration/keyframe-lifecycle/*.test.tsx'], fileParallelism: false,
  },
})

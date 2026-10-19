import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
const sdk = fileURLToPath(new URL('../../', import.meta.url))
const host = process.env.VREO_HOST_SOURCE
if (!host) throw new Error('VREO_HOST_SOURCE must point to a NextVR checkout')
const deps = process.env.VREO_TEST_DEPENDENCIES || resolve(host, 'node_modules')
const packageRoot = process.env.VREO_PACKAGE_ROOT
const player = packageRoot ? resolve(packageRoot, 'lib/Player/index.js') : resolve(sdk, 'resources/Player/index.tsx')
export default defineConfig({
  root: sdk,
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(host, 'src') },
      { find: '@realsee/vreo/Player', replacement: player },
      {
        find: '@realsee/dnalogel/plugins/pano-tag',
        replacement: resolve(deps, '@realsee/dnalogel/dist/plugins/pano-tag.js'),
      },
      { find: '@realsee/five-webgpu', replacement: resolve(deps, '@realsee/five-webgpu') },
      { find: /^three$/, replacement: resolve(deps, 'three/build/three.module.js') },
      { find: 'three/webgpu', replacement: resolve(deps, 'three/build/three.webgpu.js') },
      { find: 'three/tsl', replacement: resolve(deps, 'three/build/three.tsl.js') },
      { find: /^three\/addons\//, replacement: resolve(deps, 'three/examples/jsm') + '/' },
      { find: /^react$/, replacement: resolve(deps, 'react/index.js') },
      { find: /^react\/jsx-runtime$/, replacement: resolve(deps, 'react/jsx-runtime.js') },
      { find: /^react-dom\/client$/, replacement: resolve(deps, 'react-dom/client.js') },
      { find: /^react-dom$/, replacement: resolve(deps, 'react-dom/index.js') },
      { find: /^mobx$/, replacement: resolve(deps, 'mobx/dist/index.js') },
      { find: /^mobx-react-lite$/, replacement: resolve(deps, 'mobx-react-lite/dist/index.js') },
      { find: /^zustand$/, replacement: resolve(deps, 'zustand/esm/index.mjs') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['integration/saved-time-resume/setup.ts'],
    include: ['integration/saved-time-resume/resume.test.tsx'],
    fileParallelism: false,
    server: { deps: { inline: [/@realsee\/(vreo|dnalogel|five-webgpu)/] } },
    deps: { optimizer: { web: { enabled: true, include: ['protobufjs/minimal.js'] } } },
  },
})

import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
const sdk = fileURLToPath(new URL('../../', import.meta.url))
const source = process.env.VREO_AUDIT_SOURCE || sdk
const deps = resolve(sdk, 'node_modules')
export default defineConfig({
  root: sdk,
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      { find: /^vreo-audit\//, replacement: `${source}/resources/` },
      { find: /^three$/, replacement: `${deps}/three/build/three.module.js` },
      { find: /^three\/webgpu$/, replacement: `${deps}/three/build/three.webgpu.js` },
      { find: /^three\/tsl$/, replacement: `${deps}/three/build/three.tsl.js` },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['integration/videoagent-backend/setup.ts'],
    include: ['integration/videoagent-backend/*.test.tsx'],
    fileParallelism: false,
    deps: { optimizer: { web: { enabled: true, include: ['protobufjs/minimal.js'] } } },
    server: { deps: { inline: [/@realsee\/five-webgpu/] } },
  },
})

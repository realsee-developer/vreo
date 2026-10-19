import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
const sdk = fileURLToPath(new URL('../../', import.meta.url))
const host = process.env.VREO_HOST_SOURCE
export default defineConfig({
  root: sdk,
  esbuild: { jsx: 'automatic' },
  resolve: { alias: [
    { find: /^vreo-audit\//, replacement: `${sdk}/resources/` },
    ...(host ? [{ find: /^nextvr-host\//, replacement: `${host}/` }] : []),
  ] },
  test: {
    environment: 'jsdom',
    setupFiles: ['integration/audio-release/platform-setup.ts'],
    include: host ? ['integration/audio-release/*.test.tsx'] : ['integration/audio-release/audio-release.test.tsx'],
    fileParallelism: false,
  },
})

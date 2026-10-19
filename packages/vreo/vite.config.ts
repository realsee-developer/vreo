import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'resources/index.ts'),
        'Player/index': resolve(import.meta.dirname, 'resources/Player/index.tsx'),
        'PlayController/index': resolve(import.meta.dirname, 'resources/PlayController/index.ts'),
        'react/index': resolve(import.meta.dirname, 'resources/react/index.tsx'),
        'plugins/CameraMovementPlugin': resolve(import.meta.dirname, 'resources/fivePlugins/CameraMovementPlugin/index.ts'),
        'plugins/CSS3DRenderPlugin': resolve(import.meta.dirname, 'resources/fivePlugins/CSS3DRenderPlugin/index.ts'),
        'plugins/ModelTVVideoPlugin': resolve(import.meta.dirname, 'resources/fivePlugins/ModelTVVideoPlugin/index.ts'),
        'types/index': resolve(import.meta.dirname, 'resources/typings/index.ts'),
      },
      formats: ['es'],
    },
    outDir: 'lib',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: id => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0'),
      output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' },
    },
  },
})

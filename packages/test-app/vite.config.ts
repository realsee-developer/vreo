import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        react: resolve(import.meta.dirname, 'index-react.html'),
        dynamic: resolve(import.meta.dirname, 'index-react-dynamic.html'),
        partial: resolve(import.meta.dirname, 'index-react-partial.html'),
        playController: resolve(import.meta.dirname, 'index-react-playController.html'),
      }
    }
  }
}) 
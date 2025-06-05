import { resolve } from 'path'
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
        main: resolve(__dirname, 'index.html'),
        react: resolve(__dirname, 'index-react.html'),
        dynamic: resolve(__dirname, 'index-react-dynamic.html'),
        partial: resolve(__dirname, 'index-react-partial.html'),
        playController: resolve(__dirname, 'index-react-playController.html'),
      }
    }
  }
}) 
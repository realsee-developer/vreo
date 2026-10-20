import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { FiveInitArgs, parseWork } from '@realsee/five-webgpu'
import { createFiveProvider } from '@realsee/five-webgpu/react'

// import { work } from './data/works/znRoyv06SZQeqA7m'

// import work from './data/works/XQeernmw.json'

import work from './data/works/PjVVGxn2.json'

// import { work } from './data/works/81W5PlyWbZ5I9g3Nj7'

import { ResponsiveFullScreenFiveCanvas } from './components/ResponsiveFullScreenFiveCanvas'

import { App } from './App'

import './index.css'

import '@realsee/vreo/styles/default.css'

const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024 },
  textureOptions: { size: 64 },
  onlyRenderIfNeeds: true,
  antialias: false,
  model: {},
  plugins: [],
}

const FiveProvider = createFiveProvider(defaultInitArgs)

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')
createRoot(rootElement).render(
<React.StrictMode>
      <FiveProvider initialWork={parseWork(work)} ref={(ref) => { Object.assign(window, { $five: ref?.five }) }}>
          <ResponsiveFullScreenFiveCanvas />
          <App />
      </FiveProvider>
  </React.StrictMode>
)

import { FiveInitArgs, parseWork } from '@realsee/five-webgpu'
import { createFiveProvider } from '@realsee/five-webgpu/react'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { ResponsiveFullScreenFiveCanvas } from '../components/ResponsiveFullScreenFiveCanvas'
import work from './work.json'
// import work from '../data/works/XQeernmw.json'

import '../index.css'
import { App } from './App'

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

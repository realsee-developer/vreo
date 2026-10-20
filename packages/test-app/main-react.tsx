import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { FiveInitArgs, parseWork } from '@realsee/five-webgpu'
import { createFiveProvider } from '@realsee/five-webgpu/react'

// import work  from './data/works/work3.json'

import {work} from './data/works/80Lykj3NW2RGgMrG06'

import { ResponsiveFullScreenFiveCanvas } from './components/ResponsiveFullScreenFiveCanvas'

import { App } from './AppReact'

import './index.css'

import '@realsee/vreo/styles/default.css'
import '@realsee/vreo/styles/SpatialScenePanel.css'

import { VreoProvider } from '@realsee/vreo/react'
import { SpatialScenePanel } from '@realsee/vreo/Player'

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
      <VreoProvider configs={{
        customKeyframes: [SpatialScenePanel]
      }}>
        <App />
      </VreoProvider>
    </FiveProvider>
  </React.StrictMode>
)

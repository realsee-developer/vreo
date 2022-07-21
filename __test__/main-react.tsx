import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'

// import work  from './data/works/work3.json'

import {work} from './data/works/80Lykj3NW2RGgMrG06'

import { ResponsiveFullScreenFiveCanvas } from './components/ResponsiveFullScreenFiveCanvas'

import { App } from './AppReact'

import './index.css'

import '../stylesheets/default.css'
import '../stylesheets/custom/SpatialScenePanel.css'

import { VreoProvider } from '../resources/react'
import { SpatialScenePanel } from '../resources/Player/custom/SpatialScenePanel'
import AudioLike from '../resources/shared-utils/AduioLike'

const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024 },
  textureOptions: { size: 64 },
  onlyRenderIfNeeds: true,
  antialias: false,
  model: {},
  plugins: [],
}

const FiveProvider = createFiveProvider(defaultInitArgs)

console.log(11111)

ReactDOM.render(
  <React.StrictMode>
    <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
      <ResponsiveFullScreenFiveCanvas />
      <VreoProvider configs={{
        customKeyframes: [SpatialScenePanel]
      }}>
        <App />
      </VreoProvider>
    </FiveProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

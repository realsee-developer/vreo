import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'
import { vreoUnitD as data } from './data/vreo-units/vreo-unit-d-new'

import { work } from './data/works/81zxMaeVKLQU93OZMG'
import { vreoUnitNoVideo } from './data/vreo-units/vreo-unit-novideo'

Object.assign(window, { $vreoUnitNoVideo: vreoUnitNoVideo })

import { ResponsiveFullScreenFiveCanvas } from './components/ResponsiveFullScreenFiveCanvas'

import { App } from './AppReact'

import './index.css'

import '../stylesheets/default.css'
import { VreoProvider } from '../resources/react'

const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024 },
  textureOptions: { size: 64 },
  onlyRenderIfNeeds: true,
  antialias: false,
  model: {},
  plugins: [],
}

const FiveProvider = createFiveProvider(defaultInitArgs)

ReactDOM.render(
  <React.StrictMode>
    <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
      <ResponsiveFullScreenFiveCanvas />
      <VreoProvider>
        <App />
      </VreoProvider>
    </FiveProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

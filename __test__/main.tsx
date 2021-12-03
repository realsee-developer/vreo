import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'

import { work } from './data/works/znRoyv06SZQeqA7m'
import { imageMogr2 } from './shared-utils/imageMogr2'

import { ResponsiveFullScreenFiveCanvas } from './components/ResponsiveFullScreenFiveCanvas'

import { App } from './App'

import './index.css'

import '../stylesheets/default.css'
import { data } from './data/vreo-units/vreo-unit-a'

Object.assign(window, { $data: data })

const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024, transform: imageMogr2 },
  textureOptions: { size: 64, transform: imageMogr2 },
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
      <App />
    </FiveProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

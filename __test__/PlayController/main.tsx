import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { ResponsiveFullScreenFiveCanvas } from '../components/ResponsiveFullScreenFiveCanvas'
import work from './work.json'

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

ReactDOM.render(
  <React.StrictMode>
    <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
      <ResponsiveFullScreenFiveCanvas />
      <App />
    </FiveProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

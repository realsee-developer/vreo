import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'

import { work } from './data/works/znRoyv06SZQeqA7m'

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

function DynamicDebug() {
  const [state, setState] = React.useState(false)
  const content = state ? (
    <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
      <ResponsiveFullScreenFiveCanvas />
      <VreoProvider>
        <App />
      </VreoProvider>
    </FiveProvider>
  ) : (
    <></>
  )

  return (
    <>
      <button
        style={{
          position: 'absolute',
          zIndex: 1000000,
          top: '36px',
          left: '36px',
        }}
        onClick={() => setState(!state)}
      >
        {state ? '销毁' : '创建'}
      </button>
      {content}
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <DynamicDebug />
  </React.StrictMode>,
  document.getElementById('root')
)

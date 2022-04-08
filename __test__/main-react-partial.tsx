import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'

// import work  from './data/works/work3.json'

import { work } from './data/works/znRoyv06SZQeqA7m'

import { ResponsiveFiveCanvas } from './components/ResponsiveFiveCanvas'

import { App } from './AppReact'

import './index.css'

import '../stylesheets/default.css'
import '../stylesheets/custom/SpatialScenePanel.css'

import { VreoProvider } from '../resources/react'
import { SpatialScenePanel } from '../resources/Player/custom/SpatialScenePanel'

const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024 },
  textureOptions: { size: 64 },
  onlyRenderIfNeeds: true,
  antialias: false,
  model: {},
  plugins: [],
}

const FiveProvider = createFiveProvider(defaultInitArgs)

function PartialVreoProvider() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [readyDOM, setReadyDOM] = React.useState(false)

  React.useEffect(() => {
    if (!ref.current) {
      return
    }

    setReadyDOM(true)
  }, [])

  return (
    <div id="vreo-provider-app" ref={ref}>
      {readyDOM ? (
        <VreoProvider
          configs={{
            customKeyframes: [SpatialScenePanel],
            containter: ref.current!
          }}
        >
          <App />
        </VreoProvider>
      ) : null}
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '800px',
        height: '600px',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
      }}
    >
      <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
        <ResponsiveFiveCanvas />
        <PartialVreoProvider />
      </FiveProvider>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)

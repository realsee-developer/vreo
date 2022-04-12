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


const audioLike = new AudioLike({duration: 8000})

const state = {
  start: 0,
   end: 0
}

Object.assign(window, {$audioLike: audioLike})
audioLike.addEventListener('play', () => {
  state.start = performance.now()
  console.log('00 --- play', state.start)

  // console.log('play', audioLike.currentTime, audioLike.duration)
})
audioLike.addEventListener('playing', () => {
  // console.log('playing', audioLike.currentTime, audioLike.duration)
})
audioLike.addEventListener('pause', () => {
  // console.log('paused', audioLike.currentTime, audioLike.duration)
})
audioLike.addEventListener('ended', () => {
  // console.log('ended', audioLike.currentTime, audioLike.duration)
  state.end = performance.now()

  // console.log('duration', state.end - state.start)
  console.log('+00 --- play', state.end, state.end - state.start)

})
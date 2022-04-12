import * as React from 'react'
import { useVreoAction, useVreoPausedState } from '../resources/react'
import { VreoUnit } from '../typedoc/Player'
// import { vreoUnit as data } from './data/vreo-units/vreo-unit-work3'
import { data } from './data/vreo-units/80Lykj3NW2RGgMrG06'

export function App() {
  const loaded = React.useRef(false)
  const { show, play, hide, pause, load } = useVreoAction()
  const paused = useVreoPausedState()

  Object.assign(window, { $load: load, $show: show })
  return (
    <div className="btns">
      <button
        onClick={async () => {
          if (!paused) {
            pause()
            hide()
            return
          }
          show()
          if (!loaded.current) {
            loaded.current = true
            load(data as VreoUnit)
          } else {
            play()
          }
        }}
      >
        {paused ? '播放' : '暂停'}
      </button>

      <button
        onClick={async () => {
          if (!paused) {
            pause()
            hide()
            return
          }
          show()
          if (!loaded.current) {
            loaded.current = true
            const silenceData = JSON.parse(JSON.stringify(data)) as VreoUnit
            silenceData.video.url = ''
            load(silenceData)
          } else {
            play()
          }
        }}
      >
        {paused ? '播放--静默' : '暂停--静默'}
      </button>
    </div>
  )
}

import { unsafe__useFiveInstance, useFiveWork } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '../resources/Player'
import { VreoUnit } from '../typedoc/Player'
import { data } from './data/vreo-units/vreo-unit-a'

// 无视频版本
// import { data } from './data/vreo-units/vreo-unit-b'
// 
// import { data } from './data/vreo-units/vreo-unit-tmp'


enum PlayerState {
  notReady = 'notReady',
  ready = 'ready',
  paused = 'paused',
  playing = 'playing',
}

export function App() {
  const ref = React.useRef<Player>()
  const five = unsafe__useFiveInstance()
  const [state, setState] = React.useState(PlayerState.notReady)

  React.useEffect(() => {
    if (ref.current) return
    const player = new Player(five)
    ref.current = player
    setState(PlayerState.ready)
    player.on('paused', () => setState(PlayerState.paused))
    player.on('playing', () => setState(PlayerState.playing))
    Object.assign(window, { $player: player })
  }, [])

  return (
    <div className="btns">
      <button
        onClick={async () => {
          if (state === PlayerState.ready) {
            ref.current?.show()
            await ref.current?.load(data as VreoUnit)
          }
          if (state !== PlayerState.playing) {
            ref.current?.play()
          } else {
            ref.current?.pause()
          }
        }}
        disabled={state === PlayerState.notReady}
      >
        {state !== PlayerState.playing ? '播放' : '暂停'}
      </button>
    </div>
  )
}

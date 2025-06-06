import { unsafe__useFiveInstance, useFiveWork } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '@realsee/vreo/Player'
import { VreoUnit } from '@realsee/vreo/typings'
// import { data } from './data/vreo-units/vreo-unit-a'

// import { data } from './data/vreo-units/vreo-XQeernmw'

// import { data } from './data/vreo-units/vreo-unit-test-video'

// 弹层视频
// import { data1 as data } from './data/vreo-units/vreo-unit-a'

import { data } from './data/vreo-units/vreo-unit-PjVVGxn2'

// 无视频版本
// import { data } from './data/vreo-units/vreo-unit-b'

// import { data } from './data/vreo-units/vreo-unit-tmp'

// 头像音频
// import { data } from './data/vreo-units/vreo-unit-b-avatar'


// 啥都没有版本
// import { data } from './data/vreo-units/vreo-unit-b-noaudio'

// import  {data}  from './data/vreo-units/vreo-unit-muti-audio-test'

// import  {data}  from './data/vreo-units/vreo-unit-taibao'

// import  {data}  from './data/vreo-units/vreo-unit-single-bgm'

// video effect
// import  {data}  from './data/vreo-units/vreo-unit-videoEffect'

// vivo 视频黑屏
// import {data} from './data/vreo-units/vreo-unit-o4bb0mxR'



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
    player.on('loaded', () => console.log('loaded'))
    player.on('paused', () => setState(PlayerState.paused))
    player.on('playing', () => setState(PlayerState.playing))
    player.on('ended', () => console.log('ended'))
    player.on('playing', () => console.log('playing'))
    player.on('paused', (ended?: boolean) => console.log({ended}))
    Object.assign(window, { $player: player })
  }, [])

  return (
    <div className="btns">
      <button
        onClick={async () => {
          console.log(1, Date.now())
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

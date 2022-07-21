import { unsafe__useFiveInstance, useFiveWork } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '../resources/Player'
import { VreoUnit } from '../typedoc/Player'
// import { data } from './data/vreo-units/vreo-unit-a'

const data = {
    "frontRequestId": "0d7df0f2-592a-4e8b-bf62-7fd01256f187",
    "index": 0,
    "categoryId": "0d7df0f2-592a-4e8b-bf62-7fd01256f187",
    "categoryText": "",
    "configure": {},
    "video": {
        "start": 0,
        "end": 19470,
        "duration": 19470,
        "url": ""
    },
    "keyframes": [
        {
            "uuid": "adb3395e-7270-41b4-3394-7c547ec142ea",
            "type": "CameraMovement",
            "start": 570,
            "end": 2180,
            "data": {
                "effect": "Move",
                "fov": 80,
                "latitude": -0.3238866396761134,
                "longitude": 4.1579079410610715,
                "mode": "Panorama",
                "moveSpeed": 0.002,
                "panoIndex": 3,
                "rotateSpeed": 0.000375
            }
        },
        {
            "uuid": "154be1db-31c8-41dc-43f5-624b53cecf3e",
            "type": "CameraMovement",
            "start": 4610,
            "end": 8330,
            "data": {
                "effect": "Rotate",
                "fov": 90,
                "latitude": 0,
                "longitude": 6.632251157578453,
                "mode": "Panorama",
                "moveSpeed": 0.002,
                "panoIndex": 0,
                "rotateSpeed": 0.000375
            }
        },
        {
            "uuid": "f0ace943-e358-4bfd-dcc5-f23edf0b4ea8",
            "type": "Prompter",
            "start": 15640,
            "end": 19470,
            "data": {
                "text": "即恢复到初始摄像头位置；\nd、R切换灯光场景；",
                "type": "Text"
            }
        },
        {
            "uuid": "c4e45dfc-0e01-43fc-831c-3c596346d3a8",
            "type": "PanoTag",
            "start": 2780,
            "end": 5780,
            "data": {
                "fontSize": 16,
                "panoIndex": 3,
                "style": "Growth",
                "text": "毛巾",
                "type": "Text",
                "vertex": {
                    "x": -2.759999990463257,
                    "y": 1.5095756811885588,
                    "z": -11.102410636287502
                }
            }
        }
    ]
}

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

import { unsafe__useFiveInstance, useFiveWork } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '../resources/Player'
import { VreoUnit } from '../typedoc/Player'
// import { data } from './data/vreo-units/vreo-unit-a'

// 无视频版本
// import { data } from './data/vreo-units/vreo-unit-b'
//
// import { data } from './data/vreo-units/vreo-unit-tmp'


const data = {
    "frontRequestId": "09f744c0-7a36-4a27-9ff8-909f22eb9fcd",
    "index": 0,
    "categoryId": "09f744c0-7a36-4a27-9ff8-909f22eb9fcd",
    "categoryText": "",
    "configure": {},
    "video": {
        "url": "https://vrlab-public.ljcdn.com/vrframework/release/audio_merged/hgLxGuGg/aitalk_text/merged.mp3",
        "start": 0,
        "end": 30924,
        "duration": 30924,
        "type": "Audio"
    },
    "keyframes": [
        {
            "uuid": "227a7e25-3cc8-49f2-6754-29aeac308d10",
            "type": "CameraMovement",
            "start": 1360,
            "end": 1660,
            "data": {
                "panoIndex": 0,
                "fov": 72.00000000000001,
                "longitude": 5.235987755982989,
                "latitude": 0,
                "effect": "Move",
                "rotateSpeed": 0.000375,
                "moveSpeed": 0.002,
                "mode": "Panorama"
            }
        },
        {
            "uuid": "f7cddcda-3565-457b-7041-de3170a8dc77",
            "type": "CameraMovement",
            "start": 3980,
            "end": 5710,
            "data": {
                "panoIndex": 0,
                "fov": 99.13333315849303,
                "longitude": 0.3417399786145608,
                "latitude": 0.010988807676458389,
                "effect": "Rotate",
                "rotateSpeed": 0.375,
                // "rotateSpeed": 0.000375,
                "moveSpeed": 0.002,
                "mode": "Panorama",
                "rotation": "Clockwise"
            }
        },
        {
            "uuid": "93849475-8875-449f-1ab7-ec294baa6744",
            "type": "Prompter",
            "start": 1000,
            "end": 3300,
            "data": {
                "text": "“伟大出自平凡，平凡造就伟大",
                "type": "Text"
            }
        },
        {
            "uuid": "3b4fe025-1d64-4f33-8feb-287ad57f979a",
            "type": "Prompter",
            "start": 3400,
            "end": 9070,
            "data": {
                "text": "”习近平9月29日在国家勋章和国家荣誉称号颁授仪式上的这句话触动心弦",
                "type": "Text"
            }
        },
        {
            "uuid": "7c7c7a92-710e-4f80-56e3-b634c9fb0ec9",
            "type": "Prompter",
            "start": 9170,
            "end": 11220,
            "data": {
                "text": "成为引发强烈共鸣的刷屏金句",
                "type": "Text"
            }
        },
        {
            "uuid": "84510621-70c9-40f8-205f-aa0cc40cf27b",
            "type": "Prompter",
            "start": 11320,
            "end": 13120,
            "data": {
                "text": "\n\n　　这句话简洁有力、充满哲思",
                "type": "Text"
            }
        },
        {
            "uuid": "af6462bf-958e-40df-e7b5-d876027d1c9c",
            "type": "Prompter",
            "start": 13220,
            "end": 14550,
            "data": {
                "text": "给人信念、给人勇气",
                "type": "Text"
            }
        },
        {
            "uuid": "3992cfef-f953-4510-b235-a24f974b0eed",
            "type": "Prompter",
            "start": 14650,
            "end": 16310,
            "data": {
                "text": "激发以梦为马的青春奋斗",
                "type": "Text"
            }
        },
        {
            "uuid": "f45bc654-b6d9-4f59-a56a-93113877047d",
            "type": "Prompter",
            "start": 16410,
            "end": 18120,
            "data": {
                "text": "激发奋勇争先的百舸争流",
                "type": "Text"
            }
        },
        {
            "uuid": "11382608-2b77-4fe3-b8df-adfe785ac36d",
            "type": "Prompter",
            "start": 18220,
            "end": 22510,
            "data": {
                "text": "激发仰望星空的脚踏实地……\n\n　　新时代中国特色社会主义伟大事业",
                "type": "Text"
            }
        },
        {
            "uuid": "b990db52-3206-4404-ad7a-20ca814f575e",
            "type": "Prompter",
            "start": 22610,
            "end": 25370,
            "data": {
                "text": "需要千千万万个不平凡的群体、不平凡的人物",
                "type": "Text"
            }
        },
        {
            "uuid": "a75e7ad9-26b1-477c-406d-baca7404a40b",
            "type": "Prompter",
            "start": 25470,
            "end": 26230,
            "data": {
                "text": "平凡的工作",
                "type": "Text"
            }
        },
        {
            "uuid": "bec830d7-5ce8-4329-fd77-9018b0c6e8ee",
            "type": "Prompter",
            "start": 26330,
            "end": 28810,
            "data": {
                "text": "也可以创造不平凡的成就；平凡的人",
                "type": "Text"
            }
        },
        {
            "uuid": "96dcfd28-30d2-46a0-374b-53aafda1f4e8",
            "type": "Prompter",
            "start": 28910,
            "end": 30440,
            "data": {
                "text": "也可以获得不平凡的人生",
                "type": "Text"
            }
        },
        // {
        //     "uuid": "55ba5382-86dd-4b22-0499-ff43f9c5a6d7",
        //     "type": "CameraMovement",
        //     "start": 6210,
        //     "end": 9210,
        //     "data": {
        //         "mode": "Panorama",
        //         "effect": "Move",
        //         "panoIndex": 6,
        //         "fov": 66.00613275994583,
        //         "longitude": 5.234625468759308,
        //         "latitude": 0,
        //         "rotation": "Clockwise"
        //     }
        // },
        // {
        //     "uuid": "43716cce-dddf-4454-8d1d-947d7b8665b8",
        //     "type": "CameraMovement",
        //     "start": 9610,
        //     "end": 12610,
        //     "data": {
        //         "mode": "Panorama",
        //         "effect": "Rotate",
        //         "panoIndex": 15,
        //         "fov": 66.00613275994583,
        //         "longitude": 3.5222239552951677,
        //         "latitude": -0.03344776968141903,
        //         "rotation": "Clockwise"
        //     }
        // },
        {
            "uuid": "959a6923-dd22-408f-b072-7e7747ffb396",
            "type": "PanoTag",
            "start": 840,
            "end": 3840,
            "data": {
                "style": "Growth",
                "fontSize": 16,
                "text": "门",
                "type": "Text",
                "vertex": {
                    "x": 1.0035046706126023,
                    "y": 0.14590053302929337,
                    "z": -0.729280644063402
                },
                "panoIndex": 0
            }
        },
        {
            "uuid": "e2cf2ca8-6396-4a01-9313-d185944e4f8d",
            "type": "PanoTag",
            "start": 4380,
            "end": 7380,
            "data": {
                "style": "Growth",
                "fontSize": 16,
                "text": "卫生间",
                "imgUrl": "https://vrlab-public.ljcdn.com/release/seesay/tools/111___514f4b82eddee335905429ef7ee8fcff.jpg",
                "type": "Image",
                "vertex": {
                    "x": 3.3267503451810914,
                    "y": 0.09931288670715654,
                    "z": 0.8662046418284937
                },
                "panoIndex": 6
            }
        },
        {
            "uuid": "3d8ef8de-5550-4d1c-1d10-1ebf054a26a5",
            "type": "PanoTag",
            "start": 9120,
            "end": 12120,
            "data": {
                "style": "Expand",
                "fontSize": 16,
                "text": "窗户",
                "type": "Text",
                "vertex": {
                    "x": 1.7090874840980828,
                    "y": 0.03228944884477183,
                    "z": 7.741179858342804
                },
                "panoIndex": 15
            }
        }
    ]
}

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

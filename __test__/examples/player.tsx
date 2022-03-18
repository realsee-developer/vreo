import { unsafe__useFiveInstance } from '@realsee/five/react'
import { Player } from '../../resources/Player'
import { VreoKeyframeEnum } from '../../resources/typings/VreoUnit'
import * as React from 'react'
import { CameraMovementData, PanoTagData, ModelVideoData, VideoEffectData } from './data'

const funcList = [
  { id: 'camera_movement', name: '相机运镜', data: CameraMovementData },
  { id: 'pano_tag', name: '全景标签', data: PanoTagData },
  { id: 'model_video', name: '视频投放', data: ModelVideoData },
  { id: 'video_effect', name: '视频特效', data: VideoEffectData },
]

enum PlayerState {
  notReady = 'notReady',
  ready = 'ready', // new Player() 即 ready
  paused = 'paused',
  playing = 'playing',
}

export function VreoPlayer() {
  const vreoPlayerRef = React.useRef<Player>()
  const five = unsafe__useFiveInstance()
  const [playerState, setPlayerState] = React.useState<PlayerState>(PlayerState.notReady)

  React.useEffect(() => {
    if (vreoPlayerRef.current) return
    const player = new Player(five)
    vreoPlayerRef.current = player
    setPlayerState(PlayerState.ready)
    player.on('paused', () => setPlayerState(PlayerState.paused))
    player.on('playing', () => setPlayerState(PlayerState.playing))
    player.on(VreoKeyframeEnum.Exit, () => {})
  }, [five])

  const handleVreoFunction = (value: any, e: any) => {
    if (!vreoPlayerRef.current) return
    vreoPlayerRef.current.load(value, 0, false, true)
  }

  const handlePause = () => {
    if (!vreoPlayerRef.current) return
    vreoPlayerRef.current.pause()
  }

  return (
    <div className="btns">
      {playerState !== PlayerState.playing &&
        funcList.map((item) => {
          const vreoData = item.data
          return (
            <button key={item.id} onClick={(e) => handleVreoFunction(vreoData, e)}>
              {item.name}
            </button>
          )
        })}
      {playerState === PlayerState.playing && <button onClick={handlePause}>暂停</button>}
    </div>
  )
}

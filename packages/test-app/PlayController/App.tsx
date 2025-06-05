import { unsafe__useFiveInstance } from '@realsee/five/react'
import * as React from 'react'
import { PlayController } from '@realsee/vreo/PlayController'
import { VreoKeyframe, VreoKeyframeEnum, VreoUnit } from '@realsee/vreo/typings'

import './index.css'

// 全局单例：可以放置在您的 Store/Controller 层里面。
const playController = new PlayController()

Object.assign(window, { $playController: playController })

/**
 * 触发按钮
 */
function Button() {
  const [state, setState] = React.useState(false)

  React.useEffect(() => {
    const setPlaying = () => setState(true)
    const setPaused = () => setState(false)
    playController.on('playing', setPlaying)
    playController.on('paused', setPaused)

    return () => {
      playController.off('playing', setPlaying)
      playController.off('paused', setPaused)
    }
  }, [])

  return (
    <button
      className="pure-button pure-button-primary PlayController-Button"
      onClick={async () => {
        if (!playController.paused) {
          await playController.pause()
          return
        }

        if (playController.vreoUnit) {
          await playController.play()
          return
        }

        // 构造讲房数据
        const vreoUnit: VreoUnit = {
          categoryId: 'agent_navigation',
          categoryText: '经纪人讲房',
          frontRequestId: '10010',
          index: 0,
          video: {
            url: '//vrlab-public.ljcdn.com/release/vradmin/media/047b652f-bc01-487a-231e-2549595b5a85.mp3',
            start: 0,
            end: 130724,
            duration: 130724,
          },
          keyframes: []
        }
        // 请求讲房序列帧
        const json = await fetch('//vrlab-public.ljcdn.com/release/vradmin/media/f8e6ebf8-ad0b-41e2-16b2-6ded49cda037.json')
        const tracks = (await json.json()).track

        const keyframes = tracks.map((track: Record<string, any>) => {
          const vreoKeyframe: VreoKeyframe = {
            uuid: '',
            // 由于是人为录制的，所以所有的序列帧都是 Custom 类型
            type: VreoKeyframeEnum.Custom,
            start: track.currentTime,
            end: 0,
            data: Object.assign({
              // 可以以字段内内容 识别是 经纪人讲房录制的数据
              type: 'AgentNavigation',
            }, track)
          }
          return vreoKeyframe
        })

        vreoUnit.keyframes = keyframes
        
        await playController.load(vreoUnit)
        await playController.play()
        // playController.play()
        // playController.pause()
      }}
    >
      {!state ? '播放' : '暂停'}
    </button>
  )
}

/**
 * 面板：进度条状态
 */
function Panel() {
  const [percentage, setPercentage] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      // duration 可能不精准，建议使用 数据下发的 音频时长
      const duration = playController.duration
      const currentTime = playController.currentTime

      setPercentage(currentTime / duration * 100)
    }, 300)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  return (
    <div className="PlayController-Panel">
      <div className="progress" style={{ width: percentage + '%' }}>
        {percentage.toFixed(2) + '%'}
      </div>
    </div>
  )
}

/**
 * 您的解析逻辑，以 Five 为例
 */
export function YourHandler() {
  const five = unsafe__useFiveInstance()

  React.useEffect(() => {
    const hanlder = (vreoKeyframe: VreoKeyframe) => {
      // 不是自定义类型的剧本帧，不解析
      if (vreoKeyframe.type !== VreoKeyframeEnum.Custom) {
        return
      }
      // 是自定义，但不是 经纪人讲房 录制，同样不解析
      const data = vreoKeyframe.data
      if (data.type !== 'AgentNavigation') {
        return
      }

      // 解析各个字段，执行不同的渲染逻辑
      // camera 相机
      if (data.camera) {
        five.updateCamera({
          fov: data.camera.fov,
          longitude: data.camera.longitude,
          latitude: data.camera.latitude,
        }, 0)
      }
      // position 点位
      if (data.position && data.position.panoIndex && data.position.panoIndex !== five.panoIndex) {
        five.moveToPano(data.position.panoIndex)
      }
    }

    playController.on(VreoKeyframeEnum.Custom, hanlder)

    return () => {
      playController.off(VreoKeyframeEnum.Custom, hanlder)
    }
  }, [])

  return <></>
}

export function App() {
  return (
    <div className="PlayController-App">
      <Button />
      <Panel />
      <YourHandler />
    </div>
  )
}

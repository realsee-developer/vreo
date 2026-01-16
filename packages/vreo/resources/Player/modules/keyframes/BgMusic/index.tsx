import * as React from 'react'
import { getAudio } from '../../../../shared-utils/Audio'
import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

export function BgMusic() {
  const controller = useController()

  React.useEffect(() => {
    const callback = async (keyframe: VreoKeyframe, currentTime: number) => {
      const { start, end } = keyframe

      const _currentTime = (currentTime - start) / 1000

      if (_currentTime < 0 || _currentTime >= keyframe.end - keyframe.start) {
        return
      }

      const audio = getAudio(keyframe.data.url)
      audio.currentTime = Math.max(0, _currentTime)

      const waitForLoaded = controller.configs?.waitForBgMusicLoaded ?? false

      const cleanAudio = () => {
        audio.removeEventListener('canplay', playOnCanPlay)
        audio.removeEventListener('pause', play)
        audio.pause()
        audio.src = ''
      }

      const play = () => {
        if (audio.realSrc === keyframe.data.url) {
          // 有可能会被其他音轨打断
          audio.play()
        }
      }
      // canplay 事件比 canplaythrough 更早触发，表示可以开始播放了
      const playOnCanPlay = () => {
        audio.removeEventListener('canplay', playOnCanPlay)
        audio.play()
        // 解除等待状态，恢复主时间线播放
        controller.setWaitingForBgMusic(false)
      }

      if (waitForLoaded) {
        // 等待音频加载完成后再播放
        // readyState: 0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA
        if (audio.readyState >= 3) {
          // readyState >= 3 表示有足够数据开始播放
          audio.play()
        } else {
          // 设置等待状态，阻塞整个播放流程
          controller.setWaitingForBgMusic(true)
          // 监听 canplay 事件（可以开始播放）
          audio.addEventListener('canplay', playOnCanPlay)
        }
      } else {
        // 默认行为：立即播放，边加载边播放
        audio.play()
      }

      audio.addEventListener('ended', () => {
        cleanAudio()
      })

      audio.addEventListener('pause', play)

      controller.once('paused', () => {
        // 如果播放器暂停，也要解除等待状态
        controller.setWaitingForBgMusic(false)
        cleanAudio()
      })

    }

    controller.on(VreoKeyframeEnum.BgMusic, callback)

    return () => {
      controller.off(VreoKeyframeEnum.BgMusic, callback)
    }
  })

  return <></>
}
import * as React from 'react'
import { generateBlankAudio, getAudio } from '../../../../shared-utils/Audio'
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
      console.log('play', audio.src)
      // const play = () => audio.play()

      audio.play()

      const cleanAudio = () => {
        // audio.removeEventListener('canplaythrough', play)
        audio.pause()
        audio.src = ''
        // cleanTimeout()
      }

      // audio.addEventListener('canplaythrough', play)

      audio.addEventListener('ended', () => {
        cleanAudio()
      })

      controller.once('paused', () => {
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
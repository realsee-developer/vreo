import * as React from 'react'
import { generateBlankAudio, getAudio } from '../../../../shared-utils/Audio'
import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

const DefaultAudioCacheLength = 3

const audioCacheLength = Number(location.search.match(/audio_cache=(\d+)/)?.[1] ?? DefaultAudioCacheLength)

generateBlankAudio(audioCacheLength)

export function BgMusic() {
  const controller = useController()

  React.useEffect(() => {
    const callback = async (keyframe: VreoKeyframe, currentTime: number) => {
      const { start, end } = keyframe

      const audio = getAudio(keyframe.data.url)
      audio.currentTime = Math.max((currentTime - start) / 1000, 0)
      console.log('play', audio.src)
      // const play = () => audio.play()

      audio.play()

      const cleanAudio = () => {
        console.log('clean audio')
        // audio.removeEventListener('canplaythrough', play)
        audio.pause()
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
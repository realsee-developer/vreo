import * as React from 'react'
import { generateBlankAudio, getAudio } from '../../../../shared-utils/Audio'
import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

const audioCacheLength = Number(location.search.match(/audio_cache=(\d+)/)?.[1] ?? 5)

generateBlankAudio(audioCacheLength)

export function BgMusic() {
  const controller = useController()
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null)
  const cleanTimeout = React.useCallback( () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
  }, [])

  React.useEffect(() => {
    const callback = async (keyframe: VreoKeyframe, currentTime: number) => {
      const { start, end } = keyframe

      const audio = getAudio(keyframe.data.url)
      audio.currentTime = Math.max((currentTime - start) / 1000, 0)
      
      audio.play()

      const play = () => audio.play()
      audio.addEventListener('canplaythrough', play)

      audio.addEventListener('ended', () => {
        audio.src = ''
      })

      cleanTimeout()
    
      const cleanAudio = () => {
        audio.removeEventListener('canplaythrough', play)
        audio.pause()
        cleanTimeout()
      }
  
      // const duration = end - start

      // audio.addEventListener('ended', cleanAudio)
      // 音频加载会有时间，所以不通过这种方式停止，而是等播完停止
      // timeoutIdRef.current = setTimeout(() => {
      //   cleanAudio()
      // }, duration)

      controller.once('paused', () => {
        cleanAudio()
      })

    }

    controller.on(VreoKeyframeEnum.BgMusic, callback)

    return () => {
      controller.off(VreoKeyframeEnum.BgMusic, callback)
      cleanTimeout()
    }
  })

  return <></>
}
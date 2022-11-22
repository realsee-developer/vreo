import * as React from 'react'
import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

function getAudio(src: string = '', currentTime: number = 0)  {
  const audio = new Audio()
  audio.src = src
  audio.currentTime = currentTime
  return audio
}

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
      const audio = getAudio(keyframe.data.url, Math.max((currentTime - start) / 1000, 0))
      const playCallback = () => {
        audio.play()
      }

      audio.addEventListener('canplaythrough', playCallback)

      cleanTimeout()
    
      const cleanAudio = () => {
        audio.removeEventListener('canplaythrough', playCallback)
        audio.pause()
        cleanTimeout()
      }
  
      const duration = end - start

      audio.addEventListener('ended', cleanAudio)
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
      console.log('off')
      controller.off(VreoKeyframeEnum.BgMusic, callback)
      cleanTimeout()
    }
  })

  return <></>
}
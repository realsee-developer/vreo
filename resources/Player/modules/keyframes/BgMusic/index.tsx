import * as React from 'react'
import { BgMusicData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

const audioList: HTMLAudioElement[] = []
function getAudio(src: string = '', currentTime: number = 0)  {
  const audio = (() => {
    const audio = audioList.find(audio => audio.src === src)
    if (audio) return audio
    else {
      const newAudio = new Audio(src)
      audioList.push(newAudio)
      return newAudio
    }
  })()
  audio.currentTime = currentTime
  audio.setAttribute('playsinline', 'true')
  audio.loop = true
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
    const callback = (keyframe: VreoKeyframe, currentTime: number) => {
      console.log({currentTime})
      const { start, end } = keyframe
      const audio = getAudio(keyframe.data.url, Math.max(currentTime - start, 0))
      const playCallback = () => {
        audio.play()
      }
  
      audio.addEventListener('canplaythrough', playCallback)

      cleanTimeout()
    
      const cleanAudio = () => {
        console.log('cleanAudio', keyframe.start)
        audio.pause()
        audio.src = ''
        cleanTimeout()
        audio.removeEventListener('canplaythrough', playCallback)
      }
  
      const duration = end - start
    
      timeoutIdRef.current = setTimeout(() => {
        console.log('timeout', duration)
        cleanAudio()
      }, duration)

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
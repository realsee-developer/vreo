import * as React from 'react'
import { BgMusicData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

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
    const audio = new Audio()
    audio.setAttribute('id', 'vreo-singleton-bgmusic')
    audio.style.display = 'none'

    audio.setAttribute('playsinline', 'true')
    audio.loop = true
    document.body.append(audio)

    const callback = (keyframe: VreoKeyframe) => {
      const { start, end } = keyframe
      const { url } = keyframe.data as BgMusicData
      audio.src = url
      const playCallback = () => {
        audio.play()
      }
  
      audio.addEventListener('canplaythrough', playCallback)

      cleanTimeout()
    
      const cleanAudio = () => {
        audio.pause()
        audio.currentTime = 0
        audio.src = ''
        cleanTimeout()
        audio.removeEventListener('canplaythrough', playCallback)
      }
  
      const duration = (end - start) || 5000
    
      timeoutIdRef.current = setTimeout(() => {
        cleanAudio()
      }, duration)

      controller.once('paused', () => {
        cleanAudio()
      })

    }

    controller.on(VreoKeyframeEnum.BgMusic, callback)

    return () => {
      controller.off(VreoKeyframeEnum.BgMusic, callback)
      document.body.removeChild(audio)
      cleanTimeout()
    }
  })

  return <></>
}
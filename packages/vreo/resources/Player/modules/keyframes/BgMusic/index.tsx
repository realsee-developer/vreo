import * as React from 'react'
import { getAudio } from '../../../../shared-utils/Audio'
import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

export function BgMusic() {
  const controller = useController()
  React.useEffect(() => {
    const tracks = new Set<() => void>()
    const callback = (keyframe: VreoKeyframe, currentTime: number) => {
      const valid = controller.audioFocus.capture()
      if (!valid()) return
      const audio = getAudio()
      let cleaned = false
      const clean = () => {
        if (cleaned) return
        cleaned = true
        audio.removeEventListener('canplay', play)
        audio.removeEventListener('ended', clean)
        audio.muted = true
        audio.pause()
        audio.src = ''
        remove()
        tracks.delete(clean)
        controller.setWaitingForBgMusic(false)
      }
      const remove = controller.audioFocus.add(clean)
      tracks.add(clean)
      const play = () => {
        audio.removeEventListener('canplay', play)
        if (!valid() || cleaned) return
        audio.muted = false
        void audio.play().catch(error => { if (valid() && !cleaned) { clean(); controller.audioFocus.cancel('paused'); console.error(error) } })
        controller.setWaitingForBgMusic(false)
      }
      audio.muted = true
      audio.src = keyframe.data.url
      audio.currentTime = Math.max(0, (currentTime - keyframe.start) / 1000)
      audio.addEventListener('ended', clean)
      if (controller.configs.waitForBgMusicLoaded && audio.readyState < 3) {
        controller.setWaitingForBgMusic(true)
        audio.addEventListener('canplay', play)
      } else play()
    }
    controller.on(VreoKeyframeEnum.BgMusic, callback)
    return () => { controller.off(VreoKeyframeEnum.BgMusic, callback); for (const clean of [...tracks]) clean() }
  }, [controller])
  return <></>
}

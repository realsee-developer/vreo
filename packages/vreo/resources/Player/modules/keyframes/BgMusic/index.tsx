import * as React from 'react'
import { getAudio } from '../../../../shared-utils/Audio'
import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

export function BgMusic() {
  const controller = useController()
  React.useEffect(() => {
    const tracks = new Set<() => void>()
    const callback = (keyframe: VreoKeyframe, currentTime: number) => {
      const run = controller.playback.capture()
      const valid = () => !!run?.valid()
      if (!valid()) return
      const element = getAudio()
      const audio = run!.bind(element)
      let cleaned = false
      const clean = () => {
        if (cleaned) return
        cleaned = true
        element.removeEventListener('canplay', play)
        element.removeEventListener('ended', clean)
        audio.muted = true
        audio.pause()
        audio.src = ''
        remove()
        tracks.delete(clean)
        controller.setWaitingForBgMusic(false)
      }
      const remove = controller.playback.add(clean)
      tracks.add(clean)
      const play = () => {
        element.removeEventListener('canplay', play)
        if (!valid() || cleaned) return
        audio.muted = false
        void audio.play().catch(error => { if (valid() && !cleaned) { clean(); controller.playback.cancel(); console.error(error) } })
        controller.setWaitingForBgMusic(false)
      }
      audio.muted = true
      audio.src = keyframe.data.url
      audio.currentTime = Math.max(0, (currentTime - keyframe.start) / 1000)
      element.addEventListener('ended', clean)
      if (controller.configs.waitForBgMusicLoaded && element.readyState < 3) {
        controller.setWaitingForBgMusic(true)
        element.addEventListener('canplay', play)
      } else play()
    }
    controller.on(VreoKeyframeEnum.BgMusic, callback)
    return () => { controller.off(VreoKeyframeEnum.BgMusic, callback); for (const clean of [...tracks]) clean() }
  }, [controller])
  return <></>
}

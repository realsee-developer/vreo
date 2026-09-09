import type { MediaOperations } from '../../../playback-types'
import classNames from 'classnames'
import * as React from 'react'
// import { Preloader } from '../../../../shared-utils/Preloader'
import { VideoEffectData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController, useFiveInstance } from '../../../hooks'

// const emptyVideo = '//vr-static.realsee-cdn.cn/release/web/leisure.69fd3522.mov'
const PI = Math.PI
const PI_2 = PI * 2

export function VideoEffect() {
  const ref = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement | null>()
  const controller = useController()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()

  const [visible, setVisible] = React.useState(false)
  const five = useFiveInstance()
  React.useEffect(() => {
    let output: MediaOperations | undefined
    let generation = 0
    let removeCanPlay: (() => void) | undefined
    const callback = async (keyframe: VreoKeyframe) => {
      const { start, end } = keyframe
      const { videoSrc, fov, direction, panoIndex, vector } = keyframe.data as VideoEffectData
      const [longitude, latitude] = (() => {
        if (vector) {
          return [vector.longitude, vector.latitude]
        }
        if (!direction) {
          return [0, 0]
        }

        let longitude = -Math.atan2(direction.x, -direction.z)
        longitude = ((longitude % PI_2) + PI_2) % PI_2
        const latitude = -Math.asin(direction.y / 1)
        return [longitude, latitude]
      })()

      destroy()
      const currentGeneration = generation
      five.setState({ fov, panoIndex, longitude, latitude }, true)


      removeCanPlay?.()
      const run = controller.playback.capture()
      const active = () => !!run?.valid()
      const valid = () => currentGeneration === generation && active()
      const video = videoRef.current
      if (!video || !valid()) return
      const media = output = run!.bind(video)
      media.muted = true
      media.src = videoSrc
      const play = () => {
        removeCanPlay?.()
        if (!valid()) return
        media.muted = false
        void media.play().catch(error => { if (valid()) { controller.playback.cancel(); console.error(error) } })
      }
      removeCanPlay = () => video.removeEventListener('canplaythrough', play)
      video.addEventListener('canplaythrough', play)
      media.load()
      setVisible(true)

      timeoutRef.current = setTimeout(destroy, Math.max(0, end - start))
    }

    controller.on(VreoKeyframeEnum.VideoEffect, callback)

    const destroy = () => {
      ++generation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      removeCanPlay?.()
      if (output) { output.muted = true; output.pause(); output.src = '' }
      output = undefined
      setVisible(false)

    }

    const remove = controller.playback.add(destroy)

    return () => {
      destroy()
      remove()
      controller.off(VreoKeyframeEnum.VideoEffect, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  React.useEffect(() => {
    if (!ref.current) return
    const video = controller.configs?.videos?.videoEffect || document.createElement('video')
    // <video playsInline key="VideoEffect-video" className="VideoEffect-video" src={blobSrc} />
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.autoplay = false
    video.muted = true
    video.setAttribute('key', 'VideoEffect-video')
    video.setAttribute('class', 'VideoEffect-video')

    videoRef.current = video
    ref.current.append(videoRef.current)
    return () => { video.muted = true; video.pause(); video.remove() }

  }, [])

  return (
    <div
      ref={ref}
      className={classNames('VideoEffect', {
        'VideoEffect--visible': visible,
      })}
    ></div>
  )
}

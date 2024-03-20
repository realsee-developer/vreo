import classNames from 'classnames'
import * as React from 'react'
// import { Preloader } from '../../../../shared-utils/Preloader'
import { VideoEffectData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController, useFiveInstance } from '../../../hooks'

const inlinePlay = (videoInstance?: HTMLVideoElement | null) => {
  if (!videoInstance) return
  const canplaythrough = () => {
    videoInstance.removeEventListener('canplaythrough', canplaythrough)
    try {
      videoInstance.play()
    } catch (error) {}
  }
  videoInstance.addEventListener('canplaythrough', canplaythrough)
  videoInstance.load()
}

// const emptyVideo = '//vrlab-static.ljcdn.com/release/web/leisure.69fd3522.mov'
const PI = Math.PI
const PI_2 = PI * 2

export function VideoEffect() {
  const ref = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement | null>()
  const controller = useController()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()

  const [visible, setVisible] = React.useState(false)
  const five = useFiveInstance()
  const setBlobSrc = (blob: string) => {
    if (!videoRef.current) return

    videoRef.current.src = blob
  }

  React.useEffect(() => {
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

      five.setState({ fov, panoIndex, longitude, latitude }, true)
      setBlobSrc(videoSrc)

      inlinePlay(videoRef.current)
      setVisible(true)

      timeoutRef.current = setTimeout(() => {
        videoRef.current?.pause()
        setVisible(false)
        setBlobSrc('')
      }, end - start)
    }

    controller.on(VreoKeyframeEnum.VideoEffect, callback)

    const destroy = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      videoRef.current?.pause()
      setVisible(false)
      setBlobSrc('')
    }

    controller.on('paused', () => destroy())
    controller.on('ended', () => destroy())

    return () => {
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
    video.setAttribute('autoplay', 'true')
    video.setAttribute('key', 'VideoEffect-video')
    video.setAttribute('class', 'VideoEffect-video')

    videoRef.current = video
    ref.current.append(videoRef.current)
    document.addEventListener(
      'WeixinJSBridgeReady',
      function () {
        videoRef.current?.play()
      },
      false
    )

    if (!ref.current) return
    // const asyncfunc = async () => {
    //   setBlobSrc(await URL.createObjectURL(await Preloader.blob(emptyVideo)))
    //   inlinePlay(videoRef.current)
    // }
    // asyncfunc()
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

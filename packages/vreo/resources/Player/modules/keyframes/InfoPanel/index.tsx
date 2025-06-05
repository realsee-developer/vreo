import * as React from 'react'
import { ReactNode } from 'react'
import {
  InfoPanelData,
  InfoPanelStyleEnum,
  InfoPanelTypeEnum,
  VreoKeyframe,
  VreoKeyframeEnum,
} from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'


const isWX = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
const isIOS = navigator.userAgent.toLowerCase().indexOf('iphone') !== -1

const isIOSorWX = isIOS || isWX


const _videoElement = document.createElement('video')
_videoElement.setAttribute('playsinline', 'true')
_videoElement.setAttribute('webkit-playsinline', 'true')

if (isIOSorWX) {
  if (_videoElement.paused) {
    _videoElement.addEventListener('click', () => _videoElement.play(), {once:true})
  }
}

function InfoPanelImg({ url, children }: { url: string; children?: ReactNode }) {
  return (
    <div className="vreo-infoPanel-container">
      <div className="vreo-infoPanel">
        {children}
        <img src={url}></img>
      </div>
    </div>
  )
}

function InfoPanelVideo({ url, children }: { url: string; children?: ReactNode }) {
  const videoWrapperRef = React.useRef<HTMLDivElement>(null)
  const controller = useController()

  React.useEffect(() => {
    // if (!isIOSorWX) return
    const video = controller.configs?.videos?.videoPanel || _videoElement
    if (!videoWrapperRef.current) return
    video.src = url
    if (!videoWrapperRef.current.contains(video)) {
      videoWrapperRef.current.appendChild(video)
    }

    const canplaythrough = () => {
      video.removeEventListener('canplaythrough', canplaythrough)
      try {
        video.play()
      } catch (error) {}
    }
    video.addEventListener('canplaythrough', canplaythrough)
    video.load()
    // video.play()

    return () => {
      video.pause()
      if (videoWrapperRef.current?.contains(video)) {
        videoWrapperRef.current.removeChild(video)
      }
    }
  }, [videoWrapperRef.current])

  return (
    <div className="vreo-infoPanel-container">
      <div className='vreo-infoPanel'>
        {children}
        <div className='vreo-infoPanel-inner' ref={videoWrapperRef}>
          {/* {!isIOSorWX && <video playsInline webkit-playsinline="true" autoPlay src={url} />} */}
        </div>
      </div>
    </div>
  )
}

interface TitleProps {
  title?: string
  subTitle?: string
}

const Title = (props: TitleProps) => {
  if (!props.title && !props.subTitle) {
    return null
  }

  return (
    <>
      {/* <div className="vreo-infoPanel-title-shadow"></div> */}
      <div className="vreo-infoPanel-title">
        <div className="vreo-infoPanel-t1">{props.title}</div>
        <div className="vreo-infoPanel-t2">{props.subTitle}</div>
      </div>
    </>
  )
}

export function InfoPanel() {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()
  const controller = useController()

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.InfoPanel === false) {
      return
    }

    const callback = (keyframe: VreoKeyframe) => {
      const { start, end, data } = keyframe

      const infoPanelData = data as InfoPanelData

      const { title, subTitle, style } = infoPanelData
      do {
        if (style === InfoPanelStyleEnum.PopUp) {
          if (infoPanelData.type === InfoPanelTypeEnum.Image) {
            controller.openPopUp(
              <InfoPanelImg url={infoPanelData.url}>
                <Title title={title} subTitle={subTitle} />
              </InfoPanelImg>
            )
          } else if (infoPanelData.type === InfoPanelTypeEnum.Video) {
            controller.openPopUp(
              <InfoPanelVideo url={infoPanelData.url}>
                <Title title={title} subTitle={subTitle} />
              </InfoPanelVideo>
            )
          }
          break
        }
        if (infoPanelData.type === InfoPanelTypeEnum.Image) {
          controller.openDrawer({
            content: (
              <InfoPanelImg url={infoPanelData.url}>
                <Title title={title} subTitle={subTitle} />
              </InfoPanelImg>
            ),
            height: '60vh',
          })
        } else if (infoPanelData.type === InfoPanelTypeEnum.Video) {
          controller.openDrawer({
            content: (
              <InfoPanelVideo url={infoPanelData.url}>
                <Title title={title} subTitle={subTitle} />
              </InfoPanelVideo>
            ),
            height: '60vh',
          })
        }
      } while (false)

      timeoutRef.current = setTimeout(() => {
        controller.openDrawer(false)
        controller.openPopUp(false)
      }, end - start)
    }
    controller.on(VreoKeyframeEnum.InfoPanel, callback)

    controller.on('ended', () => {
      controller.openPopUp(false)
    })

    controller.on('paused', () => {
      controller.openPopUp(false)
    })

    return () => {
      controller.off(VreoKeyframeEnum.InfoPanel, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

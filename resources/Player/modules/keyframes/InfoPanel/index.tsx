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


export const isWX = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1

const videoElement = document.createElement('video')
if (isWX) {
  videoElement.playsInline = true
  videoElement.classList.add('vreo-infoPanelVideo')
  document.body.addEventListener('click', () => videoElement.play(), {once:true})
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

  React.useEffect(() => {
    if (!isWX) return
    if (!videoWrapperRef.current) return
    videoElement.src = url
    if (!videoWrapperRef.current.contains(videoElement)) {
      videoWrapperRef.current.appendChild(videoElement)
    }
    videoElement.play()
  }, [videoWrapperRef.current])

  return (
    <div className="vreo-infoPanel-container">
      <div className='vreo-infoPanel'>
        {children}
        <div className='vreo-infoPanel-inner' ref={videoWrapperRef}>
          {!isWX && <video playsInline autoPlay src={url} />}
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

    // Object.assign(window, {
    //   $setInfoPanel: () => {
    //     controller.openPopUp(
    //       // <InfoPanelImg url='//vrlab-static.ljcdn.com/release/web/psq/a.8e868cb2.gif' />
    //       // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/web/psq/b.f9a1ed52.png' />
    //       // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/web/psq/c.4f88c112.png' />
    //       // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/seesay/tools/cat_music___f68fb9bbe1f7cd6d00a16456dd0b09ad.gif' />
    //       <InfoPanelImg url="http://vrlab-public.ljcdn.com/common/images/web/d94e1bd7-0311-4b20-9c41-a1294fe43554.png">
    //         <Title title="场景联动抓拍图片" subTitle={'2022.02.17 14:00'} />
    //       </InfoPanelImg>
    //       // <InfoPanelVideo url="//vrlab-public.ljcdn.com/release/seesay/tools/2022011713142___b320f74a5e1b5ad4bb46b4dc69d73ecc.mp4">
    //       //   <Title title="场景联动抓拍图片" subTitle={'2022.02.17 14:00'} />
    //       // </InfoPanelVideo>
    //     )
    //   },
    //   $setInfoPanel2: () => {
    //     controller.openPopUp(
    //       <InfoPanelImg url='//vrlab-static.ljcdn.com/release/web/psq/a.8e868cb2.gif' />
    //       // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/web/psq/b.f9a1ed52.png' />
    //       // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/web/psq/c.4f88c112.png' />
    //       // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/seesay/tools/cat_music___f68fb9bbe1f7cd6d00a16456dd0b09ad.gif' />
    //       // <InfoPanelImg url="http://vrlab-public.ljcdn.com/common/images/web/d94e1bd7-0311-4b20-9c41-a1294fe43554.png">
    //       //   <Title title="场景联动抓拍图片" subTitle={'2022.02.17 14:00'} />
    //       // </InfoPanelImg>
    //       // <InfoPanelVideo url="//vrlab-public.ljcdn.com/release/seesay/tools/2022011713142___b320f74a5e1b5ad4bb46b4dc69d73ecc.mp4">
    //       //   <Title title="场景联动抓拍图片" subTitle={'2022.02.17 14:00'} />
    //       // </InfoPanelVideo>
    //     )
    //   },
    // })

    return () => {
      controller.off(VreoKeyframeEnum.InfoPanel, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

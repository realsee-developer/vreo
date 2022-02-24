import * as React from 'react'
import { ReactNode } from 'react'
import { InfoPanelData, InfoPanelTypeEnum, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

function InfoPanelImg({ url, children }: { url: string; children?: ReactNode }) {
  return (
    <div className="vreo-infoPanel vreo-infoPanel--img">
      {children}
      <div className="vreo-infoPanelImg" style={{backgroundImage: `url(${url})`}} ></div>
    </div>
  )
}

function InfoPanelVideo({ url, children }: { url: string; children?: ReactNode }) {
  return (
    <div className="vreo-infoPanel vreo-infoPanel--video">
      {children}
      <video playsInline autoPlay className="vreo-infoPanelVideo" src={url} />
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

  return <div className="vreo-infoPanel-title">
    <div className="vreo-infoPanel-t1">{props.title}</div>
    <div className="vreo-infoPanel-t2">{props.subTitle}</div>
  </div>
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
  


      if (infoPanelData.type === InfoPanelTypeEnum.Image) {
        controller.openDrawer({ content: <InfoPanelImg url={infoPanelData.url} />, height: '60vh' })
      } else if (infoPanelData.type === InfoPanelTypeEnum.Video) {
        controller.openDrawer({ content: <InfoPanelVideo url={infoPanelData.url} />, height: '60vh' })
      }
      timeoutRef.current = setTimeout(() => controller.openDrawer(false), end - start)
    }
    controller.on(VreoKeyframeEnum.InfoPanel, callback)

    Object.assign(window, { $setInfoPanel: () => {
      controller.openDrawer({ content: (
        
        // <InfoPanelImg url='//vrlab-public.ljcdn.com/release/seesay/tools/cat_music___f68fb9bbe1f7cd6d00a16456dd0b09ad.gif'>
        <InfoPanelImg url='http://vrlab-public.ljcdn.com/common/images/web/d94e1bd7-0311-4b20-9c41-a1294fe43554.png'>
          <Title title="场景联动抓拍图片" subTitle={"2022.02.17 14:00"} />
        </InfoPanelImg>
      ), height: '60vh' })
    }})

    return () => {
      controller.off(VreoKeyframeEnum.InfoPanel, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

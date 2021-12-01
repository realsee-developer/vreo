import * as React from 'react'
import { InfoPanelData, InfoPanelTypeEnum, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController } from '../../../hooks'

function InfoPanelImg({ url }: { url: string }) {
  return (
    <div className="vreo-infoPanel vreo-infoPanel--img">
      <img className="vreo-infoPanelImg" src={url} />
    </div>
  )
}

function InfoPanelVideo({ url }: { url: string }) {
  return (
    <div className="vreo-infoPanel vreo-infoPanel--video">
      <video playsInline autoPlay className="vreo-infoPanelVideo" src={url} />
    </div>
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

      if (infoPanelData.type === InfoPanelTypeEnum.Image) {
        controller.openDrawer({ content: <InfoPanelImg url={infoPanelData.url} />, height: '60vh' })
      } else if (infoPanelData.type === InfoPanelTypeEnum.Video) {
        controller.openDrawer({ content: <InfoPanelVideo url={infoPanelData.url} />, height: '60vh' })
      }
      timeoutRef.current = setTimeout(() => controller.openDrawer(false), end - start)
    }
    controller.on(VreoKeyframeEnum.InfoPanel, callback)

    return () => {
      controller.off(VreoKeyframeEnum.InfoPanel, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

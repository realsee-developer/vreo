import * as React from 'react'
import { useController } from '../../hooks'
import { VideoAgentMeshOptions } from './VideoAgentMesh'
import { VideoAgentScene } from './VideoAgentScene'

export function VideoAgent(props: { onClick?: () => void; options?: VideoAgentMeshOptions }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const controller = useController()

  React.useEffect(() => {
    if (!ref.current) throw new Error('React 渲染异常，请稍后重试 ...')
    if (controller.videoAgentScene) {
      console.warn('"VideoAgentScene" 重复初始化，已被过滤 ...')
      return
    }
    const videoAgentScene = new VideoAgentScene(ref.current, true, props.options || {})
    controller.videoAgentScene = videoAgentScene

    return () => {
      controller.dispose()
      controller.videoAgentScene?.dispose()
    }
  }, [])

  return (
    <div
      className="VideoAgent"
      onClick={() => {
        if (!props.onClick) return
        props.onClick()
      }}
      ref={ref}
    >
      <div className="VideoAgent-play"></div>
    </div>
  )
}

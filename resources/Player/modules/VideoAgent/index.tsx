import * as React from 'react'
import { useController } from '../../hooks'
import { VideoAgentMeshOptions } from './VideoAgentMesh'
import { VideoAgentScene } from './VideoAgentScene'
import classNames from 'classnames'

export function VideoAgent(props: { onClick?: () => void; options?: VideoAgentMeshOptions }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const controller = useController()

  const showAvatar = React.useMemo(() => {
    return controller.avatar?.url && (controller.avatar.force === true)
  }, [controller.avatar])

  const showVideoAgent = React.useMemo(() => {
    if (showAvatar) return false
    return controller.videoAgentScene?.videoAgentMesh.mediaInstance instanceof HTMLVideoElement
  }, [controller.videoAgentScene, showAvatar])

  React.useEffect(() => {
    if (!ref.current) throw new Error('React 渲染异常，请稍后重试 ...')
    if (controller.videoAgentScene) {
      console.warn('VideoAgentScene" 重复初始化，已被过滤')
      return
    }
    const videoAgentScene = new VideoAgentScene(ref.current, props.options)
    controller.videoAgentScene = videoAgentScene

    return () => {
      controller.dispose()
      controller.videoAgentScene?.dispose()
    }
  }, [])

  return (
    <>
      <div className="Avatar" style={{display: showAvatar ? 'block' : 'none'}}>
        <div className="Avatar-wrapper ratio-1-1">
          <img className="Avatar-img" src={controller.avatar?.url} onClick={() => props.onClick?.()} />
        </div>
      </div>
      <div className={classNames('VideoAgent', { hide: !showVideoAgent })}>
        <div className="VideoAgent-container">
          <div className="VideoAgent-wrapper ratio-16-9">
            <div className="VideoAgent-inner" ref={ref}>
              <div className="VideoAgent-play" onClick={() => props.onClick?.()}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

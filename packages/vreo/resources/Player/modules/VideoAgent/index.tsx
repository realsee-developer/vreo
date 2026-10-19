import * as React from 'react'
import { useController } from '../../hooks'
import { VideoAgentMeshOptions } from './VideoAgentMesh'
import { VideoAgentScene } from './VideoAgentScene'
import classNames from 'classnames'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

export const VideoAgent = observer(function VideoAgent(props: { onClick?: () => void; options?: VideoAgentMeshOptions }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const controller = useController()

  const showAvatar = controller.avatar?.url && controller.avatar.force === true

  const showVideoAgent = !showAvatar &&
    controller.videoAgentScene?.videoAgentMesh.mediaInstance instanceof HTMLVideoElement

  React.useEffect(() => {
    if (!ref.current) throw new Error('React 渲染异常，请稍后重试 ...')
    if (controller.videoAgentScene) {
      console.warn('VideoAgentScene" 重复初始化，已被过滤')
      return
    }
    const forceWebGL = (controller.five.renderer?.backend as { isWebGLBackend?: boolean } | undefined)?.isWebGLBackend === true
    const videoAgentScene = new VideoAgentScene(ref.current, { ...props.options, getPlayback: () => controller.playback.capture() }, forceWebGL)
    runInAction(() => { controller.videoAgentScene = videoAgentScene })

    return () => {
      videoAgentScene.dispose()
      if (controller.videoAgentScene === videoAgentScene) {
        runInAction(() => { controller.videoAgentScene = undefined })
      }
    }
  }, [controller])

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
})

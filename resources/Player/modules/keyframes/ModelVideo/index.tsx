import * as React from 'react'
import { ModelTVVideoPlugin } from '../../../../fivePlugins/ModelTVVideoPlugin'
import { ModelVideoData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController, useFiveInstance } from '../../../hooks'

export function ModelVideo() {
  const controller = useController()
  const five = useFiveInstance()
  const ref = React.useRef<ReturnType<typeof ModelTVVideoPlugin>>()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()

  React.useEffect(() => {
    const callback = async (keyframe: VreoKeyframe) => {
      if (!ref.current) {
        ref.current = ModelTVVideoPlugin(five, {})
      }
      const { start, end } = keyframe
      const { videoSrc, videoPosterSrc, vertexs } = keyframe.data as ModelVideoData

      ref.current.disable()
      await ref.current.load(
        {
          video_src: videoSrc,
          video_poster_src: videoPosterSrc,
          points: [vertexs],
        },
        controller.configs?.videos?.modelTVVideo
      )

      ref.current.enable()
      timeoutRef.current = setTimeout(() => ref.current?.disable(), end - start)
    }

    controller.on(VreoKeyframeEnum.ModelVideo, callback)
    return () => {
      controller.off(VreoKeyframeEnum.ModelVideo, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return <></>
}

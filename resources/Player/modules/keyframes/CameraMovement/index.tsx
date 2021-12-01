import * as React from 'react'
import { CameraMovementPlugin } from '../../../../fivePlugins/CameraMovementPlugin'
import { CameraMovementEffect, RotateArgs } from '../../../../fivePlugins/CameraMovementPlugin/typings'
import { CameraMovementData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController, useFiveInstance } from '../../../hooks'

export function CameraMovement() {
  const controller = useController()
  const five = useFiveInstance()
  const ref = React.useRef<ReturnType<typeof CameraMovementPlugin>>()

  React.useEffect(() => {
    const callback = async (keyframe: VreoKeyframe) => {
      if (!ref.current) {
        ref.current = CameraMovementPlugin(five, {})
      }
      const { start, end, data } = keyframe
      const cameraMovementData = data as CameraMovementData
      const effect = cameraMovementData.effect
      if (effect === CameraMovementEffect.Rotate) {
        ref.current.rotate(data as RotateArgs, end - start)
      } else {
        ref.current.move(data, end - start)
      }
    }

    controller.on(VreoKeyframeEnum.CameraMovement, callback)
    return () => {
      controller.off(VreoKeyframeEnum.CameraMovement, callback)
    }
  }, [controller])
  return <></>
}

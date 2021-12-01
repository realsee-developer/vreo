import * as React from 'react'
import { Vector3 } from 'three'
import classNames from 'classnames'

import lineAnime from './lineAnime'
import { useController, useFiveInstance, useFiveProject2d } from '../../../hooks'
import { BetterTween } from '../../../../shared-utils/animationFrame/BetterTween'
import { PanoEffectData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

export function PanoEffect() {
  const [state, setState] = React.useState<{
    center: Vector3
    distance: number
  } | null>(null)

  const five = useFiveInstance()
  const lineRef = React.useRef<BetterTween<{ progress: number }> | null>(null)
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()

  const controller = useController()
  const project2d = useFiveProject2d()

  const delLine = () => {
    if (lineRef.current) {
      lineRef.current.dispose()
    }
  }

  React.useEffect(() => {
    const callback = (keyframe: VreoKeyframe) => {
      const { start, end, data } = keyframe

      const videoEffectData = data as PanoEffectData

      const [v1, v2] = videoEffectData.twoVertexs
      const p1 = new Vector3(v1.x, v1.y, v1.z)
      const p2 = new Vector3(v2.x, v2.y, v2.z)

      lineRef.current = lineAnime(five, p1.clone(), p2.clone())
      lineRef.current.play()

      const center = p1.lerp(p2, 0.5)
      const distance = p1.distanceTo(p2)

      const p = project2d(center)
      if (!p) return
      const { x: left, y: top } = p
      setState({ center, distance })
      setPos({ left, top })
      timeoutRef.current = setTimeout(() => {
        setState(null)
        setPos(null)
        delLine()
      }, end - start)
    }

    controller.on(VreoKeyframeEnum.PanoEffect, callback)

    return () => {
      controller.off(VreoKeyframeEnum.PanoEffect, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      delLine()
    }
  }, [controller])

  React.useEffect(() => {
    const callback = () => {
      if (!state?.center) return
      const { x, y, z } = state.center
      const res = project2d(new Vector3(x, y, z))
      if (!res) return
      const { x: left, y: top } = res
      setPos({ left, top })
    }
    five.on('currentStateChange', callback)
    return () => {
      five.off('currentStateChange', callback)
    }
  }, [state?.center])

  return (
    <>
      <div
        className={classNames('PanoEffect', {
          'PanoEffect--notHidden': state,
        })}
        style={{
          left: (pos?.left || 0) + 'px',
          top: (pos?.top || 0) + 'px',
        }}
      >
        {state?.distance.toFixed(4) + 'm'}
      </div>
    </>
  )
}

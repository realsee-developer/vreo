import classNames from 'classnames'
import * as React from 'react'
import { Vector3 } from 'three'
import { PanoTextLabelData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'
import { useController, useFiveProject2d } from '../../../hooks'

interface PanoTextLabelState {
  text: string
  left: number
  top: number
  fontSize: number
}

export function PanoTextLabel() {
  const [state, setState] = React.useState<PanoTextLabelState | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()
  const controller = useController()
  const project2d = useFiveProject2d()

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.PanoTextLabel === false) {
      return
    }
    const callback = (keyframe: VreoKeyframe) => {
      const { start, end, data } = keyframe
      const panoTextLabelData = data as PanoTextLabelData
      const { x, y, z } = panoTextLabelData.vertex

      const res = project2d(new Vector3(x, y, z))
      if (!res) return
      const { x: left, y: top } = res

      Object.assign(window, { $PanoTextLabel: { setState } })
      setState({ left, top, text: data.text || '', fontSize: data.fontSize || 16 })
      timeoutRef.current = setTimeout(() => setState(null), end - start)
    }
    controller.on(VreoKeyframeEnum.PanoTextLabel, callback)

    Object.assign(window, { $panoTextLabel: { setState } })
    return () => {
      controller.off(VreoKeyframeEnum.PanoTextLabel, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return (
    <div
      className={classNames('PanoTextLabel', {
        'PanoTextLabel--notHidden': state,
      })}
      style={{
        left: (state?.left || 0) + 'px',
        top: (state?.top || 0) + 'px',
      }}
    >
      <div className="PanoTextLabel-wrapper">
        <div style={{ fontSize: `${state?.fontSize || 16}px` }} className="PanoText-innerText">
          {state?.text || ''}
        </div>
      </div>
    </div>
  )
}

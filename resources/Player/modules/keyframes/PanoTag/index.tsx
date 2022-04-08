import classNames from 'classnames'
import * as React from 'react'
import { Vector3 } from 'three'
import { useController, useFiveInstance, useFiveProject2d } from '../../../hooks'
import {
  PanoTagData,
  PanoTagEnum,
  PanoTagStyleEnum,
  Vertex,
  VreoKeyframe,
  VreoKeyframeEnum,
} from '../../../../typings/VreoUnit'

export function PanoTag() {
  const [state, setState] = React.useState<{
    vertex: Vertex
    text?: string
    type: PanoTagEnum
    style?: PanoTagStyleEnum
    imgUrl?: string
  } | null>(null)

  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()

  const controller = useController()
  const five = useFiveInstance()
  const project2d = useFiveProject2d()

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.PanoTag === false) {
      return
    }
    const callback = (keyframe: VreoKeyframe) => {
      const { start, end, data } = keyframe

      const panoTagData = data as PanoTagData
      const vertex = panoTagData.vertex
      const { x, y, z } = panoTagData.vertex
      const res = project2d(new Vector3(x, y, z))

      if (!res) return
      const { x: left, y: top } = res
      setState({
        vertex,
        text: panoTagData.text || PanoTagEnum.Text,
        type: panoTagData.type,
        imgUrl: panoTagData.imgUrl,
        style: panoTagData.style || PanoTagStyleEnum.Growth,
      })
      setPos({ left, top })
      timeoutRef.current = setTimeout(() => {
        setState(null)
        setPos(null)
      }, end - start)
    }

    controller.on(VreoKeyframeEnum.PanoTag, callback)

    return () => {
      controller.off(VreoKeyframeEnum.PanoTag, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  React.useEffect(() => {
    const callback = () => {
      if (!state?.vertex) return
      const { x, y, z } = state.vertex
      const res = project2d(new Vector3(x, y, z))
      if (!res) return
      const { x: left, y: top } = res
      setPos({ left, top })
    }
    five.on('currentStateChange', callback)

    return () => {
      five.off('currentStateChange', callback)
    }
  }, [state?.vertex])

  const boxContent = (() => {
    if (!state) return undefined

    if (state.type === PanoTagEnum.Text) {
      return (
        <>
          <span>{state.text}</span>
        </>
      )
    }
    if (state.type === PanoTagEnum.Image) {
      return (
        <>
          <img className="PanoTag-img" src={state.imgUrl!} alt={state.text || ''}></img>
          <span className="PanoTag-txt">{state.text}</span>
        </>
      )
    }
    return undefined
  })()

  if (state?.style === PanoTagStyleEnum.Expand) {
    return (
      <>
        <div
          className={classNames('PanoTag', {
            'PanoTag--expand': true,
            'PanoTag--notHidden': state,
          })}
          style={{
            left: (pos?.left || 0) + 'px',
            top: (pos?.top || 0) + 'px',
          }}
        >
          <div className={'PanoTag-box PanoTag-box--' + (state?.type || '')}>{boxContent}</div>
          <div className="PanoTag-guideline"></div>
        </div>
      </>
    )
  }
  return (
    <>
      <div
        className={classNames('PanoTag', {
          'PanoTag--notHidden': state,
        })}
        style={{
          left: (pos?.left || 0) + 'px',
          top: (pos?.top || 0) + 'px',
        }}
      >
        <div className="PanoTag-point"></div>
        <div className="PanoTag-content">
          <span className="PanoTag-linewrap">
            <span className="PanoTag-slashline"></span>
            <span className="PanoTag-straightline"></span>
          </span>
          <div className={'PanoTag-box PanoTag-box--' + (state?.type || '')}>{boxContent}</div>
        </div>
      </div>
    </>
  )
}

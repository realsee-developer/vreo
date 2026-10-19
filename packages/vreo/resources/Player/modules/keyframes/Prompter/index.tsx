import * as React from 'react'
import classNames from 'classnames'
import { useController } from '../../../hooks'

import { VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

export function Prompter() {
  const [text, setText] = React.useState<string>('')
  const [hidden, setHidden] = React.useState<boolean>(true)
  const ref = React.useRef<NodeJS.Timeout | null>(null)
  const controller = useController()

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.Prompter === false) {
      return
    }
    const stop = () => {
      if (ref.current !== null) clearTimeout(ref.current)
      ref.current = null
      setHidden(true)
      setText('')
    }
    const removePlaybackCleanup = controller.playback.add(stop)
    const callback = (keyframe: VreoKeyframe, currentTime = keyframe.start) => {
      const { end, data } = keyframe
      setText(data.text)
      setHidden(false)

      if (ref.current) {
        clearTimeout(ref.current)
        ref.current = null
      }

      ref.current = setTimeout(stop, Math.max(0, end - currentTime))
    }

    controller.on(VreoKeyframeEnum.Prompter, callback)

    return () => {
      controller.off(VreoKeyframeEnum.Prompter, callback)
      removePlaybackCleanup()
      stop()
    }
  }, [controller])

  return (
    <div
      className={classNames('vreo-prompter', {
        'vreo-prompter--hidden': hidden,
        [`vreo-prompter-left--${controller.agentType}`]: true,
      })}
    >
      <div className="vreo-prompter-text">
        <div className="vreo-prompter-innerText">{text}</div>
      </div>
    </div>
  )
}

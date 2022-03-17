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
    const callback = (keyframe: VreoKeyframe) => {
      const { start, end, data } = keyframe
      setText(data.text)
      setHidden(false)

      if (ref.current) {
        clearTimeout(ref.current)
        ref.current = null
      }

      ref.current = setTimeout(() => {
        setHidden(true)
        setText('')
        // setTimeout(() => setText(''), 500)

        if (ref.current) clearTimeout(ref.current)
        ref.current = null
      }, end - start)
    }

    controller.on(VreoKeyframeEnum.Prompter, callback)

    return () => {
      controller.off(VreoKeyframeEnum.Prompter, callback)
    }
  }, [controller])

  return (
    <div
      className={classNames('vreo-prompter', {
        'vreo-prompter--hidden': hidden,
        'vreo-prompter--audio': controller.isAudio,
      })}
    >
      <div className="vreo-prompter-text">
        <div className="vreo-prompter-innerText">{text}</div>
      </div>
    </div>
  )
}

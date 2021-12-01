import * as React from 'react'
import classNames from 'classnames'
import { useController } from '../../../hooks'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
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
        setTimeout(() => setText(''), 500)

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
      })}
    >
      {text ? (
        /* @warning "index.js:1 Warning: findDOMNode is deprecated in StrictMode." */
        <TransitionGroup className="vreo-prompter-text">
          <CSSTransition
            key={text}
            classNames="vreo-prompter-text-transition"
            timeout={500}
            addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
          >
            <div className="vreo-prompter-innerText">{text}</div>
          </CSSTransition>
        </TransitionGroup>
      ) : undefined}
    </div>
  )
}

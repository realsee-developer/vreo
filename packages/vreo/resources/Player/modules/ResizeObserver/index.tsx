import React from 'react'
import { addResizeListener, hasResizeListener } from '../../../shared-utils/addResizeListener'
import { useController } from '../../hooks'

export function ResizeObserver() {
  const ref = React.useRef<HTMLDivElement>(null)
  const controller = useController()

  React.useEffect(() => {
    if (!ref.current) return
    const resizeElement = controller.container.parentElement
    if (hasResizeListener(resizeElement)) return
    const dispose = addResizeListener(resizeElement, (width, height) => {
      controller.setContainerSize(width, height)
    })

    return () => {
      dispose()
    }
  }, [])

  return <div className="resizeObserver-element" ref={ref}></div>
}
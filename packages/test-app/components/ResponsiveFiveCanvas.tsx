import * as React from 'react'
import { FiveCanvas } from '@realsee/five/react'

/**
 * 响应式 FiveCanvas
 *
 * @description 会根据浏览器窗口宽高变化自适应 `Five` 画布面板。
 */
export function ResponsiveFiveCanvas() {
  const [state, setState] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!ref.current) return

    setState({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const updateState = ({ width, height }: { width: number; height: number }) => setState({ width, height })
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const width = entry.target.clientWidth
      const height = entry.target.clientHeight
      updateState({ width, height })
    })

    observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
      observer.disconnect()
    }
  }, [])
  return (
    <div
      className="ResponsiveFiveCanvas"
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: state.width === 0 || state.height === 0 ? 0 : 1,
      }}
    >
      <FiveCanvas width={state.width} height={state.height} />
    </div>
  )
}

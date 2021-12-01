import * as React from 'react'
import { FiveCanvas } from '@realsee/five/react'
import { debounce } from '../shared-utils/debounce'

/**
 * 响应式全屏 FiveCanvas
 *
 * @description 会根据窗口宽高变化自适应 `Five` 画布面板。
 */
export function ResponsiveFullScreenFiveCanvas() {
  const [state, setState] = React.useState<{ width: number; height: number }>({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  })

  React.useEffect(() => {
    const listener = debounce(() =>
      setState({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      })
    )
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [])

  return <FiveCanvas width={state.width} height={state.height} />
}

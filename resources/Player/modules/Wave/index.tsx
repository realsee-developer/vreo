import React from 'react'
import { WaveAppearance } from '../../typings'

export function Wave(props?: { appearance?: WaveAppearance }) {
  const waveUrl = React.useMemo(() => {
    const appearance = props?.appearance ?? 'solid'
    switch (appearance) {
      default:       return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-solid.cf68912a93275d07aa6b5097ea11fdda.mov'
      case 'solid':  return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-solid.cf68912a93275d07aa6b5097ea11fdda.mov'
      case 'single': return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-single.140d197f4838c130b69e87dfd0705479.mov'
      case 'double': return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-double.3e6d73050ee6958cc3060b107ebe5f39.mov'
      case 'swap':   return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-swap.b38f22e2cf84ee21e9be35f7f56c9cfc.mov'
      case 'expand': return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-expand.9529956c5954740cd4c9d07d51e32822.mov'
    }
  }, [props?.appearance])

  return <video className='vreo-wave' width="100%" preload="auto" muted autoPlay loop playsInline disablePictureInPicture controls={false} src={waveUrl} />
}
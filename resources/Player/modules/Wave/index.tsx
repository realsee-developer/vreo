import React from 'react'
import { WaveAppearance } from '../../typings'

export function Wave(props?: { appearance?: WaveAppearance }) {
  const waveUrl = React.useMemo(() => {
    const appearance = props?.appearance ?? 'solid'
    switch (appearance) {
      default:       return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-solid.64438b63cbb346906d066bb7b8dc3e20.webm'
      case 'solid':  return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-solid.64438b63cbb346906d066bb7b8dc3e20.webm'
      case 'single': return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-single.eda65de390a830193fff40d1f1255555.webm'
      case 'double': return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-double.77dfe8548ebcb3f3d336785d4fe9c7b2.webm'
      case 'swap':   return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-swap.c02e4b94cf05aecf6e7a0023bc7bb90f.webm'
      case 'expand': return 'https://vr-public.realsee-cdn.cn/release/static/image/release/vapor/static/wave-expand.a0d2a0074001cd3d4fea56818c6d3c38.webm'
    }
  }, [props?.appearance])

  return <video className='vreo-wave' width="100%" preload="auto" muted autoPlay loop playsInline disablePictureInPicture controls={false} src={waveUrl} />
}
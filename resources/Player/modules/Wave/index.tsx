import React from 'react'
import { WaveAppearance } from '../../typings'

export function Wave(props?: { appearance?: WaveAppearance }) {
  const waveUrl = React.useMemo(() => {
    const appearance = props?.appearance ?? 'solid'
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isAppleDevice = /(iPhone|iPad|iPod)/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent) && /version/i.test(userAgent);
    const canPlayHevc = isAppleDevice || isSafari;
    const canPlayVp9 = typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported("video/webm; codecs=vp9");
    const prefix = 'https://vr-public.realsee-cdn.cn/release/static/image/release/'

    const WAVES = {
      single: {
        width: 766,
        height: 60,
        frames: 20,
        hevc: 'vapor/static/wave-single.140d197f4838c130b69e87dfd0705479.mov',
        vp9: 'vapor/static/wave-single.eda65de390a830193fff40d1f1255555.webm',
        png: 'vapor/static/wave-single.f51aade2a6e1c59211698a1a24e6135f.png',
      },
      double: {
        width: 766,
        height: 60,
        frames: 16,
        hevc: 'vapor/static/wave-double.3e6d73050ee6958cc3060b107ebe5f39.mov',
        vp9: '/vapor/static/wave-double.77dfe8548ebcb3f3d336785d4fe9c7b2.webm',
        png: '/vapor/static/wave-double.ab4fe7d8a70395109ca4f759af7bd53f.png',
      },
      solid: {
        width: 1126,
        height: 90,
        frames: 48,
        hevc: 'vapor/static/wave-solid.cf68912a93275d07aa6b5097ea11fdda.mov',
        vp9: 'vapor/static/wave-solid.64438b63cbb346906d066bb7b8dc3e20.webm',
        png: 'vapor/static/wave-solid.6969d7f3f2f44f7ac1ade30e65660cb1.png',
      },
      swap: {
        width: 2250,
        height: 180,
        frames: 41,
        hevc: 'vapor/static/wave-swap.b38f22e2cf84ee21e9be35f7f56c9cfc.mov',
        vp9: 'vapor/static/wave-swap.c02e4b94cf05aecf6e7a0023bc7bb90f.webm',
        png: 'vapor/static/wave-swap.772ba526a7210dcc01567062c6319545.png',
      },
      expand: {
        width: 2250,
        height: 180,
        frames: 45,
        hevc: 'vapor/static/wave-expand.9529956c5954740cd4c9d07d51e32822.mov',
        vp9: 'vapor/static/wave-expand.a0d2a0074001cd3d4fea56818c6d3c38.webm',
        png: 'vapor/static/wave-expand.62fcf27b445533e6eb1b17bab5eafa0d.png',
      }
    } as const;

    if (canPlayVp9) return prefix + WAVES[appearance]['vp9']
    if (canPlayHevc) return prefix + WAVES[appearance]['hevc']
    return ''
    
  }, [props?.appearance])

  return <video className='vreo-wave' width="100%" preload="auto" muted autoPlay loop playsInline disablePictureInPicture controls={false} src={waveUrl} />
}
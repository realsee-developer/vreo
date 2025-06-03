import * as TWEEN from '@tweenjs/tween.js'
import { requestAnimationFrameInterval } from '.'

type UnknownProps = Record<string, any>

export class BetterTween<G extends UnknownProps> extends TWEEN.Tween<G> {
  private disposeMethods: (() => void)[] = []
  private animationFrameDisposer?: () => void

  public onDispose = (callback: () => void) => {
    this.disposeMethods.push(callback)
    return this
  }

  public play = () => {
    this.start()
    this.animationFrameDisposer = requestAnimationFrameInterval(() => this.update())
    return this
  }

  public dispose = () => {
    this.stop()
    this.animationFrameDisposer?.()
    this.disposeMethods.forEach((fn) => fn())
    this.disposeMethods = []
    TWEEN.remove(this)
  }
}

export function tweenProgress(duration?: number, easing = TWEEN.Easing.Linear.None) {
  const tween = new BetterTween({ progress: 0 }).to({ progress: 1 })
  if (duration !== undefined) tween.duration(duration)
  if (easing !== undefined) tween.easing(easing)
  return tween
}

import { Tween, Easing } from '@tweenjs/tween.js'
import { nextFrame, requestAnimationFrameInterval } from './index'

interface ITween<T> extends Tween<T> {
  onDestroy: (fn: () => void) => Tween<T>
  destroy: () => void
}

/**
 * 对象变化的补间动画
 * 1. 应用 requestAnimationFrameInterval 做 update
 * 2. 在原生 tween 上新增 destroy 方法和 onDestroy 监听
 * DOC： https://github.com/tweenjs/tween.js
 * @param from 对象起始状态
 * @param to 对象末尾状态
 * @param duration 经历时间（s）
 * @param easing 过程动画，默认是 Easing.Linear.None
 */
export default function tween<T>(from: T, to: T, duration: number, easing = Easing.Linear.None) {
  const tween = new Tween(from).to(to, duration).easing(easing) as ITween<T>
  // 这里注意一下，因为 requestAnimationFrameInterval 给的时间是从 0 开始的，tween 动画也从 0 开始
  nextFrame(() => tween.start(0))

  const cancelAnimationFrame = requestAnimationFrameInterval((time) => {
    if (tween.update(time) === false) cancelAnimationFrame()
  })
  const destroyMethods: ((...params: any) => any)[] = []
  tween.onDestroy = (fn) => {
    destroyMethods.push(fn)
    return tween
  }
  tween.destroy = function () {
    this.stop()
    Object.assign(tween, {
      _onStartCallback: null,
      _onUpdateCallback: null,
      _onCompleteCallback: null,
      _onStopCallbackL: null,
    })
    let destroyMethod: undefined | ((...params: any) => any)
    while ((destroyMethod = destroyMethods.shift())) destroyMethod()
    cancelAnimationFrame()
  }
  return tween
}

export function tweenProgress(duration: number, easing: typeof Easing.Linear.None) {
  return tween({ progress: 0 }, { progress: 1 }, duration, easing)
}

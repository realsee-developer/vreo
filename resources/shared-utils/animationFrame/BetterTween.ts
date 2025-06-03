/**
 * @fileoverview 增强版的 Tween 动画类
 * 
 * 基于 @tweenjs/tween.js 的增强版本，提供更好的生命周期管理和资源清理功能。
 */

import TWEEN from '@tweenjs/tween.js'
import { requestAnimationFrameInterval } from '.'

/**
 * 销毁回调函数类型
 */
type DisposeCallback = () => void

/**
 * 增强版的 Tween 动画类
 * 
 * 继承自 TWEEN.Tween，增加了资源管理和自动清理功能。
 * 提供了更简单的播放接口和完善的销毁机制。
 * 
 * @template G - 要进行动画的对象类型，必须是一个记录类型
 * 
 * @example
 * ```typescript
 * const position = { x: 0, y: 0 };
 * const tween = new BetterTween(position)
 *   .to({ x: 100, y: 100 }, 1000)
 *   .easing(TWEEN.Easing.Quadratic.Out)
 *   .onUpdate(() => console.log('位置更新:', position))
 *   .onDispose(() => console.log('动画已销毁'))
 *   .play();
 * 
 * // 5秒后销毁动画
 * setTimeout(() => tween.dispose(), 5000);
 * ```
 */
export class BetterTween<G extends Record<string, any>> extends TWEEN.Tween<G> {
  /**
   * 销毁时需要执行的回调函数列表
   * @private
   */
  private disposeMethods: DisposeCallback[] = []
  
  /**
   * 动画帧循环的销毁函数
   * @private
   */
  private animationFrameDisposer?: DisposeCallback

  /**
   * 添加销毁时的回调函数
   * 
   * 当调用 dispose() 方法时，所有通过此方法注册的回调都会被执行。
   * 
   * @param callback - 销毁时要执行的回调函数
   * @returns 返回当前实例，支持链式调用
   * 
   * @example
   * ```typescript
   * tween
   *   .onDispose(() => console.log('清理资源1'))
   *   .onDispose(() => console.log('清理资源2'))
   *   .play();
   * ```
   */
  public onDispose = (callback: DisposeCallback): this => {
    this.disposeMethods.push(callback)
    return this
  }

  /**
   * 开始播放动画
   * 
   * 自动启动 Tween 并创建动画帧循环来更新动画状态。
   * 相比原生的 start() 方法，这个方法会自动处理动画帧更新。
   * 
   * @returns 返回当前实例，支持链式调用
   * 
   * @example
   * ```typescript
   * const tween = new BetterTween({ opacity: 0 })
   *   .to({ opacity: 1 }, 1000)
   *   .play(); // 立即开始播放
   * ```
   */
  public play = (): this => {
    this.start()
    this.animationFrameDisposer = requestAnimationFrameInterval(() => this.update())
    return this
  }

  /**
   * 销毁动画并清理所有资源
   * 
   * 停止动画，清理动画帧循环，执行所有注册的销毁回调，
   * 并从全局 TWEEN 管理器中移除当前动画。
   * 
   * @example
   * ```typescript
   * // 手动销毁动画
   * tween.dispose();
   * 
   * // 或者在动画完成时自动销毁
   * tween.onComplete(() => tween.dispose());
   * ```
   */
  public dispose = (): void => {
    this.stop()
    this.animationFrameDisposer?.()
    this.disposeMethods.forEach((fn) => fn())
    this.disposeMethods = []
    TWEEN.remove(this)
  }
}

/**
 * 创建一个进度动画的便捷函数
 * 
 * 创建一个从 0 到 1 的进度动画，常用于控制其他动画的进度。
 * 
 * @param duration - 动画持续时间（毫秒），可选
 * @param easing - 缓动函数，默认为线性缓动
 * @returns 配置好的 BetterTween 实例
 * 
 * @example
 * ```typescript
 * // 创建一个2秒的进度动画
 * const progressTween = tweenProgress(2000, TWEEN.Easing.Quadratic.InOut)
 *   .onUpdate((obj) => {
 *     console.log(`进度: ${(obj.progress * 100).toFixed(1)}%`);
 *   })
 *   .play();
 * ```
 */
export function tweenProgress(
  duration?: number, 
  easing: typeof TWEEN.Easing.Linear.None = TWEEN.Easing.Linear.None
): BetterTween<{ progress: number }> {
  const tween = new BetterTween({ progress: 0 }).to({ progress: 1 })
  if (duration !== undefined) tween.duration(duration)
  if (easing !== undefined) tween.easing(easing)
  return tween
}

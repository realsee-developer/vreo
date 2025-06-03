/**
 * @fileoverview 动画帧相关工具函数
 * 
 * 提供跨浏览器兼容的 requestAnimationFrame 相关功能，
 * 包括动画帧循环、延迟执行和时间测量等实用功能。
 */

/** 动画帧回调函数类型 */
type AnimationFrameCallback = (time: number) => void

/** 停止动画帧循环的函数类型 */
type StopAnimationFrameFunction = () => void

/**
 * 跨浏览器兼容的 requestAnimationFrame 实现
 * 在不支持的浏览器中使用 setTimeout 作为回退方案
 */
const _requestAnimationFrame: (callback: FrameRequestCallback) => number = 
  window.requestAnimationFrame || 
  ((fn: FrameRequestCallback): number => window.setTimeout(() => fn(performance.now()), 16) as any)

/**
 * 跨浏览器兼容的 cancelAnimationFrame 实现
 * 在不支持的浏览器中使用 clearTimeout 作为回退方案
 */
const _cancelAnimationFrame: (handle: number) => void = 
  window.cancelAnimationFrame || 
  ((handle: number) => window.clearTimeout(handle))

export default _requestAnimationFrame

/**
 * 在指定延迟后执行回调函数
 * 
 * 使用动画帧来实现延迟，比 setTimeout 更适合动画相关的操作。
 * 延迟以帧数为单位，而不是毫秒。
 * 
 * @param fn - 要执行的回调函数
 * @param delay - 延迟的帧数，默认为 0（下一帧立即执行）
 * 
 * @example
 * ```typescript
 * // 下一帧执行
 * nextFrame(() => console.log('下一帧执行'));
 * 
 * // 延迟3帧后执行
 * nextFrame(() => console.log('3帧后执行'), 3);
 * ```
 */
export function nextFrame(fn: FrameRequestCallback, delay: number = 0): void {
  if (delay <= 0) {
    _requestAnimationFrame(fn)
  } else {
    _requestAnimationFrame(() => nextFrame(fn, delay - 1))
  }
}

/**
 * 创建一个动画帧循环
 * 
 * 按指定的帧率执行回调函数，提供精确的时间控制。
 * 返回一个停止函数，调用后可以终止循环。
 * 
 * @param callback - 每次动画帧中调用的函数，接收相对于开始时间的时间戳（毫秒）
 * @param frame - 目标帧率，默认为 60 FPS
 * @returns 返回一个函数，调用后可以停止动画帧循环
 * 
 * @example
 * ```typescript
 * const stopAnimation = requestAnimationFrameInterval((time) => {
 *   console.log(`动画运行时间: ${time}ms`);
 *   if (time > 5000) {
 *     stopAnimation(); // 5秒后停止
 *   }
 * }, 30); // 30 FPS
 * ```
 */
export function requestAnimationFrameInterval(
  callback?: AnimationFrameCallback, 
  frame: number = 60
): StopAnimationFrameFunction {
  let index: number = -1
  let oldTime: number = 0
  let startTime: number = -1
  const minDeltaTime: number = 1000 / frame

  function loop(time: number): void {
    startTime === -1 && (startTime = time)
    index = _requestAnimationFrame(loop)
    const deltaTime = time - oldTime
    if (deltaTime < minDeltaTime) return
    oldTime = time
    callback && callback(time - startTime)
  }

  index = _requestAnimationFrame(loop)
  
  return function stop(): void {
    _cancelAnimationFrame(index)
  }
}

/**
 * 测量两个动画帧之间的时间间隔
 * 
 * 用于性能测试和帧率监控，返回一个 Promise。
 * 
 * @returns Promise，解析值为两个动画帧之间的时间间隔（毫秒）
 * 
 * @example
 * ```typescript
 * getFrameTime().then((frameTime) => {
 *   console.log(`帧间隔: ${frameTime}ms`);
 *   console.log(`当前帧率: ${1000 / frameTime} FPS`);
 * });
 * ```
 */
export function getFrameTime(): Promise<number> {
  const start: number = Date.now()
  return new Promise<number>((resolve) => {
    _requestAnimationFrame(() => {
      resolve(Date.now() - start)
    })
  })
}

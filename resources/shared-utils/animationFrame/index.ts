const _requestAnimationFrame = window.requestAnimationFrame || ((fn) => setTimeout(() => fn(performance.now()), 16))

const _cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout

export default _requestAnimationFrame

export function nextFrame(fn: FrameRequestCallback, delay = 0) {
  if (delay <= 0) _requestAnimationFrame(fn)
  else _requestAnimationFrame(() => nextFrame(fn, delay - 1))
}

/**
 * 在每个 AnimationFrame 中调用传入的函数
 * @param callback 每次 AnimationFrame 中调用的函数
 * @param frame 每秒运行多少次
 * @returns 返回一个函数，调用可以停止 AnimationFrameLoop
 */
export function requestAnimationFrameInterval(callback?: (time: number) => any, frame = 60) {
  let index = -1
  let oldTime = 0
  let startTime = -1
  const minDeltaTime = 1000 / frame
  function loop(time: number) {
    startTime === -1 && (startTime = time)
    index = _requestAnimationFrame(loop)
    const deltaTime = time - oldTime
    if (deltaTime < minDeltaTime) return
    oldTime = time
    callback && callback(time - startTime)
  }
  index = _requestAnimationFrame(loop)
  return function stop() {
    _cancelAnimationFrame(index)
  }
}

/**
 * 获取两个 AnimationFrame 间隔的时间
 * @returns 返回一个 Promise，resolve 的结果是两个 AnimationFrame 间隔的时间
 */
export function getFrameTime() {
  const start = Date.now()
  return new Promise((resolve) => {
    _requestAnimationFrame(() => {
      resolve(Date.now() - start)
    })
  })
}

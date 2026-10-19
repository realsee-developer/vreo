const scope = globalThis as typeof globalThis & {
  requestAnimationFrame?: (callback: FrameRequestCallback) => number
  cancelAnimationFrame?: (handle: number) => void
}

const requestFrame = scope.requestAnimationFrame?.bind(scope)
  ?? ((callback: FrameRequestCallback) => setTimeout(() => callback(performance.now()), 16) as unknown as number)
const cancelFrame = scope.cancelAnimationFrame?.bind(scope)
  ?? ((handle: number) => clearTimeout(handle))

export default requestFrame

export function nextFrame(fn: FrameRequestCallback, delay = 0) {
  if (delay <= 0) requestFrame(fn)
  else requestFrame(() => nextFrame(fn, delay - 1))
}

export function requestAnimationFrameInterval(callback?: (time: number) => unknown, frame = 60) {
  let handle = -1
  let previousTime = 0
  let startTime = -1
  const minimumDelta = 1000 / frame
  function loop(time: number) {
    if (startTime === -1) startTime = time
    handle = requestFrame(loop)
    if (time - previousTime < minimumDelta) return
    previousTime = time
    callback?.(time - startTime)
  }
  handle = requestFrame(loop)
  return () => cancelFrame(handle)
}

export function getFrameTime() {
  const start = Date.now()
  return new Promise<number>(resolve => requestFrame(() => resolve(Date.now() - start)))
}

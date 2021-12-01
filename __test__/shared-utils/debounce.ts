/**
 * 函数防抖：指触发事件后，在 `n` 秒内函数只能执行一次，如果触发事件后在 `n` 秒内又触发了事件，则会重新计算函数延执行时间。
 * @param callback 回调函数
 * @param waitFor 等待时间
 * @returns
 */
export const debounce = <F extends (...args: any) => any>(
  callback: F,
  waitFor = 1000 / 60,
): ((...args: Parameters<F>) => ReturnType<F>) => {
  let timer: NodeJS.Timer | null = null
  const savedFunc = callback

  const fn = (...args: any) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      savedFunc?.(...args)
      if (timer) clearTimeout(timer)
      timer = null
    }, waitFor)
  }
  return fn as (...args: Parameters<F>) => ReturnType<F>
}

type ResizeHandler = (width: number, height: number) => void

const resizeObserverCache = new Map<Element, number>()

function add(element: Element) {
  resizeObserverCache.set(element, (resizeObserverCache.get(element) ?? 0) + 1)
}

function remove(element: Element) {
  const remaining = (resizeObserverCache.get(element) ?? 1) - 1
  if (remaining > 0) resizeObserverCache.set(element, remaining)
  else resizeObserverCache.delete(element)
}

export function addResizeListener(element: Element | undefined | null, resizeHandler: ResizeHandler, immediate = true) {
  if (!element) return () => {}
  if (immediate) resizeHandler(element.clientWidth, element.clientHeight)

  let disposed = false
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => resizeHandler(element.clientWidth, element.clientHeight))
    observer.observe(element)
    add(element)
    return () => {
      if (disposed) return
      disposed = true
      observer.disconnect()
      remove(element)
    }
  }

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0;visibility:hidden;margin:0;border:0;padding:0;z-index:-1;'
  iframe.classList.add('resize-sensor-iframe')
  element.appendChild(iframe)
  const contentWindow = iframe.contentWindow
  if (!contentWindow) {
    iframe.remove()
    return () => {}
  }
  const onResize = () => resizeHandler(iframe.clientWidth, iframe.clientHeight)
  contentWindow.addEventListener('resize', onResize)
  add(element)
  return () => {
    if (disposed) return
    disposed = true
    contentWindow.removeEventListener('resize', onResize)
    iframe.remove()
    remove(element)
  }
}

export function hasResizeListener(element?: Element | null) {
  return !!element && (resizeObserverCache.get(element) ?? 0) > 0
}

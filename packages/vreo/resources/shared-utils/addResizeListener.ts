type ResizeHandler =  (width: number, height: number) => void

const resizeObserverCache = new Map<Element, number>()

export function addResizeListener(element: Element | undefined | null, resizeHandler: ResizeHandler, immediate = true) {
  if (!element) return () => {}

  if (immediate) resizeHandler(element.clientWidth, element.clientHeight)

  if (typeof ResizeObserver !== 'undefined' && ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => resizeHandler(element.clientWidth, element.clientHeight))

    resizeObserver.observe(element)
    resizeObserverCache.set(element, resizeObserverCache.get(element) || 0 + 1)

    return () => {
      if (element) resizeObserver.unobserve(element)
      if (resizeObserverCache.get(element) === 1) {
        resizeObserverCache.delete(element)
      }
    }
  } else {
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0;visibility:hidden;margin:0;border:0;padding:0;z-index:-1;'
    iframe.classList.add('resize-sensor-iframe')
    element.appendChild(iframe)
    if (!iframe.contentWindow) return () => {}

    iframe.contentWindow.addEventListener('resize', () => {
      resizeHandler(iframe.clientWidth, iframe.clientHeight)
    })
    resizeObserverCache.set(element, resizeObserverCache.get(element) || 0 + 1)

    return () => {
      element.removeChild(iframe)
      if (resizeObserverCache.get(element) === 1) {
        resizeObserverCache.delete(element)
      }
    }
  }
}

export function hasResizeListener(element?: Element | null) {
  if (!element) return false
  return resizeObserverCache.get(element) || 0 > 0
}
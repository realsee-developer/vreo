export default function createResizeObserver(callback: () => void, element?: HTMLElement) {
  let observing = false
  if (!element || typeof ResizeObserver === 'undefined') {
    return {
      observe() {
        if (observing) return
        observing = true
        window.addEventListener('resize', callback)
      },
      unobserve() {
        if (!observing) return
        observing = false
        window.removeEventListener('resize', callback)
      },
      disconnect() {
        if (!observing) return
        observing = false
        window.removeEventListener('resize', callback)
      },
    }
  }

  const observer = new ResizeObserver(callback)
  return {
    observe() {
      if (observing) return
      observing = true
      observer.observe(element)
    },
    unobserve() {
      if (!observing) return
      observing = false
      observer.unobserve(element)
    },
    disconnect() {
      observing = false
      observer.disconnect()
    },
  }
}

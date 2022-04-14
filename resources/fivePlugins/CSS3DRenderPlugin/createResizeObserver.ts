/**
 * @description: 简陋的 ResizeObserver polyfill
 */
 export default function createResizeObserver(func: () => any, element?: HTMLElement) {
  if (!element || typeof ResizeObserver === 'undefined') {
    return {
      observe: () => window.addEventListener('resize', func),
      unobserve: () => window.removeEventListener('resize', func),
    }
  } else {
    const observer = new ResizeObserver(func)
    return {
      observe: () => observer.observe(element),
      unobserve: () => observer.unobserve(element),
    }
  }
}

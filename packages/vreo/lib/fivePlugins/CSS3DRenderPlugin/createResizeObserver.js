/**
 * @description: 简陋的 ResizeObserver polyfill
 */
export default function createResizeObserver(func, element) {
  if (!element || typeof ResizeObserver === 'undefined') {
    return {
      observe: function observe() {
        return window.addEventListener('resize', func);
      },
      unobserve: function unobserve() {
        return window.removeEventListener('resize', func);
      }
    };
  } else {
    var observer = new ResizeObserver(func);
    return {
      observe: function observe() {
        return observer.observe(element);
      },
      unobserve: function unobserve() {
        return observer.unobserve(element);
      }
    };
  }
}
var resizeObserverCache = new Map();
export function addResizeListener(element, resizeHandler) {
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (!element) return function () {};
  if (immediate) resizeHandler(element.clientWidth, element.clientHeight);
  if (typeof ResizeObserver !== 'undefined' && ResizeObserver) {
    var resizeObserver = new ResizeObserver(function () {
      return resizeHandler(element.clientWidth, element.clientHeight);
    });
    resizeObserver.observe(element);
    resizeObserverCache.set(element, resizeObserverCache.get(element) || 0 + 1);
    return function () {
      if (element) resizeObserver.unobserve(element);
      if (resizeObserverCache.get(element) === 1) {
        resizeObserverCache.delete(element);
      }
    };
  } else {
    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0;visibility:hidden;margin:0;border:0;padding:0;z-index:-1;';
    iframe.classList.add('resize-sensor-iframe');
    element.appendChild(iframe);
    if (!iframe.contentWindow) return function () {};
    iframe.contentWindow.addEventListener('resize', function () {
      resizeHandler(iframe.clientWidth, iframe.clientHeight);
    });
    resizeObserverCache.set(element, resizeObserverCache.get(element) || 0 + 1);
    return function () {
      element.removeChild(iframe);
      if (resizeObserverCache.get(element) === 1) {
        resizeObserverCache.delete(element);
      }
    };
  }
}
export function hasResizeListener(element) {
  if (!element) return false;
  return resizeObserverCache.get(element) || 0 > 0;
}
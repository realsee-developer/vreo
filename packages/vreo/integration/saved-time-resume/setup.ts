const frames = new Map<number, FrameRequestCallback>()
let next = 0
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  __RESUME_FRAMES__: frames,
  requestAnimationFrame(callback: FrameRequestCallback) {
    const id = ++next
    frames.set(id, callback)
    return id
  },
  cancelAnimationFrame(id: number) {
    frames.delete(id)
  },
  ResizeObserver: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
})
Object.defineProperty(Element.prototype, 'animate', {
  configurable: true,
  value() {
    return {
      currentTime: 0,
      playState: 'running',
      onfinish: null,
      finished: Promise.resolve(),
      cancel() {},
      finish() {
        this.onfinish?.()
      },
      pause() {},
      play() {},
      reverse() {},
      persist() {},
      effect: {
        getComputedTiming() {
          return { progress: 1 }
        },
      },
    }
  },
})
Object.defineProperty(Element.prototype, 'getAnimations', {
  configurable: true,
  value() {
    return []
  },
})

// jsdom has no layout. The real SDK tag waits for a measurable content box.
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  get() {
    return 30
  },
})
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  get() {
    return 200
  },
})

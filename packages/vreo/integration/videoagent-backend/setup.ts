// Platform scheduling carrier installed before modules capture RAF.
// No renderer, media source, ownership or cleanup implementation is supplied.
const schedule = { frames: new Map<number, FrameRequestCallback>(), next: 0 }
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  __VREO_VIDEOAGENT_RAF__: schedule,
  requestAnimationFrame(callback: FrameRequestCallback) {
    const id = ++schedule.next
    schedule.frames.set(id, callback)
    return id
  },
  cancelAnimationFrame(id: number) {
    schedule.frames.delete(id)
  },
})

// Installed Dnalogel captures RAF at module evaluation. Install a deterministic
// carrier before importing it; tests explicitly consume its scheduled callback.
const schedule = { frames: new Map<number, FrameRequestCallback>(), next: 0 }
Object.assign(globalThis, {
  __VREO_PANOTAG_RAF__: schedule,
  requestAnimationFrame(callback: FrameRequestCallback) {
    const id=++schedule.next; schedule.frames.set(id, callback); return id
  },
  cancelAnimationFrame(id: number) {schedule.frames.delete(id)},
})

// JSDOM has no Web Animations API. This carrier permits actual Svelte DOM
// construction; animation timing, pixels and browser layout are not asserted.
Object.defineProperty(Element.prototype, 'animate', {configurable:true, value() {
  return {currentTime:0,playState:'running',onfinish:null,finished:Promise.resolve(),
    cancel(){},finish(){this.onfinish?.()},pause(){},play(){},reverse(){},persist(){},
    effect:{getComputedTiming(){return {progress:1}}}}
}})
Object.defineProperty(Element.prototype, 'getAnimations', {configurable:true, value(){return []}})

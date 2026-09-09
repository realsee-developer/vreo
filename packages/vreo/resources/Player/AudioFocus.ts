export type AudioIntent = 'user' | 'auto'
export type AudioStopReason = 'preempted' | 'paused' | 'closed' | 'replaced' | 'disposed'
export interface AudioLease { readonly signal: AbortSignal; isCurrent(): boolean; release(): void }
export interface AudioSource { acquire(intent: AudioIntent): AudioLease | null; cancel(reason: AudioStopReason): void; dispose(): void }
export interface AudioFocusHost { register(options: { label: string; stop(reason: AudioStopReason): void }): AudioSource }

/** One narration owns the outer lease; member tracks never compete with it. */
export class NarrationAudioFocus {
  private disposed = false
  private source?: AudioSource
  private lease?: AudioLease
  private task?: AbortController
  private members = new Set<(reason: AudioStopReason) => void>()
  constructor(host: AudioFocusHost | undefined, private onStop: () => void) {
    this.source = host?.register({ label: 'vreo', stop: reason => this.stop(reason) })
  }
  get active() { return !!this.task && !this.task.signal.aborted && (!this.source || !!this.lease?.isCurrent()) }
  capture() { const task = this.task; return () => !!task && task === this.task && this.active }
  acquire(intent: AudioIntent) {
    if (this.disposed) return false
    if (this.active) return true
    const lease = this.source?.acquire(intent)
    if (this.source && !lease) return false
    this.lease = lease ?? undefined
    this.task = new AbortController()
    return true
  }
  add(stop: (reason: AudioStopReason) => void) { this.members.add(stop); return () => { this.members.delete(stop) } }
  stop(reason: AudioStopReason) {
    this.task?.abort()
    this.task = undefined
    const errors: unknown[] = []
    try { this.onStop() } catch (error) { errors.push(error) }
    for (const stop of [...this.members]) {
      try { stop(reason) } catch (error) { errors.push(error) }
    }
    if (errors.length) throw errors[0]
  }
  cancel(reason: AudioStopReason) { this.stop(reason); this.source?.cancel(reason); this.lease = undefined }
  dispose() {
    if (this.disposed) return
    this.disposed = true
    this.cancel('disposed')
    this.source?.dispose()
    this.members.clear()
  }
  readonly host: AudioFocusHost = {
    register: ({ stop }) => {
      let disposed = false
      let child: AbortController | undefined
      const cancel = (reason: AudioStopReason) => { child?.abort(); child = undefined; stop(reason) }
      const remove = this.add(cancel)
      return {
        acquire: () => {
          if (disposed || !this.active) return null
          child?.abort()
          const current = child = new AbortController()
          const valid = this.capture()
          return { signal: current.signal, isCurrent: () => valid() && child === current && !current.signal.aborted,
            release: () => { if (child === current) { current.abort(); child = undefined } } }
        },
        cancel,
        dispose: () => { if (disposed) return; disposed = true; cancel('disposed'); remove() },
      }
    },
  }
}

import type { MediaOperations, PlaybackController, PlaybackManager, PlaybackSession } from './playback-types'

export interface PlaybackRun {
  readonly session?: PlaybackSession
  readonly mediaManager?: PlaybackManager
  valid(): boolean
  bind(element: HTMLMediaElement): MediaOperations
}

/** Local timeline lifetime only. Playback permission is owned by the injected manager. */
export class PlaybackLifecycle {
  private controller?: PlaybackController
  private run?: PlaybackRun
  private generation = 0
  private disposed = false
  private members = new Set<() => void>()
  constructor(manager: PlaybackManager | undefined, private onStop: () => void) {
    this.controller = manager?.createController({ label: 'vreo', onCancel: () => this.stop() })
  }
  get active() { return !!this.run?.valid() }
  capture() { return this.run }
  begin(userAction: boolean) {
    if (this.disposed) return false
    if (this.active) return true
    const session = this.controller?.begin({ userAction, audible: true }) ?? undefined
    if (this.controller && !session) return false
    const generation = ++this.generation
    const mediaManager = session?.mediaManager
    this.run = {
      session, mediaManager,
      valid: () => generation === this.generation && !this.disposed && !session?.signal.aborted,
      bind: element => session ? session.bind(element) : element,
    }
    return true
  }
  add(stop: () => void) { this.members.add(stop); return () => { this.members.delete(stop) } }
  private stop() {
    ++this.generation
    this.run = undefined
    const errors: unknown[] = []
    try { this.onStop() } catch (error) { errors.push(error) }
    for (const stop of [...this.members]) { try { stop() } catch (error) { errors.push(error) } }
    if (errors.length) throw errors[0]
  }
  cancel() {
    const generation = this.generation
    this.controller?.cancel()
    if (generation === this.generation) this.stop()
  }
  finish() { const session = this.run?.session; this.stop(); session?.finish() }
  dispose() {
    if (this.disposed) return
    this.disposed = true
    const generation = this.generation
    this.controller?.dispose()
    if (generation === this.generation) this.stop()
    this.members.clear()
  }
}

export interface PlaybackManager {
  createController(options: { label: string; onCancel(): void }): PlaybackController
}

export interface PlaybackController {
  begin(request: { userAction: boolean; audible: boolean }): PlaybackSession | null
  cancel(): void
  dispose(): void
}

export interface PlaybackSession {
  readonly signal: AbortSignal
  readonly mediaManager: PlaybackManager
  bind(element: HTMLMediaElement): MediaOperations
  finish(): void
}

export type MediaOperations = Pick<
  HTMLMediaElement,
  'play' | 'pause' | 'load' | 'src' | 'currentTime' | 'muted' | 'volume' | 'loop'
>

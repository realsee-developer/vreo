export interface TimelineKeyframe {
  type: string
  start: number
  end: number
  parsed?: boolean
}

/** Deterministic keyframe selection. Runtime state never mutates timeline input. */
export class Timeline<Keyframe extends TimelineKeyframe = TimelineKeyframe> {
  private keyframes: readonly Keyframe[] = []
  private consumed = new Set<Keyframe>()

  load(keyframes: readonly Keyframe[]) {
    this.keyframes = keyframes
    this.consumed = new Set(keyframes.filter(keyframe => keyframe.parsed))
  }

  pendingAt(currentTime: number) {
    return this.keyframes.filter(keyframe => {
      if (this.consumed.has(keyframe)) return false
      if (keyframe.start > currentTime || keyframe.end < currentTime) return false
      return keyframe.type === 'BgMusic' ||
        keyframe.type === 'PanoTextLabel' || keyframe.type === 'Prompter' || keyframe.type === 'PanoTag' ||
        currentTime - keyframe.start <= 100
    })
  }

  take(currentTime: number) {
    const pending = this.pendingAt(currentTime)
    pending.forEach(keyframe => this.consumed.add(keyframe))
    return pending
  }

  seek(currentTime: number) {
    this.consumed = new Set(this.keyframes.filter(keyframe => keyframe.end < currentTime))
  }

  reset(type?: Keyframe['type']) {
    if (type === undefined) {
      this.consumed.clear()
      return
    }
    for (const keyframe of this.keyframes) {
      if (keyframe.type === type) this.consumed.delete(keyframe)
    }
  }

  clear() {
    this.keyframes = []
    this.consumed.clear()
  }
}

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PlaybackLifecycle } from 'vreo-audit/Player/PlaybackLifecycle'

const h = vi.hoisted(() => ({ controller: undefined as any }))
vi.mock('vreo-audit/Player/hooks', () => ({ useController: () => h.controller }))
import { Prompter } from 'vreo-audit/Player/modules/keyframes/Prompter'

function createController() {
  const events = new Map<string, Set<(value: any) => void>>()
  const playback = new PlaybackLifecycle(undefined, () => undefined)
  playback.begin(true)
  return {
    playback, agentType: 'none', configs: { keyframeMap: {} },
    on(type: string, listener: (value: any) => void) {
      const list = events.get(type) ?? new Set(); list.add(listener); events.set(type, list)
    },
    off(type: string, listener: (value: any) => void) { events.get(type)?.delete(listener) },
    emit(value: any) { for (const listener of [...events.get('Prompter') ?? []]) listener(value) },
    listenerCount() { return [...events.values()].reduce((sum, list) => sum + list.size, 0) },
  }
}
function cue(text: string, start = 0, end = 8000) { return { type: 'Prompter', start, end, data: { text } } }
function text() { return document.querySelector('.vreo-prompter-innerText')?.textContent }
function hidden() { return document.querySelector('.vreo-prompter')?.classList.contains('vreo-prompter--hidden') }
let root: Root | undefined
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  h.controller = createController()
  const container = document.createElement('div'); document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => root!.render(<Prompter />))
})
afterEach(async () => {
  await act(async () => { root?.unmount(); root = undefined })
  document.body.innerHTML = ''; vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks()
})

describe('actual Prompter and actual PlaybackLifecycle, React 18 DOM', () => {
  it('clears its active text and pending timer on actual playback.cancel', async () => {
    await act(async () => h.controller.emit(cue('QA cancel prompter')))
    expect(text()).toBe('QA cancel prompter'); expect(hidden()).toBe(false)
    expect(vi.getTimerCount()).toBe(1)
    await act(async () => h.controller.playback.cancel())
    expect.soft(text()).toBe('')
    expect.soft(hidden()).toBe(true)
    expect.soft(vi.getTimerCount()).toBe(0)
    expect(h.controller.listenerCount()).toBe(1)
  })

  it('cancels its timeout on early component unmount', async () => {
    await act(async () => h.controller.emit(cue('QA unmount prompter')))
    expect(vi.getTimerCount()).toBe(1)
    await act(async () => { root!.unmount(); root = undefined })
    expect(h.controller.listenerCount()).toBe(0)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('clears an old owner on controller replacement and accepts only new owner cues', async () => {
    await act(async () => h.controller.emit(cue('QA old prompter')))
    const old = h.controller
    h.controller = createController()
    await act(async () => root!.render(<Prompter />))
    expect(old.listenerCount()).toBe(0)
    expect.soft(text()).toBe('')
    expect.soft(vi.getTimerCount()).toBe(0)
    await act(async () => h.controller.emit(cue('QA new prompter')))
    await act(async () => old.playback.cancel())
    expect(text()).toBe('QA new prompter')
    await act(async () => h.controller.playback.cancel())
    expect.soft(text()).toBe('')
    expect.soft(vi.getTimerCount()).toBe(0)
  })

  it('positive control: a replacement cue survives the old deadline and ends at its own deadline', async () => {
    await act(async () => h.controller.emit(cue('QA first', 0, 2000)))
    await act(async () => vi.advanceTimersByTime(1000))
    await act(async () => h.controller.emit(cue('QA replacement', 1000, 5000)))
    expect(vi.getTimerCount()).toBe(1)
    await act(async () => vi.advanceTimersByTime(1000))
    expect(text()).toBe('QA replacement'); expect(hidden()).toBe(false)
    await act(async () => vi.advanceTimersByTime(3000))
    expect(text()).toBe(''); expect(hidden()).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })
})

import { afterEach, expect, it, vi } from 'vitest'
import { audioList, generateBlankAudio, getAudio } from 'vreo-audit/shared-utils/Audio'

afterEach(() => {
  for (const audio of audioList) audio.removeDocumentEventListener()
  audioList.splice(0)
  vi.restoreAllMocks()
})

it('empty source removes the native attribute and resets source selection after pool ownership is cleared', () => {
  generateBlankAudio(1)
  const audio = getAudio('/qa-previous.mp3')
  expect(audio).toBeInstanceOf(HTMLAudioElement)
  const nativeSet = vi.spyOn(audio, 'setAttribute')
  const nativeRemove = vi.spyOn(audio, 'removeAttribute')
  const selections: Array<{ attribute: string | null; realSrc: string }> = []
  // JSDOM does not implement native media source selection. Record the actual
  // load invocation and its inputs; Chrome separately proves MediaError/reset.
  const nativeLoad = vi.spyOn(audio, 'load').mockImplementation(() => {
    selections.push({ attribute: audio.getAttribute('src'), realSrc: audio.realSrc })
  })
  audio.muted = false
  audio.src = ''
  expect(nativeSet).not.toHaveBeenCalled()
  expect(nativeRemove).toHaveBeenCalledTimes(1)
  expect(nativeRemove).toHaveBeenCalledWith('src')
  expect(nativeLoad).toHaveBeenCalledTimes(1)
  expect(selections).toEqual([{ attribute: null, realSrc: '' }])
  expect(audio.src).toBe('')
  expect(audio.realSrc).toBe('')
  expect(audio.muted).toBe(true)
  expect(getAudio('/qa-next.mp3')).toBe(audio)
  expect(audio.realSrc).toBe('/qa-next.mp3')
})

it('nonempty business sources retain the existing attribute, getter, pool and mute contract without an extra load', () => {
  generateBlankAudio(1)
  const audio = audioList[0]
  const nativeSet = vi.spyOn(audio, 'setAttribute')
  const nativeRemove = vi.spyOn(audio, 'removeAttribute')
  const nativeLoad = vi.spyOn(audio, 'load').mockImplementation(() => undefined)
  const url = '/qa-business.mp3?variant=1#start'
  audio.muted = false
  audio.src = url
  expect(nativeSet).toHaveBeenCalledTimes(1)
  expect(nativeSet).toHaveBeenCalledWith('src', url)
  expect(nativeRemove).not.toHaveBeenCalled()
  expect(nativeLoad).not.toHaveBeenCalled()
  expect(audio.src).toBe(url)
  expect(audio.realSrc).toBe(url)
  expect(audio.muted).toBe(true)
  expect(getAudio('/qa-other.mp3')).not.toBe(audio)
})

it('blank-audio natural ended uses the same no-source release rather than a valid silent replacement', () => {
  generateBlankAudio(1)
  const audio = audioList[0]
  expect(audio.src).toMatch(/^data:audio\/mpeg/)
  const nativeLoad = vi.spyOn(audio, 'load').mockImplementation(() => undefined)
  audio.dispatchEvent(new Event('ended'))
  expect(audio.getAttribute('src')).toBeNull()
  expect(audio.realSrc).toBe('')
  expect(audio.src).toBe('')
  expect(nativeLoad).toHaveBeenCalledTimes(1)
})

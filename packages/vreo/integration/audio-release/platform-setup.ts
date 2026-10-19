// JSDOM's Audio factory discards a derived constructor's new.target prototype.
// Restore only that browser constructor semantic. The instance remains a real
// JSDOM HTMLAudioElement; all IAudio/src/realSrc/pool and owner code is actual source.
// This environment does not decode/play sound; native Chrome is the media proof.
const NativeAudio = globalThis.Audio
function BrowserAudio(this: any, src?: string) {
  const element = new NativeAudio(src)
  if (new.target) Object.setPrototypeOf(element, new.target.prototype)
  return element
}
BrowserAudio.prototype = NativeAudio.prototype
Object.setPrototypeOf(BrowserAudio, NativeAudio)
Object.assign(globalThis, { Audio: BrowserAudio, IS_REACT_ACT_ENVIRONMENT: true })

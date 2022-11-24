const blankAudioSrc = 'data:audio/mpeg;base64,//AAAAHGZ0eXBNNEEgAAAAAE00QSBpc29tbXA0MgAAAAFtZGF0AAAAAAAAABwA0AAHANAABwDQAAcAAAM+bW9vdgAAAGxtdmhkAAAAAN+jti7fo7YuAACsRAAADAAAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAdB0cmFrAAAAXHRraGQAAAAB36O2Lt+jti4AAAABAAAAAAAADAAAAAAAAAAAAAAAAAABAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAFsbWRpYQAAACBtZGhkAAAAAN+jti7fo7YuAACsRAAADABVxAAAAAAAMWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABDb3JlIE1lZGlhIEF1ZGlvAAAAARNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAANdzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAAABICAgBRAFAAYAAAA+gAAAPoABYCAgAISCAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAAADAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAwAAAAEAAAAgc3RzegAAAAAAAAAAAAAAAwAAAAQAAAAEAAAABAAAABRzdGNvAAAAAAAAAAEAAAAsAAAA+nVkdGEAAADybWV0YQAAAAAAAAAiaGRscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAAAAAAAAAxGlsc3QAAAC8LS0tLQAAABxtZWFuAAAAAGNvbS5hcHBsZS5pVHVuZXMAAAAUbmFtZQAAAABpVHVuU01QQgAAAIRkYXRhAAAAAQAAAAAgMDAwMDAwMDAgMDAwMDA4NDAgMDAwMDAzQzAgMDAwMDAwMDAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMA=='

const audioList: IAudio[] = []

export function getAudio(src?: string) {
  let audio = audioList.find((audio) => {
    return !audio.realSrc || audio.realSrc === blankAudioSrc
  })
  if (!audio) {
    console.warn('未找到缓存音频，已新建')
    audio = new IAudio(blankAudioSrc)
  }
  if (src) audio.src = src
  return audio
}

export function generateBlankAudio(length: number) {
  // 判断一下已经生成几个了，防止重复生成
  const generateLength = length - audioList.length
  if (generateLength <= 0) return
  for (let i = 0; i < generateLength; i++) {
    audioList.push(new IAudio(blankAudioSrc))
  }
}

class IAudio extends Audio {
  public preload = 'auto' as const
  
  get src() {
    return super.src
  }
  
  set src(paramsSrc: string) {
    super.src = paramsSrc
    this.realSrc = paramsSrc
  }

  public realSrc = ''

  private inited: boolean = false;

  private removeDocumentEventListener: () => void;

  public constructor(src?: string) {
    super(src)
    this.realSrc = src ?? ''

    console.log('create audio', src)

    this.addEventListener('end', () => (this.src = ''))

    const init = () => this.init()

    document.addEventListener('click', init)
    document.addEventListener('touchstart', init)
    this.removeDocumentEventListener = () => {
      document.removeEventListener('click', init)
      document.removeEventListener('touchstart', init)
    }
  }

  private init() {
    console.log('init')
    if (this.inited) return
    if (this.src) {
      this.inited = true
      this.removeDocumentEventListener()
    }
    if (this.src === blankAudioSrc) {
      this.play()
    }
  }
}



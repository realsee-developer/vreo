import getFileExpandedName from './getFileExpandedName'

export default function getMediaInfo(fileUrl: string): Promise<{
  duration?: number | undefined
  type?: 'video' | 'audio' | 'image' | 'unknown' | undefined
  error?: string | undefined
}> {
  const type = getMediaType(fileUrl)
  if (!type) return Promise.resolve({ error: '未知的文件类型: ' + fileUrl })
  const mediaElement = (() => {
    if (type === 'video') return document.createElement('video')
    if (type === 'audio') return document.createElement('audio')
  })()
  if (!mediaElement) return Promise.resolve({ error: 'Unknown media element' })
  mediaElement.src = fileUrl
  return new Promise<{ duration?: number; type?: 'video' | 'audio' | 'image' | 'unknown'; error?: string }>((resolve) => {
    mediaElement.onerror = () => resolve({ error: 'onerror' })
    mediaElement.onloadedmetadata = () => {
      resolve({ duration: mediaElement.duration * 1000, type }) // s => ms
    }
  })
}

export function getMediaType(url?: string) {
  const fileExpandedName = getFileExpandedName(url)
  const type = getMediaTypeByExpandedName(fileExpandedName)
  return type
}

export function getMediaTypeByExpandedName(fileExpandedName?: string | null) {
  if (!fileExpandedName) return 'unknown'
  if (/jpg|jpeg|png$/.test(fileExpandedName)) return 'image'
  if (/mp3|wav$/.test(fileExpandedName)) return 'audio'
  if (/avi|wmv|mpeg|mp4|m4v|mov|asf|flv|f4v|rmvb|rm|3gp|vob$/.test(fileExpandedName)) return 'video'
  return 'unknown'
}

export function getMediaTypeByUrl(fileUrl?: string | null) {
  if (!fileUrl) return
  const fileExpandedName = getFileExpandedName(fileUrl)
  return getMediaTypeByExpandedName(fileExpandedName)
}

export function getFileName(fileUrl?: string) {
  if (!fileUrl) return ''
  const index1 = fileUrl.lastIndexOf('/')
  const index2 = fileUrl.lastIndexOf('\\')
  const index3 = fileUrl.lastIndexOf('\\\\')
  const index = Math.max(index1, index2, index3)
  const ext = fileUrl.substring(index + 1)
  return ext
}

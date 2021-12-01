import { ImageURLOptions } from '@realsee/five'

const imageURL = (url: string, options: Partial<ImageURLOptions> = {}) => {
  if (url.indexOf('.basis') !== -1) {
    if (options.basisLoaderInitialized && (options.size === 2048 || !options.size)) return url
    url = url.replace(/\.basis(\?|$)/, '.jpg$1')
  }

  const { size, quality, format } = options

  if (
    url.indexOf('//vrlab-image') !== -1 ||
    url.indexOf('//vrlab-photo') !== -1 ||
    url.indexOf('//test-vr-public') !== -1
  ) {
    const _url = url.split('/')
    const filename = _url.pop()
    if (!filename) return url
    const filename1 = filename.split('.')
    const filename2 = filename1.slice(0, 2).join('.')
    url = _url.join('/') + '/' + filename2

    if (size || quality || format) {
      let suffix = '?imageMogr2'
      if (quality) suffix += '/quality/' + quality
      if (size && size !== 2048) suffix += '/thumbnail/' + size + 'x' // 默认2048的图不进行缩略图操作
      if (format) suffix += '/format/' + format
      url = url + suffix
    }
  }
  return url
}

// 上/左/前, 用image1; 下/右/后, 用image2; texture用image3.
const MULT_CDN_DOMAIN_MAP: Record<string, number> = {
  up: 1,
  left: 1,
  front: 1,
  down: 2,
  right: 2,
  back: 2,
  texture: 3,
}

/**
 * 多CDN域名支持
 * @param url
 * @param key
 */
const multCdnUrl = (url: string, key: string) => {
  if (!key) return url

  const idx = key.split('.').pop()
  if (!idx) return url
  if (!MULT_CDN_DOMAIN_MAP[idx]) return url
  const type = MULT_CDN_DOMAIN_MAP[idx]

  const cdnType = 'vrlab-image'

  return url
    .replace(/https*:/, '')
    .replace(/vrlab-public\.ljcdn\.com/g, cdnType + (type || 3) + '.ljcdn.com')
    .replace(/vrlab-image\.ljcdn\.com/g, cdnType + (type || 3) + '.ljcdn.com')
}

/**
 *
 * @param url 缓存代理支持
 */
const proxyCache = (url: string) => {
  const userAgent = navigator.userAgent as string
  if (!userAgent) return url
  if (!userAgent.match('supportCache')) return url

  if (!!/iPhone\s+OS/i.test(userAgent) && url.indexOf('.basis') === -1) {
    return url.replace(/https*:/, '').replace(/\/\//, 'realseeproxycache://')
  }
  if (!!/android/i.test(userAgent)) {
    return url + (url.indexOf('?') !== -1 ? '' : '?') + '&realseeproxycache'
  }

  return url
}

/**
 * @description Five.js 图片配置采用腾讯云图床时采用，规则见：https://cloud.tencent.com/document/product/460/6924 。
 *
 * ```js
 * // 全景贴图
 * imageOptions.transform = imageMogr2
 * // 模型贴图
 * textureOptions.transform = imageMogr2
 * ```
 */
export function imageMogr2(_url: string, _options: ImageURLOptions) {

  const options = Object.assign({}, _options || {})
  const url = multCdnUrl(_url, options.key!)
  const res = proxyCache(imageURL(url, options))

  return location.protocol + res.replace(/https*:/, '')
}

export function noImageMogr2(_url: string, _options: ImageURLOptions) {
  const options = Object.assign({}, _options || {})
  const url = multCdnUrl(_url, options.key!)
  return proxyCache(url)
}

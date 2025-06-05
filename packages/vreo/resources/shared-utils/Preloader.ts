/**
 * 预载器
 */
export const Preloader = {
  blob: (url: string) => {
    const noop = () => null
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const clear = () => {
        xhr.ontimeout = noop
        xhr.onreadystatechange = noop
        xhr.onprogress = noop
        xhr.onabort = noop
      }
      xhr.ontimeout = () => {
        reject(new Error('timeout'))
        clear()
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
        if (xhr.status === 0 && !xhr.response) return
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response)
          clear()
        } else {
          reject(new Error('status:' + xhr.status))
          clear()
        }
      }
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.send(null)
    })
  },
}

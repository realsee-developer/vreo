/**
 * @fileoverview 文件扩展名提取工具
 * 
 * 提供从文件路径或 URL 中提取文件扩展名的功能。
 */

/**
 * 从文件路径或 URL 中提取文件扩展名
 * 
 * 提取文件的扩展名（不包括点号），并转换为小写形式。
 * 如果文件路径为空或没有扩展名，返回空字符串。
 * 
 * @param filePath - 文件路径或 URL，可以为空
 * @returns 文件扩展名（小写，不包括点号），如果没有扩展名则返回空字符串
 * 
 * @example
 * ```typescript
 * getFileExpandedName('image.JPG')                    // 'jpg'
 * getFileExpandedName('video.mp4')                    // 'mp4'
 * getFileExpandedName('https://example.com/file.PDF') // 'pdf'
 * getFileExpandedName('no-extension')                 // ''
 * getFileExpandedName('')                             // ''
 * getFileExpandedName(null)                           // ''
 * getFileExpandedName(undefined)                      // ''
 * ```
 */
export default function getFileExpandedName(filePath?: string | null): string {
  if (!filePath) return ''
  
  const index = filePath.lastIndexOf('.')
  if (index === -1) return '' // 没有找到点号，说明没有扩展名
  
  const ext = filePath.substring(index + 1)
  return ext.toLowerCase()
}

/**
 * @fileoverview 媒体文件信息获取工具
 *
 * 提供获取音频、视频文件信息的功能，包括文件类型检测、时长获取等。
 */
/**
 * 媒体类型枚举
 */
export type MediaType = 'video' | 'audio' | 'image' | 'unknown';
/**
 * 媒体信息接口
 */
export interface MediaInfo {
    /** 媒体时长（毫秒），对于图片类型为 undefined */
    duration?: number;
    /** 媒体类型 */
    type?: MediaType;
    /** 错误信息，如果获取失败 */
    error?: string;
}
/**
 * 获取媒体文件的详细信息
 *
 * 通过创建相应的 HTML 媒体元素来获取文件的元数据信息，
 * 如时长、类型等。对于图片文件，只返回类型信息。
 *
 * @param fileUrl - 媒体文件的 URL
 * @returns Promise，解析为包含媒体信息的对象
 *
 * @example
 * ```typescript
 * // 获取视频信息
 * getMediaInfo('https://example.com/video.mp4').then(info => {
 *   if (info.error) {
 *     console.error('获取失败:', info.error);
 *   } else {
 *     console.log(`类型: ${info.type}, 时长: ${info.duration}ms`);
 *   }
 * });
 *
 * // 获取音频信息
 * getMediaInfo('https://example.com/audio.mp3').then(info => {
 *   console.log(`音频时长: ${info.duration / 1000}秒`);
 * });
 * ```
 */
export default function getMediaInfo(fileUrl: string): Promise<MediaInfo>;
/**
 * 根据文件 URL 获取媒体类型
 *
 * @param url - 文件 URL
 * @returns 媒体类型，如果无法识别则返回 'unknown'
 *
 * @example
 * ```typescript
 * getMediaType('video.mp4')    // 'video'
 * getMediaType('audio.mp3')    // 'audio'
 * getMediaType('image.jpg')    // 'image'
 * getMediaType('unknown.xyz')  // 'unknown'
 * ```
 */
export declare function getMediaType(url?: string): MediaType;
/**
 * 根据文件扩展名获取媒体类型
 *
 * @param fileExpandedName - 文件扩展名（不包括点号）
 * @returns 媒体类型
 *
 * @example
 * ```typescript
 * getMediaTypeByExpandedName('mp4')  // 'video'
 * getMediaTypeByExpandedName('mp3')  // 'audio'
 * getMediaTypeByExpandedName('jpg')  // 'image'
 * getMediaTypeByExpandedName('xyz')  // 'unknown'
 * ```
 */
export declare function getMediaTypeByExpandedName(fileExpandedName?: string | null): MediaType;
/**
 * 根据文件 URL 获取媒体类型（别名函数）
 *
 * @param fileUrl - 文件 URL
 * @returns 媒体类型，如果 URL 为空则返回 undefined
 *
 * @deprecated 建议使用 getMediaType 函数
 */
export declare function getMediaTypeByUrl(fileUrl?: string | null): MediaType | undefined;
/**
 * 从文件 URL 中提取文件名
 *
 * 支持正斜杠、反斜杠和双反斜杠作为路径分隔符。
 *
 * @param fileUrl - 文件 URL 或路径
 * @returns 文件名（包括扩展名），如果 URL 为空则返回空字符串
 *
 * @example
 * ```typescript
 * getFileName('https://example.com/path/video.mp4')     // 'video.mp4'
 * getFileName('/local/path/audio.mp3')                  // 'audio.mp3'
 * getFileName('C:\\Windows\\file.txt')                  // 'file.txt'
 * getFileName('C:\\\\network\\\\share\\\\file.doc')    // 'file.doc'
 * getFileName('')                                       // ''
 * ```
 */
export declare function getFileName(fileUrl?: string): string;

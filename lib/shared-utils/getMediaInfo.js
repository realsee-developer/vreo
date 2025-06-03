"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getMediaInfo;
exports.getFileName = getFileName;
exports.getMediaType = getMediaType;
exports.getMediaTypeByExpandedName = getMediaTypeByExpandedName;
exports.getMediaTypeByUrl = getMediaTypeByUrl;
var _getFileExpandedName = _interopRequireDefault(require("./getFileExpandedName"));
/**
 * @fileoverview 媒体文件信息获取工具
 * 
 * 提供获取音频、视频文件信息的功能，包括文件类型检测、时长获取等。
 */

/**
 * 媒体类型枚举
 */

/**
 * 媒体信息接口
 */

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
function getMediaInfo(fileUrl) {
  var type = getMediaType(fileUrl);
  if (!type || type === 'unknown') {
    return Promise.resolve({
      error: "\u672A\u77E5\u7684\u6587\u4EF6\u7C7B\u578B: ".concat(fileUrl),
      type: 'unknown'
    });
  }

  // 图片类型直接返回
  if (type === 'image') {
    return Promise.resolve({
      type: 'image'
    });
  }
  var mediaElement = function () {
    if (type === 'video') return document.createElement('video');
    if (type === 'audio') return document.createElement('audio');
    return null;
  }();
  if (!mediaElement) {
    return Promise.resolve({
      error: 'Unknown media element',
      type: type
    });
  }
  mediaElement.src = fileUrl;
  return new Promise(function (resolve) {
    mediaElement.onerror = function () {
      return resolve({
        error: 'Failed to load media',
        type: type
      });
    };
    mediaElement.onloadedmetadata = function () {
      resolve({
        duration: mediaElement.duration * 1000,
        // 转换为毫秒
        type: type
      });
    };
  });
}

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
function getMediaType(url) {
  var fileExpandedName = (0, _getFileExpandedName["default"])(url);
  return getMediaTypeByExpandedName(fileExpandedName);
}

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
function getMediaTypeByExpandedName(fileExpandedName) {
  if (!fileExpandedName) return 'unknown';

  // 图片格式
  if (/^(jpg|jpeg|png)$/i.test(fileExpandedName)) return 'image';

  // 音频格式
  if (/^(mp3|wav)$/i.test(fileExpandedName)) return 'audio';

  // 视频格式
  if (/^(avi|wmv|mpeg|mp4|m4v|mov|asf|flv|f4v|rmvb|rm|3gp|vob)$/i.test(fileExpandedName)) return 'video';
  return 'unknown';
}

/**
 * 根据文件 URL 获取媒体类型（别名函数）
 * 
 * @param fileUrl - 文件 URL
 * @returns 媒体类型，如果 URL 为空则返回 undefined
 * 
 * @deprecated 建议使用 getMediaType 函数
 */
function getMediaTypeByUrl(fileUrl) {
  if (!fileUrl) return undefined;
  var fileExpandedName = (0, _getFileExpandedName["default"])(fileUrl);
  return getMediaTypeByExpandedName(fileExpandedName);
}

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
function getFileName(fileUrl) {
  if (!fileUrl) return '';
  var index1 = fileUrl.lastIndexOf('/');
  var index2 = fileUrl.lastIndexOf('\\');
  var index3 = fileUrl.lastIndexOf('\\\\');
  var index = Math.max(index1, index2, index3);
  return fileUrl.substring(index + 1);
}
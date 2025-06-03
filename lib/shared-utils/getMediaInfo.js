import getFileExpandedName from "./getFileExpandedName.js";
export default function getMediaInfo(fileUrl) {
  var type = getMediaType(fileUrl);
  if (!type) return Promise.resolve({
    error: '未知的文件类型: ' + fileUrl
  });
  var mediaElement = function () {
    if (type === 'video') return document.createElement('video');
    if (type === 'audio') return document.createElement('audio');
  }();
  if (!mediaElement) return Promise.resolve({
    error: 'Unknown media element'
  });
  mediaElement.src = fileUrl;
  return new Promise(function (resolve) {
    mediaElement.onerror = function () {
      return resolve({
        error: 'onerror'
      });
    };
    mediaElement.onloadedmetadata = function () {
      resolve({
        duration: mediaElement.duration * 1000,
        type: type
      }); // s => ms
    };
  });
}
export function getMediaType(url) {
  var fileExpandedName = getFileExpandedName(url);
  var type = getMediaTypeByExpandedName(fileExpandedName);
  return type;
}
export function getMediaTypeByExpandedName(fileExpandedName) {
  if (!fileExpandedName) return 'unknown';
  if (/jpg|jpeg|png$/.test(fileExpandedName)) return 'image';
  if (/mp3|wav$/.test(fileExpandedName)) return 'audio';
  if (/avi|wmv|mpeg|mp4|m4v|mov|asf|flv|f4v|rmvb|rm|3gp|vob$/.test(fileExpandedName)) return 'video';
  return 'unknown';
}
export function getMediaTypeByUrl(fileUrl) {
  if (!fileUrl) return;
  var fileExpandedName = getFileExpandedName(fileUrl);
  return getMediaTypeByExpandedName(fileExpandedName);
}
export function getFileName(fileUrl) {
  if (!fileUrl) return '';
  var index1 = fileUrl.lastIndexOf('/');
  var index2 = fileUrl.lastIndexOf('\\');
  var index3 = fileUrl.lastIndexOf('\\\\');
  var index = Math.max(index1, index2, index3);
  var ext = fileUrl.substring(index + 1);
  return ext;
}
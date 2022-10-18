"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getMediaInfo;
exports.getFileName = getFileName;
exports.getMediaType = getMediaType;
exports.getMediaTypeByExpandedName = getMediaTypeByExpandedName;
exports.getMediaTypeByUrl = getMediaTypeByUrl;

var _getFileExpandedName = _interopRequireDefault(require("./getFileExpandedName"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getMediaInfo(fileUrl) {
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

function getMediaType(url) {
  var fileExpandedName = (0, _getFileExpandedName["default"])(url);
  var type = getMediaTypeByExpandedName(fileExpandedName);
  return type;
}

function getMediaTypeByExpandedName(fileExpandedName) {
  if (!fileExpandedName) return 'unknown';
  if (/jpg|jpeg|png$/.test(fileExpandedName)) return 'image';
  if (/mp3|wav$/.test(fileExpandedName)) return 'audio';
  if (/avi|wmv|mpeg|mp4|m4v|mov|asf|flv|f4v|rmvb|rm|3gp|vob$/.test(fileExpandedName)) return 'video';
  return 'unknown';
}

function getMediaTypeByUrl(fileUrl) {
  if (!fileUrl) return;
  var fileExpandedName = (0, _getFileExpandedName["default"])(fileUrl);
  return getMediaTypeByExpandedName(fileExpandedName);
}

function getFileName(fileUrl) {
  if (!fileUrl) return '';
  var index1 = fileUrl.lastIndexOf('/');
  var index2 = fileUrl.lastIndexOf('\\');
  var index3 = fileUrl.lastIndexOf('\\\\');
  var index = Math.max(index1, index2, index3);
  var ext = fileUrl.substring(index + 1);
  return ext;
}
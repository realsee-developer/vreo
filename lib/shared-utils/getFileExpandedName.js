"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getFileExpandedName;

function getFileExpandedName(filePath) {
  if (!filePath) return '';
  var index = filePath.lastIndexOf('.');
  var ext = filePath.substring(index + 1);
  return ext.toLowerCase();
}
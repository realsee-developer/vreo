"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = evenNumber;

function evenNumber(num, config) {
  var roundNum = Math.round(num);
  return roundNum % 2 === 0 ? roundNum : roundNum + Number(config !== null && config !== void 0 && config.smaller ? -1 : 1);
}
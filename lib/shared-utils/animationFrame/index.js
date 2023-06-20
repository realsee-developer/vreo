"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.getFrameTime = getFrameTime;
exports.nextFrame = nextFrame;
exports.requestAnimationFrameInterval = requestAnimationFrameInterval;
var _requestAnimationFrame = window.requestAnimationFrame || function (fn) {
  return setTimeout(function () {
    return fn(performance.now());
  }, 16);
};
var _cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
var _default = _requestAnimationFrame;
exports["default"] = _default;
function nextFrame(fn) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (delay <= 0) _requestAnimationFrame(fn);else _requestAnimationFrame(function () {
    return nextFrame(fn, delay - 1);
  });
}

/**
 * 在每个 AnimationFrame 中调用传入的函数
 * @param callback 每次 AnimationFrame 中调用的函数
 * @param frame 每秒运行多少次
 * @returns 返回一个函数，调用可以停止 AnimationFrameLoop
 */
function requestAnimationFrameInterval(callback) {
  var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
  var index = -1;
  var oldTime = 0;
  var startTime = -1;
  var minDeltaTime = 1000 / frame;
  function loop(time) {
    startTime === -1 && (startTime = time);
    index = _requestAnimationFrame(loop);
    var deltaTime = time - oldTime;
    if (deltaTime < minDeltaTime) return;
    oldTime = time;
    callback && callback(time - startTime);
  }
  index = _requestAnimationFrame(loop);
  return function stop() {
    _cancelAnimationFrame(index);
  };
}

/**
 * 获取两个 AnimationFrame 间隔的时间
 * @returns 返回一个 Promise，resolve 的结果是两个 AnimationFrame 间隔的时间
 */
function getFrameTime() {
  var start = Date.now();
  return new Promise(function (resolve) {
    _requestAnimationFrame(function () {
      resolve(Date.now() - start);
    });
  });
}
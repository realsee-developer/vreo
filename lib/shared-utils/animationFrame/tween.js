"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = void 0;
exports["default"] = tween;
exports.tweenProgress = tweenProgress;
var _tween = require("@tweenjs/tween.js");
var _index = require("./index");
var disposeMethods = [];
var clear = exports.clear = function clear() {
  disposeMethods.forEach(function (dispose) {
    return dispose();
  });
  disposeMethods = [];
};

/**
 * 对象变化的补间动画
 * 1. 应用 requestAnimationFrameInterval 做 update
 * 2. 在原生 tween 上新增 destroy 方法和 onDestroy 监听
 * DOC： https://github.com/tweenjs/tween.js
 * @param from 对象起始状态
 * @param to 对象末尾状态
 * @param duration 经历时间（s）
 * @param easing 过程动画，默认是 Easing.Linear.None
 */
function tween(from, to, duration) {
  var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _tween.Easing.Linear.None;
  var tween = new _tween.Tween(from).to(to, duration).easing(easing);
  // 这里注意一下，因为 requestAnimationFrameInterval 给的时间是从 0 开始的，tween 动画也从 0 开始
  (0, _index.nextFrame)(function () {
    return tween.start(0);
  });
  var cancelAnimationFrame = (0, _index.requestAnimationFrameInterval)(function (time) {
    if (tween.update(time) === false) cancelAnimationFrame();
  });
  var destroyMethods = [];
  tween.onDestroy = function (fn) {
    destroyMethods.push(fn);
    return tween;
  };
  tween.destroy = function () {
    this.stop();
    Object.assign(tween, {
      _onStartCallback: null,
      _onUpdateCallback: null,
      _onCompleteCallback: null,
      _onStopCallbackL: null
    });
    var destroyMethod;
    while (destroyMethod = destroyMethods.shift()) {
      destroyMethod();
    }
    cancelAnimationFrame();
  };
  return tween;
}
function tweenProgress(duration, easing) {
  return tween({
    progress: 0
  }, {
    progress: 1
  }, duration, easing);
}
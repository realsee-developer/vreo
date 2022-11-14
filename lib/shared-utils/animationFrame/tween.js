"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Easing = void 0;
exports["default"] = tween;
exports.tweenProgress = tweenProgress;

var TWEEN = _interopRequireWildcard(require("@tweenjs/tween.js"));

var _index = require("./index");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Easing = TWEEN.Easing;
exports.Easing = Easing;

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
  var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Easing.Linear.None;
  var tween = new TWEEN.Tween(from).to(to, duration).easing(easing); // 这里注意一下，因为 requestAnimationFrameInterval 给的时间是从 0 开始的，tween 动画也从 0 开始

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
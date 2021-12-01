"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraMovementPlugin = void 0;

var _five = require("@realsee/five");

var _typings = require("./typings");

var _tween = require("../../shared-utils/animationFrame/tween");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var PI_2 = Math.PI * 2;

function formatLatitude(rad) {
  return rad % PI_2;
}

function formatLongitude(rad) {
  return (rad % PI_2 + PI_2) % PI_2;
}

var getLongitudeParams = function getLongitudeParams(from, to, rotation) {
  var PI = Math.PI;
  var PI_2 = PI * 2;
  from = formatLongitude(from);
  to = formatLongitude(to); // 逆时针旋转，初始值必须是较大的值

  if (rotation === _typings.Rotation.Anticlockwise && from < to) from += PI_2; // 顺时针旋转，结束值必须是较大值

  if (rotation === _typings.Rotation.Clockwise && to < from) to += PI_2; // Loop 旋转，找锐角旋转
  // 如果 to 比 from 大 180°，逆时针转
  // 如果 from 比 to 大 180°，顺时针转

  if (rotation === _typings.Rotation.Loop && to - from > PI) return getLongitudeParams(from, to, _typings.Rotation.Anticlockwise);
  if (rotation === _typings.Rotation.Loop && from - to > PI) return getLongitudeParams(from, to, _typings.Rotation.Clockwise);
  return {
    from: from,
    to: to
  };
};

function progressNumber(from, to, pst) {
  return from + (to - from) * pst;
}
/**
 * **运镜插件** 模拟类似于电影运镜效果。
 */


var CameraMovementPlugin = function CameraMovementPlugin(five) {
  var move = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args, duration) {
      var opts,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              opts = _args.length > 2 && _args[2] !== undefined ? _args[2] : {
                preload: true
              };

              if (opts.asyncStartCallback) {
                opts.asyncStartCallback();
              }

              if (!(args.mode && args.mode !== five.currentMode)) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return new Promise(function (resolve) {
                if (!args.mode) return;
                five.once('modeChange', function (mode) {
                  five.once('initAnimationEnded', function () {
                    if (mode === args.mode) {
                      resolve(true);
                    }
                  });
                });
                five.changeMode(args.mode, {
                  fov: args.fov || undefined,
                  latitude: args.latitude || undefined,
                  longitude: args.longitude || undefined,
                  panoIndex: args.panoIndex || undefined
                });
              });

            case 5:
              if (!(args.mode === _five.Five.Mode.Floorplan)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", true);

            case 7:
              if (!(opts.preload && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
                _context.next = 10;
                break;
              }

              _context.next = 10;
              return five.preloadPano(args.panoIndex);

            case 10:
              if (opts.asyncEndCallback) {
                opts.asyncEndCallback();
              }

              if (!(args.panoIndex === undefined && args.fov === undefined && args.latitude === undefined && args.longitude === undefined)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return", true);

            case 13:
              _context.next = 15;
              return new Promise(function (resolve, reject) {
                var panoIndex = args.panoIndex !== undefined ? args.panoIndex : five.panoIndex;

                if (panoIndex !== undefined) {
                  five.moveToPano(panoIndex, Object.assign({
                    duration: duration,
                    // 移动耗时
                    moveEndCallback: function moveEndCallback() {
                      return resolve(true);
                    },
                    // 移动结束
                    moveCancelCallback: function moveCancelCallback() {
                      return reject(false);
                    } // 移动开始

                  }, args));
                } else {
                  reject(false);
                }
              });

            case 15:
              return _context.abrupt("return", _context.sent);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function move(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var getAnimeParams = function getAnimeParams(args) {
    var currentFiveState = five.state; // latitude

    var fromLatitude = formatLatitude(currentFiveState.latitude);
    var toLatitude = formatLatitude(args.latitude); // longitude

    var _getLongitudeParams = getLongitudeParams(currentFiveState.longitude, args.longitude, args.rotation || _typings.Rotation.Loop),
        fromLongitude = _getLongitudeParams.from,
        toLongitude = _getLongitudeParams.to; // fov


    var fromFov = currentFiveState.fov;
    var toFov = args.fov;
    return {
      from: {
        latitude: fromLatitude,
        longitude: fromLongitude,
        fov: fromFov
      },
      to: {
        latitude: toLatitude,
        longitude: toLongitude,
        fov: toFov
      }
    };
  };

  var rotate = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args, duration) {
      var opts,
          _getAnimeParams,
          from,
          to,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              opts = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};

              if (opts.asyncStartCallback) {
                opts.asyncStartCallback();
              }

              if (!(five.currentMode !== _five.Five.Mode.Panorama)) {
                _context2.next = 5;
                break;
              }

              _context2.next = 5;
              return five.changeMode(_five.Five.Mode.Panorama);

            case 5:
              if (!(args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
                _context2.next = 11;
                break;
              }

              if (!opts.preload) {
                _context2.next = 9;
                break;
              }

              _context2.next = 9;
              return five.preloadPano(args.panoIndex);

            case 9:
              _context2.next = 11;
              return new Promise(function (resolve, reject) {
                five.moveToPano(args.panoIndex, {
                  moveEndCallback: function moveEndCallback() {
                    return resolve(true);
                  },
                  // 移动结束
                  moveCancelCallback: function moveCancelCallback() {
                    return reject(false);
                  } // 移动开始

                });
              });

            case 11:
              if (opts.asyncEndCallback) {
                opts.asyncEndCallback();
              }

              _getAnimeParams = getAnimeParams(args), from = _getAnimeParams.from, to = _getAnimeParams.to;
              _context2.next = 15;
              return new Promise(function (resolve, reject) {
                var onUpdate = function onUpdate(_ref3) {
                  var progress = _ref3.progress;
                  var state = {};
                  state.longitude = progressNumber(from.longitude, to.longitude, progress);
                  state.latitude = progressNumber(from.latitude, to.latitude, progress);
                  state.fov = progressNumber(from.fov, to.fov, progress);
                  five.setState(state, true);
                };

                var onComplete = function onComplete() {
                  resolve(true);
                };

                var onDestroy = function onDestroy() {
                  resolve(false);
                };

                var animeDuration = args.rotateSpeed ? Math.ceil(Math.abs(to.longitude - from.longitude) / args.rotateSpeed * 1000) : duration;
                var tween = (0, _tween.tweenProgress)(animeDuration, _tween.Easing.Linear.None).onUpdate(onUpdate).onComplete(onComplete).onDestroy(onDestroy);

                if (args.rotation === _typings.Rotation.Loop) {
                  tween.repeat(Infinity).yoyo(true);
                }

                setTimeout(function () {
                  // 总时间到了之后强制结束，同时也是 Loop 模式的结束方式
                  tween.destroy();
                  resolve(true);
                }, duration);
              });

            case 15:
              return _context2.abrupt("return", _context2.sent);

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function rotate(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  return {
    move: move,
    rotate: rotate
  };
};

exports.CameraMovementPlugin = CameraMovementPlugin;
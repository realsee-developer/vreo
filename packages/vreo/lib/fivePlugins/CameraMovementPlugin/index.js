import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { Five } from '@realsee/five';
import { Rotation } from "./typings.js";
var PI = Math.PI;
var PI_2 = PI * 2;
var moving = false; // five 6 神秘bug， move 的时候不能 setState

function progressNumber(from, to, pst) {
  if (from === to) return from;
  return from + (to - from) * pst;
}
function progressLongitude(fromLongitude, toLongitude, rotation, progress) {
  var clockwise = rotation === Rotation.Clockwise;
  var delta = clockwise ? fromLongitude - toLongitude : toLongitude - fromLongitude;
  var deltaMod = delta % PI_2;
  var deltaMod2 = deltaMod < 0 ? deltaMod + PI_2 : deltaMod;
  var deltaMod3 = clockwise ? -deltaMod2 : deltaMod2;
  var progressLongitude = fromLongitude + deltaMod3 * progress;
  return progressLongitude % PI_2;
}

/**
 * **运镜插件** 模拟类似于电影运镜效果。
 */
export var CameraMovementPlugin = function CameraMovementPlugin(five) {
  var move = function move(args, duration) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      preload: true
    };
    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
        var _opts$asyncEndCallbac;
        var panoIndex, start, movePanoOptions;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                moving = true;
                if (opts.asyncStartCallback) {
                  opts.asyncStartCallback();
                }
                if (!(five.panoIndex === undefined)) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", reject(false));
              case 4:
                if (!(args.mode && args.mode !== five.currentMode)) {
                  _context.next = 8;
                  break;
                }
                _context.next = 7;
                return five.changeMode(args.mode, args, duration);
              case 7:
                return _context.abrupt("return", resolve(true));
              case 8:
                if (!(args.mode === Five.Mode.Floorplan)) {
                  _context.next = 10;
                  break;
                }
                return _context.abrupt("return", resolve(true));
              case 10:
                if (!(opts.preload && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
                  _context.next = 13;
                  break;
                }
                _context.next = 13;
                return five.preloadPano(args.panoIndex);
              case 13:
                (_opts$asyncEndCallbac = opts.asyncEndCallback) === null || _opts$asyncEndCallbac === void 0 ? void 0 : _opts$asyncEndCallbac.call(opts);
                if (!(args.panoIndex === undefined && args.fov === undefined && args.latitude === undefined && args.longitude === undefined)) {
                  _context.next = 16;
                  break;
                }
                return _context.abrupt("return", resolve(true));
              case 16:
                panoIndex = args.panoIndex !== undefined ? args.panoIndex : five.panoIndex;
                if (!(panoIndex !== undefined)) {
                  _context.next = 26;
                  break;
                }
                start = performance.now();
                _context.next = 21;
                return five.ready();
              case 21:
                movePanoOptions = Object.assign({}, args, {
                  duration: duration - (performance.now() - start),
                  // 移动耗时
                  moveEndCallback: function moveEndCallback() {
                    return resolve(true);
                  },
                  // 移动结束
                  moveCancelCallback: function moveCancelCallback() {
                    resolve(true);
                  },
                  // 移动开始
                  effect: args.transEffect || 'fly'
                });
                _context.next = 24;
                return five.moveToPano(panoIndex, movePanoOptions);
              case 24:
                _context.next = 27;
                break;
              case 26:
                reject(false);
              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };
  var rotate = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(args, duration) {
      var _opts$asyncStartCallb, _opts$asyncEndCallbac2;
      var opts,
        from,
        to,
        timeEnd,
        start,
        animeDuration,
        onFiveRenderFrame,
        _args2 = arguments;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              opts = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              moving = false;
              (_opts$asyncStartCallb = opts.asyncStartCallback) === null || _opts$asyncStartCallb === void 0 ? void 0 : _opts$asyncStartCallb.call(opts);

              // 先切换模型再出旋转效果
              if (!(args.mode && five.currentMode !== args.mode)) {
                _context2.next = 6;
                break;
              }
              _context2.next = 6;
              return five.changeMode(args.mode, args.mode === Five.Mode.Panorama ? {
                latitude: 0
              } : undefined);
            case 6:
              if (!(args.mode === Five.Mode.Panorama && five.currentMode === Five.Mode.Panorama && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
                _context2.next = 12;
                break;
              }
              if (!opts.preload) {
                _context2.next = 10;
                break;
              }
              _context2.next = 10;
              return five.preloadPano(args.panoIndex);
            case 10:
              _context2.next = 12;
              return new Promise(function (resolve, reject) {
                five.moveToPano(args.panoIndex, {
                  moveEndCallback: function moveEndCallback() {
                    return resolve(true);
                  },
                  // 移动结束
                  moveCancelCallback: function moveCancelCallback() {
                    return reject(false);
                  },
                  // 移动开始
                  effect: 'fade'
                });
              });
            case 12:
              _context2.next = 14;
              return five.ready();
            case 14:
              (_opts$asyncEndCallbac2 = opts.asyncEndCallback) === null || _opts$asyncEndCallbac2 === void 0 ? void 0 : _opts$asyncEndCallbac2.call(opts);

              // 计算to
              from = five.getCurrentState();
              to = function () {
                return args;
              }();
              timeEnd = false; // 开始时间
              start = performance.now();
              animeDuration = duration;
              if (args.rotation === Rotation.Loop) {
                animeDuration = args.rotateSpeed ? Math.ceil(Math.abs(to.longitude - from.longitude) / args.rotateSpeed * 1000) : duration;
                animeDuration = Math.min(duration, animeDuration);
              }
              onFiveRenderFrame = function onFiveRenderFrame() {
                if (timeEnd || moving) {
                  five.off('renderFrame', onFiveRenderFrame);
                  return;
                }
                var targetState = {};
                if (args.rotation !== Rotation.Loop) {
                  var progress = (performance.now() - start) / duration;
                  targetState = {
                    fov: progressNumber(from.fov, to.fov, progress),
                    latitude: progressNumber(from.latitude, to.latitude, progress),
                    longitude: progressLongitude(from.longitude, to.longitude, args.rotation, progress)
                  };
                } else {
                  var _progress = (performance.now() - start) / animeDuration; // 可能大于1
                  var times = Math.floor(_progress);
                  var progress2 = _progress - times; // 一定小于1
                  var isNegative = times % 2 === 1; // 是否为反向旋转, 0: 正, 1: 反, 2: 正, 3: 反 以此类推
                  var resultProgress = isNegative ? 1 - progress2 : progress2;
                  targetState = {
                    fov: progressNumber(from.fov, to.fov, resultProgress),
                    latitude: progressNumber(from.latitude, to.latitude, resultProgress),
                    longitude: progressNumber(from.longitude, to.longitude, resultProgress)
                  };
                }
                five.setState(targetState, true);
              };
              five.on('renderFrame', onFiveRenderFrame);
              _context2.next = 25;
              return new Promise(function (resolve) {
                setTimeout(function () {
                  timeEnd = true;
                  five.off('renderFrame', onFiveRenderFrame);
                  // 总时间到了之后强制结束，同时也是 Loop 模式的结束方式
                  resolve(true);
                }, duration);
              });
            case 25:
              return _context2.abrupt("return", _context2.sent);
            case 26:
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
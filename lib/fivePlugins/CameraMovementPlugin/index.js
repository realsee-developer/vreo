"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraMovementPlugin = void 0;
var _five = require("@realsee/five");
var _typings = require("./typings");
var _tween = require("../../shared-utils/animationFrame/tween");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var PI = Math.PI;
var PI_2 = PI * 2;
function formatLatitude(rad) {
  return rad % PI_2;
}
function formatLongitude(rad) {
  return rad % PI_2;
}
var getLongitudeParams = function getLongitudeParams(from, to, rotation) {
  from = formatLongitude(from);
  to = formatLongitude(to);

  // 逆时针旋转，初始值必须是较大的值
  if (rotation === _typings.Rotation.Anticlockwise && from > to) to += PI_2;

  // 顺时针旋转，结束值必须是较大值
  else if (rotation === _typings.Rotation.Clockwise && to > from) from += PI_2;

  // Loop 旋转，找锐角旋转
  // 如果 to 比 from 大 180°，逆时针转
  // 如果 from 比 to 大 180°，顺时针转
  else if (rotation !== _typings.Rotation.Anticlockwise && rotation !== _typings.Rotation.Clockwise && to - from > PI) return getLongitudeParams(from, to, _typings.Rotation.Clockwise);else if (rotation !== _typings.Rotation.Anticlockwise && rotation !== _typings.Rotation.Clockwise && from - to > PI) return getLongitudeParams(from, to, _typings.Rotation.Anticlockwise);
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
  var move = function move(args, duration) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      preload: true
    };
    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
        var panoIndex, movePanoOptions;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (opts.asyncStartCallback) {
                  opts.asyncStartCallback();
                }
                if (!(five.panoIndex === undefined)) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return", reject(false));
              case 3:
                if (!(args.mode && args.mode !== five.currentMode)) {
                  _context.next = 6;
                  break;
                }
                _context.next = 6;
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
              case 6:
                if (!(args.mode === _five.Five.Mode.Floorplan)) {
                  _context.next = 8;
                  break;
                }
                return _context.abrupt("return", resolve(true));
              case 8:
                if (!(opts.preload && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
                  _context.next = 11;
                  break;
                }
                _context.next = 11;
                return five.preloadPano(args.panoIndex);
              case 11:
                if (opts.asyncEndCallback) {
                  opts.asyncEndCallback();
                }
                if (!(args.panoIndex === undefined && args.fov === undefined && args.latitude === undefined && args.longitude === undefined)) {
                  _context.next = 14;
                  break;
                }
                return _context.abrupt("return", resolve(true));
              case 14:
                panoIndex = args.panoIndex !== undefined ? args.panoIndex : five.panoIndex;
                if (!(panoIndex !== undefined)) {
                  _context.next = 21;
                  break;
                }
                movePanoOptions = Object.assign(args, {
                  duration: duration,
                  // 移动耗时
                  moveEndCallback: function moveEndCallback() {
                    return resolve(true);
                  },
                  // 移动结束
                  moveCancelCallback: function moveCancelCallback() {
                    resolve(true);
                  } // 移动开始
                  // effect: args.transEffect || 'fade',
                });
                _context.next = 19;
                return five.moveToPano(panoIndex, movePanoOptions);
              case 19:
                _context.next = 22;
                break;
              case 21:
                reject(false);
              case 22:
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
  var getAnimeParams = function getAnimeParams(args) {
    var currentFiveState = five.state;
    // latitude
    var fromLatitude = formatLatitude(currentFiveState.latitude);
    var toLatitude = formatLatitude(args.latitude);
    // longitude
    var _getLongitudeParams = getLongitudeParams(currentFiveState.longitude, args.longitude, args.rotation || _typings.Rotation.Loop),
      fromLongitude = _getLongitudeParams.from,
      toLongitude = _getLongitudeParams.to;
    // fov
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
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(args, duration) {
      var opts,
        _getAnimeParams,
        from,
        to,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              opts = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              if (opts.asyncStartCallback) {
                opts.asyncStartCallback();
              }

              // 先切换模型再出旋转效果
              if (!(args.mode && five.currentMode !== args.mode)) {
                _context2.next = 5;
                break;
              }
              _context2.next = 5;
              return five.changeMode(args.mode);
            case 5:
              if (!(args.mode === _five.Five.Mode.Panorama && five.currentMode === _five.Five.Mode.Panorama && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
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
                  },
                  // 移动开始
                  effect: 'fade'
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
                  state.longitude = progressNumber(from.longitude, to.longitude, progress) % PI_2;
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
                var animeDuration = duration;
                if (args.rotation === _typings.Rotation.Loop) {
                  animeDuration = args.rotateSpeed ? Math.ceil(Math.abs(to.longitude - from.longitude) / args.rotateSpeed * 1000) : duration;
                }
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
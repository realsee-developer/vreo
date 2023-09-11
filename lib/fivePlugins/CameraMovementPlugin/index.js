"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraMovementPlugin = void 0;
var _five = require("@realsee/five");
var _typings = require("./typings");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var PI = Math.PI;
var PI_2 = PI * 2;
function progressNumber(from, to, pst) {
  if (from === to) return from;
  return from + (to - from) * pst;
}
function progressLongitude(fromLongitude, toLongitude, rotation, progress) {
  var clockwise = rotation === _typings.Rotation.Clockwise;
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
var CameraMovementPlugin = function CameraMovementPlugin(five) {
  var move = function move(args, duration) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      preload: true
    };
    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
        var _opts$asyncEndCallbac;
        var panoIndex, start, movePanoOptions;
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
                  _context.next = 7;
                  break;
                }
                _context.next = 6;
                return five.changeMode(args.mode, args, duration);
              case 6:
                return _context.abrupt("return", resolve(true));
              case 7:
                if (!(args.mode === _five.Five.Mode.Floorplan)) {
                  _context.next = 9;
                  break;
                }
                return _context.abrupt("return", resolve(true));
              case 9:
                if (!(opts.preload && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex)) {
                  _context.next = 12;
                  break;
                }
                _context.next = 12;
                return five.preloadPano(args.panoIndex);
              case 12:
                (_opts$asyncEndCallbac = opts.asyncEndCallback) === null || _opts$asyncEndCallbac === void 0 ? void 0 : _opts$asyncEndCallbac.call(opts);
                if (!(args.panoIndex === undefined && args.fov === undefined && args.latitude === undefined && args.longitude === undefined)) {
                  _context.next = 15;
                  break;
                }
                return _context.abrupt("return", resolve(true));
              case 15:
                panoIndex = args.panoIndex !== undefined ? args.panoIndex : five.panoIndex;
                if (!(panoIndex !== undefined)) {
                  _context.next = 25;
                  break;
                }
                start = performance.now();
                _context.next = 20;
                return five.ready();
              case 20:
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
                _context.next = 23;
                return five.moveToPano(panoIndex, movePanoOptions);
              case 23:
                _context.next = 26;
                break;
              case 25:
                reject(false);
              case 26:
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
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(args, duration) {
      var _opts$asyncStartCallb, _opts$asyncEndCallbac2;
      var opts,
        from,
        to,
        timeEnd,
        start,
        animeDuration,
        onFiveRenderFrame,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              opts = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              (_opts$asyncStartCallb = opts.asyncStartCallback) === null || _opts$asyncStartCallb === void 0 ? void 0 : _opts$asyncStartCallb.call(opts);

              // 先切换模型再出旋转效果
              if (!(args.mode && five.currentMode !== args.mode)) {
                _context2.next = 5;
                break;
              }
              _context2.next = 5;
              return five.changeMode(args.mode, args.mode === _five.Five.Mode.Panorama ? {
                latitude: 0
              } : undefined);
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
              _context2.next = 13;
              return five.ready();
            case 13:
              (_opts$asyncEndCallbac2 = opts.asyncEndCallback) === null || _opts$asyncEndCallbac2 === void 0 ? void 0 : _opts$asyncEndCallbac2.call(opts);

              // 计算to
              from = five.getCurrentState();
              to = function () {
                return args;
              }();
              timeEnd = false; // 开始时间
              start = performance.now();
              animeDuration = duration;
              if (args.rotation === _typings.Rotation.Loop) {
                animeDuration = args.rotateSpeed ? Math.ceil(Math.abs(to.longitude - from.longitude) / args.rotateSpeed * 1000) : duration;
                animeDuration = Math.min(duration, animeDuration);
              }
              onFiveRenderFrame = function onFiveRenderFrame() {
                if (timeEnd) {
                  five.off('renderFrame', onFiveRenderFrame);
                  return;
                }
                var targetState = {};
                if (args.rotation !== _typings.Rotation.Loop) {
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
              _context2.next = 24;
              return new Promise(function (resolve) {
                setTimeout(function () {
                  timeEnd = true;
                  five.off('renderFrame', onFiveRenderFrame);
                  // 总时间到了之后强制结束，同时也是 Loop 模式的结束方式
                  resolve(true);
                }, duration);
              });
            case 24:
              return _context2.abrupt("return", _context2.sent);
            case 25:
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
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgentMesh = void 0;
var THREE = _interopRequireWildcard(require("three"));
var _Preloader = require("../../../shared-utils/Preloader");
var _mobx = require("mobx");
var _AduioLike = _interopRequireDefault(require("../../../shared-utils/AduioLike"));
var _getMediaInfo = require("../../../shared-utils/getMediaInfo");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var vertexShader = "\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\nvoid main(){\n  vUv = uv;\n  vColorUv = vec2(uv.x / 2.0, uv.y);\n  vMaskUv = vec2(0.5 + uv.x / 2.0, uv.y);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";
var fragmentShaderTpl = function fragmentShaderTpl() {
  return "\nuniform int enable;\nuniform sampler2D map;\nvarying vec2 vUv;\nvarying vec2 vColorUv;\nvarying vec2 vMaskUv;\n\nvec3 hsv2rgb(vec3 c) {\n  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvec3 rgb2hsv(vec3 c) {\n  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n  float d = q.x - min(q.w, q.y);\n  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);\n}\n\nvoid main(void) {\n  vec3 color = texture2D(map, vUv).xyz;\n  float amask = 1.0;\n\n  float ref = color.r;\n  if (ref < color.b) ref = color.b;\n  amask = color.g - ref + 0.1;\n  amask = smoothstep(0.1, 0.3, amask);\n  amask = 1.0 - amask;\n\n  vec3 target = rgb2hsv(vec3(0.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0));\n  vec3 hsv = rgb2hsv(color);\n  float distance = abs(hsv.x - target.x);\n  if (distance < 0.15) {\n    hsv.y = 0.0;\n  }\n  color = hsv2rgb(hsv);\n\n  gl_FragColor = vec4(color.rgb, amask * float(enable));\n}\n";
};
var cacheInstance = {};
/**
 * 视频经纪人MESH
 */
var VideoAgentMesh = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(VideoAgentMesh, _THREE$Mesh);
  var _super = _createSuper(VideoAgentMesh);
  /**
   *
   * @param width
   * @param height
   * @param widthSegments
   * @param heightSegments
   * @param options
   */
  function VideoAgentMesh(width, height, widthSegments, heightSegments) {
    var _this$options$videoIn, _this$options$videoIn2, _this$options$videoIn3;
    var _this;
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      preload: true
    };
    _classCallCheck(this, VideoAgentMesh);
    if (!options.videoInstance) {
      if (cacheInstance.videoInstance) {
        options.videoInstance = cacheInstance.videoInstance;
      } else {
        var videoInstance = document.createElement('video');
        videoInstance.style.opacity = '0';
        videoInstance.style.pointerEvents = 'none';
        videoInstance.style.display = 'none';
        document.body.append(videoInstance);
        options.videoInstance = videoInstance;
        cacheInstance.videoInstance = videoInstance;
        videoInstance.playsInline = true;
        videoInstance.controls = false;
      }
    }
    var geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    var videoTexture = new THREE.VideoTexture(options.videoInstance);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          value: videoTexture
        },
        enable: {
          value: 0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderTpl(),
      transparent: true
    });
    _this = _super.call(this, geometry, material);
    _this.options = options;
    _this.freeze = false;
    _this.paused = true;
    if (!options.audioInstance) {
      if (cacheInstance.audioInstance) {
        _this.audioInstance = cacheInstance.audioInstance;
      } else {
        var audioInstance = document.createElement('audio');
        audioInstance.crossOrigin = '';
        // videoInstance.muted = true
        audioInstance.muted = false;
        audioInstance.autoplay = false;
        audioInstance.style.display = 'none';
        document.body.appendChild(audioInstance);
        _this.audioInstance = audioInstance;
        cacheInstance.audioInstance = audioInstance;
      }
    } else {
      _this.audioInstance = options.audioInstance;
    }
    _this.audioLikeInstance = new _AduioLike["default"]();
    (0, _mobx.makeObservable)(_assertThisInitialized(_this), {
      paused: _mobx.observable
    });
    var updatePaused = function updatePaused(paused) {
      return (0, _mobx.runInAction)(function () {
        return _this.paused = paused;
      });
    };
    var onPause = function onPause() {
      return updatePaused(true);
    };
    var onPlay = function onPlay() {
      return updatePaused(false);
    };
    var onEnded = function onEnded() {
      return console.log('vreo: video 播放结束');
    };
    _this.audioInstance.addEventListener('pause', onPause);
    _this.audioInstance.addEventListener('play', onPlay);
    (_this$options$videoIn = _this.options.videoInstance) === null || _this$options$videoIn === void 0 ? void 0 : _this$options$videoIn.addEventListener('pause', onPause);
    (_this$options$videoIn2 = _this.options.videoInstance) === null || _this$options$videoIn2 === void 0 ? void 0 : _this$options$videoIn2.addEventListener('play', onPlay);
    _this.audioLikeInstance.addEventListener('pause', onPause);
    _this.audioLikeInstance.addEventListener('play', onPlay);
    (_this$options$videoIn3 = _this.options.videoInstance) === null || _this$options$videoIn3 === void 0 ? void 0 : _this$options$videoIn3.addEventListener('ended', onEnded);
    _this.$removeEventListener = function () {
      var _this$options$videoIn4, _this$options$videoIn5, _this$options$videoIn6;
      _this.audioInstance.removeEventListener('pause', onPause);
      _this.audioInstance.removeEventListener('play', onPlay);
      (_this$options$videoIn4 = _this.options.videoInstance) === null || _this$options$videoIn4 === void 0 ? void 0 : _this$options$videoIn4.removeEventListener('pause', onPause);
      (_this$options$videoIn5 = _this.options.videoInstance) === null || _this$options$videoIn5 === void 0 ? void 0 : _this$options$videoIn5.removeEventListener('play', onPlay);
      _this.audioLikeInstance.removeEventListener('pause', onPause);
      _this.audioLikeInstance.removeEventListener('play', onPlay);
      (_this$options$videoIn6 = _this.options.videoInstance) === null || _this$options$videoIn6 === void 0 ? void 0 : _this$options$videoIn6.removeEventListener('ended', onEnded);
    };
    return _this;
  }
  _createClass(VideoAgentMesh, [{
    key: "mediaInstance",
    get: function get() {
      if (!this.videoUrl) {
        return this.audioLikeInstance;
      }
      if ((0, _getMediaInfo.getMediaType)(this.videoUrl) === 'audio') {
        return this.audioInstance;
      }
      var uniforms = this.material.uniforms;
      var videoInstance = uniforms.map.value.image;
      return videoInstance;
    }
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(videoUrl) {
        var _this2 = this;
        var uniforms, onStart;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.videoUrl === videoUrl)) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return");
              case 2:
                this.videoUrl = videoUrl;

                // // 兼容非视频场景
                // if (this.mediaInstance instanceof HTMLAudioElement) {
                //   this.mediaInstance.style.display = 'none'
                // } else if (this.mediaInstance instanceof HTMLVideoElement) {
                //   this.mediaInstance.style.display = 'block'
                // }

                this.freeze = true;
                _context.next = 6;
                return this.mediaInstance.pause();
              case 6:
                uniforms = this.material.uniforms;
                this.mediaInstance.muted = true;
                if (!(this.options.preload || this.options.preload === undefined || (0, _getMediaInfo.getMediaType)(this.videoUrl) === 'video')) {
                  _context.next = 18;
                  break;
                }
                _context.t1 = URL;
                _context.next = 12;
                return _Preloader.Preloader.blob(this.videoUrl);
              case 12:
                _context.t2 = _context.sent;
                _context.next = 15;
                return _context.t1.createObjectURL.call(_context.t1, _context.t2);
              case 15:
                _context.t0 = _context.sent;
                _context.next = 19;
                break;
              case 18:
                _context.t0 = this.videoUrl;
              case 19:
                this.mediaInstance.src = _context.t0;
                this.mediaInstance.setAttribute('data-src', this.videoUrl);
                onStart = function onStart() {
                  if (_this2.mediaInstance.currentTime === 0) return;
                  _this2.freeze = false;
                  _this2.mediaInstance.muted = false;
                  uniforms.enable.value = (0, _getMediaInfo.getMediaType)(_this2.videoUrl) ? 1 : 0;
                  _this2.mediaInstance.removeEventListener('timeupdate', onStart, false);
                };
                this.mediaInstance.addEventListener('timeupdate', onStart, false);
              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function update(_x) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "play",
    value: function () {
      var _play = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var _this3 = this;
        var videoUrl,
          currentTime,
          duration,
          _args3 = arguments;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                videoUrl = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';
                currentTime = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
                duration = _args3.length > 2 ? _args3[2] : undefined;
                videoUrl = videoUrl || '';
                if (!(duration && !videoUrl)) {
                  _context3.next = 10;
                  break;
                }
                if (this.currentTime) {
                  this.mediaInstance.currentTime = currentTime;
                }
                this.mediaInstance.duration = duration;
                this.videoUrl = '';
                this.mediaInstance.play();
                return _context3.abrupt("return", true);
              case 10:
                if (videoUrl) {
                  _context3.next = 18;
                  break;
                }
                if (!this.videoUrl) {
                  _context3.next = 16;
                  break;
                }
                _context3.next = 14;
                return this.mediaInstance.play();
              case 14:
                _context3.next = 17;
                break;
              case 16:
                console.warn('警告：视频资源未初始化。');
              case 17:
                return _context3.abrupt("return", true);
              case 18:
                if (!(videoUrl === this.videoUrl)) {
                  _context3.next = 23;
                  break;
                }
                this.mediaInstance.currentTime = currentTime;
                _context3.next = 22;
                return this.mediaInstance.play();
              case 22:
                return _context3.abrupt("return", true);
              case 23:
                _context3.next = 25;
                return this.update(videoUrl);
              case 25:
                this.mediaInstance.pause();
                _context3.next = 28;
                return new Promise(function (resolve) {
                  return setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
                    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _this3.mediaInstance.currentTime = currentTime;
                            _context2.next = 3;
                            return _this3.mediaInstance.play();
                          case 3:
                            resolve(true);
                          case 4:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  })), 20);
                });
              case 28:
                return _context3.abrupt("return", _context3.sent);
              case 29:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      function play() {
        return _play.apply(this, arguments);
      }
      return play;
    }()
    /**
     * 转成毫秒，保障精准度
     */
  }, {
    key: "currentTime",
    get: function get() {
      return this.mediaInstance.currentTime * 1000;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      // 销毁事件监听
      this.$removeEventListener();
      if (cacheInstance.audioInstance) {
        document.body.removeChild(cacheInstance.audioInstance);
        cacheInstance.audioInstance = undefined;
      }
      if (cacheInstance.videoInstance) {
        document.body.removeChild(cacheInstance.videoInstance);
        cacheInstance.videoInstance = undefined;
      }
    }
  }]);
  return VideoAgentMesh;
}(THREE.Mesh);
exports.VideoAgentMesh = VideoAgentMesh;
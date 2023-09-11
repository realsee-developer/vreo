"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelVideo = ModelVideo;

var React = _interopRequireWildcard(require("react"));

var THREE = _interopRequireWildcard(require("three"));

var _hooks = require("../../../hooks");

var _ModelTVVideoPlugin = require("../../../../fivePlugins/ModelTVVideoPlugin");

var _createTransMatrix = require("../../../../shared-utils/createTransMatrix");

var _VreoUnit = require("../../../../typings/VreoUnit");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ModelVideo() {
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();
  var ref = React.useRef();
  var timeoutRef = React.useRef();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keyframe) {
        var _controller$configs, _controller$configs$v;

        var start, end, _ref2, videoSrc, videoPosterSrc, vertexs, matrixWorld, position, points;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!ref.current) {
                  ref.current = (0, _ModelTVVideoPlugin.ModelTVVideoPlugin)(five, {});
                }

                start = keyframe.start, end = keyframe.end;
                _ref2 = keyframe.data, videoSrc = _ref2.videoSrc, videoPosterSrc = _ref2.videoPosterSrc, vertexs = _ref2.vertexs, matrixWorld = _ref2.matrixWorld;

                position = function () {
                  if (vertexs.length < 4) {
                    throw new Error('ModelVideo: 顶点数据集合不够，无法组成矩形 ....');
                  }

                  if (vertexs.length === 4) {
                    return vertexs;
                  }

                  var box = new THREE.Box3();
                  vertexs.forEach(function (v) {
                    return box.expandByPoint(new THREE.Vector3(v.x, v.y, v.z));
                  });
                  return [new THREE.Vector3(box.min.x, box.max.y, box.max.z), new THREE.Vector3(box.min.x, box.min.y, box.max.z), new THREE.Vector3(box.max.x, box.min.y, box.max.z), new THREE.Vector3(box.max.x, box.max.y, box.max.z)];
                }();

                points = function () {
                  if (matrixWorld) {
                    var transMatrix = (0, _createTransMatrix.createTransMatrix)(matrixWorld);
                    return [position.map(function (p) {
                      var res = transMatrix([p.x, p.y, p.z]);
                      return {
                        x: res[0],
                        y: res[1],
                        z: res[2]
                      };
                    })];
                  }

                  return [position];
                }();

                ref.current.disable();
                _context.next = 8;
                return ref.current.load({
                  video_src: videoSrc,
                  video_poster_src: videoPosterSrc,
                  points: points
                }, (_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : (_controller$configs$v = _controller$configs.videos) === null || _controller$configs$v === void 0 ? void 0 : _controller$configs$v.modelTVVideo);

              case 8:
                ref.current.enable();
                timeoutRef.current = setTimeout(function () {
                  var _ref$current;

                  return (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.disable();
                }, end - start);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function callback(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    controller.on(_VreoUnit.VreoKeyframeEnum.ModelVideo, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.ModelVideo, callback);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
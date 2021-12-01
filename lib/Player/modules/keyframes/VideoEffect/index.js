"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoEffect = VideoEffect;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _VreoUnit = require("../../../../typings/VreoUnit");

var _hooks = require("../../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var inlinePlay = function inlinePlay(videoInstance) {
  if (!videoInstance) return;

  var canplaythrough = function canplaythrough() {
    videoInstance.removeEventListener('canplaythrough', canplaythrough);

    try {
      videoInstance.play();
    } catch (error) {}
  };

  videoInstance.addEventListener('canplaythrough', canplaythrough);
  videoInstance.load();
}; // const emptyVideo = '//vrlab-static.ljcdn.com/release/web/leisure.69fd3522.mov'


var PI = Math.PI;
var PI_2 = PI * 2;

function VideoEffect() {
  var ref = React.useRef(null);
  var videoRef = React.useRef();
  var controller = (0, _hooks.useController)();
  var timeoutRef = React.useRef();

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      visible = _React$useState2[0],
      setVisible = _React$useState2[1];

  var five = (0, _hooks.useFiveInstance)();

  var setBlobSrc = function setBlobSrc(blob) {
    if (!videoRef.current) return;
    videoRef.current.src = blob;
  };

  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keyframe) {
        var start, end, _ref2, videoSrc, fov, direction, panoIndex, vector, _ref3, _ref4, longitude, latitude;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                start = keyframe.start, end = keyframe.end;
                _ref2 = keyframe.data, videoSrc = _ref2.videoSrc, fov = _ref2.fov, direction = _ref2.direction, panoIndex = _ref2.panoIndex, vector = _ref2.vector;
                _ref3 = function () {
                  if (vector) {
                    return [vector.longitude, vector.latitude];
                  }

                  if (!direction) {
                    return [0, 0];
                  }

                  var longitude = -Math.atan2(direction.x, -direction.z);
                  longitude = (longitude % PI_2 + PI_2) % PI_2;
                  var latitude = -Math.asin(direction.y / 1);
                  return [longitude, latitude];
                }(), _ref4 = _slicedToArray(_ref3, 2), longitude = _ref4[0], latitude = _ref4[1];
                five.setState({
                  fov: fov,
                  panoIndex: panoIndex,
                  longitude: longitude,
                  latitude: latitude
                }, true);
                setBlobSrc(videoSrc);
                inlinePlay(videoRef.current);
                setVisible(true);
                timeoutRef.current = setTimeout(function () {
                  var _videoRef$current;

                  if (!((_videoRef$current = videoRef.current) !== null && _videoRef$current !== void 0 && _videoRef$current.paused)) {
                    var _videoRef$current2;

                    (_videoRef$current2 = videoRef.current) === null || _videoRef$current2 === void 0 ? void 0 : _videoRef$current2.pause();
                  }

                  setVisible(false);
                  setBlobSrc('');
                }, end - start);

              case 8:
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

    controller.on(_VreoUnit.VreoKeyframeEnum.VideoEffect, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.VideoEffect, callback);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  React.useEffect(function () {
    var _controller$configs, _controller$configs$v;

    if (!ref.current) return;
    var video = ((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : (_controller$configs$v = _controller$configs.videos) === null || _controller$configs$v === void 0 ? void 0 : _controller$configs$v.videoEffect) || document.createElement('video'); // <video playsInline key="VideoEffect-video" className="VideoEffect-video" src={blobSrc} />

    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('autoplay', 'true');
    video.setAttribute('key', 'VideoEffect-video');
    video.setAttribute('class', 'VideoEffect-video');
    videoRef.current = video;
    ref.current.append(videoRef.current);
    document.addEventListener('WeixinJSBridgeReady', function () {
      var _videoRef$current3;

      (_videoRef$current3 = videoRef.current) === null || _videoRef$current3 === void 0 ? void 0 : _videoRef$current3.play();
    }, false);
    if (!ref.current) return; // const asyncfunc = async () => {
    //   setBlobSrc(await URL.createObjectURL(await Preloader.blob(emptyVideo)))
    //   inlinePlay(videoRef.current)
    // }
    // asyncfunc()
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: (0, _classnames["default"])('VideoEffect', {
      'VideoEffect--visible': visible
    })
  });
}
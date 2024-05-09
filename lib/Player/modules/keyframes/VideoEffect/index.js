"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoEffect = VideoEffect;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _VreoUnit = require("../../../../typings/VreoUnit");

var _hooks = require("../../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import { Preloader } from '../../../../shared-utils/Preloader'
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
      _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
      visible = _React$useState2[0],
      setVisible = _React$useState2[1];

  var five = (0, _hooks.useFiveInstance)();

  var setBlobSrc = function setBlobSrc(blob) {
    if (!videoRef.current) return;
    videoRef.current.src = blob;
  };

  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(keyframe) {
        var start, end, _ref2, videoSrc, fov, direction, panoIndex, vector, _ref3, _ref4, longitude, latitude;

        return _regenerator["default"].wrap(function _callee$(_context) {
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
                }(), _ref4 = (0, _slicedToArray2["default"])(_ref3, 2), longitude = _ref4[0], latitude = _ref4[1];
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

                  (_videoRef$current = videoRef.current) === null || _videoRef$current === void 0 ? void 0 : _videoRef$current.pause();
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

    var destroy = function destroy() {
      var _videoRef$current2;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      (_videoRef$current2 = videoRef.current) === null || _videoRef$current2 === void 0 ? void 0 : _videoRef$current2.pause();
      setVisible(false);
      setBlobSrc('');
    };

    controller.on('paused', function () {
      return destroy();
    });
    controller.on('ended', function () {
      return destroy();
    });
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
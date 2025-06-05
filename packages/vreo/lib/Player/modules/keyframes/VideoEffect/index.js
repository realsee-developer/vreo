import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import classNames from 'classnames';
import * as React from 'react';
// import { Preloader } from '../../../../shared-utils/Preloader'
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
import { useController, useFiveInstance } from "../../../hooks.js";
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
};

// const emptyVideo = '//vr-static.realsee-cdn.cn/release/web/leisure.69fd3522.mov'
var PI = Math.PI;
var PI_2 = PI * 2;
export function VideoEffect() {
  var ref = React.useRef(null);
  var videoRef = React.useRef();
  var controller = useController();
  var timeoutRef = React.useRef();
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    visible = _React$useState2[0],
    setVisible = _React$useState2[1];
  var five = useFiveInstance();
  var setBlobSrc = function setBlobSrc(blob) {
    if (!videoRef.current) return;
    videoRef.current.src = blob;
  };
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(keyframe) {
        var start, end, _ref2, videoSrc, fov, direction, panoIndex, vector, _ref3, _ref4, longitude, latitude;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
    controller.on(VreoKeyframeEnum.VideoEffect, callback);
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
      controller.off(VreoKeyframeEnum.VideoEffect, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  React.useEffect(function () {
    var _controller$configs, _controller$configs$v;
    if (!ref.current) return;
    var video = ((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : (_controller$configs$v = _controller$configs.videos) === null || _controller$configs$v === void 0 ? void 0 : _controller$configs$v.videoEffect) || document.createElement('video');
    // <video playsInline key="VideoEffect-video" className="VideoEffect-video" src={blobSrc} />
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
    if (!ref.current) return;
    // const asyncfunc = async () => {
    //   setBlobSrc(await URL.createObjectURL(await Preloader.blob(emptyVideo)))
    //   inlinePlay(videoRef.current)
    // }
    // asyncfunc()
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames('VideoEffect', {
      'VideoEffect--visible': visible
    })
  });
}
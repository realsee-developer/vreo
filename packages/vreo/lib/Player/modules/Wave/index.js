import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useCallback, useRef, useEffect } from 'react';
var defaultPrefix = 'https://vr-public.realsee-cdn.cn/release/static/image/release/';
var WAVES = {
  single: {
    width: 766,
    height: 60,
    frames: 20,
    hevc: 'vapor/static/wave-single.140d197f4838c130b69e87dfd0705479.mov',
    vp9: 'vapor/static/wave-single.eda65de390a830193fff40d1f1255555.webm',
    png: 'vapor/static/wave-single.f51aade2a6e1c59211698a1a24e6135f.png'
  },
  double: {
    width: 766,
    height: 60,
    frames: 16,
    hevc: 'vapor/static/wave-double.3e6d73050ee6958cc3060b107ebe5f39.mov',
    vp9: '/vapor/static/wave-double.77dfe8548ebcb3f3d336785d4fe9c7b2.webm',
    png: '/vapor/static/wave-double.ab4fe7d8a70395109ca4f759af7bd53f.png'
  },
  solid: {
    width: 1126,
    height: 90,
    frames: 48,
    hevc: 'vapor/static/wave-solid.cf68912a93275d07aa6b5097ea11fdda.mov',
    vp9: 'vapor/static/wave-solid.64438b63cbb346906d066bb7b8dc3e20.webm',
    png: 'vapor/static/wave-solid.6969d7f3f2f44f7ac1ade30e65660cb1.png'
  },
  swap: {
    width: 2250,
    height: 180,
    frames: 41,
    hevc: 'vapor/static/wave-swap.b38f22e2cf84ee21e9be35f7f56c9cfc.mov',
    vp9: 'vapor/static/wave-swap.c02e4b94cf05aecf6e7a0023bc7bb90f.webm',
    png: 'vapor/static/wave-swap.772ba526a7210dcc01567062c6319545.png'
  },
  expand: {
    width: 2250,
    height: 180,
    frames: 45,
    hevc: 'vapor/static/wave-expand.9529956c5954740cd4c9d07d51e32822.mov',
    vp9: 'vapor/static/wave-expand.a0d2a0074001cd3d4fea56818c6d3c38.webm',
    png: 'vapor/static/wave-expand.62fcf27b445533e6eb1b17bab5eafa0d.png'
  }
};
var userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
var isAppleDevice = /(iPhone|iPad|iPod)/i.test(userAgent);
var isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent) && /version/i.test(userAgent);
var isMicroMessenger = /microMessenger/i.test(userAgent);
var canPlayHevc = isAppleDevice || isSafari;
var canPlayVp9 = typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported("video/webm; codecs=vp9");
export function Wave(props) {
  var wave = React.useMemo(function () {
    var _props$appearance;
    var appearance = (_props$appearance = props === null || props === void 0 ? void 0 : props.appearance) !== null && _props$appearance !== void 0 ? _props$appearance : 'solid';
    return WAVES[appearance];
  }, [props === null || props === void 0 ? void 0 : props.appearance]);
  var heightWidthRatio = React.useMemo(function () {
    return wave.height / wave.width;
  }, [wave]);
  var content = null;
  if (isMicroMessenger) {
    content = /*#__PURE__*/React.createElement(KeyframeWaveContent, {
      wave: wave,
      prefix: props === null || props === void 0 ? void 0 : props.staticPrefix
    });
  } else if (canPlayHevc) {
    content = /*#__PURE__*/React.createElement(VideoWaveContent, {
      format: "hevc",
      wave: wave,
      prefix: props === null || props === void 0 ? void 0 : props.staticPrefix
    });
  } else if (canPlayVp9) {
    content = /*#__PURE__*/React.createElement(VideoWaveContent, {
      format: "vp9",
      wave: wave,
      prefix: props === null || props === void 0 ? void 0 : props.staticPrefix
    });
  } else {
    content = /*#__PURE__*/React.createElement(KeyframeWaveContent, {
      wave: wave,
      prefix: props === null || props === void 0 ? void 0 : props.staticPrefix
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "vreo-wave",
    onClick: props === null || props === void 0 ? void 0 : props.onClick
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      paddingTop: "".concat(heightWidthRatio * 100, "%")
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0
    }
  }, content)));
}
var VideoWaveContent = function VideoWaveContent(_ref) {
  var wave = _ref.wave,
    format = _ref.format,
    _ref$prefix = _ref.prefix,
    prefix = _ref$prefix === void 0 ? defaultPrefix : _ref$prefix;
  var videoRef = useRef(null);
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    canPlay = _useState2[0],
    setCanPlay = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    errored = _useState4[0],
    setErrored = _useState4[1];
  var source = prefix + wave[format];
  useEffect(function () {
    setCanPlay(false);
  }, [source]);
  var canPlayHandler = useCallback(function () {
    if (videoRef.current) {
      videoRef.current.play();
    }
    setCanPlay(true);
  }, []);
  var errorHandler = useCallback(function () {
    setErrored(true);
  }, []);
  if (errored) {
    return /*#__PURE__*/React.createElement(KeyframeWaveContent, {
      wave: wave,
      prefix: prefix
    });
  }
  return /*#__PURE__*/React.createElement("video", {
    style: {
      opacity: canPlay ? 1 : 0
    },
    preload: "auto",
    ref: videoRef,
    width: "100%",
    height: "100%",
    playsInline: true,
    autoPlay: true,
    onCanPlay: canPlayHandler,
    onError: errorHandler,
    muted: true,
    loop: true,
    src: source
  });
};
var KeyframeWaveContent = function KeyframeWaveContent(_ref2) {
  var wave = _ref2.wave,
    _ref2$prefix = _ref2.prefix,
    prefix = _ref2$prefix === void 0 ? defaultPrefix : _ref2$prefix;
  var source = prefix + wave.png;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      backgroundImage: "url(".concat(source, ")"),
      backgroundSize: "100%",
      animationName: "vreo-wave-keyframes",
      animationTimingFunction: "steps(".concat(wave.frames - 1, ")"),
      animationDuration: "".concat(wave.frames / 25, "s"),
      animationIterationCount: 'infinite'
    }
  });
};
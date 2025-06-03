"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoPanel = InfoPanel;
var React = _interopRequireWildcard(require("react"));
var _VreoUnit = require("../../../../typings/VreoUnit");
var _hooks = require("../../../hooks");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
var isWX = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
var isIOS = navigator.userAgent.toLowerCase().indexOf('iphone') !== -1;
var isIOSorWX = isIOS || isWX;
var _videoElement = document.createElement('video');
_videoElement.setAttribute('playsinline', 'true');
_videoElement.setAttribute('webkit-playsinline', 'true');
if (isIOSorWX) {
  if (_videoElement.paused) {
    _videoElement.addEventListener('click', function () {
      return _videoElement.play();
    }, {
      once: true
    });
  }
}
function InfoPanelImg(_ref) {
  var url = _ref.url,
    children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel"
  }, children, /*#__PURE__*/React.createElement("img", {
    src: url
  })));
}
function InfoPanelVideo(_ref2) {
  var url = _ref2.url,
    children = _ref2.children;
  var videoWrapperRef = React.useRef(null);
  var controller = (0, _hooks.useController)();
  React.useEffect(function () {
    var _controller$configs, _controller$configs$v;
    // if (!isIOSorWX) return
    var video = ((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : (_controller$configs$v = _controller$configs.videos) === null || _controller$configs$v === void 0 ? void 0 : _controller$configs$v.videoPanel) || _videoElement;
    if (!videoWrapperRef.current) return;
    video.src = url;
    if (!videoWrapperRef.current.contains(video)) {
      videoWrapperRef.current.appendChild(video);
    }
    var canplaythrough = function canplaythrough() {
      video.removeEventListener('canplaythrough', canplaythrough);
      try {
        video.play();
      } catch (error) {}
    };
    video.addEventListener('canplaythrough', canplaythrough);
    video.load();
    // video.play()

    return function () {
      var _videoWrapperRef$curr;
      video.pause();
      if ((_videoWrapperRef$curr = videoWrapperRef.current) !== null && _videoWrapperRef$curr !== void 0 && _videoWrapperRef$curr.contains(video)) {
        videoWrapperRef.current.removeChild(video);
      }
    };
  }, [videoWrapperRef.current]);
  return /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel"
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-inner",
    ref: videoWrapperRef
  })));
}
var Title = function Title(props) {
  if (!props.title && !props.subTitle) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-t1"
  }, props.title), /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-t2"
  }, props.subTitle)));
};
function InfoPanel() {
  var timeoutRef = React.useRef();
  var controller = (0, _hooks.useController)();
  React.useEffect(function () {
    var _controller$configs2;
    if (((_controller$configs2 = controller.configs) === null || _controller$configs2 === void 0 ? void 0 : _controller$configs2.keyframeMap.InfoPanel) === false) {
      return;
    }
    var callback = function callback(keyframe) {
      var start = keyframe.start,
        end = keyframe.end,
        data = keyframe.data;
      var infoPanelData = data;
      var title = infoPanelData.title,
        subTitle = infoPanelData.subTitle,
        style = infoPanelData.style;
      do {
        if (style === _VreoUnit.InfoPanelStyleEnum.PopUp) {
          if (infoPanelData.type === _VreoUnit.InfoPanelTypeEnum.Image) {
            controller.openPopUp(/*#__PURE__*/React.createElement(InfoPanelImg, {
              url: infoPanelData.url
            }, /*#__PURE__*/React.createElement(Title, {
              title: title,
              subTitle: subTitle
            })));
          } else if (infoPanelData.type === _VreoUnit.InfoPanelTypeEnum.Video) {
            controller.openPopUp(/*#__PURE__*/React.createElement(InfoPanelVideo, {
              url: infoPanelData.url
            }, /*#__PURE__*/React.createElement(Title, {
              title: title,
              subTitle: subTitle
            })));
          }
          break;
        }
        if (infoPanelData.type === _VreoUnit.InfoPanelTypeEnum.Image) {
          controller.openDrawer({
            content: /*#__PURE__*/React.createElement(InfoPanelImg, {
              url: infoPanelData.url
            }, /*#__PURE__*/React.createElement(Title, {
              title: title,
              subTitle: subTitle
            })),
            height: '60vh'
          });
        } else if (infoPanelData.type === _VreoUnit.InfoPanelTypeEnum.Video) {
          controller.openDrawer({
            content: /*#__PURE__*/React.createElement(InfoPanelVideo, {
              url: infoPanelData.url
            }, /*#__PURE__*/React.createElement(Title, {
              title: title,
              subTitle: subTitle
            })),
            height: '60vh'
          });
        }
      } while (false);
      timeoutRef.current = setTimeout(function () {
        controller.openDrawer(false);
        controller.openPopUp(false);
      }, end - start);
    };
    controller.on(_VreoUnit.VreoKeyframeEnum.InfoPanel, callback);
    controller.on('ended', function () {
      controller.openPopUp(false);
    });
    controller.on('paused', function () {
      controller.openPopUp(false);
    });
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.InfoPanel, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
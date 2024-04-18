"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoPanel = InfoPanel;
var React = _interopRequireWildcard(require("react"));
var _VreoUnit = require("../../../../typings/VreoUnit");
var _hooks = require("../../../hooks");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
            controller.openPopUp( /*#__PURE__*/React.createElement(InfoPanelImg, {
              url: infoPanelData.url
            }, /*#__PURE__*/React.createElement(Title, {
              title: title,
              subTitle: subTitle
            })));
          } else if (infoPanelData.type === _VreoUnit.InfoPanelTypeEnum.Video) {
            controller.openPopUp( /*#__PURE__*/React.createElement(InfoPanelVideo, {
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
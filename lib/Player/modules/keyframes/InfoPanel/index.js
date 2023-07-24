"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoPanel = InfoPanel;
exports.isWX = void 0;
var React = _interopRequireWildcard(require("react"));
var _VreoUnit = require("../../../../typings/VreoUnit");
var _hooks = require("../../../hooks");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var isWX = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
exports.isWX = isWX;
var videoElement = document.createElement('video');
if (isWX) {
  videoElement.playsInline = true;
  videoElement.classList.add('vreo-infoPanelVideo');
  document.body.addEventListener('click', function () {
    return videoElement.play();
  }, {
    once: true
  });
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
  React.useEffect(function () {
    if (!isWX) return;
    if (!videoWrapperRef.current) return;
    videoElement.src = url;
    if (!videoWrapperRef.current.contains(videoElement)) {
      videoWrapperRef.current.appendChild(videoElement);
    }
    videoElement.play();
  }, [videoWrapperRef.current]);
  return /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel"
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "vreo-infoPanel-inner",
    ref: videoWrapperRef
  }, !isWX && /*#__PURE__*/React.createElement("video", {
    playsInline: true,
    autoPlay: true,
    src: url
  }))));
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
    var _controller$configs;
    if (((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.keyframeMap.InfoPanel) === false) {
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
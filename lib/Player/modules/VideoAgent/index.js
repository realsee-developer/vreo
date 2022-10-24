"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgent = VideoAgent;
var React = _interopRequireWildcard(require("react"));
var _hooks = require("../../hooks");
var _VideoAgentScene = require("./VideoAgentScene");
var _classnames = _interopRequireDefault(require("classnames"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function VideoAgent(props) {
  var _controller$avatar2;
  var ref = React.useRef(null);
  var controller = (0, _hooks.useController)();
  var showAvatar = React.useMemo(function () {
    var _controller$avatar;
    return ((_controller$avatar = controller.avatar) === null || _controller$avatar === void 0 ? void 0 : _controller$avatar.url) && controller.avatar.force === true;
  }, [controller.avatar]);
  var showVideoAgent = React.useMemo(function () {
    var _controller$videoAgen;
    if (showAvatar) return false;
    return ((_controller$videoAgen = controller.videoAgentScene) === null || _controller$videoAgen === void 0 ? void 0 : _controller$videoAgen.videoAgentMesh.mediaInstance) instanceof HTMLVideoElement;
  }, [controller.videoAgentScene]);
  React.useEffect(function () {
    if (!ref.current) throw new Error('React 渲染异常，请稍后重试 ...');
    if (controller.videoAgentScene) {
      console.warn('VideoAgentScene" 重复初始化，已被过滤');
      return;
    }
    var videoAgentScene = new _VideoAgentScene.VideoAgentScene(ref.current, props.options);
    controller.videoAgentScene = videoAgentScene;
    return function () {
      var _controller$videoAgen2;
      controller.dispose();
      (_controller$videoAgen2 = controller.videoAgentScene) === null || _controller$videoAgen2 === void 0 ? void 0 : _controller$videoAgen2.dispose();
    };
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "Avatar",
    style: {
      display: showAvatar ? 'block' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "Avatar-wrapper ratio-1-1"
  }, /*#__PURE__*/React.createElement("img", {
    className: "Avatar-img",
    src: (_controller$avatar2 = controller.avatar) === null || _controller$avatar2 === void 0 ? void 0 : _controller$avatar2.url,
    onClick: function onClick() {
      var _props$onClick;
      return (_props$onClick = props.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('VideoAgent', {
      hide: !showVideoAgent
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "VideoAgent-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "VideoAgent-wrapper ratio-16-9"
  }, /*#__PURE__*/React.createElement("div", {
    className: "VideoAgent-inner",
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    className: "VideoAgent-play",
    onClick: function onClick() {
      var _props$onClick2;
      return (_props$onClick2 = props.onClick) === null || _props$onClick2 === void 0 ? void 0 : _props$onClick2.call(props);
    }
  }))))));
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgent = VideoAgent;
var React = _interopRequireWildcard(require("react"));
var _hooks = require("../../hooks");
var _VideoAgentScene = require("./VideoAgentScene");
var _classnames = _interopRequireDefault(require("classnames"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
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
  }, [controller.videoAgentScene, showAvatar]);
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
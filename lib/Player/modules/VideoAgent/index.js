"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgent = VideoAgent;

var React = _interopRequireWildcard(require("react"));

var _hooks = require("../../hooks");

var _VideoAgentScene = require("./VideoAgentScene");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function VideoAgent(props) {
  var ref = React.useRef(null);
  var controller = (0, _hooks.useController)();
  React.useEffect(function () {
    if (!ref.current) throw new Error('React 渲染异常，请稍后重试 ...');

    if (controller.videoAgentScene) {
      console.warn('"VideoAgentScene" 重复初始化，已被过滤 ...');
      return;
    }

    var videoAgentScene = new _VideoAgentScene.VideoAgentScene(ref.current, true, props.options || {});
    controller.videoAgentScene = videoAgentScene;
    return function () {
      var _controller$videoAgen;

      controller.dispose();
      (_controller$videoAgen = controller.videoAgentScene) === null || _controller$videoAgen === void 0 ? void 0 : _controller$videoAgen.dispose();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "VideoAgent",
    onClick: function onClick() {
      if (!props.onClick) return;
      props.onClick();
    },
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    className: "VideoAgent-play"
  }));
}
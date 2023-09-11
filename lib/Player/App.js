"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = App;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _mobxReact = require("mobx-react");

var _hooks = require("./hooks");

var _CameraMovement = require("./modules/keyframes/CameraMovement");

var _ResizeObserver = require("./modules/ResizeObserver");

var _InfoPanel = require("./modules/keyframes/InfoPanel");

var _ModelVideo = require("./modules/keyframes/ModelVideo");

var _PanoEffect = require("./modules/keyframes/PanoEffect");

var _PanoTag = require("./modules/keyframes/PanoTag");

var _PanoTextLabel = require("./modules/keyframes/PanoTextLabel");

var _Prompter = require("./modules/keyframes/Prompter");

var _UpdateVRPanorama = require("./modules/keyframes/UpdateVRPanorama");

var _VideoEffect = require("./modules/keyframes/VideoEffect");

var _VideoAgent = require("./modules/VideoAgent");

var _BgMusic = require("./modules/keyframes/BgMusic");

var _Wave = require("./modules/Wave");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var AppView = (0, _mobxReact.observer)(function (_ref) {
  var _controller$configs, _controller$waveAppea, _controller$configs3, _controller$configs4;

  var controller = _ref.controller;
  return /*#__PURE__*/React.createElement("div", {
    className: (0, _classnames["default"])('vreo-panel', {
      'vreo-panel--hidden': !controller.visible
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-panel-inner"
  }, /*#__PURE__*/React.createElement(_Wave.Wave, {
    onClick: (_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.onWaveClick,
    appearance: (_controller$waveAppea = controller.waveAppearance) !== null && _controller$waveAppea !== void 0 ? _controller$waveAppea : 'single'
  }), /*#__PURE__*/React.createElement(_VideoAgent.VideoAgent, {
    onClick: function onClick() {
      var _controller$configs2;

      if ((_controller$configs2 = controller.configs) !== null && _controller$configs2 !== void 0 && _controller$configs2.onAvatarClick) {
        controller.configs.onAvatarClick();
        return;
      }

      if (controller.playing) {
        controller.setPlaying(false);
      } else {
        controller.setPlaying(true);
      }
    },
    options: ((_controller$configs3 = controller.configs) === null || _controller$configs3 === void 0 ? void 0 : _controller$configs3.videoAgentMeshOptions) || {}
  }), /*#__PURE__*/React.createElement(_Prompter.Prompter, null), (_controller$configs4 = controller.configs) === null || _controller$configs4 === void 0 ? void 0 : _controller$configs4.customPanelChildren));
});

function App() {
  var controller = (0, _hooks.useController)();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ResizeObserver.ResizeObserver, null), /*#__PURE__*/React.createElement(_CameraMovement.CameraMovement, null), /*#__PURE__*/React.createElement(_ModelVideo.ModelVideo, null), /*#__PURE__*/React.createElement(_UpdateVRPanorama.UpdateVRPanorama, null), /*#__PURE__*/React.createElement(_VideoEffect.VideoEffect, null), /*#__PURE__*/React.createElement(_PanoTag.PanoTag, null), /*#__PURE__*/React.createElement(_PanoTextLabel.PanoTextLabel, null), /*#__PURE__*/React.createElement(_InfoPanel.InfoPanel, null), /*#__PURE__*/React.createElement(_PanoEffect.PanoEffect, null), /*#__PURE__*/React.createElement(_BgMusic.BgMusic, null)), /*#__PURE__*/React.createElement(AppView, {
    controller: controller
  }));
}
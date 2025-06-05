import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useController } from "./hooks.js";
import { CameraMovement } from "./modules/keyframes/CameraMovement/index.js";
import { ResizeObserver } from "./modules/ResizeObserver/index.js";
import { InfoPanel } from "./modules/keyframes/InfoPanel/index.js";
import { ModelVideo } from "./modules/keyframes/ModelVideo/index.js";
import { PanoEffect } from "./modules/keyframes/PanoEffect/index.js";
import { PanoTag } from "./modules/keyframes/PanoTag/index.js";
import { PanoTextLabel } from "./modules/keyframes/PanoTextLabel/index.js";
import { Prompter } from "./modules/keyframes/Prompter/index.js";
import { UpdateVRPanorama } from "./modules/keyframes/UpdateVRPanorama/index.js";
import { VideoEffect } from "./modules/keyframes/VideoEffect/index.js";
import { VideoAgent } from "./modules/VideoAgent/index.js";
import { BgMusic } from "./modules/keyframes/BgMusic/index.js";
import { Wave } from "./modules/Wave/index.js";
var AppView = observer(function (_ref) {
  var _controller$configs, _controller$waveAppea, _controller$configs3, _controller$configs4;
  var controller = _ref.controller;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('vreo-panel', {
      'vreo-panel--hidden': !controller.visible
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-panel-inner"
  }, /*#__PURE__*/React.createElement(Wave, {
    onClick: (_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.onWaveClick,
    appearance: (_controller$waveAppea = controller.waveAppearance) !== null && _controller$waveAppea !== void 0 ? _controller$waveAppea : 'single',
    staticPrefix: controller.configs.waveStaticPrefix
  }), /*#__PURE__*/React.createElement(VideoAgent, {
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
  }), /*#__PURE__*/React.createElement(Prompter, null), (_controller$configs4 = controller.configs) === null || _controller$configs4 === void 0 ? void 0 : _controller$configs4.customPanelChildren));
});
export function App() {
  var controller = useController();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ResizeObserver, null), /*#__PURE__*/React.createElement(CameraMovement, null), /*#__PURE__*/React.createElement(ModelVideo, null), /*#__PURE__*/React.createElement(UpdateVRPanorama, null), /*#__PURE__*/React.createElement(VideoEffect, null), /*#__PURE__*/React.createElement(PanoTag, null), /*#__PURE__*/React.createElement(PanoTextLabel, null), /*#__PURE__*/React.createElement(InfoPanel, null), /*#__PURE__*/React.createElement(PanoEffect, null), /*#__PURE__*/React.createElement(BgMusic, null)), /*#__PURE__*/React.createElement(AppView, {
    controller: controller
  }));
}
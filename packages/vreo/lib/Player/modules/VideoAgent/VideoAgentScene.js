import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as THREE from 'three';
import { addResizeListener } from "../../../shared-utils/addResizeListener.js";
import { VideoAgentMesh } from "./VideoAgentMesh.js";
export var VideoAgentScene = /*#__PURE__*/_createClass(function VideoAgentScene(container, options) {
  var _this = this;
  _classCallCheck(this, VideoAgentScene);
  _defineProperty(this, "scene", new THREE.Scene());
  _defineProperty(this, "camera", new THREE.OrthographicCamera(-240, 240, 135, -135));
  _defineProperty(this, "renderer", new THREE.WebGLRenderer({
    alpha: true
  }));
  _defineProperty(this, "disposers", []);
  _defineProperty(this, "run", function () {
    // 视频开始 1s 不渲染：规避某些设备黑屏闪烁问题。视频前 2s 是最好是静默的。
    if (!(_this.videoAgentMesh.paused || _this.videoAgentMesh.freeze) && _this.videoAgentMesh.currentTime > 1000) {
      _this.renderer.render(_this.scene, _this.camera);
    }
    requestAnimationFrame(_this.run);
  });
  _defineProperty(this, "dispose", function () {
    var _this$videoAgentMesh;
    (_this$videoAgentMesh = _this.videoAgentMesh) === null || _this$videoAgentMesh === void 0 ? void 0 : _this$videoAgentMesh.dispose();
    _this.disposers.forEach(function (disposer) {
      return disposer === null || disposer === void 0 ? void 0 : disposer();
    });
  });
  this.videoAgentMesh = new VideoAgentMesh(480, 270, 1, 1, options);

  // const needRender = getMediaType(this.videoAgentMesh.videoUrl) === 'video'

  if (container) {
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    var domElement = this.renderer.domElement;
    domElement.classList.add('VideoAgent-canvas');
    var dispose = addResizeListener(container, function (width, height) {
      _this.renderer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);
      domElement.style.width = "".concat(width, "px");
      domElement.style.height = "".concat(height, "px");
    });
    this.disposers.push(dispose);
    container.append(domElement);
    this.scene.add(this.videoAgentMesh);
    this.run();
  }
});
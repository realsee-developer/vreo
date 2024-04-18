"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgentScene = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var THREE = _interopRequireWildcard(require("three"));
var _addResizeListener = require("../../../shared-utils/addResizeListener");
var _VideoAgentMesh = require("./VideoAgentMesh");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var VideoAgentScene = /*#__PURE__*/(0, _createClass2["default"])(function VideoAgentScene(container, options) {
  var _this = this;
  (0, _classCallCheck2["default"])(this, VideoAgentScene);
  (0, _defineProperty2["default"])(this, "scene", new THREE.Scene());
  (0, _defineProperty2["default"])(this, "camera", new THREE.OrthographicCamera(-240, 240, 135, -135));
  (0, _defineProperty2["default"])(this, "renderer", new THREE.WebGLRenderer({
    alpha: true
  }));
  (0, _defineProperty2["default"])(this, "disposers", []);
  (0, _defineProperty2["default"])(this, "run", function () {
    // 视频开始 1s 不渲染：规避某些设备黑屏闪烁问题。视频前 2s 是最好是静默的。
    if (!(_this.videoAgentMesh.paused || _this.videoAgentMesh.freeze) && _this.videoAgentMesh.currentTime > 1000) {
      _this.renderer.render(_this.scene, _this.camera);
    }
    requestAnimationFrame(_this.run);
  });
  (0, _defineProperty2["default"])(this, "dispose", function () {
    var _this$videoAgentMesh;
    (_this$videoAgentMesh = _this.videoAgentMesh) === null || _this$videoAgentMesh === void 0 ? void 0 : _this$videoAgentMesh.dispose();
    _this.disposers.forEach(function (disposer) {
      return disposer === null || disposer === void 0 ? void 0 : disposer();
    });
  });
  this.videoAgentMesh = new _VideoAgentMesh.VideoAgentMesh(480, 270, 1, 1, options);

  // const needRender = getMediaType(this.videoAgentMesh.videoUrl) === 'video'

  if (container) {
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    var domElement = this.renderer.domElement;
    domElement.classList.add('VideoAgent-canvas');
    var dispose = (0, _addResizeListener.addResizeListener)(container, function (width, height) {
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
exports.VideoAgentScene = VideoAgentScene;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgentScene = void 0;
var THREE = _interopRequireWildcard(require("three"));
var _addResizeListener = require("../../../shared-utils/addResizeListener");
var _VideoAgentMesh = require("./VideoAgentMesh");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var VideoAgentScene = /*#__PURE__*/_createClass(function VideoAgentScene(container, options) {
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
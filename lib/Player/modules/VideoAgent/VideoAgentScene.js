"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoAgentScene = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _VideoAgentMesh = require("./VideoAgentMesh");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VideoAgentScene = function VideoAgentScene(container) {
  var _this = this;

  var needRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _classCallCheck(this, VideoAgentScene);

  _defineProperty(this, "scene", new THREE.Scene());

  _defineProperty(this, "camera", new THREE.OrthographicCamera(-240, 240, 135, -135));

  _defineProperty(this, "renderer", new THREE.WebGLRenderer({
    alpha: true
  }));

  _defineProperty(this, "run", function () {
    var _this$videoAgentMesh$;

    var domElement = _this.renderer.domElement; // console.log('renderder', this.videoAgentMesh.paused, this.videoAgentMesh.freeze)
    // 视频开始 1s 不渲染：规避某些设备黑屏闪烁问题。视频前 2s 是最好是静默的。

    if (!(_this.videoAgentMesh.paused || _this.videoAgentMesh.freeze) && _this.videoAgentMesh.currentTime > 1000) {
      _this.renderer.render(_this.scene, _this.camera);
    } // 兼容非视频场景


    if (!((_this$videoAgentMesh$ = _this.videoAgentMesh.videoUrl) !== null && _this$videoAgentMesh$ !== void 0 && _this$videoAgentMesh$.endsWith('.mp4'))) {
      if (domElement.style.display !== 'none') domElement.style.display = 'none';
    } else {
      if (domElement.style.display !== 'block') domElement.style.display = 'block';
    }

    requestAnimationFrame(_this.run);
  });

  _defineProperty(this, "dispose", function () {
    var _this$videoAgentMesh;

    (_this$videoAgentMesh = _this.videoAgentMesh) === null || _this$videoAgentMesh === void 0 ? void 0 : _this$videoAgentMesh.dispose();
  });

  this.container = container;
  this.camera.position.set(0, 0, 10);
  this.camera.lookAt(0, 0, 0);
  var state = {
    width: container.offsetWidth,
    height: container.offsetHeight
  };
  var _domElement = this.renderer.domElement;

  _domElement.classList.add('VideoAgent-canvas');

  this.renderer.setSize(state.width * window.devicePixelRatio, state.height * window.devicePixelRatio);

  _domElement.setAttribute('style', "width: ".concat(state.width, "px;height: ").concat(state.height, "px;"));

  this.videoAgentMesh = new _VideoAgentMesh.VideoAgentMesh(480, 270, 1, 1, options);

  if (needRender) {
    container.append(_domElement);
    this.scene.add(this.videoAgentMesh);
    this.run();
  }
};

exports.VideoAgentScene = VideoAgentScene;
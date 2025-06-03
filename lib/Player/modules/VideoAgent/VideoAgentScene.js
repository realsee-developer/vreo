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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
var VideoAgentScene = exports.VideoAgentScene = /*#__PURE__*/(0, _createClass2["default"])(function VideoAgentScene(container, options) {
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
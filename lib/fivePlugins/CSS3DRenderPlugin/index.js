"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.CSS3DRenderPlugin = void 0;
var _three = _interopRequireWildcard(require("three"));
var THREE = _three;
var _CSS3DRenderer = require("three/examples/jsm/renderers/CSS3DRenderer");
var _evenNumber = _interopRequireDefault(require("./evenNumber"));
var _centerPoint = _interopRequireDefault(require("./centerPoint"));
var _transformPositionToVector = _interopRequireDefault(require("./transformPositionToVector3"));
var _createResizeObserver = _interopRequireDefault(require("./createResizeObserver"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
/**
 * 三维向量
 */

/**
 * **CSS3DRenderPlugin** 提供矩形区域（三维空间四个坐标点），你可以在此矩形区域中渲染 DOM 内容。
 * 实现原理参考[CSS3DRenderer](https://threejs.org/docs/index.html?q=CSS3D#examples/en/renderers/CSS3DRenderer)。
 *
 * @returns
 */
var CSS3DRenderPlugin = exports.CSS3DRenderPlugin = function CSS3DRenderPlugin(five) {
  var state = {
    disposeCallbacks: []
  };
  var create3DDomContainer = function create3DDomContainer() {
    var _five$model, _five$model2, _config$autoRender;
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }
    var points = params[0].map(function (point) {
      return point instanceof _three.Vector3 ? point : (0, _transformPositionToVector["default"])(point);
    });
    var config = params[1];
    if ((points === null || points === void 0 ? void 0 : points.length) < 4) return console.error('points must be equal or greater than than 4');
    if (!(five !== null && five !== void 0 && (_five$model = five.model) !== null && _five$model !== void 0 && _five$model.loaded)) return console.error('five.model.loaded is: ', five === null || five === void 0 ? void 0 : (_five$model2 = five.model) === null || _five$model2 === void 0 ? void 0 : _five$model2.loaded);
    var fiveElement = five.getElement();
    if (!fiveElement) return console.error('five.getElement() is ' + fiveElement);
    var disposers = [];
    var ratio = (config === null || config === void 0 ? void 0 : config.ratio) || 0.00216;
    if (ratio <= 0.00215) console.warn('if you need click css3DElement on safari, ratio must be greater than 0.00215');
    var dpr = (config === null || config === void 0 ? void 0 : config.dpr) || 1;
    var mode = (config === null || config === void 0 ? void 0 : config.mode) || 'front';
    var autoRender = (_config$autoRender = config === null || config === void 0 ? void 0 : config.autoRender) !== null && _config$autoRender !== void 0 ? _config$autoRender : true;
    var behindFiveContainer = (config === null || config === void 0 ? void 0 : config.behindFiveContainer) || fiveElement.parentElement || document.body;
    var container = (config === null || config === void 0 ? void 0 : config.container) || document.createElement('div');
    container.classList.add('__Dnalogel-plugin--CSS3DRenderPlugin');

    // 获取css3DObject, 如果mode为behind的话，一起获取mesh
    var _createObject = createObject(points, {
        ratio: ratio,
        dpr: dpr,
        container: container,
        mode: mode
      }),
      css3DObject = _createObject.css3DObject,
      mesh = _createObject.mesh;

    // ======= INIT START =======
    var resizeObserver;
    var frontModeUnInited = mode === 'front' && !state.frontMode;
    var behindModeUnInited = mode === 'behind' && !state.behindMode;
    var inited = !(frontModeUnInited || behindModeUnInited);
    var stopRenderFlag = false;
    var requestAnimationFrameId = null;
    if (behindModeUnInited) {
      state.behindMode = {
        scene: new _three.Scene(),
        css3DRenderer: new _CSS3DRenderer.CSS3DRenderer()
      };
    }
    if (frontModeUnInited) {
      state.frontMode = {
        scene: new _three.Scene(),
        css3DRenderer: new _CSS3DRenderer.CSS3DRenderer()
      };
    }
    var _ref = mode === 'behind' ? state.behindMode : state.frontMode,
      scene = _ref.scene,
      css3DRenderer = _ref.css3DRenderer;
    var render = function () {
      if (!inited) {
        var css3DRendererSetSize = function css3DRendererSetSize() {
          // 这里evenNumber策略是遇到奇数会加1，不知道为啥会触发滚动条显示，导致fiveElement变小，fiveElement变小又触发了这里的resize，宽高变小，滚动条消失，然后又触发resize。。。无限循环
          // 为了规避上面这种情况，evenNumber设置了一个参数，遇到奇数可选择减一
          var rendererWidth = (0, _evenNumber["default"])(fiveElement.clientWidth, {
            smaller: true
          });
          var rendererHeight = (0, _evenNumber["default"])(fiveElement.clientHeight, {
            smaller: true
          });
          css3DRenderer.setSize(rendererWidth, rendererHeight);
        };
        css3DRendererSetSize();
        resizeObserver = (0, _createResizeObserver["default"])(css3DRendererSetSize, fiveElement);
        css3DRenderer.domElement.style.position = 'absolute';
        css3DRenderer.domElement.style.top = '0';
        css3DRenderer.domElement.style.userSelect = 'none';
        css3DRenderer.domElement.style.pointerEvents = 'none';
        var renderEveryFrame = function renderEveryFrame() {
          if (stopRenderFlag) return;
          requestAnimationFrameId = requestAnimationFrame(renderEveryFrame);
          css3DRenderer.render(scene, five.camera);
        };
        return function () {
          var _resizeObserver, _resizeObserver$obser;
          scene.add(css3DObject);
          (_resizeObserver = resizeObserver) === null || _resizeObserver === void 0 ? void 0 : (_resizeObserver$obser = _resizeObserver.observe) === null || _resizeObserver$obser === void 0 ? void 0 : _resizeObserver$obser.call(_resizeObserver);
          renderEveryFrame();
          if (mode === 'behind' && mesh) {
            five.scene.add(mesh);
            disposers.push(function () {
              return mesh && five.scene.remove(mesh);
            });
          }
        };
      } else {
        return function () {
          scene.add(css3DObject);
        };
      }
    }();
    if (frontModeUnInited) {
      var wrapper = fiveElement.parentElement || document.body;
      wrapper.appendChild(css3DRenderer.domElement);
    }
    if (behindModeUnInited) {
      var _wrapper = behindFiveContainer;
      _wrapper.appendChild(css3DRenderer.domElement);
    }
    // ======= INIT END =======

    var dispose = function dispose() {
      stopRenderFlag = true;
      disposers.forEach(function (d) {
        return d === null || d === void 0 ? void 0 : d();
      });
      scene.remove(css3DObject);
      if (typeof requestAnimationFrameId === 'number') cancelAnimationFrame(requestAnimationFrameId);
      if (scene.children.length === 0) {
        css3DRenderer.domElement.remove();
        if (mode === 'front') state.frontMode = undefined;
        if (mode === 'behind') state.behindMode = undefined;
        if (!state.behindMode && !state.frontMode) {
          var _resizeObserver2, _resizeObserver2$unob;
          (_resizeObserver2 = resizeObserver) === null || _resizeObserver2 === void 0 ? void 0 : (_resizeObserver2$unob = _resizeObserver2.unobserve) === null || _resizeObserver2$unob === void 0 ? void 0 : _resizeObserver2$unob.call(_resizeObserver2);
        }
      }
      return true;
    };
    var idx = state.disposeCallbacks.findIndex(function (item) {
      return item === dispose;
    });
    if (idx !== -1) {
      state.disposeCallbacks.splice(idx, 1);
    } else {
      state.disposeCallbacks.push(dispose);
    }
    if (autoRender) render();
    return {
      container: container,
      dispose: dispose,
      css3DObject: css3DObject,
      render: autoRender ? undefined : render
    };
  };
  var createObject = function createObject(points, config) {
    var ratio = config.ratio,
      dpr = config.dpr,
      element = config.container,
      mode = config.mode;
    var planeWidth = points[0].distanceTo(points[1]);
    var planeHeight = points[1].distanceTo(points[2]);
    var domWidthPx = (0, _evenNumber["default"])(planeWidth / ratio * dpr);
    var domHeightPx = (0, _evenNumber["default"])(planeHeight / ratio * dpr);
    var css3DObject = new _CSS3DRenderer.CSS3DObject(element);
    css3DObject.scale.set(ratio, ratio, ratio);
    element.style.width = domWidthPx + 'px';
    element.style.height = domHeightPx + 'px';
    element.style.pointerEvents = 'none';
    var centerPosition = (0, _centerPoint["default"])(points[0], points[2]);
    var vector01 = points[1].clone().sub(points[0]); // 点0 -> 点1 的向量
    var vector12 = points[2].clone().sub(points[1]); // 点1 -> 点2 的向量

    // 旋转
    var rotateXAngle = new _three.Vector3(0, 1, 0).angleTo(new _three.Vector3(0, vector12.y, vector12.z));
    var rotateYAngle = new _three.Vector3(1, 0, 0).angleTo(new _three.Vector3(vector01.x, 0, vector01.z));
    var rotateZAngle = vector01.angleTo(new _three.Vector3(vector01.x, 0, vector01.z));
    /**
     * [0,1,0] => [0,0,1]  为rolate Worldx正方向
     * [0,0,1] => [0,1,0]  为rolate Worldy正方向
     * [0,1,1] => [-1,0,0] 为rolate Worldz正方向
     */
    var rotateX = (vector12.z > 0 ? -1 : 1) * rotateXAngle;
    var rotateY = (vector01.z < 0 ? 1 : -1) * rotateYAngle;
    var rotateZ = (vector01.x > 0 && vector01.y < 0 || vector01.x < 0 && vector01.y > 0 ? -1 : 1) * rotateZAngle;
    css3DObject.rotateOnWorldAxis(new _three.Vector3(1, 0, 0), rotateX); // x
    css3DObject.rotateOnWorldAxis(new _three.Vector3(0, 1, 0), rotateY); // y
    css3DObject.rotateOnWorldAxis(new _three.Vector3(0, 0, 1), rotateZ); // z

    css3DObject.position.set(centerPosition.x, centerPosition.y, centerPosition.z);
    var mesh;
    if (mode === 'behind') {
      var material = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: false,
        side: THREE.DoubleSide
      });
      var geometry = new THREE.PlaneGeometry(domWidthPx, domHeightPx);
      mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'CSS3DRenderPlugin-mesh';
      mesh.position.copy(css3DObject.position);
      mesh.rotation.copy(css3DObject.rotation);
      mesh.scale.copy(css3DObject.scale);
    }
    return {
      css3DObject: css3DObject,
      mesh: mesh
    };
  };
  return {
    create3DDomContainer: create3DDomContainer,
    disposeAll: function disposeAll() {
      state.disposeCallbacks.forEach(function (d) {
        return d === null || d === void 0 ? void 0 : d();
      });
      state.disposeCallbacks = [];
    }
  };
};
var _default = exports["default"] = CSS3DRenderPlugin;
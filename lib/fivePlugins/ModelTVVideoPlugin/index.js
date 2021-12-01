"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelTVVideoPlugin = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ModelTVVideoPlugin = function ModelTVVideoPlugin(five, _ref) {
  var videoElement = _ref.videoElement;
  var state = {
    videoMeshes: [],
    videoTextureEnabled: false,
    videoSource: '',
    rectPoints: [],
    enabled: false,
    videoElement: videoElement
  };

  var setMuted = function setMuted(muted) {
    if (state.videoTexture) {
      state.videoTexture.image.muted = muted;
      state.videoTexture.image.play();
    }
  };

  var getMuted = function getMuted() {
    if (state.videoTexture) return state.videoTexture.image.muted;else return true;
  };

  var enable = function enable() {
    if (state.enabled) return;
    if (!state.videoTexture) return;
    state.enabled = true;
    state.videoMeshes = createPanoVideoMeshes();
    state.videoMeshes.forEach(function (mesh) {
      return five.scene.add(mesh);
    });

    var play = function play() {
      if (!state.videoTexture) return;

      var timeupdate = function timeupdate() {
        var _state$videoTexture;

        if (!state.videoTexture) return;
        (_state$videoTexture = state.videoTexture) === null || _state$videoTexture === void 0 ? void 0 : _state$videoTexture.image.removeEventListener('timeupdate', timeupdate);
        state.videoTextureEnabled = true;
        state.videoMeshes.forEach(function (mesh) {
          if (mesh.material.map !== state.videoTexture) mesh.material.map = state.videoTexture;
        });
        five.needsRender = true;
      };

      state.videoTexture.image.addEventListener('timeupdate', timeupdate);

      if (state.videoTexture && state.videoMeshes.length) {
        state.videoTexture.image.play();
      }
    };

    if (five.model.loaded) play();else {
      return five.once('modelLoaded', function () {
        return play();
      });
    }
  };

  var disable = function disable() {
    if (!state.enabled) return;
    state.enabled = false;
    state.videoMeshes.forEach(function (mesh) {
      mesh.geometry.dispose();
      mesh.material.dispose();
      five.scene.remove(mesh);
      if (state.videoTexture) state.videoTexture.image.pause();
    });
    state.videoMeshes = [];
    five.needsRender = true;
  };

  var createPanoVideoMeshes = function createPanoVideoMeshes() {
    return state.rectPoints.map(function (points, index) {
      var geometry = new THREE.BufferGeometry();
      var segments = 128;
      var verticesArray = [];
      verticesArray.push(points[0].x, points[0].y, points[0].z);

      for (var i = 1; i < segments; i++) {
        verticesArray.push(points[0].x + (points[1].x - points[0].x) * i / segments, points[0].y + (points[1].y - points[0].y) * i / segments, points[0].z + (points[1].z - points[0].z) * i / segments);
      }

      verticesArray.push(points[1].x, points[1].y, points[1].z);
      verticesArray.push(points[2].x, points[2].y, points[2].z);

      for (var _i = 1; _i < segments; _i++) {
        verticesArray.push(points[2].x + (points[3].x - points[2].x) * _i / segments, points[2].y + (points[3].y - points[2].y) * _i / segments, points[2].z + (points[3].z - points[2].z) * _i / segments);
      }

      verticesArray.push(points[3].x, points[3].y, points[3].z);
      var uvArray = [];
      uvArray.push(0, 1);

      for (var _i2 = 1; _i2 < segments; _i2++) {
        uvArray.push(0, 1 - _i2 / segments);
      }

      uvArray.push(0, 0);
      uvArray.push(1, 0);

      for (var _i3 = 1; _i3 < segments; _i3++) {
        uvArray.push(1, _i3 / segments);
      }

      uvArray.push(1, 1);
      var indicesArray = [];

      for (var _i4 = 0; _i4 < segments; _i4++) {
        indicesArray.push(_i4, _i4 + 1, segments * 2 - _i4, _i4, segments * 2 - _i4, segments * 2 + 1 - _i4);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verticesArray), 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvArray), 2));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indicesArray), 1));
      var material = new THREE.MeshBasicMaterial({
        map: state.videoTextureEnabled ? state.videoTexture : state.imageTexture,
        side: THREE.DoubleSide
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 1;
      mesh.name = "video-".concat(index, "-").concat(performance.now());
      return mesh;
    });
  };

  var getImageTexture = function getImageTexture(source) {
    var texture = new THREE.TextureLoader().load(source);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    return texture;
  };

  var getVideoTexture = function getVideoTexture(source, video) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var url = window.URL || window.webkitURL;
            video = video || document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.src = url.createObjectURL(xhr.response);
            var texture = new THREE.VideoTexture(video);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            resolve(Object.assign(texture, {
              videoSource: source
            }));
          } else {
            reject(new Error('Video download Error: ' + xhr.status));
          }
        }
      };

      xhr.onerror = function (error) {
        return reject(error);
      };

      xhr.open('GET', source);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  var load = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, videoElement) {
      var video_src, video_poster_src, points;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              video_src = data.video_src, video_poster_src = data.video_poster_src, points = data.points;
              state.videoSource = video_src;
              state.rectPoints = points.map(function (items) {
                return items.map(function (_ref3) {
                  var x = _ref3.x,
                      y = _ref3.y,
                      z = _ref3.z;
                  return new THREE.Vector3(x, y, z);
                });
              });
              state.imageTexture = getImageTexture(video_poster_src);

              if (videoElement) {
                state.videoElement = videoElement;
              }

              _context.next = 7;
              return getVideoTexture(state.videoSource, state.videoElement);

            case 7:
              state.videoTexture = _context.sent;
              state.enabled = !!data.enable;
              if (state.enabled) enable();

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function load(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  five.on('modeChange', function () {
    return setMuted(true);
  });
  five.on('wantsTapGesture', function (raycaster) {
    if (!state.enabled) return;

    var _raycaster$intersectO = raycaster.intersectObjects(five.scene.children, true),
        _raycaster$intersectO2 = _slicedToArray(_raycaster$intersectO, 1),
        intersect = _raycaster$intersectO2[0];

    if (!!intersect && /^video/.test(intersect.object.name)) {
      if (state.videoTexture) setMuted(!state.videoTexture.image.muted);
      return false;
    }
  });
  five.on('panoArrived', function () {
    if (!state.enabled) return;
    if (getMuted()) return;
    var cameraPosition = five.camera.position;
    var visible = state.rectPoints.find(function (points) {
      var centerVector = points.reduce(function (total, curr) {
        return new THREE.Vector3(total.x + curr.x / points.length, total.y + curr.y / points.length, total.z + curr.z / points.length);
      }, new THREE.Vector3());
      return points.map(function (point) {
        return new THREE.Vector3((point.x + centerVector.x) / 2, (point.y + centerVector.y) / 2, (point.z + centerVector.z) / 2);
      }).filter(function (vector) {
        vector = vector.clone().sub(cameraPosition).normalize();
        var raycaster = new THREE.Raycaster(cameraPosition, vector);

        var _raycaster$intersectO3 = raycaster.intersectObjects(five.scene.children, true),
            _raycaster$intersectO4 = _slicedToArray(_raycaster$intersectO3, 1),
            intersect = _raycaster$intersectO4[0];

        return !!intersect && /^video/.test(intersect.object.name);
      }).length >= 2;
    });
    if (!visible) setMuted(true);
  });
  five.on('renderFrame', function () {
    state.videoMeshes.forEach(function (meshes) {
      if (meshes) //@ts-ignore
        meshes.needsRender = true;
    });
  });
  five.on('load', function (input) {
    if (input.modelTVVideoData) {
      load(input.modelTVVideoData);
    }
  });
  return {
    enable: enable,
    disable: disable,
    load: load
  };
};

exports.ModelTVVideoPlugin = ModelTVVideoPlugin;
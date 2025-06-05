import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as React from 'react';
import * as THREE from 'three';
import { useController, useFiveInstance } from "../../../hooks.js";
import { ModelTVVideoPlugin } from "../../../../fivePlugins/ModelTVVideoPlugin/index.js";
import { createTransMatrix } from "../../../../shared-utils/createTransMatrix.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
export function ModelVideo() {
  var controller = useController();
  var five = useFiveInstance();
  var ref = React.useRef();
  var timeoutRef = React.useRef();
  React.useEffect(function () {
    var callback = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(keyframe) {
        var _controller$configs, _controller$configs$v;
        var start, end, _ref2, videoSrc, videoPosterSrc, vertexs, matrixWorld, position, points;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!ref.current) {
                  ref.current = ModelTVVideoPlugin(five, {});
                }
                start = keyframe.start, end = keyframe.end;
                _ref2 = keyframe.data, videoSrc = _ref2.videoSrc, videoPosterSrc = _ref2.videoPosterSrc, vertexs = _ref2.vertexs, matrixWorld = _ref2.matrixWorld;
                position = function () {
                  if (vertexs.length < 4) {
                    throw new Error('ModelVideo: 顶点数据集合不够，无法组成矩形 ....');
                  }
                  if (vertexs.length === 4) {
                    return vertexs;
                  }
                  var box = new THREE.Box3();
                  vertexs.forEach(function (v) {
                    return box.expandByPoint(new THREE.Vector3(v.x, v.y, v.z));
                  });
                  return [new THREE.Vector3(box.min.x, box.max.y, box.max.z), new THREE.Vector3(box.min.x, box.min.y, box.max.z), new THREE.Vector3(box.max.x, box.min.y, box.max.z), new THREE.Vector3(box.max.x, box.max.y, box.max.z)];
                }();
                points = function () {
                  if (matrixWorld) {
                    var transMatrix = createTransMatrix(matrixWorld);
                    return [position.map(function (p) {
                      var res = transMatrix([p.x, p.y, p.z]);
                      return {
                        x: res[0],
                        y: res[1],
                        z: res[2]
                      };
                    })];
                  }
                  return [position];
                }();
                ref.current.disable();
                _context.next = 8;
                return ref.current.load({
                  video_src: videoSrc,
                  video_poster_src: videoPosterSrc,
                  points: points
                }, (_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : (_controller$configs$v = _controller$configs.videos) === null || _controller$configs$v === void 0 ? void 0 : _controller$configs$v.modelTVVideo);
              case 8:
                ref.current.enable();
                timeoutRef.current = setTimeout(function () {
                  var _ref$current;
                  return (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.disable();
                }, end - start);
              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function callback(_x) {
        return _ref.apply(this, arguments);
      };
    }();
    controller.on(VreoKeyframeEnum.ModelVideo, callback);
    return function () {
      controller.off(VreoKeyframeEnum.ModelVideo, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
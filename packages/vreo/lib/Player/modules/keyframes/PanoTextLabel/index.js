import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import { Vector3, Quaternion } from 'three';
import { useController, useFiveInstance } from "../../../hooks.js";
import { CSS3DRenderPlugin } from "../../../../fivePlugins/CSS3DRenderPlugin/index.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
/**
 * 通过传入中心点确定矩形框架容器的四个点：
 *  1. 已知矩形长宽和中心点
 *  2. 借助planeGeometry生成垂直相机视角的平面上的四个点
 *  3. 通过向量相加，平行四边形法则获取到移动position后的面上四个点
 */
var calcPoints = function calcPoints(centerPoint, normal, wrapperLength, wrapperWidth) {
  // 375px 对应 1m
  var length = wrapperLength / 375;
  var width = wrapperWidth / 375;
  var geometry = new THREE.PlaneGeometry(length, width);
  if (normal) {
    var lookPoint = new THREE.Vector3(normal.x + centerPoint.x, normal.y + centerPoint.y, normal.z + centerPoint.z);
    geometry.lookAt(lookPoint);
  }
  // const pointgeometry = new THREE.Geometry()
  // pointgeometry.vertices.push(cameraPosition)
  // const pointmaterial = new THREE.PointsMaterial({
  //   color: 0xffffff,
  //   size: 0.4,
  // })
  // _point = new THREE.Points(pointgeometry, pointmaterial)
  // console.log(cameraPosition)

  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(geometry, material);
  var v0 = centerPoint.clone();
  plane.position.copy(v0);

  // 计算传入的四个点的坐标
  var _plane$geometry$verti = _slicedToArray(plane.geometry.vertices, 4),
    v1 = _plane$geometry$verti[0],
    v2 = _plane$geometry$verti[1],
    v3 = _plane$geometry$verti[2],
    v4 = _plane$geometry$verti[3];
  var downLeft = v0.clone().add(v4);
  var downRight = v0.clone().add(v3);
  var upLeft = v0.clone().add(v2);
  var upRight = v0.clone().add(v1);

  // 插件使用要求：矩形四个点位数据，顺序为**必须**为左下、右下、右上、左上
  return [downLeft, downRight, upRight, upLeft];
};

/**
 * 空间文本标签。
 */
export function PanoTextLabel() {
  var timeoutRef = React.useRef();
  var controller = useController();
  var five = useFiveInstance();
  var ref = React.useRef();
  React.useEffect(function () {
    var _controller$configs;
    if (((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.keyframeMap.PanoTextLabel) === false) {
      return;
    }
    var callback = function callback(keyframe) {
      var _panoTextLabelData$no, _panoTextLabelData$no2, _panoTextLabelData$no3;
      var start = keyframe.start,
        end = keyframe.end,
        data = keyframe.data;
      var panoTextLabelData = data;
      // 增加无文本情况的判断
      if (data.text === '') return;
      var _panoTextLabelData$ve = panoTextLabelData.vertex,
        x = _panoTextLabelData$ve.x,
        y = _panoTextLabelData$ve.y,
        z = _panoTextLabelData$ve.z;
      var centerPoint = new Vector3(x, y, z);
      var normal = new Vector3((_panoTextLabelData$no = panoTextLabelData.normal) === null || _panoTextLabelData$no === void 0 ? void 0 : _panoTextLabelData$no.x, (_panoTextLabelData$no2 = panoTextLabelData.normal) === null || _panoTextLabelData$no2 === void 0 ? void 0 : _panoTextLabelData$no2.y, (_panoTextLabelData$no3 = panoTextLabelData.normal) === null || _panoTextLabelData$no3 === void 0 ? void 0 : _panoTextLabelData$no3.z);
      // 生成传入的四个点，将文本框最大宽度定在200px，最高高度在30px
      var wrapperLength = 200;
      var wrapperWidth = 30;
      var points = calcPoints(centerPoint, panoTextLabelData.normal && normal, wrapperLength, wrapperWidth);
      if (!ref.current) ref.current = CSS3DRenderPlugin(five);
      var container = ref.current.create3DDomContainer(points);
      var css3DObject = container === null || container === void 0 ? void 0 : container.css3DObject;
      // 将获取的mesh进行旋转操作，根据欧拉角去进行mesh的变换
      if (data.quaternion) {
        var quaternion = new Quaternion(data.quaternion.x, data.quaternion.y, data.quaternion.z, data.quaternion.w);
        css3DObject === null || css3DObject === void 0 ? void 0 : css3DObject.quaternion.copy(quaternion);
      }
      if (container !== null && container !== void 0 && container.container) {
        var root = createRoot(container.container);
        root.render( /*#__PURE__*/React.createElement("div", {
          className: "PanoTextLabel PanoTextLabel--notHidden"
        }, /*#__PURE__*/React.createElement("div", {
          className: "PanoTextLabel-wrapper"
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: "".concat(data.fontSize || 16, "px")
          },
          className: "PanoText-innerText"
        }, data.text || ''))));
      }
      timeoutRef.current = setTimeout(function () {
        var _ref$current;
        (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.disposeAll();
      }, end - start);
    };
    controller.on(VreoKeyframeEnum.PanoTextLabel, callback);
    return function () {
      controller.off(VreoKeyframeEnum.PanoTextLabel, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
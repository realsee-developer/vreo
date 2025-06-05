import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Raycaster, Vector3 } from 'three';
import { tweenProgress } from "../../../shared-utils/animationFrame/BetterTween.js";
import { CSS3DRenderPlugin } from "../../../fivePlugins/CSS3DRenderPlugin/index.js";
import { VreoKeyframeEnum } from "../../../typings/VreoUnit.js";
// const getSphere = (position: Vector3, color = 0xffff00) => {
//   const geometry = new SphereGeometry(0.05, 32, 16)
//   const material = new MeshBasicMaterial({ color })
//   const sphere = new Mesh(geometry, material)
//   sphere.position.copy(position)
//   return sphere
// }

var searchV1 = function searchV1(_ref) {
  var five = _ref.five,
    dom = _ref.dom;
  var cameraDirection = new Vector3();
  five.camera.getWorldDirection(cameraDirection);
  var cameraPosition = five.camera.position;
  var _five$model$intersect = five.model.intersectRaycaster(new Raycaster(cameraPosition, cameraDirection)),
    _five$model$intersect2 = _slicedToArray(_five$model$intersect, 1),
    intersect = _five$model$intersect2[0];
  var point = five.project2d(intersect.point);
  var widescreen = window.innerWidth > 560 ? true : false;
  // const width = dom!.clientWidth
  var height = dom.clientHeight;
  dom.style.left = point.x + 'px';
  dom.style.top = point.y - height / 2 + 'px';
  var rect = dom.getBoundingClientRect();
  var left = rect.left,
    top = rect.top,
    bottom = rect.bottom,
    right = rect.right;
  var leftBottom = new Vector3(left, bottom);
  var leftTop = new Vector3(left, top);
  var rightTop = new Vector3(right, top);
  var rightBottom = new Vector3(right, bottom);
  var points = [leftBottom, rightBottom, rightTop, leftTop].map(function (point) {
    point.setX(point.x / window.innerWidth * 2 - (widescreen ? 1.25 : 1.75));
    point.setY(-(point.y / window.innerHeight) * 2 + (widescreen ? 1.35 : 1.125));
    point.setZ(0.5);
    return point.unproject(five.camera).addScaledVector(cameraDirection, 0.2);
  });

  // __debug__
  // const colors = [0xdc143c, 0xffff00, 0x0000ff, 0x008000]
  // points.forEach((p, index) => five.scene.add(getSphere(p, colors[index])))

  // 判断是手机 150
  var ratio = leftBottom.distanceTo(rightBottom) / (widescreen ? 150 : 120);
  return {
    points: points,
    ratio: ratio
  };
};

/**
 * 空间场景面板
 * @returns
 */
export function SpatialScenePanel(props) {
  var timeoutRef = React.useRef(null);
  var ref = React.useRef(null);
  var panelRef = React.useRef(null);
  var rendererRef = React.useRef(CSS3DRenderPlugin(props.five));
  React.useEffect(function () {
    if (!ref.current) {
      return;
    }
    var callback = function callback(keyframe) {
      if (keyframe.data.customType !== 'SpatialScenePanel') {
        return;
      }
      var data = keyframe.data;

      // const data = mockData
      var _searchV = searchV1({
          five: props.five,
          dom: ref.current
        }),
        points = _searchV.points,
        ratio = _searchV.ratio;
      var _ref2 = rendererRef.current.create3DDomContainer(points, {
          ratio: ratio,
          autoRender: false
        }) || {},
        container = _ref2.container,
        dispose = _ref2.dispose,
        css3DObject = _ref2.css3DObject,
        render = _ref2.render;
      Object.assign(window, {
        $css3DObject: css3DObject
      });
      if (!container) return;
      ReactDOM.render( /*#__PURE__*/React.createElement(Panel, {
        ref: function ref(_ref3) {
          return panelRef.current = _ref3;
        },
        data: data
      }), container);
      var startRotateY = -(Math.PI * 2) / 9;
      var lastRotateY = 0;
      tweenProgress(1000).onUpdate(function (_ref4) {
        var progress = _ref4.progress;
        var needRotateY = Math.PI / 90 * 11 * progress;
        var rotateY = needRotateY - lastRotateY;
        css3DObject === null || css3DObject === void 0 ? void 0 : css3DObject.rotateY(rotateY);
        // css3DObject?.rotateZ
        lastRotateY = needRotateY;
      }).onStart(function () {
        css3DObject === null || css3DObject === void 0 ? void 0 : css3DObject.rotateY(startRotateY);
        render();
      }).onDispose(function () {
        var _panelRef$current;
        (_panelRef$current = panelRef.current) === null || _panelRef$current === void 0 ? void 0 : _panelRef$current.classList.add('show');
      }).play();

      // Object.assign(window, {  $dispose: () => {
      //   panelRef.current?.classList.add('hide')
      //   setTimeout(() => dispose?.(), 1500)
      // } })

      var start = keyframe.start,
        end = keyframe.end;
      timeoutRef.current = setTimeout(function () {
        var _panelRef$current2;
        (_panelRef$current2 = panelRef.current) === null || _panelRef$current2 === void 0 ? void 0 : _panelRef$current2.classList.add('hide');
        timeoutRef.current = setTimeout(function () {
          dispose === null || dispose === void 0 ? void 0 : dispose();
          timeoutRef.current = null;
        }, 1500);
      }, end - start);
    };
    Object.assign(window, {
      $callback: callback
    });

    // setTimeout(() => {callback()}, 8000)
    props.subscribe.on(VreoKeyframeEnum.Custom, callback);
    return function () {
      props.subscribe.off(VreoKeyframeEnum.Custom, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "vreo-SpatialScenePanel",
    ref: ref
  });
}

/** 背景动画：控制延迟 */
function SpatialScenePanelBg() {
  var ref = React.useRef(null);
  var timeoutRef = React.useRef(null);
  React.useEffect(function () {
    if (!ref.current) return;
    var listener = function listener() {
      var _ref$current;
      (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.setAttribute('class', 'SpatialScenePanel-bg');
      timeoutRef.current = setTimeout(function () {
        var _ref$current2;
        (_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.setAttribute('class', 'SpatialScenePanel-bg SpatialScenePanel-bg--animation');
        timeoutRef.current = null;
      }, 3000);
    };
    ref.current.addEventListener('animationend', listener);
    return function () {
      if (ref.current) ref.current.removeEventListener('animationend', listener);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "SpatialScenePanel-bg SpatialScenePanel-bg--animation"
  });
}
var Panel = /*#__PURE__*/React.forwardRef(function (props, myRef) {
  var _props$data, _props$data2, _props$data3, _props$data3$stateLis;
  return /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel",
    ref: myRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel-show-area"
  }, /*#__PURE__*/React.createElement(SpatialScenePanelBg, null), /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel-title"
  }, (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.title), /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel-temperature"
  }, (_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.temperature, "\u2103")), /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel-body"
  }, (_props$data3 = props.data) === null || _props$data3 === void 0 ? void 0 : (_props$data3$stateLis = _props$data3.stateList) === null || _props$data3$stateLis === void 0 ? void 0 : _props$data3$stateLis.map(function (state, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: "scene-".concat(state.text),
      className: "SpatialScenePanel-item index_".concat(index)
    }, /*#__PURE__*/React.createElement("img", {
      className: "SpatialScenePanel-icon",
      src: state.icon,
      alt: "".concat(state.text)
    }), /*#__PURE__*/React.createElement("div", {
      className: "SpatialScenePanel-text"
    }, state.text), /*#__PURE__*/React.createElement("div", {
      className: "SpatialScenePanel-dot"
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "SpatialScenePanel-disappear-area"
  }));
});

// export function SpatialScenePanel() {
//   // const data = mockData

//   return (
//     <div className="SpatialScenePanel" >
//     <div className="SpatialScenePanel-show-area">
//       <SpatialScenePanelBg />
//       <div className="SpatialScenePanel-header">
//         <div className="SpatialScenePanel-title">{data?.title}</div>
//         <div className="SpatialScenePanel-temperature">{data?.temperature}℃</div>
//       </div>
//       <div className="SpatialScenePanel-body">
//         {data?.stateList?.map((state, index) => (
//           <div key={`scene-${state.text}`} className={`SpatialScenePanel-item index_${index}`}>
//             <img className="SpatialScenePanel-icon" src={state.icon}></img>
//             <div className="SpatialScenePanel-text">{state.text}</div>
//             <div className="SpatialScenePanel-dot"></div>
//           </div>
//         ))}
//       </div>
//     </div>

//     <div className="SpatialScenePanel-disappear-area"></div>
//   </div>
//   )
// }
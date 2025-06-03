import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import { Vector3 } from 'three';
import classNames from 'classnames';
import lineAnime from "./lineAnime.js";
import { useController, useFiveInstance, useFiveProject2d } from "../../../hooks.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
export function PanoEffect() {
  var _React$useState = React.useState(null),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    state = _React$useState2[0],
    setState = _React$useState2[1];
  var five = useFiveInstance();
  var lineRef = React.useRef(null);
  var _React$useState3 = React.useState(null),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    pos = _React$useState4[0],
    setPos = _React$useState4[1];
  var timeoutRef = React.useRef();
  var controller = useController();
  var project2d = useFiveProject2d();
  var delLine = function delLine() {
    if (lineRef.current) {
      lineRef.current.dispose();
    }
  };
  React.useEffect(function () {
    var callback = function callback(keyframe) {
      var start = keyframe.start,
        end = keyframe.end,
        data = keyframe.data;
      var videoEffectData = data;
      var _videoEffectData$twoV = _slicedToArray(videoEffectData.twoVertexs, 2),
        v1 = _videoEffectData$twoV[0],
        v2 = _videoEffectData$twoV[1];
      var p1 = new Vector3(v1.x, v1.y, v1.z);
      var p2 = new Vector3(v2.x, v2.y, v2.z);
      lineRef.current = lineAnime(five, p1.clone(), p2.clone());
      lineRef.current.play();
      var center = p1.lerp(p2, 0.5);
      var distance = p1.distanceTo(p2);
      var p = project2d(center);
      if (!p) return;
      var left = p.x,
        top = p.y;
      setState({
        center: center,
        distance: distance
      });
      setPos({
        left: left,
        top: top
      });
      timeoutRef.current = setTimeout(function () {
        setState(null);
        setPos(null);
        delLine();
      }, end - start);
    };
    controller.on(VreoKeyframeEnum.PanoEffect, callback);
    return function () {
      controller.off(VreoKeyframeEnum.PanoEffect, callback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      delLine();
    };
  }, [controller]);
  React.useEffect(function () {
    var callback = function callback() {
      if (!(state !== null && state !== void 0 && state.center)) return;
      var _state$center = state.center,
        x = _state$center.x,
        y = _state$center.y,
        z = _state$center.z;
      var res = project2d(new Vector3(x, y, z));
      if (!res) return;
      var left = res.x,
        top = res.y;
      setPos({
        left: left,
        top: top
      });
    };
    five.on('currentStateChange', callback);
    return function () {
      five.off('currentStateChange', callback);
    };
  }, [state === null || state === void 0 ? void 0 : state.center]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classNames('PanoEffect', {
      'PanoEffect--notHidden': state
    }),
    style: {
      left: ((pos === null || pos === void 0 ? void 0 : pos.left) || 0) + 'px',
      top: ((pos === null || pos === void 0 ? void 0 : pos.top) || 0) + 'px'
    }
  }, (state === null || state === void 0 ? void 0 : state.distance.toFixed(4)) + 'm'));
}
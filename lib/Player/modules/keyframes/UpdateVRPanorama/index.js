import * as React from 'react';
import { parseWork } from '@realsee/five';
import { useController, useFiveInstance } from "../../../hooks.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
export function UpdateVRPanorama() {
  var controller = useController();
  var five = useFiveInstance();
  var deafultWorkRef = React.useRef(null);
  var updateWorkRef = React.useRef(null);

  // 恢复默认 VR
  var restoreCallback = React.useCallback(function () {
    // 先清理掉 之前的 VR 数据备份
    updateWorkRef.current = null;
    if (deafultWorkRef.current) {
      var work = parseWork(deafultWorkRef.current);
      five.load(work);
    }
  }, []);

  // 暂停时： 恢复默认 VR 
  var pausedCallback = React.useCallback(function () {
    if (deafultWorkRef.current) {
      var work = parseWork(deafultWorkRef.current);
      Object.assign(window, {
        $rawWork: work
      });
      five.load(work);
    }
  }, []);

  // 播放时：如果暂停前有更新 VR 需要还原
  var playingCallback = React.useCallback(function () {
    if (!updateWorkRef.current) {
      return;
    }
    five.load(updateWorkRef.current);
  }, []);
  React.useEffect(function () {
    var callback = function callback(keyframe) {
      var _five$work, _five$work$raw, _five$work2, _five$work2$raw, _five$work2$raw$works;
      if (!deafultWorkRef.current && (_five$work = five.work) !== null && _five$work !== void 0 && (_five$work$raw = _five$work.raw) !== null && _five$work$raw !== void 0 && _five$work$raw.works) {
        deafultWorkRef.current = five.work.raw.works;
      }
      var data = keyframe.data;

      // 如果数据中有新 work 数据，则直接载入
      if (data.work) {
        updateWorkRef.current = parseWork(data.work);
        five.load(updateWorkRef.current);
        return;
      }
      var lastRawWork = (_five$work2 = five.work) === null || _five$work2 === void 0 ? void 0 : (_five$work2$raw = _five$work2.raw) === null || _five$work2$raw === void 0 ? void 0 : (_five$work2$raw$works = _five$work2$raw.works) === null || _five$work2$raw$works === void 0 ? void 0 : _five$work2$raw$works[0];
      if (!lastRawWork) {
        console.warn('UpdateVRPanorama: 没有可用的 work 数据');
        return;
      }

      // 动态场景：不提供完成的签名数据，需重新整理
      if (data.dynamic_scene && !data.panorama) {
        var lastWork = JSON.parse(lastRawWork);
        var panorama = lastWork.panorama;
        var index = data.dynamic_scene.images.index;
        panorama.list[index] = data.dynamic_scene.images;
        data.panorama = panorama;
        delete data.dynamic_scene;
      }
      Object.assign(window, {
        $work1: JSON.parse(lastRawWork),
        $work2: data,
        parseWork: parseWork
      });
      updateWorkRef.current = parseWork([lastRawWork, data]);
      five.load(updateWorkRef.current);
    };
    controller.on(VreoKeyframeEnum.UpdateVRPanorama, callback);

    // 离开 将之前的内容清空
    controller.on(VreoKeyframeEnum.Exit, restoreCallback);

    // 新载入数据 将之前的内容清空
    controller.on('loaded', restoreCallback);

    // 暂停 回到默认状态
    controller.on('paused', pausedCallback);
    // 播放 回归暂停前状态
    controller.on('playing', playingCallback);
    return function () {
      // 清理事件监听
      controller.off(VreoKeyframeEnum.UpdateVRPanorama, callback);
      controller.off(VreoKeyframeEnum.Exit, restoreCallback);
      controller.off('loaded', restoreCallback);
      controller.off('paused', pausedCallback);
      controller.off('playing', playingCallback);
    };
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
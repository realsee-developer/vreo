"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateVRPanorama = UpdateVRPanorama;

var React = _interopRequireWildcard(require("react"));

var _five = require("@realsee/five");

var _hooks = require("../../../hooks");

var _VreoUnit = require("../../../../typings/VreoUnit");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function UpdateVRPanorama() {
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();
  var deafultWorkRef = React.useRef(null);
  var updateWorkRef = React.useRef(null); // 恢复默认 VR

  var restoreCallback = React.useCallback(function () {
    // 先清理掉 之前的 VR 数据备份
    updateWorkRef.current = null;

    if (deafultWorkRef.current) {
      var work = (0, _five.parseWork)(deafultWorkRef.current);
      five.load(work);
    }
  }, []); // 暂停时： 恢复默认 VR 

  var pausedCallback = React.useCallback(function () {
    if (deafultWorkRef.current) {
      var work = (0, _five.parseWork)(deafultWorkRef.current);
      Object.assign(window, {
        $rawWork: work
      });
      five.load(work);
    }
  }, []); // 播放时：如果暂停前有更新 VR 需要还原

  var playingCallback = React.useCallback(function () {
    if (!updateWorkRef.current) {
      return;
    }

    five.load(updateWorkRef.current);
  }, []);
  React.useEffect(function () {
    var callback = function callback(keyframe) {
      var _five$work;

      if (!deafultWorkRef.current) {
        deafultWorkRef.current = five.work.raw.works;
      }

      var data = keyframe.data; // 如果数据中有新 work 数据，则直接载入

      if (data.work) {
        updateWorkRef.current = (0, _five.parseWork)(data.work);
        five.load(updateWorkRef.current);
        return;
      }

      var lastRawWork = (_five$work = five.work) === null || _five$work === void 0 ? void 0 : _five$work.raw.works[0]; // 动态场景：不提供完成的签名数据，需重新整理

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
        parseWork: _five.parseWork
      });
      updateWorkRef.current = (0, _five.parseWork)([lastRawWork, data]);
      five.load(updateWorkRef.current);
    };

    controller.on(_VreoUnit.VreoKeyframeEnum.UpdateVRPanorama, callback); // 离开 将之前的内容清空

    controller.on(_VreoUnit.VreoKeyframeEnum.Exit, restoreCallback); // 新载入数据 将之前的内容清空

    controller.on('loaded', restoreCallback); // 暂停 回到默认状态

    controller.on('paused', pausedCallback); // 播放 回归暂停前状态

    controller.on('playing', playingCallback);
    return function () {
      // 清理事件监听
      controller.off(_VreoUnit.VreoKeyframeEnum.UpdateVRPanorama, callback);
      controller.off(_VreoUnit.VreoKeyframeEnum.Exit, restoreCallback);
      controller.off('loaded', restoreCallback);
      controller.off('paused', pausedCallback);
      controller.off('playing', playingCallback);
    };
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
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
  React.useEffect(function () {
    var callback = function callback(keyframe) {
      var _five$work;

      var _ref = keyframe.data,
          panoIndex = _ref.panoIndex,
          images = _ref.images;
      var newWorkJSON = JSON.parse(JSON.stringify((_five$work = five.work) === null || _five$work === void 0 ? void 0 : _five$work.raw.work)); // // 原Work数据不能被修改

      if (newWorkJSON.panorama && newWorkJSON.panorama.list && newWorkJSON.panorama.list[panoIndex]) {
        Object.assign(newWorkJSON.panorama.list[panoIndex], images);
      } else if (newWorkJSON.observers && newWorkJSON.observers[panoIndex] && newWorkJSON.observers[panoIndex].images) {
        Object.assign(newWorkJSON.observers[panoIndex].images, images);
      }

      var newWork = (0, _five.parseWork)(newWorkJSON); // // 需要还原么？待定 ...

      five.load(newWork);
    };

    controller.on(_VreoUnit.VreoKeyframeEnum.UpdateVRPanorama, callback);
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.UpdateVRPanorama, callback);
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
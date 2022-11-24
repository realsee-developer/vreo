"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VreoKeyframeEnum = exports.PanoTagStyleEnum = exports.PanoTagEnum = exports.PanoEffectEnum = exports.InfoPanelTypeEnum = exports.InfoPanelStyleEnum = void 0;
var VreoKeyframeEnum;
/**
 * 支持自定义剧本关键帧配置项
 */
exports.VreoKeyframeEnum = VreoKeyframeEnum;
(function (VreoKeyframeEnum) {
  VreoKeyframeEnum["CameraMovement"] = "CameraMovement";
  VreoKeyframeEnum["PanoTag"] = "PanoTag";
  VreoKeyframeEnum["PanoTextLabel"] = "PanoTextLabel";
  VreoKeyframeEnum["Prompter"] = "Prompter";
  VreoKeyframeEnum["UpdateVRPanorama"] = "UpdateVRPanorama";
  VreoKeyframeEnum["ModelVideo"] = "ModelVideo";
  VreoKeyframeEnum["PanoEffect"] = "PanoEffect";
  VreoKeyframeEnum["InfoPanel"] = "InfoPanel";
  VreoKeyframeEnum["VideoEffect"] = "VideoEffect";
  VreoKeyframeEnum["BgMusic"] = "BgMusic";
  VreoKeyframeEnum["Exit"] = "Exit";
  VreoKeyframeEnum["Custom"] = "Custom";
})(VreoKeyframeEnum || (exports.VreoKeyframeEnum = VreoKeyframeEnum = {}));
/**
 * 全景标签枚举
 */
var PanoTagEnum;
/**
 * 标签样式种类
 */
exports.PanoTagEnum = PanoTagEnum;
(function (PanoTagEnum) {
  PanoTagEnum["Text"] = "Text";
  PanoTagEnum["Image"] = "Image";
})(PanoTagEnum || (exports.PanoTagEnum = PanoTagEnum = {}));
var PanoTagStyleEnum;
exports.PanoTagStyleEnum = PanoTagStyleEnum;
(function (PanoTagStyleEnum) {
  PanoTagStyleEnum["Growth"] = "Growth";
  PanoTagStyleEnum["Expand"] = "Expand";
})(PanoTagStyleEnum || (exports.PanoTagStyleEnum = PanoTagStyleEnum = {}));
/**
 * 全景特效枚举
 */
var PanoEffectEnum;
/**
 * 全景特效
 */
exports.PanoEffectEnum = PanoEffectEnum;
(function (PanoEffectEnum) {
  PanoEffectEnum["Distance"] = "Distance";
})(PanoEffectEnum || (exports.PanoEffectEnum = PanoEffectEnum = {}));
/**
 * 信息面板类型枚举
 */
var InfoPanelTypeEnum;
exports.InfoPanelTypeEnum = InfoPanelTypeEnum;
(function (InfoPanelTypeEnum) {
  InfoPanelTypeEnum["Image"] = "Image";
  InfoPanelTypeEnum["Video"] = "Video";
})(InfoPanelTypeEnum || (exports.InfoPanelTypeEnum = InfoPanelTypeEnum = {}));
var InfoPanelStyleEnum;
/**
 * 信息面板
 */
exports.InfoPanelStyleEnum = InfoPanelStyleEnum;
(function (InfoPanelStyleEnum) {
  InfoPanelStyleEnum["Drawer"] = "Drawer";
  InfoPanelStyleEnum["PopUp"] = "PopUp";
})(InfoPanelStyleEnum || (exports.InfoPanelStyleEnum = InfoPanelStyleEnum = {}));
export var VreoKeyframeEnum;

/**
 * 支持自定义剧本关键帧配置项
 */
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
})(VreoKeyframeEnum || (VreoKeyframeEnum = {}));
/**
 * 全景标签枚举
 */
export var PanoTagEnum;

/**
 * 标签样式种类
 */
(function (PanoTagEnum) {
  PanoTagEnum["Text"] = "Text";
  PanoTagEnum["Image"] = "Image";
})(PanoTagEnum || (PanoTagEnum = {}));
export var PanoTagStyleEnum;
(function (PanoTagStyleEnum) {
  PanoTagStyleEnum["Growth"] = "Growth";
  PanoTagStyleEnum["Expand"] = "Expand";
})(PanoTagStyleEnum || (PanoTagStyleEnum = {}));
/**
 * 全景特效枚举
 */
export var PanoEffectEnum;

/**
 * 全景特效
 */
(function (PanoEffectEnum) {
  PanoEffectEnum["Distance"] = "Distance";
})(PanoEffectEnum || (PanoEffectEnum = {}));
/**
 * 信息面板类型枚举
 */
export var InfoPanelTypeEnum;
(function (InfoPanelTypeEnum) {
  InfoPanelTypeEnum["Image"] = "Image";
  InfoPanelTypeEnum["Video"] = "Video";
})(InfoPanelTypeEnum || (InfoPanelTypeEnum = {}));
export var InfoPanelStyleEnum;

/**
 * 信息面板
 */
(function (InfoPanelStyleEnum) {
  InfoPanelStyleEnum["Drawer"] = "Drawer";
  InfoPanelStyleEnum["PopUp"] = "PopUp";
})(InfoPanelStyleEnum || (InfoPanelStyleEnum = {}));
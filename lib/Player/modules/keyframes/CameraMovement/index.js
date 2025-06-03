"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraMovement = CameraMovement;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var React = _interopRequireWildcard(require("react"));
var _CameraMovementPlugin = require("../../../../fivePlugins/CameraMovementPlugin");
var _typings = require("../../../../fivePlugins/CameraMovementPlugin/typings");
var _VreoUnit = require("../../../../typings/VreoUnit");
var _hooks = require("../../../hooks");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
/**
 * @fileoverview 相机运动关键帧组件
 * 
 * 处理 VR 场景中的相机运动动画，包括：
 * - 相机旋转动画
 * - 相机移动动画（含点位切换）
 * - 智能动画类型识别
 */

/**
 * 相机运动组件
 * 
 * 这个组件负责处理播放过程中的相机运动关键帧。
 * 根据关键帧数据自动选择合适的动画类型：
 * - 显式指定的旋转/移动效果
 * - 基于点位切换的智能判断
 * - 默认的旋转动画
 * 
 * @component
 * @example
 * ```tsx
 * // 在播放器中自动使用，无需手动调用
 * <CameraMovement />
 * ```
 */
function CameraMovement() {
  var controller = (0, _hooks.useController)();
  var five = (0, _hooks.useFiveInstance)();

  // 缓存相机运动插件实例，避免重复创建
  var ref = React.useRef();
  React.useEffect(function () {
    /**
     * 相机运动关键帧处理函数
     * 
     * 这是相机运动的核心逻辑，根据关键帧数据智能选择动画类型：
     * 1. 优先使用显式指定的效果类型
     * 2. 如果涉及点位切换，则执行移动动画
     * 3. 默认执行旋转动画
     */
    var callback = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(keyframe) {
        var start, end, data, cameraMovementData, effect, duration;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 延迟初始化插件实例，避免不必要的创建
                if (!ref.current) {
                  ref.current = (0, _CameraMovementPlugin.CameraMovementPlugin)(five, {});
                }
                start = keyframe.start, end = keyframe.end, data = keyframe.data;
                cameraMovementData = data;
                effect = cameraMovementData.effect; // 计算动画持续时间（毫秒）
                duration = end - start; // 情况1：显式指定旋转效果
                if (!(effect === _typings.CameraMovementEffect.Rotate)) {
                  _context.next = 10;
                  break;
                }
                _context.next = 8;
                return ref.current.rotate(data, duration);
              case 8:
                _context.next = 22;
                break;
              case 10:
                if (!(effect === _typings.CameraMovementEffect.Move)) {
                  _context.next = 15;
                  break;
                }
                _context.next = 13;
                return ref.current.move(data, duration);
              case 13:
                _context.next = 22;
                break;
              case 15:
                if (!(cameraMovementData.panoIndex !== undefined && cameraMovementData.panoIndex !== five.panoIndex)) {
                  _context.next = 20;
                  break;
                }
                _context.next = 18;
                return ref.current.move(data, duration);
              case 18:
                _context.next = 22;
                break;
              case 20:
                _context.next = 22;
                return ref.current.rotate(data, duration);
              case 22:
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

    // 注册相机运动关键帧监听器
    controller.on(_VreoUnit.VreoKeyframeEnum.CameraMovement, callback);

    // 清理函数：组件卸载时移除事件监听器
    return function () {
      controller.off(_VreoUnit.VreoKeyframeEnum.CameraMovement, callback);
    };
  }, [controller]);

  // 这是一个无渲染组件，仅处理逻辑
  return /*#__PURE__*/React.createElement(React.Fragment, null);
}
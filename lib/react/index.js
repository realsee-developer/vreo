"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VreoProvider = void 0;
exports.useVreoAction = useVreoAction;
exports.useVreoEventCallback = useVreoEventCallback;
exports.useVreoPausedState = useVreoPausedState;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("@realsee/five/react");
var React = _interopRequireWildcard(require("react"));
var _Player = require("../Player");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
var VreoContext = /*#__PURE__*/React.createContext(null);

/**
 * VreoProvider 组件的属性接口
 */

/**
 * Vreo 播放器 Provider 组件
 * 
 * 为子组件提供 Vreo 播放器实例的 React Context Provider。
 * 必须在 Five Provider 内部使用。
 * 
 * @param props - 组件属性
 * @returns React.FC 组件
 * 
 * @example
 * ```tsx
 * <FiveProvider>
 *   <VreoProvider configs={{ autoPreload: true }}>
 *     <YourComponent />
 *   </VreoProvider>
 * </FiveProvider>
 * ```
 */
var VreoProvider = exports.VreoProvider = function VreoProvider(props) {
  var five = (0, _react.unsafe__useFiveInstance)();
  var _React$useState = React.useState(null),
    _React$useState2 = (0, _slicedToArray2["default"])(_React$useState, 2),
    player = _React$useState2[0],
    setPlayer = _React$useState2[1];
  var playerRef = React.useRef(null);
  React.useEffect(function () {
    playerRef.current = new _Player.Player(five, props.configs || {});
    setPlayer(playerRef.current);
    return function () {
      var _playerRef$current;
      (_playerRef$current = playerRef.current) === null || _playerRef$current === void 0 ? void 0 : _playerRef$current.dispose();
    };
  }, []);
  if (!player) return /*#__PURE__*/React.createElement(React.Fragment, null);
  return /*#__PURE__*/React.createElement(VreoContext.Provider, {
    value: player
  }, props.children);
};

/**
 * 获取 Vreo 播放器实例
 * 
 * 从 React Context 中获取当前的 Vreo 播放器实例。
 * 必须在 VreoProvider 内部使用。
 * 
 * @returns Player 播放器实例
 * @throws 如果未找到 VreoProvider 则抛出错误
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const player = useVreoInstance()
 *   
 *   const handleLoad = () => {
 *     player.load(vreoUnit)
 *   }
 *   
 *   return <button onClick={handleLoad}>Load Script</button>
 * }
 * ```
 */
function useVreoInstance() {
  var context = React.useContext(VreoContext);
  if (!context) {
    throw new Error('VreoProvider never found.');
  }
  return context;
}

/**
 * VreoPlayer 命令集合。
 */

/**
 * 获取 Vreo 播放器操作函数集合
 * 
 * 返回一组经过优化的播放器操作函数，这些函数已经绑定了当前播放器实例。
 * 使用 useCallback 进行性能优化，避免不必要的重新渲染。
 * 
 * @returns VreoActionCallbacks 操作函数集合
 * 
 * @example
 * ```tsx
 * function PlayerControls() {
 *   const { load, play, pause, show, hide, dispose } = useVreoAction()
 *   
 *   const handleLoadScript = async () => {
 *     await load(vreoUnit, 0)
 *     play()
 *   }
 *   
 *   return (
 *     <div>
 *       <button onClick={handleLoadScript}>加载并播放</button>
 *       <button onClick={pause}>暂停</button>
 *       <button onClick={() => show()}>显示</button>
 *       <button onClick={() => hide()}>隐藏</button>
 *     </div>
 *   )
 * }
 * ```
 */
function useVreoAction() {
  var player = useVreoInstance();
  var load = React.useCallback(function (vreoUnit, currentTime) {
    return player.load(vreoUnit, currentTime);
  }, [player]);
  var play = React.useCallback(function (currentTime) {
    return player.play(currentTime || 0);
  }, [player]);
  var pause = React.useCallback(function () {
    return player.pause();
  }, [player]);
  var show = React.useCallback(function () {
    return player.show();
  }, [player]);
  var hide = React.useCallback(function () {
    return player.hide();
  }, [player]);
  var dispose = React.useCallback(function () {
    return player.dispose();
  }, [player]);
  return {
    load: load,
    pause: pause,
    show: show,
    play: play,
    hide: hide,
    dispose: dispose
  };
}

/**
 * 监听 Vreo 播放器事件
 * 
 * 用于注册和清理 Vreo 播放器事件监听器的 React Hook。
 * 当组件卸载或依赖项变化时自动清理事件监听器。
 * 
 * @param name - 事件名称
 * @param callback - 事件回调函数
 * @param deps - 依赖项数组（可选）
 * 
 * @example
 * ```tsx
 * function EventListener() {
 *   const [keyframes, setKeyframes] = React.useState([])
 *   
 *   // 监听关键帧事件
 *   useVreoEventCallback('CameraMovement', (keyframe) => {
 *     console.log('相机运镜:', keyframe)
 *   })
 *   
 *   // 监听播放状态变化
 *   useVreoEventCallback('playing', () => {
 *     console.log('开始播放')
 *   }, [])
 *   
 *   return <div>事件监听组件</div>
 * }
 * ```
 */
function useVreoEventCallback(name, callback, deps) {
  var player = useVreoInstance();
  var dependencyList = [player, name];
  if (deps !== undefined) {
    dependencyList = dependencyList.concat(deps);
  }
  React.useEffect(function () {
    // @ts-ignore
    player.on(name, callback);
    return function () {
      // @ts-ignore
      player.off(name, callback);
    };
  }, dependencyList);
}

/**
 * 获取播放器暂停状态
 * 
 * 返回当前播放器的暂停状态，并自动响应播放状态变化。
 * 当播放器开始播放或暂停时，状态会自动更新。
 * 
 * @returns boolean 是否处于暂停状态
 * 
 * @example
 * ```tsx
 * function PlayButton() {
 *   const isPaused = useVreoPausedState()
 *   const { play, pause } = useVreoAction()
 *   
 *   const handleToggle = () => {
 *     if (isPaused) {
 *       play()
 *     } else {
 *       pause()
 *     }
 *   }
 *   
 *   return (
 *     <button onClick={handleToggle}>
 *       {isPaused ? '播放' : '暂停'}
 *     </button>
 *   )
 * }
 * ```
 */
function useVreoPausedState() {
  var player = useVreoInstance();
  var _React$useState3 = React.useState(player.paused),
    _React$useState4 = (0, _slicedToArray2["default"])(_React$useState3, 2),
    state = _React$useState4[0],
    setState = _React$useState4[1];
  useVreoEventCallback('paused', function () {
    return setState(true);
  });
  useVreoEventCallback('playing', function () {
    return setState(false);
  });
  return state;
}
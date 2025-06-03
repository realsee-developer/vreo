import { unsafe__useFiveInstance } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '../Player'
import { PlayerConfigs } from '../Player/typings'
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'

const VreoContext = React.createContext<Player | null>(null)

/**
 * VreoProvider 组件的属性接口
 */
export interface VreoProviderProps {
  /** 播放器配置选项 */
  configs?: Partial<PlayerConfigs>
  /** 子组件 */
  children?: React.ReactNode
} 

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
export const VreoProvider: React.FC<VreoProviderProps> = (props ) => {
  const five = unsafe__useFiveInstance()

  const [player, setPlayer] = React.useState<Player | null>(null)
  const playerRef = React.useRef<Player | null>(null)

  React.useEffect(() => {
    playerRef.current = new Player(five, props.configs || {})
    setPlayer(playerRef.current)

    return () => {
      playerRef.current?.dispose()
    }
  }, [])

  if (!player) return <></>

  return <VreoContext.Provider value={player}>{props.children}</VreoContext.Provider>
}

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
  const context = React.useContext(VreoContext)
  if (!context) {
    throw new Error('VreoProvider never found.')
  }

  return context
}

/**
 * VreoPlayer 命令集合。
 */
export interface VreoActionCallbacks {
  /**
   * 载入剧本数据。
   * @param vreoUnit 剧本数据
   * @param currentTime 开始时间戳
   * @param preload 是否开启预载
   * @param force 是否强制载入
   */
  load: (vreoUnit: VreoUnit, currentTime?: number, preload?: boolean, force?: boolean) => Promise<boolean>
  /**
   * 播放。
   */
  play: (currentTime?: number) => void
  /**
   * 暂停。
   */
  pause: () => void
  /**
   * 显示 UI 面板。
   */
  show: () => void
  /**
   * 隐藏 UI 面板。
   */
  hide: () => void
  /**
   * 销毁数据及部分定时任务。
   */
  dispose: () => void
}

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
export function useVreoAction() {
  const player = useVreoInstance()

  const load = React.useCallback(
    (vreoUnit: VreoUnit, currentTime?: number) => player.load(vreoUnit, currentTime),
    [player]
  )

  const play = React.useCallback((currentTime?: number) => player.play(currentTime || 0), [player])
  const pause = React.useCallback(() => player.pause(), [player])
  const show = React.useCallback(() => player.show(), [player])
  const hide = React.useCallback(() => player.hide(), [player])
  const dispose = React.useCallback(() => player.dispose(), [player])

  return { load, pause, show, play, hide, dispose }
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
export function useVreoEventCallback<T extends keyof VreoKeyframeEvent>(
  name: T,
  callback: VreoKeyframeEvent[T],
  deps?: React.DependencyList | undefined
) {
  const player = useVreoInstance()
  let dependencyList: React.DependencyList = [player, name]
  if (deps !== undefined) {
    dependencyList = dependencyList.concat(deps)
  }
  React.useEffect(() => {
    // @ts-ignore
    player.on(name, callback)
    return () => {
      // @ts-ignore
      player.off(name, callback)
    }
  }, dependencyList)
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
export function useVreoPausedState() {
  const player = useVreoInstance()
  const [state, setState] = React.useState(player.paused)

  useVreoEventCallback('paused', () => setState(true))
  useVreoEventCallback('playing', () => setState(false))

  return state
}

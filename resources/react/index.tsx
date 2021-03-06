import { unsafe__useFiveInstance } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '../Player'
import { PlayerConfigs } from '../Player/typings'
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'

const VreoContext = React.createContext<Player | null>(null)

export interface VreoProviderProps {
  configs?: Partial<PlayerConfigs>
} 

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

export function useVreoPausedState() {
  const player = useVreoInstance()
  const [state, setState] = React.useState(player.paused)

  useVreoEventCallback('paused', () => setState(true))
  useVreoEventCallback('playing', () => setState(false))

  return state
}

import { unsafe__useFiveInstance } from '@realsee/five/react'
import * as React from 'react'
import { Player } from '../Player'
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'

const VreoContext = React.createContext<Player | null>(null)

export const VreoProvider: React.FC = (props) => {
  const five = unsafe__useFiveInstance()

  const [player, setPlayer] = React.useState<Player | null>(null)
  const playerRef = React.useRef<Player | null>(null)

  React.useEffect(() => {
    playerRef.current = new Player(five)
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
   */
  load: (vreoUnit: VreoUnit, currentTime?: number) => Promise<boolean>
  /**
   * 播放。
   */
  play: () => void
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

  const play = React.useCallback(() => player.play(), [player])
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

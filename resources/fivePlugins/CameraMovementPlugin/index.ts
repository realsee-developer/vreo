import { Five, MovePanoOptions } from '@realsee/five'
import type { FivePlugin } from '@realsee/five'

import {
  CameraMovementPluginParameterType,
  CameraMovementPluginExportType,
  MoveArgs,
  MoveOpts,
  RotateArgs,
  RotateOpts,
  Rotation,
} from './typings'

const PI = Math.PI
const PI_2 = PI * 2

function progressNumber(from: number, to: number, pst: number) {
  if (from === to) return from
  return from + (to - from) * pst
}

function progressLongitude(fromLongitude: number, toLongitude: number, rotation: Rotation, progress: number): number {
  const clockwise = rotation === Rotation.Clockwise
  const delta = clockwise ? fromLongitude - toLongitude : toLongitude - fromLongitude
  const deltaMod = delta % PI_2
  const deltaMod2 = deltaMod < 0 ? deltaMod + PI_2 : deltaMod
  const deltaMod3 = clockwise ? -deltaMod2 : deltaMod2
  const progressLongitude = fromLongitude + deltaMod3 * progress
  return progressLongitude % PI_2
}

/**
 * **运镜插件** 模拟类似于电影运镜效果。
 */
export const CameraMovementPlugin: FivePlugin<CameraMovementPluginParameterType, CameraMovementPluginExportType> = (
  five: Five,
) => {

  const move = (args: Partial<MoveArgs>, duration: number, opts: MoveOpts = { preload: true }) => {
    return new Promise<boolean>(async (resolve, reject) => {

      if (opts.asyncStartCallback) {
        opts.asyncStartCallback()
      }

      if (five.panoIndex === undefined) {
        return reject(false)
      }

      if (args.mode && args.mode !== five.currentMode) {
        await five.changeMode(args.mode, args, duration)
        return resolve(true)
      }

      // 模型态不能 move
      if (args.mode === Five.Mode.Floorplan) {
        return resolve(true)
      }

      if (opts.preload && args.panoIndex !== undefined && args.panoIndex !== five.panoIndex) {
        await five.preloadPano(args.panoIndex)
      }

      opts.asyncEndCallback?.()

      if (
        args.panoIndex === undefined &&
        args.fov === undefined &&
        args.latitude === undefined &&
        args.longitude === undefined
      ) {
        return resolve(true)
      }


      const panoIndex = args.panoIndex !== undefined ? args.panoIndex : five.panoIndex

      if (panoIndex !== undefined) {
        const start = performance.now()
        await five.ready()
        const movePanoOptions: MovePanoOptions = Object.assign({}, args, {
          duration: duration - (performance.now() - start), // 移动耗时
          moveEndCallback: () => resolve(true), // 移动结束
          moveCancelCallback: () => {
            resolve(true)
          }, // 移动开始
          effect: args.transEffect || 'fly',
        })
        await five.moveToPano(
          panoIndex,
          movePanoOptions,
        )
      } else {
        reject(false)
      }
    })
  }

  const rotate = async (args: RotateArgs, duration: number, opts: RotateOpts = {}) => {
    opts.asyncStartCallback?.()

    // 先切换模型再出旋转效果
    if (args.mode && five.currentMode !== args.mode) {
      await five.changeMode(args.mode, args.mode === Five.Mode.Panorama ? {latitude: 0} : undefined)
    }

    // 全景状态下，需要点位对齐
    if (args.mode === Five.Mode.Panorama &&
      five.currentMode === Five.Mode.Panorama &&
      args.panoIndex !== undefined &&
      args.panoIndex !== five.panoIndex) {
      if (opts.preload) await five.preloadPano(args.panoIndex)
      await new Promise((resolve, reject) => {
        five.moveToPano(args.panoIndex, {
          moveEndCallback: () => resolve(true), // 移动结束
          moveCancelCallback: () => reject(false), // 移动开始
          effect: 'fade',
        })
      })
    }

    await five.ready()

    opts.asyncEndCallback?.()

    // 计算to
    const from = five.getCurrentState()
    const to = (() => {
      return args
    })()

    let timeEnd = false

    // 开始时间
    const start = performance.now()

    let animeDuration = duration

    if (args.rotation === Rotation.Loop) {
      animeDuration = args.rotateSpeed
        ? Math.ceil((Math.abs(to.longitude - from.longitude) / args.rotateSpeed) * 1000)
        : duration
      animeDuration = Math.min(duration, animeDuration)
    }

    const onFiveRenderFrame = () => {
      if (timeEnd) {
        five.off('renderFrame', onFiveRenderFrame)
        return
      }
      
      let targetState = {}
      
      if (args.rotation !== Rotation.Loop) {
        const progress = (performance.now() - start) / duration
        targetState = {
          fov: progressNumber(from.fov, to.fov, progress),
          latitude: progressNumber(from.latitude, to.latitude, progress),
          longitude: progressLongitude(from.longitude, to.longitude, args.rotation, progress)
        }
      } else {
        const progress = (performance.now() - start) / animeDuration // 可能大于1
        const times = Math.floor(progress)
        const progress2 = progress - times // 一定小于1
        const isNegative = times % 2 === 1 // 是否为反向旋转, 0: 正, 1: 反, 2: 正, 3: 反 以此类推
        const resultProgress = isNegative ? 1 - progress2 : progress2
        targetState = {
          fov: progressNumber(from.fov, to.fov, resultProgress),
          latitude: progressNumber(from.latitude, to.latitude, resultProgress),
          longitude: progressNumber(from.longitude, to.longitude, resultProgress)
        }
      }

      five.setState(targetState, true)
    }

    five.on('renderFrame', onFiveRenderFrame)

    return await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        timeEnd = true
        five.off('renderFrame', onFiveRenderFrame)
        // 总时间到了之后强制结束，同时也是 Loop 模式的结束方式
        resolve(true)
      }, duration)
    })
  }

  return {
    move,
    rotate,
  }
}

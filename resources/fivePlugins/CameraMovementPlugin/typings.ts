/* eslint-disable prettier/prettier */
import { Mode, Pose } from '@realsee/five'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CameraMovementPluginParameterType { }

export interface CameraMovementPluginExportType {
  /**
   * 运镜：移动
   * @param moveArgs
   * @param duration
   * @param opts
   */
  move(moveArgs: Partial<MoveArgs>, duration: number, opts?: MoveOpts): Promise<boolean>
  /**
   * 运镜：旋转
   * @param args
   * @param duration
   * @param opts
   */
  rotate(args: RotateArgs, duration: number, opts?: RotateOpts): Promise<boolean>
}

export enum CameraMovementEffect {
  Move = 'Move',
  Rotate = 'Rotate',
}
export enum Rotation {
  Clockwise = 'Clockwise',
  Anticlockwise = 'Anticlockwise',
  Loop = 'Loop',
}

export interface CameraMovementOptsCallback {
  asyncStartCallback?: () => void
  asyncEndCallback?: () => void
}

export type MoveArgs = {
  mode: Mode
  panoIndex: number
} & Pose

export type MoveOpts = {
  preload?: boolean
} & CameraMovementOptsCallback

export type RotateArgs = {
  mode?: Mode
  panoIndex: number
  loop: boolean
  rotateSpeed: number
  rotation: Rotation
} & Pose

export type RotateOpts = {
  preload?: boolean
} & CameraMovementOptsCallback

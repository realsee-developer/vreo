import { Mode, Pose } from '@realsee/five';
export interface CameraMovementPluginParameterType {
}
export interface CameraMovementPluginExportType {
    /**
     * 运镜：移动
     * @param moveArgs
     * @param duration
     * @param opts
     */
    move(moveArgs: Partial<MoveArgs>, duration: number, opts?: MoveOpts): Promise<boolean>;
    /**
     * 运镜：旋转
     * @param args
     * @param duration
     * @param opts
     */
    rotate(args: RotateArgs, duration: number, opts?: RotateOpts): Promise<boolean>;
}
export declare enum CameraMovementEffect {
    Move = "Move",
    Rotate = "Rotate"
}
export declare enum Rotation {
    Clockwise = "Clockwise",
    Anticlockwise = "Anticlockwise",
    Loop = "Loop"
}
export interface CameraMovementOptsCallback {
    asyncStartCallback?: () => void;
    asyncEndCallback?: () => void;
}
export declare type MoveArgs = {
    mode: Mode;
    panoIndex: number;
} & Pose;
export declare type MoveOpts = {
    preload?: boolean;
} & CameraMovementOptsCallback;
export declare type RotateArgs = {
    panoIndex: number;
    loop: boolean;
    rotateSpeed: number;
    rotation: Rotation;
} & Pose;
export declare type RotateOpts = {
    preload?: boolean;
} & CameraMovementOptsCallback;

import * as THREE from 'three';
import AudioLike from '../../../shared-utils/AduioLike';
export interface VideoAgentMeshOptions {
    /**
     * 自定义视频实例。
     */
    videoInstance?: HTMLVideoElement;
    /**
     * 自定义音频实例。
     */
    audioInstance?: HTMLAudioElement;
    /**
     * 是否开启音频预载能力。**仅对`.mp3`有效**。
     *
     * @description 开启预载能力后会通过 `Fetch/XHR` 方式将音频文件下载转成二进制 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 提供给多媒体实例。这样的好处是 **能够保障音视频播放过程中不卡顿**。 但在部分 iOS 系统中会存在兼容问题——播 25s 之后会静音（`muted` 为 `false`，但是没有声音）。
     */
    preload?: boolean;
}
/**
 * 视频经纪人MESH
 */
export declare class VideoAgentMesh extends THREE.Mesh {
    options: VideoAgentMeshOptions;
    videoUrl?: string;
    freeze: boolean;
    paused: boolean;
    audioInstance: HTMLAudioElement;
    audioLikeInstance: AudioLike;
    $removeEventListener: () => void;
    get mediaInstance(): HTMLAudioElement | HTMLVideoElement | AudioLike;
    /**
     *
     * @param width
     * @param height
     * @param widthSegments
     * @param heightSegments
     * @param options
     */
    constructor(width: number, height: number, widthSegments: number, heightSegments: number, options?: VideoAgentMeshOptions);
    private update;
    play(videoUrl?: string, currentTime?: number, duration?: number): Promise<unknown>;
    /**
     * 秒转成毫秒，保障精准度
     */
    get currentTime(): number;
    dispose(): void;
}

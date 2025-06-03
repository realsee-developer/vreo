import * as THREE from 'three';
import AudioLike from '../../../shared-utils/AudioLike';
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
    /**
     * 获取当前活动的媒体实例
     *
     * 根据当前状态返回不同类型的媒体实例：
     * - 如果没有视频URL，返回音频模拟实例 (AudioLike)
     * - 如果是音频文件，返回 HTML Audio 元素
     * - 如果是视频文件，返回 HTML Video 元素
     */
    get mediaInstance(): HTMLAudioElement | HTMLVideoElement | AudioLike;
    /**
     * 创建视频代理网格
     *
     * @param width - 网格宽度
     * @param height - 网格高度
     * @param widthSegments - 宽度分段数
     * @param heightSegments - 高度分段数
     * @param options - 配置选项
     */
    constructor(width: number, height: number, widthSegments: number, heightSegments: number, options?: VideoAgentMeshOptions);
    /**
     * 更新视频源
     *
     * 这是一个复杂的异步过程，包括：
     * 1. 检查是否需要更新
     * 2. 冻结当前播放状态
     * 3. 预加载或直接设置视频源
     * 4. 设置播放开始监听器
     *
     * @private
     */
    private update;
    /**
     * 播放媒体内容
     *
     * 支持多种播放模式：
     * 1. 仅时长播放（AudioLike模式）
     * 2. 继续播放当前视频
     * 3. 播放新的视频内容
     *
     * @param videoUrl - 视频URL，空字符串表示继续播放或仅时长模式
     * @param currentTime - 开始播放时间（秒）
     * @param duration - 播放时长（毫秒），用于AudioLike模式
     * @returns Promise<boolean> - 播放操作是否成功
     */
    play(videoUrl?: string, currentTime?: number, duration?: number): Promise<unknown>;
    /**
     * 获取当前播放时间（毫秒）
     * 将媒体元素的秒数转换为毫秒，提供更精确的时间控制
     */
    get currentTime(): number;
    /**
     * 销毁实例并清理所有资源
     *
     * 包括：
     * 1. 移除所有事件监听器
     * 2. 清理缓存的媒体实例
     * 3. 从DOM中移除元素
     */
    dispose(): void;
}

import * as THREE from 'three';
import AudioLike from '../../../shared-utils/AudioLike';
/**
 * 视频经纪人贴片的配置选项
 */
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
 * 视频经纪人贴片类
 *
 * 基于 THREE.js 的网格对象，作为 VR 视频播放的核心媒体管理组件。
 * 负责视频和音频的播放控制、时间同步、绿幕抠图渲染等功能。
 *
 * 主要特性：
 * - 支持绿幕抠图渲染（ChromaKey）
 * - 音视频同步播放管理
 * - 媒体预载优化策略
 * - 跨平台播放兼容性
 *
 * @example
 * ```typescript
 * const videoMesh = new VideoAgentMesh(1920, 1080, 32, 18, {
 *   preload: true,
 *   videoInstance: customVideoElement
 * })
 *
 * // 播放视频
 * await videoMesh.play('https://example.com/video.mp4', 0, 60)
 *
 * // 获取当前时间
 * console.log(videoMesh.currentTime)
 *
 * // 销毁资源
 * videoMesh.dispose()
 * ```
 */
export declare class VideoAgentMesh extends THREE.Mesh {
    /** 配置选项 */
    options: VideoAgentMeshOptions;
    /** 当前视频URL */
    videoUrl?: string;
    /** 是否冻结状态 */
    freeze: boolean;
    /** 是否暂停状态 */
    paused: boolean;
    /** 音频实例 */
    audioInstance: HTMLAudioElement;
    /** AudioLike 实例 */
    audioLikeInstance: AudioLike;
    /** 移除事件监听器的函数 */
    $removeEventListener: () => void;
    /**
     * 获取当前的媒体实例
     *
     * 根据媒体类型自动返回对应的播放实例：
     * - 无媒体时返回 AudioLike 实例
     * - 音频文件返回 HTMLAudioElement
     * - 视频文件返回 HTMLVideoElement
     *
     * @returns 当前活跃的媒体播放实例
     */
    get mediaInstance(): HTMLAudioElement | HTMLVideoElement | AudioLike;
    /**
     * 创建视频经纪人贴片实例
     *
     * @param width - 网格宽度
     * @param height - 网格高度
     * @param widthSegments - 宽度方向分段数
     * @param heightSegments - 高度方向分段数
     * @param options - 配置选项
     *
     * @example
     * ```typescript
     * const mesh = new VideoAgentMesh(1920, 1080, 32, 18, {
     *   preload: true,
     *   videoInstance: document.getElementById('video')
     * })
     * ```
     */
    constructor(width: number, height: number, widthSegments: number, heightSegments: number, options?: VideoAgentMeshOptions);
    /**
     * 更新媒体资源
     *
     * 内部方法，负责加载新的视频/音频资源，处理预载逻辑和着色器设置
     * @param videoUrl - 媒体文件URL
     * @private
     */
    private update;
    /**
     * 播放媒体内容
     *
     * 支持多种播放模式：
     * - 播放指定视频/音频文件
     * - 仅设置时长（无媒体文件）
     * - 继续播放当前媒体
     *
     * @param videoUrl - 媒体文件URL，默认为空字符串
     * @param currentTime - 播放起始时间（秒），默认为 0
     * @param duration - 媒体总时长（秒），可选
     * @returns Promise<boolean> 播放是否成功
     *
     * @example
     * ```typescript
     * // 播放视频文件
     * await mesh.play('video.mp4', 10, 120)
     *
     * // 仅设置时长（音频跟踪）
     * await mesh.play('', 0, 60)
     *
     * // 继续播放当前媒体
     * await mesh.play()
     * ```
     */
    play(videoUrl?: string, currentTime?: number, duration?: number): Promise<unknown>;
    /**
     * 获取当前播放时间（毫秒）
     *
     * 将媒体实例的秒级时间转换为毫秒，提供更高精度的时间控制
     * @returns 当前播放时间戳（毫秒）
     */
    get currentTime(): number;
    /**
     * 销毁视频经纪人贴片实例
     *
     * 清理所有事件监听器、DOM元素和缓存实例，释放内存资源
     *
     * @example
     * ```typescript
     * // 在组件卸载时调用
     * videoMesh.dispose()
     * ```
     */
    dispose(): void;
}

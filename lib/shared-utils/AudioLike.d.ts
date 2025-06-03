import { Subscribe } from '@realsee/five';
/**
 * 模拟 `<Audio>` 事件接口
 * @interface AudioLikeEvent
 */
export type AudioLikeEvent = {
    /** 音频开始播放事件 */
    play: () => void;
    /** 音频暂停事件 */
    pause: () => void;
    /** 音频时间更新事件 */
    timeupdate: () => void;
    /** 音频播放结束事件 */
    ended: () => void;
};
/**
 * 音频构造函数参数接口
 * @interface AudioLikeOptions
 */
export interface AudioLikeOptions {
    /** 音频持续时间（毫秒） */
    duration?: number;
}
/**
 * 模拟 `<Audio>` 功能的类
 *
 * 这个类提供了与 HTML Audio 元素相似的接口和行为，但不实际播放音频。
 * 主要用于模拟音频播放的时间控制和事件触发机制。
 *
 * @class AudioLike
 * @extends {Subscribe<AudioLikeEvent>}
 *
 * @example
 * ```typescript
 * const audioLike = new AudioLike({ duration: 5000 });
 * audioLike.addEventListener('play', () => console.log('开始播放'));
 * audioLike.addEventListener('ended', () => console.log('播放结束'));
 * audioLike.play();
 * ```
 */
export declare class AudioLike extends Subscribe<AudioLikeEvent> {
    /**
     * 播放开始时的时间戳（毫秒）
     * @private
     */
    private $timestamp;
    /**
     * 当前播放时间（毫秒）
     * @private
     */
    private $currentTime;
    /**
     * 音频总时长（毫秒）
     * @private
     */
    private $duration;
    /**
     * 停止动画帧循环的函数
     * @private
     */
    private stopInterval?;
    /** 是否静音 */
    muted: boolean;
    /** 音频源URL */
    src: string;
    /**
     * 设置元素属性（兼容性方法）
     * @param name - 属性名
     * @param value - 属性值
     */
    setAttribute(name: string, value: string): void;
    /**
     * 创建 AudioLike 实例
     * @param options - 配置选项
     * @param options.duration - 音频持续时间（毫秒）
     */
    constructor({ duration }?: AudioLikeOptions);
    /**
     * 开始播放音频
     *
     * 如果是第一次播放，会记录开始时间戳。
     * 如果已播放到结尾，会重新开始播放。
     *
     * @returns {void}
     * @fires AudioLikeEvent#play
     */
    play(): void;
    /**
     * 暂停播放
     *
     * @returns {void}
     * @fires AudioLikeEvent#pause
     */
    pause(): void;
    /**
     * 动画帧循环处理函数
     *
     * 负责更新播放时间，触发时间更新事件，
     * 并在播放结束时自动暂停并触发结束事件。
     *
     * @private
     * @fires AudioLikeEvent#timeupdate
     * @fires AudioLikeEvent#ended
     */
    private requestAnimationFrameLoop;
    /**
     * 获取当前播放时间
     * @returns {number} 当前播放时间（秒）
     */
    get currentTime(): number;
    /**
     * 设置当前播放时间
     * @param time - 播放时间（秒）
     */
    set currentTime(time: number);
    /**
     * 获取音频总时长
     * @returns {number} 音频总时长（毫秒）
     */
    get duration(): number;
    /**
     * 设置音频总时长
     *
     * 设置新的时长时会自动重置播放状态
     *
     * @param duration - 音频时长（毫秒）
     */
    set duration(duration: number);
    /**
     * 检查是否播放结束
     * @returns {boolean} 是否已播放结束
     */
    get ended(): boolean;
    /**
     * 检查是否已暂停
     * @returns {boolean} 是否处于暂停状态
     */
    get paused(): boolean;
    /**
     * 添加事件监听器
     *
     * @param evtName - 事件名称
     * @param callback - 回调函数
     * @param useCapture - 是否使用捕获模式（兼容性参数，未使用）
     */
    addEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture?: boolean): void;
    /**
     * 移除事件监听器
     *
     * @param evtName - 事件名称
     * @param callback - 回调函数
     * @param useCapture - 是否使用捕获模式（兼容性参数，未使用）
     */
    removeEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture?: boolean): void;
}
export default AudioLike;

/**
 * @fileoverview Vreo 播放器主类
 *
 * 这是 Vreo (VR Video) 播放器的核心类，基于如视三维渲染引擎 Five 和 React 构建。
 * 提供了 3D 空间剧本播放的完整功能，包括播放控制、事件管理、配置等。
 */
import { Five, Subscribe } from '@realsee/five';
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
import { Appearance, PlayerConfigs } from './typings';
/**
 * Vreo 播放器主类
 *
 * 基于如视三维渲染引擎 Five 和 React 实现的 3D 空间剧本播放器。
 * 支持播放包含相机运动、特效、标签等多种关键帧的 VR 视频内容。
 *
 * @class Player
 * @extends {Subscribe<VreoKeyframeEvent>}
 *
 * @example
 * ```typescript
 * import { Player } from '@realsee/vreo';
 * import { Five } from '@realsee/five';
 *
 * // 创建 Five 实例
 * const five = new Five({ /* Five 配置 * / });
 *
 * // 创建播放器实例
 * const player = new Player(five, {
 *   container: document.getElementById('player-container'),
 *   keyframeMap: { /* 关键帧配置 * / },
 *   autoPreload: true
 * });
 *
 * // 监听播放事件
 * player.on('playing', () => console.log('开始播放'));
 * player.on('paused', () => console.log('暂停播放'));
 *
 * // 加载并播放 VR 视频
 * player.load(vreoUnit).then(() => {
 *   console.log('加载完成');
 * });
 * ```
 */
export declare class Player extends Subscribe<VreoKeyframeEvent> {
    /**
     * Five 渲染引擎实例
     * @public
     */
    $five: Five;
    /**
     * 播放器控制器实例
     * @private
     */
    private controller;
    /**
     * 播放器配置（只读）
     * @public
     */
    configs: Readonly<PlayerConfigs>;
    /**
     * 创建 Vreo 播放器实例
     *
     * @param five - Five 渲染引擎实例
     * @param configs - 播放器配置选项
     *
     * @example
     * ```typescript
     * const player = new Player(five, {
     *   container: document.getElementById('player'),
     *   keyframeMap: {
     *     // 自定义关键帧配置
     *   },
     *   autoPreload: true,
     *   imageOptions: { size: 1024 }
     * });
     * ```
     */
    constructor(five: Five, configs?: Partial<PlayerConfigs>);
    /**
     * 加载并播放 VR 视频内容
     *
     * 这是播放器的核心方法，负责加载 VreoUnit 数据并开始播放。
     * 包括预处理、预加载、事件设置等完整的加载流程。
     *
     * @param vreoUnit - VR 视频单元数据，包含关键帧、视频信息等
     * @param currentTime - 开始播放的时间点（毫秒），默认为 0
     * @param preload - 是否预加载点位数据，默认为 false
     * @param force - 是否强制重新创建数据副本，默认为 false
     * @returns Promise<boolean> - 加载完成后返回 true
     *
     * @fires VreoKeyframeEvent#loaded - 数据加载完成时触发
     *
     * @example
     * ```typescript
     * // 基本加载
     * await player.load(vreoUnit);
     *
     * // 从指定时间开始播放
     * await player.load(vreoUnit, 5000); // 从第5秒开始
     *
     * // 启用预加载
     * await player.load(vreoUnit, 0, true);
     * ```
     */
    load(vreoUnit: VreoUnit, currentTime?: number, preload?: boolean, force?: boolean): Promise<boolean>;
    /**
     * 获取播放器是否处于暂停状态
     * @returns {boolean} 是否已暂停
     */
    get paused(): boolean;
    /**
     * 开始或继续播放
     *
     * 这个方法处理播放器的播放控制逻辑，包括：
     * - 播放状态检查和防重复播放
     * - 播放时间控制
     * - 背景音乐关键帧的重置逻辑
     * - 调试接口暴露
     *
     * @param currentTime - 可选的播放起始时间（毫秒）
     * @returns {boolean} 操作是否成功
     *
     * @fires VreoKeyframeEvent#playing - 开始播放时触发
     *
     * @example
     * ```typescript
     * // 开始播放
     * player.play();
     *
     * // 从指定时间开始播放
     * player.play(10000); // 从第10秒开始
     * ```
     */
    play(currentTime?: number): boolean;
    /**
     * 设置播放器外观
     *
     * @param appearance - 外观配置
     *
     * @example
     * ```typescript
     * player.setAppearance({
     *   waveStyle: 'wave'
     * });
     * ```
     */
    setAppearance(appearance: Appearance): void;
    /**
     * 暂停播放
     *
     * @fires VreoKeyframeEvent#paused - 暂停时触发
     */
    pause(): void;
    /**
     * 显示播放器界面
     */
    show(): void;
    /**
     * 隐藏播放器界面
     */
    hide(): void;
    /**
     * 获取当前播放时间
     *
     * @returns {number} 当前播放时间（毫秒）
     */
    getCurrentTime(): number;
    /**
     * 销毁播放器实例并清理所有资源
     *
     * 包括清理控制器、卸载 React 组件等。
     * 调用此方法后，播放器实例将无法再使用。
     */
    dispose(): void;
}

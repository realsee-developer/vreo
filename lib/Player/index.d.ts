import { Five, Subscribe } from '@realsee/five';
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
import { Appearance, PlayerConfigs } from './typings';
/**
 * Vreo 播放器核心类
 *
 * 提供 VR 视频播放、剧本执行、相机运镜等功能的主要接口。
 * 基于 Five 渲染引擎和 React 构建的 3D 空间剧本播放器。
 *
 * @example
 * ```typescript
 * import { Five } from '@realsee/five'
 * import { Player } from '@realsee/vreo'
 *
 * const five = new Five({
 *   // Five 配置选项
 * })
 * const player = new Player(five, {
 *   autoPreload: true,
 *   imageOptions: { size: 1024 }
 * })
 *
 * await player.load(vreoUnit)
 * player.play()
 * ```
 */
export declare class Player extends Subscribe<VreoKeyframeEvent> {
    /** Five 渲染引擎实例 */
    $five: Five;
    /** 内部控制器 */
    private controller;
    /** 播放器配置（只读） */
    configs: Readonly<PlayerConfigs>;
    /**
     * 创建 Vreo 播放器实例
     *
     * @param five - Five 渲染引擎实例
     * @param configs - 播放器配置选项
     */
    constructor(five: Five, configs?: Partial<PlayerConfigs>);
    /**
     * 加载剧本数据
     *
     * 加载 VreoUnit 剧本数据，准备播放器状态，预载资源，并初始化播放环境。
     *
     * @param vreoUnit - 剧本数据对象，包含视频信息和关键帧序列
     * @param currentTime - 起始播放时间（毫秒），默认为 0
     * @param preload - 是否预载相关资源，默认为 false
     * @param force - 是否强制重新载入（深拷贝数据），默认为 false
     * @returns Promise<boolean> 返回加载是否成功
     *
     * @example
     * ```typescript
     * // 基本加载
     * await player.load(vreoUnit)
     *
     * // 从指定时间开始加载，并预载资源
     * await player.load(vreoUnit, 5000, true)
     *
     * // 强制重新加载
     * await player.load(vreoUnit, 0, false, true)
     * ```
     */
    load(vreoUnit: VreoUnit, currentTime?: number, preload?: boolean, force?: boolean): Promise<boolean>;
    /**
     * 获取播放器是否处于暂停状态
     * @returns 是否暂停中
     */
    get paused(): boolean;
    /**
     * 开始播放
     *
     * @param currentTime - 可选的播放起始时间（毫秒）
     * @returns 是否开始播放成功
     *
     * @example
     * ```typescript
     * // 从当前位置播放
     * player.play()
     *
     * // 从指定时间开始播放
     * player.play(10000) // 从10秒处开始
     * ```
     */
    play(currentTime?: number): boolean;
    /**
     * 设置播放器外观
     * @param appearance - 外观配置对象
     *
     * @example
     * ```typescript
     * player.setAppearance({
     *   waveStyle: 'solid'
     * })
     * ```
     */
    setAppearance(appearance: Appearance): void;
    /**
     * 暂停播放
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
     * @returns 当前播放时间（毫秒）
     */
    getCurrentTime(): number;
    /**
     * 销毁播放器实例
     *
     * 清理所有资源、事件监听器和DOM元素
     */
    dispose(): void;
}

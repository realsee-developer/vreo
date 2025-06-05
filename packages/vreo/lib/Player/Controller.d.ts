import { Five, Subscribe } from '@realsee/five';
import * as React from 'react';
import { VreoKeyframe, VreoKeyframeEnum, VreoKeyframeEvent, VreoUnit, VreoVideo } from '../typings/VreoUnit';
import { VideoAgentScene } from './modules/VideoAgent/VideoAgentScene';
import { Appearance, PlayerConfigs, WaveAppearance } from './typings';
/**
 * Vreo 播放器逻辑控制器
 *
 * 负责管理播放器的内部状态、事件处理、UI 控制和剧本执行。
 * 提供播放控制、外观设置、弹窗管理、抽屉控制等功能。
 *
 * @example
 * ```typescript
 * const controller = new Controller({
 *   five: fiveInstance,
 *   container: document.getElementById('container'),
 *   configs: playerConfigs
 * })
 *
 * // 设置播放状态
 * controller.setPlaying(true)
 *
 * // 打开弹窗
 * controller.openPopUp('弹窗内容')
 *
 * // 打开抽屉
 * controller.openDrawer({ content: '抽屉内容', height: 300 })
 * ```
 */
export declare class Controller extends Subscribe<VreoKeyframeEvent> {
    five: Five;
    configs: PlayerConfigs;
    videoAgentScene?: VideoAgentScene;
    vreoUnit?: VreoUnit;
    stopInterval?: () => void;
    playing: boolean;
    ended: boolean;
    loading: boolean | null;
    containerSize: {
        width: number;
        height: number;
    };
    appSize?: 'S' | 'M' | 'L' | 'XL';
    container: Element;
    waveAppearance: WaveAppearance | null;
    appearance: Appearance;
    avatar: VreoVideo['avatar'];
    visible: boolean;
    /**
     * 获取当前播放媒体的类型
     * @returns 'video' | 'avatar' | 'none' - 媒体类型
     */
    get agentType(): "video" | "none" | "avatar";
    popUp: string | JSX.Element | null;
    /**
     * 打开或关闭弹窗
     * @param popUp - 弹窗内容，可以是字符串、JSX元素或false（关闭弹窗）
     */
    openPopUp(popUp: string | JSX.Element | false): void;
    /**
     * 设置加载状态
     * @param loading - 加载状态：true（加载中）、false（加载完成）、null（加载失败）
     */
    setLoading(loading: boolean | null): void;
    drawerConfig: {
        content: string | JSX.Element;
        height?: number | string;
    } | null;
    /**
     * 设置虚拟形象配置
     * @param avatar - 虚拟形象配置对象
     */
    setAvatar(avatar: VreoVideo['avatar']): void;
    /**
     * 设置容器尺寸
     * @param width - 容器宽度
     * @param height - 容器高度
     */
    setContainerSize(width: number, height: number): void;
    /**
     * 设置播放器可见性
     * @param v - 是否可见
     */
    setVisible(v: boolean): void;
    /**
     * 设置播放状态
     * @param playing - 是否正在播放
     */
    setPlaying(playing: boolean): void;
    /**
     * 设置结束状态
     * @param ended - 是否已结束
     */
    setEnded(ended: boolean): void;
    /**
     * 设置播放器外观
     * @param appearance - 外观配置对象
     */
    setAppearance(appearance: Appearance): void;
    /**
     * 打开或关闭抽屉
     * @param drawerConfig - 抽屉配置对象，false表示关闭抽屉
     */
    openDrawer(drawerConfig?: false | {
        content: string | JSX.Element;
        height?: number | string;
    }): void;
    /**
     * 创建 Controller 实例
     * @param params - 构造参数对象
     * @param params.five - Five 渲染引擎实例
     * @param params.container - DOM 容器元素
     * @param params.configs - 播放器配置
     */
    constructor({ five, container, configs }: {
        five: Five;
        container: Element;
        configs: PlayerConfigs;
    });
    /**
     * 获取播放器是否准备就绪
     * @returns 是否有可用的视频代理场景
     */
    get ready(): boolean;
    /**
     * 获取当前播放时间（毫秒）
     * @returns 当前播放时间戳
     */
    get currentTime(): number;
    /**
     * 获取当前时间点应该触发的关键帧
     * @returns 当前应该执行的关键帧数组
     */
    get currentKeyframes(): VreoKeyframe[];
    /**
     * 获取当前媒体实例（音频或视频元素）
     * @returns HTML媒体元素实例
     */
    get mediaInstance(): HTMLVideoElement | HTMLAudioElement | import("../shared-utils/AudioLike").AudioLike | undefined;
    /**
     * 逐帧任务循环处理
     *
     * 在每个动画帧中检查播放状态、处理关键帧触发等
     * @param callback - 关键帧触发时的回调函数
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe, currentTime: number) => void): void;
    /**
     * 开始运行播放器逻辑循环
     *
     * 启动帧循环，持续监听并处理关键帧事件
     * @param callback - 关键帧触发时的回调函数
     */
    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void): void;
    /**
     * 清理播放器状态
     *
     * 停止播放、重置关键帧状态、清理数据和定时器
     */
    clear(): void;
    /**
     * 销毁控制器实例
     *
     * 清理所有状态和资源，释放内存
     */
    dispose(): void;
}
declare const ControllerContext: React.Context<Controller | null>;
export { ControllerContext };

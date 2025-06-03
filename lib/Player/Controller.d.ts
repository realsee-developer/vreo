import { Five, Subscribe } from '@realsee/five';
import * as React from 'react';
import { VreoKeyframe, VreoKeyframeEnum, VreoKeyframeEvent, VreoUnit, VreoVideo } from '../typings/VreoUnit';
import { VideoAgentScene } from './modules/VideoAgent/VideoAgentScene';
import { Appearance, PlayerConfigs, WaveAppearance } from './typings';
/**
 * 逻辑控制器：内部状态。
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
    get agentType(): "video" | "none" | "avatar";
    popUp: string | JSX.Element | null;
    openPopUp(popUp: string | JSX.Element | false): void;
    setLoading(loading: boolean | null): void;
    drawerConfig: {
        content: string | JSX.Element;
        height?: number | string;
    } | null;
    setAvatar(avatar: VreoVideo['avatar']): void;
    setContainerSize(width: number, height: number): void;
    setVisible(v: boolean): void;
    setPlaying(playing: boolean): void;
    setEnded(ended: boolean): void;
    setAppearance(appearance: Appearance): void;
    openDrawer(drawerConfig?: false | {
        content: string | JSX.Element;
        height?: number | string;
    }): void;
    constructor({ five, container, configs }: {
        five: Five;
        container: Element;
        configs: PlayerConfigs;
    });
    /**
     * 检查播放器是否已准备就绪
     * @returns {boolean} 是否有可用的视频代理场景
     */
    get ready(): boolean;
    /**
     * 获取当前播放时间（毫秒）
     * @returns {number} 当前播放时间，如果没有媒体实例则返回 0
     */
    get currentTime(): number;
    /**
     * 获取当前需要处理的关键帧列表
     *
     * 关键帧筛选逻辑：
     * 1. 必须是未解析的关键帧
     * 2. 结束时间必须晚于当前时间
     * 3. 开始时间必须早于或等于当前时间
     * 4. 对于非背景音乐，开始时间与当前时间的差值必须在100ms内
     *
     * @returns {VreoKeyframe[]} 当前应该处理的关键帧数组
     */
    get currentKeyframes(): VreoKeyframe[];
    /**
     * 获取当前活动的媒体实例
     * @returns {HTMLAudioElement | HTMLVideoElement | AudioLike | undefined} 媒体实例
     */
    get mediaInstance(): HTMLVideoElement | HTMLAudioElement | import("../shared-utils/AudioLike").AudioLike | undefined;
    /**
     * 逐帧任务处理函数
     *
     * 这是播放控制的核心函数，每个动画帧都会被调用。
     * 主要负责：
     * 1. 检查播放结束状态
     * 2. 控制媒体播放/暂停
     * 3. 处理当前时间点的关键帧
     *
     * @param callback - 关键帧处理回调函数
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe, currentTime: number) => void): void;
    /**
     * 启动播放循环
     *
     * 创建一个动画帧循环来持续处理播放逻辑。
     * 使用防重复启动机制，确保只有一个循环在运行。
     *
     * @param callback - 关键帧处理回调函数
     */
    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void): void;
    /**
     * 清理播放器状态
     *
     * 重置所有播放相关的状态和数据：
     * 1. 停止播放
     * 2. 重置关键帧解析状态
     * 3. 清理数据引用
     * 4. 停止动画循环
     */
    clear(): void;
    /**
     * 销毁控制器并清理所有资源
     */
    dispose(): void;
}
declare const ControllerContext: React.Context<Controller | null>;
export { ControllerContext };

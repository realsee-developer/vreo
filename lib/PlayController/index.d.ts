import { Subscribe } from '@realsee/five';
import { VreoKeyframe, VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
export interface PlayControllerConfig {
    audio?: HTMLAudioElement;
}
export declare class PlayController extends Subscribe<VreoKeyframeEvent> {
    vreoUnit?: VreoUnit;
    config: PlayControllerConfig;
    stopInterval: () => void;
    get paused(): boolean;
    get audioInstance(): HTMLAudioElement;
    get currentTime(): number;
    get currentKeyframes(): VreoKeyframe[];
    /**
     * 音频时长 不一定能获取得到，建议以 VreoUnit 配置的时长为准。
     */
    get duration(): number;
    constructor(config?: PlayControllerConfig);
    /**
     * 载入数据
     */
    load(vreoUnit: VreoUnit): Promise<boolean>;
    /**
     * 播放
     */
    play(): Promise<void>;
    /**
     * 暂停
     */
    pause(): Promise<void>;
    /**
     * 销毁资源
     * @notice 一旦销毁，创建的实例将不可用：需重新创建实例。
     *
     * @deprecated **慎重执行**
     */
    dispose(): void;
}

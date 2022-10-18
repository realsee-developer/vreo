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
    containerSize?: {
        width: number;
        height: number;
    };
    appSize?: 'S' | 'M' | 'L' | 'XL';
    container: Element;
    waveAppearance: WaveAppearance | null;
    appearance: Appearance;
    avatar?: VreoVideo['avatar'];
    visible: boolean;
    get agentType(): "none" | "video" | "avatar";
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
    get ready(): boolean;
    get currentTime(): number;
    get currentKeyframes(): VreoKeyframe[];
    get mediaInstance(): HTMLVideoElement | HTMLAudioElement | import("../shared-utils/AduioLike").AudioLike | undefined;
    /**
     * 逐帧任务
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void): void;
    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void): void;
    dispose(): void;
}
declare const ControllerContext: React.Context<Controller | null>;
export { ControllerContext };

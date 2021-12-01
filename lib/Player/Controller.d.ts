import { Five, Subscribe } from '@realsee/five';
import * as React from 'react';
import { VreoKeyframe, VreoKeyframeEnum, VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
import { VideoAgentScene } from './modules/VideoAgent/VideoAgentScene';
import { PlayerConfigs } from './typings';
/**
 * 逻辑控制器：内部状态。
 */
export declare class Controller extends Subscribe<VreoKeyframeEvent> {
    $five?: Five;
    configs?: PlayerConfigs;
    videoAgentScene?: VideoAgentScene;
    vreoUnit?: VreoUnit;
    stopInterval?: () => void;
    playing: boolean;
    visible: boolean;
    drawerConfig?: {
        content: string | JSX.Element;
        height?: number | string;
    };
    setVisible(v: boolean): void;
    setPlaying(playing: boolean): void;
    openDrawer(drawerConfig?: false | {
        content: string | JSX.Element;
        height?: number | string;
    }): void;
    constructor();
    get ready(): boolean;
    get currentTime(): number;
    get currentKeyframes(): VreoKeyframe[];
    get videoInstance(): HTMLAudioElement | undefined;
    /**
     * 逐帧任务
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void): void;
    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void): void;
    dispose(): void;
}
export declare const ControllerContext: React.Context<Controller | null>;

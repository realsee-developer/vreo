import * as React from 'react';
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
export declare const VreoProvider: React.FC;
/**
 * VreoPlayer 命令集合。
 */
export interface VreoActionCallbacks {
    /**
     * 载入剧本数据。
     */
    load: (vreoUnit: VreoUnit, currentTime?: number) => Promise<boolean>;
    /**
     * 播放。
     */
    play: () => void;
    /**
     * 暂停。
     */
    pause: () => void;
    /**
     * 显示 UI 面板。
     */
    show: () => void;
    /**
     * 隐藏 UI 面板。
     */
    hide: () => void;
    /**
     * 销毁数据及部分定时任务。
     */
    dispose: () => void;
}
export declare function useVreoAction(): {
    load: (vreoUnit: VreoUnit, currentTime?: number | undefined) => Promise<boolean>;
    pause: () => void;
    show: () => void;
    play: () => boolean;
    hide: () => void;
    dispose: () => void;
};
export declare function useVreoEventCallback<T extends keyof VreoKeyframeEvent>(name: T, callback: VreoKeyframeEvent[T], deps?: React.DependencyList | undefined): void;
export declare function useVreoPausedState(): boolean;

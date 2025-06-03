import * as React from 'react';
import { PlayerConfigs } from '../Player/typings';
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
export interface VreoProviderProps {
    configs?: Partial<PlayerConfigs>;
    children?: React.ReactNode;
}
export declare const VreoProvider: React.FC<VreoProviderProps>;
/**
 * VreoPlayer 命令集合。
 */
export interface VreoActionCallbacks {
    /**
     * 载入剧本数据。
     * @param vreoUnit 剧本数据
     * @param currentTime 开始时间戳
     * @param preload 是否开启预载
     * @param force 是否强制载入
     */
    load: (vreoUnit: VreoUnit, currentTime?: number, preload?: boolean, force?: boolean) => Promise<boolean>;
    /**
     * 播放。
     */
    play: (currentTime?: number) => void;
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
    load: (vreoUnit: VreoUnit, currentTime?: number) => Promise<boolean>;
    pause: () => void;
    show: () => void;
    play: (currentTime?: number) => boolean;
    hide: () => void;
    dispose: () => void;
};
export declare function useVreoEventCallback<T extends keyof VreoKeyframeEvent>(name: T, callback: VreoKeyframeEvent[T], deps?: React.DependencyList | undefined): void;
export declare function useVreoPausedState(): boolean;

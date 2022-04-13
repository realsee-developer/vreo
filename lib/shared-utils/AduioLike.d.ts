import { Subscribe } from '@realsee/five';
/**
 * 模拟 `<Audio>` 事件。
 */
export declare type AudioLikeEvent = {
    play: () => void;
    pause: () => void;
    timeupdate: () => void;
    ended: () => void;
};
/**
 * 模拟 `<Audio>` 功能：没有音频，但执行逻辑跟 `<Audio>` 相似。
 */
export declare class AudioLike extends Subscribe<AudioLikeEvent> {
    private $timestamp;
    private $currentTime;
    private $duration;
    private stopInterval?;
    muted: boolean;
    src: string;
    setAttribute(name: string, value: string): void;
    constructor({ duration }?: {
        duration?: number;
    });
    play(): void;
    pause(): void;
    requestAnimationFrameLoop(): void;
    get currentTime(): number;
    set currentTime(time: number);
    get duration(): number;
    set duration(duration: number);
    get ended(): boolean;
    get paused(): boolean;
    addEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture?: boolean): void;
    removeEventListener(evtName: keyof AudioLikeEvent, callback: () => void, useCapture?: boolean): void;
}
export default AudioLike;

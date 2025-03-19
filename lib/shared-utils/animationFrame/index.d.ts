/// <reference types="node" />
declare const _requestAnimationFrame: (((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame) | ((fn: FrameRequestCallback) => NodeJS.Timeout);
export default _requestAnimationFrame;
export declare function nextFrame(fn: FrameRequestCallback, delay?: number): void;
/**
 * 在每个 AnimationFrame 中调用传入的函数
 * @param callback 每次 AnimationFrame 中调用的函数
 * @param frame 每秒运行多少次
 * @returns 返回一个函数，调用可以停止 AnimationFrameLoop
 */
export declare function requestAnimationFrameInterval(callback?: (time: number) => any, frame?: number): () => void;
/**
 * 获取两个 AnimationFrame 间隔的时间
 * @returns 返回一个 Promise，resolve 的结果是两个 AnimationFrame 间隔的时间
 */
export declare function getFrameTime(): Promise<unknown>;

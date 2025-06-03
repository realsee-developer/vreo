/**
 * @fileoverview 动画帧相关工具函数
 *
 * 提供跨浏览器兼容的 requestAnimationFrame 相关功能，
 * 包括动画帧循环、延迟执行和时间测量等实用功能。
 */
/** 动画帧回调函数类型 */
type AnimationFrameCallback = (time: number) => void;
/** 停止动画帧循环的函数类型 */
type StopAnimationFrameFunction = () => void;
/**
 * 跨浏览器兼容的 requestAnimationFrame 实现
 * 在不支持的浏览器中使用 setTimeout 作为回退方案
 */
declare const _requestAnimationFrame: (callback: FrameRequestCallback) => number;
export default _requestAnimationFrame;
/**
 * 在指定延迟后执行回调函数
 *
 * 使用动画帧来实现延迟，比 setTimeout 更适合动画相关的操作。
 * 延迟以帧数为单位，而不是毫秒。
 *
 * @param fn - 要执行的回调函数
 * @param delay - 延迟的帧数，默认为 0（下一帧立即执行）
 *
 * @example
 * ```typescript
 * // 下一帧执行
 * nextFrame(() => console.log('下一帧执行'));
 *
 * // 延迟3帧后执行
 * nextFrame(() => console.log('3帧后执行'), 3);
 * ```
 */
export declare function nextFrame(fn: FrameRequestCallback, delay?: number): void;
/**
 * 创建一个动画帧循环
 *
 * 按指定的帧率执行回调函数，提供精确的时间控制。
 * 返回一个停止函数，调用后可以终止循环。
 *
 * @param callback - 每次动画帧中调用的函数，接收相对于开始时间的时间戳（毫秒）
 * @param frame - 目标帧率，默认为 60 FPS
 * @returns 返回一个函数，调用后可以停止动画帧循环
 *
 * @example
 * ```typescript
 * const stopAnimation = requestAnimationFrameInterval((time) => {
 *   console.log(`动画运行时间: ${time}ms`);
 *   if (time > 5000) {
 *     stopAnimation(); // 5秒后停止
 *   }
 * }, 30); // 30 FPS
 * ```
 */
export declare function requestAnimationFrameInterval(callback?: AnimationFrameCallback, frame?: number): StopAnimationFrameFunction;
/**
 * 测量两个动画帧之间的时间间隔
 *
 * 用于性能测试和帧率监控，返回一个 Promise。
 *
 * @returns Promise，解析值为两个动画帧之间的时间间隔（毫秒）
 *
 * @example
 * ```typescript
 * getFrameTime().then((frameTime) => {
 *   console.log(`帧间隔: ${frameTime}ms`);
 *   console.log(`当前帧率: ${1000 / frameTime} FPS`);
 * });
 * ```
 */
export declare function getFrameTime(): Promise<number>;

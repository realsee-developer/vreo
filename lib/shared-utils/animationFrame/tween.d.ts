import { Tween, Easing } from '@tweenjs/tween.js';
interface ITween<T> extends Tween<T> {
    onDestroy: (fn: () => void) => Tween<T>;
    destroy: () => void;
}
/**
 * 对象变化的补间动画
 * 1. 应用 requestAnimationFrameInterval 做 update
 * 2. 在原生 tween 上新增 destroy 方法和 onDestroy 监听
 * DOC： https://github.com/tweenjs/tween.js
 * @param from 对象起始状态
 * @param to 对象末尾状态
 * @param duration 经历时间（s）
 * @param easing 过程动画，默认是 Easing.Linear.None
 */
export default function tween<T>(from: T, to: T, duration: number, easing?: (amount: number) => number): ITween<T>;
export declare function tweenProgress(duration: number, easing: typeof Easing.Linear.None): ITween<{
    progress: number;
}>;
export {};

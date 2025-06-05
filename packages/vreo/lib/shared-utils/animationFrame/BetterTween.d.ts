import * as TWEEN from '@tweenjs/tween.js';
type UnknownProps = Record<string, any>;
export declare class BetterTween<G extends UnknownProps> extends TWEEN.Tween<G> {
    private disposeMethods;
    private animationFrameDisposer?;
    onDispose: (callback: () => void) => this;
    play: () => this;
    dispose: () => void;
}
export declare function tweenProgress(duration?: number, easing?: (amount: number) => number): BetterTween<{
    progress: number;
}>;
export {};

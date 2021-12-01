import TWEEN from '@tweenjs/tween.js';
export declare class BetterTween<G> extends TWEEN.Tween<G> {
    private disposeMethods;
    private animationFrameDisposer?;
    onDispose: (callback: () => void) => this;
    play: () => this;
    dispose: () => void;
}
export declare function tweenProgress(duration?: number, easing?: (amount: number) => number): BetterTween<{
    progress: number;
}>;

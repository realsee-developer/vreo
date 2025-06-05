/**
 * @description: 简陋的 ResizeObserver polyfill
 */
export default function createResizeObserver(func: () => any, element?: HTMLElement): {
    observe: () => void;
    unobserve: () => void;
};

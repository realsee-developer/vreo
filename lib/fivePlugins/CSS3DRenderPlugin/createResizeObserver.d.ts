/**
 * @description: įŽéį ResizeObserver polyfill
 */
export default function createResizeObserver(func: () => any, element?: HTMLElement): {
    observe: () => void;
    unobserve: () => void;
};

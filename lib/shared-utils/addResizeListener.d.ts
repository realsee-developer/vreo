type ResizeHandler = (width: number, height: number) => void;
export declare function addResizeListener(element: Element | undefined | null, resizeHandler: ResizeHandler, immediate?: boolean): () => void;
export declare function hasResizeListener(element?: Element | null): number | boolean;
export {};

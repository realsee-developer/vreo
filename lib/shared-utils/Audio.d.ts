export declare function getAudio(src?: string): IAudio;
export declare function generateBlankAudio(length: number): void;
declare class IAudio extends Audio {
    preload: "auto";
    get src(): string;
    set src(paramsSrc: string);
    realSrc: string;
    private inited;
    private removeDocumentEventListener;
    private init;
    constructor(src?: string);
}
export {};

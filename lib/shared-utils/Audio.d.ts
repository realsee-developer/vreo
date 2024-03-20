export declare const audioList: IAudio[];
export declare function getAudio(src?: string): IAudio;
export declare function waitForBlankAudioGenerated(checkInterval?: number, timeout?: number): Promise<void>;
export declare function generateBlankAudio(length: number): void;
declare class IAudio extends Audio {
    preload: "auto";
    get src(): string;
    set src(paramsSrc: string);
    realSrc: string;
    inited: boolean;
    removeDocumentEventListener: () => void;
    constructor(src?: string);
}
export {};

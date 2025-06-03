export declare const audioList: IAudio[];
export declare function getAudio(src?: string): IAudio;
export declare function waitForBlankAudioGenerated(checkInterval?: number, timeout?: number): Promise<void>;
export declare function generateBlankAudio(length: number): void;
declare class IAudio extends Audio {
    preload: "auto";
    /**
     * 获取音频源 URL
     * @returns {string} 当前音频源 URL
     */
    get src(): string;
    /**
     * 设置音频源 URL
     * @param paramsSrc - 音频源 URL
     */
    set src(paramsSrc: string);
    realSrc: string;
    inited: boolean;
    removeDocumentEventListener: () => void;
    constructor(src?: string);
}
export {};

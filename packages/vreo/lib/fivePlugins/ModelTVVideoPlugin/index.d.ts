import type { FivePlugin } from '@realsee/five';
export interface ModelTVVideoPluginData {
    enable?: boolean;
    video_src: string;
    video_poster_src: string;
    points: {
        x: number;
        y: number;
        z: number;
    }[][];
}
export interface ModelTVVideoPluginParameterType {
    videoElement?: HTMLVideoElement;
}
export interface ModelTVVideoPluginExportType {
    enable: () => void;
    disable: () => void;
    load: (data: ModelTVVideoPluginData, videoElement?: HTMLVideoElement) => Promise<void>;
}
export declare const ModelTVVideoPlugin: FivePlugin<ModelTVVideoPluginParameterType, ModelTVVideoPluginExportType>;

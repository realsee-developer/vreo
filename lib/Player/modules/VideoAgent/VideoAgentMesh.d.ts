import * as THREE from 'three';
export interface VideoAgentMeshOptions {
    videoInstance?: HTMLVideoElement;
    audioInstance?: HTMLAudioElement;
}
/**
 * 视频经纪人MESH
 */
export declare class VideoAgentMesh extends THREE.Mesh {
    options: VideoAgentMeshOptions;
    videoUrl?: string;
    freeze: boolean;
    paused: boolean;
    audioInstance: HTMLAudioElement;
    $removeEventListener: () => void;
    get videoInstance(): HTMLAudioElement;
    /**
     *
     * @param width
     * @param height
     * @param widthSegments
     * @param heightSegments
     * @param options
     */
    constructor(width: number, height: number, widthSegments: number, heightSegments: number, options?: VideoAgentMeshOptions);
    private update;
    play(videoUrl?: string, currentTime?: number): Promise<unknown>;
    /**
     * 转成毫秒，保障精准度
     */
    get currentTime(): number;
    dispose(): void;
}

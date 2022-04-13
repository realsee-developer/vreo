import * as THREE from 'three';
import AudioLike from '../../../shared-utils/AduioLike';
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
    audioLikeInstance: AudioLike;
    $removeEventListener: () => void;
    get videoInstance(): HTMLAudioElement | AudioLike;
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
    play(videoUrl?: string, currentTime?: number, duration?: number): Promise<unknown>;
    /**
     * 转成毫秒，保障精准度
     */
    get currentTime(): number;
    dispose(): void;
}

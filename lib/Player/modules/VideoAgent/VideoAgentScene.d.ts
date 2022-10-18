import * as THREE from 'three';
import { VideoAgentMesh, VideoAgentMeshOptions } from './VideoAgentMesh';
export declare class VideoAgentScene {
    videoAgentMesh: VideoAgentMesh;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    disposers: (() => void)[];
    constructor(container?: HTMLElement, options?: VideoAgentMeshOptions);
    run: () => void;
    dispose: () => void;
}

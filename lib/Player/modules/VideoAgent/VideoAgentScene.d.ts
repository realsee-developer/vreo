import * as THREE from 'three';
import { VideoAgentMesh } from './VideoAgentMesh';
export declare class VideoAgentScene {
    videoAgentMesh: VideoAgentMesh;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    container: HTMLElement;
    constructor(container: HTMLElement, needRender?: boolean);
    run: () => void;
    dispose: () => void;
}

import * as THREE from 'three';
import { Five } from '@realsee/five';
export default function lineAnime(five: Five, startPoint: THREE.Vector3, endPoint: THREE.Vector3): import("../../../../shared-utils/animationFrame/BetterTween").BetterTween<{
    progress: number;
}>;

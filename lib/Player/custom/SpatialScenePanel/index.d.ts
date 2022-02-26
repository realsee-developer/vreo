/// <reference types="react" />
import { CustomVreoKeyframeProps } from '../../typings';
export interface SpatialScenePanelData {
    customType: 'SpatialScenePanel';
    title: string;
    temperature: string;
    stateList: {
        text: string;
        icon: string;
    }[];
    position: {
        x: number;
        y: number;
        z: number;
    };
    quaternion: [number, number, number, number];
}
/**
 * 空间场景面板
 * @returns
 */
export declare function SpatialScenePanel(props: CustomVreoKeyframeProps): JSX.Element;

import { Five, Subscribe } from '@realsee/five';
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit';
import { PlayerConfigs } from './typings';
export declare class Player extends Subscribe<VreoKeyframeEvent> {
    $five: Five;
    private controller;
    configs: Readonly<PlayerConfigs>;
    constructor(five: Five, configs?: Partial<PlayerConfigs>);
    load(vreoUnit: VreoUnit, currentTime?: number, preload?: boolean): Promise<boolean>;
    get paused(): boolean;
    play(): boolean;
    pause(): void;
    show(): void;
    hide(): void;
    dispose(): void;
}

import { FivePlugin } from '@realsee/five';
import { Vector3 } from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
/**
 * 三维向量
 */
export interface Vector3Position {
    x: number;
    y: number;
    z: number;
}
export type CSS3DRenderPluginParameterType = undefined;
export interface CSS3DRenderPluginExportType {
    /**
     * @description: 根据传入的四个点位创建一个3d dom容器，可以通过ReactDom.render()的方式将react组件放到容器中
     * @param {Five} five
     * @param {Vector3[] | Vector3Position[]} points: 矩形四个点坐标
     * @param {number} config.ratio: 1px对应多少米，默认为 0.002，即1px对应2mm
     * @param {number} config.dpr: dpr, 默认为1
     * @param {HTMLElement} config.container: HTMLElement
     * @param {number} config.autoRender: 默认为true，如果需要手动render则传false
     * @param {'front' | 'behind'} config.mode: 两种模式
     * @param {HTMLElement} config.behindFiveContainer: 如果config.mode为'behind'，需要传入容器，并确保此容器位five下方，且中间没有其他dom元素遮挡
     * @return {{ container: HTMLElement; dispose: () => void }}: container: dom容器, dispose: 清理函数
     */
    create3DDomContainer: (points: Vector3[] | Vector3Position[], config?: {
        ratio?: number;
        dpr?: number;
        autoRender?: boolean;
        container?: HTMLElement;
        [key: string]: any;
    } & ({
        mode?: 'front';
    } | {
        mode: 'behind';
        behindFiveContainer: HTMLElement;
    })) => {
        container: HTMLElement;
        dispose: () => void;
        css3DObject: CSS3DObject;
        render?: () => void;
    } | void;
    /**
     * @description: 销毁所有的渲染内容
     * @return {void}
     */
    disposeAll: () => void;
}
/**
 * **CSS3DRenderPlugin** 提供矩形区域（三维空间四个坐标点），你可以在此矩形区域中渲染 DOM 内容。
 * 实现原理参考[CSS3DRenderer](https://threejs.org/docs/index.html?q=CSS3D#examples/en/renderers/CSS3DRenderer)。
 *
 * @returns
 */
export declare const CSS3DRenderPlugin: FivePlugin<CSS3DRenderPluginParameterType, CSS3DRenderPluginExportType>;
export default CSS3DRenderPlugin;

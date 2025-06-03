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
     * 根据传入的四个点位创建一个3d dom容器，可以通过ReactDom.render()的方式将react组件放到容器中
     *
     * @param points - 矩形四个点坐标
     * @param config - 配置项，包含ratio(像素比例)、dpr(设备像素比)、container(容器)、autoRender(自动渲染)、mode(渲染模式)等
     * @returns 返回包含容器、销毁函数、CSS3D对象和可选渲染函数的对象
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
     * 销毁所有的渲染内容
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

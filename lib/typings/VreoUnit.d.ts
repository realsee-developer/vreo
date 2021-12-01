import { Mode, Pose, WorkCubeImage } from '@realsee/five';
import { CameraMovementEffect, Rotation } from '../fivePlugins/CameraMovementPlugin/typings';
export declare enum VreoKeyframeEnum {
    /** 运镜 */
    CameraMovement = "CameraMovement",
    /**
     * 全景标签
     */
    PanoTag = "PanoTag",
    /**
     * 全景文本标签
     */
    PanoTextLabel = "PanoTextLabel",
    /**
     * 提词器
     */
    Prompter = "Prompter",
    /**
     * 更新 VR 全景
     */
    UpdateVRPanorama = "UpdateVRPanorama",
    /**
     * 视频广告
     */
    ModelVideo = "ModelVideo",
    /**
     * 全景特效
     */
    PanoEffect = "PanoEffect",
    /**
     * 信息面板
     */
    InfoPanel = "InfoPanel",
    /**
     * 视频特效
     */
    VideoEffect = "VideoEffect",
    /**
     * 结束
     */
    Exit = "Exit"
}
/**
 * 支持自定义剧本关键帧配置项
 */
export declare type VreoKeyframeConfigMap = {
    PanoTag?: false;
    PanoTextLabel?: false;
    Prompter?: false;
    InfoPanel?: false;
};
/**
 * 剧本关键帧
 */
export interface VreoKeyframe {
    type: VreoKeyframeEnum;
    start: number;
    end: number;
    parsed?: boolean;
    data: Record<string, any>;
}
/**
 * 虚拟视频角色
 */
export interface VreoVideo {
    duration: number;
    start: number;
    end: number;
    url: string;
}
/**
 * 剧本结构
 */
export interface VreoUnit {
    categoryId: string;
    categoryText: string;
    frontRequestId: string;
    index: string | number;
    keyframes: VreoKeyframe[];
    video: VreoVideo;
}
/**
 * 剧本事件
 */
export declare type VreoKeyframeEvent = {
    [key in VreoKeyframeEnum]: (keyframe: VreoKeyframe) => void;
} & {
    paused: () => void;
    playing: () => void;
};
/**
 * 相机运动
 */
export declare type CameraMovementData = {
    effect: CameraMovementEffect;
    mode: Mode;
    panoIndex: number;
    loop?: boolean;
    rotateSpeed?: number;
    rotation?: Rotation;
} & Partial<Pose>;
/**
 * 提词器
 */
export declare type PrompterData = {
    text: string;
};
/**
 * VR 全景切换
 */
export declare type UpdateVRPanoramaData = {
    panoIndex: number;
    images: WorkCubeImage;
};
/**
 * 顶点
 */
export interface Vertex {
    x: number;
    y: number;
    z: number;
}
/**
 * 四个顶点元组
 */
export declare type QuadrangleVertexs = [Vertex, Vertex, Vertex, Vertex];
/**
 * 视频广告
 */
export declare type ModelVideoData = {
    /**
     * 视频素材
     */
    videoSrc: string;
    /**
     * 视频封面
     */
    videoPosterSrc: string;
    /**
     * 视频映射在模型中的顶点
     */
    vertexs: QuadrangleVertexs;
};
/**
 * 全景文本标签
 */
export declare type PanoTextLabelData = {
    text: string;
    vertex: Vertex;
    fontSize?: number;
};
/**
 * 全景标签枚举
 */
export declare enum PanoTagEnum {
    Text = "Text",
    Image = "Image"
}
export declare type PanoTagData = {
    type: PanoTagEnum;
    text: string;
    vertex: Vertex;
    imgUrl?: string;
};
/**
 * 全景特效枚举
 */
export declare enum PanoEffectEnum {
    /**
     * 两点距离
     */
    Distance = "Distance"
}
/**
 * 全景特效
 */
export declare type PanoEffectData = {
    effect: PanoEffectEnum;
    twoVertexs: [Vertex, Vertex];
};
/**
 * 信息面板类型枚举
 */
export declare enum InfoPanelTypeEnum {
    Image = "Image",
    Video = "Video"
}
/**
 * 信息面板
 */
export declare type InfoPanelData = {
    type: InfoPanelTypeEnum;
    url: string;
};
/**
 * 视频特效
 */
export declare type VideoEffectData = {
    videoSrc: string;
    panoIndex: number;
    fov: number;
    direction?: Vertex;
    vector?: Pick<Pose, 'longitude' | 'latitude'>;
};

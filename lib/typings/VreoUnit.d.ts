import { Mode, Pose } from '@realsee/five';
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
     * 背景音乐
     */
    BgMusic = "BgMusic",
    /**
     * 结束
     */
    Exit = "Exit",
    /**
     * 自定义剧本帧
     */
    Custom = "Custom"
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
    uuid?: string;
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
    avatar?: {
        url?: string;
        force?: true;
    };
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
    loaded: (vreoUnit: VreoUnit) => void;
    paused: (ended?: boolean) => void;
    playing: () => void;
    unknownKeyframeType: (keyframe: Record<string, any>) => void;
    ended: () => void;
};
/**
 * 相机运动
 */
export declare type CameraMovementData = {
    effect?: CameraMovementEffect;
    transEffect?: "fly" | "fade" | "instant";
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
    _signature: string;
    allow_hosts: string[];
    certificate: string;
    expire_at: string;
    dynamic_scene?: {
        images: {
            index: number;
            right: string;
            left: string;
            up: string;
            down: string;
            front: string;
            back: string;
        };
    };
    [key: string]: any;
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
 * 矩形顶点
 */
export declare type QuadrangleVertexs = [Vertex, Vertex, Vertex, Vertex];
/**
 * 顶点数组
 */
export declare type Vertexs = Vertex[];
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
    vertexs: QuadrangleVertexs | Vertexs;
    matrixWorld?: number[];
};
/**
 * 四元数
 */
export declare type Quaternion = {
    x: number;
    y: number;
    z: number;
    w: number;
};
/**
 * 全景文本标签
 */
export declare type PanoTextLabelData = {
    text: string;
    vertex: Vertex;
    normal?: Vertex;
    quaternion?: Quaternion;
    fontSize?: number;
};
/**
 * 全景标签枚举
 */
export declare enum PanoTagEnum {
    Text = "Text",
    Image = "Image"
}
/**
 * 标签样式种类
 */
export declare enum PanoTagStyleEnum {
    /**
     * 生长动画：默认值
     */
    Growth = "Growth",
    /**
     * 展开动画
     */
    Expand = "Expand"
}
export declare type PanoTagData = {
    type: PanoTagEnum;
    style: PanoTagStyleEnum;
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
export declare enum InfoPanelStyleEnum {
    Drawer = "Drawer",
    PopUp = "PopUp"
}
/**
 * 信息面板
 */
export declare type InfoPanelData = {
    type: InfoPanelTypeEnum;
    style?: InfoPanelStyleEnum;
    url: string;
    title?: string;
    subTitle?: string;
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
/**
 * 背景音乐
 */
export declare type BgMusicData = {
    url: string;
};
/** 自定义序列帧 */
export declare type CustomData = Record<string, any>;

/**
 * @fileoverview Vreo 播放器主类
 * 
 * 这是 Vreo (VR Video) 播放器的核心类，基于如视三维渲染引擎 Five 和 React 构建。
 * 提供了 3D 空间剧本播放的完整功能，包括播放控制、事件管理、配置等。
 */

// 下面这一行不能删
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Five, Subscribe } from '@realsee/five'

import { App } from './App'
import { Controller, ControllerContext } from './Controller'
import { CameraMovementData, VreoKeyframeEnum, VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'
import { reaction } from 'mobx'
import { Drawer } from './modules/Drawer'
import { Appearance, PlayerConfigs, WaveAppearance } from './typings'
import { PopUp } from './modules/PopUp'
import { generateBlankAudio, waitForBlankAudioGenerated } from '../shared-utils/Audio'
import AudioLike from '../shared-utils/AudioLike'
import { VreoProvider } from '../react'

/** 默认音频缓存长度 */
const DefaultAudioCacheLength: number = 3

/** 播放器容器元素的唯一 ID */
const id: string = `vreo-app-dhjskadhksahdjskahdjksa`

/** 从 URL 参数获取的音频缓存长度，默认使用 DefaultAudioCacheLength */
const audioCacheLength: number = Number(location.search.match(/audio_cache=(\d+)/)?.[1] ?? DefaultAudioCacheLength)

/**
 * Vreo 播放器主类
 * 
 * 基于如视三维渲染引擎 Five 和 React 实现的 3D 空间剧本播放器。
 * 支持播放包含相机运动、特效、标签等多种关键帧的 VR 视频内容。
 * 
 * @class Player
 * @extends {Subscribe<VreoKeyframeEvent>}
 * 
 * @example
 * ```typescript
 * import { Player } from '@realsee/vreo';
 * import { Five } from '@realsee/five';
 * 
 * // 创建 Five 实例
 * const five = new Five({ /* Five 配置 * / });
 * 
 * // 创建播放器实例
 * const player = new Player(five, {
 *   container: document.getElementById('player-container'),
 *   keyframeMap: { /* 关键帧配置 * / },
 *   autoPreload: true
 * });
 * 
 * // 监听播放事件
 * player.on('playing', () => console.log('开始播放'));
 * player.on('paused', () => console.log('暂停播放'));
 * 
 * // 加载并播放 VR 视频
 * player.load(vreoUnit).then(() => {
 *   console.log('加载完成');
 * });
 * ```
 */
export class Player extends Subscribe<VreoKeyframeEvent> {
    /** 
     * Five 渲染引擎实例
     * @public
     */
    public $five: Five
    
    /** 
     * 播放器控制器实例
     * @private
     */
    private controller: Controller
    
    /** 
     * 播放器配置（只读）
     * @public
     */
    public configs: Readonly<PlayerConfigs>

    /**
     * 创建 Vreo 播放器实例
     * 
     * @param five - Five 渲染引擎实例
     * @param configs - 播放器配置选项
     * 
     * @example
     * ```typescript
     * const player = new Player(five, {
     *   container: document.getElementById('player'),
     *   keyframeMap: {
     *     // 自定义关键帧配置
     *   },
     *   autoPreload: true,
     *   imageOptions: { size: 1024 }
     * });
     * ```
     */
    constructor(five: Five, configs: Partial<PlayerConfigs> = {}) {
        super()
        this.$five = five

        // 生成空白音频缓存
        generateBlankAudio(audioCacheLength)

        // 处理容器配置（向后兼容）
        if (!configs.container) {
            configs.container = configs.containter
        }
        
        // 如果没有指定容器，创建默认容器
        if (!configs.container) {
            const oldElement = document.getElementById(id)
            if (oldElement) {
                ReactDOM.unmountComponentAtNode(oldElement)
                oldElement.remove()
            }
            const container = document.createElement('div')
            container.id = id
            configs.container = container
            const fiveCanvasDomParent = five.getElement()?.parentNode
            if (fiveCanvasDomParent) {
                fiveCanvasDomParent.append(container)
            } else {
                document.body.append(container)
            }
        }

        // 添加播放器样式类
        if (!configs.container.classList.contains('vreo-app')) {
            configs.container.classList.add('vreo-app')
        }

        // 冻结配置对象，防止意外修改
        this.configs = Object.freeze(Object.assign({ keyframeMap: {} }, configs))

        // 创建控制器实例
        this.controller = new Controller({
            five, 
            container: configs.container, 
            configs: this.configs
        })

        // 渲染 React 组件树
        ReactDOM.render(
            <ControllerContext.Provider value={this.controller}>
                <App />
                <Drawer />
                <PopUp />
                {this.configs.customKeyframes &&
                this.configs.customKeyframes.map((CustomCmpt, key) => (
                    <CustomCmpt
                        key={key}
                        subscribe={{
                            on: (name, callback) => this.on(name as any, callback as any),
                            once: (name, callback) => this.once(name as any, callback as any),
                            off: (name, callback) => this.off(name as any, callback as any),
                        }}
                        five={five}
                    />
                ))}
            </ControllerContext.Provider>,
            configs.container
        )

        // 监听播放状态变化，触发对应事件
        reaction(
            () => this.controller.ended,
            (ended: boolean) => {
                if (ended) {
                    this.emit('paused', true)
                }
            }
        )

        reaction(
            () => this.controller.playing,
            (playing: boolean) => {
                if (!this.controller.ended) {
                    this.emit(playing ? 'playing' : 'paused')
                }
            }
        )
    }

    /**
     * 加载并播放 VR 视频内容
     * 
     * 这是播放器的核心方法，负责加载 VreoUnit 数据并开始播放。
     * 包括预处理、预加载、事件设置等完整的加载流程。
     * 
     * @param vreoUnit - VR 视频单元数据，包含关键帧、视频信息等
     * @param currentTime - 开始播放的时间点（毫秒），默认为 0
     * @param preload - 是否预加载点位数据，默认为 false
     * @param force - 是否强制重新创建数据副本，默认为 false
     * @returns Promise<boolean> - 加载完成后返回 true
     * 
     * @fires VreoKeyframeEvent#loaded - 数据加载完成时触发
     * 
     * @example
     * ```typescript
     * // 基本加载
     * await player.load(vreoUnit);
     * 
     * // 从指定时间开始播放
     * await player.load(vreoUnit, 5000); // 从第5秒开始
     * 
     * // 启用预加载
     * await player.load(vreoUnit, 0, true);
     * ```
     */
    async load(vreoUnit: VreoUnit, currentTime = 0, preload = false, force = false) {
        // === 第一阶段：清理和准备工作 ===
        
        // 清理之前的播放状态和数据
        this.controller.clear()
        this.controller.setLoading(true)
        
        // 如果需要强制创建副本，进行深拷贝（避免修改原始数据）
        if (force) {
            vreoUnit = JSON.parse(JSON.stringify(vreoUnit))
        }

        // 停止当前正在运行的播放循环
        if (this.controller.stopInterval) {
            this.controller.stopInterval()
            this.controller.stopInterval = undefined
        }

        // 设置新的剧本数据
        this.controller.vreoUnit = vreoUnit

        // 暂停当前的媒体播放
        this.controller.mediaInstance?.pause()
        

        // === 第二阶段：图片分辨率优化 ===
        
        /**
         * 图片分辨率优化逻辑
         * 
         * 如果播放器配置指定了较低的图片分辨率，
         * 且 Five 引擎当前使用的分辨率更高，
         * 则降低 Five 引擎的图片分辨率以提升性能。
         */
        if (
            this.$five.imageOptions.size &&
            this.configs.imageOptions?.size &&
            this.$five.imageOptions.size > this.configs.imageOptions.size
        ) {
            this.$five.imageOptions.size = this.configs.imageOptions.size
        }

        // === 第三阶段：智能点位预加载 ===
        
        /**
         * 点位预加载逻辑
         * 
         * 遍历所有相机运动关键帧，找出涉及的点位索引，
         * 并提前加载这些点位的数据，确保播放过程中的流畅切换。
         * 
         * 预加载条件：
         * 1. 显式启用预加载 或
         * 2. 播放器配置启用了自动预加载
         */
        if (preload || (preload === undefined && this.configs.autoPreload)) {
            // 从相机运动关键帧中提取所有点位索引
            const panoIndexMap = vreoUnit.keyframes
                .filter((vreoKeyframe) => {
                    // 只处理相机运动类型的关键帧
                    if (vreoKeyframe.type !== VreoKeyframeEnum.CameraMovement) {
                        return false
                    }

                    const data = vreoKeyframe.data as CameraMovementData
                    // 只处理包含点位索引的关键帧
                    if (data.panoIndex === undefined) {
                        return false
                    }
                    return true
                })
                .reduce((accu: Record<number, boolean>, curr) => {
                    // 使用 Map 结构去重，避免重复预加载同一个点位
                    const panoIndex = curr.data.panoIndex as number
                    if (!accu[panoIndex]) {
                        accu[panoIndex] = true
                    }
                    return accu
                }, {})

            // 串行预加载所有点位（避免并发请求过多导致性能问题）
            const panoIndexes = Object.keys(panoIndexMap)
            for (let i = 0; i < panoIndexes.length; i++) {
                await this.$five.preloadPano(Number(panoIndexes[i]))
            }
        }

        // === 第四阶段：数据就绪通知 ===
        
        // 触发数据加载完成事件
        this.emit('loaded', vreoUnit)
        this.controller.emit('loaded', vreoUnit)

        // === 第五阶段：媒体初始化 ===
        
        // 设置媒体实例的起始时间
        if (this.controller.videoAgentScene?.videoAgentMesh.mediaInstance) {
            this.controller.videoAgentScene.videoAgentMesh.mediaInstance.currentTime = currentTime / 1000
        }

        // 设置视频头像信息
        this.controller.setAvatar(vreoUnit.video.avatar)

        // 等待空白音频生成完成（用于音频上下文初始化）
        await waitForBlankAudioGenerated()

        // === 第六阶段：开始播放 ===
        
        // 启动视频代理网格的播放
        await this.controller.videoAgentScene?.videoAgentMesh.play(
            vreoUnit.video.url,
            currentTime / 1000,
            vreoUnit.video.duration
        )

        // 重置播放状态
        this.controller.setEnded(false)
        this.play()

        // 启动关键帧处理循环
        this.controller.run((type, keyframe) => this.emit(type, keyframe, this.controller.currentTime))
        
        // 完成加载，取消加载状态
        this.controller.setLoading(false)
        return true
    }

    /**
     * 获取播放器是否处于暂停状态
     * @returns {boolean} 是否已暂停
     */
    get paused() {
        return !this.controller.playing
    }

    /**
     * 开始或继续播放
     * 
     * 这个方法处理播放器的播放控制逻辑，包括：
     * - 播放状态检查和防重复播放
     * - 播放时间控制
     * - 背景音乐关键帧的重置逻辑
     * - 调试接口暴露
     * 
     * @param currentTime - 可选的播放起始时间（毫秒）
     * @returns {boolean} 操作是否成功
     * 
     * @fires VreoKeyframeEvent#playing - 开始播放时触发
     * 
     * @example
     * ```typescript
     * // 开始播放
     * player.play();
     * 
     * // 从指定时间开始播放
     * player.play(10000); // 从第10秒开始
     * ```
     */
    play(currentTime?: number) {
        // 防重复播放：如果已经在播放中，直接返回成功
        if (this.controller.playing) return true
        
        // 时间控制：如果指定了播放时间且有媒体实例，则设置播放位置
        if (currentTime && this.controller.mediaInstance) {
            this.controller.mediaInstance.currentTime = currentTime / 1000  // 转换为秒
        }
        
        // 调试接口：将控制器暴露到全局 window 对象，便于开发时调试
        Object.assign(window, { $vreoController: this.controller })
        
        // 重置播放状态
        this.controller.setEnded(false)
        this.controller.setPlaying(true)
        
        /**
         * 背景音乐关键帧重置逻辑
         * 
         * 背景音乐关键帧需要特殊处理：
         * - 背景音乐通常是长时间播放的
         * - 在播放开始时需要重新触发，即使之前已经解析过
         * - 这确保了背景音乐能在正确的时间点重新开始
         */
        this.controller.vreoUnit?.keyframes.forEach((keyframe) => {
            if (keyframe.type === VreoKeyframeEnum.BgMusic) {
                keyframe.parsed = false  // 重置解析状态，使其能够重新触发
            }
        })
        
        return true
    }

    /**
     * 设置播放器外观
     * 
     * @param appearance - 外观配置
     * 
     * @example
     * ```typescript
     * player.setAppearance({
     *   waveStyle: 'wave'
     * });
     * ```
     */
    setAppearance(appearance: Appearance) {
        this.controller.setAppearance(appearance)
    }

    /**
     * 暂停播放
     * 
     * @fires VreoKeyframeEvent#paused - 暂停时触发
     */
    pause() {
        this.controller.setPlaying(false)
    }

    /**
     * 显示播放器界面
     */
    show() {
        this.controller.setVisible(true)
    }

    /**
     * 隐藏播放器界面
     */
    hide() {
        this.controller.setVisible(false)
    }

    /**
     * 获取当前播放时间
     * 
     * @returns {number} 当前播放时间（毫秒）
     */
    getCurrentTime() {
        return this.controller.currentTime
    }

    /**
     * 销毁播放器实例并清理所有资源
     * 
     * 包括清理控制器、卸载 React 组件等。
     * 调用此方法后，播放器实例将无法再使用。
     */
    dispose() {
        this.controller.dispose()

        if (this.configs.container) {
            ReactDOM.unmountComponentAtNode(this.configs.container as Element)
        }
    }
}

console.log(`
    ┏━━━┓━━━━━━━━━┏┓━━━━━━━━━━━━━
    ┃┏━┓┃━━━━━━━━━┃┃━━━━━━━━━━━━━
    ┃┗━┛┃┏━━┓┏━━┓━┃┃━┏━━┓┏━━┓┏━━┓
    ┃┏┓┏┛┃┏┓┃┗━┓┃━┃┃━┃━━┫┃┏┓┃┃┏┓┃
    ┃┃┃┗┓┃┃━┫┃┗┛┗┓┃┗┓┣━━┃┃┃━┫┃┃━┫
    ┗┛┗━┛┗━━┛┗━━━┛┗━┛┗━━┛┗━━┛┗━━┛
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
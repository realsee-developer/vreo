import { Five, Subscribe } from '@realsee/five'
import { action, computed, makeObservable, observable, reaction } from 'mobx'
import * as React from 'react'
import { requestAnimationFrameInterval } from '../shared-utils/animationFrame'
import { VreoKeyframe, VreoKeyframeEnum, VreoKeyframeEvent, VreoUnit, VreoVideo } from '../typings/VreoUnit'
import { VideoAgentScene } from './modules/VideoAgent/VideoAgentScene'
import { Appearance, PlayerConfigs, WaveAppearance } from './typings'
import setElementDataset from '../shared-utils/setElementDataset'
import { getMediaType } from '../shared-utils/getMediaInfo'

/**
 * Vreo 播放器逻辑控制器
 * 
 * 负责管理播放器的内部状态、事件处理、UI 控制和剧本执行。
 * 提供播放控制、外观设置、弹窗管理、抽屉控制等功能。
 * 
 * @example
 * ```typescript
 * const controller = new Controller({
 *   five: fiveInstance,
 *   container: document.getElementById('container'),
 *   configs: playerConfigs
 * })
 * 
 * // 设置播放状态
 * controller.setPlaying(true)
 * 
 * // 打开弹窗
 * controller.openPopUp('弹窗内容')
 * 
 * // 打开抽屉
 * controller.openDrawer({ content: '抽屉内容', height: 300 })
 * ```
 */
export class Controller extends Subscribe<VreoKeyframeEvent> {

    five: Five
    configs: PlayerConfigs
    videoAgentScene?: VideoAgentScene
    vreoUnit?: VreoUnit
    stopInterval?: () => void
    playing = false
    ended = false
    loading: boolean | null = false // null 表示加载失败
    containerSize: { width: number, height: number } = { width: 0, height: 0 }
    appSize?: 'S' | 'M' | 'L' | 'XL'
    container: Element
    waveAppearance: WaveAppearance | null = null
    appearance: Appearance = {
        waveStyle: 'wave',
    }
    avatar: VreoVideo['avatar'] = {}


    visible = false

    /**
     * 获取当前播放媒体的类型
     * @returns 'video' | 'avatar' | 'none' - 媒体类型
     */
    get agentType() {
        const type = getMediaType(this.videoAgentScene?.videoAgentMesh.videoUrl)
        if (this.avatar?.force) return 'avatar'
        if (type === 'video') return 'video'
        return 'none'
    }

    popUp: string | JSX.Element | null = null

    /**
     * 打开或关闭弹窗
     * @param popUp - 弹窗内容，可以是字符串、JSX元素或false（关闭弹窗）
     */
    openPopUp(popUp: string | JSX.Element | false) {
        if (!popUp) {
            this.popUp = null
            return
        }
        this.popUp = popUp
    }

    /**
     * 设置加载状态
     * @param loading - 加载状态：true（加载中）、false（加载完成）、null（加载失败）
     */
    setLoading(loading: boolean | null) {
        this.loading = loading
    }

    drawerConfig: {
        content: string | JSX.Element
        height?: number | string
    } | null = null

    /**
     * 设置虚拟形象配置
     * @param avatar - 虚拟形象配置对象
     */
    setAvatar(avatar: VreoVideo['avatar']) {
        this.avatar = avatar
    }

    /**
     * 设置容器尺寸
     * @param width - 容器宽度
     * @param height - 容器高度
     */
    setContainerSize(width: number, height: number) {
        this.containerSize = { width, height }
    }

    /**
     * 设置播放器可见性
     * @param v - 是否可见
     */
    setVisible(v: boolean) {
        this.visible = v
    }

    /**
     * 设置播放状态
     * @param playing - 是否正在播放
     */
    setPlaying(playing: boolean) {
        this.playing = playing
    }

    /**
     * 设置结束状态
     * @param ended - 是否已结束
     */
    setEnded(ended: boolean) {
        this.ended = ended
    }

    /**
     * 设置播放器外观
     * @param appearance - 外观配置对象
     */
    setAppearance(appearance: Appearance) {
        this.appearance = { ...this.appearance, ...appearance }
    }

    /**
     * 打开或关闭抽屉
     * @param drawerConfig - 抽屉配置对象，false表示关闭抽屉
     */
    openDrawer(drawerConfig?: false | { content: string | JSX.Element; height?: number | string }) {
        if (!drawerConfig) {
            this.drawerConfig = {
                content: '',
                height: this.drawerConfig?.height
            }
            return
        }

        this.drawerConfig = drawerConfig
    }

    /**
     * 创建 Controller 实例
     * @param params - 构造参数对象
     * @param params.five - Five 渲染引擎实例
     * @param params.container - DOM 容器元素
     * @param params.configs - 播放器配置
     */
    constructor({five, container, configs}: { five: Five, container: Element, configs: PlayerConfigs }) {
        super()

        this.configs = configs
        this.container = container
        this.five = five
        this.appSize = configs.appSize
        this.appearance = { ...this.appearance, ...configs.appearance }

        makeObservable(this, {
            visible: observable,
            setVisible: action,
            playing: observable,
            setPlaying: action,
            loading: observable,
            // videoAgentScene: observable.ref,
            setLoading: action,
            popUp: observable.ref,
            openPopUp: action,
            drawerConfig: observable.ref,
            openDrawer: action,
            ended: observable,
            waveAppearance: observable,
            avatar: observable,
            containerSize: observable,
            setContainerSize: action,
            appearance: observable,
            setAppearance: action,
            configs: observable.ref,
            setEnded: action,
            setAvatar: action,
        })

        reaction<[typeof this.appearance.waveStyle, boolean | null], boolean>(
            () => [this.appearance.waveStyle, this.loading], 
            ([waveStyle, loading]) => {
                if (loading === null) {
                    this.waveAppearance = null
                    return
                }
                if (waveStyle === 'wave') {
                    switch (loading) {
                        case true:
                            this.waveAppearance = 'double'
                            break
                        case false:
                            this.waveAppearance = 'solid'
                            break
                    }
                } else if (waveStyle === 'solid') {
                    switch (loading) {
                        case true:
                            this.waveAppearance = 'swap'
                            break
                        case false:
                            this.waveAppearance = 'expand'
                            break
                    }
                }
            }, 
            { fireImmediately: true }
        )

        if (!this.appSize) {
            reaction(
                () => this.containerSize,
                (containerSize) => {
                    if (!containerSize?.width) return
                    const width = containerSize.width
                    const height = containerSize.height
                    const size = (() => {
                        if (width <= 500) return 'S'
                        if (width <= 1024) return 'M'
                        if (width <= 2048) return 'L'
                        return 'XL'
                    })()
                    const orientation = (() => {
                        if (height > width) return 'portrait'
                        return 'landscape'
                    })()
                    setElementDataset(this.container, { size })
                    setElementDataset(this.container, { orientation })
                },
                { fireImmediately: true }
            )
        } else {
            setElementDataset(this.container, { size: this.appSize })
        }

        // 监听播放情况：抛出触发时机
        reaction(
            () => this.ended,
            (ended) => {
                if (ended) {
                    this.emit('paused', true)
                }
            }
        )

        reaction(
            () => this.playing,
            (playing) => {
                if (!this.ended) {
                    this.emit(playing ? 'playing' : 'paused')
                }
            }
        )

    }

    /**
     * 获取播放器是否准备就绪
     * @returns 是否有可用的视频代理场景
     */
    get ready() {
        return !!this.videoAgentScene
    }

    /**
     * 获取当前播放时间（毫秒）
     * @returns 当前播放时间戳
     */
    get currentTime() {
        return this.videoAgentScene?.videoAgentMesh.currentTime || 0
    }

    /**
     * 获取当前时间点应该触发的关键帧
     * @returns 当前应该执行的关键帧数组
     */
    get currentKeyframes() {
        if (!this.vreoUnit) return []
        const keyframes = this.vreoUnit.keyframes
        // 没有被解析过且开始时间低于当前时间戳 100ms
        return keyframes.filter((keyframe: VreoKeyframe) => {
            if (keyframe.parsed) return false
            // 检测结束时间
            if (keyframe.end < this.currentTime) return false
            // 检测开始时间
            if (keyframe.start > this.currentTime ) return false
            if (keyframe.type === VreoKeyframeEnum.BgMusic) return true
            // 开始时间低于当前时间戳 100ms
            const dur = this.currentTime - keyframe.start
            return dur <= 100 && dur >= 0
        })
    }

    /**
     * 获取当前媒体实例（音频或视频元素）
     * @returns HTML媒体元素实例
     */
    get mediaInstance() {
        return this.videoAgentScene?.videoAgentMesh.mediaInstance
    }

    /**
     * 逐帧任务循环处理
     * 
     * 在每个动画帧中检查播放状态、处理关键帧触发等
     * @param callback - 关键帧触发时的回调函数
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe, currentTime: number) => void) {
        if (this.mediaInstance?.ended && this.mediaInstance.currentTime !== 0) {
            if (this.ended) return
            this.vreoUnit?.keyframes.forEach((keyframe) => (keyframe.parsed = false))
            this.setEnded(true)
            this.setPlaying(false)
            this.mediaInstance.pause()
            this.mediaInstance.currentTime = 0
            return
        }

        if (!this.playing) {
            if (!this.mediaInstance?.paused) {
                this.mediaInstance?.pause()
            }
            return
        }

        if (this.mediaInstance?.paused && this.playing) {
            this.mediaInstance.play()
        }
        
        const currentKeyframes = this.currentKeyframes
        currentKeyframes.forEach((keyframe) => {
            if (keyframe.parsed) return
            keyframe.parsed = true
            this.emit(keyframe.type, keyframe, this.currentTime)
            if (callback) {
                callback(keyframe.type, keyframe, this.currentTime)
            }
        })
    }

    /**
     * 开始运行播放器逻辑循环
     * 
     * 启动帧循环，持续监听并处理关键帧事件
     * @param callback - 关键帧触发时的回调函数
     */
    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void) {
        if (this.stopInterval) return
        this.stopInterval = requestAnimationFrameInterval(() => this.requestAnimationFrameLoop(callback))
    }

    /**
     * 清理播放器状态
     * 
     * 停止播放、重置关键帧状态、清理数据和定时器
     */
    clear() {
        this.setPlaying(false)

        this.vreoUnit?.keyframes.forEach((keyframe) => (keyframe.parsed = false))

        /**
         * 清理掉数据
         */
        this.vreoUnit = undefined
        if (this.mediaInstance) {
            this.mediaInstance.pause()
            this.mediaInstance.currentTime = 0
        }

        this.stopInterval?.()
        this.stopInterval = undefined
    }

    /**
     * 销毁控制器实例
     * 
     * 清理所有状态和资源，释放内存
     */
    dispose() {
        this.clear()
    }
}

const ControllerContext = React.createContext<Controller | null>(null)

export { ControllerContext }


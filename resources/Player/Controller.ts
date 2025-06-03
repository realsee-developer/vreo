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
 * 逻辑控制器：内部状态。
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

    get agentType() {
        const type = getMediaType(this.videoAgentScene?.videoAgentMesh.videoUrl)
        if (this.avatar?.force) return 'avatar'
        if (type === 'video') return 'video'
        return 'none'
    }

    popUp: string | JSX.Element | null = null

    openPopUp(popUp: string | JSX.Element | false) {
        if (!popUp) {
            this.popUp = null
            return
        }
        this.popUp = popUp
    }

    setLoading(loading: boolean | null) {
        this.loading = loading
    }

    drawerConfig: {
        content: string | JSX.Element
        height?: number | string
    } | null = null

    setAvatar(avatar: VreoVideo['avatar']) {
        this.avatar = avatar
    }

    setContainerSize(width: number, height: number) {
        this.containerSize = { width, height }
    }

    setVisible(v: boolean) {
        this.visible = v
    }

    setPlaying(playing: boolean) {
        this.playing = playing
    }

    setEnded(ended: boolean) {
        this.ended = ended
    }

    setAppearance(appearance: Appearance) {
        this.appearance = { ...this.appearance, ...appearance }
    }

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

    constructor({five, container, configs}: { five: Five, container: Element, configs: PlayerConfigs }) {
        super()

        this.configs = configs
        this.container = container
        this.five = five
        this.appSize = configs.appSize
        this.appearance = { ...this.appearance, ...configs.appearance }

        // 配置 MobX 观察者模式，设置响应式状态管理
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

        /**
         * 波形外观响应式逻辑
         * 
         * 根据波形样式和加载状态自动计算显示的波形外观：
         * - wave 样式：loading时显示双波形，完成时显示实心波形
         * - solid 样式：loading时显示交换动画，完成时显示展开动画
         */
        reaction<[typeof this.appearance.waveStyle, boolean | null], boolean>(
            () => [this.appearance.waveStyle, this.loading], 
            ([waveStyle, loading]) => {
                if (loading === null) {
                    this.waveAppearance = null  // 加载失败时不显示波形
                    return
                }
                if (waveStyle === 'wave') {
                    switch (loading) {
                        case true:
                            this.waveAppearance = 'double'    // 加载中：双波形动画
                            break
                        case false:
                            this.waveAppearance = 'solid'     // 加载完成：实心波形
                            break
                    }
                } else if (waveStyle === 'solid') {
                    switch (loading) {
                        case true:
                            this.waveAppearance = 'swap'      // 加载中：交换动画
                            break
                        case false:
                            this.waveAppearance = 'expand'    // 加载完成：展开动画
                            break
                    }
                }
            }, 
            { fireImmediately: true }
        )

        /**
         * 响应式布局管理
         * 
         * 根据容器尺寸自动调整布局和样式：
         * - 计算设备尺寸等级（S/M/L/XL）
         * - 判断屏幕方向（横屏/竖屏）
         * - 设置容器的数据属性用于CSS样式控制
         */
        if (!this.appSize) {
            reaction(
                () => this.containerSize,
                (containerSize) => {
                    if (!containerSize?.width) return
                    const width = containerSize.width
                    const height = containerSize.height
                    
                    // 根据宽度计算设备尺寸等级
                    const size = (() => {
                        if (width <= 500) return 'S'      // 小屏设备
                        if (width <= 1024) return 'M'     // 中等设备
                        if (width <= 2048) return 'L'     // 大屏设备
                        return 'XL'                        // 超大屏设备
                    })()
                    
                    // 判断屏幕方向
                    const orientation = (() => {
                        if (height > width) return 'portrait'   // 竖屏
                        return 'landscape'                       // 横屏
                    })()
                    
                    // 设置CSS数据属性，用于响应式样式
                    setElementDataset(this.container, { size })
                    setElementDataset(this.container, { orientation })
                },
                { fireImmediately: true }
            )
        } else {
            // 如果指定了固定尺寸，直接设置
            setElementDataset(this.container, { size: this.appSize })
        }

        /**
         * 播放结束状态管理
         * 
         * 当播放结束时，自动触发暂停事件
         */
        reaction(
            () => this.ended,
            (ended) => {
                if (ended) {
                    this.emit('paused', true)  // 传递 true 表示是因为结束而暂停
                }
            }
        )

        /**
         * 播放状态管理
         * 
         * 播放状态变化时触发相应事件，但排除结束状态的情况
         */
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
     * 检查播放器是否已准备就绪
     * @returns {boolean} 是否有可用的视频代理场景
     */
    get ready() {
        return !!this.videoAgentScene
    }

    /**
     * 获取当前播放时间（毫秒）
     * @returns {number} 当前播放时间，如果没有媒体实例则返回 0
     */
    get currentTime() {
        return this.videoAgentScene?.videoAgentMesh.currentTime || 0
    }

    /**
     * 获取当前需要处理的关键帧列表
     * 
     * 关键帧筛选逻辑：
     * 1. 必须是未解析的关键帧
     * 2. 结束时间必须晚于当前时间
     * 3. 开始时间必须早于或等于当前时间
     * 4. 对于非背景音乐，开始时间与当前时间的差值必须在100ms内
     * 
     * @returns {VreoKeyframe[]} 当前应该处理的关键帧数组
     */
    get currentKeyframes() {
        if (!this.vreoUnit) return []
        const keyframes = this.vreoUnit.keyframes
        
        return keyframes.filter((keyframe: VreoKeyframe) => {
            // 跳过已解析的关键帧
            if (keyframe.parsed) return false
            
            // 检查关键帧是否已过期
            if (keyframe.end < this.currentTime) return false
            
            // 检查关键帧是否还未到时间
            if (keyframe.start > this.currentTime ) return false
            
            // 背景音乐关键帧特殊处理：只要在时间范围内就处理
            if (keyframe.type === VreoKeyframeEnum.BgMusic) return true
            
            // 其他关键帧：需要在开始时间的100ms窗口内
            const dur = this.currentTime - keyframe.start
            return dur <= 100 && dur >= 0  // 允许100ms的时间误差
        })
    }

    /**
     * 获取当前活动的媒体实例
     * @returns {HTMLAudioElement | HTMLVideoElement | AudioLike | undefined} 媒体实例
     */
    get mediaInstance() {
        return this.videoAgentScene?.videoAgentMesh.mediaInstance
    }

    /**
     * 逐帧任务处理函数
     * 
     * 这是播放控制的核心函数，每个动画帧都会被调用。
     * 主要负责：
     * 1. 检查播放结束状态
     * 2. 控制媒体播放/暂停
     * 3. 处理当前时间点的关键帧
     * 
     * @param callback - 关键帧处理回调函数
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe, currentTime: number) => void) {
        // 检查播放是否已结束
        if (this.mediaInstance?.ended && this.mediaInstance.currentTime !== 0) {
            if (this.ended) return  // 避免重复处理
            
            // 重置所有关键帧的解析状态，为下次播放做准备
            this.vreoUnit?.keyframes.forEach((keyframe) => (keyframe.parsed = false))
            
            // 设置结束状态并暂停播放
            this.setEnded(true)
            this.setPlaying(false)
            this.mediaInstance.pause()
            this.mediaInstance.currentTime = 0
            return
        }

        // 如果控制器显示暂停，确保媒体实例也暂停
        if (!this.playing) {
            if (!this.mediaInstance?.paused) {
                this.mediaInstance?.pause()
            }
            return
        }

        // 如果控制器显示播放，但媒体实例暂停了，则恢复播放
        if (this.mediaInstance?.paused && this.playing) {
            this.mediaInstance.play()
        }
        
        // 处理当前时间点的所有关键帧
        const currentKeyframes = this.currentKeyframes
        currentKeyframes.forEach((keyframe) => {
            if (keyframe.parsed) return  // 双重检查，避免重复处理
            
            // 标记为已解析，防止重复触发
            keyframe.parsed = true
            
            // 触发内部事件
            this.emit(keyframe.type, keyframe, this.currentTime)
            
            // 调用外部回调
            if (callback) {
                callback(keyframe.type, keyframe, this.currentTime)
            }
        })
    }

    /**
     * 启动播放循环
     * 
     * 创建一个动画帧循环来持续处理播放逻辑。
     * 使用防重复启动机制，确保只有一个循环在运行。
     * 
     * @param callback - 关键帧处理回调函数
     */
    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void) {
        if (this.stopInterval) return  // 防止重复启动
        this.stopInterval = requestAnimationFrameInterval(() => this.requestAnimationFrameLoop(callback))
    }

    /**
     * 清理播放器状态
     * 
     * 重置所有播放相关的状态和数据：
     * 1. 停止播放
     * 2. 重置关键帧解析状态
     * 3. 清理数据引用
     * 4. 停止动画循环
     */
    clear() {
        this.setPlaying(false)

        // 重置所有关键帧的解析状态
        this.vreoUnit?.keyframes.forEach((keyframe) => (keyframe.parsed = false))

        // 清理数据引用
        this.vreoUnit = undefined
        
        // 重置媒体实例状态
        if (this.mediaInstance) {
            this.mediaInstance.pause()
            this.mediaInstance.currentTime = 0
        }

        // 停止动画循环
        this.stopInterval?.()
        this.stopInterval = undefined
    }

    /**
     * 销毁控制器并清理所有资源
     */
    dispose() {
        this.clear()
    }
}

const ControllerContext = React.createContext<Controller | null>(null)

export { ControllerContext }


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

const DefaultAudioCacheLength = 3

const id = `vreo-app-dhjskadhksahdjskahdjksa`

const audioCacheLength = Number(location.search.match(/audio_cache=(\d+)/)?.[1] ?? DefaultAudioCacheLength)

/**
 * Vreo 播放器核心类
 * 
 * 提供 VR 视频播放、剧本执行、相机运镜等功能的主要接口。
 * 基于 Five 渲染引擎和 React 构建的 3D 空间剧本播放器。
 * 
 * @example
 * ```typescript
 * import { Five } from '@realsee/five'
 * import { Player } from '@realsee/vreo'
 * 
 * const five = new Five({
 *   // Five 配置选项
 * })
 * const player = new Player(five, {
 *   autoPreload: true,
 *   imageOptions: { size: 1024 }
 * })
 * 
 * await player.load(vreoUnit)
 * player.play()
 * ```
 */
export class Player extends Subscribe<VreoKeyframeEvent> {
    /** Five 渲染引擎实例 */
    $five: Five
    /** 内部控制器 */
    private controller: Controller
    /** 播放器配置（只读） */
    configs: Readonly<PlayerConfigs>

    /**
     * 创建 Vreo 播放器实例
     * 
     * @param five - Five 渲染引擎实例
     * @param configs - 播放器配置选项
     */
    constructor(five: Five, configs: Partial<PlayerConfigs> = {}) {
        super()
        this.$five = five

        generateBlankAudio(audioCacheLength)

        if (!configs.container) {
            configs.container = configs.containter
        }
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

        if (!configs.container.classList.contains('vreo-app')) configs.container.classList.add('vreo-app')

        this.configs = Object.freeze( Object.assign({ keyframeMap: {} }, configs) )

        this.controller = new Controller({five, container:configs.container, configs: this.configs})


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

        // 监听播放情况：抛出触发时机
        reaction(
            () => this.controller.ended,
            (ended) => {
                if (ended) {
                    this.emit('paused', true)
                }
            }
        )

        reaction(
            () => this.controller.playing,
            (playing) => {
                if (!this.controller.ended) {
                    this.emit(playing ? 'playing' : 'paused')
                }
            }
        )
    }

    /**
     * 加载剧本数据
     * 
     * 加载 VreoUnit 剧本数据，准备播放器状态，预载资源，并初始化播放环境。
     * 
     * @param vreoUnit - 剧本数据对象，包含视频信息和关键帧序列
     * @param currentTime - 起始播放时间（毫秒），默认为 0
     * @param preload - 是否预载相关资源，默认为 false
     * @param force - 是否强制重新载入（深拷贝数据），默认为 false
     * @returns Promise<boolean> 返回加载是否成功
     * 
     * @example
     * ```typescript
     * // 基本加载
     * await player.load(vreoUnit)
     * 
     * // 从指定时间开始加载，并预载资源
     * await player.load(vreoUnit, 5000, true)
     * 
     * // 强制重新加载
     * await player.load(vreoUnit, 0, false, true)
     * ```
     */
    async load(vreoUnit: VreoUnit, currentTime = 0, preload = false, force = false) {
        this.controller.clear()
        this.controller.setLoading(true)
        if (force) {
            vreoUnit = JSON.parse(JSON.stringify(vreoUnit))
        }
        // if (!this.controller.visible) {
        //     this.controller.setVisible(true)
        //     // 延迟 500ms 规避跟 DOM 动画冲突
        //     await new Promise((resolve) => {
        //         setTimeout(() => resolve(true), 500)
        //     })
        // }

        if (this.controller.stopInterval) {
            this.controller.stopInterval()
            this.controller.stopInterval = undefined
        }

        this.controller.vreoUnit = vreoUnit


        this.controller.mediaInstance?.pause()
        

        // 预载逻辑
        // 是否降低图片分辨率
        if (
            this.$five.imageOptions.size &&
            this.configs.imageOptions?.size &&
            this.$five.imageOptions.size > this.configs.imageOptions.size
        ) {
            this.$five.imageOptions.size = this.configs.imageOptions.size
        }

        // 预载数据中的点位
        if (preload || (preload === undefined && this.configs.autoPreload)) {
            const panoIndexMap = vreoUnit.keyframes
                .filter((vreoKeyframe) => {
                    if (vreoKeyframe.type !== VreoKeyframeEnum.CameraMovement) {
                        return false
                    }

                    const data = vreoKeyframe.data as CameraMovementData
                    if (data.panoIndex === undefined) {
                        return false
                    }
                    return true
                })
                .reduce((accu: Record<number, boolean>, curr) => {
                    const panoIndex = curr.data.panoIndex as number
                    if (!accu[panoIndex]) {
                        accu[panoIndex] = true
                    }
                    return accu
                }, {})

            const panoIndexes = Object.keys(panoIndexMap)
            for (let i = 0; i < panoIndexes.length; i++) {
                await this.$five.preloadPano(Number(panoIndexes[i]))
            }
        }

        // 新数据载入就绪
        this.emit('loaded', vreoUnit)
        this.controller.emit('loaded', vreoUnit)

        if (this.controller.videoAgentScene?.videoAgentMesh.mediaInstance) {
            this.controller.videoAgentScene.videoAgentMesh.mediaInstance.currentTime = currentTime / 1000
        }

        this.controller.setAvatar(vreoUnit.video.avatar)

        await waitForBlankAudioGenerated()

        await this.controller.videoAgentScene?.videoAgentMesh.play(
            vreoUnit.video.url,
            currentTime / 1000,
            vreoUnit.video.duration
        )


        this.controller.setEnded(false)
        this.play()

        this.controller.run((type, keyframe) => this.emit(type, keyframe, this.controller.currentTime))
        this.controller.setLoading(false)
        return true
    }

    /**
     * 获取播放器是否处于暂停状态
     * @returns 是否暂停中
     */
    get paused() {
        return !this.controller.playing
    }

    /**
     * 开始播放
     * 
     * @param currentTime - 可选的播放起始时间（毫秒）
     * @returns 是否开始播放成功
     * 
     * @example
     * ```typescript
     * // 从当前位置播放
     * player.play()
     * 
     * // 从指定时间开始播放
     * player.play(10000) // 从10秒处开始
     * ```
     */
    play(currentTime?: number) {
        if (this.controller.playing) return true
        if (currentTime && this.controller.mediaInstance) {
            this.controller.mediaInstance.currentTime = currentTime / 1000
        }
        Object.assign(window, { $vreoController: this.controller })
        this.controller.setEnded(false)
        this.controller.setPlaying(true)
        this.controller.vreoUnit?.keyframes.forEach((keyframe) => {
            if (keyframe.type === VreoKeyframeEnum.BgMusic) {
                keyframe.parsed = false
            }
        })
        return true
    }

    /**
     * 设置播放器外观
     * @param appearance - 外观配置对象
     * 
     * @example
     * ```typescript
     * player.setAppearance({
     *   waveStyle: 'solid'
     * })
     * ```
     */
    setAppearance(appearance: Appearance) {
        this.controller.setAppearance(appearance)
    }

    /**
     * 暂停播放
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
     * @returns 当前播放时间（毫秒）
     */
    getCurrentTime() {
        return this.controller.currentTime
    }

    /**
     * 销毁播放器实例
     * 
     * 清理所有资源、事件监听器和DOM元素
     */
    dispose() {
        this.controller.dispose()

        if (this.configs.container) {
            ReactDOM.unmountComponentAtNode(this.configs.container as Element)
        }
    }
}

// 导出自定义组件
export { SpatialScenePanel } from './custom/SpatialScenePanel'

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
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
        waveStyle: 'solid',
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

        makeObservable(this, {
            visible: observable,
            setVisible: action,
            playing: observable,
            setPlaying: action,
            loading: observable,
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

    get ready() {
        return !!this.videoAgentScene
    }

    get currentTime() {
        return this.videoAgentScene?.videoAgentMesh.currentTime || 0
    }

    get currentKeyframes() {
        if (!this.vreoUnit) return []
        const keyframes = this.vreoUnit.keyframes
        // 没有被解析过且开始时间低于当前时间戳 100ms
        return keyframes.filter((keyframe: VreoKeyframe) => {
            if (keyframe.parsed) return false
            const dur = this.currentTime - keyframe.start
            return dur <= 100 && dur >= 0
        })
    }

    get mediaInstance() {
        return this.videoAgentScene?.videoAgentMesh.mediaInstance
    }

    /**
     * 逐帧任务
     */
    requestAnimationFrameLoop(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void) {
        if (this.mediaInstance?.ended) {
            this.setEnded(true)
            this.setPlaying(false)
            this.mediaInstance.pause()
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
            this.emit(keyframe.type, keyframe)
            if (callback) {
                callback(keyframe.type, keyframe)
            }
        })
    }

    run(callback: (type: VreoKeyframeEnum, keyframe: VreoKeyframe) => void) {
        if (this.stopInterval) return
        this.stopInterval = requestAnimationFrameInterval(() => this.requestAnimationFrameLoop(callback))
    }

    dispose() {
        this.setPlaying(false)

        if (this.currentKeyframes) {
            this.currentKeyframes.forEach((keyframe) => (keyframe.parsed = false))
        }

        /**
         * 清理掉数据
         */
        this.vreoUnit = undefined
        if (this.mediaInstance) {
            this.mediaInstance.currentTime = 0
        }

        if (this.stopInterval) {
            this.stopInterval()
            this.stopInterval = undefined
        }
    }
}

const ControllerContext = React.createContext<Controller | null>(null)

export { ControllerContext }


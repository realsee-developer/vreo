import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Five, Subscribe } from '@realsee/five'

import { App } from './App'
import { Controller, ControllerContext } from './Controller'
import { VreoKeyframeEvent, VreoUnit } from '../typings/VreoUnit'
import { reaction } from 'mobx'
import { Drawer } from './modules/Drawer'
import { PlayerConfigs } from './typings'

export class Player extends Subscribe<VreoKeyframeEvent> {
  $five: Five
  private controller: Controller
  configs: Readonly<PlayerConfigs>

  constructor(five: Five, configs: Partial<PlayerConfigs> = {}) {
    super()
    this.controller = new Controller()
    this.$five = this.controller.$five = five

    if (!configs.containter) {
      const containter = document.querySelector('#vreo-app') || document.createElement('div')
      ReactDOM.unmountComponentAtNode(containter)
      containter.setAttribute('id', 'vreo-app')
      configs.containter = containter
      document.body.append(containter)
    }

    this.configs = Object.freeze(
      Object.assign(
        {
          keyframeMap: {},
        },
        configs
      )
    )

    this.controller.configs = this.configs

    ReactDOM.render(
      <ControllerContext.Provider value={this.controller}>
        <App></App>
        <Drawer />
        {this.configs.customKeyframes &&
          this.configs.customKeyframes.map((CustomCmpt, key) => (
            <CustomCmpt
              key={key}
              subscribe={{
                on: (name, callback) => this.on(name, callback),
                once: (name, callback) => this.once(name, callback),
                off: (name, callback) => this.off(name, callback),
              }}
              five={five}
            />
          ))}
      </ControllerContext.Provider>,
      configs.containter
    )

    // 监听播放情况：抛出触发时机
    reaction(
      () => this.controller.playing,
      (playing) => {
        this.emit(playing ? 'playing' : 'paused')
      }
    )
  }

  async load(vreoUnit: VreoUnit, currentTime = 0) {
    if (!this.controller.visible) {
      this.controller.setVisible(true)
      // 延迟 500ms 规避跟 DOM 动画冲突
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 500)
      })
    }

    if (this.controller.stopInterval) {
      this.controller.stopInterval()
      this.controller.stopInterval = undefined
    }

    this.controller.vreoUnit = vreoUnit
    this.controller.videoInstance?.pause()

    // 新数据载入就绪
    this.emit('loaded', vreoUnit)
    if (vreoUnit.video.url) {
      if (this.controller.videoAgentScene?.videoAgentMesh.videoInstance) {
        this.controller.videoAgentScene.videoAgentMesh.videoInstance.currentTime = currentTime / 1000
      }
      await this.controller.videoAgentScene?.videoAgentMesh.play(vreoUnit.video.url)
      this.play()
    }
    this.controller.run((type, keyframe) => this.emit(type, keyframe))
    return true
  }

  get paused() {
    return !this.controller.playing
  }

  play() {
    if (this.controller.playing) return true
    this.controller.setPlaying(true)
    return true
  }

  pause() {
    this.controller.setPlaying(false)
  }

  show() {
    this.controller.setVisible(true)
  }

  hide() {
    this.controller.setVisible(false)
  }

  dispose() {
    this.pause()
    this.controller.dispose()

    if (this.configs.containter) {
      ReactDOM.unmountComponentAtNode(this.configs.containter as Element)
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

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Five, Subscribe } from '@realsee/five'

import { App } from './App'
import { Controller, ControllerContext } from './Controller'
import { VreoKeyframeEvent, VreoKeyframeConfigMap, VreoUnit } from '../typings/VreoUnit'
import { reaction } from 'mobx'
import { Drawer } from './modules/Drawer'
import { PlayerConfigs } from './typings'

const controller = new Controller()

export class Player extends Subscribe<VreoKeyframeEvent> {
  $five: Five
  configs: Readonly<PlayerConfigs>

  constructor(five: Five, configs: Partial<PlayerConfigs> = {}) {
    super()
    this.$five = controller.$five = five

    if (!configs.containter) {
      const containter = document.createElement('div')
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

    controller.configs = this.configs

    ReactDOM.render(
      <ControllerContext.Provider value={controller}>
        <App></App>
        <Drawer />
      </ControllerContext.Provider>,
      configs.containter
    )

    // 监听播放情况：抛出触发时机
    reaction(
      () => controller.playing,
      (playing) => {
        this.emit(playing ? 'playing' : 'paused')
      }
    )
  }

  async load(vreoUnit: VreoUnit, currentTime = 0) {
    if (!controller.visible) {
      controller.setVisible(true)
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 500)
      })
    }

    if (controller.stopInterval) {
      controller.stopInterval()
      controller.stopInterval = undefined
    }

    controller.vreoUnit = vreoUnit
    controller.videoInstance?.pause()

    if (vreoUnit.video.url) {
      if (controller.videoAgentScene?.videoAgentMesh.videoInstance) {
        controller.videoAgentScene.videoAgentMesh.videoInstance.currentTime = currentTime / 1000
      }
      await controller.videoAgentScene?.videoAgentMesh.play(vreoUnit.video.url)
      this.play()
    }
    controller.run((type, keyframe) => this.emit(type, keyframe))
    return true
  }

  get paused() {
    return !controller.playing
  }

  play() {
    if (controller.playing) return true
    controller.setPlaying(true)
    return true
  }

  pause() {
    controller.setPlaying(false)
  }

  show() {
    controller.setVisible(true)
  }

  hide() {
    controller.setVisible(false)
  }

  dispose() {
    controller.dispose()
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

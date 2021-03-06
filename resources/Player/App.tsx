import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { Controller } from './Controller'
import { useController, useFiveInstance } from './hooks'
import { CameraMovement } from './modules/keyframes/CameraMovement'
import { InfoPanel } from './modules/keyframes/InfoPanel'
import { ModelVideo } from './modules/keyframes/ModelVideo'
import { PanoEffect } from './modules/keyframes/PanoEffect'
import { PanoTag } from './modules/keyframes/PanoTag'
import { PanoTextLabel } from './modules/keyframes/PanoTextLabel'
import { Prompter } from './modules/keyframes/Prompter'
import { UpdateVRPanorama } from './modules/keyframes/UpdateVRPanorama'
import { VideoEffect } from './modules/keyframes/VideoEffect'
import { VideoAgent } from './modules/VideoAgent'
import { BgMusic } from './modules/keyframes/BgMusic'

const AppView = observer(({ controller }: { controller: Controller }) => {
  
  return (
    <div
      className={classNames('vreo-panel', {
        'vreo-panel--hidden': !controller.visible,
      })}
    >
      <div className="vreo-panel-inner">
        <VideoAgent
          onClick={() => {
            if (controller.isAudio) {
              return
            }
            if (controller.playing) {
              controller.setPlaying(false)
            } else {
              controller.setPlaying(true)
            }
          }}
          options={controller.configs?.videoAgentMeshOptions || {}}
        />
        <Prompter />
        {controller.configs?.customPanelChildren}
      </div>
    </div>
  )
})

export function App() {
  const controller = useController()
  return (
    <>
      <>
        <CameraMovement />
        <ModelVideo />
        <UpdateVRPanorama />
        <VideoEffect />
        <PanoTag />
        <PanoTextLabel />
        <InfoPanel />
        <PanoEffect />
        <BgMusic />
      </>
      <AppView controller={controller} />
    </>
  )
}

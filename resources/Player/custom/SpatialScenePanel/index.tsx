import * as React from 'react'
import ReactDOM from 'react-dom'
import { Five } from '@realsee/five'
import { Raycaster, Vector3 } from 'three'
import { tweenProgress } from '@realsee/dnalogel/shared-utils/animationFrame/BetterTween'
import { CSS3DRenderPlugin, CSS3DRenderPluginExportType } from '@realsee/dnalogel/plugins/CSS3DRenderPlugin'

import { VreoKeyframe, VreoKeyframeEnum } from '../../../typings/VreoUnit'
import { CustomVreoKeyframeProps } from '../../typings'

export interface SpatialScenePanelData {
  customType: 'SpatialScenePanel'
  title: string
  temperature: string
  stateList: {
    text: string
    icon: string
  }[]
  position: { x: number; y: number; z: number }
  quaternion: [number, number, number, number]
}

interface SearchParams {
  five: Five
  position: Vector3
  rotation?: Vector3
  quaternion: [number, number, number, number]
  dom: HTMLDivElement 
}

const searchV1 = ({ five, position, rotation, dom }: SearchParams) => {
  const cameraDirection = new Vector3()
  five.camera.getWorldDirection(cameraDirection)
  const cameraPosition = five.camera.position
  const [intersect] = five.model.intersectRaycaster(new Raycaster(cameraPosition, cameraDirection))
  const point = five.project2d(intersect.point)

  // const width = dom!.clientWidth
  const height = dom!.clientHeight
  dom!.style.left = point!.x + 'px'
  dom!.style.top = point!.y - height / 2 + 'px'
  const rect = dom!.getBoundingClientRect()
  const { left, top, bottom, right } = rect

  const leftBottom = new Vector3(left, bottom)
  const leftTop = new Vector3(left, top)
  const rightTop = new Vector3(right, top)
  const rightBottom = new Vector3(right, bottom)

  const points = [leftBottom, rightBottom, rightTop, leftTop].map((point) => {
    point.setX((point.x / window.innerWidth) * 2 - 1)
    point.setY(-(point.y / window.innerHeight) * 2 + 1)
    point.setZ(0.5)
    return point.unproject(five.camera).addScaledVector(cameraDirection, 0.2)
  })

  // const colors = [0xdc143c, 0xffff00, 0x0000ff, 0x008000]
  // points.forEach((p, index) => five.scene.add(getSphere(p, colors[index])))

  const ratio = leftBottom.distanceTo(rightBottom) / 160
  return { points, ratio }
}

/**
 * 空间场景面板
 * @returns
 */
export function SpatialScenePanel(props: CustomVreoKeyframeProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const rendererRef = React.useRef<CSS3DRenderPluginExportType>(CSS3DRenderPlugin(props.five))

  React.useEffect(() => {

    if (!ref.current) {
      return
    }

    const callback = (keyframe: VreoKeyframe) => {
      if (keyframe.data.customType !== 'SpatialScenePanel') {
        return
      }

      const data = keyframe.data as SpatialScenePanelData
      // const data = mockData as SpatialScenePanelData

      const { points, ratio } = searchV1({
        five: props.five,
        position: new Vector3(data.position.x, data.position.y, data.position.z),
        quaternion: data.quaternion,
        dom: ref.current!
      })

      console.log(points, ratio)

      const { container, dispose, css3DObject, render } =
        rendererRef.current.create3DDomContainer(points, { ratio, autoRender: false }) || {}

      if (!container) return


      ReactDOM.render(<Panel ref={(ref) => (panelRef.current = ref)} data={data} />, container)
        const startRotateY = -(Math.PI * 2) / 9
        let lastRotateY = 0
        tweenProgress(1000)
          .onUpdate(({ progress }) => {
            const needRotateY = (Math.PI / 90) * 11 * progress
            const rotateY = needRotateY - lastRotateY
            css3DObject?.rotateY(rotateY)
            lastRotateY = needRotateY
          })
          .onStart(() => {
            css3DObject?.rotateY(startRotateY)
            render!()
          })
          .onDispose(() => {
            panelRef.current?.classList.add('show')
          })
          .play()
        const { start, end } = keyframe
        setTimeout(() => {
          panelRef.current?.classList.add('hide')
          setTimeout(() => dispose?.(), 1500)
        }, end - start)
    }

    Object.assign(window, {$SpatialScenePanelCallback: callback})
    props.subscribe.on(VreoKeyframeEnum.Custom, callback)

    return () => {
      props.subscribe.off(VreoKeyframeEnum.Custom, callback)
    }
  }, [])

  return <div className="vreo-SpatialScenePanel" ref={ref}></div>
}

const Panel = React.forwardRef(
  (props: { data: SpatialScenePanelData }, myRef: React.LegacyRef<HTMLDivElement> | undefined) => (
    <div className="SpatialScenePanel" ref={myRef}>
      <div className="SpatialScenePanel-show-area">
        <div className="SpatialScenePanel-bg"></div>
        <div className="SpatialScenePanel-header">
          <div className="SpatialScenePanel-title">{props.data?.title}</div>
          <div className="SpatialScenePanel-temperature">{props.data?.temperature}℃</div>
        </div>
        <div className="SpatialScenePanel-body">
          {props.data?.stateList?.map((state, index) => (
            <div key={`scene-${state.text}`} className={`SpatialScenePanel-item index_${index}`}>
              <img className="SpatialScenePanel-icon" src={state.icon}></img>
              <div className="SpatialScenePanel-text">{state.text}</div>
              <div className="SpatialScenePanel-dot"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="SpatialScenePanel-disappear-area"></div>
    </div>
  ),
)

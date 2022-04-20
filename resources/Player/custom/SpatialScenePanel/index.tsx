import * as React from 'react'
import ReactDOM from 'react-dom'
import { Five } from '@realsee/five'
import { Raycaster, Vector3 } from 'three'
import { tweenProgress } from '../../../shared-utils/animationFrame/BetterTween'
import { CSS3DRenderPlugin, CSS3DRenderPluginExportType } from '../../../fivePlugins/CSS3DRenderPlugin'

import { VreoKeyframe, VreoKeyframeEnum } from '../../../typings/VreoUnit'
import { CustomVreoKeyframeProps } from '../../typings'

// __debug__
// const mockData: SpatialScenePanelData = {
//   customType: 'SpatialScenePanel',
//   "stateList": [
//     {
//       "icon": "http://vrlab-public.ljcdn.com/release/seesay/tools/___fc42f951076607a22fd5c54f005ba553.png",
//       "text": "窗帘关闭"
//     },
//     {
//       "icon": "http://vrlab-public.ljcdn.com/release/seesay/tools/___b331e7ad732debc07250a169a3393b13.png",
//       "text": "摄像头休眠"
//     },
//     {
//       "icon": "http://vrlab-public.ljcdn.com/release/seesay/tools/___2e425a81ac0ad88232d50d4e52a9abfa.png",
//       "text": "氛围音乐"
//     },
//     {
//       "icon": "http://vrlab-public.ljcdn.com/release/seesay/tools/___bff48bb81cde37aa6a319d6f5d56e3a4.png",
//       "text": "空调打开"
//     }
//   ],
//   "temperature": "27",
//   "title": "沉浸式回家"
// }

export interface SpatialScenePanelData {
  customType: 'SpatialScenePanel'
  title: string
  temperature: string
  stateList: {
    text: string
    icon: string
  }[]
  position?: { x: number; y: number; z: number }
  quaternion?: [number, number, number, number]
}

interface SearchParams {
  five: Five
  // position: Vector3
  // rotation?: Vector3
  // quaternion: [number, number, number, number]
  dom: HTMLDivElement
}

// const getSphere = (position: Vector3, color = 0xffff00) => {
//   const geometry = new SphereGeometry(0.05, 32, 16)
//   const material = new MeshBasicMaterial({ color })
//   const sphere = new Mesh(geometry, material)
//   sphere.position.copy(position)
//   return sphere
// }

const searchV1 = ({ five, dom }: SearchParams) => {
  const cameraDirection = new Vector3()
  five.camera.getWorldDirection(cameraDirection)
  const cameraPosition = five.camera.position
  const [intersect] = five.model.intersectRaycaster(new Raycaster(cameraPosition, cameraDirection))
  const point = five.project2d(intersect.point)

  const widescreen = window.innerWidth > 560 ? true : false
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
    point.setX((point.x / window.innerWidth) * 2 - (widescreen ? 1.25: 1.75))
    point.setY(-(point.y / window.innerHeight) * 2 + (widescreen ? 1.35: 1.125))
    point.setZ(0.5)
    return point.unproject(five.camera).addScaledVector(cameraDirection, 0.2)
  })

  // __debug__
  // const colors = [0xdc143c, 0xffff00, 0x0000ff, 0x008000]
  // points.forEach((p, index) => five.scene.add(getSphere(p, colors[index])))

  // 判断是手机 150
  const ratio = leftBottom.distanceTo(rightBottom) / (widescreen ? 150 : 120)
  return { points, ratio }
}

/**
 * 空间场景面板
 * @returns
 */
export function SpatialScenePanel(props: CustomVreoKeyframeProps) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
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

      // const data = mockData
      const { points, ratio } = searchV1({
        five: props.five,
        dom: ref.current!,
      })

      const { container, dispose, css3DObject, render } =
        rendererRef.current.create3DDomContainer(points, { ratio, autoRender: false }) || {}

      Object.assign(window, { $css3DObject: css3DObject })
      if (!container) return

      ReactDOM.render(<Panel ref={(ref) => (panelRef.current = ref)} data={data} />, container)
      const startRotateY = -(Math.PI * 2) / 9
      let lastRotateY = 0
    
      tweenProgress(1000)
        .onUpdate(({ progress }) => {
          const needRotateY = (Math.PI / 90) * 11 * progress
          const rotateY = needRotateY - lastRotateY
          css3DObject?.rotateY(rotateY)
          // css3DObject?.rotateZ
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

    // Object.assign(window, {  $dispose: () => {
    //   panelRef.current?.classList.add('hide')
    //   setTimeout(() => dispose?.(), 1500)
    // } })

      const { start, end } = keyframe

      timeoutRef.current = setTimeout(() => {
        panelRef.current?.classList.add('hide')
        timeoutRef.current = setTimeout(() => {
          dispose?.()
          timeoutRef.current = null
        }, 1500)
      }, end - start)
    }

    Object.assign(window, { $callback: callback })

    // setTimeout(() => {callback()}, 8000)
    props.subscribe.on(VreoKeyframeEnum.Custom, callback)

    return () => {
      props.subscribe.off(VreoKeyframeEnum.Custom, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return <div className="vreo-SpatialScenePanel" ref={ref}></div>
}

/** 背景动画：控制延迟 */
function SpatialScenePanelBg() {
  const ref = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  React.useEffect(() => {
    if (!ref.current) return

    const listener = () => {
      ref.current?.setAttribute('class', 'SpatialScenePanel-bg')

      timeoutRef.current = setTimeout(() => {
        ref.current?.setAttribute('class', 'SpatialScenePanel-bg SpatialScenePanel-bg--animation')
        timeoutRef.current = null
      }, 3000)
    }

    ref.current.addEventListener('animationend', listener)

    return () => {
      if (ref.current) ref.current.removeEventListener('animationend', listener)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
  return <div ref={ref} className="SpatialScenePanel-bg SpatialScenePanel-bg--animation"></div>
}

const Panel = React.forwardRef(
  (props: { data: SpatialScenePanelData }, myRef: React.LegacyRef<HTMLDivElement> | undefined) => (
    <div className="SpatialScenePanel" ref={myRef}>
      <div className="SpatialScenePanel-show-area">
        <SpatialScenePanelBg />
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
  )
)


// export function SpatialScenePanel() {
//   // const data = mockData

//   return (
//     <div className="SpatialScenePanel" >
//     <div className="SpatialScenePanel-show-area">
//       <SpatialScenePanelBg />
//       <div className="SpatialScenePanel-header">
//         <div className="SpatialScenePanel-title">{data?.title}</div>
//         <div className="SpatialScenePanel-temperature">{data?.temperature}℃</div>
//       </div>
//       <div className="SpatialScenePanel-body">
//         {data?.stateList?.map((state, index) => (
//           <div key={`scene-${state.text}`} className={`SpatialScenePanel-item index_${index}`}>
//             <img className="SpatialScenePanel-icon" src={state.icon}></img>
//             <div className="SpatialScenePanel-text">{state.text}</div>
//             <div className="SpatialScenePanel-dot"></div>
//           </div>
//         ))}
//       </div>
//     </div>

//     <div className="SpatialScenePanel-disappear-area"></div>
//   </div>
//   )
// }

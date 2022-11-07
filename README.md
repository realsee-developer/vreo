# @realsee/vreo

[![npm version](https://img.shields.io/npm/v/@realsee/vreo.svg?style=flat-square&logo=npm&label=npm%20install%20@realsee/vreo)](https://www.npmjs.com/package/@realsee/vreo)

**Vreo** (VR Video 缩写) 是基于如视三维渲染引擎 [Five](https://unpkg.com/@realsee/five/docs/index.html) 和 用户界面构建库 [React](https://reactjs.org/) 实现的如视 3D 空间剧本播放器。

## 特性

- 相机运镜：支持 3D 空间全景游走、旋转、分镜切换等类似于电影运镜的效果。
- 定制模块：提供弹幕提词、全景标签、视频广告、空间文本等模块定制能力。
- 内置特效：提供全景特效、视频特效、户改动画、模型特效等丰富动态效果。
- 独特的虚拟形象渲染能力：支持用户在 Web 页面模拟虚拟形象，配合语音讲解、相机运镜和定制特效，可实现智能化讲房功能。

> 访问 [Vreo Demo](https://vrlab-static.ljcdn.com/release/web/vreo/index.html?v=1) 体验功能。

## 安装说明

 - 由于 `@realsee/vreo` 依赖 [Five](https://unpkg.com/@realsee/five/docs/index.html) 和 [React](https://reactjs.org/) ，请务必同时安装相关依赖  
 - 根据项目的包管理器来安装：
    ``` bash
    # pnpm
    pnpm install @realsee/vreo @realsee/five react react-dom --save
    # npm
    npm install @realsee/vreo @realsee/five react react-dom --save
    # yarn
    yarn add @realsee/vreo @realsee/five react react-dom
    ```

## 快速上手
引入样式：

```css
  /* @file xxx.css */
  @import '@realsee/vreo/stylesheets/default.css';
```
或
```jsx
  /* @file xxx.tsx | xxx.jsx */
  import '@realsee/vreo/stylesheets/default.css';
```
examples:
```tsx
/* @file index.tsx | index.jsx */
import * as React from 'react'
import { Five } from '@realsee/five'
import { Player } from '@realsee/vreo'
import '@realsee/vreo/stylesheets/default.css';

// 创建 Five 实例
const five = new Five({
  /* Five 配置项 */
})

// 创建 Player 实例
const vreoPlayer = new Player(five)

// 异步请求剧本数据
const vreoUnit = await fetch('api/**/**')

// 加载剧本数据（剧本数据见下文）
vreoPlayer.load(vreoUnit)

// 播放
vreoPlayer.play()

// 暂停
vreoPlayer.pause()
```

## React Context & Hooks 模式使用

**Vreo** 支持 [React Context](https://reactjs.org/docs/context.html) 与 [Hooks](https://reactjs.org/docs/hooks-intro.html) 相配合的模式使用，简单样例如下：

```tsx
/* @file App.tsx */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Five, Work, parseWork } from '@realsee/five'
import { createFiveProvider, FiveCanvas } from '@realsee/five/react'
import { VreoProvider, useVreoAction } from '@realsee/vreo/lib/react'

// 创建 FiveProvider
const FiveProvider = createFiveProvider({
  /* Five 配置项 */
})

// 播放组件
const PlayButton: React.FC = () => {
  const { load, play, pause } = useVreoAction()

  return (
    <>
      <button
        onClick={async () => {
          // 获取讲房数据
          const vreoUnit = await fetch('api/**/**')
          // 载入数据
          await load(vreoUnit)
          // 播放
          play()
        }}
      >
        讲解
      </button>
      <button onClick={() => pause()}>暂停</button>
    </>
  )
}

const App: React.FC = () => {
  return (
    <FiveProvider initialWork={work}>
      <FiveCanvas width={width} height={height} />
      <VreoProvider>
        {/* React 渲染的其他模块 */}
        <PlayButton />
      </VreoProvider>
    </FiveProvider>
  )
}

ReactDOM.render(<App></App>, document.getElementById('app'))
```

## 剧本数据结构

### 结构描述

**VreoUnit** 是剧本数据结构的最小单元，用以描述音视频、剧本帧序列等信息。

**VreoUnit** 数据结构样例如下：

```json
{
  "categoryId": "257ac7a8-b00a-4a1b-88b8-76f93362c0dc",
  "categoryText": "讲房源户型",
  "video": {
    "duration": 106278,
    "start": 0,
    "end": 106278,
    "url": "//url-host/***/xxx.mp4" // "url" 如果是空字符串，则以 `AudioLike` 的逻辑进行执行。
  },
  "keyframes": [
    {
      "uuid": "ac70621b-4e00-442e-311c-befb5bd3f87f",
      "type": "PanoTextLabel",
      "start": 27060,
      "end": 42351,
      "parsed": false,
      "data": {
        "text": "戏剧人生",
        "vertex": {
          "x": -0.8879207391906447,
          "y": 0.3829881941156301,
          "z": -1.8068334368800785
        },
        "fontSize": 16
      }
    },
    {
      "uuid": "ec1bbe11-ffee-4fe1-5823-46b6cad4e7d8",
      "type": "ModelVideo",
      "start": 17452,
      "end": 74901,
      "parsed": false,
      "data": {
        "videoSrc": "//url-host/release/web/videos/tv_ads/360/009.mp4",
        "videoPosterSrc": "//url-host/release/web/videos/posters/002.9203cf99.jpg",
        "vertexs": [
          {
            "x": 0.07203829865103632,
            "y": 0.8215782650149405,
            "z": -1.7994856093044471
          },
          {
            "x": 0.08971605109132826,
            "y": -0.2930481300912484,
            "z": -1.798372293401237
          },
          {
            "x": 2.367235599574914,
            "y": -0.296526676652792,
            "z": -1.7934272967593008
          },
          {
            "x": 2.3601990173854315,
            "y": 0.8691239478108612,
            "z": -1.7949685793090848
          }
        ]
      }
    },
    {
      "uuid": "f9245b1b-ca8d-4a6c-5616-d53cd9cf8c3c",
      "type": "PanoTag",
      "start": 988,
      "end": 69803,
      "parsed": false,
      "data": {
        "text": "一蓑烟雨任平生",
        "vertex": {
          "x": 3.4119340861387304,
          "y": 0.1283617853353691,
          "z": -0.6533418002816742
        },
        "type": "Image",
        "imgUrl": "//url-host/release/web/cat_music.f68fb9bb.gif"
      }
    },
    {
      "uuid": "d16138f3-fad1-412e-2df0-f66b61e0b38e",
      "type": "PanoEffect",
      "start": 2598,
      "end": 7955,
      "parsed": false,
      "data": {
        "twoVertexs": [
          {
            "x": 0.04138994383630945,
            "y": -1.323667318114752,
            "z": 2.7873723200461096
          },
          {
            "x": -2.804123324007684,
            "y": -1.3249364005914073,
            "z": 3.068840643805892
          }
        ],
        "effect": "Distance"
      }
    }
  ]
}
```

**VreoUnit** 的字段说明：

- `categoryId`、`categoryText`: 讲解的类别标识符和描述。
- `video`: 虚拟视频人物视频素材。

  - `duration`: 视频长度。
  - `start`: 开始时间戳。
  - `end`: 结束时间戳。
  - `url`: 视频 CDN 地址。

> 注意事项：**视频素材必须是绿幕背景**。

- `keyframes`：剧本帧集合。

  - `uuid`: 剧本帧 `uuid`。
  - `type`: 剧本帧类别枚举，详见下文 **剧本关键帧** 部分。
  - `start`: 触发时间戳。
  - `end`: 结束时间戳。
  - `parsed`: 解析状态。
  - `data`: 当前剧本帧类别数据依赖。

> **如何获取剧本数据？**
> 剧本服务及剧本编辑器公开版本尚在开发中，敬请期待。

### 剧本帧说明

**Vreo** 剧本行为是按照剧本关键帧来执行的，即根据音视频播放的时间序列命中剧本帧后，按照剧本帧的类型执行相机运镜、全景标签、模型特效等动作。

> 目前支持多种类型剧本关键帧（详见：[Player.VreoKeyframeEnum](https://realsee-developer.github.io/vreo/enums/Player.VreoKeyframeEnum.html)），后续会不断完善及添加新的剧本关键帧行为。

**Vreo** 内置了每一个剧本关键帧的 UI 动作行为，通过 `vreoplayer.on()` 可监听到相应的剧本关键帧的命中时机，并按需添加业务逻辑。

### 剧本关键帧

#### 相机运镜

**相机运镜** 控制相机实现镜头位移、旋转、模态切换等模拟如视 3D 空间漫游的能力。

```ts
type CameraMovementData = {
  effect: CameraMovementEffect // 运镜效果
  mode: Mode // Five.Mode
  panoIndex: number // 目标点位
  loop?: boolean // 是否循环
  rotateSpeed?: number // 旋转速度
  rotation?: Rotation // 旋转方向
} & Partial<Pose> // Partial<Pose> 视角信息
```

#### 弹幕提词

**弹幕提词** 提供语音字幕文本，多用于强调某一句文本。

```ts
type PrompterData = {
  text: string // 文本，建议长度 32(汉字) 以内
}
```

#### 空间文本

**空间文本** 在如视 3D 模型空间中某一个三维坐标点上展示的一段文本。

```ts
type PanoTextLabelData = {
  text: string // 空间文本
  vertex: Vertex // 三维坐标点
  fontSize?: number // 文本字体大小，默认 16px
}
```

#### 信息面板

**信息面板** 以弹框或抽屉面板的形式展示图片、音视频等素材内容。

```ts
type InfoPanelData = {
  type: InfoPanelTypeEnum // 面板类型
  url: string // 素材静态资源地址
}
```

#### 全景标签

**全景标签** 在如视 3D 空间全景游走模态下展示文本、图片、视频等标签内容。全景标签的出现会附带一个生长动画。

```ts
enum PanoTagEnum { // 标签类型枚举
  Text = 'Text',
  Image = 'Image',
}

type PanoTagData = {
  type: PanoTagEnum // 标签类型
  text: string // 文本
  vertex: Vertex // 标签在全景游走模态中的三维坐标点
  imgUrl?: string // 图片资源地址
}
```

#### 全景特效

**全景特效** 指在如视 3D 空间全景游走模态下执行某些特效。

目前仅支持测量长度的特效。比如，在全景游走模态下标注出窗户的宽度信息。

```ts
enum PanoEffectEnum { // 特效枚举
  // 两点距离
  Distance = 'Distance',
}

type PanoEffectData = {
  effect: PanoEffectEnum // 特效类型
  twoVertexs: [Vertex, Vertex] // 两个点坐标值
}
```

#### 模型特效

> 规划中，敬请期待。

#### 户改动画

> 规划中，敬请期待。

#### 更换全景

**更换全景** 可以动态修改某个点位的全景图片。

```ts
export type UpdateVRPanoramaData = {
  _signature: string // 签名字段
  allow_hosts: string[] // 域名白名单
  certificate: string // 签名值
  expire_at: string // 过期时间
  // 动态场景
  dynamic_scene?: {
    images: { // 切换全景的图片
      index: number // 对应的全景点位
      right: string
      left: string
      up: string
      down: string
      front: string
      back: string
    }
  }
  [key: string]: any
}
```

比如，您可以拍摄某个房间开灯与关灯两个场景的全景，通过动态切换可以营造出全景中开灯、关灯的效果。

同样的，如果您在同一个位置分别拍摄了早晨、上午、中午、下午、傍晚、深夜的全景图片，就可以营造出该位置在一天中不同时间段的光照效果。

#### 视频广告

**视频广告** 如果在如视 3D 空间模型中有电视、显示器、壁画等这类物品，可以在这些矩形区域播放一段视频。

```ts
// 四个顶点元组
type QuadrangleVertexs = [Vertex, Vertex, Vertex, Vertex]

type ModelVideoData = {
  videoSrc: string // 视频素材
  videoPosterSrc: string // 视频封面
  vertexs: QuadrangleVertexs // 视频映射在模型中的坐标点
}
```

#### 视频特效

**视频特效** 是基于视频实现的动画效果，视频的每一帧都与 VR 全景位置完全贴合。

某些变形动画（比如开冰箱动作这类）可以采用视频特效来实现。

```ts
type VideoEffectData = {
  videoSrc: string // 视频地址
  panoIndex: number // 所处点位
  fov: number // 镜头远近
  direction?: Vertex // 方向向量: {x, y, z} 形式
  vector?: Pick<Pose, 'longitude' | 'latitude'> // 方向向量: 向量坐标
}
```

#### 背景音乐

**背景音乐** 给剧本添加一段背景音乐（背景音乐会与讲稿音频并行播放）。

```ts
export type BgMusicData = {
  url: string // .mp3 背景音乐 CDN 地址
}
```


### 自定义剧本帧行为

**Vreo** 中的剧本帧行为是内置的，但如果您有强烈的诸如统一 UI 风格类的诉求，不想使用内置剧本逻辑，也可以通过 `new Player(five, {keyframeMap: {PanoTag: false}})` 来禁用内置剧本帧解析，然后通过监听剧本帧触发事件来补充您自己的剧本 UI 行为。

比如，禁用全景标签的解析：

```ts
const vreoplayer = new Player(five, {
  keyframeMap: {
    PanoTag: false /* 禁用了全景标签的解析 */,
  },
})

const callback = (keyframe: VreoKeyframe) => {
  /* 您自己的业务逻辑：全景标签的模块 */
}
// 添加监听
vreoplayer.on(VreoKeyframeEnum.PanoTag, callback)
// 关闭监听
vreoplayer.off(VreoKeyframeEnum.PanoTag, callback)
```

目前仅 DOM 相关的剧本关键帧支持自定义，与 3D 空间模型相关的内容（如：运镜、特效等）尚不支持用户自定义，请采用内置方案。

### 自定义剧本帧

除了默认内置的剧本帧之外，**Vreo** 支持自定义剧本帧。你可以将剧本帧类型设定为 `VreoKeyframeEnum.Custom`，然后通过监听 `vreoplayer.on(VreoKeyframeEnum.Custom, callback)` 剧本事件去解析你自己定义的剧本行为。

此外，你也可以实现个 `React` 组件，例如：

```ts
export function YourCustomKeyframe(props: CustomVreoKeyframeProps) {

  React.useEffect(() => {
    props.subscribe.on(VreoKeyframeEnum.Custom, callback)

    return () => {
      props.subscribe.off(VreoKeyframeEnum.Custom, callback)
    }
  }, [])

  return <>...</>
}
```

然后通过 `new Player(five, {customKeyframes: [YourCustomKeyframe]})` 配置参数添加进去即可。

## 注意事项

### 兼容性

浏览器对视频自动播放有严格的限制（播放行为必须由用户触发），`@realsee/vreo` 内部已经最大限度规避了浏览器对视频自动播放的限制。

但是规避 [微信浏览器中音视频自动播放限制](https://developers.weixin.qq.com/community/develop/doc/000e640d77cfa001132a6cb8456c01) 需要调用 [微信 JS-SDK](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html) 触发`WeixinJSBridgeReady`事件后才能实现。

虽然 `@realsee/vreo` 并不依赖 [微信 JS-SDK](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html) ，但您可以提前创建`HTMLVideoElement`实例，然后再在初始化`vreoplayer`实例时通过配置项指定 `HTMLVideoElement`实例，可参考：

```ts
// 创建 HTMLVideoElement 实例
const creatVideo = (): HTMLVideoElement => {
  const video = document.createElement('video')

  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('autoplay', 'true')

  return video
}

const creatAudio = (): HTMLVideoElement => {
  const audio = document.createElement('audio')

  audio.setAttribute('autoplay', 'true')

  return audio
}

// 提前创建 Video
// 视频特效
const videoEffect = creatVideo()
// 视频广告
const modelTVVideo = creatVideo()
// 视频数字人形象
const videoInstance = creatVideo()
// 无数字人，仅音频
const audioInstance = createAudio()

// 微信限制：需在 WeixinJSBridgeReady 回调中触发一次
document.addEventListener(
  'WeixinJSBridgeReady',
  () => {
    videoEffect.play()
    modelTVVideo.play()
    videoInstance.play()
    audioInstance.play()
  },
  false
)

// 创建 Player 实例
const vreoplayer = new Player(five, {
  videos: {
    videoEffect, // 视频特效 时依赖的 HTMLVideoElement
    modelTVVideo, // 视频广告 时依赖的 HTMLVideoElement
  },
  videoAgentMeshOptions: {
    videoInstance,
    audioInstance,
  }
})
```

这样，在微信浏览器或微信小程序 `WebView` 中也能正常使用自动播效果。

### 性能优化

提高播放性能目前有两个策略：降低贴图分辨率和提前预载。

#### 降低图片分辨率

可以设置 `five.imageOptions.size` 来降低渲染引擎的贴图尺寸，这样下载速度会变快且内存占用也会降低。
你也可以配置 **Vreo** 参数来达到类似的效果：

```ts
const vreoplayer = new Player(five, { imageOptions: { size: 1024 } })
```

#### 提前预载

如果网络不稳定，可以提前预载静态资源，这样播放过程中不会卡顿：

```ts
// 全局预载
const vreoplayer = new Player(five, { autoPreload: true })

// 针对某一份剧本数据预载
vreoplayer.load(vreoUnit, 0, true)

```

Enjoy it!

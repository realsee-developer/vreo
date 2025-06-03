# 🎮 Vreo Playground 深度解读

本文档详细分析现有的 `__test__` 目录，它实际上是一个功能完善的 Playground，用于开发、测试和演示 Vreo 播放器的各种功能。

## 📁 整体架构分析

### 目录结构总览

```
__test__/                                    # 🎮 Playground 根目录
├── main.tsx                                # 基础版本入口 (Five + Player)
├── main-react.tsx                          # React版本入口 (VreoProvider + SpatialScenePanel)
├── main-react-dynamic.tsx                  # 动态创建/销毁版本
├── main-react-partial.tsx                  # 部分容器版本 (非全屏)
├── App.tsx                                 # 基础播放器应用组件
├── AppReact.tsx                            # React版本应用组件
├── index.css                               # 全局样式文件
├── components/                             # 📦 共享组件
│   ├── ResponsiveFiveCanvas.tsx            # 响应式全屏画布
│   └── ResponsiveFullScreenFiveCanvas.tsx  # 响应式画布 (简化版)
├── data/                                   # 📊 测试数据集
│   ├── vreo-units/                         # VreoUnit 剧本数据 (20+个测试用例)
│   ├── works/                              # Five Work 场景数据
│   └── midea/                              # 美的相关测试数据
├── examples/                               # 💡 功能示例
│   ├── App.tsx                             # 示例应用入口
│   ├── player.tsx                          # 功能分类展示播放器
│   ├── data.ts                             # 示例数据
│   ├── work.ts                             # 示例场景数据
│   ├── index.tsx                           # 示例入口
│   └── index.css                           # 示例样式
├── PlayController/                         # 🎬 播放控制器独立测试
│   ├── App.tsx                             # PlayController 测试应用
│   ├── main.tsx                            # PlayController 入口
│   ├── work.json                           # 测试场景数据
│   └── index.css                           # PlayController 样式
└── shared-utils/                           # 🛠️ 测试工具函数
    └── debounce.ts                         # 防抖函数
```

## 🚀 入口文件分析

### 1. main.tsx - 基础版本

**用途**: 最基础的 Vreo 播放器演示，直接使用 Five 和 Player 类

**核心特性**:
- 使用 Five Provider 提供 3D 渲染环境
- 直接实例化 Player 类进行播放控制
- 加载指定的 Work 和 VreoUnit 数据
- 提供基础的播放/暂停功能

**关键代码结构**:
```typescript
// Five 初始化配置
const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024 },
  textureOptions: { size: 64 },
  onlyRenderIfNeeds: true,
  antialias: false,
}

// 应用结构
<FiveProvider initialWork={parseWork(work)}>
  <ResponsiveFullScreenFiveCanvas />  {/* 3D 渲染画布 */}
  <App />                            {/* 播放器控制界面 */}
</FiveProvider>
```

### 2. main-react.tsx - React 集成版本

**用途**: 演示 React 集成方式，使用 VreoProvider 和自定义关键帧

**核心特性**:
- 集成 VreoProvider 提供 React 上下文
- 支持自定义关键帧 (SpatialScenePanel)
- 使用 React Hooks 进行状态管理
- 展示 React 集成的最佳实践

**关键代码结构**:
```typescript
<FiveProvider initialWork={parseWork(work)}>
  <ResponsiveFullScreenFiveCanvas />
  <VreoProvider configs={{
    customKeyframes: [SpatialScenePanel]  // 自定义关键帧注册
  }}>
    <App />
  </VreoProvider>
</FiveProvider>
```

### 3. main-react-dynamic.tsx - 动态创建销毁

**用途**: 测试播放器的动态创建和销毁，验证内存泄漏和资源清理

**核心特性**:
- 动态创建和销毁整个播放器实例
- 测试组件的生命周期管理
- 验证资源清理的完整性
- 提供调试按钮控制创建/销毁

**独特功能**:
```typescript
function DynamicDebug() {
  const [state, setState] = React.useState(false)
  
  return (
    <>
      <button onClick={() => setState(!state)}>
        {state ? '销毁' : '创建'}
      </button>
      {state ? <VreoPlayerComponent /> : <></>}
    </>
  )
}
```

### 4. main-react-partial.tsx - 部分容器版本

**用途**: 演示非全屏容器中的播放器使用，测试容器适应性

**核心特性**:
- 在指定尺寸容器中渲染播放器 (800x600)
- 测试容器自适应和响应式布局
- 演示播放器的灵活集成方式
- 验证在受限空间中的表现

**容器配置**:
```typescript
<div style={{
  position: 'absolute',
  left: '50%', top: '50%',
  width: '800px', height: '600px',
  transform: 'translate(-50%, -50%)',
  overflow: 'hidden',
}}>
  <VreoProvider configs={{
    container: ref.current!  // 指定容器
  }}>
    <App />
  </VreoProvider>
</div>
```

## 🎯 应用组件分析

### App.tsx - 基础播放器应用

**功能概述**: 直接使用 Player 类的基础播放器控制界面

**核心实现**:
```typescript
export function App() {
  const ref = React.useRef<Player>()
  const five = unsafe__useFiveInstance()
  const [state, setState] = React.useState(PlayerState.notReady)

  React.useEffect(() => {
    // 创建播放器实例
    const player = new Player(five)
    ref.current = player
    
    // 绑定事件监听
    player.on('loaded', () => console.log('loaded'))
    player.on('paused', () => setState(PlayerState.paused))
    player.on('playing', () => setState(PlayerState.playing))
    
    // 全局调试访问
    Object.assign(window, { $player: player })
  }, [])

  return (
    <button onClick={async () => {
      // 播放/暂停逻辑
      if (state === PlayerState.ready) {
        ref.current?.show()
        await ref.current?.load(data as VreoUnit)
      }
      if (state !== PlayerState.playing) {
        ref.current?.play()
      } else {
        ref.current?.pause()
      }
    }}>
      {state !== PlayerState.playing ? '播放' : '暂停'}
    </button>
  )
}
```

**状态管理**:
```typescript
enum PlayerState {
  notReady = 'notReady',  // 播放器未初始化
  ready = 'ready',        // 播放器已就绪
  paused = 'paused',      // 暂停状态
  playing = 'playing',    // 播放状态
}
```

### AppReact.tsx - React 集成应用

**功能概述**: 使用 React Hooks 的现代化播放器控制界面

**核心实现**:
```typescript
export function App() {
  const loaded = React.useRef(false)
  const { show, play, hide, pause, load } = useVreoAction()
  const paused = useVreoPausedState()

  return (
    <button onClick={async () => {
      if (!paused) {
        pause()
        hide()
        return
      }
      
      show()
      if (!loaded.current) {
        loaded.current = true
        load(data as VreoUnit)
      } else {
        play()
      }
    }}>
      {paused ? '播放' : '暂停'}
    </button>
  )
}
```

**使用的 React Hooks**:
- `useVreoAction()`: 获取播放器控制方法
- `useVreoPausedState()`: 获取播放器暂停状态

## 📊 测试数据分析

### VreoUnit 测试数据集

位于 `__test__/data/vreo-units/`，包含 20+ 个测试用例，覆盖各种场景：

| 文件名 | 用途 | 特点 |
|--------|------|------|
| `vreo-unit-a.ts` | 完整功能测试 | 包含弹层视频，24KB，849行 |
| `vreo-unit-b.ts` | 基础功能测试 | 标准剧本，4KB，144行 |
| `vreo-unit-b-avatar.ts` | 头像音频测试 | 虚拟形象相关 |
| `vreo-unit-b-noaudio.ts` | 无音频测试 | 测试静默播放 |
| `vreo-unit-novideo.ts` | 无视频测试 | 纯音频剧本 |
| `vreo-unit-single-bgm.ts` | 背景音乐测试 | 单一背景音乐 |
| `vreo-unit-videoEffect.ts` | 视频特效测试 | 视频效果演示 |
| `vreo-unit-muti-audio-test.ts` | 多音频测试 | 多轨音频处理 |
| `vreo-XQeernmw.ts` | 生产环境数据 | 真实业务数据 |
| `80Lykj3NW2RGgMrG06.ts` | 大型数据测试 | 35KB，1466行 |

### 数据组织模式

**标准 VreoUnit 结构**:
```typescript
export const data: VreoUnit = {
  categoryId: 'agent_navigation',
  categoryText: '经纪人讲房',
  frontRequestId: '具体ID',
  index: 0,
  video: {
    url: '音频/视频文件URL',
    start: 0,
    end: 130724,
    duration: 130724,
  },
  keyframes: [
    // 各种关键帧数据
    {
      uuid: 'uuid',
      type: VreoKeyframeEnum.CameraMovement,
      start: 1000,
      end: 5000,
      data: { /* 关键帧具体数据 */ }
    }
  ]
}
```

## 💡 Examples 功能演示

### 分类功能展示

位于 `__test__/examples/player.tsx`，提供按功能分类的演示：

```typescript
const funcList = [
  { id: 'camera_movement', name: '相机运镜', data: CameraMovementData },
  { id: 'pano_tag', name: '全景标签', data: PanoTagData },
  { id: 'model_video', name: '视频投放', data: ModelVideoData },
  { id: 'video_effect', name: '视频特效', data: VideoEffectData },
  { id: 'bgm', name: '背景音乐', data: BgMusicData },
]
```

**交互逻辑**:
```typescript
export function VreoPlayer() {
  const [playerState, setPlayerState] = React.useState<PlayerState>(PlayerState.notReady)

  const handleVreoFunction = (value: any, e: any) => {
    if (!vreoPlayerRef.current) return
    // 加载特定功能的剧本数据
    vreoPlayerRef.current.load(value, 0, false, true)
  }

  return (
    <div className="btns">
      {playerState !== PlayerState.playing &&
      funcList.map((item) => (
        <button key={item.id} onClick={(e) => handleVreoFunction(item.data, e)}>
          {item.name}
        </button>
      ))}
      {playerState === PlayerState.playing && 
        <button onClick={handlePause}>暂停</button>
      }
    </div>
  )
}
```

## 🎬 PlayController 独立测试

### 功能概述

位于 `__test__/PlayController/`，专门测试播放控制器的独立使用：

**核心特性**:
- 全局单例播放控制器
- 动态数据加载和解析
- 实时进度显示
- 自定义关键帧处理

### 实现分析

**播放控制器初始化**:
```typescript
// 全局单例：可以放置在您的 Store/Controller 层里面
const playController = new PlayController()
Object.assign(window, { $playController: playController })
```

**动态数据构造**:
```typescript
// 构造讲房数据
const vreoUnit: VreoUnit = {
  categoryId: 'agent_navigation',
  categoryText: '经纪人讲房',
  video: {
    url: '//vrlab-public.ljcdn.com/release/vradmin/media/047b652f-bc01-487a-231e-2549595b5a85.mp3',
    duration: 130724,
  },
  keyframes: []
}

// 动态加载序列帧数据
const json = await fetch('//vrlab-public.ljcdn.com/release/vradmin/media/f8e6ebf8-ad0b-41e2-16b2-6ded49cda037.json')
const tracks = (await json.json()).track

// 将序列帧转换为关键帧
const keyframes = tracks.map((track: Record<string, any>) => ({
  uuid: '',
  type: VreoKeyframeEnum.Custom,
  start: track.currentTime,
  data: Object.assign({ type: 'AgentNavigation' }, track)
}))
```

**自定义关键帧处理**:
```typescript
export function YourHandler() {
  const five = unsafe__useFiveInstance()

  React.useEffect(() => {
    const hanlder = (vreoKeyframe: VreoKeyframe) => {
      // 只处理自定义类型的关键帧
      if (vreoKeyframe.type !== VreoKeyframeEnum.Custom) return
      
      const data = vreoKeyframe.data
      if (data.type !== 'AgentNavigation') return

      // 相机控制
      if (data.camera) {
        five.updateCamera({
          fov: data.camera.fov,
          longitude: data.camera.longitude,
          latitude: data.camera.latitude,
        }, 0)
      }
      
      // 点位切换
      if (data.position?.panoIndex && data.position.panoIndex !== five.panoIndex) {
        five.moveToPano(data.position.panoIndex)
      }
    }

    playController.on(VreoKeyframeEnum.Custom, hanlder)
    return () => playController.off(VreoKeyframeEnum.Custom, hanlder)
  }, [])
}
```

## 🧩 共享组件分析

### ResponsiveFiveCanvas.tsx

**用途**: 响应式 Five 画布组件，适配不同容器尺寸

**核心实现**:
```typescript
export function ResponsiveFiveCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const five = unsafe__useFiveInstance()

  React.useEffect(() => {
    if (!canvasRef.current || !five) return

    five.setCanvas(canvasRef.current)
    
    const handleResize = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement!
        five.changeSize(clientWidth, clientHeight)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [five])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
```

### ResponsiveFullScreenFiveCanvas.tsx

**用途**: 全屏响应式画布的简化版本

```typescript
export function ResponsiveFullScreenFiveCanvas() {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <ResponsiveFiveCanvas />
    </div>
  )
}
```

## 🎨 样式系统分析

### index.css - 全局样式

**核心样式定义**:
```css
/* 全屏布局 */
html, body, #root {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 控制按钮样式 */
.btns {
  position: absolute;
  right: 36px;
  top: 36px;
}

.btns button {
  background: #1f8dd6;
  border: 1px solid #1f8dd6;
  color: #fff;
  padding: 0.5em 1em;
  border-radius: 3px;
  cursor: pointer;
}
```

## 🔍 数据切换机制

### 注释切换模式

Playground 采用注释切换的方式来快速切换不同的测试数据：

```typescript
// import { data } from './data/vreo-units/vreo-unit-a'
// import { data } from './data/vreo-units/vreo-XQeernmw'
// import { data } from './data/vreo-units/vreo-unit-test-video'

// 弹层视频
// import { data1 as data } from './data/vreo-units/vreo-unit-a'

import { data } from './data/vreo-units/vreo-unit-PjVVGxn2'

// 无视频版本
// import { data } from './data/vreo-units/vreo-unit-b'
```

**优势**:
- 快速切换测试场景
- 保留所有测试用例的访问路径
- 便于开发者调试不同功能

## 🛠️ 工具函数

### shared-utils/debounce.ts

```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}
```

## 🎯 Playground 的核心价值

### 1. 功能验证平台
- **完整功能覆盖**: 涵盖 Player、PlayController、React 集成等所有功能
- **边界情况测试**: 动态创建/销毁、部分容器、无音频/视频等
- **性能测试**: 大型数据加载、长时间播放等

### 2. 开发调试工具
- **快速原型验证**: 通过注释切换快速测试不同场景
- **实时调试**: 全局变量暴露，便于控制台调试
- **错误排查**: 各种边界情况的测试用例

### 3. 集成示例参考
- **多种集成方式**: 基础版本、React版本、PlayController独立使用
- **最佳实践展示**: React Hooks 使用、事件处理、状态管理
- **容器适配示例**: 全屏、部分容器、响应式布局

### 4. 文档和演示
- **功能分类展示**: examples 中的按功能分类演示
- **交互式文档**: 可运行的代码示例
- **用户体验验证**: 真实的用户交互流程

## 📋 重构考虑要点

### 1. 保留现有价值
- **测试数据集**: 20+ 个 VreoUnit 测试用例具有很高价值
- **多种集成方式**: 基础版本、React版本、PlayController 的演示
- **边界情况测试**: 动态创建/销毁、部分容器等测试场景

### 2. 优化改进方向
- **目录结构**: 更清晰的组织方式，按功能和场景分类
- **数据管理**: 统一的测试数据管理和配置
- **组件复用**: 提取更多可复用的组件和工具
- **开发体验**: 热更新、错误处理、调试工具等

### 3. 现代化升级
- **构建工具**: 集成到 Monorepo 的构建系统中
- **类型安全**: 完善的 TypeScript 类型定义
- **测试集成**: 将 Playground 与自动化测试结合
- **文档生成**: 从 Playground 自动生成使用文档

---

📅 **文档创建时间**: 2024年12月  
👥 **分析对象**: `__test__/` Playground 目录  
📧 **联系方式**: developer@realsee.com

> 💡 **总结**: 现有的 `__test__` 目录实际上是一个功能完善、结构合理的 Playground，包含了丰富的测试用例、多种集成方式和边界情况测试。在 Monorepo 重构中应该充分保留其价值，并在此基础上进行现代化升级。 
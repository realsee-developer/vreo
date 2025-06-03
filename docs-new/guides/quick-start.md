# 🚀 快速上手指南

本指南将帮助您在 5 分钟内运行第一个 Vreo 播放器示例。

## 📋 前置要求

- Node.js >= 16.0.0
- 现代浏览器（支持 WebGL）
- 基础的 React 和 TypeScript 知识

## 📦 安装

### 使用 npm
```bash
npm install @realsee/vreo @realsee/five react react-dom --save
```

### 使用 yarn
```bash
yarn add @realsee/vreo @realsee/five react react-dom
```

### 使用 pnpm
```bash
pnpm install @realsee/vreo @realsee/five react react-dom
```

## 🎯 基础示例

### 1. 引入样式文件

```css
/* 在您的 CSS 文件中 */
@import '@realsee/vreo/stylesheets/default.css';
```

或在 JavaScript/TypeScript 文件中：

```typescript
import '@realsee/vreo/stylesheets/default.css';
```

### 2. 创建基础播放器

```typescript
import * as React from 'react'
import { Five } from '@realsee/five'
import { Player } from '@realsee/vreo'

// 创建 Five 实例
const five = new Five({
  // Five 配置选项
})

// 创建 Vreo 播放器实例
const vreoPlayer = new Player(five, {
  autoPreload: true,
  imageOptions: { size: 1024 }
})

// 示例剧本数据
const vreoUnit = {
  categoryId: "example-category",
  categoryText: "示例讲房",
  video: {
    duration: 30000,
    start: 0,
    end: 30000,
    url: "https://example.com/video.mp4"
  },
  keyframes: []
}

// 加载并播放
async function startPlay() {
  await vreoPlayer.load(vreoUnit)
  vreoPlayer.play()
}

// 开始播放
startPlay()
```

### 3. React 集成示例

```tsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Five } from '@realsee/five'
import { createFiveProvider, FiveCanvas } from '@realsee/five/react'
import { VreoProvider, useVreoAction } from '@realsee/vreo/lib/react'
import '@realsee/vreo/stylesheets/default.css'

// 创建 Five Provider
const FiveProvider = createFiveProvider({
  // Five 配置选项
})

// 播放控制组件
const PlayControls: React.FC = () => {
  const { load, play, pause, playing } = useVreoAction()

  const handlePlay = async () => {
    if (!playing) {
      // 这里可以加载真实的剧本数据
      const vreoUnit = await fetch('/api/vreo-unit').then(res => res.json())
      await load(vreoUnit)
      play()
    } else {
      pause()
    }
  }

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
      <button onClick={handlePlay}>
        {playing ? '暂停' : '播放'}
      </button>
    </div>
  )
}

// 主应用组件
const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <FiveProvider>
        <FiveCanvas width="100%" height="100%" />
        <VreoProvider>
          <PlayControls />
        </VreoProvider>
      </FiveProvider>
    </div>
  )
}

// 渲染应用
ReactDOM.render(<App />, document.getElementById('app'))
```

## 🎮 基础功能演示

### 播放控制

```typescript
// 播放
vreoPlayer.play()

// 暂停
vreoPlayer.pause()

// 跳转到指定时间（毫秒）
vreoPlayer.play(5000)

// 获取当前播放时间
const currentTime = vreoPlayer.getCurrentTime()

// 检查播放状态
const isPlaying = !vreoPlayer.paused
```

### 事件监听

```typescript
// 监听播放开始
vreoPlayer.on('playing', () => {
  console.log('播放开始')
})

// 监听播放暂停
vreoPlayer.on('paused', () => {
  console.log('播放暂停')
})

// 监听播放结束
vreoPlayer.on('paused', (isEnded) => {
  if (isEnded) {
    console.log('播放结束')
  }
})
```

## 🔧 常见配置

### 播放器配置选项

```typescript
const player = new Player(five, {
  // 自动预加载资源
  autoPreload: true,
  
  // 图片质量配置
  imageOptions: { 
    size: 1024 // 图片尺寸
  },
  
  // 自定义容器
  container: document.getElementById('vreo-container'),
  
  // 自定义关键帧组件
  customKeyframes: [CustomKeyframeComponent],
  
  // 关键帧映射
  keyframeMap: {
    'CustomType': CustomKeyframeComponent
  }
})
```

## 🎨 样式自定义

您可以通过 CSS 变量自定义播放器外观：

```css
.vreo-app {
  --vreo-primary-color: #007bff;
  --vreo-background-color: #000;
  --vreo-text-color: #fff;
  --vreo-border-radius: 4px;
}
```

## 📱 响应式设计

```tsx
const ResponsivePlayer: React.FC = () => {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <FiveCanvas 
      width={dimensions.width} 
      height={dimensions.height} 
    />
  )
}
```

## 🚨 常见问题

### Q: 播放器无法正常显示？
A: 请确保：
1. 正确引入了样式文件
2. Five 实例已正确初始化
3. 容器元素有合适的尺寸

### Q: 视频无法播放？
A: 请检查：
1. 视频 URL 是否可访问
2. 浏览器是否支持该视频格式
3. 是否有 CORS 限制

### Q: 在移动设备上表现异常？
A: 移动设备可能需要用户手势才能播放媒体，请确保在用户交互后开始播放。

## 🔗 下一步

- 📖 阅读 [基础概念](./basic-concepts.md) 了解 Vreo 的核心理念
- 🎓 查看 [基础教程](../tutorials/basic-tutorial.md) 学习更多功能
- 💡 浏览 [示例代码](../examples/) 获取更多灵感
- 📘 查阅 [API 文档](../api/) 了解详细接口

---

🎉 恭喜！您已经成功运行了第一个 Vreo 播放器。现在可以开始探索更多高级功能了！ 
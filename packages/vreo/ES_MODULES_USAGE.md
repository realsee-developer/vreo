# @realsee/vreo ES Modules 使用指南

## 安装

```bash
npm install @realsee/vreo
# 或
yarn add @realsee/vreo
# 或
pnpm add @realsee/vreo
```

## 在不同项目中使用

### 1. Vite 项目

```typescript
// main.ts 或 main.js
import { Player } from '@realsee/vreo'
import { VreoProvider, useVreoAction } from '@realsee/vreo/react'

// 导入样式文件
import '@realsee/vreo/stylesheets/default.css'
// 如果需要SpatialScenePanel样式
import '@realsee/vreo/stylesheets/custom/SpatialScenePanel.css'

// 使用播放器
const player = new Player(five, {
  autoPreload: true,
  imageOptions: { size: 1024 }
})

// React 组件中使用
function VreoComponent() {
  const { load, play, pause } = useVreoAction()
  
  const handleLoad = async () => {
    await load(vreoUnit)
    play()
  }
  
  return <button onClick={handleLoad}>加载并播放</button>
}

// App.tsx
import { FiveProvider } from '@realsee/five/react'

function App() {
  return (
    <FiveProvider>
      <VreoProvider configs={{ autoPreload: true }}>
        <VreoComponent />
      </VreoProvider>
    </FiveProvider>
  )
}
```

### 2. Next.js 项目

```typescript
// pages/_app.tsx 或 app/layout.tsx
import { Player } from '@realsee/vreo'
import type { AppProps } from 'next/app'

// 导入样式文件
import '@realsee/vreo/stylesheets/default.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

// 组件中使用 (需要动态导入)
import dynamic from 'next/dynamic'

const VreoPlayer = dynamic(
  () => import('../components/VreoPlayer'),
  { ssr: false }
)

// components/VreoPlayer.tsx
import { useEffect, useState } from 'react'
import { Player } from '@realsee/vreo'
import { VreoProvider } from '@realsee/vreo/react'

export default function VreoPlayer() {
  const [five, setFive] = useState(null)
  
  useEffect(() => {
    // 初始化 Five 引擎
    const fiveInstance = new Five({
      // Five 配置
    })
    setFive(fiveInstance)
  }, [])
  
  if (!five) return <div>Loading...</div>
  
  return (
    <FiveProvider five={five}>
      <VreoProvider>
        <YourVreoComponent />
      </VreoProvider>
    </FiveProvider>
  )
}
```

### 3. Create React App 项目

```typescript
// src/App.tsx
import React from 'react'
import { Player } from '@realsee/vreo'
import { VreoProvider, useVreoAction, useVreoEventCallback } from '@realsee/vreo/react'
import { FiveProvider } from '@realsee/five/react'

// 导入样式文件
import '@realsee/vreo/stylesheets/default.css'

function VreoController() {
  const { load, play, pause, show, hide } = useVreoAction()
  
  // 监听播放事件
  useVreoEventCallback('playing', () => {
    console.log('开始播放')
  })
  
  useVreoEventCallback('paused', () => {
    console.log('暂停播放')
  })
  
  const handleLoadScript = async () => {
    const vreoUnit = {
      // 你的剧本数据
    }
    await load(vreoUnit, 0)
    play()
  }
  
  return (
    <div>
      <button onClick={handleLoadScript}>加载剧本</button>
      <button onClick={pause}>暂停</button>
      <button onClick={() => show()}>显示</button>
      <button onClick={() => hide()}>隐藏</button>
    </div>
  )
}

function App() {
  const [five, setFive] = useState(null)
  
  useEffect(() => {
    // 初始化 Five 引擎
    const fiveInstance = new Five({
      // 配置选项
    })
    setFive(fiveInstance)
  }, [])
  
  if (!five) return <div>初始化中...</div>
  
  return (
    <FiveProvider five={five}>
      <VreoProvider configs={{ autoPreload: true }}>
        <VreoController />
      </VreoProvider>
    </FiveProvider>
  )
}

export default App
```

## 样式文件导入

现在支持直接导入CSS文件：

```typescript
// 主要样式文件（必需）
import '@realsee/vreo/stylesheets/default.css'

// 自定义组件样式（可选）
import '@realsee/vreo/stylesheets/custom/SpatialScenePanel.css'

// 或者使用通配符导入所有样式
import '@realsee/vreo/stylesheets/default.css'
```

## 插件使用

```typescript
// 导入插件
import { CameraMovementPlugin } from '@realsee/vreo/plugins/CameraMovementPlugin'
import { CSS3DRenderPlugin } from '@realsee/vreo/plugins/CSS3DRenderPlugin'
import { ModelTVVideoPlugin } from '@realsee/vreo/plugins/ModelTVVideoPlugin'

// 注册插件到 Five 引擎
five.use(CameraMovementPlugin)
five.use(CSS3DRenderPlugin)
five.use(ModelTVVideoPlugin)
```

## 工具函数

```typescript
// 导入工具函数
import { tween, BetterTween } from '@realsee/vreo/utils/animationFrame'

// 使用动画框架
tween({ x: 0 })
  .to({ x: 100 }, 1000)
  .start()
```

## TypeScript 支持

包已包含完整的 TypeScript 类型定义，IDE 会自动提供类型提示和检查。

```typescript
import type { 
  VreoUnit, 
  VreoKeyframe, 
  PlayerConfigs 
} from '@realsee/vreo/typings'

const configs: PlayerConfigs = {
  autoPreload: true,
  imageOptions: { size: 1024 }
}
```

## 注意事项

1. **ES Modules 兼容性**: 确保你的构建工具支持 ES modules
2. **样式文件导入**: 必须导入 `default.css` 以确保UI组件正常显示
3. **动态导入**: 在 Next.js 中使用时，建议使用动态导入以避免 SSR 问题
4. **浏览器兼容性**: 支持现代浏览器（IE11+ 需要 polyfill）
5. **Alpha 版本**: 这是测试版本，请在生产环境使用前充分测试

## 版本信息

- 当前版本: `2.6.0`
- 模块格式: ES Modules
- 构建目标: 现代浏览器
- TypeScript: 完整支持
- 新增功能: ES Modules支持、CSS文件导入支持 
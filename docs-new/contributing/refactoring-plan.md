# 🏗️ Vreo Monorepo 架构升级方案

本文档详细描述了将 @realsee/vreo 项目改造为现代化 Monorepo 架构的完整方案，采用简化设计理念，通过 `exports` 声明实现模块化导入。

## 📊 当前项目状况分析

### 项目概况
- **项目名称**: @realsee/vreo (VR Video 3D空间剧本播放器)
- **当前版本**: v2.5.0
- **技术栈**: Five 3D引擎 + React + TypeScript + Vite
- **主要功能**: 相机运镜、全景标签、视频特效、虚拟形象渲染
- **当前架构**: 单体项目结构

### 🚨 现存问题分析

#### 1. 架构问题
- **单体耦合**: 所有功能混在一个包中，难以按需使用
- **边界模糊**: 核心播放器、React 集成、插件系统混合
- **发布粒度粗**: 无法独立发布和版本控制子功能
- **扩展困难**: 新功能添加影响整体架构

#### 2. 构建系统问题
- **双重构建**: Vite + Babel 并存，配置复杂重复
- **手动管理**: `dev-tools/build-packages.js` 缺乏现代化流程
- **输出混乱**: `lib/` 和 `docs/demo/` 产物分散
- **效率低下**: 全量构建，无增量优化

#### 3. 开发体验问题
- **工具链缺失**: 无 ESLint、Prettier、测试框架
- **协作困难**: 多人开发时容易产生冲突
- **调试复杂**: 缺乏现代化的开发工具支持
- **文档分散**: 代码注释和使用示例不完善

#### 4. 用户使用问题
- **包体积大**: 用户必须下载完整功能，无法按需使用
- **导入复杂**: 深层路径导入，不支持 Tree Shaking
- 所有功能版本强制绑定，影响灵活性

## 🎯 Monorepo 改造目标

### 核心目标
1. **🔧 模块化架构** - 清晰的功能边界和代码组织
2. **📦 简化包管理** - 主包 + exports 实现模块化导入
3. **⚡ 构建优化** - 增量构建、缓存和并行处理
4. **🧪 高效测试** - 模块化测试和并行执行
5. **👥 协作友好** - 现代化开发工具链和工作流
6. **🚀 用户体验** - 简单安装、灵活导入、按需加载

### 技术选型
- **Monorepo 工具**: `pnpm workspace` + `changesets` + `Turborepo`
- **构建系统**: `Vite 6.x` (统一构建工具)
- **包管理**: `pnpm` (严格依赖管理)
- **代码质量**: `ESLint 9.x` + `Prettier 3.x` + `TypeScript 5.x`
- **测试框架**: `Vitest` + `@testing-library`
- **发布管理**: `Changesets` (自动化版本和发布)

## 📁 Monorepo 架构设计

### 整体目录结构

```
vreo-monorepo/
├── packages/                              # 📦 核心包
│   ├── vreo/                             # 🎯 主包 (@realsee/vreo)
│   │   ├── src/
│   │   │   ├── Player/                   # 播放器核心
│   │   │   │   ├── Player.ts
│   │   │   │   ├── App.tsx
│   │   │   │   ├── hooks.ts
│   │   │   │   └── index.ts
│   │   │   ├── Controller/               # 控制器
│   │   │   │   ├── PlayController.ts
│   │   │   │   ├── EventController.ts
│   │   │   │   └── index.ts
│   │   │   ├── keyframes/                # 关键帧系统
│   │   │   │   ├── base/                 # 基础关键帧类
│   │   │   │   ├── CameraMovement/       # 相机运镜
│   │   │   │   ├── PanoTextLabel/        # 全景标签
│   │   │   │   ├── ModelVideo/           # 模型视频
│   │   │   │   ├── PanoEffect/           # 全景特效
│   │   │   │   ├── VideoEffect/          # 视频特效
│   │   │   │   ├── InfoPanel/            # 信息面板
│   │   │   │   ├── BgMusic/              # 背景音乐
│   │   │   │   ├── Prompter/             # 提词器
│   │   │   │   └── index.ts
│   │   │   ├── plugins/                  # Five 插件系统
│   │   │   │   ├── CameraMovementPlugin/
│   │   │   │   ├── CSS3DRenderPlugin/
│   │   │   │   ├── ModelTVVideoPlugin/
│   │   │   │   └── index.ts
│   │   │   ├── ui/                       # UI 组件库
│   │   │   │   ├── components/           # 基础组件
│   │   │   │   │   ├── Button/
│   │   │   │   │   ├── Slider/
│   │   │   │   │   ├── ProgressBar/
│   │   │   │   │   ├── Drawer/
│   │   │   │   │   ├── PopUp/
│   │   │   │   │   ├── Wave/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── themes/               # 主题系统
│   │   │   │   │   ├── default.ts
│   │   │   │   │   ├── dark.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/                    # 工具函数库
│   │   │   │   ├── audio/                # 音频处理
│   │   │   │   │   ├── generateBlankAudio.ts
│   │   │   │   │   ├── audioUtils.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── animation/            # 动画工具
│   │   │   │   │   ├── tween.ts
│   │   │   │   │   ├── easing.ts
│   │   │   │   │   ├── animationFrame.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── validation/           # 验证工具
│   │   │   │   │   ├── vreoUnit.ts
│   │   │   │   │   ├── schema.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── dom/                  # DOM 操作
│   │   │   │   ├── math/                 # 数学工具
│   │   │   │   └── index.ts
│   │   │   ├── types/                    # 类型定义
│   │   │   │   ├── player.ts             # 播放器类型
│   │   │   │   ├── vreo-unit.ts          # 剧本数据类型
│   │   │   │   ├── events.ts             # 事件类型
│   │   │   │   ├── keyframes.ts          # 关键帧类型
│   │   │   │   ├── ui.ts                 # UI 类型
│   │   │   │   └── index.ts
│   │   │   ├── styles/                   # 样式文件
│   │   │   │   ├── base.css              # 基础样式
│   │   │   │   ├── components/           # 组件样式
│   │   │   │   ├── themes/               # 主题样式
│   │   │   │   │   ├── default.css
│   │   │   │   │   ├── dark.css
│   │   │   │   │   └── custom.css
│   │   │   │   └── index.css
│   │   │   └── index.ts                  # 主入口文件
│   │   ├── package.json                  # 主包配置
│   │   ├── vite.config.ts                # 构建配置
│   │   ├── tsconfig.json                 # TypeScript 配置
│   │   └── README.md
│   └── react/                            # ⚛️ React 集成包
│       ├── src/
│       │   ├── components/               # React 组件
│       │   │   ├── VreoPlayer/
│       │   │   ├── VreoContainer/
│       │   │   ├── PlayerControls/
│       │   │   └── index.ts
│       │   ├── hooks/                    # React Hooks
│       │   │   ├── useVreoPlayer.ts
│       │   │   ├── useVreoController.ts
│       │   │   ├── useVreoState.ts
│       │   │   ├── useVreoEvents.ts
│       │   │   └── index.ts
│       │   ├── providers/                # Context Providers
│       │   │   ├── VreoProvider.tsx
│       │   │   ├── VreoContext.ts
│       │   │   └── index.ts
│       │   ├── hoc/                      # 高阶组件
│       │   │   ├── withVreo.tsx
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── README.md
├── apps/                                 # 🚀 应用示例
│   ├── playground/                       # 🎮 开发调试应用
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── README.md
│   ├── docs/                            # 📚 文档网站
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── content/
│   │   │   └── main.ts
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   └── examples/                        # 💡 示例应用
│       ├── basic-player/                # 基础播放器示例
│       ├── react-integration/           # React 集成示例
│       ├── advanced-features/           # 高级功能示例
│       ├── custom-keyframes/            # 自定义关键帧示例
│       └── plugin-development/          # 插件开发示例
├── tools/                               # 🔧 开发工具
│   ├── build-tools/                    # 构建工具
│   │   ├── vite-config/
│   │   ├── rollup-plugins/
│   │   └── scripts/
│   ├── eslint-config/                  # ESLint 配置
│   │   ├── base.js
│   │   ├── react.js
│   │   └── typescript.js
│   ├── tsconfig/                       # TypeScript 配置
│   │   ├── base.json
│   │   ├── node.json
│   │   └── react.json
│   ├── vitest-config/                  # 测试配置
│   │   ├── base.ts
│   │   ├── react.ts
│   │   └── setup.ts
│   └── prettier-config/                # Prettier 配置
├── tests/                              # 🧪 集成测试
│   ├── e2e/                            # 端到端测试
│   ├── integration/                    # 集成测试
│   ├── fixtures/                       # 测试数据
│   └── utils/                          # 测试工具
├── docs/                               # 📖 项目文档
├── scripts/                            # 📜 构建脚本
├── .changeset/                         # 📝 变更记录
├── package.json                        # 根包配置
├── pnpm-workspace.yaml                 # workspace 配置
├── turbo.json                          # Turborepo 配置
├── tsconfig.json                       # 根 TypeScript 配置
├── .eslintrc.js                        # ESLint 配置
├── .prettierrc.js                      # Prettier 配置
├── vitest.workspace.ts                 # Vitest 工作区配置
└── README.md
```

## 📦 包设计详解

### 主包设计 (@realsee/vreo)

#### package.json 配置

```json
{
  "name": "@realsee/vreo",
  "version": "3.0.0",
  "description": "VR Video 3D空间剧本播放器",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./player": {
      "types": "./dist/player/index.d.ts",
      "import": "./dist/player/index.js",
      "require": "./dist/player/index.cjs"
    },
    "./controller": {
      "types": "./dist/controller/index.d.ts",
      "import": "./dist/controller/index.js",
      "require": "./dist/controller/index.cjs"
    },
    "./keyframes": {
      "types": "./dist/keyframes/index.d.ts",
      "import": "./dist/keyframes/index.js",
      "require": "./dist/keyframes/index.cjs"
    },
    "./keyframes/*": {
      "types": "./dist/keyframes/*/index.d.ts",
      "import": "./dist/keyframes/*/index.js",
      "require": "./dist/keyframes/*/index.cjs"
    },
    "./plugins": {
      "types": "./dist/plugins/index.d.ts",
      "import": "./dist/plugins/index.js",
      "require": "./dist/plugins/index.cjs"
    },
    "./plugins/*": {
      "types": "./dist/plugins/*/index.d.ts",
      "import": "./dist/plugins/*/index.js",
      "require": "./dist/plugins/*/index.cjs"
    },
    "./ui": {
      "types": "./dist/ui/index.d.ts",
      "import": "./dist/ui/index.js",
      "require": "./dist/ui/index.cjs"
    },
    "./ui/components": {
      "types": "./dist/ui/components/index.d.ts",
      "import": "./dist/ui/components/index.js",
      "require": "./dist/ui/components/index.cjs"
    },
    "./ui/themes": {
      "types": "./dist/ui/themes/index.d.ts",
      "import": "./dist/ui/themes/index.js",
      "require": "./dist/ui/themes/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils/index.d.ts",
      "import": "./dist/utils/index.js",
      "require": "./dist/utils/index.cjs"
    },
    "./utils/*": {
      "types": "./dist/utils/*/index.d.ts",
      "import": "./dist/utils/*/index.js",
      "require": "./dist/utils/*/index.cjs"
    },
    "./types": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/types/index.js",
      "require": "./dist/types/index.cjs"
    },
    "./styles": "./dist/styles/index.css",
    "./styles/*": "./dist/styles/*.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "sideEffects": [
    "**/*.css",
    "src/styles/**/*",
    "src/plugins/*/register.ts"
  ],
  "keywords": [
    "vr",
    "video",
    "3d",
    "player",
    "keyframes",
    "realsee",
    "five"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build && tsc --project tsconfig.build.json",
    "build:watch": "vite build --watch",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist"
  },
  "peerDependencies": {
    "@realsee/five": ">=6.4.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "vite": "^6.3.5",
    "typescript": "^5.8.3",
    "vitest": "^2.1.5",
    "@vitest/ui": "^2.1.5",
    "@vitest/coverage-v8": "^2.1.5"
  }
}
```

#### 主入口文件设计

```typescript
// packages/vreo/src/index.ts

// 核心播放器功能
export { Player } from './Player'
export { PlayController } from './Controller'

// 类型定义 (统一导出)
export type * from './types'

// 主要功能模块 (可选导出，用户可通过子路径导入)
export * as Keyframes from './keyframes'
export * as Plugins from './plugins'
export * as UI from './ui'
export * as Utils from './utils'

// 便捷导出常用功能
export {
  // 常用关键帧
  CameraMovement,
  PanoTextLabel,
  ModelVideo
} from './keyframes'

export {
  // 常用插件
  CameraMovementPlugin,
  CSS3DRenderPlugin
} from './plugins'

export {
  // 常用工具
  generateBlankAudio,
  createTween,
  validateVreoUnit
} from './utils'

// 样式文件提示 (通过注释说明)
/**
 * 样式文件导入:
 * 
 * @example 基础样式
 * ```typescript
 * import '@realsee/vreo/styles'
 * ```
 * 
 * @example 特定主题
 * ```typescript
 * import '@realsee/vreo/styles/themes/dark.css'
 * ```
 */
```

#### 子模块入口示例

```typescript
// packages/vreo/src/keyframes/index.ts
export { CameraMovement } from './CameraMovement'
export { PanoTextLabel } from './PanoTextLabel'
export { ModelVideo } from './ModelVideo'
export { PanoEffect } from './PanoEffect'
export { VideoEffect } from './VideoEffect'
export { InfoPanel } from './InfoPanel'
export { BgMusic } from './BgMusic'
export { Prompter } from './Prompter'

// 基础类和工具
export { BaseKeyframe } from './base'
export type * from './base/types'

// packages/vreo/src/keyframes/CameraMovement/index.ts
export { CameraMovementKeyframe as CameraMovement } from './CameraMovementKeyframe'
export { CameraMovementConfig } from './CameraMovementConfig'
export type {
  CameraMovementOptions,
  CameraMovementState,
  CameraMovementEvents
} from './types'

// packages/vreo/src/utils/index.ts
export * from './audio'
export * from './animation'
export * from './validation'
export * from './dom'
export * from './math'

// packages/vreo/src/utils/audio/index.ts
export { generateBlankAudio } from './generateBlankAudio'
export { createAudioContext } from './audioContext'
export { loadAudioBuffer } from './loadAudioBuffer'
export type { AudioOptions, AudioState } from './types'
```

### React 集成包设计 (@realsee/vreo-react)

#### package.json 配置

```json
{
  "name": "@realsee/vreo-react",
  "version": "3.0.0",
  "description": "React integration for @realsee/vreo",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./hooks": {
      "types": "./dist/hooks/index.d.ts",
      "import": "./dist/hooks/index.js",
      "require": "./dist/hooks/index.cjs"
    },
    "./providers": {
      "types": "./dist/providers/index.d.ts",
      "import": "./dist/providers/index.js",
      "require": "./dist/providers/index.cjs"
    },
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.js",
      "require": "./dist/components/index.cjs"
    },
    "./hoc": {
      "types": "./dist/hoc/index.d.ts",
      "import": "./dist/hoc/index.js",
      "require": "./dist/hoc/index.cjs"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build && tsc --project tsconfig.build.json",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist"
  },
  "peerDependencies": {
    "@realsee/vreo": "workspace:^3.0.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}
```

#### React 包入口文件

```typescript
// packages/react/src/index.ts

// Provider 和 Context
export { VreoProvider } from './providers/VreoProvider'
export { VreoContext } from './providers/VreoContext'

// Hooks
export {
  useVreoPlayer,
  useVreoController,
  useVreoState,
  useVreoEvents
} from './hooks'

// 组件
export {
  VreoPlayer,
  VreoContainer,
  PlayerControls
} from './components'

// 高阶组件
export { withVreo } from './hoc'

// 类型定义
export type * from './types'
```

#### 核心 Hook 设计

```typescript
// packages/react/src/hooks/useVreoPlayer.ts
import { useContext, useEffect, useRef, useState } from 'react'
import { Player } from '@realsee/vreo'
import type { PlayerConfig, VreoUnit } from '@realsee/vreo/types'
import { VreoContext } from '../providers/VreoContext'

export interface UseVreoPlayerOptions extends Partial<PlayerConfig> {
  autoPlay?: boolean
  onReady?: (player: Player) => void
  onError?: (error: Error) => void
}

export interface UseVreoPlayerReturn {
  player: Player | null
  isReady: boolean
  isLoading: boolean
  error: Error | null
  load: (vreoUnit: VreoUnit) => Promise<void>
  play: () => void
  pause: () => void
  stop: () => void
  seek: (time: number) => void
}

export function useVreoPlayer(options: UseVreoPlayerOptions = {}): UseVreoPlayerReturn {
  const context = useContext(VreoContext)
  const playerRef = useRef<Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 初始化播放器
  useEffect(() => {
    if (context?.player) {
      playerRef.current = context.player
    } else if (options.container) {
      try {
        playerRef.current = new Player(options)
        setIsReady(true)
        options.onReady?.(playerRef.current)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create player')
        setError(error)
        options.onError?.(error)
      }
    }

    return () => {
      if (playerRef.current && !context?.player) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [])

  const load = async (vreoUnit: VreoUnit) => {
    if (!playerRef.current) {
      throw new Error('Player not initialized')
    }

    try {
      setIsLoading(true)
      setError(null)
      await playerRef.current.load(vreoUnit)
      
      if (options.autoPlay) {
        playerRef.current.play()
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load vreo unit')
      setError(error)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    player: playerRef.current,
    isReady,
    isLoading,
    error,
    load,
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    stop: () => playerRef.current?.stop(),
    seek: (time: number) => playerRef.current?.seek(time)
  }
}
```

#### Context Provider 设计

```typescript
// packages/react/src/providers/VreoProvider.tsx
import React, { createContext, useRef, useEffect, ReactNode } from 'react'
import { Player } from '@realsee/vreo'
import type { PlayerConfig } from '@realsee/vreo/types'

export interface VreoContextValue {
  player: Player | null
  container: HTMLElement | null
}

export const VreoContext = createContext<VreoContextValue | null>(null)

export interface VreoProviderProps {
  children: ReactNode
  config?: PlayerConfig
  container?: HTMLElement
}

export function VreoProvider({ children, config, container }: VreoProviderProps) {
  const playerRef = useRef<Player | null>(null)
  const containerRef = useRef<HTMLElement | null>(container || null)

  useEffect(() => {
    if (containerRef.current && !playerRef.current) {
      playerRef.current = new Player({
        container: containerRef.current,
        ...config
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [config])

  const contextValue: VreoContextValue = {
    player: playerRef.current,
    container: containerRef.current
  }

  return (
    <VreoContext.Provider value={contextValue}>
      {children}
    </VreoContext.Provider>
  )
}
```

## 🏗️ 构建系统设计

### 主包构建配置

```typescript
// packages/vreo/vite.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      // 生成类型声明文件
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: {
        // 主入口
        index: resolve(__dirname, 'src/index.ts'),
        
        // 子模块入口
        'player/index': resolve(__dirname, 'src/Player/index.ts'),
        'controller/index': resolve(__dirname, 'src/Controller/index.ts'),
        
        // 关键帧系统
        'keyframes/index': resolve(__dirname, 'src/keyframes/index.ts'),
        'keyframes/camera-movement/index': resolve(__dirname, 'src/keyframes/CameraMovement/index.ts'),
        'keyframes/pano-text-label/index': resolve(__dirname, 'src/keyframes/PanoTextLabel/index.ts'),
        'keyframes/model-video/index': resolve(__dirname, 'src/keyframes/ModelVideo/index.ts'),
        'keyframes/pano-effect/index': resolve(__dirname, 'src/keyframes/PanoEffect/index.ts'),
        'keyframes/video-effect/index': resolve(__dirname, 'src/keyframes/VideoEffect/index.ts'),
        'keyframes/info-panel/index': resolve(__dirname, 'src/keyframes/InfoPanel/index.ts'),
        'keyframes/bg-music/index': resolve(__dirname, 'src/keyframes/BgMusic/index.ts'),
        'keyframes/prompter/index': resolve(__dirname, 'src/keyframes/Prompter/index.ts'),
        
        // 插件系统
        'plugins/index': resolve(__dirname, 'src/plugins/index.ts'),
        'plugins/camera-movement/index': resolve(__dirname, 'src/plugins/CameraMovementPlugin/index.ts'),
        'plugins/css3d-render/index': resolve(__dirname, 'src/plugins/CSS3DRenderPlugin/index.ts'),
        'plugins/model-tv-video/index': resolve(__dirname, 'src/plugins/ModelTVVideoPlugin/index.ts'),
        
        // UI 系统
        'ui/index': resolve(__dirname, 'src/ui/index.ts'),
        'ui/components/index': resolve(__dirname, 'src/ui/components/index.ts'),
        'ui/themes/index': resolve(__dirname, 'src/ui/themes/index.ts'),
        
        // 工具函数
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),
        'utils/audio/index': resolve(__dirname, 'src/utils/audio/index.ts'),
        'utils/animation/index': resolve(__dirname, 'src/utils/animation/index.ts'),
        'utils/validation/index': resolve(__dirname, 'src/utils/validation/index.ts'),
        'utils/dom/index': resolve(__dirname, 'src/utils/dom/index.ts'),
        'utils/math/index': resolve(__dirname, 'src/utils/math/index.ts'),
        
        // 类型定义
        'types/index': resolve(__dirname, 'src/types/index.ts')
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        '@realsee/five',
        'react',
        'react-dom',
        'react/jsx-runtime'
      ],
      output: {
        // 确保正确的文件命名
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          return `${name}.[format].js`
        },
        // 保持目录结构
        preserveModules: false,
        // 优化代码分割
        manualChunks: (id) => {
          if (id.includes('keyframes/')) {
            return 'keyframes-vendor'
          }
          if (id.includes('plugins/')) {
            return 'plugins-vendor'
          }
          if (id.includes('ui/')) {
            return 'ui-vendor'
          }
          if (id.includes('utils/')) {
            return 'utils-vendor'
          }
        }
      }
    },
    // 代码分割优化
    chunkSizeWarningLimit: 1000,
    // 生成 sourcemap
    sourcemap: true,
    // 压缩配置
    minify: 'esbuild',
    target: 'es2020'
  },
  css: {
    // CSS 处理配置
    postcss: {
      plugins: [
        // 添加 autoprefixer 等插件
      ]
    }
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },
  // 预览配置
  preview: {
    port: 3001
  }
})
```

### React 包构建配置

```typescript
// packages/react/vite.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
        'providers/index': resolve(__dirname, 'src/providers/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
        'hoc/index': resolve(__dirname, 'src/hoc/index.ts')
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        '@realsee/vreo',
        'react',
        'react-dom',
        'react/jsx-runtime'
      ],
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          return `${name}.[format].js`
        }
      }
    }
  }
})
```

## 🔧 现有构建系统深度分析

### 🏗️ 构建工具链现状

#### 双重构建系统问题
项目目前使用**双重构建系统**，存在严重的设计缺陷：

1. **SDK 包构建**: dev-tools + Babel + TypeScript
2. **演示应用构建**: Vite + React

```
现有构建流程（存在问题）
├── SDK 包构建 (npm run packages)
│   ├── dev-tools/build-packages.js    # 主构建脚本
│   ├── dev-tools/babel.config.js      # Babel 转译配置
│   └── dev-tools/tsconfig.build.json  # TypeScript 类型生成
└── 演示应用构建 (npm run build)
    ├── vite.config.ts                 # Vite 配置
    └── 多入口 HTML (index*.html)      # 4个演示页面
```

#### 🚨 核心问题分析

**1. 目录污染严重**
- ❌ `lib/` 直接生成在根目录，与源码混合
- ❌ `docs/demo/` 演示文件与文档混合  
- ❌ 构建产物进入版本控制，污染 git 历史

**2. 构建系统重复**
- ❌ Babel+TSC 和 Vite 双重配置维护
- ❌ 两套不同的构建流程，维护成本高
- ❌ 配置不一致，容易产生兼容性问题

**3. 产物质量问题**
- ❌ **格式单一**: 仅 CommonJS，不支持 ESM
- ❌ **无代码分割**: 所有模块平铺，无法按需加载
- ❌ **无 Tree Shaking**: 用户必须下载完整 544KB
- ❌ **类型文件分散**: .d.ts 与 .js 文件 1:1 对应，冗余
- ❌ **无 Source Map**: 调试困难

**4. 开发体验差**
- ❌ 需要运行多个命令才能完成构建
- ❌ 缺乏统一的清理机制
- ❌ 手动流程多，自动化程度低

### 📈 现有产物分析

#### SDK 包产物统计 (lib/ 目录)
```bash
# 实际产物统计
$ du -sh lib/ && find lib -type f | wc -l
544K    lib/         # 544KB 总大小
      96             # 96个文件

# 文件类型分布
$ find lib -name "*.js" | wc -l
48  # JavaScript 文件

$ find lib -name "*.d.ts" | wc -l  
48  # TypeScript 声明文件（1:1对应，冗余）
```

#### 演示应用产物 (docs/demo/ 目录)
```bash
# Vite 构建产物分析
docs/demo/
├── *.html (4个演示页面)
└── assets/
    ├── *.css (52KB样式文件)
    └── *.js (3.9MB脚本文件) # ⚠️ 体积过大
```

**产物质量问题**:
- ⚠️ **体积过大**: 主包 3.07MB，超过性能基线
- ⚠️ **代码分割不合理**: 缺乏有效的 chunks 策略
- ❌ **位置不当**: 放在 docs/demo/，与文档混合

## 🎯 现代化构建系统重构方案

### 🏗️ 统一构建系统架构

#### 重构目标
采用 **Vite + Turborepo** 统一构建系统，解决现有问题：

```
新构建系统架构
├── 统一构建工具: Vite 6.x
├── 多包管理: Turborepo + pnpm workspace  
├── 多格式输出: ESM + CJS + UMD
├── 智能缓存: 增量构建 + 分布式缓存
├── 产物隔离: 统一 dist/ 目录
└── 自动化流程: CI/CD 集成
```

#### 🎯 设计原则
1. **隔离性**: 构建产物与源码完全分离
2. **层次性**: 按功能和环境组织目录结构  
3. **可追溯性**: 包含版本信息和构建元数据
4. **可清理性**: 支持一键清理所有构建产物

### 📁 现代化产物目录设计

#### 统一产物目录结构

```
vreo-monorepo/
├── packages/                           # 📦 源码包
│   ├── vreo/src/                       # 主包源码
│   └── react/src/                      # React包源码
├── apps/                               # 🚀 应用源码
│   ├── playground/src/                 # Playground源码
│   └── docs/src/                       # 文档网站源码
├── dist/                               # 🏗️ 统一构建产物目录 (完全隔离)
│   ├── packages/                       # 📦 包构建产物
│   │   ├── vreo/                       # 主包产物
│   │   │   ├── es/                     # ESM 格式
│   │   │   │   ├── index.js
│   │   │   │   ├── player/index.js
│   │   │   │   ├── keyframes/index.js
│   │   │   │   └── ...
│   │   │   ├── cjs/                    # CommonJS 格式
│   │   │   │   ├── index.js
│   │   │   │   └── ...
│   │   │   ├── umd/                    # UMD 格式 (浏览器直接使用)
│   │   │   │   ├── vreo.js
│   │   │   │   ├── vreo.min.js
│   │   │   │   └── vreo.d.ts
│   │   │   ├── types/                  # 统一类型声明
│   │   │   │   ├── index.d.ts
│   │   │   │   └── ...
│   │   │   ├── styles/                 # 样式文件
│   │   │   │   ├── index.css
│   │   │   │   ├── themes/
│   │   │   │   └── ...
│   │   │   └── package.json            # 生成的包配置
│   │   └── react/                      # React包产物
│   │       ├── es/
│   │       ├── cjs/
│   │       ├── types/
│   │       └── package.json
│   ├── apps/                           # 🚀 应用构建产物
│   │   ├── playground/                 # Playground 产物
│   │   │   ├── index.html
│   │   │   ├── assets/
│   │   │   └── static/
│   │   └── docs/                       # 文档网站产物
│   │       ├── index.html
│   │       ├── api/
│   │       ├── guides/
│   │       └── assets/
│   ├── reports/                        # 📊 构建报告
│   │   ├── bundle-analyzer/            # 包分析报告
│   │   ├── performance/                # 性能测试报告
│   │   ├── coverage/                   # 测试覆盖率报告
│   │   └── lighthouse/                 # Lighthouse 报告
│   └── meta/                           # 📋 构建元数据
│       ├── build-info.json             # 构建信息
│       ├── package-manifest.json       # 包清单
│       └── changelog.json              # 变更记录
├── .build/                             # 🔧 构建缓存 (git ignored)
│   ├── cache/                          # Turborepo 缓存
│   ├── temp/                           # 临时文件
│   └── logs/                           # 构建日志
└── scripts/                            # 📜 构建脚本
    ├── build.ts                        # 统一构建脚本
    ├── clean.ts                        # 清理脚本
    ├── release.ts                      # 发布脚本
    └── utils/                          # 构建工具
```

### 🔧 现代化构建配置

#### 主包 Vite 配置 (支持多格式)

```typescript
// packages/vreo/vite.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      outDir: ['../../dist/packages/vreo/types'],
      rollupTypes: true,
      insertTypesEntry: true
    })
  ],
  
  build: {
    outDir: '../../dist/packages/vreo',
    emptyOutDir: false,
    
    lib: {
      entry: {
        // 主入口
        'index': resolve(__dirname, 'src/index.ts'),
        
        // 子模块入口 (支持按需导入)
        'player/index': resolve(__dirname, 'src/Player/index.ts'),
        'keyframes/index': resolve(__dirname, 'src/keyframes/index.ts'),
        'plugins/index': resolve(__dirname, 'src/plugins/index.ts'),
        'ui/index': resolve(__dirname, 'src/ui/index.ts'),
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),
      },
      
      formats: ['es', 'cjs']
    },
    
    rollupOptions: {
      external: [
        '@realsee/five',
        'react',
        'react-dom',
        'react/jsx-runtime'
      ],
      
      output: [
        // ESM 输出
        {
          format: 'es',
          dir: '../../dist/packages/vreo/es',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        
        // CommonJS 输出
        {
          format: 'cjs',
          dir: '../../dist/packages/vreo/cjs',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    },
    
    // 生成 Source Map
    sourcemap: true,
    
    // 代码分割优化
    chunkSizeWarningLimit: 1000
  }
})
```

#### UMD 构建配置 (浏览器直接使用)

```typescript
// packages/vreo/vite.umd.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: '../../dist/packages/vreo/umd',
    
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vreo',
      formats: ['umd'],
      fileName: (format) => `vreo.${format}.js`
    },
    
    rollupOptions: {
      external: ['@realsee/five'],
      output: {
        globals: {
          '@realsee/five': 'Five'
        }
      }
    },
    
    // 生成压缩版本
    minify: 'terser',
    
    // 生成 Source Map
    sourcemap: true
  }
})
```

### 📜 统一构建脚本

#### 主构建脚本

```typescript
// scripts/build.ts
import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import * as path from 'path'

interface BuildOptions {
  packages?: string[]
  apps?: string[]
  mode?: 'development' | 'production'
  watch?: boolean
  analyze?: boolean
}

export class UnifiedBuilder {
  constructor(private options: BuildOptions = {}) {}

  async build(): Promise<void> {
    console.log('🚀 开始统一构建...')
    
    // 1. 清理构建产物
    await this.clean()
    
    // 2. 构建包
    if (this.shouldBuildPackages()) {
      await this.buildPackages()
    }
    
    // 3. 构建应用
    if (this.shouldBuildApps()) {
      await this.buildApps()
    }
    
    // 4. 生成构建报告
    await this.generateReports()
    
    // 5. 生成构建元数据
    await this.generateMetadata()
    
    console.log('✅ 统一构建完成!')
  }

  private async clean(): Promise<void> {
    console.log('🧹 清理构建产物...')
    
    const dirsToClean = [
      'dist/packages',
      'dist/apps', 
      'dist/reports',
      '.build/temp'
    ]
    
    for (const dir of dirsToClean) {
      try {
        await fs.rm(dir, { recursive: true, force: true })
        console.log(`   ✓ 清理 ${dir}`)
      } catch (error) {
        // 目录不存在，忽略错误
      }
    }
  }

  private async buildPackages(): Promise<void> {
    console.log('📦 构建包...')
    
    const packages = this.options.packages || ['vreo', 'react']
    
    for (const pkg of packages) {
      console.log(`   构建包: ${pkg}`)
      
      // 构建 ESM + CJS
      execSync(`turbo run build --filter=@realsee/${pkg}`, {
        stdio: 'inherit'
      })
      
      // 构建 UMD (仅主包)
      if (pkg === 'vreo') {
        execSync(`vite build --config packages/vreo/vite.umd.config.ts`, {
          stdio: 'inherit'
        })
      }
      
      // 复制资源文件
      await this.copyPackageAssets(pkg)
      
      // 生成 package.json
      await this.generatePackageJson(pkg)
      
      console.log(`   ✓ 包 ${pkg} 构建完成`)
    }
  }

  private async generatePackageJson(pkg: string): Promise<void> {
    const sourcePackageJson = JSON.parse(
      await fs.readFile(`packages/${pkg}/package.json`, 'utf-8')
    )
    
    const distPackageJson = {
      ...sourcePackageJson,
      
      // 更新入口点
      main: './cjs/index.js',
      module: './es/index.js',
      types: './types/index.d.ts',
      
      // 更新 exports (支持按需导入)
      exports: {
        '.': {
          types: './types/index.d.ts',
          import: './es/index.js',
          require: './cjs/index.js'
        },
        './player': {
          types: './types/player/index.d.ts',
          import: './es/player/index.js',
          require: './cjs/player/index.js'
        },
        './keyframes': {
          types: './types/keyframes/index.d.ts',
          import: './es/keyframes/index.js',
          require: './cjs/keyframes/index.js'
        },
        // ... 其他子模块 exports
        './styles': './styles/index.css',
        './styles/*': './styles/*.css'
      },
      
      // 清理开发依赖
      scripts: undefined,
      devDependencies: undefined
    }
    
    await fs.writeFile(
      `dist/packages/${pkg}/package.json`,
      JSON.stringify(distPackageJson, null, 2)
    )
  }
}
```

#### 清理脚本

```typescript
// scripts/clean.ts
import { promises as fs } from 'fs'

export async function clean(options: {
  all?: boolean
  packages?: boolean
  apps?: boolean
  cache?: boolean
} = {}) {
  console.log('🧹 清理构建产物...')
  
  const cleanTargets: string[] = []
  
  if (options.all || options.packages) {
    cleanTargets.push('dist/packages')
  }
  
  if (options.all || options.apps) {
    cleanTargets.push('dist/apps')
  }
  
  if (options.all || options.cache) {
    cleanTargets.push('.build/cache', '.build/temp')
  }
  
  if (options.all) {
    cleanTargets.push('dist/reports', 'dist/meta')
  }
  
  for (const target of cleanTargets) {
    try {
      await fs.rm(target, { recursive: true, force: true })
      console.log(`   ✓ 清理 ${target}`)
    } catch (error) {
      // 目录不存在，忽略错误
    }
  }
  
  console.log('✅ 清理完成!')
}
```

### 📋 统一脚本配置

#### 根目录 package.json 脚本

```json
{
  "scripts": {
    "build": "tsx scripts/build.ts",
    "build:packages": "tsx scripts/build.ts --packages",
    "build:apps": "tsx scripts/build.ts --apps", 
    "build:analyze": "tsx scripts/build.ts --analyze",
    "build:watch": "tsx scripts/build.ts --watch",
    
    "clean": "tsx scripts/clean.ts",
    "clean:packages": "tsx scripts/clean.ts --packages",
    "clean:apps": "tsx scripts/clean.ts --apps",
    "clean:cache": "tsx scripts/clean.ts --cache",
    
    "dev": "turbo run dev",
    "dev:playground": "turbo run dev --filter=playground",
    "dev:docs": "turbo run dev --filter=docs",
    
    "preview": "turbo run preview",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  }
}
```

### ✅ 构建系统重构收益

#### 📊 构建效率提升

| 指标 | 现有系统 | 重构后 | 提升幅度 |
|------|----------|--------|----------|
| **构建时间** | 120秒 (双重构建) | 35秒 (增量构建) | **71% ↓** |
| **清理效率** | 手动删除多个目录 | 一键清理 (`npm run clean`) | **90% ↓** |
| **并行构建** | 串行构建 | Turborepo 并行 | **3x ↑** |
| **缓存命中率** | 无缓存 | 80%+ 缓存命中 | **全新功能** |

#### 📁 产物组织改进

| 方面 | 现有系统 | 重构后 | 改进 |
|------|----------|--------|------|
| **目录污染** | lib/, docs/demo/ 混合 | 统一 dist/ 目录 | **完全隔离** |
| **版本管理** | 产物混入 git | dist/ 在 .gitignore | **清洁版本历史** |
| **格式支持** | 仅 CommonJS | ESM + CJS + UMD | **现代化支持** |
| **按需加载** | 不支持 | 支持 Tree Shaking | **用户体验提升** |

#### 🚀 开发体验提升

| 功能 | 现有系统 | 重构后 | 改进 |
|------|----------|--------|------|
| **构建命令** | `npm run packages` + `npm run build` | `npm run build` | **统一入口** |
| **清理方式** | 手动删除目录 | `npm run clean` | **自动化清理** |
| **开发调试** | 无 Source Map | 完整 Source Map | **调试友好** |
| **构建报告** | 无 | Bundle 分析 + 性能报告 | **可视化监控** |

#### 📦 用户体验提升

| 体验 | 现有系统 | 重构后 | 改进 |
|------|----------|--------|------|
| **包大小** | 544KB (全量) | 按需加载 | **体积优化** |
| **导入方式** | `require('@realsee/vreo')` | ESM + 子模块导入 | **现代化导入** |
| **类型支持** | 分散的 .d.ts | 统一类型声明 | **TypeScript 友好** |
| **浏览器支持** | 需要构建工具 | UMD 直接引用 | **即插即用** |

## ⚠️ 风险评估

### 🔴 高风险项

#### 1. 迁移复杂度风险
**风险**: 重构/Monorepo 迁移可能引入新的复杂性
**缓解措施**:
- 渐进式迁移，保持原项目并行
- 充分的测试覆盖
- 详细的迁移文档

#### 2. 依赖管理复杂性 (Monorepo)
**风险**: 多包依赖可能导致版本冲突
**缓解措施**:
- 使用 pnpm 的严格依赖管理
- 定期依赖审计
- 自动化依赖更新

### 🟡 中风险项

#### 1. 学习成本
**风险**: 团队需要学习新工具链
**缓解措施**:
- 提供培训和文档
- 逐步推进，不急于求成
- 建立最佳实践指南

#### 2. 构建复杂性 (Monorepo)
**风险**: 多包构建可能变得复杂
**缓解措施**:
- 使用成熟的构建工具 (Turborepo)
- 统一构建配置
- 充分的缓存策略

## 📋 执行检查清单

### 方案 A 检查清单 (单体重构)
- [ ] 目录结构重组完成
- [ ] 构建系统统一
- [ ] 代码质量工具配置
- [ ] 测试框架配置
- [ ] 文档更新完成

### 方案 B 检查清单 (Monorepo)
- [ ] Monorepo 基础架构搭建
- [ ] 包划分和代码迁移
- [ ] 构建和发布优化
- [ ] 文档和示例完善
- [ ] 迁移指南编写

### 通用检查清单
- [ ] 原有功能完整性验证
- [ ] 性能指标达标
- [ ] 用户体验验证
- [ ] 团队培训完成

---

📅 **文档创建时间**: 2024年12月  
👥 **负责团队**: Realsee Developer 开发团队  
📧 **联系方式**: developer@realsee.com

> 💡 **提示**: 建议采用渐进式改造策略，先完成单体重构，再考虑 Monorepo 升级，确保每个阶段都有充分的测试和验证。 

## 💡 方案选择建议

### 推荐方案判断矩阵

| 考虑因素 | 权重 | 单体重构 | 简化 Monorepo | 推荐 |
|---------|------|----------|---------------|------|
| **实施复杂度** | 20% | 8/10 | 7/10 | 单体 |
| **长期收益** | 30% | 7/10 | 9/10 | **Monorepo** |
| **用户体验** | 25% | 6/10 | 9/10 | **Monorepo** |
| **开发效率** | 15% | 7/10 | 9/10 | **Monorepo** |
| **维护成本** | 10% | 7/10 | 8/10 | **Monorepo** |

### 🎯 更新后的推荐策略

#### 情况 1: 快速改善 (选择单体重构)
- 团队资源有限，需要快速见效 (4-6周)
- 短期内不考虑模块化发布
- 优先解决现有构建和开发体验问题

#### 情况 2: 长期规划 (推荐简化 Monorepo) 🌟
- **推荐指数**: ⭐⭐⭐⭐⭐
- **复杂度大幅降低**: 从7+包简化为2包
- **用户体验提升**: 通过 exports 实现模块化导入
- **维护成本可控**: 统一版本管理，依赖关系简单

#### 情况 3: 渐进式改造 (仍然推荐)
1. **第一阶段**: 执行单体重构 (4-6周)
2. **第二阶段**: 改造为简化 Monorepo (4-6周)
3. **优势**: 风险可控，学习成本分摊，最终获得最佳架构

### 📊 简化 Monorepo 的优势总结

#### ✅ 相比多包 Monorepo 的改进
- **包数量**: 7+ → 2 (减少 70%+)
- **学习成本**: 高 → 中 (降低 60%)
- **维护复杂度**: 高 → 中 (降低 50%)
- **用户安装**: 复杂 → 简单 (2个包最多)

#### ✅ 相比单体项目的优势
- **模块化导入**: 无 → 有 (通过 exports)
- **构建效率**: 低 → 高 (增量构建)
- **开发体验**: 中 → 高 (工具链完善)
- **扩展性**: 中 → 高 (workspace 架构)

#### ✅ 最佳平衡点
简化的 Monorepo 方案在复杂度和收益之间找到了最佳平衡：
- **既有 Monorepo 的技术优势**
- **又避免了过度工程化**
- **用户体验接近单包**
- **开发体验显著提升**

### 🎖️ 最终推荐

**基于简化设计，我们强烈推荐选择方案 B (简化 Monorepo)**：

1. **实施难度可接受** - 相比多包方案大幅简化
2. **长期收益巨大** - 现代化架构，优秀的开发体验  
3. **用户体验优秀** - 通过 exports 实现模块化，无需安装多个包
4. **技术债务减少** - 统一的构建系统和代码规范
5. **扩展性良好** - 为未来功能扩展打下良好基础 

## 🛠️ 工作区配置详解

### 根目录配置文件

#### pnpm-workspace.yaml

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'    # 核心包
  - 'apps/*'        # 应用示例
  - 'tools/*'       # 开发工具
```

#### package.json (根目录)

```json
{
  "name": "@realsee/vreo-monorepo",
  "version": "0.0.0",
  "private": true,
  "description": "Vreo VR Video 3D空间剧本播放器 Monorepo",
  "type": "module",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build:packages": "turbo run build --filter='@realsee/*'",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rimraf node_modules/.cache",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build --filter='@realsee/*' && changeset publish",
    "release:alpha": "turbo run build --filter='@realsee/*' && changeset publish --tag alpha",
    "release:beta": "turbo run build --filter='@realsee/*' && changeset publish --tag beta",
    "preview": "turbo run preview",
    "dev:playground": "turbo run dev --filter=playground",
    "dev:docs": "turbo run dev --filter=docs",
    "build:docs": "turbo run build --filter=docs",
    "deploy:docs": "turbo run build --filter=docs && turbo run deploy --filter=docs"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@turbo/gen": "^1.12.4",
    "turbo": "^1.12.4",
    "rimraf": "^5.0.5",
    "@types/node": "^20.11.24",
    "typescript": "^5.8.3",
    "prettier": "^3.2.5",
    "eslint": "^9.0.0"
  },
  "engines": {
    "node": ">=18",
    "pnpm": ">=8"
  },
  "packageManager": "pnpm@8.15.0"
}
```

#### turbo.json (Turborepo 配置)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "src/**/*.css"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "**/*.test.*"],
      "cache": true
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "e2e/**/*.ts"],
      "cache": false
    },
    "lint": {
      "dependsOn": [],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "eslint.config.js"],
      "cache": true
    },
    "lint:fix": {
      "dependsOn": [],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "eslint.config.js"],
      "cache": false
    },
    "type-check": {
      "dependsOn": [],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "tsconfig.json"],
      "cache": true
    },
    "dev": {
      "dependsOn": [],
      "cache": false,
      "persistent": true
    },
    "preview": {
      "dependsOn": ["build"],
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  },
  "remoteCache": {
    "enabled": true
  }
}
```

### 开发工具配置

#### ESLint 配置

```javascript
// .eslintrc.js (根目录)
module.exports = {
  root: true,
  extends: ['@realsee/eslint-config/base'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'coverage/',
    '*.config.js',
    '*.config.ts'
  ]
}

// tools/eslint-config/base.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/prefer-const': 'error',
    
    // Import 规则
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    
    // 通用规则
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  env: {
    node: true,
    browser: true,
    es2022: true
  }
}

// tools/eslint-config/react.js
module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // React 规则
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    
    // React Hooks 规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // JSX 规则
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off'
  }
}
```

#### TypeScript 配置

```json
// tsconfig.json (根目录)
{
  "extends": "./tools/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@realsee/vreo": ["packages/vreo/src"],
      "@realsee/vreo/*": ["packages/vreo/src/*"],
      "@realsee/vreo-react": ["packages/react/src"],
      "@realsee/vreo-react/*": ["packages/react/src/*"]
    }
  },
  "include": [],
  "exclude": ["node_modules", "dist", ".next", "coverage"]
}

// tools/tsconfig/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": false,
    "allowJs": true,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "sourceMap": true,
    "outDir": "dist",
    "removeComments": false,
    "importHelpers": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false,
    "skipLibCheck": true,
    "verbatimModuleSyntax": false
  }
}

// tools/tsconfig/react.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}

// tools/tsconfig/node.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

#### Prettier 配置

```javascript
// .prettierrc.js (根目录)
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  bracketSameLine: false,
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always'
      }
    }
  ]
}

// .prettierignore
node_modules/
dist/
.next/
coverage/
*.min.js
*.min.css
pnpm-lock.yaml
```

#### Vitest 配置

```typescript
// vitest.workspace.ts (根目录)
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // 主包测试
  {
    test: {
      name: '@realsee/vreo',
      root: './packages/vreo',
      environment: 'happy-dom',
      setupFiles: ['../../tools/vitest-config/setup.ts']
    }
  },
  // React 包测试
  {
    test: {
      name: '@realsee/vreo-react',
      root: './packages/react',
      environment: 'happy-dom',
      setupFiles: ['../../tools/vitest-config/setup-react.ts']
    }
  },
  // 应用测试
  {
    test: {
      name: 'playground',
      root: './apps/playground',
      environment: 'happy-dom'
    }
  }
])

// tools/vitest-config/base.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '*.config.*',
        '*.test.*',
        'test/',
        'tests/',
        '**/*.d.ts'
      ]
    }
  }
})

// tools/vitest-config/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/dom'

// 全局设置
beforeAll(() => {
  // 设置全局配置
})

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// 所有测试完成后清理
afterAll(() => {
  // 全局清理
})

// tools/vitest-config/setup-react.ts
import { beforeAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

beforeAll(() => {
  // React 特定设置
})

afterEach(() => {
  cleanup()
})
```

## 📋 使用示例详解

### 基础使用示例

```typescript
// 基础播放器使用
import { Player } from '@realsee/vreo'
import '@realsee/vreo/styles'

// 创建播放器实例
const player = new Player({
  container: document.getElementById('vreo-container')!,
  width: 1920,
  height: 1080
})

// 加载剧本
await player.load(vreoUnit)

// 播放控制
player.play()
player.pause()
player.seek(30)
```

### 按需导入示例

```typescript
// 🎬 按需导入关键帧
import { CameraMovement } from '@realsee/vreo/keyframes/camera-movement'
import { PanoTextLabel } from '@realsee/vreo/keyframes/pano-text-label'

// 🔌 按需导入插件
import { CameraMovementPlugin } from '@realsee/vreo/plugins/camera-movement'
import { CSS3DRenderPlugin } from '@realsee/vreo/plugins/css3d-render'

// 🎨 按需导入 UI 组件
import { Button, Slider } from '@realsee/vreo/ui/components'
import { DefaultTheme } from '@realsee/vreo/ui/themes'

// 🛠️ 按需导入工具
import { generateBlankAudio } from '@realsee/vreo/utils/audio'
import { createTween } from '@realsee/vreo/utils/animation'

// 📘 导入类型
import type { VreoUnit, PlayerConfig } from '@realsee/vreo/types'

// 🎨 导入样式
import '@realsee/vreo/styles' // 主样式
import '@realsee/vreo/styles/themes/dark.css' // 特定主题
```

### React 集成示例

```tsx
// React 项目中的使用
import { VreoProvider, useVreoPlayer } from '@realsee/vreo-react'
import type { VreoUnit } from '@realsee/vreo/types'

function VreoApp() {
  return (
    <VreoProvider>
      <VreoPlayerComponent />
    </VreoProvider>
  )
}

function VreoPlayerComponent() {
  const {
    player,
    isReady,
    isLoading,
    error,
    load,
    play,
    pause
  } = useVreoPlayer({
    autoPlay: true,
    onReady: (player) => {
      console.log('Player ready:', player)
    },
    onError: (error) => {
      console.error('Player error:', error)
    }
  })

  const handleLoad = async () => {
    const vreoUnit: VreoUnit = {
      // 剧本数据
    }
    await load(vreoUnit)
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <div ref={containerRef} id="vreo-container" />
      <div>
        <button onClick={handleLoad} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load Video'}
        </button>
        <button onClick={play} disabled={!isReady}>
          Play
        </button>
        <button onClick={pause} disabled={!isReady}>
          Pause
        </button>
      </div>
    </div>
  )
}

export default VreoApp
```

### 高级功能示例

```typescript
// 自定义关键帧开发
import { BaseKeyframe } from '@realsee/vreo/keyframes'
import type { KeyframeConfig } from '@realsee/vreo/types'

class CustomKeyframe extends BaseKeyframe {
  constructor(config: KeyframeConfig) {
    super(config)
  }

  async execute() {
    // 自定义关键帧逻辑
  }
}

// 自定义插件开发
import { BasePlugin } from '@realsee/vreo/plugins'
import type { PluginConfig } from '@realsee/vreo/types'

class CustomPlugin extends BasePlugin {
  constructor(config: PluginConfig) {
    super(config)
  }

  async init() {
    // 插件初始化逻辑
  }

  async dispose() {
    // 插件清理逻辑
  }
}
```

## 🗓️ 详细实施计划

### 阶段 1: 基础架构搭建 (Week 1-2)

#### Week 1: Monorepo 基础设置

**📋 Day 1-2: 项目结构创建**
- [ ] **创建 Monorepo 目录结构**
  ```bash
  mkdir -p vreo-monorepo/{packages,apps,tools,tests,docs,scripts}
  mkdir -p vreo-monorepo/packages/{vreo,react}
  mkdir -p vreo-monorepo/apps/{playground,docs,examples}
  mkdir -p vreo-monorepo/tools/{build-tools,eslint-config,tsconfig,vitest-config,prettier-config}
  ```

- [ ] **配置现代化构建产物目录**
  ```bash
  mkdir -p dist/{packages,apps,reports,meta}
  mkdir -p .build/{cache,temp,logs}
  ```

- [ ] **配置 pnpm workspace**
  - 创建 `pnpm-workspace.yaml`
  - 配置 workspace 依赖关系
  - 设置 package.json 根配置

- [ ] **配置 Turborepo**
  - 安装和配置 turbo
  - 创建 `turbo.json` 配置文件
  - 设置构建管道和缓存策略

**📋 Day 3-4: 统一构建系统基础**
- [ ] **创建统一构建脚本**
  - 实现 `scripts/build.ts` 主构建脚本
  - 实现 `scripts/clean.ts` 清理脚本
  - 配置多格式输出 (ESM + CJS + UMD)

- [ ] **配置 .gitignore**
  - 将 `dist/` 和 `.build/` 添加到 .gitignore
  - 清理现有 `lib/` 目录污染

- [ ] **ESLint 配置**
  - 创建共享 ESLint 配置包
  - 配置 TypeScript 和 React 规则
  - 设置 import 排序和代码风格

- [ ] **TypeScript 配置**
  - 创建共享 TypeScript 配置
  - 设置 base、react、node 配置
  - 配置路径映射和模块解析

**📋 Day 5-7: 构建系统完善**
- [ ] **Vite 配置优化**
  - 配置多入口构建 (主包 + 子模块)
  - 设置 TypeScript 声明文件生成
  - 配置 Source Map 和代码分割

- [ ] **UMD 构建配置**
  - 为浏览器直接使用创建 UMD 构建
  - 配置外部依赖和全局变量
  - 设置压缩和优化选项

- [ ] **Vitest 配置**
  - 配置 workspace 测试
  - 设置测试环境和覆盖率
  - 创建测试工具和 setup 文件

- [ ] **CI/CD 基础配置**
  - 配置 GitHub Actions 工作流
  - 设置自动化测试和构建
  - 配置代码质量检查

#### Week 2: 包结构设计与构建测试

**📋 Day 8-10: 主包结构创建 + GitHub Actions 构建集成**
- [ ] **创建主包 (@realsee/vreo) 基础结构**
  ```bash
  cd packages/vreo
  mkdir -p src/{Player,Controller,keyframes,plugins,ui,utils,types,styles}
  ```

- [ ] **设计 package.json 和 exports 配置**
  - 配置模块导出映射 (支持按需导入)
  - 设置 peerDependencies
  - 配置多格式构建脚本

- [ ] **配置主包现代化构建系统**
  - 创建 Vite 配置文件 (ESM + CJS)
  - 创建 UMD 构建配置
  - 设置多入口构建和类型声明生成
  - 测试构建产物生成到 `dist/packages/vreo/`

- [ ] **GitHub Actions 构建集成**
  - 自动化包构建和测试流水线
  - 构建缓存和加速优化
  - 构建产物自动上传和存档
  - 性能基准测试自动化
  - 多 Node.js 版本兼容性测试

**📋 Day 11-12: React 包结构 + GitHub 社区功能配置**
- [ ] **创建 React 包 (@realsee/vreo-react) 结构**
  ```bash
  cd packages/react
  mkdir -p src/{components,hooks,providers,hoc}
  ```

- [ ] **配置 React 包构建**
  - 设置 React 相关构建配置
  - 配置 JSX 和 TypeScript
  - 设置依赖外部化
  - 测试构建产物生成到 `dist/packages/react/`

- [ ] **GitHub 社区功能配置**
  - **GitHub Discussions** 开启社区讨论和 Q&A
  - **GitHub Projects** 项目管理看板和里程碑设置
  - **GitHub Wiki** 知识库初始化和页面结构
  - **GitHub Sponsors** 赞助页面和支持者展示
  - **Code of Conduct** 社区行为准则制定
  - **Contributing Guide** 贡献者指南完善

**📋 Day 13-14: 应用结构 + GitHub Pages 自动部署**
- [ ] **创建 Playground 应用**
  - 设置开发调试应用
  - 配置 Vite 开发服务器
  - 创建基础示例页面
  - 配置构建产物输出到 `dist/apps/playground/`

- [ ] **创建文档网站结构**
  - 设置文档网站应用
  - 配置静态站点生成
  - 创建文档模板
  - 配置构建产物输出到 `dist/apps/docs/`

- [ ] **GitHub Pages 自动部署**
  - 文档网站自动构建和部署流水线
  - 多版本文档支持和版本切换
  - 自定义域名配置和 SSL 证书
  - CDN 加速优化和缓存策略
  - 部署预览环境 (PR Preview)

- [ ] **统一构建系统测试**
  - 测试 `npm run build` 统一构建命令
  - 测试 `npm run clean` 清理命令
  - 验证多格式产物生成 (ESM + CJS + UMD)
  - 验证构建报告和元数据生成

### 阶段 2: 代码迁移与重构 (Week 3-5)

#### Week 3: 核心代码迁移与构建验证

**📋 Day 15-17: 播放器核心迁移 + GitHub 自动化验证**
- [ ] **迁移播放器核心代码**
  - 从 `resources/Player/` 迁移到 `packages/vreo/src/Player/`
  - 重构模块导入路径
  - 更新类型定义引用

- [ ] **迁移控制器代码**
  - 从 `resources/PlayController/` 迁移到 `packages/vreo/src/Controller/`
  - 重构事件系统
  - 优化 API 设计

- [ ] **GitHub 代码迁移自动化验证**
  - 迁移前后功能对比测试
  - API 兼容性自动检查
  - 性能回归自动检测
  - 代码质量门禁 (SonarQube 集成)

- [ ] **验证构建系统与迁移代码兼容性**
  - 测试迁移后的代码构建
  - 验证类型声明文件生成
  - 确保 Source Map 正确映射

**📋 Day 18-19: 关键帧系统迁移 + API 兼容性检查**
- [ ] **迁移关键帧模块**
  - 从 `resources/Player/modules/keyframes/` 迁移
  - 重构关键帧基类
  - 统一关键帧接口

- [ ] **重构关键帧类型**
  - 提取共同接口
  - 优化类型定义
  - 完善文档注释

- [ ] **GitHub API 兼容性自动检查**
  - API 破坏性变更检测
  - 向后兼容性验证
  - TypeScript 类型兼容性检查
  - 自动生成 API 变更报告

- [ ] **测试按需导入功能**
  - 验证 `import { CameraMovement } from '@realsee/vreo/keyframes/camera-movement'`
  - 测试 Tree Shaking 效果
  - 确保子模块构建正确

**📋 Day 20-21: 插件系统迁移 + 性能回归检测**
- [ ] **迁移 Five 插件**
  - 从 `resources/fivePlugins/` 迁移
  - 重构插件注册机制
  - 优化插件生命周期

- [ ] **插件系统优化**
  - 统一插件接口
  - 实现插件管理器
  - 添加插件配置验证

- [ ] **GitHub 性能回归自动检测**
  - Bundle 大小变化监控
  - 运行时性能基准测试
  - 内存使用量对比
  - 加载时间性能测试

- [ ] **构建产物质量验证**
  - 检查构建产物大小和结构
  - 验证 UMD 格式可在浏览器直接使用
  - 测试多格式兼容性

#### Week 4: UI 和工具迁移与构建优化

**📋 Day 22-24: UI 组件迁移**
- [ ] **迁移 UI 组件**
  - 从各模块提取 UI 组件
  - 重构为独立组件
  - 标准化组件 API

- [ ] **主题系统设计**
  - 创建主题配置系统
  - 设计 CSS 变量体系
  - 实现主题切换功能

- [ ] **样式构建系统集成**
  - 配置 CSS 处理管道
  - 设置样式压缩和优化
  - 实现样式按需加载

**📋 Day 25-26: 工具函数迁移**
- [ ] **迁移工具函数**
  - 从 `shared-utils/` 迁移
  - 按功能分类重组
  - 添加单元测试

- [ ] **类型定义整理**
  - 从 `typings/` 迁移类型定义
  - 重构和优化类型结构
  - 统一类型声明文件生成

- [ ] **构建缓存优化**
  - 配置 Turborepo 增量构建
  - 优化构建性能和缓存策略
  - 测试并行构建效果

**📋 Day 27-28: 样式文件迁移与构建报告**
- [ ] **迁移样式文件**
  - 从 `stylesheets/` 迁移
  - 重构 CSS 结构
  - 实现模块化导入

- [ ] **构建报告系统**
  - 实现 Bundle 分析报告
  - 生成性能测试报告
  - 创建构建元数据

- [ ] **构建系统压力测试**
  - 测试大型项目构建性能
  - 验证缓存命中率
  - 优化构建瓶颈

#### Week 5: React 集成开发与构建验证

**📋 Day 29-31: React Hooks 开发**
- [ ] **开发核心 Hooks**
  - 实现 `useVreoPlayer`
  - 实现 `useVreoController`
  - 实现 `useVreoState`

- [ ] **Context 系统开发**
  - 实现 `VreoProvider`
  - 设计 Context 数据结构
  - 优化性能和重渲染

- [ ] **React 包构建验证**
  - 测试 React 包独立构建
  - 验证 React 组件类型声明
  - 确保与主包的依赖关系正确

**📋 Day 32-33: React 组件开发**
- [ ] **开发基础组件**
  - 实现 `VreoPlayer` 组件
  - 实现 `PlayerControls` 组件
  - 实现 `VreoContainer` 组件

- [ ] **高阶组件开发**
  - 实现 `withVreo` HOC
  - 添加错误边界处理
  - 优化组件性能

- [ ] **端到端构建测试**
  - 测试完整的构建流程
  - 验证所有格式产物正确性
  - 确保构建产物可发布

**📋 Day 34-35: 测试和验证**
- [ ] **编写单元测试**
  - 为核心功能编写测试
  - 为 React 组件编写测试
  - 设置测试覆盖率

- [ ] **集成测试**
  - 测试包之间的集成
  - 验证导入导出功能
  - 测试构建产物

- [ ] **构建系统最终验证**
  - 完整构建流程测试
  - 性能基准测试
  - 构建产物质量验证

### 阶段 3: 构建优化与测试 (Week 6-7)

#### Week 6: 构建系统优化

**📋 Day 36-38: 构建配置优化**
- [ ] **优化 Vite 构建配置**
  - 配置代码分割策略
  - 优化 Bundle 大小
  - 设置 Tree Shaking

- [ ] **配置 TypeScript 构建**
  - 优化类型声明生成
  - 设置 TypeScript 项目引用
  - 配置增量编译

- [ ] **优化缓存策略**
  - 配置 Turborepo 缓存
  - 设置构建缓存
  - 优化 CI/CD 缓存

**📋 Day 39-40: 性能优化**
- [ ] **Bundle 分析和优化**
  - 分析包大小和依赖
  - 优化动态导入
  - 减少冗余代码

- [ ] **运行时性能优化**
  - 优化组件渲染性能
  - 减少不必要的重新计算
  - 优化内存使用

**📋 Day 41-42: 开发体验优化**
- [ ] **热更新优化**
  - 配置快速刷新
  - 优化开发服务器
  - 减少重启时间

- [ ] **调试工具集成**
  - 集成 React DevTools
  - 配置 Source Map
  - 设置错误追踪

#### Week 7: 测试完善

**📋 Day 43-45: 测试覆盖率提升**
- [ ] **核心功能测试**
  - 播放器功能测试
  - 关键帧系统测试
  - 插件系统测试

- [ ] **React 集成测试**
  - Hooks 测试
  - 组件集成测试
  - Context 测试

- [ ] **边界情况测试**
  - 错误处理测试
  - 边界值测试
  - 异步操作测试

**📋 Day 46-47: E2E 测试**
- [ ] **端到端测试设置**
  - 配置 Playwright 或 Cypress
  - 创建测试场景
  - 设置测试数据

- [ ] **用户体验测试**
  - 测试完整用户流程
  - 验证功能完整性
  - 测试浏览器兼容性

**📋 Day 48-49: 性能测试**
- [ ] **性能基准测试**
  - 测试启动性能
  - 测试运行时性能
  - 测试内存使用

- [ ] **压力测试**
  - 测试大量数据处理
  - 测试长时间运行
  - 测试并发操作

- [ ] **构建系统性能测试**
  - 测试增量构建效率
  - 验证缓存命中率
  - 优化构建瓶颈

### 阶段 4: 文档与发布 (Week 8)

#### Week 8: 文档完善与发布准备

**📋 Day 50-52: 文档编写**
- [ ] **API 文档**
  - 完善 TypeScript 注释
  - 生成 API 文档
  - 添加使用示例

- [ ] **构建系统文档**
  - 编写构建配置说明
  - 创建开发者指南
  - 添加故障排除指南

- [ ] **使用指南**
  - 编写快速开始指南
  - 创建迁移指南
  - 添加最佳实践

**📋 Day 53-54: 发布准备**
- [ ] **版本管理**
  - 配置 Changesets
  - 设置版本发布流程
  - 创建 CHANGELOG

- [ ] **包发布配置**
  - 配置 npm 发布
  - 设置发布脚本
  - 测试发布流程

- [ ] **构建产物最终验证**
  - 验证所有构建产物完整性
  - 测试多环境兼容性
  - 确保发布包质量

**📋 Day 55-56: 最终验证**
- [ ] **完整性验证**
  - 验证所有功能正常
  - 检查文档完整性
  - 测试安装和使用

- [ ] **构建系统收益验证**
  - 测量构建效率提升 (目标: 71% ↓)
  - 验证产物组织改进
  - 确认开发体验提升

- [ ] **发布执行**
  - 发布 alpha 版本
  - 收集反馈
  - 修复问题并发布正式版

## 📊 预期收益与对比

### 📈 量化收益预期

| 指标 | 当前状态 | 改造后 | 提升幅度 |
|------|----------|--------|----------|
| **构建时间** | 120秒 | 30秒 | **75% ↓** |
| **开发启动时间** | 45秒 | 8秒 | **82% ↓** |
| **热更新时间** | 3-5秒 | 500ms | **83% ↓** |
| **Bundle 大小** | 2.8MB | 2.1MB | **25% ↓** |
| **Tree Shaking 效果** | 无 | 支持 | **按需加载** |
| **类型检查速度** | 25秒 | 8秒 | **68% ↓** |
| **测试运行时间** | 90秒 | 20秒 | **78% ↓** |

### 🎯 用户体验对比

#### 使用场景对比

**场景 1: 基础使用**
```typescript
// 现有方式
import { Player } from '@realsee/vreo'
// 必须下载完整 2.8MB

// Monorepo 方式  
import { Player } from '@realsee/vreo'
// 按需加载，仅 800KB
```

**场景 2: 按需使用**
```typescript
// 现有方式
import { Player } from '@realsee/vreo'
// 即使只用一个功能，也要下载完整包

// Monorepo 方式
import { CameraMovement } from '@realsee/vreo/keyframes/camera-movement'
// 仅加载需要的模块，200KB
```

**场景 3: React 项目**
```typescript
// 现有方式
import { Player } from '@realsee/vreo'
// React 相关代码混在主包中

// Monorepo 方式
import { VreoProvider } from '@realsee/vreo-react'
// React 专用包，优化的 React 集成
```

### 🏆 技术架构对比

| 架构方面 | 单体项目 | Monorepo | 优势 |
|----------|----------|----------|------|
| **模块化** | 弱 | 强 | 清晰的边界 |
| **可维护性** | 中 | 高 | 独立开发和测试 |
| **可扩展性** | 低 | 高 | 易于添加新功能 |
| **构建效率** | 低 | 高 | 增量构建和缓存 |
| **开发体验** | 中 | 高 | 现代化工具链 |
| **用户体验** | 中 | 高 | 按需加载和导入 |

## ⚠️ 风险评估与缓解

### 🔴 高风险项

#### 1. 迁移复杂度风险
**风险描述**: 大量代码迁移可能引入 Bug 或破坏现有功能

**缓解措施**:
- **渐进式迁移**: 按模块逐步迁移，保持原项目并行运行
- **自动化测试**: 为每个迁移的模块编写完整测试
- **回归测试**: 建立全面的回归测试套件
- **功能对比**: 每个阶段对比新旧版本功能一致性

#### 2. 学习成本风险
**风险描述**: 团队需要学习 Monorepo 工具链和新的开发流程

**缓解措施**:
- **培训计划**: 制定详细的技术培训计划
- **文档完善**: 提供详细的开发指南和最佳实践
- **逐步推进**: 先让核心开发者掌握，再推广到整个团队
- **工具支持**: 提供 VS Code 配置和开发工具

### 🟡 中风险项

#### 1. 构建复杂性风险
**风险描述**: Monorepo 构建配置可能变得复杂

**缓解措施**:
- **成熟工具**: 使用经过验证的工具 (Turborepo, Vite)
- **标准化配置**: 创建标准化的构建配置模板
- **充分测试**: 在多种环境下测试构建流程
- **文档记录**: 详细记录构建配置和故障排除

#### 2. 依赖管理风险
**风险描述**: 工作区依赖可能产生版本冲突

**缓解措施**:
- **严格的依赖管理**: 使用 pnpm 的严格依赖解析
- **定期审计**: 定期检查和更新依赖版本
- **自动化检查**: 设置 CI 检查依赖冲突
- **版本锁定**: 对关键依赖进行版本锁定

### 🟢 低风险项

#### 1. 性能风险
**风险描述**: 新架构可能影响运行时性能

**缓解措施**:
- **性能基准**: 建立性能基准测试
- **持续监控**: 设置性能监控和告警
- **优化策略**: 针对性能瓶颈制定优化策略

#### 2. 兼容性风险
**风险描述**: 新版本可能破坏向后兼容性

**缓解措施**:
- **版本策略**: 采用语义化版本管理
- **迁移指南**: 提供详细的升级指南
- **过渡期支持**: 在一定时间内同时维护旧版本

## 🎯 成功验收标准

### 📋 技术指标

#### 构建系统
- [ ] **构建时间**: 从现有的 120秒 减少到 30秒以内
- [ ] **热更新**: 开发环境热更新时间在 500ms 以内
- [ ] **Bundle 大小**: 主包大小控制在 2.1MB 以内
- [ ] **Tree Shaking**: 实现有效的按需加载，未使用功能可被摇树优化

#### 代码质量
- [ ] **测试覆盖率**: 单元测试覆盖率达到 80% 以上
- [ ] **类型安全**: 所有代码通过 TypeScript 严格模式检查
- [ ] **代码规范**: 所有代码通过 ESLint 和 Prettier 检查
- [ ] **文档完整**: API 文档覆盖率达到 90% 以上

#### 开发体验
- [ ] **开发启动**: 开发环境启动时间在 8秒以内
- [ ] **错误提示**: 提供清晰的错误信息和调试支持
- [ ] **IDE 支持**: 完善的 TypeScript 类型提示和自动完成
- [ ] **调试工具**: 集成现代化的调试工具和开发者工具

### 📋 功能指标

#### 核心功能
- [ ] **播放器**: 所有播放器核心功能正常工作
- [ ] **关键帧**: 所有关键帧类型正常执行
- [ ] **插件系统**: 所有插件正常加载和运行
- [ ] **React 集成**: React Hooks 和组件正常工作

#### 用户体验
- [ ] **安装简单**: 用户可以通过简单的 npm install 安装
- [ ] **导入灵活**: 支持多种导入方式 (全量、按需、子模块)
- [ ] **文档清晰**: 用户可以通过文档快速上手
- [ ] **示例丰富**: 提供覆盖各种使用场景的示例

### 📋 业务指标

#### 团队效率
- [ ] **开发效率**: 团队开发效率提升 50% 以上
- [ ] **协作体验**: 减少代码冲突和合并问题
- [ ] **维护成本**: 代码维护和 Bug 修复时间减少 40%
- [ ] **新功能开发**: 新功能开发周期缩短 30%

#### 用户满意度
- [ ] **使用反馈**: 收集用户使用反馈，满意度达到 85% 以上
- [ ] **问题解决**: 用户问题响应和解决时间缩短 50%
- [ ] **文档质量**: 文档质量评分达到 4.5/5 以上
- [ ] **社区活跃**: 提升开源社区的参与度和贡献

---

📅 **文档创建时间**: 2024年12月  
👥 **负责团队**: Realsee Developer 开发团队  
📧 **联系方式**: developer@realsee.com

> 💡 **提示**: 本方案采用现代化的 Monorepo 架构，通过简化的包设计和 exports 声明，在提供模块化开发体验的同时，保持了用户使用的简单性。建议严格按照实施计划执行，确保每个阶段都有充分的测试和验证。 

## 🎮 Playground/Apps 设计详解

### 现有 Playground 价值分析

通过对现有 `__test__/` 目录的深度分析，我们发现这是一个功能完善的 Playground，具有以下核心价值：

#### 🎯 现有功能矩阵

| 功能类别 | 实现文件 | 核心价值 | 重构保留策略 |
|----------|----------|----------|--------------|
| **基础播放器** | `main.tsx` + `App.tsx` | Five + Player 直接集成 | ✅ 完全保留，现代化升级 |
| **React 集成** | `main-react.tsx` + `AppReact.tsx` | VreoProvider + Hooks 演示 | ✅ 保留并增强 |
| **动态创建销毁** | `main-react-dynamic.tsx` | 内存泄漏和生命周期测试 | ✅ 保留，增加自动化测试 |
| **部分容器** | `main-react-partial.tsx` | 非全屏容器适配 | ✅ 保留，增加响应式测试 |
| **功能分类演示** | `examples/player.tsx` | 按功能分类的交互式演示 | ✅ 保留并扩展 |
| **PlayController** | `PlayController/App.tsx` | 独立播放控制器测试 | ✅ 保留，增强调试功能 |
| **测试数据集** | `data/vreo-units/*` | 20+ 个真实测试用例 | ✅ 完全保留，标准化管理 |

### 新 Playground 架构设计

```
apps/
├── playground/                              # 🎮 统一开发调试平台
│   ├── src/
│   │   ├── pages/                          # 📄 多页面结构
│   │   │   ├── basic/                      # 基础功能演示
│   │   │   │   ├── BasicPlayer.tsx         # 对应 main.tsx + App.tsx
│   │   │   │   ├── ReactIntegration.tsx    # 对应 main-react.tsx
│   │   │   │   ├── DynamicLifecycle.tsx    # 对应 main-react-dynamic.tsx
│   │   │   │   └── PartialContainer.tsx    # 对应 main-react-partial.tsx
│   │   │   ├── features/                   # 功能分类演示
│   │   │   │   ├── CameraMovement.tsx      # 相机运镜演示
│   │   │   │   ├── PanoTag.tsx             # 全景标签演示
│   │   │   │   ├── ModelVideo.tsx          # 视频投放演示
│   │   │   │   ├── VideoEffect.tsx         # 视频特效演示
│   │   │   │   └── BgMusic.tsx             # 背景音乐演示
│   │   │   ├── controller/                 # PlayController 专区
│   │   │   │   ├── BasicController.tsx     # 基础控制器演示
│   │   │   │   ├── CustomKeyframes.tsx     # 自定义关键帧处理
│   │   │   │   └── ProgressTracking.tsx    # 进度跟踪演示
│   │   │   ├── stress-test/                # 压力和边界测试
│   │   │   │   ├── LargeDataTest.tsx       # 大数据加载测试
│   │   │   │   ├── MemoryLeakTest.tsx      # 内存泄漏测试
│   │   │   │   ├── PerformanceTest.tsx     # 性能基准测试
│   │   │   │   └── ErrorHandling.tsx       # 错误处理测试
│   │   │   └── debug/                      # 调试工具
│   │   │       ├── StateInspector.tsx      # 状态检查器
│   │   │       ├── EventLogger.tsx         # 事件日志器
│   │   │       └── ConfigEditor.tsx        # 配置编辑器
│   │   ├── components/                     # 📦 共享组件
│   │   │   ├── layout/                     # 布局组件
│   │   │   │   ├── PlaygroundLayout.tsx    # 统一布局
│   │   │   │   ├── Sidebar.tsx             # 侧边栏导航
│   │   │   │   └── Header.tsx              # 顶部导航
│   │   │   ├── canvas/                     # 画布组件
│   │   │   │   ├── ResponsiveFiveCanvas.tsx # 保留现有组件
│   │   │   │   ├── FullScreenCanvas.tsx     # 全屏画布
│   │   │   │   └── ConstrainedCanvas.tsx    # 受限容器画布
│   │   │   ├── controls/                   # 控制组件
│   │   │   │   ├── PlayerControls.tsx      # 播放器控制
│   │   │   │   ├── VreoControls.tsx        # Vreo 专用控制
│   │   │   │   └── DebugControls.tsx       # 调试控制面板
│   │   │   └── data/                       # 数据组件
│   │   │       ├── DataSelector.tsx        # 数据选择器
│   │   │       ├── ConfigPanel.tsx         # 配置面板
│   │   │       └── StateDisplay.tsx        # 状态显示
│   │   ├── data/                           # 📊 测试数据 (保留现有)
│   │   │   ├── vreo-units/                 # VreoUnit 测试用例
│   │   │   ├── works/                      # Five Work 场景数据
│   │   │   ├── configs/                    # 配置预设
│   │   │   └── index.ts                    # 数据导出索引
│   │   ├── utils/                          # 🛠️ 工具函数
│   │   │   ├── dataManager.ts              # 数据管理器
│   │   │   ├── testHelpers.ts              # 测试辅助函数
│   │   │   ├── performanceMonitor.ts       # 性能监控
│   │   │   └── debugHelpers.ts             # 调试辅助工具
│   │   ├── hooks/                          # 🪝 自定义 Hooks
│   │   │   ├── usePlaygroundState.ts       # Playground 状态管理
│   │   │   ├── useDataManager.ts           # 数据管理 Hook
│   │   │   ├── usePerformanceMonitor.ts    # 性能监控 Hook
│   │   │   └── useDebugTools.ts            # 调试工具 Hook
│   │   ├── styles/                         # 🎨 样式文件
│   │   │   ├── globals.css                 # 全局样式 (保留现有)
│   │   │   ├── components.css              # 组件样式
│   │   │   └── themes.css                  # 主题样式
│   │   ├── App.tsx                         # 🚀 主应用入口
│   │   └── main.tsx                        # 📱 应用启动文件
│   ├── public/                             # 📁 静态资源
│   │   ├── index.html                      # HTML 模板
│   │   ├── favicon.ico                     # 网站图标
│   │   └── assets/                         # 静态资源
│   ├── package.json                        # 📦 依赖配置
│   ├── vite.config.ts                      # ⚙️ Vite 配置
│   ├── tsconfig.json                       # 📘 TypeScript 配置
│   └── README.md                           # 📖 使用说明
├── docs/                                   # 📚 文档网站
└── examples/                               # 💡 独立示例应用
```

### 保留现有功能的映射方案

#### 1. 基础功能保留映射

```typescript
// 现有: __test__/main.tsx + App.tsx
// 新位置: apps/playground/src/pages/basic/BasicPlayer.tsx

export function BasicPlayerPage() {
  return (
    <PlaygroundLayout title="基础播放器" description="Five + Player 直接集成演示">
      <div className="demo-container">
        <FiveProvider initialWork={parseWork(selectedWork)}>
          <ResponsiveFiveCanvas />
          <BasicPlayerControls />
        </FiveProvider>
      </div>
      <div className="config-panel">
        <DataSelector 
          category="vreo-units" 
          onSelect={setSelectedData}
          current={selectedData}
        />
        <ConfigPanel 
          config={playerConfig}
          onChange={setPlayerConfig}
        />
      </div>
    </PlaygroundLayout>
  )
}
```

#### 2. React 集成保留映射

```typescript
// 现有: __test__/main-react.tsx + AppReact.tsx  
// 新位置: apps/playground/src/pages/basic/ReactIntegration.tsx

export function ReactIntegrationPage() {
  return (
    <PlaygroundLayout title="React 集成" description="VreoProvider + Hooks 演示">
      <div className="demo-container">
        <FiveProvider initialWork={parseWork(selectedWork)}>
          <ResponsiveFiveCanvas />
          <VreoProvider configs={{ customKeyframes: [SpatialScenePanel] }}>
            <ReactPlayerControls />
          </VreoProvider>
        </FiveProvider>
      </div>
      <div className="debug-panel">
        <StateDisplay />
        <EventLogger />
      </div>
    </PlaygroundLayout>
  )
}
```

#### 3. 功能分类演示增强

```typescript
// 现有: __test__/examples/player.tsx
// 新位置: apps/playground/src/pages/features/

const FEATURE_PAGES = [
  { id: 'camera-movement', name: '相机运镜', component: CameraMovementPage },
  { id: 'pano-tag', name: '全景标签', component: PanoTagPage },
  { id: 'model-video', name: '视频投放', component: ModelVideoPage },
  { id: 'video-effect', name: '视频特效', component: VideoEffectPage },
  { id: 'bg-music', name: '背景音乐', component: BgMusicPage },
]

export function CameraMovementPage() {
  return (
    <PlaygroundLayout title="相机运镜" description="相机运镜功能演示">
      <div className="demo-container">
        <VreoPlayer 
          data={CameraMovementData}
          onStateChange={handleStateChange}
        />
      </div>
      <div className="control-panel">
        <h3>运镜参数调试</h3>
        <ParameterEditor 
          parameters={cameraParams}
          onChange={setCameraParams}
        />
        <CodeViewer 
          language="typescript"
          code={generateCameraMovementCode(cameraParams)}
        />
      </div>
    </PlaygroundLayout>
  )
}
```

### 数据管理系统升级

#### 统一数据管理器

```typescript
// apps/playground/src/utils/dataManager.ts

export interface TestDataCategory {
  id: string
  name: string
  description: string
  items: TestDataItem[]
}

export interface TestDataItem {
  id: string
  name: string
  description: string
  tags: string[]
  size: number
  data: VreoUnit | Work
  metadata: {
    author: string
    createdAt: string
    features: string[]
    complexity: 'simple' | 'medium' | 'complex'
  }
}

export class DataManager {
  private categories: Map<string, TestDataCategory> = new Map()

  constructor() {
    this.loadTestData()
  }

  // 加载现有测试数据
  private loadTestData() {
    // 从现有 __test__/data/ 迁移数据
    const vreoUnitsCategory: TestDataCategory = {
      id: 'vreo-units',
      name: 'VreoUnit 剧本数据',
      description: '各种场景的剧本测试数据',
      items: [
        {
          id: 'vreo-unit-a',
          name: '完整功能测试',
          description: '包含弹层视频的完整剧本',
          tags: ['complete', 'popup-video', 'complex'],
          size: 24576, // 24KB
          data: vreoUnitAData,
          metadata: {
            author: 'Realsee Team',
            createdAt: '2024-01-01',
            features: ['camera-movement', 'pano-tag', 'video-effect'],
            complexity: 'complex'
          }
        },
        // ... 其他测试用例
      ]
    }
    
    this.categories.set('vreo-units', vreoUnitsCategory)
  }

  getCategory(id: string): TestDataCategory | undefined {
    return this.categories.get(id)
  }

  getDataItem(categoryId: string, itemId: string): TestDataItem | undefined {
    const category = this.categories.get(categoryId)
    return category?.items.find(item => item.id === itemId)
  }

  searchData(query: string, filters?: {
    category?: string
    tags?: string[]
    complexity?: string
  }): TestDataItem[] {
    // 实现数据搜索和过滤逻辑
  }
}
```

#### 数据选择器组件

```typescript
// apps/playground/src/components/data/DataSelector.tsx

export interface DataSelectorProps {
  category: string
  onSelect: (item: TestDataItem) => void
  current?: TestDataItem
}

export function DataSelector({ category, onSelect, current }: DataSelectorProps) {
  const { dataManager } = useDataManager()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const categoryData = dataManager.getCategory(category)
  const filteredItems = categoryData?.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => item.tags.includes(tag))
    return matchesSearch && matchesTags
  }) || []

  return (
    <div className="data-selector">
      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索测试数据..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="tag-filters">
        {getAllTags(categoryData).map(tag => (
          <button
            key={tag}
            className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="data-list">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`data-item ${current?.id === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item)}
          >
            <div className="item-header">
              <h4>{item.name}</h4>
              <span className="complexity-badge complexity-{item.metadata.complexity}">
                {item.metadata.complexity}
              </span>
            </div>
            <p className="item-description">{item.description}</p>
            <div className="item-meta">
              <span className="size">{formatFileSize(item.size)}</span>
              <div className="tags">
                {item.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 调试和开发工具增强

#### 状态检查器

```typescript
// apps/playground/src/components/debug/StateInspector.tsx

export function StateInspector() {
  const { player } = useVreoPlayer()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const playerState = useMemo(() => {
    if (!player) return null
    
    return {
      basic: {
        duration: player.duration,
        currentTime: player.currentTime,
        paused: player.paused,
        loaded: player.loaded,
        volume: player.volume
      },
      five: {
        panoIndex: player.five.panoIndex,
        camera: player.five.camera,
        work: player.five.work
      },
      keyframes: {
        current: player.currentKeyframe,
        queue: player.keyframeQueue,
        executed: player.executedKeyframes
      }
    }
  }, [player])

  return (
    <div className="state-inspector">
      <h3>播放器状态检查器</h3>
      
      {playerState && (
        <div className="state-sections">
          <StateSection
            title="基础状态"
            data={playerState.basic}
            expanded={expandedSections.has('basic')}
            onToggle={() => toggleSection('basic')}
          />
          <StateSection
            title="Five 状态"
            data={playerState.five}
            expanded={expandedSections.has('five')}
            onToggle={() => toggleSection('five')}
          />
          <StateSection
            title="关键帧状态"
            data={playerState.keyframes}
            expanded={expandedSections.has('keyframes')}
            onToggle={() => toggleSection('keyframes')}
          />
        </div>
      )}
    </div>
  )
}
```

#### 性能监控器

```typescript
// apps/playground/src/utils/performanceMonitor.ts

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private observers: PerformanceObserver[] = []

  startMonitoring() {
    // 监控渲染性能
    this.observeRenderPerformance()
    // 监控内存使用
    this.observeMemoryUsage()
    // 监控网络请求
    this.observeNetworkRequests()
  }

  private observeRenderPerformance() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.entryType === 'measure') {
          this.recordMetric('render', {
            name: entry.name,
            duration: entry.duration,
            timestamp: entry.startTime
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['measure'] })
    this.observers.push(observer)
  }

  recordMetric(category: string, data: any) {
    const key = `${category}-${Date.now()}`
    this.metrics.set(key, {
      category,
      data,
      timestamp: Date.now()
    })
  }

  getMetrics(category?: string): PerformanceMetric[] {
    const allMetrics = Array.from(this.metrics.values())
    return category 
      ? allMetrics.filter(m => m.category === category)
      : allMetrics
  }

  generateReport(): PerformanceReport {
    return {
      renderMetrics: this.getMetrics('render'),
      memoryMetrics: this.getMetrics('memory'),
      networkMetrics: this.getMetrics('network'),
      summary: this.calculateSummary()
    }
  }
}
```

### 自动化测试集成

#### E2E 测试场景

```typescript
// apps/playground/src/tests/e2e/playground.spec.ts

describe('Playground E2E Tests', () => {
  test('基础播放器功能测试', async ({ page }) => {
    await page.goto('/playground/basic/basic-player')
    
    // 选择测试数据
    await page.click('[data-testid="data-selector"]')
    await page.click('[data-testid="vreo-unit-basic"]')
    
    // 测试播放功能
    await page.click('[data-testid="play-button"]')
    await expect(page.locator('[data-testid="player-state"]')).toHaveText('playing')
    
    // 测试暂停功能
    await page.click('[data-testid="pause-button"]')
    await expect(page.locator('[data-testid="player-state"]')).toHaveText('paused')
  })

  test('React 集成功能测试', async ({ page }) => {
    await page.goto('/playground/basic/react-integration')
    
    // 测试 Hooks 状态同步
    await page.click('[data-testid="load-data-button"]')
    await expect(page.locator('[data-testid="hook-state"]')).toContainText('loaded')
    
    // 测试事件处理
    await page.click('[data-testid="play-button"]')
    await expect(page.locator('[data-testid="event-log"]')).toContainText('playing')
  })

  test('内存泄漏测试', async ({ page }) => {
    await page.goto('/playground/stress-test/memory-leak-test')
    
    // 记录初始内存
    const initialMemory = await page.evaluate(() => performance.memory.usedJSHeapSize)
    
    // 执行多次创建/销毁
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="create-player"]')
      await page.waitForSelector('[data-testid="player-ready"]')
      await page.click('[data-testid="destroy-player"]')
      await page.waitForSelector('[data-testid="player-destroyed"]')
    }
    
    // 强制垃圾回收并检查内存
    await page.evaluate(() => {
      if (window.gc) window.gc()
    })
    
    const finalMemory = await page.evaluate(() => performance.memory.usedJSHeapSize)
    const memoryIncrease = finalMemory - initialMemory
    
    // 内存增长应该在合理范围内 (< 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })
})
```

### 迁移实施计划

#### 阶段 1: 基础结构搭建 (Week 2 Days 13-14)

```bash
# 创建新的 playground 应用结构
cd vreo-monorepo/apps
mkdir -p playground/src/{pages,components,data,utils,hooks,styles}

# 迁移基础文件
cp ../../__test__/index.css playground/src/styles/globals.css
cp -r ../../__test__/components/* playground/src/components/canvas/
cp -r ../../__test__/data/* playground/src/data/

# 创建基础页面组件
touch playground/src/pages/basic/{BasicPlayer,ReactIntegration,DynamicLifecycle,PartialContainer}.tsx
```

#### 阶段 2: 功能迁移 (Week 4 Days 22-28)

- **Day 22-23**: 迁移基础播放器功能 (`main.tsx` + `App.tsx`)
- **Day 24-25**: 迁移 React 集成功能 (`main-react.tsx` + `AppReact.tsx`)  
- **Day 26**: 迁移动态创建销毁功能 (`main-react-dynamic.tsx`)
- **Day 27**: 迁移部分容器功能 (`main-react-partial.tsx`)
- **Day 28**: 迁移功能分类演示 (`examples/`)

#### 阶段 3: 增强和优化 (Week 5-6)

- **Week 5**: 实现数据管理系统、调试工具、性能监控
- **Week 6**: 集成自动化测试、完善文档、用户体验优化

### 验收标准

#### 功能完整性
- [ ] 所有现有 `__test__/` 功能都能在新 playground 中访问
- [ ] 所有测试数据都能正常加载和使用
- [ ] 所有演示场景都能正常运行

#### 开发体验提升
- [ ] 统一的导航和布局系统
- [ ] 实时的状态检查和调试工具
- [ ] 便捷的数据选择和配置界面
- [ ] 完善的性能监控和报告

#### 自动化测试覆盖
- [ ] 所有主要功能都有 E2E 测试覆盖
- [ ] 内存泄漏和性能回归测试
- [ ] 跨浏览器兼容性测试

#### 文档和示例
- [ ] 每个功能都有详细的使用说明
- [ ] 提供完整的代码示例和最佳实践
- [ ] 面向新用户的引导和教程

---

通过这样的设计，我们不仅完全保留了现有 playground 的所有价值，还在此基础上进行了现代化升级，提供了更好的开发体验、更强的调试能力和更完善的测试覆盖。

## 📚 文档系统现代化升级

### 现有文档系统分析

#### 🎯 当前文档架构

项目目前使用 **TypeDoc** 生成 API 文档，通过 unpkg CDN 提供在线访问：

```
docs/                                       # TypeDoc 生成的文档
├── index.html                             # 主文档页面
├── modules.html                           # 模块索引
├── hierarchy.html                         # 类型层次结构
├── classes/                               # 类文档
├── interfaces/                            # 接口文档
├── types/                                 # 类型文档
├── enums/                                 # 枚举文档
├── functions/                             # 函数文档
├── variables/                             # 变量文档
├── modules/                               # 模块文档
├── assets/                                # 样式和资源
└── demo/                                  # 演示资源

typedoc/                                   # TypeDoc 入口点配置
├── Player.ts                              # Player 相关类型导出
├── react.ts                               # React 相关类型导出
├── fivePlugins.ts                         # Five 插件类型导出
└── custom.ts                              # 自定义类型导出

docs-theme/                                # TypeDoc 自定义主题
└── custom.css                             # 自定义样式

typedoc.json                               # TypeDoc 配置文件
```

#### 📊 现有配置分析

**typedoc.json 配置**:
```json
{
  "name": "Vreo",
  "entryPoints": [
    "./typedoc/fivePlugins.ts", 
    "./typedoc/Player.ts", 
    "./typedoc/react.ts",  
    "./typedoc/custom.ts"
  ],
  "out": "./docs",
  "customCss": "./docs-theme/custom.css",
  "theme": "default"
}
```

**文档入口点**:
- `Player.ts`: 播放器核心 API (14个类型导出)
- `react.ts`: React 集成 API (6个类型导出)
- `fivePlugins.ts`: Five 插件 API (16个类型导出)
- `custom.ts`: 自定义扩展 API

#### 🚨 现有问题分析

1. **文档孤立性**: TypeDoc 生成的 API 文档与用户指南分离
2. **维护负担**: 需要手动维护 typedoc 入口点文件
3. **用户体验差**: 纯 API 文档缺乏使用示例和教程
4. **版本管理**: 通过 unpkg 访问，版本控制不够灵活
5. **搜索能力弱**: 缺乏全文搜索和智能导航
6. **移动端体验**: TypeDoc 默认主题对移动端不友好

### 新文档系统架构设计

#### 🎯 设计目标

1. **统一体验**: API 文档与用户指南无缝集成
2. **自动化生成**: 从源码注释自动生成，减少维护负担
3. **交互式文档**: 提供在线示例和代码演示
4. **现代化体验**: 支持搜索、主题切换、响应式布局
5. **版本化管理**: 支持多版本文档并存

#### 🏗️ 新架构设计

```
apps/
├── docs/                                   # 📚 统一文档网站
│   ├── src/
│   │   ├── pages/                         # 📄 文档页面
│   │   │   ├── guides/                    # 用户指南
│   │   │   ├── api/                       # API 文档
│   │   │   │   ├── auto-generated/       # 自动生成的 API 文档
│   │   │   │   └── manual/                # 手动编写的 API 补充
│   │   │   ├── examples/                  # 示例代码
│   │   │   ├── tutorials/                 # 教程
│   │   │   └── reference/                 # 参考资料
│   │   ├── components/                    # 📦 文档组件
│   │   │   ├── layout/                    # 布局组件
│   │   │   │   ├── DocLayout.tsx          # 文档布局
│   │   │   │   ├── Sidebar.tsx            # 侧边栏导航
│   │   │   │   ├── Header.tsx             # 页头
│   │   │   │   └── Footer.tsx             # 页脚
│   │   │   ├── api/                       # API 文档组件
│   │   │   │   ├── ApiReference.tsx       # API 参考组件
│   │   │   │   ├── TypeDefinition.tsx     # 类型定义组件
│   │   │   │   ├── MethodSignature.tsx    # 方法签名组件
│   │   │   │   └── ExampleCode.tsx        # 示例代码组件
│   │   │   ├── interactive/               # 交互式组件
│   │   │   │   ├── CodeEditor.tsx         # 代码编辑器
│   │   │   │   ├── LivePreview.tsx        # 实时预览
│   │   │   │   └── PlaygroundEmbed.tsx    # Playground 嵌入
│   │   │   └── common/                    # 通用组件
│   │   │       ├── CodeBlock.tsx          # 代码块
│   │   │       ├── TableOfContents.tsx    # 目录
│   │   │       └── SearchBox.tsx          # 搜索框
│   │   ├── content/                       # 📝 文档内容
│   │   │   ├── guides/                    # Markdown 指南
│   │   │   ├── tutorials/                 # Markdown 教程
│   │   │   └── examples/                  # 示例文件
│   │   ├── data/                          # 📊 文档数据
│   │   │   ├── navigation.ts              # 导航配置
│   │   │   ├── api-meta.ts                # API 元数据
│   │   │   └── examples-index.ts          # 示例索引
│   │   ├── utils/                         # 🛠️ 工具函数
│   │   │   ├── api-generator.ts           # API 文档生成器
│   │   │   ├── markdown-parser.ts         # Markdown 解析器
│   │   │   └── search-indexer.ts          # 搜索索引构建
│   │   ├── styles/                        # 🎨 样式文件
│   │   │   ├── globals.css                # 全局样式
│   │   │   ├── themes/                    # 主题样式
│   │   │   │   ├── light.css              # 亮色主题
│   │   │   │   └── dark.css               # 暗色主题
│   │   │   └── components.css             # 组件样式
│   │   ├── App.tsx                        # 文档应用入口
│   │   └── main.tsx                       # 应用启动文件
│   ├── scripts/                           # 📜 构建脚本
│   │   ├── generate-api-docs.ts           # API 文档生成脚本
│   │   ├── build-search-index.ts          # 搜索索引构建脚本
│   │   └── sync-content.ts                # 内容同步脚本
│   ├── public/                            # 📁 静态资源
│   ├── package.json                       # 依赖配置
│   ├── vite.config.ts                     # Vite 配置
│   ├── typedoc.config.js                  # TypeDoc 配置
│   └── README.md
└── playground/                             # 🎮 Playground (已设计)
```

### API 文档自动化生成

#### 🔧 TypeDoc 集成升级

```typescript
// apps/docs/typedoc.config.js

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  name: 'Vreo API Reference',
  entryPoints: [
    '../../packages/vreo/src/index.ts',
    '../../packages/react/src/index.ts'
  ],
  entryPointStrategy: 'expand',
  
  // 输出配置
  out: './src/pages/api/auto-generated',
  
  // 自定义渲染器
  theme: './src/utils/custom-theme',
  plugin: ['typedoc-plugin-markdown', '@typedoc/plugin-react'],
  
  // Markdown 输出配置
  outputFileStrategy: 'modules',
  fileExtension: '.md',
  entryDocument: 'api-index.md',
  
  // 文档增强
  includeVersion: true,
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: false,
  
  // 代码示例集成
  exampleTags: ['@example'],
  
  // 自定义标签
  blockTags: [
    '@description',
    '@param', 
    '@returns',
    '@example',
    '@since',
    '@deprecated',
    '@see',
    '@internal'
  ],
  
  // 链接配置
  gitRevision: 'main',
  gitRemote: 'origin',
  
  // 搜索配置
  searchInComments: true,
  searchInDocuments: true
}
```

#### 📝 自动化生成脚本

```typescript
// apps/docs/scripts/generate-api-docs.ts

import { Application, TSConfigReader, TypeDocReader } from 'typedoc'
import * as fs from 'fs-extra'
import * as path from 'path'

interface ApiDocGenerator {
  generateApiDocs(): Promise<void>
  processGeneratedDocs(): Promise<void>
  createApiIndex(): Promise<void>
  extractExamples(): Promise<void>
}

export class ApiDocGenerator implements ApiDocGenerator {
  private app: Application
  
  constructor() {
    this.app = new Application()
    this.app.options.addReader(new TSConfigReader())
    this.app.options.addReader(new TypeDocReader())
  }

  async generateApiDocs(): Promise<void> {
    console.log('🚀 生成 API 文档...')
    
    // 加载配置
    this.app.bootstrap({
      configFilePath: './typedoc.config.js'
    })

    // 获取项目
    const project = this.app.convert()
    if (!project) {
      throw new Error('Failed to convert project')
    }

    // 生成文档
    await this.app.generateDocs(project, './src/pages/api/auto-generated')
    
    console.log('✅ API 文档生成完成')
    
    // 后处理生成的文档
    await this.processGeneratedDocs()
  }

  async processGeneratedDocs(): Promise<void> {
    console.log('🔧 处理生成的文档...')
    
    const docsDir = './src/pages/api/auto-generated'
    const files = await fs.readdir(docsDir, { recursive: true })
    
    for (const file of files) {
      if (path.extname(file) === '.md') {
        await this.enhanceMarkdownFile(path.join(docsDir, file))
      }
    }
    
    console.log('✅ 文档处理完成')
  }

  private async enhanceMarkdownFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8')
    
    // 添加 frontmatter
    const frontmatter = this.generateFrontmatter(filePath)
    
    // 增强代码示例
    const enhancedContent = this.enhanceCodeExamples(content)
    
    // 添加交互式组件
    const interactiveContent = this.addInteractiveComponents(enhancedContent)
    
    // 写入增强后的内容
    const finalContent = `${frontmatter}\n\n${interactiveContent}`
    await fs.writeFile(filePath, finalContent)
  }

  private generateFrontmatter(filePath: string): string {
    const relativePath = path.relative('./src/pages/api/auto-generated', filePath)
    const title = this.extractTitleFromPath(relativePath)
    
    return `---
title: ${title}
description: ${title} API 参考
sidebar_position: auto
tags: [api, auto-generated]
---`
  }

  private enhanceCodeExamples(content: string): string {
    // 将 @example 标签转换为可执行的代码示例
    return content.replace(
      /```typescript\n([\s\S]*?)```/g,
      (match, code) => {
        return `\`\`\`typescript title="示例代码"
${code}
\`\`\`

<LiveExample>
${code}
</LiveExample>`
      }
    )
  }

  private addInteractiveComponents(content: string): string {
    // 添加交互式组件
    return content.replace(
      /## Methods/g,
      '## Methods\n\n<ApiMethodsList />'
    ).replace(
      /## Properties/g,
      '## Properties\n\n<ApiPropertiesList />'
    )
  }

  async createApiIndex(): Promise<void> {
    console.log('📑 创建 API 索引...')
    
    const packages = [
      { name: '@realsee/vreo', path: '../../packages/vreo' },
      { name: '@realsee/vreo-react', path: '../../packages/react' }
    ]
    
    const indexContent = await this.generateApiIndexContent(packages)
    await fs.writeFile('./src/pages/api/index.md', indexContent)
    
    console.log('✅ API 索引创建完成')
  }

  private async generateApiIndexContent(packages: any[]): Promise<string> {
    let content = `---
title: API 参考
description: Vreo API 完整参考文档
sidebar_position: 1
---

# 📖 API 参考

这里是 Vreo 的完整 API 参考文档，包含所有公开的类、接口、函数和类型定义。

## 📦 包概览

`

    for (const pkg of packages) {
      const packageInfo = await this.getPackageInfo(pkg)
      content += `
### ${pkg.name}

${packageInfo.description}

- **版本**: ${packageInfo.version}
- **入口点**: \`${packageInfo.main}\`
- **类型定义**: \`${packageInfo.types}\`

**主要模块**:
${packageInfo.modules.map(m => `- [${m.name}](./auto-generated/${m.slug})`).join('\n')}

`
    }

    content += `
## 🔍 快速搜索

使用页面右上角的搜索框快速查找 API：

- 搜索类名：\`Player\`、\`Controller\`
- 搜索方法：\`play\`、\`pause\`、\`load\`  
- 搜索类型：\`VreoUnit\`、\`Keyframe\`

## 💡 使用示例

每个 API 都包含详细的使用示例和最佳实践。点击任意 API 项目查看：

- 📝 **详细说明**: 功能描述和使用场景
- 🔧 **参数说明**: 完整的参数类型和说明
- 💻 **代码示例**: 可运行的示例代码
- 🎮 **在线演示**: 链接到 Playground 的实时演示

## 📚 相关文档

- [快速开始](../guides/quick-start) - 5分钟上手指南
- [使用示例](../examples/) - 实用代码示例
- [Playground](../../playground/) - 在线试用和调试
`

    return content
  }

  async extractExamples(): Promise<void> {
    console.log('📋 提取代码示例...')
    
    // 从源码注释中提取 @example 标签
    // 生成独立的示例文件
    // 创建示例索引
    
    console.log('✅ 示例提取完成')
  }
}

// 执行脚本
async function main() {
  const generator = new ApiDocGenerator()
  
  try {
    await generator.generateApiDocs()
    await generator.createApiIndex()
    await generator.extractExamples()
    
    console.log('🎉 API 文档生成完成！')
  } catch (error) {
    console.error('❌ 文档生成失败:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
```

### 交互式文档组件

#### 🎮 实时代码演示

```tsx
// apps/docs/src/components/interactive/LiveExample.tsx

import React, { useState, useEffect } from 'react'
import { CodeEditor } from './CodeEditor'
import { PreviewPane } from './PreviewPane'
import { Player } from '@realsee/vreo'

interface LiveExampleProps {
  code: string
  title?: string
  dependencies?: string[]
  showEditor?: boolean
  height?: number
}

export function LiveExample({ 
  code, 
  title = "实时示例", 
  dependencies = [], 
  showEditor = true,
  height = 400 
}: LiveExampleProps) {
  const [currentCode, setCurrentCode] = useState(code)
  const [output, setOutput] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    executeCode(currentCode)
  }, [currentCode])

  const executeCode = async (codeToRun: string) => {
    setIsRunning(true)
    setError(null)

    try {
      // 创建安全的代码执行环境
      const wrappedCode = `
        (async function() {
          ${codeToRun}
        })()
      `
      
      // 提供 API 访问
      const context = {
        Player,
        console: {
          log: (...args: any[]) => setOutput(prev => [...(prev || []), ...args])
        }
      }
      
      // 执行代码
      const result = await eval(wrappedCode)
      setOutput(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="live-example">
      <div className="example-header">
        <h4>{title}</h4>
        <div className="example-actions">
          <button 
            onClick={() => executeCode(currentCode)}
            disabled={isRunning}
            className="run-button"
          >
            {isRunning ? '⏳ 运行中...' : '▶️ 运行'}
          </button>
          <button 
            onClick={() => setCurrentCode(code)}
            className="reset-button"
          >
            🔄 重置
          </button>
        </div>
      </div>
      
      <div className="example-content" style={{ height }}>
        {showEditor && (
          <div className="editor-pane">
            <CodeEditor
              value={currentCode}
              onChange={setCurrentCode}
              language="typescript"
              height={height / 2}
            />
          </div>
        )}
        
        <div className="preview-pane">
          <PreviewPane 
            output={output}
            error={error}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  )
}
```

#### 📖 API 方法列表组件

```tsx
// apps/docs/src/components/api/ApiMethodsList.tsx

import React, { useState } from 'react'
import { ApiMethod, ApiParameter } from '../types/api'

interface ApiMethodsListProps {
  methods: ApiMethod[]
  className?: string
}

export function ApiMethodsList({ methods, className }: ApiMethodsListProps) {
  const [expandedMethods, setExpandedMethods] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState('')

  const filteredMethods = methods.filter(method =>
    method.name.toLowerCase().includes(filter.toLowerCase()) ||
    method.description.toLowerCase().includes(filter.toLowerCase())
  )

  const toggleMethod = (methodName: string) => {
    const newExpanded = new Set(expandedMethods)
    if (newExpanded.has(methodName)) {
      newExpanded.delete(methodName)
    } else {
      newExpanded.add(methodName)
    }
    setExpandedMethods(newExpanded)
  }

  return (
    <div className={`api-methods-list ${className || ''}`}>
      <div className="methods-header">
        <h3>方法列表</h3>
        <input
          type="text"
          placeholder="搜索方法..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="methods-filter"
        />
      </div>

      <div className="methods-grid">
        {filteredMethods.map((method) => (
          <div 
            key={method.name} 
            className={`method-card ${expandedMethods.has(method.name) ? 'expanded' : ''}`}
          >
            <div 
              className="method-header"
              onClick={() => toggleMethod(method.name)}
            >
              <div className="method-signature">
                <span className="method-name">{method.name}</span>
                <span className="method-params">
                  ({method.parameters.map(p => p.name).join(', ')})
                </span>
                <span className="method-return">
                  : {method.returnType}
                </span>
              </div>
              <div className="method-badges">
                {method.isAsync && <span className="badge async">async</span>}
                {method.isDeprecated && <span className="badge deprecated">deprecated</span>}
                {method.isStatic && <span className="badge static">static</span>}
              </div>
            </div>

            {expandedMethods.has(method.name) && (
              <div className="method-details">
                <p className="method-description">{method.description}</p>
                
                {method.parameters.length > 0 && (
                  <div className="method-parameters">
                    <h5>参数</h5>
                    <table className="parameters-table">
                      <thead>
                        <tr>
                          <th>名称</th>
                          <th>类型</th>
                          <th>默认值</th>
                          <th>说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {method.parameters.map((param) => (
                          <tr key={param.name}>
                            <td>
                              <code>{param.name}</code>
                              {param.isOptional && <span className="optional">?</span>}
                            </td>
                            <td><code>{param.type}</code></td>
                            <td>{param.defaultValue || '-'}</td>
                            <td>{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {method.examples && method.examples.length > 0 && (
                  <div className="method-examples">
                    <h5>示例</h5>
                    {method.examples.map((example, index) => (
                      <div key={index} className="example">
                        <LiveExample
                          code={example.code}
                          title={example.title}
                          showEditor={false}
                          height={200}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="method-links">
                  <a href={`/playground/?example=${method.name}`} target="_blank">
                    🎮 在 Playground 中试用
                  </a>
                  <a href={method.sourceUrl} target="_blank">
                    📄 查看源码
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 文档网站构建配置

#### ⚙️ Vite 配置

```typescript
// apps/docs/vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    // 自定义插件：Markdown 处理
    {
      name: 'markdown-processor',
      transform(code, id) {
        if (id.endsWith('.md')) {
          // 将 Markdown 转换为 React 组件
          return `export default ${JSON.stringify(code)}`
        }
      }
    },
    // 自定义插件：API 文档同步
    {
      name: 'api-docs-sync',
      buildStart() {
        // 构建开始时同步 API 文档
        console.log('同步 API 文档...')
      }
    }
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@realsee/vreo': resolve(__dirname, '../../packages/vreo/src'),
      '@realsee/vreo-react': resolve(__dirname, '../../packages/react/src')
    }
  },

  server: {
    fs: {
      allow: [
        // 允许访问 monorepo 根目录
        searchForWorkspaceRoot(process.cwd())
      ]
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      
      external: [
        // 外部化大型依赖
        '@realsee/five'
      ],
      
      output: {
        manualChunks: {
          // 代码分割
          'vendor': ['react', 'react-dom'],
          'editor': ['monaco-editor'],
          'docs': ['remark', 'rehype']
        }
      }
    }
  },

  optimizeDeps: {
    include: [
      '@realsee/vreo',
      '@realsee/vreo-react'
    ]
  }
})
```

#### 📜 构建脚本集成

```json
// apps/docs/package.json

{
  "name": "@vreo/docs",
  "scripts": {
    "dev": "npm run generate:api && vite",
    "build": "npm run generate:api && npm run build:search && vite build",
    "preview": "vite preview",
    
    "generate:api": "tsx scripts/generate-api-docs.ts",
    "build:search": "tsx scripts/build-search-index.ts",
    "sync:content": "tsx scripts/sync-content.ts",
    
    "typedoc": "typedoc --options typedoc.config.js",
    "typedoc:watch": "typedoc --options typedoc.config.js --watch",
    
    "deploy": "npm run build && npm run deploy:static"
  },
  
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.8.0",
    
    "@realsee/vreo": "workspace:*",
    "@realsee/vreo-react": "workspace:*",
    
    "remark": "^14.0.2",
    "remark-gfm": "^3.0.1",
    "rehype-highlight": "^6.0.0",
    "monaco-editor": "^0.44.0",
    "fuse.js": "^6.6.2"
  },
  
  "devDependencies": {
    "vite": "^6.3.5",
    "@vitejs/plugin-react": "^4.2.0",
    "typedoc": "^0.28.5",
    "typedoc-plugin-markdown": "^3.17.1",
    "@typedoc/plugin-react": "^0.1.0",
    "tsx": "^4.7.0"
  }
}
```

### 部署和版本管理

#### 🚀 多版本文档支持

```typescript
// apps/docs/scripts/deploy-docs.ts

interface DocumentationDeployment {
  deployDocs(version: string, target: 'production' | 'staging'): Promise<void>
  createVersionIndex(): Promise<void>
  setupRedirects(): Promise<void>
}

export class DocsDeployment implements DocumentationDeployment {
  async deployDocs(version: string, target: 'production' | 'staging'): Promise<void> {
    console.log(`🚀 部署文档版本 ${version} 到 ${target}...`)
    
    // 构建文档
    await this.buildDocs(version)
    
    // 版本化处理
    await this.versionizeDocs(version)
    
    // 部署到目标环境
    await this.deployToTarget(version, target)
    
    // 更新版本索引
    await this.updateVersionIndex(version)
    
    console.log(`✅ 文档部署完成: ${version}`)
  }

  private async buildDocs(version: string): Promise<void> {
    // 设置版本环境变量
    process.env.VREO_VERSION = version
    process.env.NODE_ENV = 'production'
    
    // 生成 API 文档
    await exec('npm run generate:api')
    
    // 构建静态站点
    await exec('npm run build')
  }

  private async versionizeDocs(version: string): Promise<void> {
    const distDir = './dist'
    const versionedDir = `./versions/${version}`
    
    // 复制构建产物到版本目录
    await fs.copy(distDir, versionedDir)
    
    // 更新版本特定的配置
    await this.updateVersionConfig(versionedDir, version)
  }

  async createVersionIndex(): Promise<void> {
    const versions = await this.getAvailableVersions()
    const indexContent = this.generateVersionIndexHTML(versions)
    
    await fs.writeFile('./versions/index.html', indexContent)
  }

  async setupRedirects(): Promise<void> {
    const redirects = [
      { from: '/docs', to: '/docs/latest' },
      { from: '/api', to: '/docs/latest/api' },
      { from: '/playground', to: '/playground/latest' }
    ]
    
    const redirectsContent = redirects
      .map(r => `${r.from} ${r.to} 302`)
      .join('\n')
    
    await fs.writeFile('./dist/_redirects', redirectsContent)
  }
}
```

### 搜索功能集成

#### 🔍 全文搜索实现

```typescript
// apps/docs/src/utils/search-indexer.ts

import Fuse from 'fuse.js'

interface SearchDocument {
  id: string
  title: string
  content: string
  url: string
  type: 'guide' | 'api' | 'example' | 'tutorial'
  tags: string[]
  section: string
}

export class SearchIndexer {
  private documents: SearchDocument[] = []
  private fuse: Fuse<SearchDocument>

  constructor() {
    this.initializeFuse()
  }

  private initializeFuse() {
    const options = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'section', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    }
    
    this.fuse = new Fuse(this.documents, options)
  }

  async buildIndex(): Promise<void> {
    console.log('🔍 构建搜索索引...')
    
    // 索引用户指南
    await this.indexGuides()
    
    // 索引 API 文档
    await this.indexApiDocs()
    
    // 索引示例代码
    await this.indexExamples()
    
    // 索引教程
    await this.indexTutorials()
    
    // 重新初始化 Fuse
    this.initializeFuse()
    
    // 保存索引
    await this.saveIndex()
    
    console.log(`✅ 搜索索引构建完成，包含 ${this.documents.length} 个文档`)
  }

  private async indexGuides(): Promise<void> {
    const guidesDir = './src/content/guides'
    const guideFiles = await fs.readdir(guidesDir, { recursive: true })
    
    for (const file of guideFiles) {
      if (path.extname(file) === '.md') {
        const content = await fs.readFile(path.join(guidesDir, file), 'utf-8')
        const { title, tags, content: bodyContent } = this.parseMarkdown(content)
        
        this.documents.push({
          id: `guide-${path.basename(file, '.md')}`,
          title: title || path.basename(file, '.md'),
          content: bodyContent,
          url: `/guides/${path.basename(file, '.md')}`,
          type: 'guide',
          tags: tags || [],
          section: 'guides'
        })
      }
    }
  }

  search(query: string, filters?: {
    type?: string[]
    section?: string[]
  }): SearchResult[] {
    let results = this.fuse.search(query)
    
    // 应用过滤器
    if (filters) {
      results = results.filter(result => {
        const doc = result.item
        
        if (filters.type && !filters.type.includes(doc.type)) {
          return false
        }
        
        if (filters.section && !filters.section.includes(doc.section)) {
          return false
        }
        
        return true
      })
    }
    
    // 转换结果格式
    return results.map(result => ({
      document: result.item,
      score: result.score || 0,
      matches: result.matches || [],
      highlights: this.generateHighlights(result)
    }))
  }
}
```

### 迁移实施计划

#### 阶段 1: 文档基础架构 (Week 3 Days 15-17)

- **Day 15**: 搭建文档网站基础架构和组件系统
- **Day 16**: 配置 TypeDoc 自动化生成流程
- **Day 17**: 实现交互式文档组件和实时演示

#### 阶段 2: 内容迁移和增强 (Week 4 Days 18-21)

- **Day 18**: 迁移现有 API 文档，增强类型说明和示例
- **Day 19**: 创建统一的导航和搜索系统
- **Day 20**: 集成 Playground 链接和在线演示
- **Day 21**: 实现多版本文档支持和部署流程

#### 阶段 3: 优化和集成 (Week 7 Days 43-45)

- **Day 43**: 完善搜索功能和用户体验
- **Day 44**: 集成 CI/CD 自动化文档生成和部署
- **Day 45**: 测试和优化文档网站性能

### 验收标准

#### 功能完整性
- [ ] 所有现有 API 文档都能自动生成并增强
- [ ] 支持交互式代码演示和实时预览
- [ ] 提供全文搜索和智能导航
- [ ] 支持多版本文档并存

#### 用户体验
- [ ] 响应式设计，支持移动端访问
- [ ] 快速的页面加载和搜索响应
- [ ] 清晰的导航和内容组织
- [ ] 与 Playground 的无缝集成

#### 开发体验
- [ ] 自动化的文档生成和部署流程
- [ ] 减少 90% 的手动维护工作
- [ ] CI/CD 集成，代码变更自动更新文档
- [ ] 完善的本地开发和预览环境

---

通过这样的文档系统现代化升级，我们将获得：

1. **统一体验** - API 文档与用户指南无缝集成
2. **自动化维护** - 从源码自动生成，减少维护负担
3. **交互式学习** - 提供在线编辑和实时预览
4. **现代化功能** - 搜索、主题、响应式等现代特性
5. **版本化管理** - 支持多版本文档的专业管理
```

## 🐙 GitHub 生态系统深度集成方案

### 🔄 GitHub Actions 完整流水线

#### 核心 CI/CD 工作流

```yaml
# .github/workflows/ci.yml - 主要 CI 流水线
name: 🚀 CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  # 🔍 代码质量检查
  quality:
    name: 🔍 Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 📦 Setup Node.js & pnpm
        uses: ./.github/actions/setup-node-pnpm
      - name: 🔎 ESLint & Prettier
        run: pnpm run lint:check
      - name: 📘 TypeScript Check
        run: pnpm run type:check
      - name: 🧪 Unit Tests
        run: pnpm run test:unit
      - name: 📊 Upload Coverage
        uses: codecov/codecov-action@v3

  # 🏗️ 构建测试矩阵
  build:
    name: 🏗️ Build (${{ matrix.os }}, Node ${{ matrix.node }})
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - name: 📦 Setup Node.js & pnpm
        uses: ./.github/actions/setup-node-pnpm
        with:
          node-version: ${{ matrix.node }}
      - name: 🏗️ Build Packages
        run: pnpm run build
      - name: 📊 Bundle Analysis
        run: pnpm run analyze:bundle
      - name: 📤 Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.os }}-node${{ matrix.node }}
          path: dist/

  # 🧪 浏览器兼容性测试
  browser-tests:
    name: 🌐 Browser Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - name: 📦 Setup Node.js & pnpm
        uses: ./.github/actions/setup-node-pnpm
      - name: 🎭 Install Playwright
        run: pnpm exec playwright install ${{ matrix.browser }}
      - name: 🧪 E2E Tests
        run: pnpm run test:e2e:${{ matrix.browser }}
      - name: 📤 Upload Test Results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results-${{ matrix.browser }}
          path: test-results/

  # 🚀 性能基准测试
  performance:
    name: ⚡ Performance Benchmarks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 📦 Setup Node.js & pnpm
        uses: ./.github/actions/setup-node-pnpm
      - name: 🏗️ Build for Performance
        run: pnpm run build:perf
      - name: 📈 Lighthouse CI
        run: pnpm run lighthouse:ci
      - name: 📊 Performance Report
        run: pnpm run perf:report
      - name: 💬 Comment PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          message: |
            ## ⚡ Performance Report
            
            $(cat performance-report.md)

  # 🔒 安全扫描
  security:
    name: 🔒 Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 🔍 CodeQL Analysis
        uses: github/codeql-action/analyze@v2
      - name: 🔐 Dependency Check
        run: pnpm audit
      - name: 🛡️ Snyk Security
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

#### 自动化发布流水线

```yaml
# .github/workflows/release.yml
name: 📦 Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Release type'
        required: true
        default: 'patch'
        type: choice
        options:
        - patch
        - minor
        - major
        - prerelease

jobs:
  release:
    name: 📦 Automated Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0
      
      - name: 📦 Setup Node.js & pnpm
        uses: ./.github/actions/setup-node-pnpm
      
      - name: 🏗️ Build All Packages
        run: pnpm run build
      
      - name: 🧪 Run All Tests
        run: pnpm run test:all
      
      - name: 📋 Generate Changelog
        run: pnpm run changelog:generate
      
      - name: 🔖 Version Bump
        run: pnpm changeset version
      
      - name: 📤 Publish to NPM
        run: pnpm changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: 🏷️ Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ env.NEW_VERSION }}
          release_name: Release v${{ env.NEW_VERSION }}
          body_path: CHANGELOG.md
      
      - name: 🌐 Deploy Documentation
        run: pnpm run docs:deploy
      
      - name: 📢 Notify Community
        run: pnpm run notify:release
```

### 🤖 GitHub Apps 和自动化工具

#### Vreo Bot - 智能社区助手

```typescript
// .github/actions/vreo-bot/src/index.ts

import { Probot } from 'probot'

export default (app: Probot) => {
  // 🎉 欢迎新贡献者
  app.on('pull_request.opened', async (context) => {
    const isFirstTime = await checkFirstTimeContributor(context)
    if (isFirstTime) {
      await context.octokit.issues.createComment({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        body: `🎉 感谢您的首次贡献！我们很高兴看到您加入 Vreo 社区。

📖 请确保您已阅读我们的 [贡献指南](CONTRIBUTING.md)
🔍 您的 PR 将由维护者审核，通常在 24-48 小时内回复
💬 如有任何问题，请随时在 [Discussions](../../discussions) 中提问

再次感谢您的贡献！✨`
      })
    }
  })

  // 🏷️ 自动标签管理
  app.on('pull_request.opened', async (context) => {
    const { title, body } = context.payload.pull_request
    const files = await getPRFiles(context)
    
    const labels = []
    
    // 根据文件变更自动打标签
    if (files.some(f => f.includes('packages/vreo/'))) labels.push('package:core')
    if (files.some(f => f.includes('packages/react/'))) labels.push('package:react')
    if (files.some(f => f.includes('apps/docs/'))) labels.push('documentation')
    if (files.some(f => f.includes('apps/playground/'))) labels.push('playground')
    
    // 根据 PR 内容判断类型
    if (title.includes('feat:') || title.includes('✨')) labels.push('enhancement')
    if (title.includes('fix:') || title.includes('🐛')) labels.push('bug')
    if (title.includes('perf:') || title.includes('⚡')) labels.push('performance')
    if (title.includes('BREAKING')) labels.push('breaking-change')
    
    await context.octokit.issues.addLabels({
      ...context.repo,
      issue_number: context.payload.pull_request.number,
      labels
    })
  })

  // 📊 性能影响报告
  app.on('pull_request.synchronize', async (context) => {
    const performanceReport = await generatePerformanceReport(context)
    
    await context.octokit.issues.createComment({
      ...context.repo,
      issue_number: context.payload.pull_request.number,
      body: `## 📊 性能影响报告

${performanceReport.bundleSize.changed ? '📦 Bundle 大小变化:' : '✅ Bundle 大小无变化'}
${performanceReport.bundleSize.diff}

${performanceReport.runtime.changed ? '⚡ 运行时性能:' : '✅ 运行时性能无影响'}
${performanceReport.runtime.diff}

${performanceReport.memoryUsage.changed ? '💾 内存使用:' : '✅ 内存使用无变化'}
${performanceReport.memoryUsage.diff}

<details>
<summary>详细报告</summary>

${performanceReport.details}
</details>`
    })
  })

  // 🎯 Issue 自动分流
  app.on('issues.opened', async (context) => {
    const { title, body } = context.payload.issue
    
    // 自动检测 Issue 类型并分配标签
    if (body.includes('bug') || title.includes('bug')) {
      await assignToTeam(context, 'bug-triage')
    }
    
    if (body.includes('performance') || title.includes('performance')) {
      await assignToTeam(context, 'performance-team')
    }
    
    if (body.includes('documentation') || title.includes('docs')) {
      await assignToTeam(context, 'docs-team')
    }
  })
}
```

### 🏪 GitHub Marketplace 应用

#### Vreo DevTools VS Code 扩展

```typescript
// tools/vscode-extension/src/extension.ts

import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  // 🔍 VreoUnit 智能提示
  const vreoUnitProvider = vscode.languages.registerCompletionItemProvider(
    ['typescript', 'javascript'],
    {
      provideCompletionItems(document, position) {
        const items = []
        
        // Vreo 播放器 API 智能提示
        items.push({
          label: 'VreoPlayer',
          kind: vscode.CompletionItemKind.Class,
          detail: 'Vreo 播放器核心类',
          documentation: '创建 VR 视频播放器实例',
          insertText: new vscode.SnippetString(`VreoPlayer({
  five: $1,
  container: $2,
  vreoUnit: $3
})`)
        })
        
        // 关键帧系统提示
        items.push({
          label: 'CameraMovement',
          kind: vscode.CompletionItemKind.Class,
          detail: '相机运镜关键帧',
          insertText: new vscode.SnippetString(`new CameraMovement({
  duration: $1,
  target: {
    position: { x: $2, y: $3, z: $4 },
    rotation: { x: $5, y: $6, z: $7 }
  }
})`)
        })
        
        return items
      }
    },
    '.' // 触发字符
  )
  
  // 📝 VreoUnit 代码片段
  const snippetsProvider = vscode.languages.registerCompletionItemProvider(
    ['json'],
    {
      provideCompletionItems() {
        return [
          {
            label: 'vreounit-basic',
            detail: '基础 VreoUnit 模板',
            insertText: new vscode.SnippetString(`{
  "name": "$1",
  "version": "1.0.0",
  "scenes": [
    {
      "id": "$2",
      "duration": $3,
      "keyframes": [
        $4
      ]
    }
  ]
}`)
          }
        ]
      }
    }
  )
  
  // 🔍 VreoUnit 验证和诊断
  const diagnosticsProvider = vscode.languages.createDiagnosticCollection('vreo')
  
  const validateVreoUnit = (document: vscode.TextDocument) => {
    const diagnostics: vscode.Diagnostic[] = []
    
    try {
      const vreoUnit = JSON.parse(document.getText())
      
      // 验证必需字段
      if (!vreoUnit.name) {
        diagnostics.push({
          range: new vscode.Range(0, 0, 0, 1),
          message: 'VreoUnit 缺少必需的 name 字段',
          severity: vscode.DiagnosticSeverity.Error
        })
      }
      
      // 验证场景配置
      if (vreoUnit.scenes) {
        vreoUnit.scenes.forEach((scene: any, index: number) => {
          if (!scene.id) {
            diagnostics.push({
              range: new vscode.Range(0, 0, 0, 1),
              message: `场景 ${index} 缺少 id 字段`,
              severity: vscode.DiagnosticSeverity.Error
            })
          }
          
          if (scene.duration && scene.duration <= 0) {
            diagnostics.push({
              range: new vscode.Range(0, 0, 0, 1),
              message: `场景 ${index} 的 duration 必须大于 0`,
              severity: vscode.DiagnosticSeverity.Warning
            })
          }
        })
      }
      
    } catch (error) {
      diagnostics.push({
        range: new vscode.Range(0, 0, 0, 1),
        message: 'JSON 格式错误',
        severity: vscode.DiagnosticSeverity.Error
      })
    }
    
    diagnosticsProvider.set(document.uri, diagnostics)
  }
  
  // 📊 性能分析工具
  const performanceAnalyzer = vscode.commands.registerCommand(
    'vreo.analyzePerformance',
    async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return
      
      const vreoUnit = JSON.parse(editor.document.getText())
      const analysis = analyzeVreoUnitPerformance(vreoUnit)
      
      const panel = vscode.window.createWebviewPanel(
        'vreoPerformance',
        'Vreo 性能分析',
        vscode.ViewColumn.Two,
        { enableScripts: true }
      )
      
      panel.webview.html = generatePerformanceReport(analysis)
    }
  )
  
  context.subscriptions.push(
    vreoUnitProvider,
    snippetsProvider,
    diagnosticsProvider,
    performanceAnalyzer
  )
}
```

### 🌐 社区管理和自动化

#### GitHub Discussions 自动化管理

```yaml
# .github/workflows/community.yml
name: 🤝 Community Management

on:
  discussion:
    types: [created, answered]
  discussion_comment:
    types: [created]

jobs:
  auto-respond:
    name: 🤖 Auto Response
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: 🏷️ Auto Label Discussions
        uses: ./.github/actions/label-discussions
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: 🎉 Welcome New Members
        uses: ./.github/actions/welcome-members
        if: github.event.action == 'created'
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: 📊 Update Community Stats
        uses: ./.github/actions/update-stats
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

#### 贡献者认可系统

```typescript
// .github/actions/contributor-recognition/src/index.ts

interface ContributorStats {
  username: string
  contributions: {
    commits: number
    pullRequests: number
    issues: number
    reviews: number
    discussions: number
  }
  firstContribution: string
  lastActivity: string
  badges: string[]
}

export async function updateContributorStats() {
  const contributors = await getAllContributors()
  const stats: ContributorStats[] = []
  
  for (const contributor of contributors) {
    const contributions = await getContributorContributions(contributor.login)
    const badges = calculateBadges(contributions)
    
    stats.push({
      username: contributor.login,
      contributions,
      firstContribution: contributions.firstCommit,
      lastActivity: contributions.lastActivity,
      badges
    })
  }
  
  // 生成贡献者页面
  await generateContributorsPage(stats)
  
  // 发送感谢邮件给活跃贡献者
  await sendThankYouEmails(stats.filter(s => s.contributions.commits > 10))
  
  // 更新 README 贡献者列表
  await updateReadmeContributors(stats)
}

function calculateBadges(contributions: any): string[] {
  const badges = []
  
  if (contributions.commits >= 100) badges.push('🏆 Core Contributor')
  if (contributions.commits >= 50) badges.push('⭐ Star Contributor')
  if (contributions.commits >= 10) badges.push('✨ Active Contributor')
  if (contributions.pullRequests >= 20) badges.push('🔄 PR Master')
  if (contributions.reviews >= 50) badges.push('👁️ Review Expert')
  if (contributions.issues >= 10) badges.push('🐛 Bug Hunter')
  if (contributions.discussions >= 20) badges.push('💬 Community Helper')
  
  return badges
}
```

### 📊 GitHub 生态系统集成收益

#### 量化指标对比

| 功能领域 | 集成前 | 集成后 | 提升幅度 |
|----------|--------|--------|----------|
| **CI/CD 效率** | 手动发布 | 全自动化 | **95% ↑** |
| **代码质量** | 手动检查 | 自动门禁 | **80% ↑** |
| **社区参与** | 有限互动 | 全功能社区 | **300% ↑** |
| **问题响应时间** | 2-5 天 | 2-24 小时 | **70% ↑** |
| **文档同步率** | 手动更新 60% | 自动同步 98% | **90% ↑** |
| **安全漏洞检测** | 季度扫描 | 实时监控 | **85% ↑** |
| **发布频率** | 月度发布 | 按需发布 | **400% ↑** |
| **新贡献者转化率** | 10% | 45% | **350% ↑** |

#### 开发者体验提升指标

| 体验指标 | 改进前 | 改进后 | 影响 |
|----------|--------|--------|------|
| **环境搭建时间** | 2-4 小时 | 5 分钟 (Codespaces) | **95% ↓** |
| **PR 反馈时间** | 1-3 天 | 30 分钟 | **90% ↓** |
| **构建等待时间** | 10-15 分钟 | 2-3 分钟 | **80% ↓** |
| **错误定位时间** | 1-2 小时 | 10-15 分钟 | **85% ↓** |
| **文档查找效率** | 难以查找 | 智能搜索 | **300% ↑** |
| **社区支持响应** | 48-72 小时 | 4-8 小时 | **80% ↓** |

#### 社区健康度指标

- **活跃贡献者**: 从 5 人增长到 50+ 人 (**900% 增长**)
- **月度 PR 数量**: 从 2-3 个增长到 20-30 个 (**800% 增长**)
- **Issue 解决率**: 从 60% 提升到 95% (**35% 提升**)
- **新用户留存**: 从 20% 提升到 75% (**275% 提升**)
- **社区讨论活跃度**: 从 10 个/月增长到 100+ 个/月 (**900% 增长**)

通过全面深度集成 GitHub 生态系统，Vreo SDK 将成为一个真正现代化、社区驱动、开发者友好的开源项目，为用户和贡献者提供卓越的开发体验。
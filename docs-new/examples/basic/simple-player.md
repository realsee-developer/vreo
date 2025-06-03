# 💡 基础播放器示例

这个示例演示如何创建一个最简单的 Vreo 播放器。

## 🎯 示例目标

- 创建基础的播放器实例
- 加载和播放剧本数据
- 实现基本的播放控制

## 📁 完整代码

### HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vreo 基础播放器示例</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    #app {
      width: 100vw;
      height: 100vh;
      position: relative;
      background: #000;
    }
    
    .controls {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 1000;
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn:hover {
      background: #0056b3;
    }
    
    .btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .status {
      position: absolute;
      bottom: 20px;
      left: 20px;
      z-index: 1000;
      color: white;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="controls">
      <button id="loadBtn" class="btn">加载剧本</button>
      <button id="playBtn" class="btn" disabled>播放</button>
      <button id="pauseBtn" class="btn" disabled>暂停</button>
    </div>
    <div id="status" class="status">
      状态: 准备中...
    </div>
  </div>
  
  <script type="module" src="./main.js"></script>
</body>
</html>
```

### JavaScript 主逻辑

```javascript
// main.js
import { Five } from '@realsee/five'
import { Player } from '@realsee/vreo'
import '@realsee/vreo/stylesheets/default.css'

// 示例剧本数据
const sampleVreoUnit = {
  categoryId: "sample-category",
  categoryText: "示例剧本",
  video: {
    duration: 60000, // 60秒
    start: 0,
    end: 60000,
    url: "https://vr-static.realsee-cdn.cn/release/web/vreo/sample-video.mp4"
  },
  keyframes: [
    {
      uuid: "keyframe-1",
      type: "PanoTextLabel",
      start: 5000,
      end: 15000,
      parsed: false,
      data: {
        text: "欢迎使用 Vreo 播放器！",
        vertex: { x: 0, y: 0, z: -2 },
        fontSize: 18
      }
    },
    {
      uuid: "keyframe-2",
      type: "CameraMovement",
      start: 10000,
      end: 20000,
      parsed: false,
      data: {
        from: { x: 0, y: 0, z: 0 },
        to: { x: 2, y: 1, z: 0 },
        duration: 10000
      }
    }
  ]
}

class VreoApp {
  constructor() {
    this.five = null
    this.player = null
    this.isLoaded = false
    
    this.initElements()
    this.initFive()
    this.bindEvents()
  }
  
  initElements() {
    this.loadBtn = document.getElementById('loadBtn')
    this.playBtn = document.getElementById('playBtn')
    this.pauseBtn = document.getElementById('pauseBtn')
    this.status = document.getElementById('status')
  }
  
  async initFive() {
    try {
      this.updateStatus('初始化 Five 引擎...')
      
      // 创建 Five 实例
      this.five = new Five({
        // 基础配置
        canvas: this.createCanvas(),
        imageOptions: { size: 1024 }
      })
      
      // 创建 Vreo 播放器
      this.player = new Player(this.five, {
        autoPreload: true,
        imageOptions: { size: 1024 }
      })
      
      // 监听播放器事件
      this.setupPlayerEvents()
      
      this.updateStatus('准备完成，点击"加载剧本"开始')
      
    } catch (error) {
      console.error('初始化失败:', error)
      this.updateStatus('初始化失败: ' + error.message)
    }
  }
  
  createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    document.getElementById('app').appendChild(canvas)
    return canvas
  }
  
  setupPlayerEvents() {
    // 监听播放开始
    this.player.on('playing', () => {
      this.updateStatus('正在播放...')
      this.updateButtons({ play: false, pause: true })
    })
    
    // 监听播放暂停
    this.player.on('paused', (isEnded) => {
      if (isEnded) {
        this.updateStatus('播放完成')
        this.updateButtons({ play: true, pause: false })
      } else {
        this.updateStatus('播放暂停')
        this.updateButtons({ play: true, pause: false })
      }
    })
  }
  
  bindEvents() {
    this.loadBtn.addEventListener('click', () => this.loadScript())
    this.playBtn.addEventListener('click', () => this.play())
    this.pauseBtn.addEventListener('click', () => this.pause())
  }
  
  async loadScript() {
    try {
      this.updateStatus('加载剧本中...')
      this.loadBtn.disabled = true
      
      // 加载剧本数据
      await this.player.load(sampleVreoUnit, 0, true)
      
      this.isLoaded = true
      this.updateStatus('剧本加载完成，可以播放')
      this.updateButtons({ play: true, pause: false })
      
    } catch (error) {
      console.error('加载剧本失败:', error)
      this.updateStatus('加载失败: ' + error.message)
    } finally {
      this.loadBtn.disabled = false
    }
  }
  
  play() {
    if (!this.isLoaded) {
      this.updateStatus('请先加载剧本')
      return
    }
    
    try {
      this.player.play()
    } catch (error) {
      console.error('播放失败:', error)
      this.updateStatus('播放失败: ' + error.message)
    }
  }
  
  pause() {
    try {
      this.player.pause()
    } catch (error) {
      console.error('暂停失败:', error)
      this.updateStatus('暂停失败: ' + error.message)
    }
  }
  
  updateStatus(message) {
    this.status.textContent = `状态: ${message}`
    console.log(`[Vreo] ${message}`)
  }
  
  updateButtons(states) {
    if (states.play !== undefined) {
      this.playBtn.disabled = !states.play
    }
    if (states.pause !== undefined) {
      this.pauseBtn.disabled = !states.pause
    }
  }
  
  // 清理资源
  dispose() {
    if (this.player) {
      this.player.dispose()
    }
  }
}

// 启动应用
const app = new VreoApp()

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  app.dispose()
})

// 调试用：将应用实例暴露到全局
window.vreoApp = app
```

### TypeScript 版本

```typescript
// main.ts
import { Five } from '@realsee/five'
import { Player, VreoUnit } from '@realsee/vreo'
import '@realsee/vreo/stylesheets/default.css'

interface ButtonStates {
  play?: boolean
  pause?: boolean
}

class VreoApp {
  private five: Five | null = null
  private player: Player | null = null
  private isLoaded: boolean = false
  
  private loadBtn: HTMLButtonElement
  private playBtn: HTMLButtonElement
  private pauseBtn: HTMLButtonElement
  private status: HTMLElement
  
  constructor() {
    this.initElements()
    this.initFive()
    this.bindEvents()
  }
  
  private initElements(): void {
    this.loadBtn = document.getElementById('loadBtn') as HTMLButtonElement
    this.playBtn = document.getElementById('playBtn') as HTMLButtonElement
    this.pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement
    this.status = document.getElementById('status') as HTMLElement
  }
  
  private async initFive(): Promise<void> {
    try {
      this.updateStatus('初始化 Five 引擎...')
      
      this.five = new Five({
        canvas: this.createCanvas(),
        imageOptions: { size: 1024 }
      })
      
      this.player = new Player(this.five, {
        autoPreload: true,
        imageOptions: { size: 1024 }
      })
      
      this.setupPlayerEvents()
      this.updateStatus('准备完成，点击"加载剧本"开始')
      
    } catch (error) {
      console.error('初始化失败:', error)
      this.updateStatus(`初始化失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  
  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    document.getElementById('app')!.appendChild(canvas)
    return canvas
  }
  
  private setupPlayerEvents(): void {
    if (!this.player) return
    
    this.player.on('playing', () => {
      this.updateStatus('正在播放...')
      this.updateButtons({ play: false, pause: true })
    })
    
    this.player.on('paused', (isEnded?: boolean) => {
      if (isEnded) {
        this.updateStatus('播放完成')
        this.updateButtons({ play: true, pause: false })
      } else {
        this.updateStatus('播放暂停')
        this.updateButtons({ play: true, pause: false })
      }
    })
  }
  
  private bindEvents(): void {
    this.loadBtn.addEventListener('click', () => this.loadScript())
    this.playBtn.addEventListener('click', () => this.play())
    this.pauseBtn.addEventListener('click', () => this.pause())
  }
  
  private async loadScript(): Promise<void> {
    try {
      this.updateStatus('加载剧本中...')
      this.loadBtn.disabled = true
      
      const sampleVreoUnit: VreoUnit = {
        categoryId: "sample-category",
        categoryText: "示例剧本",
        video: {
          duration: 60000,
          start: 0,
          end: 60000,
          url: "https://vr-static.realsee-cdn.cn/release/web/vreo/sample-video.mp4"
        },
        keyframes: []
      }
      
      await this.player!.load(sampleVreoUnit, 0, true)
      
      this.isLoaded = true
      this.updateStatus('剧本加载完成，可以播放')
      this.updateButtons({ play: true, pause: false })
      
    } catch (error) {
      console.error('加载剧本失败:', error)
      this.updateStatus(`加载失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      this.loadBtn.disabled = false
    }
  }
  
  private play(): void {
    if (!this.isLoaded) {
      this.updateStatus('请先加载剧本')
      return
    }
    
    try {
      this.player!.play()
    } catch (error) {
      console.error('播放失败:', error)
      this.updateStatus(`播放失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  
  private pause(): void {
    try {
      this.player!.pause()
    } catch (error) {
      console.error('暂停失败:', error)
      this.updateStatus(`暂停失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  
  private updateStatus(message: string): void {
    this.status.textContent = `状态: ${message}`
    console.log(`[Vreo] ${message}`)
  }
  
  private updateButtons(states: ButtonStates): void {
    if (states.play !== undefined) {
      this.playBtn.disabled = !states.play
    }
    if (states.pause !== undefined) {
      this.pauseBtn.disabled = !states.pause
    }
  }
  
  public dispose(): void {
    if (this.player) {
      this.player.dispose()
    }
  }
}

// 启动应用
const app = new VreoApp()

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  app.dispose()
})

// 调试用
declare global {
  interface Window {
    vreoApp: VreoApp
  }
}
window.vreoApp = app
```

## 🔧 构建配置

### package.json

```json
{
  "name": "vreo-simple-player",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@realsee/five": "^6.4.0-alpha.1",
    "@realsee/vreo": "^2.5.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^6.3.5"
  }
}
```

### vite.config.js

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
})
```

## 🚀 运行示例

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **访问应用**
   打开浏览器访问 `http://localhost:3000`

## 📝 关键概念解释

### 1. Five 引擎初始化
```javascript
const five = new Five({
  canvas: canvas,           // 渲染画布
  imageOptions: {           // 图片配置
    size: 1024             // 图片分辨率
  }
})
```

### 2. Player 创建
```javascript
const player = new Player(five, {
  autoPreload: true,        // 自动预加载资源
  imageOptions: {           // 图片质量设置
    size: 1024
  }
})
```

### 3. 事件监听
```javascript
// 监听播放状态变化
player.on('playing', () => {
  // 播放开始
})

player.on('paused', (isEnded) => {
  // 播放暂停或结束
})
```

## 🎯 扩展建议

1. **添加进度条**
   - 显示播放进度
   - 支持拖拽跳转

2. **音量控制**
   - 音量调节滑块
   - 静音切换

3. **全屏支持**
   - 全屏播放按钮
   - 退出全屏处理

4. **错误处理**
   - 网络错误重试
   - 用户友好的错误提示

## 🔗 相关资源

- [React 集成示例](../react/react-basic.md)
- [高级功能示例](../advanced/)
- [Player API 文档](../../api/player.md)
- [故障排除指南](../../reference/troubleshooting.md) 
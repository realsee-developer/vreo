# 📘 Player API 参考

`Player` 是 Vreo 的核心类，提供 VR 视频播放、剧本执行、相机运镜等功能。

## 构造函数

### `new Player(five, configs?)`

创建 Vreo 播放器实例。

**参数:**
- `five: Five` - Five 渲染引擎实例
- `configs?: Partial<PlayerConfigs>` - 播放器配置选项

**示例:**
```typescript
import { Five } from '@realsee/five'
import { Player } from '@realsee/vreo'

const five = new Five({
  // Five 配置
})

const player = new Player(five, {
  autoPreload: true,
  imageOptions: { size: 1024 }
})
```

## 属性

### `$five: Five` 📌
Five 渲染引擎实例（只读）。

### `configs: Readonly<PlayerConfigs>` 📌
播放器配置选项（只读）。

### `paused: boolean` 📌
当前播放状态。
- `true` - 暂停状态
- `false` - 播放状态

**示例:**
```typescript
console.log(player.paused) // true/false
```

## 核心方法

### `load(vreoUnit, currentTime?, preload?, force?)` 📌

加载剧本数据。

**参数:**
- `vreoUnit: VreoUnit` - 剧本数据对象
- `currentTime?: number` - 起始播放时间（毫秒），默认 0
- `preload?: boolean` - 是否预载资源，默认 false
- `force?: boolean` - 是否强制重新载入，默认 false

**返回值:**
- `Promise<boolean>` - 加载是否成功

**示例:**
```typescript
// 基本加载
await player.load(vreoUnit)

// 从5秒开始，预载资源
await player.load(vreoUnit, 5000, true)

// 强制重新加载
await player.load(vreoUnit, 0, false, true)
```

### `play(currentTime?)` 📌

开始播放或从指定时间播放。

**参数:**
- `currentTime?: number` - 播放起始时间（毫秒）

**示例:**
```typescript
// 从当前位置播放
player.play()

// 从10秒开始播放
player.play(10000)
```

### `pause()` 📌

暂停播放。

**示例:**
```typescript
player.pause()
```

### `getCurrentTime()` 📌

获取当前播放时间。

**返回值:**
- `number` - 当前播放时间（毫秒）

**示例:**
```typescript
const currentTime = player.getCurrentTime()
console.log(`当前播放时间: ${currentTime}ms`)
```

## 外观控制

### `show()` 📌

显示播放器界面。

**示例:**
```typescript
player.show()
```

### `hide()` 📌

隐藏播放器界面。

**示例:**
```typescript
player.hide()
```

### `setAppearance(appearance)` 📌

设置播放器外观。

**参数:**
- `appearance: Appearance` - 外观配置

**示例:**
```typescript
player.setAppearance({
  theme: 'dark',
  primaryColor: '#007bff'
})
```

## 生命周期

### `dispose()` 📌

销毁播放器实例，清理资源。

**示例:**
```typescript
// 组件卸载时清理
React.useEffect(() => {
  return () => {
    player.dispose()
  }
}, [])
```

## 事件系统

Player 继承自 `Subscribe<VreoKeyframeEvent>`，支持事件监听。

### 事件类型

#### `'playing'` 
播放开始事件。

```typescript
player.on('playing', () => {
  console.log('播放开始')
})
```

#### `'paused'`
播放暂停事件。

```typescript
player.on('paused', (isEnded?: boolean) => {
  if (isEnded) {
    console.log('播放结束')
  } else {
    console.log('播放暂停')
  }
})
```

### 事件方法

#### `on(event, callback)` 📌
添加事件监听器。

#### `once(event, callback)` 📌
添加一次性事件监听器。

#### `off(event, callback)` 📌
移除事件监听器。

#### `emit(event, ...args)` 📌
触发事件。

**示例:**
```typescript
// 添加监听器
const handlePlaying = () => console.log('开始播放')
player.on('playing', handlePlaying)

// 移除监听器
player.off('playing', handlePlaying)

// 一次性监听
player.once('paused', () => {
  console.log('首次暂停')
})
```

## 配置选项 (PlayerConfigs)

### 基础配置

```typescript
interface PlayerConfigs {
  /** 播放器容器元素 */
  container?: HTMLElement
  
  /** 是否自动预加载资源 */
  autoPreload?: boolean
  
  /** 图片配置选项 */
  imageOptions?: {
    size?: number // 图片尺寸
  }
  
  /** 自定义关键帧组件 */
  customKeyframes?: React.ComponentType<any>[]
  
  /** 关键帧类型映射 */
  keyframeMap?: Record<string, React.ComponentType<any>>
}
```

### 详细配置示例

```typescript
const configs: PlayerConfigs = {
  // 指定容器元素
  container: document.getElementById('vreo-container'),
  
  // 开启自动预加载
  autoPreload: true,
  
  // 图片质量配置
  imageOptions: {
    size: 1024 // 1024x1024 分辨率
  },
  
  // 自定义关键帧组件
  customKeyframes: [
    MyCustomKeyframe,
    AnotherCustomKeyframe
  ],
  
  // 关键帧类型映射
  keyframeMap: {
    'MyCustomType': MyCustomKeyframe,
    'AnotherType': AnotherCustomKeyframe
  }
}
```

## 最佳实践

### 1. 资源管理

```typescript
// 推荐：预加载重要资源
const player = new Player(five, {
  autoPreload: true,
  imageOptions: { size: 1024 }
})

// 加载时启用预载
await player.load(vreoUnit, 0, true)
```

### 2. 错误处理

```typescript
try {
  await player.load(vreoUnit)
  player.play()
} catch (error) {
  console.error('播放器初始化失败:', error)
  // 显示错误提示
}
```

### 3. 内存管理

```typescript
// React 组件中
useEffect(() => {
  const player = new Player(five, configs)
  
  return () => {
    // 组件卸载时清理
    player.dispose()
  }
}, [])
```

### 4. 响应式处理

```typescript
// 监听窗口变化
useEffect(() => {
  const handleResize = () => {
    // 重新调整播放器尺寸
    five.updateSize()
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

## 性能优化

### 1. 图片质量优化

```typescript
// 根据设备性能调整图片质量
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const player = new Player(five, {
  imageOptions: {
    size: isMobile ? 512 : 1024
  }
})
```

### 2. 懒加载

```typescript
// 仅在需要时加载资源
const player = new Player(five, {
  autoPreload: false
})

// 用户交互时再加载
button.addEventListener('click', async () => {
  await player.load(vreoUnit, 0, true)
  player.play()
})
```

## 故障排除

### 常见问题

1. **播放器无法显示**
   - 检查容器元素是否存在
   - 确认样式文件已正确引入
   - 验证 Five 实例是否正确初始化

2. **视频无法播放**
   - 确认视频 URL 可访问
   - 检查浏览器支持的视频格式
   - 排查 CORS 问题

3. **性能问题**
   - 降低图片质量设置
   - 关闭自动预加载
   - 检查内存泄漏

## 相关链接

- [Controller API](./controller.md) - 控制器 API 文档
- [React Hooks](./react-hooks.md) - React 集成 API
- [事件系统](./events.md) - 详细的事件文档
- [类型定义](./types.md) - TypeScript 类型参考 
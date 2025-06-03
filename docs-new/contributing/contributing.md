# 🤝 贡献指南

感谢您对 Vreo 项目的关注！我们欢迎各种形式的贡献，包括但不限于代码、文档、测试、设计等。

## 🎯 贡献方式

### 🐛 问题报告
- 使用 [GitHub Issues](https://github.com/realsee-developer/vreo/issues) 报告 Bug
- 提供详细的复现步骤和环境信息
- 附上错误日志和截图

### 💡 功能建议
- 在 [GitHub Discussions](https://github.com/realsee-developer/vreo/discussions) 中讨论新功能
- 详细描述使用场景和预期效果
- 提供设计稿或原型图（如有）

### 📝 文档改进
- 修正文档中的错误或过时信息
- 添加缺失的API文档
- 改进示例代码和教程
- 翻译文档到其他语言

### 🧪 测试
- 添加单元测试
- 改进集成测试
- 性能测试和基准测试
- 兼容性测试

## 🚀 开发流程

### 1. 准备开发环境

```bash
# 1. Fork 项目到你的 GitHub 账户
# 2. 克隆你的 Fork
git clone https://github.com/your-username/vreo.git
cd vreo

# 3. 安装依赖
pnpm install

# 4. 启动开发服务器
pnpm dev
```

### 2. 创建功能分支

```bash
# 基于最新的 main 分支创建功能分支
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### 3. 开发和测试

```bash
# 运行测试
pnpm test

# 运行类型检查
pnpm type-check

# 运行代码检查
pnpm lint

# 构建项目
pnpm build
```

### 4. 提交代码

遵循 [约定式提交](https://www.conventionalcommits.org/zh-hans/) 规范：

```bash
# 功能添加
git commit -m "feat: 添加新的关键帧类型支持"

# Bug 修复
git commit -m "fix: 修复播放器在移动设备上的显示问题"

# 文档更新
git commit -m "docs: 更新安装指南"

# 性能优化
git commit -m "perf: 优化视频加载性能"

# 重构
git commit -m "refactor: 重构播放器控制逻辑"
```

### 5. 创建 Pull Request

- 推送分支到你的 Fork
- 在 GitHub 上创建 Pull Request
- 填写详细的 PR 描述
- 等待代码审查

## 📋 代码规范

### TypeScript 规范

```typescript
// ✅ 推荐写法
interface PlayerConfig {
  /** 是否自动播放 */
  autoPlay?: boolean
  /** 播放器容器 */
  container?: HTMLElement
}

class VreoPlayer {
  private config: PlayerConfig
  
  constructor(config: PlayerConfig = {}) {
    this.config = { autoPlay: false, ...config }
  }
  
  public play(): void {
    // 实现播放逻辑
  }
}

// ❌ 不推荐写法
class vreoPlayer {  // 类名应使用 PascalCase
  config: any       // 避免使用 any 类型
  
  play() {         // 缺少返回类型注解
    // ...
  }
}
```

### React 组件规范

```tsx
// ✅ 推荐写法
interface PlayButtonProps {
  /** 播放状态 */
  playing: boolean
  /** 点击回调 */
  onToggle: () => void
  /** 样式类名 */
  className?: string
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  playing,
  onToggle,
  className
}) => {
  return (
    <button
      className={classnames('play-button', className)}
      onClick={onToggle}
      aria-label={playing ? '暂停' : '播放'}
    >
      {playing ? '⏸️' : '▶️'}
    </button>
  )
}

// ❌ 不推荐写法
export default function playButton(props: any) {  // 组件名应使用 PascalCase
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### 样式规范

```css
/* ✅ 推荐写法 - 使用 BEM 命名 */
.vreo-player {
  position: relative;
  background: #000;
}

.vreo-player__controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.vreo-player__button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

.vreo-player__button--primary {
  background: #007bff;
  color: white;
}

/* ❌ 不推荐写法 */
.player button {  /* 选择器过于宽泛 */
  color: red !important;  /* 避免使用 !important */
}
```

## 🧪 测试规范

### 单元测试

```typescript
// tests/Player.test.ts
import { Player } from '../src/Player'
import { Five } from '@realsee/five'

describe('Player', () => {
  let five: Five
  let player: Player

  beforeEach(() => {
    five = new Five({ /* mock config */ })
    player = new Player(five)
  })

  afterEach(() => {
    player.dispose()
  })

  it('should initialize with default config', () => {
    expect(player.configs.autoPreload).toBe(false)
  })

  it('should emit playing event when play is called', async () => {
    const mockVreoUnit = { /* mock data */ }
    const playingHandler = jest.fn()
    
    player.on('playing', playingHandler)
    await player.load(mockVreoUnit)
    player.play()
    
    expect(playingHandler).toHaveBeenCalled()
  })
})
```

### 集成测试

```typescript
// tests/integration/PlayerIntegration.test.ts
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerApp } from '../src/components/PlayerApp'

describe('PlayerApp Integration', () => {
  it('should play video when play button is clicked', async () => {
    render(<PlayerApp />)
    
    const playButton = screen.getByRole('button', { name: '播放' })
    fireEvent.click(playButton)
    
    // 等待播放状态更新
    await screen.findByRole('button', { name: '暂停' })
    
    expect(screen.getByText('正在播放')).toBeInTheDocument()
  })
})
```

## 📝 文档规范

### API 文档

```typescript
/**
 * 播放器核心类
 * 
 * @example
 * ```typescript
 * const player = new Player(five, {
 *   autoPreload: true
 * })
 * await player.load(vreoUnit)
 * player.play()
 * ```
 */
export class Player {
  /**
   * 加载剧本数据
   * 
   * @param vreoUnit - 剧本数据
   * @param currentTime - 起始时间（毫秒）
   * @param preload - 是否预加载资源
   * @returns Promise<boolean> 加载是否成功
   * 
   * @throws {Error} 当剧本数据格式错误时抛出异常
   */
  async load(
    vreoUnit: VreoUnit,
    currentTime = 0,
    preload = false
  ): Promise<boolean> {
    // 实现...
  }
}
```

### Markdown 文档

```markdown
# 标题使用 # 号

## 二级标题

### 三级标题

**粗体** 和 *斜体* 的使用

代码块使用三个反引号：

```typescript
const example = 'code'
```

> 引用块用于重要提示

⚠️ **注意事项**：使用 emoji 增强可读性

| 表格 | 对齐 | 方式 |
|------|:----:|-----:|
| 左对齐 | 居中 | 右对齐 |
```

## 🔄 审查流程

### 自动检查
所有 PR 都会自动运行：
- 代码格式检查（ESLint + Prettier）
- 类型检查（TypeScript）
- 单元测试
- 构建验证

### 人工审查
核心维护者会审查：
- 代码质量和可维护性
- 功能设计和API一致性
- 测试覆盖率
- 文档完整性
- 向后兼容性

### 合并标准
- 所有自动检查通过
- 至少一位核心维护者批准
- 解决所有审查意见
- 更新相关文档

## 🏆 贡献者认可

### 代码贡献
- 在 README 中列出贡献者
- 在 CHANGELOG 中记录贡献
- 提供推荐信和证书（如需要）

### 其他贡献
- 文档改进
- Bug 报告
- 社区支持
- 翻译工作

## 💬 沟通渠道

- **GitHub Issues**: 报告 Bug 和功能请求
- **GitHub Discussions**: 技术讨论和问答
- **Pull Request**: 代码审查和讨论
- **邮件**: developer@realsee.com

## 📄 许可证

通过贡献代码，您同意将您的贡献按照项目的 [MIT 许可证](../LICENSE) 进行许可。

---

再次感谢您对 Vreo 项目的贡献！🎉 
# 📖 Vreo 项目文档

欢迎来到 @realsee/vreo 项目文档！这里提供了完整的使用指南、API 参考和开发文档。

## 🔗 快速导航

### 📚 **用户文档**
| 文档 | 描述 | 链接 |
|------|------|------|
| 🚀 **快速上手** | 5分钟快速开始使用 Vreo | [→ 查看](guides/quick-start.md) |
| 📖 **API 参考** | 完整的 API 文档 | [→ 查看](api/player.md) |
| 💡 **示例代码** | 实用的代码示例 | [→ 查看](examples/basic/simple-player.md) |

### 🛠️ **开发者文档**
| 文档 | 描述 | 链接 |
|------|------|------|
| 🤝 **贡献指南** | 如何参与项目开发 | [→ 查看](contributing/contributing.md) |
| 🏗️ **现代化改造方案** | 单体重构 & Monorepo 升级 | [→ 查看](contributing/refactoring-plan.md) |
| 🎨 **Playground 分析** | 现有测试环境深度解读 | [→ 查看](contributing/playground-analysis.md) |
| 📚 **文档系统现代化** | TypeDoc 文档系统升级方案 | [→ 查看](contributing/documentation-modernization.md) |

## 🎯 什么是 Vreo？

@realsee/vreo 是一个基于 **Five 3D 渲染引擎** 和 **React** 的 VR 视频 3D 空间剧本播放器，专为沉浸式体验设计。

### ✨ 核心特性

- 🎬 **关键帧剧本系统** - 支持相机运镜、全景标签、视频特效等
- ⚛️ **React 深度集成** - 提供完整的 React Hooks 和组件
- 🔌 **插件化架构** - 基于 Five 引擎的扩展插件系统
- 🎨 **可定制 UI** - 灵活的 UI 组件和主题系统
- 📱 **响应式设计** - 支持各种设备和屏幕尺寸

## 🚀 快速开始

### 安装

```bash
npm install @realsee/vreo @realsee/five
```

### 基本使用

```typescript
import { Player } from '@realsee/vreo'

const player = new Player({
  container: document.getElementById('container')
})

// 加载剧本数据
await player.load(vreoUnitData)

// 开始播放
player.play()
```

### React 集成

```tsx
import { VreoProvider, useVreoPlayer } from '@realsee/vreo/react'

function App() {
  return (
    <VreoProvider>
      <VreoPlayerComponent />
    </VreoProvider>
  )
}
```

🔗 **[查看完整的快速上手指南 →](guides/quick-start.md)**

## 📁 文档结构

```
docs-new/
├── 📖 README.md                    # 文档首页 (当前页面)
├── 🧭 _sidebar.md                  # 侧边栏导航
├── 📚 guides/                      # 使用指南
│   └── quick-start.md              # 快速上手指南
├── 📖 api/                         # API 参考
│   └── player.md                   # Player API 文档
├── 💡 examples/                    # 示例代码
│   └── basic/
│       └── simple-player.md       # 基础播放器示例
├── 🎓 tutorials/                   # 教程 (待补充)
├── 🤝 contributing/                # 开发指南
│   ├── contributing.md            # 贡献指南
│   └── refactoring-plan.md        # 现代化改造方案
├── 📚 reference/                   # 参考资料 (待补充)
├── 📝 changelog/                   # 更新日志 (待补充)
└── 🎨 assets/                      # 文档资源
```

## 🛣️ 学习路径

### 👶 **初学者路径**
1. 📖 [快速上手](guides/quick-start.md) - 了解基本概念和使用方法
2. 💡 [基础示例](examples/basic/simple-player.md) - 通过实例学习
3. 📖 [API 参考](api/player.md) - 深入了解 API

### 🚀 **开发者路径**
1. 🤝 [贡献指南](contributing/contributing.md) - 了解开发流程
2. 🏗️ [现代化改造方案](contributing/refactoring-plan.md) - 了解项目架构演进
3. 🎨 [Playground 分析](contributing/playground-analysis.md) - 现有测试环境深度解读

## 🤝 参与贡献

我们欢迎所有形式的贡献！无论是：

- 🐛 **报告 Bug** - 帮助我们发现和修复问题
- ✨ **功能建议** - 分享你的想法和需求
- 📝 **改进文档** - 让文档更加完善和易懂
- 💻 **代码贡献** - 提交你的代码改进

**[查看完整的贡献指南 →](contributing/contributing.md)**

## 📞 获取帮助

- 📧 **邮箱**: developer@realsee.com
- 💬 **讨论**: GitHub Discussions
- 🐛 **问题反馈**: GitHub Issues

## 📋 待完善文档

以下文档正在完善中，敬请期待：

### 📚 使用指南
- [ ] 播放器配置指南
- [ ] 剧本数据格式说明
- [ ] 关键帧系统详解
- [ ] React 集成最佳实践
- [ ] 插件开发指南

### 📖 API 参考
- [ ] Controller API
- [ ] React Hooks API
- [ ] 类型定义参考
- [ ] 事件系统说明

### 💡 示例代码
- [ ] React 集成示例
- [ ] 自定义关键帧示例
- [ ] 插件开发示例
- [ ] 高级功能示例

### 🎓 教程
- [ ] 基础教程系列
- [ ] 进阶教程系列
- [ ] 实战案例分析
- [ ] 性能优化指南

### 📚 参考资料
- [ ] 迁移指南
- [ ] 故障排除
- [ ] 常见问题 FAQ
- [ ] 术语表

---

📅 **文档最后更新**: 2024年12月  
📝 **文档版本**: v1.0.0  
👥 **维护团队**: Realsee Developer 开发团队

> 💡 **提示**: 这是一个活跃的文档项目，我们会持续更新和完善。如果你发现任何问题或有改进建议，欢迎提交 Issue 或 PR！ 
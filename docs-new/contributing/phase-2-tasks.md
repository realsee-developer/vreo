# 🔄 阶段 2: 代码迁移任务清单

**阶段状态**: ⏸️ 待开始  
**开始日期**: 2025年6月18日  
**结束日期**: 2025年7月8日  
**负责人**: 前端团队 + 架构师

## ⚠️ 重要提醒：保护 Git 提交历史

### 🔒 Git 历史保护原则
在代码迁移过程中，我们必须**严格使用 Git 命令**来操作文件，避免破坏现有的提交历史。

### 📋 必须遵循的 Git 操作规范

#### 📂 文件移动操作
```bash
# ✅ 正确：使用 git mv 移动文件
git mv src/Player.js packages/vreo/src/Player.js

# ❌ 错误：直接移动文件会丢失历史
mv src/Player.js packages/vreo/src/Player.js
```

#### 📝 文件重命名操作  
```bash
# ✅ 正确：使用 git mv 重命名文件
git mv PlayController.js VreoController.js

# ❌ 错误：直接重命名会丢失历史
mv PlayController.js VreoController.js
```

#### 📁 目录结构重组
```bash
# ✅ 正确：逐步移动，保持历史链接
git mv fivePlugins/ packages/vreo/src/plugins/
git mv Player/ packages/vreo/src/Player/
git mv shared-utils/ packages/vreo/src/utils/
```

#### 🔄 批量文件迁移
```bash
# ✅ 正确：使用脚本但调用 git mv
for file in src/keyframes/*.js; do
  git mv "$file" "packages/vreo/src/keyframes/$(basename "$file")"
done
```

### 📊 Git 历史验证命令
每次迁移后必须验证历史完整性：
```bash
# 验证文件历史是否保持
git log --follow packages/vreo/src/Player.js
git log --stat --follow packages/vreo/src/Player.js

# 检查历史连续性
git log --oneline --graph --all
```

---

## 📋 任务组概览

### 📦 任务组 2.1: 主包基础结构 (第8-10天)
**状态**: ⏸️ 待开始  
**估计工时**: 24小时  
**优先级**: 🔴 高

### ⚛️ 任务组 2.2: React 包创建 (第11-14天)
**状态**: ⏸️ 待开始  
**估计工时**: 32小时  
**优先级**: 🔴 高

### 🧬 任务组 2.3: 核心功能迁移 (第15-21天)
**状态**: ⏸️ 待开始  
**估计工时**: 56小时  
**优先级**: 🔴 高

---

## 📦 任务组 2.1: 主包基础结构

### Day 8 任务

#### 2.1.1 创建主包 `@realsee/vreo`
- **状态**: ⏸️ 待开始
- **负责人**: 架构师
- **估计时间**: 4小时
- **依赖**: 阶段1完成

**具体任务**:
- [ ] 使用 git 命令创建 `packages/vreo` 目录结构
- [ ] 配置 `package.json` 包含 exports 映射
- [ ] 设置 TypeScript 项目配置
- [ ] 配置 Vite 构建脚本

**Git 操作命令**:
```bash
# 创建主包目录结构
mkdir -p packages/vreo/src/{Player,Controller,keyframes,plugins,utils,ui}
mkdir -p packages/vreo/{dist,types,styles}

# 创建基础配置文件（新文件，直接创建）
touch packages/vreo/package.json
touch packages/vreo/tsconfig.json
touch packages/vreo/vite.config.ts
touch packages/vreo/README.md

# 添加到 git
git add packages/vreo/
```

**验证标准**:
```bash
cd packages/vreo
pnpm install
pnpm typecheck
pnpm build --dry-run

# 验证 git 状态
git status
git log --oneline packages/vreo/
```

**完成标志**: ✅ 主包结构创建 + 构建配置验证通过 + Git 历史记录完整

---

#### 2.1.2 设计模块化导出结构
- **状态**: ⏸️ 待开始
- **负责人**: 架构师
- **估计时间**: 3小时
- **依赖**: 2.1.1

**具体任务**:
- [ ] 设计 Player 模块导出
- [ ] 设计 Controller 模块导出
- [ ] 设计 keyframes 子模块导出
- [ ] 设计 plugins 子模块导出
- [ ] 设计 utils 工具导出

**验证标准**:
```bash
# 测试模块导入
node -e "console.log(require('./dist/index.cjs.js'))"
node test-imports.mjs
```

**完成标志**: ✅ 所有模块导出路径设计完成 + 导入测试通过

---

#### 2.1.3 创建基础 Player 类
- **状态**: ⏸️ 待开始
- **负责人**: 前端开发
- **估计时间**: 4小时
- **依赖**: 2.1.2

**具体任务**:
- [ ] 实现基础 Player 类
- [ ] 定义播放器状态管理
- [ ] 实现事件系统
- [ ] 创建配置选项接口

**验证标准**:
```bash
# 运行 Player 单元测试
pnpm test src/Player/Player.test.ts
```

**完成标志**: ✅ Player 类基础实现完成 + 单元测试通过

---

### Day 9 任务

#### 2.1.4 创建类型定义体系
- **状态**: ⏸️ 待开始
- **负责人**: 前端开发
- **估计时间**: 3小时
- **依赖**: 2.1.3

**具体任务**:
- [ ] 定义核心接口类型
- [ ] 定义播放器配置类型
- [ ] 定义事件类型系统
- [ ] 定义关键帧类型接口

**验证标准**:
```bash
# TypeScript 类型检查
pnpm typecheck
# 类型导出测试
pnpm build && node -e "console.log(Object.keys(require('./dist/index.d.ts')))"
```

**完成标志**: ✅ 完整类型定义体系 + 类型导出验证

---

#### 2.1.5 搭建样式系统
- **状态**: ⏸️ 待开始
- **负责人**: 前端开发
- **估计时间**: 3小时
- **依赖**: 2.1.4

**具体任务**:
- [ ] 设置 SCSS 构建流程
- [ ] 创建样式变量系统
- [ ] 实现模块化样式导出
- [ ] 配置样式压缩和优化

**验证标准**:
```bash
# 样式构建测试
pnpm build:styles
ls dist/styles/ # 应该包含 CSS 文件
```

**完成标志**: ✅ 样式系统搭建完成 + 样式文件正确生成

---

#### 2.1.6 实现基础工具函数
- **状态**: ⏸️ 待开始
- **负责人**: 前端开发
- **估计时间**: 4小时
- **依赖**: 2.1.5

**具体任务**:
- [ ] 实现动画工具函数
- [ ] 实现 DOM 操作工具
- [ ] 实现数学计算工具
- [ ] 实现验证工具函数

**验证标准**:
```bash
# 工具函数测试
pnpm test src/utils/
```

**完成标志**: ✅ 基础工具函数实现 + 单元测试覆盖率 > 90%

---

### Day 10 任务

#### 2.1.7 集成测试套件
- **状态**: ⏸️ 待开始
- **负责人**: 前端开发
- **估计时间**: 4小时
- **依赖**: 2.1.6

**具体任务**:
- [ ] 编写 Player 集成测试
- [ ] 配置测试覆盖率报告
- [ ] 实现模拟依赖 (mocks)
- [ ] 设置持续测试环境

**验证标准**:
```bash
# 运行完整测试套件
pnpm test --coverage
# 测试覆盖率应该 > 80%
```

**完成标志**: ✅ 测试套件配置完成 + 覆盖率达标

---

## ⚛️ 任务组 2.2: React 包创建

### Day 11 任务

#### 2.2.1 创建 React 包结构
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 3小时
- **依赖**: 2.1.7

**具体任务**:
- [ ] 创建 `packages/react` 目录
- [ ] 配置 React 包的 `package.json`
- [ ] 设置 TypeScript + React 配置
- [ ] 配置 Vite React 构建

**验证标准**:
```bash
cd packages/react
pnpm install
pnpm typecheck
pnpm build --dry-run
```

**完成标志**: ✅ React 包结构创建 + 构建配置验证

---

#### 2.2.2 实现核心 React Hook
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 4小时
- **依赖**: 2.2.1

**具体任务**:
- [ ] 实现 `useVreoPlayer` hook
- [ ] 实现 `useVreoController` hook
- [ ] 实现状态管理 hooks
- [ ] 创建 context providers

**验证标准**:
```bash
# React hooks 测试
pnpm test src/hooks/
```

**完成标志**: ✅ 核心 hooks 实现 + React Testing Library 测试通过

---

#### 2.2.3 创建基础 React 组件
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 5小时
- **依赖**: 2.2.2

**具体任务**:
- [ ] 实现 `VreoPlayer` 组件
- [ ] 实现 `VreoController` 组件
- [ ] 实现事件处理组件
- [ ] 配置组件样式系统

**验证标准**:
```bash
# React 组件测试
pnpm test src/components/
```

**完成标志**: ✅ 基础组件实现 + 组件测试覆盖率 > 85%

---

### Day 12 任务

#### 2.2.4 实现高阶组件 (HOCs)
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 3小时
- **依赖**: 2.2.3

**具体任务**:
- [ ] 实现 `withVreoPlayer` HOC
- [ ] 实现 `withErrorBoundary` HOC
- [ ] 实现性能优化 HOCs
- [ ] 创建组合式 HOCs

**验证标准**:
```bash
# HOC 功能测试
pnpm test src/hoc/
```

**完成标志**: ✅ HOCs 实现完成 + 功能测试通过

---

#### 2.2.5 配置 Storybook
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 4小时
- **依赖**: 2.2.4

**具体任务**:
- [ ] 安装和配置 Storybook
- [ ] 创建组件 stories
- [ ] 配置 addons (控件、文档等)
- [ ] 设置 Storybook 构建流程

**验证标准**:
```bash
# Storybook 启动测试
pnpm storybook
# 浏览器中验证组件展示
```

**完成标志**: ✅ Storybook 配置完成 + 组件文档生成

---

#### 2.2.6 React 包集成测试
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 3小时
- **依赖**: 2.2.5

**具体任务**:
- [ ] 编写端到端组件测试
- [ ] 测试 hook 与组件集成
- [ ] 验证样式和主题系统
- [ ] 性能基准测试

**验证标准**:
```bash
# React 包完整测试
pnpm test
pnpm test:e2e
```

**完成标志**: ✅ React 包集成测试通过 + 性能基准达标

---

### Day 13-14 任务

#### 2.2.7 创建示例应用
- **状态**: ⏸️ 待开始
- **负责人**: React 开发
- **估计时间**: 6小时
- **依赖**: 2.2.6

**具体任务**:
- [ ] 创建 `apps/playground` 示例应用
- [ ] 实现基础播放器示例
- [ ] 实现高级功能示例
- [ ] 配置热重载开发环境

**验证标准**:
```bash
cd apps/playground
pnpm dev
# 浏览器验证示例运行正常
```

**完成标志**: ✅ 示例应用创建 + 所有功能演示正常

---

#### 2.2.8 文档和 API 参考
- **状态**: ⏸️ 待开始
- **负责人**: React 开发 + 技术写作
- **估计时间**: 4小时
- **依赖**: 2.2.7

**具体任务**:
- [ ] 编写 React 组件 API 文档
- [ ] 创建使用指南
- [ ] 编写最佳实践文档
- [ ] 生成 TypeScript API 文档

**验证标准**:
```bash
# 文档构建测试
pnpm docs:build
```

**完成标志**: ✅ 完整文档生成 + API 参考可访问

---

## 🧬 任务组 2.3: 核心功能迁移

### Day 15-16 任务

#### 2.3.1 迁移 Player 核心逻辑
- **状态**: ⏸️ 待开始
- **负责人**: 前端团队
- **估计时间**: 8小时
- **依赖**: 2.2.8

**具体任务**:
- [ ] 使用 git mv 迁移播放器状态管理
- [ ] 使用 git mv 迁移时间轴控制逻辑
- [ ] 使用 git mv 迁移事件分发系统
- [ ] 重构依赖注入机制

**Git 迁移命令**:
```bash
# 迁移 Player 核心文件，保持历史
git mv Player/Player.js packages/vreo/src/Player/Player.js
git mv Player/modules/StateManager.js packages/vreo/src/Player/StateManager.js
git mv Player/modules/Timeline.js packages/vreo/src/Player/Timeline.js
git mv Player/modules/EventDispatcher.js packages/vreo/src/Player/EventDispatcher.js

# 迁移播放器相关的工具类
git mv Player/utils/ packages/vreo/src/Player/utils/

# 提交迁移
git add packages/vreo/src/Player/
git commit -m "feat: migrate Player core logic to monorepo

- Move Player.js to packages/vreo/src/Player/
- Move StateManager, Timeline, EventDispatcher
- Preserve git history with git mv commands"
```

**历史验证命令**:
```bash
# 验证每个迁移文件的历史完整性
git log --follow packages/vreo/src/Player/Player.js
git log --follow packages/vreo/src/Player/StateManager.js
git log --follow packages/vreo/src/Player/Timeline.js

# 验证提交历史连续性
git log --oneline --graph Player/Player.js packages/vreo/src/Player/Player.js
```

**验证标准**:
```bash
# Player 核心功能测试
pnpm test src/Player/core/

# Git 历史完整性验证
git log --follow --stat packages/vreo/src/Player/Player.js
```

**完成标志**: ✅ Player 核心逻辑迁移完成 + 功能测试通过 + Git 历史保持完整

---

#### 2.3.2 迁移关键帧系统
- **状态**: ⏸️ 待开始
- **负责人**: 前端团队
- **估计时间**: 12小时
- **依赖**: 2.3.1

**具体任务**:
- [ ] 使用 git mv 迁移 CameraMovement 关键帧
- [ ] 使用 git mv 迁移 PanoTextLabel 关键帧
- [ ] 使用 git mv 迁移 ModelVideo 关键帧
- [ ] 使用 git mv 迁移 PanoEffect 关键帧
- [ ] 重构关键帧注册机制

**Git 迁移命令**:
```bash
# 批量迁移关键帧模块，保持历史
keyframes=(
  "CameraMovement"
  "PanoTextLabel" 
  "ModelVideo"
  "PanoEffect"
  "InfoPanel"
  "BgMusic"
  "Prompter"
  "UpdateVRPanorama"
  "VideoEffect"
  "PanoTag"
)

# 逐个迁移关键帧，保持 git 历史
for keyframe in "${keyframes[@]}"; do
  echo "Migrating keyframe: $keyframe"
  git mv "Player/modules/keyframes/$keyframe/" "packages/vreo/src/keyframes/$keyframe/"
done

# 迁移关键帧基础文件
git mv Player/modules/keyframes/BaseKeyframe.js packages/vreo/src/keyframes/BaseKeyframe.js
git mv Player/modules/keyframes/KeyframeRegistry.js packages/vreo/src/keyframes/KeyframeRegistry.js

# 提交迁移
git add packages/vreo/src/keyframes/
git commit -m "feat: migrate keyframes system to monorepo

- Move all keyframe modules to packages/vreo/src/keyframes/
- Include: CameraMovement, PanoTextLabel, ModelVideo, PanoEffect, etc.
- Preserve complete git history for each keyframe module"
```

**历史验证命令**:
```bash
# 验证关键帧历史完整性
for keyframe in CameraMovement PanoTextLabel ModelVideo PanoEffect; do
  echo "Checking history for $keyframe:"
  git log --follow --oneline "packages/vreo/src/keyframes/$keyframe/"
done

# 验证基础文件历史
git log --follow packages/vreo/src/keyframes/BaseKeyframe.js
git log --follow packages/vreo/src/keyframes/KeyframeRegistry.js
```

**验证标准**:
```bash
# 关键帧系统测试
pnpm test src/keyframes/

# Git 历史完整性验证
git log --follow --stat packages/vreo/src/keyframes/CameraMovement/
```

**完成标志**: ✅ 关键帧系统完全迁移 + 所有关键帧测试通过 + Git 历史保持完整

---

### Day 17-18 任务

#### 2.3.3 迁移插件系统
- **状态**: ⏸️ 待开始
- **负责人**: 前端团队
- **估计时间**: 10小时
- **依赖**: 2.3.2

**具体任务**:
- [ ] 迁移 CameraMovementPlugin
- [ ] 迁移 CSS3DRenderPlugin
- [ ] 迁移 ModelTVVideoPlugin
- [ ] 重构插件生命周期管理

**验证标准**:
```bash
# 插件系统测试
pnpm test src/plugins/
```

**完成标志**: ✅ 插件系统迁移完成 + 插件兼容性测试通过

---

#### 2.3.4 迁移控制器逻辑
- **状态**: ⏸️ 待开始
- **负责人**: 前端团队
- **估计时间**: 8小时
- **依赖**: 2.3.3

**具体任务**:
- [ ] 迁移 PlayController 核心逻辑
- [ ] 迁移控制面板 UI 组件
- [ ] 迁移快捷键处理
- [ ] 重构控制器状态同步

**验证标准**:
```bash
# 控制器测试
pnpm test src/Controller/
```

**完成标志**: ✅ 控制器功能迁移完成 + 控制逻辑测试通过

---

### Day 19-20 任务

#### 2.3.5 迁移 UI 组件系统
- **状态**: ⏸️ 待开始
- **负责人**: 前端团队
- **估计时间**: 10小时
- **依赖**: 2.3.4

**具体任务**:
- [ ] 迁移 Drawer 组件
- [ ] 迁移 PopUp 组件
- [ ] 迁移 Wave 动画组件
- [ ] 迁移自定义 UI 组件

**验证标准**:
```bash
# UI 组件测试
pnpm test src/ui/
```

**完成标志**: ✅ UI 组件系统迁移完成 + 组件渲染测试通过

---

#### 2.3.6 数据流重构
- **状态**: ⏸️ 待开始
- **负责人**: 架构师
- **估计时间**: 6小时
- **依赖**: 2.3.5

**具体任务**:
- [ ] 重构状态管理流程
- [ ] 实现 RxJS 响应式数据流
- [ ] 优化事件传播机制
- [ ] 实现数据持久化

**验证标准**:
```bash
# 数据流测试
pnpm test src/store/
pnpm test:integration
```

**完成标志**: ✅ 数据流重构完成 + 集成测试通过

---

### Day 21 任务

#### 2.3.7 性能优化
- **状态**: ⏸️ 待开始
- **负责人**: 前端团队
- **估计时间**: 6小时
- **依赖**: 2.3.6

**具体任务**:
- [ ] 实现懒加载机制
- [ ] 优化渲染性能
- [ ] 减少包体积
- [ ] 优化内存使用

**验证标准**:
```bash
# 性能基准测试
pnpm test:performance
pnpm analyze:bundle
```

**完成标志**: ✅ 性能优化完成 + 性能指标达标

---

#### 2.3.8 兼容性测试
- **状态**: ⏸️ 待开始
- **负责人**: 测试团队
- **估计时间**: 4小时
- **依赖**: 2.3.7

**具体任务**:
- [ ] 跨浏览器兼容性测试
- [ ] 移动设备适配测试
- [ ] API 向后兼容性验证
- [ ] 性能回归测试

**验证标准**:
```bash
# 兼容性测试套件
pnpm test:compatibility
pnpm test:cross-browser
```

**完成标志**: ✅ 兼容性测试通过 + 回归测试无问题

---

## 📊 阶段 2 完成标准

### ✅ 必须完成的任务
- [ ] @realsee/vreo 主包创建并可用
- [ ] @realsee/vreo-react 包创建并可用
- [ ] 所有核心功能迁移完成
- [ ] 示例应用正常运行

### 📈 质量指标
- [ ] 单元测试覆盖率 ≥ 90%
- [ ] 集成测试覆盖率 ≥ 80%
- [ ] TypeScript 严格模式 100%
- [ ] 所有 ESLint 规则通过

### 📦 交付物清单
- [ ] @realsee/vreo 包 (可发布版本)
- [ ] @realsee/vreo-react 包 (可发布版本)
- [ ] Playground 示例应用
- [ ] Storybook 组件文档
- [ ] API 参考文档

### 🔄 下个阶段准备
- [ ] 核心功能验证完成
- [ ] 性能基准建立
- [ ] 文档体系完善

---

## 🚨 风险与应对

### ⚠️ 高风险项
1. **依赖兼容性**: @realsee/five 版本兼容
2. **性能回归**: 迁移后性能下降
3. **API 兼容性**: 破坏性变更影响

### 🛡️ 应对措施
1. 提前验证所有外部依赖
2. 建立性能基准和监控
3. 提供向后兼容 adapter

---

**更新时间**: 2025年6月4日  
**下次更新**: 每日 EOD 更新进度 
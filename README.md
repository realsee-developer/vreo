# @realsee/vreo Monorepo

[![CI](https://github.com/realsee-developer/vreo/actions/workflows/ci.yml/badge.svg)](https://github.com/realsee-developer/vreo/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@realsee/vreo.svg)](https://www.npmjs.com/package/@realsee/vreo)
[![NPM Downloads](https://img.shields.io/npm/dm/@realsee/vreo.svg)](https://www.npmjs.com/package/@realsee/vreo)
[![License](https://img.shields.io/npm/l/@realsee/vreo.svg)](https://github.com/realsee-developer/vreo/blob/main/packages/vreo/LICENSE)

Vreo (VR Video 缩写) 是基于如视三维渲染引擎 Five 和用户界面构建库 React 实现的如视 3D 空间剧本播放器。

## 项目结构

```
vreo/
├── packages/
│   ├── vreo/           # 主包，npm 发布的包
│   └── test-app/       # 测试应用，使用真实的 npm 包方式导入
├── package.json        # monorepo 根配置
├── pnpm-workspace.yaml # pnpm workspace 配置
└── README.md
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 构建主包

```bash
pnpm build
```

这会构建 `packages/vreo` 包，生成 `lib` 目录。

### 开发和测试

#### 启动主包开发服务器
```bash
pnpm dev:vreo
```

#### 启动测试应用
```bash
pnpm dev:test
```

测试应用会启动在 http://localhost:3088，提供以下页面：
- http://localhost:3088/ - 基础播放器测试
- http://localhost:3088/index-react.html - React 组件测试
- http://localhost:3088/index-react-dynamic.html - 动态加载测试
- http://localhost:3088/index-react-partial.html - 部分加载测试
- http://localhost:3088/index-react-playController.html - PlayController 测试

#### 构建测试应用
```bash
pnpm test:build
```

#### 预览测试应用构建结果
```bash
pnpm test:preview
```

### 构建 npm 包

```bash
pnpm packages
```

这会在 `packages/vreo/lib` 目录生成最终的 npm 包内容。

### 发布流程

本项目使用 GitHub Actions 自动化发布流程。发布步骤如下：

#### 1. 更新版本号

```bash
cd packages/vreo

# 正式版本
npm version patch  # 补丁版本 (2.6.3 -> 2.6.4)
npm version minor  # 次版本 (2.6.3 -> 2.7.0)
npm version major  # 主版本 (2.6.3 -> 3.0.0)

# 预发布版本
npm version prerelease --preid=alpha  # 2.6.3 -> 2.6.4-alpha.0
npm version prerelease --preid=beta   # 2.6.3 -> 2.6.4-beta.0
npm version prerelease --preid=rc     # 2.6.3 -> 2.6.4-rc.0
```

#### 2. 推送代码和标签

```bash
git push origin main
git push origin --tags
```

#### 3. 自动发布

推送标签后，GitHub Actions 会自动：
- 运行 CI 检查
- 构建生产包
- 发布到 npm registry（根据版本自动选择 tag：latest/alpha/beta/rc）
- 创建 GitHub Release
- 部署文档到 GitHub Pages

#### 查看发布状态

访问 [Actions](https://github.com/realsee-developer/vreo/actions) 页面查看工作流执行状态。

## CI/CD 配置

本项目使用 GitHub Actions 实现完整的 CI/CD 流程：

### 持续集成 (CI)

- **触发条件**: Pull Request 或推送到 main/master 分支
- **执行内容**:
  - Node.js 18 和 20 多版本测试
  - 安装依赖并构建主包
  - 构建测试应用验证包的可用性
- **目的**: 确保代码质量，防止破坏性变更

### 自动发布 (Publish)

- **触发条件**: 推送版本标签（如 `v2.6.4`）
- **执行内容**:
  - 构建生产包
  - 发布到 npm registry
  - 创建 GitHub Release
  - 同步到 cnpm（如果配置）
- **版本支持**:
  - 正式版本 (`v*.*.*`) → npm `latest` tag
  - Alpha 版本 (`v*.*.*-alpha.*`) → npm `alpha` tag
  - Beta 版本 (`v*.*.*-beta.*`) → npm `beta` tag
  - RC 版本 (`v*.*.*-rc.*`) → npm `rc` tag

### 文档部署 (Docs)

- **触发条件**: 推送到 main/master 分支或发布新版本
- **执行内容**:
  - 生成 TypeDoc 文档
  - 部署到 GitHub Pages
- **访问地址**: https://realsee-developer.github.io/vreo/

### 配置要求

发布到 npm 需要在仓库设置中配置：
- **Settings → Secrets and variables → Actions**
- 添加 `NPM_TOKEN` secret（从 npmjs.com 获取访问令牌）

GitHub Pages 需要启用：
- **Settings → Pages → Source**: GitHub Actions

## Monorepo 优势

1. **真实测试环境**: `test-app` 使用 npm 包的方式导入 `@realsee/vreo`，确保测试环境与真实使用环境一致
2. **独立开发**: 主包和测试应用可以独立开发和构建
3. **版本控制**: 使用 workspace: 协议确保测试应用始终使用最新的本地版本
4. **构建隔离**: 主包只构建库文件，测试应用负责开发时的 HTML 页面
5. **自动化发布**: 使用 GitHub Actions 实现 CI/CD，提高发布效率和质量

## 迁移说明

- 原 `__test__` 目录已迁移到 `packages/test-app`
- 原根目录的主要文件已迁移到 `packages/vreo`
- 所有导入路径已更新为 npm 包的形式（如 `@realsee/vreo/Player`）
- 保持了原有的 npm 包构建产物结构 
# @realsee/vreo Monorepo

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

### 发布

```bash
pnpm packages
```

这会在 `packages/vreo/lib` 目录生成最终的 npm 包内容。

## Monorepo 优势

1. **真实测试环境**: `test-app` 使用 npm 包的方式导入 `@realsee/vreo`，确保测试环境与真实使用环境一致
2. **独立开发**: 主包和测试应用可以独立开发和构建
3. **版本控制**: 使用 workspace: 协议确保测试应用始终使用最新的本地版本
4. **构建隔离**: 主包只构建库文件，测试应用负责开发时的 HTML 页面

## 迁移说明

- 原 `__test__` 目录已迁移到 `packages/test-app`
- 原根目录的主要文件已迁移到 `packages/vreo`
- 所有导入路径已更新为 npm 包的形式（如 `@realsee/vreo/Player`）
- 保持了原有的 npm 包构建产物结构 
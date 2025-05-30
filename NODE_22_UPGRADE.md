# Node.js 22 升级指南

## 概述

本项目已成功升级到 Node.js 22.16.0 LTS 版本。

## 升级内容

### 1. Node.js 版本
- **从**: Node.js 20.x
- **到**: Node.js 22.16.0 LTS (Jod)

### 2. 配置文件更新

#### `.nvmrc`
```
22
```

#### `package.json`
```json
{
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }
}
```

### 3. 依赖项更新

#### 核心依赖
- `@types/node`: `^18.11.17` → `^22.0.0`
- `typescript`: `4.7.4` → `^5.3.0`
- `typedoc`: `^0.22.10` → `^0.25.0`

#### React 生态系统升级
- `react`: `^16.0.0` → `^18`
- `react-dom`: `^16.0.0` → `^18`
- `@types/react`: `^17.0.37` → `^18`
- `@types/react-dom`: `^17.0.11` → `^18`

#### @realsee 相关包升级
- `@realsee/five`: `5.0.0-alpha.149` → `^6.4.0-alpha.36`
- `@realsee/dnalogel`: `^2.19.3` → `^3.67.1`

#### 其他更新
- `three`: `^0.117.1` → `0.117.1` (版本固定)

### 4. 代码修复

#### Timer 类型修复
- 文件: `__test__/shared-utils/debounce.ts`
- 修复: `NodeJS.Timer` → `NodeJS.Timeout`

#### TypeScript 泛型约束修复
- 文件: `resources/shared-utils/animationFrame/BetterTween.ts`
- 文件: `resources/shared-utils/animationFrame/tween.ts`
- 修复: 添加 `extends Record<string, any>` 约束

#### React 18 类型修复
- 文件: `resources/react/index.tsx`
- 修复: 添加 `children?: React.ReactNode` 到 VreoProviderProps 接口
- 原因: React 18 中 `React.FC` 不再默认包含 children 属性

#### undefined 类型安全修复
- 文件: `resources/Player/modules/keyframes/UpdateVRPanorama/index.tsx`
- 修复: 添加空值检查以防止 undefined 错误

### 5. CI/CD 配置

#### GitHub Actions
- 文件: `.github/workflows/ci.yml`
- Node.js 版本: 22

## 兼容性

### TypeScript 兼容性
- TypeScript 4.7.4 与 Node.js 22 完全兼容
- 升级到 TypeScript 5.3.0 以获得更好的类型支持和性能

### React 兼容性
- 成功升级到 React 18
- 支持 React 18 的所有新特性，包括并发特性
- 自动批处理、Suspense 等特性可用

### @realsee 生态系统
- 升级到最新版本的 @realsee/five (v6.4.0-alpha.36)
- 升级到最新版本的 @realsee/dnalogel (v3.67.1)
- 向后兼容现有的 API 调用

### 依赖兼容性
- 所有依赖项与 Node.js 22 兼容
- 使用 `--legacy-peer-deps` 解决了 peer dependency 警告
- Three.js 版本固定在 0.117.1 以确保稳定性

## 验证

### 构建测试
```bash
npm run build
```
✅ 构建成功

### 开发服务器测试
```bash
npm run dev
```
✅ 开发服务器启动成功 (端口: 3088)

### 版本验证
```bash
node --version  # v22.16.0
npm --version   # 10.9.2
```

### 依赖检查
- ✅ 所有依赖成功安装
- ✅ React 18 类型检查通过
- ✅ @realsee 包兼容性确认
- ✅ TypeScript 5.3.0 编译通过

## 使用说明

### 开发环境设置

1. 确保安装了 nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

2. 使用项目指定的 Node.js 版本:
```bash
nvm use
```

3. 安装依赖:
```bash
npm install --legacy-peer-deps
```

4. 构建项目:
```bash
npm run build
```

### 生产环境

确保生产环境使用 Node.js 22.x 版本：
- Docker: 使用 `node:22-alpine` 或 `node:22`
- 服务器: 安装 Node.js 22.16.0 LTS

## 注意事项

1. **依赖安装**: 建议使用 `--legacy-peer-deps` 标志来避免 peer dependency 冲突
2. **类型检查**: 新版本 TypeScript 更严格，可能需要修复一些类型问题
3. **向后兼容**: Node.js 22 保持与大部分 Node.js 20 代码的兼容性

## 故障排除

### 常见问题

1. **Timer 类型错误**
   - 使用 `NodeJS.Timeout` 替代 `NodeJS.Timer`

2. **泛型约束错误**
   - 为泛型类型添加适当的约束，如 `extends Record<string, any>`

3. **依赖冲突**
   - 使用 `npm install --legacy-peer-deps`

### 回滚方案

如果需要回滚到 Node.js 20:
```bash
nvm use 20
nvm alias default 20
```

然后恢复 package.json 中的依赖版本。 
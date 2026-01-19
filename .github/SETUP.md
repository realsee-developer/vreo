# GitHub Actions 配置指南

本指南将帮助你配置 GitHub 仓库以使用自动化 CI/CD 工作流。

## 1. 配置 NPM Token

为了能够自动发布包到 npm，你需要配置 NPM 访问令牌：

### 获取 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → **Access Tokens**
3. 点击 **Generate New Token** → 选择 **Automation**
4. 复制生成的 token（格式：`npm_xxxxxxxxxxxx`）

### 在 GitHub 中配置

**注意**: 如果你的组织已经配置了 Organization Secret `NPM_AUTH_TOKEN`，可以跳过此步骤。

如果需要为单个仓库配置：

1. 打开仓库页面：https://github.com/realsee-developer/vreo
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 配置如下：
   - Name: `NPM_AUTH_TOKEN`
   - Secret: 粘贴你的 npm token
5. 点击 **Add secret**

## 2. 启用 GitHub Pages

为了自动部署文档到 GitHub Pages：

1. 打开仓库页面：https://github.com/realsee-developer/vreo
2. 进入 **Settings** → **Pages**
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 保存设置

首次推送到 main 分支后，文档将自动构建并部署到：
- https://realsee-developer.github.io/vreo/

## 3. 分支保护规则（可选但推荐）

为了确保代码质量，建议配置分支保护：

1. 进入 **Settings** → **Branches**
2. 点击 **Add rule**
3. 配置如下：
   - **Branch name pattern**: `main` 或 `master`
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
     - 搜索并选择 `build` (来自 CI workflow)
   - ✅ **Require branches to be up to date before merging**
4. 保存规则

这样可以确保：
- 所有代码都必须通过 Pull Request 合并
- 合并前必须通过 CI 检查
- 防止直接推送到 main 分支

## 4. 工作流说明

### CI Workflow (ci.yml)

**触发时机**:
- 创建或更新 Pull Request
- 推送到 main/master 分支

**执行内容**:
- Node.js 18 和 20 版本矩阵测试
- 安装依赖
- 构建主包和测试应用

**查看结果**: PR 页面会显示检查状态

### Publish Workflow (publish.yml)

**触发时机**:
- 推送版本标签（如 `v2.6.4`）

**执行内容**:
- 构建生产包
- 发布到 npm
- 创建 GitHub Release
- 同步到 cnpm（如果配置）

**版本规则**:
- `v2.6.4` → npm `latest` tag（正式版本）
- `v2.7.0-alpha.1` → npm `alpha` tag（Alpha 测试版）
- `v2.7.0-beta.1` → npm `beta` tag（Beta 测试版）
- `v2.7.0-rc.1` → npm `rc` tag（Release Candidate）

### Docs Workflow (docs.yml)

**触发时机**:
- 推送到 main/master 分支
- 推送版本标签
- 手动触发（Actions 页面）

**执行内容**:
- 使用 TypeDoc 生成 API 文档
- 部署到 GitHub Pages

## 5. 发布新版本

完整的发布流程：

```bash
# 1. 确保在最新的 main 分支
git checkout main
git pull origin main

# 2. 更新版本号
cd packages/vreo
npm version patch  # 或 minor/major/prerelease

# 3. 推送代码和标签
git push origin main
git push origin --tags

# 4. 等待 GitHub Actions 自动发布
# 访问 https://github.com/realsee-developer/vreo/actions 查看进度
```

## 6. 查看工作流状态

所有工作流的执行状态可以在这里查看：
- https://github.com/realsee-developer/vreo/actions

每个工作流都有详细的日志，可以帮助你诊断问题。

## 7. 徽章（Badges）

README 中已经添加了以下徽章：

- **CI Status**: 显示 CI 构建状态
- **NPM Version**: 显示最新发布的版本
- **NPM Downloads**: 显示下载量统计
- **License**: 显示开源许可证

这些徽章会自动更新，无需手动维护。

## 常见问题

### Q: 发布失败，显示 "Invalid authentication token"

A: 检查 NPM_AUTH_TOKEN 是否正确配置（组织或仓库级别），token 是否过期。

### Q: GitHub Pages 部署失败

A: 确认已在 Settings → Pages 中选择了 "GitHub Actions" 作为源。

### Q: CI 检查一直在运行

A: 检查 Actions 页面的日志，可能是构建过程中出现了错误。

### Q: 如何跳过 CI 检查？

A: 在 commit 消息中添加 `[skip ci]` 或 `[ci skip]`（不推荐）。

## 更多帮助

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [npm 发布文档](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [GitHub Pages 文档](https://docs.github.com/en/pages)

# 🔧 Vreo Monorepo 详细实施指南

本文档对实施任务清单进行深度细化，提供具体的技术细节、配置文件、命令行操作和验证步骤。

## 📋 阶段 1 详细实施指南

### Day 1-2: 项目初始化与工具链配置

#### 任务 1.1: 创建 Monorepo 基础结构

**具体步骤**:

```bash
# 1. 创建新仓库
git init vreo-monorepo
cd vreo-monorepo

# 2. 创建基础目录结构
mkdir -p {packages/{vreo,react},apps/{playground,docs,examples},tools/{build-tools,eslint-config,scripts}}

# 3. 创建 workspace 配置文件
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
  - 'apps/*' 
  - 'tools/*'
  - 'examples/*'
EOF

# 4. 创建根 package.json
cat > package.json << 'EOF'
{
  "name": "@realsee/vreo-monorepo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.1",
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "clean": "turbo clean && rimraf node_modules/.cache",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "turbo typecheck",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.2",
    "@types/node": "^20.10.0",
    "eslint": "^9.0.0",
    "prettier": "^3.1.0",
    "rimraf": "^5.0.5",
    "turbo": "^1.11.0",
    "typescript": "^5.3.0"
  }
}
EOF
```

**验证步骤**:
```bash
# 验证目录结构
tree -L 3 -a
# 预期输出应包含 packages/, apps/, tools/ 目录

# 验证 pnpm workspace 配置
pnpm list --depth=0
# 应显示工作区根目录信息
```

#### 任务 1.2: 配置包管理器

**具体配置**:

```bash
# 1. 创建 .npmrc 文件
cat > .npmrc << 'EOF'
# 严格的 peer dependencies 检查
strict-peer-dependencies=true

# 提升设置
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
hoist-pattern[]=@types/*

# 缓存和性能设置
store-dir=~/.pnpm-store
prefer-frozen-lockfile=true
use-beta-cli=true

# 发布设置
publish-branch=main
git-checks=true
EOF

# 2. 创建 .nvmrc 文件
echo "18.19.0" > .nvmrc

# 3. 安装基础依赖
pnpm install

# 4. 配置 Git 忽略文件
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
lib/
coverage/
.turbo/

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# Cache
.cache/
.parcel-cache/
.next/
.nuxt/
EOF
```

**验证步骤**:
```bash
# 检查 pnpm 版本和配置
pnpm --version
pnpm config list

# 验证 Node.js 版本
node --version
# 应该是 18.19.0 或更高

# 测试依赖安装
pnpm install --frozen-lockfile
echo $? # 应该返回 0 (成功)
```

#### 任务 1.3: 配置代码质量工具

**ESLint 配置**:

```bash
# 1. 创建 ESLint 共享配置包
mkdir -p tools/eslint-config/src

# 2. 创建 ESLint 配置包的 package.json
cat > tools/eslint-config/package.json << 'EOF'
{
  "name": "@realsee/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.js",
  "files": ["src"],
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
EOF

# 3. 创建基础 ESLint 配置
cat > tools/eslint-config/src/index.js << 'EOF'
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always"
    }]
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      env: {
        jest: true
      }
    }
  ]
};
EOF

# 4. 创建 React 特定配置
cat > tools/eslint-config/src/react.js << 'EOF'
module.exports = {
  extends: [
    "./index.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
};
EOF

# 5. 创建根目录 ESLint 配置
cat > eslint.config.js << 'EOF'
import baseConfig from "./tools/eslint-config/src/index.js";

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.turbo/**"]
  },
  ...baseConfig
];
EOF
```

**Prettier 配置**:

```bash
# 创建 Prettier 配置
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
EOF

# 创建 Prettier 忽略文件
cat > .prettierignore << 'EOF'
dist/
lib/
coverage/
.turbo/
node_modules/
pnpm-lock.yaml
CHANGELOG.md
EOF
```

**TypeScript 配置**:

```bash
# 创建根 TypeScript 配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  },
  "references": [
    { "path": "./packages/vreo" },
    { "path": "./packages/react" },
    { "path": "./apps/playground" },
    { "path": "./apps/docs" }
  ]
}
EOF
```

**Git Hooks 配置**:

```bash
# 安装 husky 和 lint-staged
pnpm add -D husky lint-staged

# 初始化 husky
npx husky init

# 创建 pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
EOF

# 配置 lint-staged
cat >> package.json << 'EOF'
,
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
EOF
```

**验证步骤**:
```bash
# 验证 ESLint 配置
pnpm eslint --version
pnpm eslint "**/*.{ts,tsx,js,jsx}" --max-warnings 0

# 验证 Prettier 配置
pnpm prettier --check "**/*.{ts,tsx,js,jsx,json,md}"

# 验证 TypeScript 配置
pnpm tsc --noEmit

# 测试 Git hooks
echo "console.log('test');" > test.js
git add test.js
git commit -m "test commit" # 应该触发 lint-staged
rm test.js
```

### Day 3-4: 构建系统配置

#### 任务 3.1: 配置 Turborepo

**Turborepo 配置**:

```bash
# 安装 Turborepo
pnpm add -D turbo

# 创建 turbo.json 配置
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local",
    "**/.env"
  ],
  "globalEnv": [
    "NODE_ENV",
    "VERCEL_URL"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "lib/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    },
    "test:unit": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": ["test-results/**", "playwright-report/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  },
  "remoteCache": {
    "enabled": true
  }
}
EOF
```

**验证步骤**:
```bash
# 验证 Turborepo 配置
pnpm turbo --version

# 测试空构建管道
pnpm turbo build --dry-run
# 应该显示构建计划

# 测试缓存功能
pnpm turbo build --summarize
```

#### 任务 3.2: 统一 Vite 构建配置

**创建共享 Vite 配置**:

```bash
# 创建构建工具包
mkdir -p tools/build-tools/src

# 创建构建工具 package.json
cat > tools/build-tools/package.json << 'EOF'
{
  "name": "@realsee/build-tools",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./vite": "./src/vite.config.base.js",
    "./vite/lib": "./src/vite.config.lib.js",
    "./vite/app": "./src/vite.config.app.js"
  },
  "dependencies": {
    "@types/node": "^20.10.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.10",
    "vite-plugin-dts": "^3.7.0",
    "vite-plugin-checker": "^0.6.2",
    "rollup-plugin-visualizer": "^5.11.0"
  }
}
EOF

# 基础 Vite 配置
cat > tools/build-tools/src/vite.config.base.js << 'EOF'
import { defineConfig } from 'vite';
import { resolve } from 'path';

export function createBaseConfig(options = {}) {
  const {
    root = process.cwd(),
    plugins = [],
    define = {},
    resolve: resolveOptions = {}
  } = options;

  return defineConfig({
    root,
    plugins,
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __VERSION__: JSON.stringify(process.env.npm_package_version || '0.0.0'),
      ...define
    },
    resolve: {
      alias: {
        '@': resolve(root, 'src'),
        ...resolveOptions.alias
      },
      ...resolveOptions
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    esbuild: {
      target: 'es2022'
    }
  });
}
EOF

# 库构建配置
cat > tools/build-tools/src/vite.config.lib.js << 'EOF'
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { checker } from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { createBaseConfig } from './vite.config.base.js';

export function createLibConfig(options = {}) {
  const {
    entry = 'src/index.ts',
    name,
    external = [],
    formats = ['es', 'cjs'],
    ...baseOptions
  } = options;

  const baseConfig = createBaseConfig(baseOptions);

  return {
    ...baseConfig,
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        rollupTypes: true,
        tsconfigPath: './tsconfig.build.json'
      }),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
        }
      }),
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true
      }),
      ...baseConfig.plugins
    ],
    build: {
      lib: {
        entry: resolve(entry),
        name,
        formats,
        fileName: (format) => `index.${format}.js`
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          ...external
        ],
        output: {
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      },
      sourcemap: true,
      minify: 'esbuild',
      target: 'es2022'
    }
  };
}
EOF

# 应用构建配置
cat > tools/build-tools/src/vite.config.app.js << 'EOF'
import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import { createBaseConfig } from './vite.config.base.js';

export function createAppConfig(options = {}) {
  const baseConfig = createBaseConfig(options);

  return {
    ...baseConfig,
    plugins: [
      react({
        fastRefresh: process.env.NODE_ENV === 'development'
      }),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
        }
      }),
      ...baseConfig.plugins
    ],
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'esbuild',
      target: 'es2022',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        }
      }
    },
    server: {
      port: 3000,
      host: true,
      open: true
    }
  };
}
EOF
```

**验证步骤**:
```bash
# 安装构建工具依赖
cd tools/build-tools && pnpm install && cd ../..

# 验证配置文件语法
node -c tools/build-tools/src/vite.config.base.js
node -c tools/build-tools/src/vite.config.lib.js
node -c tools/build-tools/src/vite.config.app.js
```

#### 任务 3.3: 设置测试框架

**Vitest 配置**:

```bash
# 创建测试配置文件
cat > vitest.config.ts << 'EOF'
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**']
  }
});
EOF

# 创建测试设置文件
cat > vitest.setup.ts << 'EOF'
import '@testing-library/jest-dom';

// 全局测试设置
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
EOF

# 安装测试依赖
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Playwright 配置**:

```bash
# 安装 Playwright
pnpm add -D @playwright/test

# 创建 Playwright 配置
cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
EOF

# 创建 E2E 测试目录
mkdir -p e2e
cat > e2e/example.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test('basic navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vreo/);
});
EOF
```

**验证步骤**:
```bash
# 验证 Vitest 配置
pnpm vitest --version
pnpm vitest run --reporter=verbose --no-coverage

# 验证 Playwright 配置
pnpm playwright --version
pnpm playwright install chromium

# 运行示例测试
pnpm playwright test --reporter=list
```

### Day 5-7: 版本管理与 CI/CD

#### 任务 5.1: 配置 Changesets

**Changesets 配置**:

```bash
# 安装 Changesets
pnpm add -D @changesets/cli

# 初始化 Changesets
pnpm changeset init

# 配置 Changesets
cat > .changeset/config.json << 'EOF'
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@realsee/build-tools", "@realsee/eslint-config"]
}
EOF
```

**验证步骤**:
```bash
# 测试 Changeset 创建
pnpm changeset
# 应该提示创建 changeset

# 验证配置
pnpm changeset status
```

#### 任务 5.2: GitHub Actions 配置

**CI/CD 工作流**:

```bash
# 创建 GitHub Actions 目录
mkdir -p .github/workflows

# 主 CI 工作流
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm playwright install --with-deps

      - name: Build
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
EOF

# 发布工作流
cat > .github/workflows/release.yml << 'EOF'
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
          registry-url: https://registry.npmjs.org/

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          title: 'chore: release packages'
          commit: 'chore: release packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
EOF
```

**验证步骤**:
```bash
# 验证 GitHub Actions 语法
# 需要安装 act 工具进行本地测试
# brew install act (macOS)
# act --list

# 检查工作流文件语法
cat .github/workflows/ci.yml | yaml-lint
cat .github/workflows/release.yml | yaml-lint
```

## 📋 阶段 2 详细实施指南

### Day 8-10: 主包基础结构

#### 任务 8.1: 创建主包 `@realsee/vreo`

**创建包结构**:

```bash
# 创建主包目录结构
mkdir -p packages/vreo/src/{Player,Controller,keyframes,plugins,ui,utils,types,styles}

# 创建主包 package.json
cat > packages/vreo/package.json << 'EOF'
{
  "name": "@realsee/vreo",
  "version": "3.0.0-alpha.0",
  "description": "VR Video 3D空间剧本播放器",
  "type": "module",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./player": {
      "import": "./dist/Player/index.es.js",
      "require": "./dist/Player/index.cjs.js",
      "types": "./dist/Player/index.d.ts"
    },
    "./controller": {
      "import": "./dist/Controller/index.es.js",
      "require": "./dist/Controller/index.cjs.js",
      "types": "./dist/Controller/index.d.ts"
    },
    "./keyframes/*": {
      "import": "./dist/keyframes/*/index.es.js",
      "require": "./dist/keyframes/*/index.cjs.js",
      "types": "./dist/keyframes/*/index.d.ts"
    },
    "./plugins/*": {
      "import": "./dist/plugins/*/index.es.js",
      "require": "./dist/plugins/*/index.cjs.js",
      "types": "./dist/plugins/*/index.d.ts"
    },
    "./ui": {
      "import": "./dist/ui/index.es.js",
      "require": "./dist/ui/index.cjs.js",
      "types": "./dist/ui/index.d.ts"
    },
    "./utils/*": {
      "import": "./dist/utils/*/index.es.js",
      "require": "./dist/utils/*/index.cjs.js",
      "types": "./dist/utils/*/index.d.ts"
    },
    "./styles": "./dist/styles/index.css",
    "./styles/*": "./dist/styles/*.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "vite build && npm run build:styles",
    "build:styles": "sass src/styles:dist/styles --style=compressed",
    "dev": "vite build --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist"
  },
  "keywords": [
    "vr",
    "video",
    "3d",
    "player",
    "three.js",
    "five"
  ],
  "author": "Realsee Developer Team",
  "license": "MIT",
  "peerDependencies": {
    "@realsee/five": "^2.x"
  },
  "dependencies": {
    "three": "^0.158.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@realsee/build-tools": "workspace:*",
    "@realsee/eslint-config": "workspace:*",
    "@types/three": "^0.158.0",
    "sass": "^1.69.5",
    "typescript": "^5.3.0",
    "vite": "^5.0.10",
    "vitest": "^1.0.4",
    "rimraf": "^5.0.5"
  }
}
EOF

# 创建 TypeScript 配置
cat > packages/vreo/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.ts", "**/*.test.tsx"]
}
EOF

# 创建构建配置的 TypeScript 配置
cat > packages/vreo/tsconfig.build.json << 'EOF'
{
  "extends": "./tsconfig.json",
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"]
}
EOF

# 创建 Vite 配置
cat > packages/vreo/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createLibConfig } from '@realsee/build-tools/vite/lib';

export default defineConfig(
  createLibConfig({
    entry: {
      index: resolve(__dirname, 'src/index.ts'),
      'Player/index': resolve(__dirname, 'src/Player/index.ts'),
      'Controller/index': resolve(__dirname, 'src/Controller/index.ts'),
      'keyframes/CameraMovement/index': resolve(__dirname, 'src/keyframes/CameraMovement/index.ts'),
      'keyframes/PanoTextLabel/index': resolve(__dirname, 'src/keyframes/PanoTextLabel/index.ts'),
      'keyframes/ModelVideo/index': resolve(__dirname, 'src/keyframes/ModelVideo/index.ts'),
      'keyframes/PanoEffect/index': resolve(__dirname, 'src/keyframes/PanoEffect/index.ts'),
      'keyframes/VideoEffect/index': resolve(__dirname, 'src/keyframes/VideoEffect/index.ts'),
      'keyframes/InfoPanel/index': resolve(__dirname, 'src/keyframes/InfoPanel/index.ts'),
      'keyframes/BgMusic/index': resolve(__dirname, 'src/keyframes/BgMusic/index.ts'),
      'keyframes/Prompter/index': resolve(__dirname, 'src/keyframes/Prompter/index.ts'),
      'plugins/CameraMovementPlugin/index': resolve(__dirname, 'src/plugins/CameraMovementPlugin/index.ts'),
      'plugins/CSS3DRenderPlugin/index': resolve(__dirname, 'src/plugins/CSS3DRenderPlugin/index.ts'),
      'plugins/ModelTVVideoPlugin/index': resolve(__dirname, 'src/plugins/ModelTVVideoPlugin/index.ts'),
      'ui/index': resolve(__dirname, 'src/ui/index.ts'),
      'utils/audio/index': resolve(__dirname, 'src/utils/audio/index.ts'),
      'utils/animation/index': resolve(__dirname, 'src/utils/animation/index.ts'),
      'utils/validation/index': resolve(__dirname, 'src/utils/validation/index.ts'),
      'utils/dom/index': resolve(__dirname, 'src/utils/dom/index.ts'),
      'utils/math/index': resolve(__dirname, 'src/utils/math/index.ts')
    },
    name: 'Vreo',
    external: ['@realsee/five', 'three'],
    formats: ['es', 'cjs']
  })
);
EOF
```

**创建基础源文件**:

```bash
# 创建主入口文件
cat > packages/vreo/src/index.ts << 'EOF'
// 主要导出
export * from './Player';
export * from './Controller';

// 关键帧导出
export * from './keyframes';

// 插件导出  
export * from './plugins';

// UI 组件导出
export * from './ui';

// 工具函数导出
export * from './utils';

// 类型导出
export * from './types';

// 版本信息
export const VERSION = __VERSION__;
EOF

# 创建 Player 入口
cat > packages/vreo/src/Player/index.ts << 'EOF'
export { Player } from './Player';
export { App } from './App';
export * from './types';
export * from './hooks';
EOF

# 创建基础 Player 类
cat > packages/vreo/src/Player/Player.ts << 'EOF'
import { EventEmitter } from 'events';
import { VreoPlayerOptions, VreoPlayerState } from './types';

/**
 * Vreo 播放器核心类
 */
export class Player extends EventEmitter {
  private _state: VreoPlayerState = 'idle';
  private _options: VreoPlayerOptions;

  constructor(options: VreoPlayerOptions) {
    super();
    this._options = { ...options };
  }

  /**
   * 获取当前播放状态
   */
  get state(): VreoPlayerState {
    return this._state;
  }

  /**
   * 开始播放
   */
  async play(): Promise<void> {
    if (this._state === 'playing') {
      return;
    }

    this._setState('playing');
    this.emit('play');
  }

  /**
   * 暂停播放
   */
  pause(): void {
    if (this._state !== 'playing') {
      return;
    }

    this._setState('paused');
    this.emit('pause');
  }

  /**
   * 停止播放
   */
  stop(): void {
    this._setState('stopped');
    this.emit('stop');
  }

  /**
   * 销毁播放器
   */
  destroy(): void {
    this._setState('destroyed');
    this.emit('destroy');
    this.removeAllListeners();
  }

  private _setState(state: VreoPlayerState): void {
    const prevState = this._state;
    this._state = state;
    this.emit('stateChange', state, prevState);
  }
}
EOF

# 创建 Player 类型定义
cat > packages/vreo/src/Player/types.ts << 'EOF'
/**
 * 播放器配置选项
 */
export interface VreoPlayerOptions {
  /** 容器元素 */
  container: HTMLElement;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 是否静音 */
  muted?: boolean;
  /** 初始音量 (0-1) */
  volume?: number;
}

/**
 * 播放器状态
 */
export type VreoPlayerState = 
  | 'idle'        // 空闲
  | 'loading'     // 加载中
  | 'ready'       // 准备就绪
  | 'playing'     // 播放中
  | 'paused'      // 暂停
  | 'stopped'     // 停止
  | 'error'       // 错误
  | 'destroyed';  // 已销毁

/**
 * 播放器事件类型
 */
export interface VreoPlayerEvents {
  play: () => void;
  pause: () => void;
  stop: () => void;
  destroy: () => void;
  stateChange: (state: VreoPlayerState, prevState: VreoPlayerState) => void;
  error: (error: Error) => void;
}
EOF

# 创建其他基础文件结构
mkdir -p packages/vreo/src/{Controller,keyframes,plugins,ui,utils,types,styles}

# 创建空的导出文件
for dir in Controller keyframes plugins ui utils types; do
  echo "// TODO: 实现 $dir 模块" > "packages/vreo/src/$dir/index.ts"
done
```

**验证步骤**:

```bash
# 进入主包目录
cd packages/vreo

# 安装依赖
pnpm install

# 验证 TypeScript 配置
pnpm typecheck

# 验证构建配置
pnpm build --dry-run

# 验证导入导出
node -e "console.log(require('./dist/index.cjs.js'))"

# 返回根目录
cd ../..
```

#### 任务 8.2: 设计 exports 映射测试

**创建测试脚本**:

```bash
# 创建导入测试脚本
cat > test-imports.mjs << 'EOF'
// 测试主包导入
import { Player } from './packages/vreo/dist/index.es.js';
console.log('✅ 主包导入成功:', Player.name);

// 测试子模块导入
import { Player as PlayerModule } from './packages/vreo/dist/Player/index.es.js';
console.log('✅ Player 模块导入成功:', PlayerModule.name);

// 测试关键帧导入 (如果存在)
try {
  const { CameraMovement } = await import('./packages/vreo/dist/keyframes/CameraMovement/index.es.js');
  console.log('✅ CameraMovement 模块导入成功');
} catch (error) {
  console.log('⚠️ CameraMovement 模块待实现');
}

console.log('🎉 所有导入测试完成');
EOF

# 测试 CommonJS 导入
cat > test-imports.cjs << 'EOF'
// 测试 CommonJS 导入
const { Player } = require('./packages/vreo/dist/index.cjs.js');
console.log('✅ CommonJS 导入成功:', Player.name);
EOF
```

**运行测试**:

```bash
# 构建主包
cd packages/vreo && pnpm build && cd ../..

# 测试 ESM 导入
node test-imports.mjs

# 测试 CommonJS 导入  
node test-imports.cjs

# 清理测试文件
rm test-imports.mjs test-imports.cjs
```

## 📋 总结

这个详细实施指南提供了：

### 🔧 **技术细节**
- 完整的配置文件内容
- 具体的命令行操作
- 详细的目录结构
- 准确的依赖版本

### ✅ **验证步骤**
- 每个任务都有具体的验证命令
- 预期输出和成功标准
- 错误排查指南

### 📦 **配置文件**
- 所有必需的配置文件
- 完整的 package.json 配置
- 工具链集成配置

### 🚀 **自动化**
- CI/CD 流水线配置
- 代码质量检查
- 自动化测试和发布

这样的详细指南确保团队成员可以按照具体步骤执行，减少配置错误和理解偏差。 
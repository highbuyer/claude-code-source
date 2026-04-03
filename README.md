# claude-code-source

从 npm 包 `@anthropic-ai/claude-code` 反向还原的 Claude Code 完整源码项目。通过 source map 提取源码、从平台二进制中提取 native 模块、从 import 语句推断重建缺失类型——最终实现了**可本地启动、可编译、功能完整**的开发环境。

## 快速开始

```bash
# 安装依赖
bun install

# 启动（使用隔离配置目录 .claude-dev/，不影响宿主机）
bun run start

# 使用宿主机 ~/.claude 配置启动
bun run start:home

# MCP 服务器模式
bun run mcp

# 开发模式（文件监听热重载）
bun run dev
```

需要 [Bun](https://bun.sh) >= 1.3.10。

## 项目概况

### 源码来源

| 来源 | 内容 | 文件数 |
|------|------|--------|
| npm source map | React Compiler 编译后的完整源码 | 1,902 |
| import 语句推断 | 被 npm 排除的纯类型文件（编译时擦除） | ~130 |
| 平台二进制提取 | .node native 模块（image-processor 等） | 20 |
| npm 包直接提取 | text assets、skill 文档、audio-capture | ~50 |

### Native 模块覆盖

从 [GCS bucket](https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases) 下载各平台 Claude 编译二进制，通过 Mach-O/ELF/PE 解析器提取嵌入的 .node 文件：

| 模块 | arm64-darwin | x64-darwin | arm64-linux | x64-linux | arm64-win32 | x64-win32 |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| image-processor | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| audio-capture | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| computer-use-input | ✅ | ✅ | — | — | — | — |
| computer-use-swift | ✅ | ✅ | — | — | — | — |
| url-handler | ✅ | ✅ | — | — | — | — |

> computer-use-input/swift 和 url-handler 是 macOS 专属模块，其他平台不需要。

### Feature Flags

源码通过 `bun:bundle` 的 `feature()` 控制功能开关。在 dev 模式下（非 bundle 构建），所有 feature flag 默认为 **false**——这意味着 KAIROS、SSH_REMOTE、COORDINATOR_MODE 等实验性功能不会激活。

已知的 90+ 个 feature flag 包括：

| Flag | 功能 |
|------|------|
| `BUDDY` | 伴侣精灵 |
| `KAIROS` | Assistant 模式 |
| `SSH_REMOTE` | SSH 远程连接 |
| `COORDINATOR_MODE` | 多 agent 协调 |
| `TRANSCRIPT_CLASSIFIER` | 对话分类器 |
| `WEB_BROWSER_TOOL` | Web 浏览器工具 |
| `ULTRAPLAN` | Ultra plan 功能 |
| `VOICE_MODE` | 语音模式 |
| `BG_SESSIONS` | 后台会话 |
| ... | 完整列表见源码中 `feature('...')` 调用 |

如需在 dev 模式启用特定 feature，需修改 bun:bundle 的行为或在代码中替换 `feature()` 调用。

### TypeScript 编译状态

```
起始: 1,556 errors
当前:    63 errors (96% 修复)
```

剩余 63 个错误全部是**不可修/不需要修**的：

- 50 个 `"external" === "ant"` — 故意的构建分支 dead code
- 12 个 `deps/@ant/computer-use-mcp` — 第三方内部代码的类型窄化问题
- 1 个 Zod 泛型推断 — marketplace 配置的复杂类型

## 项目结构

```
├── src/                    # 主源码（React Compiler 输出 + 重建的类型）
│   ├── entrypoints/        # CLI / MCP / SDK 入口
│   ├── commands/            # 斜杠命令实现
│   ├── tools/               # Agent 工具（Bash, FileEdit, etc.）
│   ├── components/          # Ink (终端 React) UI 组件
│   ├── services/            # MCP, OAuth, compact, LSP 等服务
│   ├── hooks/               # React hooks
│   ├── ink/                 # 自定义 Ink 渲染器
│   ├── types/               # 重建的类型定义
│   ├── state/               # AppState (zustand store)
│   └── utils/               # 工具函数
├── deps/                    # @ant 内部依赖（computer-use, chrome-mcp）
├── vendor/                  # Native 模块和 vendor 代码
│   ├── image-processor/     # 图片处理（6 平台）
│   ├── audio-capture/       # 音频采集（6 平台）
│   ├── url-handler/         # URL 事件处理（macOS）
│   ├── image-processor-src/ # 封装层
│   ├── audio-capture-src/   # 封装层
│   └── url-handler-src/     # 封装层
├── global.d.ts              # 全局类型声明
├── text-imports.d.ts        # .md / React / Ink 类型声明
└── tsconfig.json
```

## 已知限制

### 1. React Compiler 类型擦除

源码经过 React Compiler 编译，函数参数类型被擦除：

```tsx
// 原始代码（不可得）
export function Component({ name, onClick }: Props) { ... }

// 我们拿到的（React Compiler 输出）
export function Component(t0: Props) {
  const { name, onClick } = t0;  // 解构移到函数体内
  ...
}
```

类型定义（`type Props = {...}`）仍在文件中，已通过自动化脚本重新连接到函数参数。

### 2. `permissions_anthropic.txt` 不是原始内容

该文件仅用于 `USER_TYPE === 'ant'` 的 Anthropic 内部路径，当前使用 `permissions_external.txt` 的副本作为兼容替代。对外部用户无影响。

### 3. Feature flags 在 dev 模式下默认关闭

`bun:bundle` 的 `feature()` 在非 bundle 模式下返回 false。如需启用实验功能，需要修改对应的 feature 检查逻辑。

## 提交历史

```
fb7a37d fix: resolve TypeScript compilation errors across source tree
ee2c0b9 fix: update image-processor loading path for platform-specific layout
8c1c365 fix: complete SDK type exports for agentSdkTypes and controlSchemas
393d6ea chore: reconstruct missing source files stripped from npm distribution
90f8efa build: add type declarations for .md imports, React, and Ink JSX
10766fb build: add missing npm dependencies for type checking
feba08a build: restore native prebuilt modules for all platforms
0a14432 build: wire @ant deps into source tree
7676705 docs: record recovery status and known gaps
b91c116 chore: restore bundled text assets from npm package
a78f719 fix: fall back when ultraplan prompt asset is missing
fe7b71f fix: isolate bun source startup config
6764735 build: make bun source cli bootable
a801dfc chore: add bun source scaffold
1c13a8c chore: import source snapshot
```

## 许可证

本项目基于 `@anthropic-ai/claude-code` npm 包的公开分发内容。原始代码的版权归 Anthropic 所有，受其[许可条款](https://www.anthropic.com/legal/claude-code-terms)约束。本仓库仅用于研究和学习目的。

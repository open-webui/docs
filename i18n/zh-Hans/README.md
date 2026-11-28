# 简体中文文档维护指南

简体中文使用 Docusaurus 原生 i18n 机制，语言代码为 `zh-Hans`。英文源文档位于 `docs/`，中文文档位于 `i18n/zh-Hans/docusaurus-plugin-content-docs/current/`。

## 目录对应规则

每篇中文文档与英文源文档保持完全相同的相对路径。例如：

```text
docs/getting-started/updating.mdx
i18n/zh-Hans/docusaurus-plugin-content-docs/current/getting-started/updating.mdx
```

只提交已经翻译的文件。缺少中文文件的页面由 Docusaurus 回退到英文，不要复制英文文件作为占位内容。

翻译页面时，同时检查其中的相对导入。被导入的 Markdown 片段必须位于中文目录中的相同相对路径，并与引用页面在同一批次翻译。例如 `quick-start/index.mdx` 引用的 `tab-docker/`、`tab-kubernetes/` 和 `tab-python/` 片段属于同一翻译单元。

## 翻译约定

- 翻译标题、正文、表格、提示框标题、图片替代文本和界面操作说明。
- 保留 front matter 的键名以及 `id`、`slug`、`sidebar_position`、自定义锚点等路由相关值；翻译 `title`、`sidebar_label` 和 `description` 的显示文本。
- 翻译标题时保留英文标题的自动锚点，并写成显式 ID。例如英文 `## Quick Start` 对应中文 `## 快速开始 {#quick-start}`。同一文件中重复标题的 `-1`、`-2` 等后缀也要保留，已有显式 ID 保持不变。包含代码标识的标题以英文构建产物中的实际 `id` 为准。
- MDX 组件内部的缩进标题使用 `\{#id}` 转义，例如 `#### 安装 \{#installation}`。无法使用 Markdown 标题时，使用带相同 `id` 的 HTML 标题，例如 `<h3 id="installation">安装</h3>`。
- 标题 ID 包含双下划线且 Markdown 渲染会删除下划线时，使用 `import Heading from "@theme/Heading";` 和 `<Heading as="h3" id="__id__">...</Heading>`，确保实际 HTML 保留英文原锚点。
- 保留内部链接路径、URL、命令、参数、环境变量、配置键、文件路径、模型标识和代码语义。英文源文档使用 `https://docs.openwebui.com` 链接到本站其他页面时，中文文档使用相同路径的根相对链接，以保留当前语言。代码示例中的解释性注释可以翻译。
- 保留 MDX 组件、导入语句、HTML 属性名和代码块语言标识。MDX 中的字符串属性包含面向读者的说明时，翻译其值。
- Open WebUI、Ollama、Docker、Kubernetes 等产品、协议和项目名称不翻译；界面中的实际按钮名称可在中文说明后保留英文原文。
- 使用简体中文，技术含义以英文源文档为准，不增删步骤、限制条件或警告。

常用术语保持一致：

| 英文 | 中文 |
| --- | --- |
| Getting Started | 快速上手 |
| Quick Start | 快速开始 |
| Essentials | 基础使用 |
| Connect a Provider | 连接模型服务提供方 |
| model provider | 模型服务提供方 |
| self-hosted | 自托管 |
| deployment | 部署 |
| instance | 实例 |
| Admin Panel | 管理员面板 |
| Admin Settings | 管理员设置 |
| User Settings | 用户设置 |
| Knowledge Base | 知识库 |
| Tool Calling | 工具调用 |
| Task Model | 任务模型 |
| Context Compaction | 上下文压缩 |
| Retrieval-Augmented Generation (RAG) | 检索增强生成（RAG） |
| Workspace | 工作区 |
| Community | 社区 |
| Troubleshooting | 故障排除 |
| Updating | 更新 |
| Backup & Restore | 备份与恢复 |

## 界面文本

界面和导航翻译使用以下文件：

```text
i18n/zh-Hans/code.json
i18n/zh-Hans/docusaurus-plugin-content-docs/current.json
i18n/zh-Hans/docusaurus-theme-classic/navbar.json
i18n/zh-Hans/docusaurus-theme-classic/footer.json
```

英文界面新增可翻译文本后，在项目目录运行：

```bash
npm run write-translations -- --locale zh-Hans
```

检查命令生成的条目并补充中文。不要通过修改英文默认文本来实现中文显示。命令在中文文档存在时可能生成以中文分类名为键的重复条目；`current.json` 只保留与英文默认语言生成结果一致的键。

## 翻译与检查流程

1. 从最新英文源文档复制待翻译文件到对应中文路径。
2. 翻译正文，并处理该文件引用的全部相对 Markdown 依赖。
3. 对照英文源文档检查段落、步骤、链接、提示框和代码示例是否完整。
4. 运行本地中文站点并检查语言菜单、侧边栏、页面导航和搜索：

   ```bash
   npm run start -- --locale zh-Hans
   ```

5. 提交前运行项目检查：

   ```bash
   npm run prettier:check
   npm run lint
   npm run stylelint
   npm run build
   npm run test:docs-search
   ```

翻译批次按目录或完整使用路径划分。一个批次应包含页面及其本地依赖，避免在同一 PR 中混入无关文档修改。

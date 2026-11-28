---
sidebar_position: 0
title: "集成"
---

# 集成教程

**将 Open WebUI 连接到 LLM 提供方、开发者工具、监控平台和外部服务。**

这些社区贡献的指南通过分步说明介绍具体的集成场景。有关身份验证和 SSO 集成，请参阅[身份验证与 SSO](/tutorials/auth-sso)。

---

### LLM 提供方 {#llm-providers}

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [Azure OpenAI（Entra ID）](/tutorials/integrations/llm-providers/azure-openai) | 通过 Entra ID 使用无密钥身份验证连接 Azure OpenAI | 管理员 · 30 到 60 分钟 |
| [DeepSeek R1 Dynamic](/tutorials/integrations/llm-providers/deepseekr1-dynamic) | 通过 llama.cpp 运行完整的 671B DeepSeek-R1 模型 | 开发者 · 45 分钟 |
| [Intel GPU（IPEX-LLM）](/tutorials/integrations/llm-providers/ipex_llm) | 在 Intel GPU 上使用 IPEX-LLM 加速 Ollama | 开发者 · 20 分钟 |

---

### 监控与可观测性 {#monitoring--observability}

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [Helicone](/tutorials/integrations/monitoring/helicone) | 记录并监控 LLM API 调用、成本和延迟 | 管理员 · 15 分钟 |
| [Langfuse](/tutorials/integrations/monitoring/langfuse) | 跟踪 LLM 使用情况并评估提示词质量 | 管理员 · 10 分钟 |

---

### 开发者工具 {#developer-tools}

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [Continue.dev](/tutorials/integrations/dev-tools/continue-dev) | 将 Open WebUI 用作 Continue VS Code 扩展的后端 | 开发者 · 15 分钟 |
| [Jupyter Notebooks](/tutorials/integrations/dev-tools/jupyter) | 通过 Open WebUI 的代码解释器运行代码并创建 Notebook | 开发者 · 20 分钟 |
| [iTerm2](/tutorials/integrations/dev-tools/iterm2) | 从 macOS 终端查询 Open WebUI 模型 | 开发者 · 10 分钟 |
| [Firefox 侧边栏](/tutorials/integrations/dev-tools/firefox-sidebar) | 将 Open WebUI 固定到 Firefox 内置的 AI 侧边栏 | 用户 · 5 分钟 |
| [浏览器搜索引擎](/tutorials/integrations/dev-tools/browser-search-engine) | 将 Open WebUI 添加为自定义浏览器搜索引擎 | 用户 · 5 分钟 |

---

### 外部服务 {#external-services}

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [Notion（MCP）](/tutorials/integrations/mcp-notion) | 通过 Model Context Protocol 连接 Notion | 用户 · 5 分钟 |
| [OneDrive 与 SharePoint](/tutorials/integrations/onedrive-sharepoint) | 将 Microsoft 365 文档导入 Open WebUI | 管理员 · 30 分钟 |
| [LibreTranslate](/tutorials/integrations/libre-translate) | 添加自托管翻译功能 | 管理员 · 15 分钟 |

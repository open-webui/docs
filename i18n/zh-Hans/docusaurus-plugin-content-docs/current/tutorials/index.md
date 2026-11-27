---
sidebar_position: 0
title: "教程"
---

# 教程

**由 Open WebUI 社区贡献的、面向真实场景的分步指南。**

这些教程会引导你完成具体任务：连接身份提供方、集成开发者工具、管理部署等。每份指南都涵盖一个可以从头到尾跟着操作的实际场景。

:::tip 应该从哪里开始？
如果你正在寻找**初始设置**，请参阅[快速上手](/getting-started)。如需**功能文档**，请参阅[功能](/features)。当你已经运行 Open WebUI 并希望**用它做更多事情**时，教程就派上用场了。
:::

---

## 身份验证与 SSO {#authentication--sso}

配置单点登录、LDAP 和身份联合。

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [Okta SSO（OIDC）](/tutorials/auth-sso/okta-oidc-sso) | 使用 Okta 单点登录，可选组同步和 MFA | 管理员 · 30 分钟 |
| [Azure AD LDAP](/tutorials/auth-sso/azure-ad-ds-ldap) | 针对 Azure AD Domain Services 的安全 LDAP 身份验证 | 管理员 · 45 分钟 |
| [双重 OAuth 设置](/tutorials/auth-sso/dual-oauth-configuration) | 同时运行 Microsoft 和 Google OAuth | 管理员 · 15 分钟 |
| [Entra ID 组名称同步](/tutorials/auth-sso/entra-group-name-sync) | 从 Microsoft Entra 获取易读的组名称 | 管理员 · 30 分钟 |
| [Tailscale](/tutorials/auth-sso/tailscale) | 通过 Tailscale Serve 实现 HTTPS 和 SSO，以及 Funnel 隧道 | 管理员 · 20 分钟 |

[浏览全部身份验证与 SSO 教程 →](/tutorials/auth-sso)

---

## 集成 {#integrations}

将 Open WebUI 连接到 LLM 提供方、监控平台、开发者工具和外部服务。

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [Azure OpenAI（Entra ID）](/tutorials/integrations/llm-providers/azure-openai) | 使用无密钥身份验证连接 Azure OpenAI | 管理员 · 30 到 60 分钟 |
| [DeepSeek R1 Dynamic](/tutorials/integrations/llm-providers/deepseekr1-dynamic) | 通过 llama.cpp 运行完整的 671B DeepSeek-R1 | 开发者 · 45 分钟 |
| [Intel GPU（IPEX-LLM）](/tutorials/integrations/llm-providers/ipex_llm) | 在 Intel GPU 上加速 Ollama | 开发者 · 20 分钟 |
| [Helicone](/tutorials/integrations/monitoring/helicone) | 监控 LLM API 调用、成本和延迟 | 管理员 · 15 分钟 |
| [Langfuse](/tutorials/integrations/monitoring/langfuse) | 跟踪 LLM 使用情况并评估提示词质量 | 管理员 · 10 分钟 |
| [Continue.dev](/tutorials/integrations/dev-tools/continue-dev) | 将 Open WebUI 用作 VS Code 后端 | 开发者 · 15 分钟 |
| [Jupyter Notebooks](/tutorials/integrations/dev-tools/jupyter) | 通过 Jupyter 集成使用代码解释器 | 开发者 · 20 分钟 |
| [iTerm2](/tutorials/integrations/dev-tools/iterm2) | 从 macOS 终端查询模型 | 开发者 · 10 分钟 |
| [Firefox 侧边栏](/tutorials/integrations/dev-tools/firefox-sidebar) | 将 Open WebUI 固定到 Firefox 的 AI 侧边栏 | 用户 · 5 分钟 |
| [浏览器搜索引擎](/tutorials/integrations/dev-tools/browser-search-engine) | 将 Open WebUI 添加为浏览器搜索引擎 | 用户 · 5 分钟 |
| [Notion（MCP）](/tutorials/integrations/mcp-notion) | 通过 Model Context Protocol 连接 Notion | 用户 · 5 分钟 |
| [OneDrive 与 SharePoint](/tutorials/integrations/onedrive-sharepoint) | 将 Microsoft 365 文档导入 Open WebUI | 管理员 · 30 分钟 |
| [LibreTranslate](/tutorials/integrations/libre-translate) | 添加自托管翻译功能 | 管理员 · 15 分钟 |

[浏览全部集成教程 →](/tutorials/integrations)

---

## 维护 {#maintenance}

通过备份、存储、离线模式和数据库管理，保持部署健康运行。

| 教程 | 你将实现的目标 | 详情 |
|----------|-------------------|---------|
| [备份](/tutorials/maintenance/backups) | 备份和恢复所有 Open WebUI 数据 | 管理员 · 15 分钟 |
| [数据库管理](/tutorials/maintenance/database) | 管理、迁移数据库并进行故障排除 | 管理员 · 20 分钟 |
| [离线模式](/tutorials/maintenance/offline-mode) | 在无互联网连接的情况下运行 Open WebUI | 管理员 · 30 分钟 |
| [S3 存储](/tutorials/maintenance/s3-storage) | 将上传内容存储在 S3 兼容的对象存储中 | 管理员 · 20 分钟 |

[浏览全部维护教程 →](/tutorials/maintenance)

---

## 更多 {#more}

| 页面 | 描述 |
|------|------------|
| [为文档做贡献](/tutorials/contributing-tutorial) | 设置分支仓库、撰写教程并向文档仓库提交 PR |
| [社区指南与视频 →](/tutorials/community) | 来自社区的部署教程、评测和操作演示 |

---
sidebar_position: 27
title: "Microsoft Web IQ"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持，仅用于演示如何针对你的特定用例自定义 Open WebUI。想要参与贡献？请查看[贡献教程](/contributing)。

:::

:::tip

有关 Web Search 相关的所有环境变量的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## 概述 {#overview}

**Microsoft Web IQ** 是 Microsoft 提供的网页搜索 API。将其与 Open WebUI 集成后，你的语言模型可以执行实时网页搜索，并依据最新来源作出回答。本指南介绍如何将 Microsoft Web IQ 配置为网页搜索提供方。

## 前置条件 {#prerequisites}

- **已安装 Open WebUI**：一个正在运行的 Open WebUI 实例（本地或 Docker）。请参阅[快速上手指南](/getting-started)。
- **Microsoft Web IQ API 密钥**：Microsoft Web IQ API 的访问权限及密钥。
- **管理员访问权限**：你的 Open WebUI 实例的管理员访问权限。

## 分步配置 {#step-by-step-configuration}

### 1. 获取 Microsoft Web IQ API 密钥 {#1-obtain-a-microsoft-web-iq-api-key}

从你的 Microsoft API 提供方门户获取 Microsoft Web IQ API 的 API 密钥。请妥善保管。

### 2. 配置 Open WebUI {#2-configure-open-webui}

1. 使用管理员账户登录 Open WebUI。
2. 打开**设置 → 网页搜索**（管理员区域）。
3. 将**网页搜索**切换为**开启**。
4. 从**网页搜索引擎**下拉菜单中选择 **microsoft_web_iq**。
5. 将你的 API 密钥粘贴到 **Microsoft Web IQ API 密钥**字段中。
6. （可选）调整 **API 基础 URL** 和**语言**。
7. 保存设置。

### 3. 测试集成 {#3-test-the-integration}

1. 在 Open WebUI 中开始聊天。
2. 点击提示输入框中的**加号（+）**按钮以启用网页搜索。
3. 输入查询（例如 `+latest AI news`），并确认 Microsoft Web IQ 返回实时结果。

## 配置参考 {#configuration-reference}

| 设置 | 环境变量 | 默认值 | 说明 |
|---|---|---|---|
| API 密钥 | [`MICROSOFT_WEB_IQ_API_KEY`](/reference/env-configuration#microsoft_web_iq_api_key) | （空） | 必填。 |
| API 基础 URL | [`MICROSOFT_WEB_IQ_API_BASE_URL`](/reference/env-configuration#microsoft_web_iq_api_base_url) | `https://api.microsoft.ai/v3` | 仅在指向不同端点时覆盖。 |
| 语言 | [`MICROSOFT_WEB_IQ_LANGUAGE`](/reference/env-configuration#microsoft_web_iq_language) | `en` | 结果语言代码（例如 `en`、`de`）。 |

选择 `microsoft_web_iq` 引擎时，管理界面会提供相同字段，因此除非你更倾向于通过环境变量管理配置，否则无需使用环境变量。

## 故障排除 {#troubleshooting}

- **API 密钥无效**：确保密钥复制正确，不含多余空格。
- **无结果**：确认网页搜索开关（`+`）已启用，并且互联网连接正常。
- **语言错误**：将 `MICROSOFT_WEB_IQ_LANGUAGE` 调整为目标区域语言。

## 其他资源 {#additional-resources}

- [Open WebUI 功能](/features)：有关 RAG 和网页搜索的详细信息。

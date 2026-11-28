---
sidebar_position: 8
title: "Kagi"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持，仅用于演示如何针对你的特定用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关 Web Search 相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## Kagi Search API {#kagi-search-api}

[Kagi](https://kagi.com) 是一款付费搜索引擎，它聚合来自多个来源（包括自己的索引）的结果，并根据准确性和相关性重新排序。Kagi Search API 提供对这些结果的编程访问能力。

### 前置条件 {#prerequisites}

- 一个 [Kagi 账户](https://kagi.com)（任意套餐）
- **单独的 API 计费：**API 访问费用独立于 Kagi 订阅计费。请在 [kagi.com/api](https://kagi.com/api) 设置计费并生成 API 密钥
- Search API 定价：**每 1,000 次请求 12 美元**（按量付费，每 30 天或用量费用达到 100 美元时开具账单）

### 设置 {#setup}

1. 前往 [kagi.com/api](https://kagi.com/api) 并设置 API 计费。
2. 前往 [kagi.com/api/keys](https://kagi.com/api/keys) 并创建 API 密钥。复制该密钥。
3. 打开**设置 > 网页搜索**（管理员区域）。
4. 启用**网页搜索**，并将**网页搜索引擎**设置为 `kagi`。
5. 将你的 API 密钥粘贴到 **Kagi Search API 密钥**字段中。
6. 点击**保存**。

### Docker Compose 设置 {#docker-compose-setup}

将以下环境变量添加到你的 Open WebUI `docker-compose.yaml` 文件中：

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "kagi"
      KAGI_SEARCH_API_KEY: "YOUR_API_KEY"
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 1
```

### 继承账户设置 {#account-settings-inheritance}

Kagi Search API 会继承你的 Kagi 账户设置，包括：

- **屏蔽或提升的网站：**你的[个性化规则](https://help.kagi.com/kagi/getting-started/index.html)适用于 API 结果
- **摘要长度：**在[设置 → 搜索](https://help.kagi.com/kagi/settings/search.html)中配置

这意味着你可以像自定义 Kagi 网页界面一样，自定义 API 搜索结果。

### Kagi MCP 服务器（替代方案） {#kagi-mcp-server-alternative}

如果你不想使用内置的网页搜索集成，Kagi 还提供托管的 [MCP（模型上下文协议）服务器](https://kagi.com/api/docs/openapi/section/mcp)，可作为 MCP 工具连接到 Open WebUI。这样，你的模型可以在网页搜索流程之外直接访问 Kagi 的搜索和内容提取能力。

**MCP 端点：**`https://mcp.kagi.com/mcp`

**身份验证：**使用你的 Kagi API 密钥作为 Bearer token。

### 其他资源 {#additional-resources}

- [Kagi API 文档](https://kagi.com/api/docs)
- [Kagi API 定价](https://kagi.com/api/pricing)
- [Kagi Search API 帮助](https://help.kagi.com/kagi/api/search.html)
- [Kagi MCP 服务器](https://kagi.com/api/docs/openapi/section/mcp)

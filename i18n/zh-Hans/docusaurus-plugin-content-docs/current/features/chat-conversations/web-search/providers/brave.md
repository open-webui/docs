---
sidebar_position: 3
title: "Brave"
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

## Brave API {#brave-api}

Open WebUI 内置两个由 Brave 提供支持的搜索引擎。它们共用同一个 API 密钥（`BRAVE_SEARCH_API_KEY`）和相同的速率限制，但使用不同的端点：

| 引擎 | 端点 | 行为 |
| :--- | :--- | :--- |
| `brave` | `/res/v1/web/search` | 经典网页搜索。返回简短摘要；随后 Open WebUI 会抓取每个结果的 URL，以构建 LLM 上下文。 |
| `brave_llm_context` | `/res/v1/llm/context` | 针对 LLM 优化的搜索。直接将完整的、预先提取并按相关性评分的页面段落作为每个结果的摘要返回。所有引擎在搜索后抓取页面的行为都受**绕过网页加载器**控制，因此启用该选项可跳过抓取并直接使用这些段落。提取量受 [`BRAVE_SEARCH_CONTEXT_TOKENS`](/reference/env-configuration#brave_search_context_tokens) 限制（默认 `8192`，范围 `1024` 至 `32768`）。 |

如果希望减少往返次数，无需抓取步骤并获得保真度更高的段落，请选择 `brave_llm_context`；如果需要经典的“先获取摘要、再抓取页面”流程（例如抓取环节会在你的处理流程中执行有用的规范化），请选择 `brave`。两个引擎在收到 HTTP 429 后都会等待 1 秒并自动重试一次。

### Docker Compose 设置 {#docker-compose-setup}

将以下环境变量添加到你的 Open WebUI `docker-compose.yaml` 文件中：

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "brave"             # 或 "brave_llm_context"
      BRAVE_SEARCH_API_KEY: "YOUR_API_KEY"
      # BRAVE_SEARCH_CONTEXT_TOKENS: 8192    # 仅用于 brave_llm_context
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 1
```

### 速率限制（免费套餐） {#rate-limiting-free-tier}

Brave 的免费套餐 API 严格执行**每秒 1 个请求**的限制。如果你的 LLM 生成多个搜索查询（这种情况很常见），可能会遇到 HTTP 429“Too Many Requests”错误。

**免费套餐用户的推荐配置：**

- 将设置 > 网页搜索（管理员区域）中的“并发请求数”设置为 `1`。也可以使用环境变量：
- 设置 `WEB_SEARCH_CONCURRENT_REQUESTS: 1`，确保请求按顺序处理，而不是并行处理。

**自动重试行为：**

Open WebUI 会自动处理来自 Brave API 的 429 速率限制响应。收到速率限制错误时，系统将：

1. 等待 1 秒（遵守 Brave 的速率限制）
2. 重试该请求一次
3. 仅在重试也返回错误时才判定失败

这意味着，即使你的连接速度快到能在一秒内发送多个连续请求，自动重试机制也应当能够平稳恢复，无需用户干预。

:::tip
如果你使用速率限制更高的 Brave 付费套餐，可以增大 `WEB_SEARCH_CONCURRENT_REQUESTS`，以加快并行搜索。
:::

:::info 了解并发与速率限制

`WEB_SEARCH_CONCURRENT_REQUESTS` 设置控制的是**每个单独搜索请求**的并发数，而不是整个应用程序的全局并发数。

- **不会成为问题的情况**：对于单用户实例或低流量部署，用户很少会在同一秒精确地同时按下“Enter”，此时将并发数设置为 `1` 通常足以保持在免费套餐的限制内（每秒 1 个请求）。
- **会成为问题的情况**：如果多个用户在同一时刻触发网页搜索（例如 3 个用户在同一秒内搜索），Open WebUI 将并行处理这些请求。来自 `brave` 引擎的调用共享一个 HTTP 会话，但并发限制是按每次搜索创建的，因此三个用户的三次搜索不会相互限流，3 个请求会同时到达 API，从而触发免费套餐的速率限制错误。

**注意：**如果你的环境中有多个并发用户正在频繁使用网页搜索，强烈建议升级到付费 API 套餐。免费套餐并非为多用户部署的吞吐量而设计。
:::

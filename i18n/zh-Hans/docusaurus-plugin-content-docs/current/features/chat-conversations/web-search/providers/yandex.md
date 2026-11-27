---
sidebar_position: 14
title: "Yandex"
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

## Yandex Search API {#yandex-search-api}

Open WebUI 通过 [Yandex Cloud Search API](https://yandex.cloud/en/docs/search-api/api-ref/WebSearch/search) 集成对 Yandex 网页搜索的支持。

### Docker Compose 设置 {#docker-compose-setup}

将以下环境变量添加到你的 Open WebUI `docker-compose.yaml` 文件中：

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "yandex"
      YANDEX_WEB_SEARCH_API_KEY: "YOUR_YANDEX_CLOUD_API_KEY"
      # 可选：覆盖默认搜索 URL
      # YANDEX_WEB_SEARCH_URL: "https://searchapi.api.cloud.yandex.net/v2/web/search"
      # 可选：Yandex Search API 的自定义 JSON 配置
      # YANDEX_WEB_SEARCH_CONFIG: '{"query": {"searchType": "SEARCH_TYPE_RU"}}'
```

### 配置选项 {#configuration-options}

*   **YANDEX_WEB_SEARCH_URL**：Yandex Search API 的端点。默认为 `https://searchapi.api.cloud.yandex.net/v2/web/search`。
*   **YANDEX_WEB_SEARCH_API_KEY**：你的 Yandex Cloud API 密钥。
*   **YANDEX_WEB_SEARCH_CONFIG**：用于自定义搜索请求的可选 JSON 字符串。你可以通过它设置 Yandex Search API 支持的任意参数。

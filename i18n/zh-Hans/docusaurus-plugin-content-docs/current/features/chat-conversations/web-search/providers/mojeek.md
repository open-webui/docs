---
sidebar_position: 9
title: "Mojeek"
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

## Mojeek Search API {#mojeek-search-api}

### 设置 {#setup}

1. 请访问 [Mojeek Search API 页面](https://www.mojeek.com/services/search/web-search-api/)获取 `API key`。
2. 获取 `API key` 后，打开 `Open WebUI Admin panel`，点击 `Settings` 选项卡，然后点击 `Web Search`。
3. 启用 `Web search`，并将 `Web Search Engine` 设置为 `mojeek`。
4. 将 `Mojeek Search API Key` 设置为 `API key`。
5. 点击 `Save`。

### Docker Compose 设置 {#docker-compose-setup}

将以下环境变量添加到你的 Open WebUI `docker-compose.yaml` 文件中：

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "mojeek"
      MOJEEK_SEARCH_API_KEY: "YOUR_MOJEEK_API_KEY"
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 1
```

---
sidebar_position: 11
title: "SearchApi"
---

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关与网页搜索相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## SearchApi API {#searchapi-api}

[SearchApi](https://searchapi.io) 是一组实时 SERP API。支持任何返回 `organic_results` 的现有或未来 SERP 引擎。默认网页搜索引擎为 `google`，也可以更改为 `bing`、`baidu`、`google_news`、`bing_news`、`google_scholar`、`google_patents` 等。

### 设置 {#setup}

1. 前往 [SearchApi](https://searchapi.io)，登录或创建新账户。
2. 进入 `Dashboard`，复制 API 密钥。
3. 拿到 `API key` 后，打开 `Open WebUI Admin panel`，点击 `Settings` 选项卡，然后点击 `Web Search`。
4. 启用 `Web search`，并将 `Web Search Engine` 设为 `searchapi`。
5. 将从 [SearchApi](https://www.searchapi.io/) 控制面板中第 2 步复制的 `API key` 填入 `SearchApi API Key`。
6. [可选] 输入要查询的 `SearchApi engine` 名称。例如 `google`、`bing`、`baidu`、`google_news`、`bing_news`、`google_videos`、`google_scholar` 和 `google_patents.`。默认值为 `google`。
7. 点击 `Save`。

![Open WebUI 管理员面板](/images/tutorial_searchapi_search.png)

#### 注意 {#note}

要在聊天中搜索网页，请打开消息输入框中的 **+** 菜单并开启**网页搜索（Web Search）**。此后，搜索将使用 [SearchApi](https://www.searchapi.io/) 引擎。

![启用网页搜索](/images/enable_web_search.png)

---
sidebar_position: 2
title: "Bing"
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

:::warning

Bing Search API 将于 2025 年 8 月 11 日停用。不支持新部署。

:::

## Bing API {#bing-api}

### 设置 {#setup}

1. 前往 [Azure 门户](https://portal.azure.com/#create/Microsoft.BingSearch)并创建一个新资源。创建完成后，你将被重定向到资源概览页面。在这里选择“管理密钥”。![管理密钥](https://github.com/user-attachments/assets/dd2a3c67-d6a7-4198-ba54-67a3c8acff6d)
2. 在密钥管理页面，找到 Key1 或 Key2，并复制你要使用的密钥。
3. 打开**设置 > 网页搜索**（管理员区域）。
4. 启用网页搜索选项，并将网页搜索引擎设置为 bing。
5. 使用你在第 2 步从 [Azure 门户](https://portal.azure.com/#create/Microsoft.BingSearch)仪表板复制的密钥填写 **Bing Search V7 订阅密钥**（`BING_SEARCH_V7_SUBSCRIPTION_KEY`）。**Bing Search V7 端点**（`BING_SEARCH_V7_ENDPOINT`）默认为 `https://api.bing.microsoft.com/v7.0/search`，只有使用自定义端点时才需要更改。Open WebUI 不会检查密钥是否已设置，因此密钥为空时会在 Bing 侧报错，而不是在 Open WebUI 中报错。
6. 点击 `Save`。

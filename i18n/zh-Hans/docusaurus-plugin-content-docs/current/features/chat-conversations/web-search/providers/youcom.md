---
sidebar_position: 22
title: "You.com"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持，仅用于演示如何针对你的特定用例自定义 Open WebUI。想要参与贡献？请查看[贡献教程](/contributing)。

:::

:::tip

有关 Web Search 相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## You.com YDC Index API {#youcom-ydc-index-api}

[You.com](https://you.com/) 提供 YDC Index API，这是一种网页搜索 API，可返回包含标题、URL、描述和摘要的结构化搜索结果。

### 前提条件 {#prerequisites}

- 从 [You.com API](https://you.com/api) 获取的 You.com API 密钥

### Docker Compose 设置 {#docker-compose-setup}

将以下环境变量添加到你的 Open WebUI `docker-compose.yaml` 文件中：

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "youcom"
      YOUCOM_API_KEY: "YOUR_API_KEY" # 也接受 YDC_API_KEY 作为备用名称
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 10
```

### 管理员面板设置 {#admin-panel-setup}

1. 使用管理员账户登录 Open WebUI。
2. 导航至**设置（Settings）** → **网页搜索（Web Search）**（管理员区域）。
3. 将**网页搜索（Web Search）**切换为**开启（On）**。
4. 从**网页搜索引擎（Web Search Engine）**下拉菜单中选择 **youcom**。
5. 将你的 You.com API 密钥粘贴到 **You.com API Key** 字段中。
6. （可选）根据需要调整结果数量和并发设置。

---
sidebar_position: 7
title: "Jina"
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

# Jina 网页搜索集成

本指南介绍如何将强大的 AI 驱动搜索基础设施 [Jina AI](https://jina.ai/) 与 Open WebUI 集成。该集成使用 Jina 位于 `s.jina.ai` 的 Search API 提供网页搜索功能。

## 概述 {#overview}

Open WebUI 将每个查询发送到 Jina 的 Search API，并以链接、标题和摘要的形式读取结果。此集成并不会调用 Jina 独立的 DeepSearch 产品（一个以迭代方式搜索和推理的智能体），因此 DeepSearch 的参数不适用于此处。

## 定价与 API 密钥 {#pricing-and-api-key}

在 Open WebUI 中使用 Jina 的 Search API 需要 API 密钥。Jina 为新用户提供免费套餐，其中包含可用于其任意模型的 **1000 万个 token**。你可以通过在 Jina AI 平台创建账户来获取免费 API 密钥。

- **API 密钥：**需要 Jina API 密钥。你可以登录 [Jina API 仪表板](https://jina.ai/api-dashboard)获取密钥。

## 配置步骤 {#configuration-steps}

### 1. 获取 Jina API 密钥 {#1-obtain-a-jina-api-key}

按照以下步骤获取 API 密钥：

1. **访问 Jina API 仪表板：**前往 [jina.ai/api-dashboard](https://jina.ai/api-dashboard)。
2. **登录或注册：**创建新账户，或登录现有账户。
3. **获取 API 密钥：**登录后，仪表板会显示你的专属 API 密钥。复制此密钥。

### 2. 配置 Open WebUI {#2-configure-open-webui}

要启用 Jina 网页搜索集成，请在 Open WebUI 管理员设置中按照以下步骤操作：

1. **以管理员身份登录：**访问你的 Open WebUI 实例，并使用管理员账户登录。
2. **进入网页搜索设置：**前往**设置 > 网页搜索**（管理员区域）。
3. **选择 Jina 作为搜索引擎：**在“网页搜索引擎”下拉菜单中选择 `jina`。
4. **输入 API 密钥：**将你的 Jina API 密钥粘贴到 **Jina API 密钥**输入框中。
5. **（可选）输入 Jina API 基础 URL：**如果需要使用特定端点（例如用于欧盟数据处理），请在 **Jina API 基础 URL** 字段中输入。默认值为 `https://s.jina.ai/`。
6. **保存更改：**向下滚动并点击**保存**按钮以应用更改。

### 3. 环境变量配置 {#3-environment-variable-configuration}

对于基于 Docker 的部署，你可以使用环境变量配置 Jina 集成。

为你的 Open WebUI 实例设置以下环境变量：

- `JINA_API_KEY`：你的 Jina API 密钥。
- `JINA_API_BASE_URL`：（可选）自定义 Jina API 端点。

**Docker `run` 命令示例：**

```bash
docker run -d \\
  -p 3000:8080 \\
  -e JINA_API_KEY="your-jina-api-key-here" \\
  --name open-webui \\
  ghcr.io/open-webui/open-webui:main
```

## 限制 {#limits}

- Jina 每次搜索最多返回 10 个结果。对于此引擎，较高的**搜索结果数量**会被限制为 10。
- **域名过滤列表**不适用于 Jina 结果。

## 验证集成 {#verify-the-integration}

完成设置后，你可以测试集成。在聊天中启用网页搜索功能并提出一个问题。Open WebUI 将使用 Jina 的 Search API 检索网页结果，并使用配置的网页加载器读取页面。

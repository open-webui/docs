---
sidebar_position: 5
title: "Exa AI"
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

# Exa AI 网页搜索集成

本指南介绍如何将现代 AI 驱动的搜索引擎 [Exa AI](https://exa.ai/) 与 Open WebUI 集成，以提供网页搜索功能。

## 概述 {#overview}

Exa AI 是专为 AI 应用设计的搜索引擎，通过其 API 提供一套工具，包括网页搜索、网站抓取和深度研究功能。将 Exa AI 与 Open WebUI 集成后，你可以直接在聊天界面中利用其强大的搜索能力。

## 定价模式 {#pricing-model}

Exa AI 采用基于积分、按量付费的定价模式。它并非永久免费的服务，但为新用户提供试用，以便评估 API。

- **初始免费积分：**新用户会获得价值 10 美元的初始积分，用于测试 API。
- **按量付费：**初始积分用完后，必须升级到付费套餐才能继续使用该服务。免费套餐仅用于评估，不包含固定的每月额度。

有关详细且最新的定价信息，请访问 [Exa AI 定价页面](https://exa.ai/pricing)。

## 配置步骤 {#configuration-steps}

### 1. 获取 Exa AI API 密钥 {#1-obtain-an-exa-ai-api-key}

首先，你需要注册 Exa AI 账户并获取 API 密钥。

1. **注册：**前往 [Exa AI 网站](https://exa.ai/)并创建新账户。
2. **进入 API 密钥页面：**注册并登录后，进入用户仪表板中的 **API Keys** 页面。
3. **复制 API 密钥：**在 API Keys 页面，你会看到自己的专属 API 密钥。将此密钥复制到剪贴板，配置 Open WebUI 时需要使用。

### 2. 配置 Open WebUI {#2-configure-open-webui}

接下来，需要在 Open WebUI 管理员设置中配置 Exa AI 集成。

1. **以管理员身份登录：**访问你的 Open WebUI 实例，并使用管理员账户登录。
2. **进入网页搜索设置：**前往**设置 > 网页搜索**（管理员区域）。
3. **选择 Exa 作为搜索引擎：**在“网页搜索引擎”下拉菜单中选择 `exa`。
4. **输入 API 密钥：**在随后出现的 **Exa API 密钥**输入框中，粘贴你从 Exa AI 仪表板复制的 API 密钥。可选的**最大内容长度**字段（`EXA_MAX_CONTENT_LENGTH`，默认不设置）用于限制每个结果返回的字符数。
5. **保存更改：**向下滚动并点击**保存**按钮以应用更改。

### 3.（可选）环境变量配置 {#3-optional-environment-variable-configuration}

你也可以使用环境变量配置 Exa AI 集成。这对基于 Docker 的部署尤其有用。

为你的 Open WebUI 实例设置以下环境变量：

- [`EXA_API_KEY`](/reference/env-configuration#exa_api_key)：你的 Exa AI API 密钥。

设置此环境变量后，管理员设置中的“Exa API 密钥”字段将自动填充。

**Docker `run` 命令示例：**

```bash
docker run -d \\
  -p 3000:8080 \\
  -e EXA_API_KEY="your-exa-api-key-here" \\
  --name open-webui \\
  ghcr.io/open-webui/open-webui:main
```

### 4.（可选）使用 Exa 读取页面 {#4-optional-use-exa-to-read-pages}

Exa 还可以充当[网页加载器](/features/chat-conversations/web-search#search-engine-vs-web-loader)，即读取搜索结果背后的页面以及你在聊天中分享的链接。Exa 会抓取每个页面并返回其文本和标题。

1. 在**设置 > 网页搜索**（管理员区域）中，将**网页加载器引擎**设置为 `exa`，或设置 `WEB_LOADER_ENGINE=exa`。
2. 如果 Exa 同时是你的搜索引擎，加载器将使用你在上面输入的 API 密钥。如果选择了其他搜索引擎，网页加载器设置下会出现一个 **Exa API 密钥**字段；它设置的同样是 `EXA_API_KEY`。
3. **超时时间**字段（[`WEB_LOADER_TIMEOUT`](/reference/env-configuration#web_loader_timeout)）用于设置每次请求 Exa 可花费的秒数。留空时，限制为 60 秒。

加载器返回完整的页面文本。**最大内容长度**仅适用于搜索结果；要限制 `fetch_url` 工具读取的页面长度，请设置 [`WEB_FETCH_MAX_CONTENT_LENGTH`](/reference/env-configuration#web_fetch_max_content_length)。

## 验证集成 {#verify-the-integration}

配置 API 密钥后，你可以在聊天中启用网页搜索功能，并提出一个需要来自网络的最新信息的问题，以测试集成。如果集成成功，Open WebUI 将使用 Exa AI 获取搜索结果，并根据这些信息作出回答。

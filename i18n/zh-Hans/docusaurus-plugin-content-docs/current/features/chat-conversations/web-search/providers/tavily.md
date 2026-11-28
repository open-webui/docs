---
sidebar_position: 17
title: "Tavily"
---

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看[贡献教程](/contributing)。

:::

:::tip

有关与网页搜索相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## 概述 {#overview}

将 Tavily 与 Open WebUI 集成后，你的语言模型可以执行实时网页搜索，获取最新且相关的信息。本教程将指导你在 Open WebUI 中将 Tavily 配置为网页搜索服务提供方。

Tavily 是一个针对 AI 应用优化的搜索 API，可提供经过筛选的结构化结果。按照以下步骤，即可让 Open WebUI 在聊天界面中利用 Tavily 进行网页搜索。

## 前提条件 {#prerequisites}

确保你具备：

- **已安装 Open WebUI**：一个正在运行的 Open WebUI 实例（本地或 Docker）。请参阅[快速上手指南](/getting-started)。
- **Tavily 账户**：一个拥有 [Tavily](https://app.tavily.com/sign-in) API 密钥的账户。
- **管理员权限**：你的 Open WebUI 实例的管理员访问权限。
- **互联网连接**：Tavily API 请求需要互联网连接。

## 分步配置 {#step-by-step-configuration}

### 1. 获取 Tavily API 密钥 {#1-obtain-a-tavily-api-key}

1. 在 [Tavily](https://app.tavily.com/sign-in) 登录或注册。
2. 进入**控制面板（Dashboard）**或 **API 密钥（API Keys）**区域。
3. 复制或生成一个新的 API 密钥。请妥善保管该密钥。

> **注意**：请在 [Tavily 定价页面](https://tavily.com/#pricing)查看你的 Tavily 方案的查询限额。

### 2. 配置 Open WebUI {#2-configure-open-webui}

1. 使用管理员账户登录 Open WebUI。
2. 打开**管理员面板（Admin Panel）**，进入**设置（Settings）**。
3. 进入**工具（Tools）**下的**网页搜索（Web Search）**选项卡。
4. 将**网页搜索（Web Search）**切换为**开启（On）**以启用它。
5. 从**网页搜索引擎（Web Search Engine）**下拉菜单中选择 **tavily**。
6. 将你的 Tavily API 密钥粘贴到 **Tavily API 密钥（Tavily API Key）**字段。
7. （可选）调整最大搜索结果数等可用设置。

> **提示**：确认 API 密钥正确，以免出现配置错误。

### 3. 测试集成 {#3-test-the-integration}

1. 保存设置。
2. 在 Open WebUI 中开始聊天会话。
3. 点击提示输入框中的**加号（+）**按钮以启用网页搜索。
4. 输入查询（例如 `latest AI news`），并确认 Tavily 返回实时结果。

> **示例**：开启**网页搜索（Web Search）**后，`latest AI news` 会触发 Tavily 搜索，并将结果嵌入回答中。

## 可选配置 {#optional-configurations}

- **搜索参数**：Open WebUI 会向 Tavily 发送 `query`、`max_results` 和 `search_depth`。可在 **Tavily 搜索深度（Tavily Search Depth）**下设置深度（`ultra-fast`、`fast`、`basic` 或 `advanced`，默认值为 `basic`），也可使用 [`TAVILY_SEARCH_DEPTH`](/reference/env-configuration#tavily_search_depth) 设置。结果返回后，Open WebUI 会使用自己的**域名过滤列表（Domain Filter List）**进行域名过滤。
- **端点**：请求会发送到 `TAVILY_API_BASE_URL` 加 `/search`，默认基础地址为 `https://api.tavily.com`。该变量仅从环境读取，没有对应的管理员界面字段。
- **将 Tavily 用作网页加载器**：将**网页加载器引擎（Web Loader Engine）**设为 `tavily`，即可通过 Tavily 的 `/extract` 端点读取页面。使用 **Tavily API 密钥（Tavily API Key）**中的密钥；当 Tavily 未同时用作搜索引擎时，加载器区域会显示该字段。**Tavily 提取深度（Tavily Extract Depth）**（`TAVILY_EXTRACT_DEPTH`，默认值为 `basic`）会作为 `extract_depth` 发送，每次请求最多包含 20 个 URL。Open WebUI 的加载器接受 `basic` 或 `advanced`，并原样传递输入文本，不进行校验。Tavily 列为失败的 URL 会被跳过，并记录日志 `Failed to extract content from <url>: <error>`；返回内容不含文本时，会记录日志 `No content extracted from <url>`。
- **环境变量**：在 `.env` 文件或 Docker 命令中设置 `TAVILY_API_KEY`：

  ```bash
  -e TAVILY_API_KEY="your_tavily_api_key"
  ```

  请参阅[环境变量配置](/reference/env-configuration)。
- **RAG 集成**：使用检索增强生成，将 Tavily 结果与本地数据结合。请参阅 [RAG 文档](/features/chat-conversations/rag)。

## 故障排除 {#troubleshooting}

- **API 密钥无效**：确保密钥复制正确，且没有多余的空格。
- **没有结果**：确认网页搜索开关（`+`）已启用，并且互联网连接正常。
- **超出额度**：在 [Tavily 定价页面](https://tavily.com/#pricing)查看你的 Tavily 方案。
- **设置未保存**：确认你具有管理员权限，并且 `webui.db` 可写。

如需进一步帮助，请访问 [Open WebUI 社区](https://openwebui.com/search)或 [Tavily 支持](https://tavily.com/#contact)。

## 其他资源 {#additional-resources}

- [Tavily API 文档](https://docs.tavily.com/welcome)：API 参考和高级选项。
- [Open WebUI 功能](/features)：有关 RAG 和网页搜索的详细信息。
- [为 Open WebUI 做贡献](/contributing)：分享改进或报告问题。

完成本教程后，你已在 Open WebUI 中启用 Tavily 网页搜索，让 AI 能够利用实时数据。祝你搜索愉快！

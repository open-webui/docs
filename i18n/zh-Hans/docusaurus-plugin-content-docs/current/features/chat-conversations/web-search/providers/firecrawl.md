---
sidebar_position: 6
title: "Firecrawl"
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

## 概述 {#overview}

[Firecrawl](https://firecrawl.dev) 是专为 AI 应用打造的搜索与抓取 API。作为 Open WebUI 的网页搜索引擎，它会执行你的查询，并返回带有标题和描述的排序结果。随后由当前配置的**网页加载器引擎**获取页面内容，因此如果希望 Firecrawl 同时抓取这些页面，也请将其设置为网页加载器。你可以使用 `api.firecrawl.dev` 的托管服务，也可以将 Open WebUI 指向自托管的 Firecrawl 实例；Firecrawl 是开源软件，自托管可让所有查询都留在内部。

## 前置条件 {#prerequisites}

- **已安装 Open WebUI**：一个正在运行的 Open WebUI 实例（本地或 Docker）。
- **Firecrawl API 密钥**：从 [firecrawl.dev](https://firecrawl.dev) 的托管服务获取。未启用身份验证的自托管部署可以将其留空，此时不会发送 `Authorization` 标头。
- **管理员访问权限**：你的 Open WebUI 实例的管理员访问权限。

## 配置 {#configuration}

1. 获取 API 密钥：
   - **托管服务**：在 [firecrawl.dev](https://firecrawl.dev) 注册，并从仪表板复制密钥。
   - **自托管**：使用你自己的 Firecrawl 实例的密钥。
2. 在 Open WebUI 中打开**设置 > 网页搜索**（管理员区域）。
3. 开启**网页搜索**。
4. 从**网页搜索引擎**下拉菜单中选择 `firecrawl`。
5. 将你的密钥粘贴到 **Firecrawl API 密钥**字段中。
6. （仅限自托管）将 **Firecrawl API 基础 URL** 设置为你的实例源地址，例如 `https://firecrawl.example.com`。Open WebUI 会自行追加 `/v2/search` 和 `/v2/scrape`，因此除非版本路径为 `/v2`，否则不要包含版本路径。默认值为 `https://api.firecrawl.dev`。
7. 保存。

然后开始聊天，通过提示输入框中的 **+** 按钮启用网页搜索，并执行查询，确认 Firecrawl 能返回结果。

## 环境变量 {#environment-variables}

你可以使用环境变量代替管理员面板配置 Firecrawl，也可以将两种方式结合使用：

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `WEB_SEARCH_ENGINE` | （空） | 设置为 `firecrawl` 以选择此引擎。 |
| `ENABLE_WEB_SEARCH` | `false` | 设置为 `true` 以开启网页搜索。 |
| `FIRECRAWL_API_KEY` | （空） | 你的 Firecrawl API 密钥。 |
| `FIRECRAWL_API_BASE_URL` | `https://api.firecrawl.dev` | API 端点。将其指向自托管实例可让查询留在内部。 |
| `FIRECRAWL_TIMEOUT` | （Firecrawl 默认值） | 抓取超时时间（秒），仅在 Firecrawl 作为网页加载器时使用。Open WebUI 会将其转换为毫秒，并限制在 1 至 300 秒之间。 |

有关网页搜索变量的完整列表，请参阅[环境配置参考](/reference/env-configuration#web-search)。

## 故障排除 {#troubleshooting}

- **API 密钥无效**：确认复制的密钥不含多余空格，并且与端点匹配（`api.firecrawl.dev` 使用托管服务密钥，自托管使用实例密钥）。
- **无结果**：确保网页搜索开关（`+`）已开启，并且实例可以访问 Firecrawl 端点。
- **超时**：`FIRECRAWL_TIMEOUT` 仅适用于网页加载器。搜索调用对每个请求的结果使用固定的 3 秒时间预算，因此如果搜索超时，请降低**搜索结果数量**。
- **Firecrawl 超时时间（秒）**：此字段显示在搜索引擎设置中，但它设置的是 `FIRECRAWL_TIMEOUT`，因此只有在**网页加载器引擎**为 `firecrawl` 时才会生效。输入整数秒数。留空或输入非数值时，不会向 Firecrawl 发送超时时间。对于每次抓取，Open WebUI 的等待时间会在此值基础上增加 10 秒；如果该值为空，则等待 70 秒。抓取返回 HTTP 429、500、502、503 或 504，发生超时或无法连接时，会重试两次。之后将跳过该页面，并记录 `Error extracting content from <url> with Firecrawl: <error>`，其他页面仍会继续加载。
- **自托管连接错误**：确认 Open WebUI 容器或主机可以访问 `FIRECRAWL_API_BASE_URL`。

## 其他资源 {#additional-resources}

- [Firecrawl 文档](https://docs.firecrawl.dev)
- [Open WebUI 网页搜索环境变量](/reference/env-configuration#web-search)

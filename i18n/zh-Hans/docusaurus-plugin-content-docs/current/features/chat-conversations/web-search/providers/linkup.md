---
sidebar_position: 23
title: "Linkup"
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

[Linkup](https://www.linkup.so/) 是专为 AI 应用打造的搜索 API。将其与 Open WebUI 集成后，你的语言模型可以执行实时网页搜索，并依据最新来源作出回答。本教程将指导你将 Linkup 配置为网页搜索提供方。

## 前置条件 {#prerequisites}

确保你具备：

- **已安装 Open WebUI**：一个正在运行的 Open WebUI 实例（本地或 Docker）。请参阅[快速上手指南](/getting-started)。
- **Linkup 账户**：一个 [Linkup](https://www.linkup.so/) 账户及其 API 密钥。
- **管理员访问权限**：你的 Open WebUI 实例的管理员访问权限。
- **互联网连接**：Linkup API 请求需要互联网连接。

## 分步配置 {#step-by-step-configuration}

### 1. 获取 Linkup API 密钥 {#1-obtain-a-linkup-api-key}

1. 在 [Linkup](https://www.linkup.so/) 登录或注册。
2. 打开仪表板的 API 密钥区域。
3. 复制现有 API 密钥或生成新密钥。请妥善保管。

### 2. 配置 Open WebUI {#2-configure-open-webui}

1. 使用管理员账户登录 Open WebUI。
2. 打开**设置 → 网页搜索**（管理员区域）。
3. 将**网页搜索**切换为**开启**。
4. 从**网页搜索引擎**下拉菜单中选择 **linkup**。
5. 将你的 Linkup API 密钥粘贴到 **Linkup API 密钥**字段中。
6. （可选）在**参数**字段中以 JSON 对象设置搜索深度和输出类型，例如 `{"depth": "standard", "outputType": "sourcedAnswer"}`（见下文）。
7. 保存设置。

### 3. 测试集成 {#3-test-the-integration}

1. 在 Open WebUI 中开始聊天。
2. 点击提示输入框中的**加号（+）**按钮以启用网页搜索。
3. 输入查询（例如 `+latest AI news`），并确认 Linkup 返回实时结果。

## 搜索参数 {#search-parameters}

Linkup 请求由一小组可覆盖的默认参数构建。查询（`q`）和结果数量（`maxResults`）会自动注入，无法覆盖。

| 参数 | 默认值 | 说明 |
|-----------|---------|-------|
| `depth` | `standard` | `standard` 更快且成本更低；`deep` 会执行更彻底的多步骤搜索。 |
| `outputType` | `sourcedAnswer` | `sourcedAnswer` 返回答案及其来源页面；`searchResults` 返回原始结果条目。 |
| `url` | `https://api.linkup.so/v1/search` | 仅在需要指向不同端点时覆盖。 |

这些参数对应 [`LINKUP_SEARCH_PARAMS`](/reference/env-configuration#linkup_search_params) 环境变量，以 JSON 对象的形式提供。例如：

```bash
-e LINKUP_API_KEY="your_linkup_api_key"
-e LINKUP_SEARCH_PARAMS='{"depth": "deep", "outputType": "searchResults"}'
```

选择 `linkup` 引擎时，管理界面会将同一个 JSON 对象作为单个**参数**字段提供，因此除非你更倾向于通过环境变量管理配置，否则无需使用环境变量。有关详细信息，请参阅[环境变量配置](/reference/env-configuration)，并了解 [`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config) 的行为。

## 故障排除 {#troubleshooting}

- **API 密钥无效**：确保密钥复制正确，不含多余空格。
- **无结果**：确认网页搜索开关（`+`）已启用，并且互联网连接正常。对于资料较少的主题，可尝试 `depth: deep`。
- **超出配额**：在 Linkup 仪表板中检查你的套餐和用量。
- **设置未保存**：确认你拥有管理员权限，并且 `webui.db` 可写。

## 其他资源 {#additional-resources}

- [Linkup 文档](https://docs.linkup.so/)：API 参考和高级选项。
- [Open WebUI 功能](/features)：有关 RAG 和网页搜索的详细信息。
- [参与 Open WebUI 贡献](/contributing)：分享改进或报告问题。

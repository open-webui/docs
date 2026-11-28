---
sidebar_position: 26
title: "SERPHouse"
---

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看[贡献教程](/contributing)。

:::

:::tip

有关与网页搜索相关的所有环境变量的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## 概述 {#overview}

[SERPHouse](https://www.serphouse.com/) 是一个实时 SERP（搜索引擎结果页）API。将其与 Open WebUI 集成后，你的语言模型可以执行实时网页搜索，并以当前来源为依据生成回答。本指南介绍如何将 SERPHouse 配置为网页搜索服务提供方。

## 前提条件 {#prerequisites}

- **已安装 Open WebUI**：一个正在运行的 Open WebUI 实例（本地或 Docker）。请参阅[快速上手指南](/getting-started)。
- **SERPHouse 账户**：一个拥有 [SERPHouse](https://www.serphouse.com/) API 密钥的账户。
- **管理员权限**：你的 Open WebUI 实例的管理员访问权限。

## 分步配置 {#step-by-step-configuration}

### 1. 获取 SERPHouse API 密钥 {#1-obtain-a-serphouse-api-key}

1. 在 [SERPHouse](https://www.serphouse.com/) 登录或注册。
2. 打开控制面板的 API 区域，复制或生成一个 API 密钥。请妥善保管该密钥。

### 2. 配置 Open WebUI {#2-configure-open-webui}

1. 使用管理员账户登录 Open WebUI。
2. 打开**设置（Settings）→ 网页搜索（Web Search）**（管理员区域）。
3. 将**网页搜索（Web Search）**切换为**开启（On）**以启用它。
4. 从**网页搜索引擎（Web Search Engine）**下拉菜单中选择 **serphouse**。
5. 将你的 SERPHouse API 密钥粘贴到 **SERPHouse API 密钥（SERPHouse API Key）**字段。
6. （可选）设置 **SERPHouse 域名（SERPHouse Domain）**（要查询的 Google 域名，例如 `google.com`、`google.co.uk`）。
7. 保存设置。

### 3. 测试集成 {#3-test-the-integration}

1. 在 Open WebUI 中开始聊天会话。
2. 点击提示输入框中的**加号（+）**按钮以启用网页搜索。
3. 输入查询（例如 `+latest AI news`），并确认 SERPHouse 返回实时结果。

## 配置参考 {#configuration-reference}

| 设置 | 环境变量 | 默认值 | 说明 |
|---|---|---|---|
| API 密钥 | [`SERPHOUSE_API_KEY`](/reference/env-configuration#serphouse_api_key) | （空） | 必填。 |
| Google 域名 | [`SERPHOUSE_DOMAIN`](/reference/env-configuration#serphouse_domain) | `google.com` | SERPHouse 查询时使用的 Google 域名。 |

选择 `serphouse` 引擎后，管理员界面也会显示相同的字段，因此除非你希望通过环境变量管理配置，否则无需设置环境变量。

## 故障排除 {#troubleshooting}

- **API 密钥无效**：确保密钥复制正确，且没有多余的空格。
- **没有结果**：确认网页搜索开关（`+`）已启用，并且互联网连接正常。
- **地区不正确**：将 `SERPHOUSE_DOMAIN` 调整为目标地区对应的 Google 域名。

## 其他资源 {#additional-resources}

- [SERPHouse 文档](https://docs.serphouse.com/)：API 参考和高级选项。
- [Open WebUI 功能](/features)：有关 RAG 和网页搜索的详细信息。

---
sidebar_position: 28
title: "Staan"
---

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关与网页搜索相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

# Staan 网页搜索集成

[Staan](https://staan.ai/) 是一个数据保留在欧盟境内的网页搜索 API。如果你的部署必须将数据处理限制在这一范围内，这就是选择它而不是其他托管搜索 API 的原因。

## 配置步骤 {#configuration-steps}

1. 在 [staan.ai](https://staan.ai/) 注册并创建 API 密钥。
2. 在 Open WebUI 中打开**设置（Settings）> 网页搜索（Web Search）**（管理员区域）。
3. 开启**网页搜索（Web Search）**，并选择 **Staan** 作为**网页搜索引擎（Web Search Engine）**。
4. 将密钥粘贴到 **Staan API 密钥（Staan API Key）**字段。
5. 点击**保存（Save）**。

相同的设置也可通过环境变量配置：

```bash
ENABLE_WEB_SEARCH=true
WEB_SEARCH_ENGINE=staan
STAAN_API_KEY=your-staan-api-key
```

## 市场 {#market}

**Staan 市场（Staan Market）**（`STAAN_MARKET`，默认值为 `en-us`）以语言和国家/地区对的形式，选择搜索结果所属的地区和语言。请将其设为受众所属的市场，例如 `de-de` 表示来自德国的德语结果。

## 结果中的页面内容 {#page-content-in-the-results}

**Staan 最大片段数（Staan Max Snippets）**（`STAAN_MAX_SNIPPETS`）决定 Open WebUI 获取每个页面的内容量。

默认值为 `0`，此时 Staan 返回普通搜索结果：标题、URL 及其已有的摘要。大于 `0` 时，Staan 会抓取每个结果页面，根据查询为页面段落评分，并返回至多指定数量的内容块。Open WebUI 会将这些内容块拼接到对应结果的摘要之后，使模型能够读取页面中的相关部分，而不只是一行摘要。

当回答需要页面内部的详细信息时，可以提高此值。请注意，请求页面内容会增加每次搜索的工作量，因此值越高，耗时越长；在按用量计费的方案中，费用也会更高。

## 域名过滤 {#domain-filtering}

**域名过滤列表（Domain Filter List）**对 Staan 的作用与对 Tavily 和 Exa 相同：结果返回后，域名被过滤掉的结果会被丢弃。

---
sidebar_position: 16
title: "Serpstack"
description: "在 Open WebUI 中配置 Serpstack 网页搜索，检查账户的 HTTPS 访问权限，并验证聊天中的搜索结果。"
---

使用 Serpstack 为 Open WebUI 对话获取搜索引擎结果。Open WebUI 会使用你账户的访问密钥，将搜索查询发送到 Serpstack 托管的 API。

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看[贡献教程](/contributing)。

:::

## 前提条件 {#requirements}

- 一个正在运行的 Open WebUI 实例和一个管理员账户。
- Open WebUI 服务器能够出站访问搜索服务提供方；如需抓取完整页面，还需能够访问搜索结果返回的网站。
- 一个支持可靠的原生工具调用且已启用“网页搜索”能力的聊天模型。

创建一个 [Serpstack 账户](https://serpstack.com/signup/free)，并从账户控制面板复制访问密钥。根据[当前方案详情](https://serpstack.com/pricing)确认你的搜索额度和 HTTPS 使用权限。定价页面目前显示免费方案和付费方案均提供 HTTPS 加密，而 [FAQ](https://serpstack.com/faq) 仍将 HTTPS 列为取决于方案的功能；请确认你的账户是否可用，不要默认所有免费账户都必须使用 HTTP。

## 在 Open WebUI 中配置 {#configure-in-open-webui}

1. 打开**设置（Settings）→ 网页搜索（Web Search）**（管理员区域），并启用网页搜索。
2. 将**网页搜索引擎（Web Search Engine）**设为 `serpstack`。
3. 将密钥粘贴到 **Serpstack API 密钥（Serpstack API Key）**字段，并保存设置。
4. 启用模型的**网页搜索（Web Search）**能力及其**网页搜索（Web Search）**默认功能，或为当前对话开启网页搜索。按照[原生搜索设置](/features/chat-conversations/web-search/agentic-search#how-to-enable-agentic-behavior)配置模型设置。

如果你的账户支持 HTTPS，请保留默认的 **`SERPSTACK_HTTPS=true`**。如果 API 报告 HTTPS 不可用，请向 Serpstack 确认你账户的使用权限。`SERPSTACK_HTTPS=false` 会选择未加密的 HTTP，使访问密钥和搜索查询在传输过程中暴露；对于敏感查询，请使用支持 HTTPS 的账户。

## 环境变量示例 {#environment-example}

对于通过环境变量配置的部署：

```bash
ENABLE_WEB_SEARCH=true
WEB_SEARCH_ENGINE=serpstack
SERPSTACK_API_KEY=your-api-key
SERPSTACK_HTTPS=true
```

更改环境变量后重启 Open WebUI。此前保存的管理员设置可能优先于这些启动值；如果所选引擎或密钥没有变化，请在管理员面板中更新。有关持久化行为和其他选项，请参阅[网页搜索配置参考](/reference/env-configuration#web-search)。

## 验证 {#verify}

使用配置好的模型开始新对话；如果尚未启用网页搜索，请在聊天的 **+** 菜单中开启**网页搜索（Web Search）**。然后提问：“搜索 Python 官方文档并给我链接。”

确认对话中显示网页搜索工具调用，然后打开该调用并检查输出中的链接。在 Native 模式下，搜索结果不会列为来源。看似合理但没有搜索工具调用的回答，不能证明搜索服务提供方已连接。

## 故障排除 {#troubleshooting}

- **身份验证或额度错误：**检查保存的 API 密钥是否正确，以及服务提供方账户是否有可用的搜索额度。
- **HTTPS 访问错误：**确认你账户的 HTTPS 使用权限。不要仅因账户属于免费层级就更改用 HTTP；请参阅上文的 HTTPS 说明。
- **没有搜索工具调用：**检查模型的网页搜索能力、聊天开关或默认功能，并参照[原生搜索设置](/features/chat-conversations/web-search/agentic-search#how-to-enable-agentic-behavior)检查原生函数调用。
- **搜索成功但页面内容为空：**按照[网页搜索故障排除](/troubleshooting/web-search)检查出站连接、代理设置和网页加载器错误。返回搜索结果与抓取完整页面是两个独立步骤。

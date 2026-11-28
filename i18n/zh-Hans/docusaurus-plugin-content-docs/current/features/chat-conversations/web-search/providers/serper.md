---
sidebar_position: 14
title: "Serper"
description: "使用 API 密钥将 Serper 网页搜索连接到 Open WebUI，配置搜索引擎，并验证聊天中的搜索功能。"
---

使用 Serper 为 Open WebUI 对话获取 Google 搜索结果。Open WebUI 会将搜索查询发送到 Serper 托管的 API，因此服务器需要互联网连接和 Serper API 密钥。

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看[贡献教程](/contributing)。

:::

## 前提条件 {#requirements}

- 一个正在运行的 Open WebUI 实例和一个管理员账户。
- Open WebUI 服务器能够出站访问搜索服务提供方；如需抓取完整页面，还需能够访问搜索结果返回的网站。
- 一个支持可靠的原生工具调用且已启用“网页搜索”能力的聊天模型。

在 [Serper](https://serper.dev/) 创建账户，并从其控制面板复制 API 密钥。确认你的账户有可用的搜索额度。

## 在 Open WebUI 中配置 {#configure-in-open-webui}

1. 打开**设置（Settings）→ 网页搜索（Web Search）**（管理员区域），并启用网页搜索。
2. 将**网页搜索引擎（Web Search Engine）**设为 `serper`。
3. 将密钥粘贴到 **Serper API 密钥（Serper API Key）**字段，并保存设置。
4. 启用模型的**网页搜索（Web Search）**能力及其**网页搜索（Web Search）**默认功能，或为当前对话开启网页搜索。按照[原生搜索设置](/features/chat-conversations/web-search/agentic-search#how-to-enable-agentic-behavior)配置模型设置。

## 环境变量示例 {#environment-example}

对于通过环境变量配置的部署：

```bash
ENABLE_WEB_SEARCH=true
WEB_SEARCH_ENGINE=serper
SERPER_API_KEY=your-api-key
```

更改环境变量后重启 Open WebUI。此前保存的管理员设置可能优先于这些启动值；如果所选引擎或密钥没有变化，请在管理员面板中更新。有关持久化行为和其他选项，请参阅[网页搜索配置参考](/reference/env-configuration#web-search)。

## 验证 {#verify}

使用配置好的模型开始新对话；如果尚未启用网页搜索，请在聊天的 **+** 菜单中开启**网页搜索（Web Search）**。然后提问：“搜索 Python 官方文档并给我链接。”

确认对话中显示网页搜索工具调用，然后打开该调用并检查输出中的链接。在 Native 模式下，搜索结果不会列为来源。看似合理但没有搜索工具调用的回答，不能证明搜索服务提供方已连接。

## 故障排除 {#troubleshooting}

- **身份验证或额度错误：**检查保存的 API 密钥是否正确，以及服务提供方账户是否有可用的搜索额度。
- **没有结果或出现额度错误：**在 Serper 控制面板中检查剩余搜索额度和账户限制。
- **没有搜索工具调用：**检查模型的网页搜索能力、聊天开关或默认功能，并参照[原生搜索设置](/features/chat-conversations/web-search/agentic-search#how-to-enable-agentic-behavior)检查原生函数调用。
- **搜索成功但页面内容为空：**按照[网页搜索故障排除](/troubleshooting/web-search)检查出站连接、代理设置和网页加载器错误。返回搜索结果与抓取完整页面是两个独立步骤。

---
sidebar_position: 6
title: "Google PSE"
---

:::warning

**不再支持新的 Google PSE 项目。** Google 已将旧版 JSON API 限制为仅供现有客户使用。尝试使用 Google PSE 的新用户将收到 `403 Forbidden` 错误。

现有项目也有终止日期。Google 的 [Custom Search JSON API 概览](https://developers.google.com/custom-search/v1/overview)指出：“现有 Custom Search JSON API 客户必须在 2027 年 1 月 1 日之前迁移到替代解决方案。”Open WebUI 中的 `google_pse` 引擎会将搜索请求发送到此 API，因此如果你正在使用该引擎，请在此日期之前从[网页搜索](/features/chat-conversations/web-search)页面选择另一个引擎。

:::

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持，仅用于演示如何针对你的特定用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关 Web Search 相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## Google PSE API {#google-pse-api}

### 设置 {#setup}

1. 前往 Google Developers，使用 [Programmable Search Engine](https://developers.google.com/custom-search)，然后登录或创建账户。
2. 前往[控制面板](https://programmablesearchengine.google.com/controlpanel/all)，点击 `Add` 按钮。
3. 输入搜索引擎名称，根据需要设置其他属性，验证你不是机器人，然后点击 `Create` 按钮。
4. 生成 `API key` 并获取 `Search engine ID`。（创建引擎后即可获取）
5. 准备好 `API key` 和 `Search engine ID` 后，打开 `Open WebUI Admin panel`，点击 `Settings` 选项卡，然后点击 `Web Search`。
6. 启用 `Web Search`，并将 `Web Search Engine` 设置为 `google_pse`。
7. 将 `Google PSE API Key` 设置为 `API key`，并将 `Google PSE Engine Id` 设置为第 4 步的搜索引擎 ID。
8. 点击 `Save`。

![Open WebUI 管理员面板](/images/tutorial_google_pse1.png)

#### 注意 {#note}

要在聊天中搜索网页，请打开消息输入框中的 **+** 菜单，然后开启**网页搜索**。

![启用网页搜索](/images/tutorial_google_pse2.png)

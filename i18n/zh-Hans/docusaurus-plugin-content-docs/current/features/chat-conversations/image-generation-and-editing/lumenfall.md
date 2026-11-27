---
sidebar_position: 7
title: "Lumenfall"
---

:::warning
本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例定制 Open WebUI。想要贡献内容？请查看贡献教程。
:::

Open WebUI 还支持通过 [Lumenfall](https://lumenfall.ai) 生成图像。Lumenfall 是一个 AI 媒体网关，可将众多不同提供方上的所有热门图像模型统一到 OpenAI 兼容 API 中，并提供免费模型。

### 初始设置 {#initial-setup}

1. 在 [lumenfall.ai](https://lumenfall.ai) 创建免费账户。
2. 从你的[仪表板](https://lumenfall.ai/app/api_keys)生成 API 密钥。

### 配置图像生成 {#configuring-image-generation}

1. 在 Open WebUI 中，进入**设置** > **图像**（管理员区域）并添加连接。
2. 将**连接类型**设为 **OpenAI 兼容**（Lumenfall 使用与 OpenAI 相同的语法）。
3. 将 **URL** 设为 `https://api.lumenfall.ai/openai/v1`，并输入你的 Lumenfall API 密钥。
4. 在**模型 ID**下，添加你要使用的模型，例如 `gemini-3.1-flash-image`、`gpt-image-2` 或 `flux.2-max`。可在 [lumenfall.ai/models](https://lumenfall.ai/models) 查看所有可用模型。
5. 可选择打开**高级**并设置**图像大小**（例如 `1024x1024`）。支持的大小取决于模型。
6. 设置**访问控制**并点击**保存**。未授予访问权限时，只有管理员可以使用此连接。

### 配置图像编辑 {#configuring-image-editing}

Lumenfall 还支持通过同一连接编辑图像。在**模型 ID**中添加支持编辑的模型，例如 `gpt-image-2`。

更多详情，请参阅 [Lumenfall 文档](https://docs.lumenfall.ai/integrations/openwebui)。

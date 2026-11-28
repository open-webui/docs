---
sidebar_position: 4
title: "OpenAI"
---

:::warning
本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例定制 Open WebUI。想要贡献内容？请查看贡献教程。
:::

Open WebUI 支持通过 **OpenAI API** 生成和编辑图像，也支持任何提供 OpenAI 兼容图像 API 的服务器，例如 Azure OpenAI 或 LiteLLM。它们都使用 **OpenAI 兼容**连接类型。

### 初始设置 {#initial-setup}

1. 从 OpenAI 获取 [API 密钥](https://platform.openai.com/api-keys)。

### 配置 Open WebUI {#configuring-open-webui}

1. 在 Open WebUI 中，进入**设置** > **图像**（管理员区域）并添加连接。
2. 将**连接类型**设为 **OpenAI 兼容**，将 **URL** 设为 `https://api.openai.com/v1`，并输入你的 API 密钥。
3. 将**模型 ID**留空以使用 `gpt-image-2`，或添加你要提供的模型，例如 `gpt-image-1.5`。
4. 可选择打开**高级**并设置**图像大小**。GPT-Image 模型接受 `auto`、`1024x1024`、`1536x1024` 或 `1024x1536`。
5. 设置**访问控制**并点击**保存**。未授予访问权限时，只有管理员可以使用此连接。

### Azure OpenAI {#azure-openai}

Azure OpenAI 使用相同的连接类型。添加一个连接并设置：

1. 将 **URL** 设为 `https://<instance-id>.cognitiveservices.azure.com/openai/deployments/<model>/`。实例和模型取自 Azure AI Foundry 的设置。
2. 使用 Azure AI Foundry 中的 API 密钥。
3. 将**模型 ID**设为已部署模型的名称。
4. 将**高级**下的 **API 版本**设为 Azure AI Foundry 中显示的值。

:::tip Azure GPT-Image-1.5 配置
对于 Azure OpenAI **gpt-image-1.5**，请使用以下设置：
- **模型 ID**：`gpt-image-1.5`
- **图像大小**：`1024x1024`
- **API 版本**：`2025-04-01-preview`
- **URL**：`https://<your-resource-name>.openai.azure.com/openai/deployments/<your-deployment-name>/`
:::

:::tip
你也可以从部署页面复制目标 URI，但需删除模型名称之后的所有内容。例如，目标 URI `https://test.openai.azure.com/openai/deployments/gpt-image-1/images/generations?api-version=2025-04-01-preview` 应变为 URL `https://test.openai.azure.com/openai/deployments/gpt-image-1/`。
:::

### 使用 OpenAI 端点的 LiteLLM 代理 {#litellm-proxy-with-openai-endpoints}

1. 添加一个 **OpenAI 兼容**类型的连接。
2. 将 **URL** 设为 `https://<your-litellm-url>:<port>/v1`，并输入你的 LiteLLM API 密钥。
3. 将**模型 ID**留空。连接会自动列出 LiteLLM 服务器的图像模型。仅在需要提供一个子集时才添加模型 ID。
4. 将 **API 版本**留空。

:::tip
你可以在**设置** > **连接**（管理员区域）的 OpenAI API 连接中找到 LiteLLM 连接详情。
:::

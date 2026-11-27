---
sidebar_position: 6
title: "Image Router"
---

:::warning
本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例定制 Open WebUI。想要贡献内容？请查看贡献教程。
:::

Open WebUI 还支持通过 **Image Router API** 生成图像。Image Router 是一个[开源](https://github.com/DaWe35/image-router)图像生成代理，可将大多数热门模型统一到单个 API 中。

### 初始设置 {#initial-setup}

1. 从 Image Router 获取 [API 密钥](https://imagerouter.io/api-keys)。

### 配置 Open WebUI {#configuring-open-webui}

1. 在 Open WebUI 中，进入**设置** > **图像**（管理员区域）并添加连接。
2. 将**连接类型**设为 **OpenAI 兼容**（Image Router 使用与 OpenAI 相同的语法）。
3. 将 **URL** 设为 `https://api.imagerouter.io/v1/openai`，并输入你的 Image Router API 密钥。
4. 在**模型 ID**下，输入名称以添加你要使用的模型。更多信息请参阅[全部模型](https://imagerouter.io/models)。
5. 设置**访问控制**并点击**保存**。未授予访问权限时，只有管理员可以使用此连接。

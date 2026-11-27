---
title: "Helicone"
sidebar_position: 10
---

# Helicone 与 Open WebUI 集成

:::warning

本教程由社区贡献，Open WebUI 团队不提供支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

Helicone 是一个开源 LLM 可观测性平台，供开发者监控、调试和改进**生产就绪型**应用程序，包括你的 Open WebUI 部署。

启用 Helicone 后，你可以记录 LLM 请求、评估和试验提示词，并获得即时洞察，帮助你放心地将更改推送到生产环境。

- **实时监控，统一查看不同类型的模型**：通过单一界面监控本地 Ollama 模型和云端 API
- **请求可视化与重放**：准确查看 Open WebUI 向每个模型发送的提示词，以及 LLM 生成的输出，以便进行评估
- **本地 LLM 性能跟踪**：测量自托管模型的响应时间和吞吐量
- **按模型分析用量**：比较 Open WebUI 配置中不同模型的使用模式
- **用户分析**：了解交互模式
- **调试功能**：排查模型响应问题
- **成本跟踪**：跟踪跨提供方的 LLM 使用成本

## 如何将 Helicone 与 Open WebUI 集成 {#how-to-integrate-helicone-with-openwebui}

<iframe
  width="560"
  height="315"
  src="https://www.youtube-nocookie.com/embed/8iVHOkUrpSA?si=Jt1GVqA0wY4UI7sF"
  title="YouTube 视频播放器"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>

### 第 1 步：创建 Helicone 帐户并生成 API 密钥 {#step-1-create-a-helicone-account-and-generate-your-api-key}

创建一个 [Helicone 帐户](https://www.helicone.ai/)并登录，然后生成 [API 密钥](https://us.helicone.ai/settings/api-keys)。

*请确保生成[只写 API 密钥](https://docs.helicone.ai/helicone-headers/helicone-auth)。这样可以确保你只允许向 Helicone 写入日志数据，而不授予其读取私有数据的权限。*

### 第 2 步：创建 OpenAI 帐户并生成 API 密钥 {#step-2-create-an-openai-account-and-generate-your-api-key}

创建一个 OpenAI 帐户并登录 [OpenAI 开发者门户](https://platform.openai.com/account/api-keys)，生成 API 密钥。

### 第 3 步：使用 Helicone 的基础 URL 运行 Open WebUI 应用程序 {#step-3-run-your-open-webui-application-using-helicones-base-url}

要启动你的第一个 Open WebUI 应用程序，请使用 [Open WebUI 文档](/)中的命令，并加入 Helicone 的 API BASE URL，以便自动查询和监控。

```bash
   # 设置环境变量
   export HELICONE_API_KEY=<YOUR_API_KEY>
   export OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

   # 运行集成了 Helicone 的 Open WebUI
   docker run -d -p 3000:8080 \
     -e OPENAI_API_BASE_URL="https://oai.helicone.ai/v1/$HELICONE_API_KEY" \
     -e OPENAI_API_KEY="$OPENAI_API_KEY" \
     --name open-webui \
     ghcr.io/open-webui/open-webui
```

如果你已经部署了 Open WebUI 应用程序，请转到 `Settings` > `Connections`（管理员部分），点击“管理 OpenAI API 连接”旁边的 `+` 号。更新以下属性：

- 你的 `API Base URL` 应为 ``https://oai.helicone.ai/v1/<YOUR_HELICONE_API_KEY>``
- `API KEY` 应为你的 OpenAI API 密钥。

![Open WebUI Helicone 设置](https://res.cloudinary.com/dacofvu8m/image/upload/v1745272273/openwebui-helicone-setup_y4ssca.gif)

### 第 4 步：确保监控正常运行 {#step-4-make-sure-monitoring-is-working}

为确保集成正常工作，请登录 Helicone 仪表板并查看“Requests”选项卡。

你应看到通过 Open WebUI 界面发出的请求已经记录到 Helicone 中。

![Helicone 跟踪示例](https://res.cloudinary.com/dacofvu8m/image/upload/v1745272747/CleanShot_2025-04-21_at_17.57.46_2x_wpkpyf.png)

## 了解更多 {#learn-more}

有关 Helicone 的全面指南，请查看 [Helicone 文档](https://docs.helicone.ai/getting-started/quick-start)。

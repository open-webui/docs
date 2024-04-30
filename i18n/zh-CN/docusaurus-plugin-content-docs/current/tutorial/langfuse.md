---
sidebar_position: 7
title: "Langfuse 分析"
---

# Langfuse 分析

将 [Langfuse](https://cloud.langfuse.com) 与 LiteLLM 集成，允许对 API 调用进行详细观察和记录。
本指南将指导您设置 Langfuse 回调与 LiteLLM。

本地部署 Langfuse 是通过他们的开源替代方案提供的一个选项。但是，为了本教程的方便，我们将使用他们的云服务的免费限制版本。如果数据隐私对您很重要，建议您安装本地版本。

## 使用 Langfuse 入门

首先，设置您的 Langfuse 帐户并获取必要的密钥：

1. 在 [Langfuse](https://cloud.langfuse.com/auth/sign-up) 创建帐户。
2. 生成并复制您的公共和私有密钥。

## 配置 OpenWebUI LiteLLM 代理以使用 Langfuse

要将 Langfuse 与 LiteLLM 集成，您需要修改 LiteLLM 的 `config.yaml` 文件，并为 Docker 容器设置环境变量。

### 编辑 LiteLLM 配置文件

编辑 LiteLLM 的 `config.yaml` 文件，位于主机 Docker 挂载点 `/data/litellm/config.yaml`。
按照 [LiteLLM 官方文档](https://litellm.vercel.app/docs/observability/langfuse_integration) 中所示，在常规设置下添加以下内容：

```yaml
general_settings: {}
litellm_settings:
  success_callback: ["langfuse"]
  failure_callback: ["langfuse"]
```

### 在 Docker 中设置环境变量

启动 Docker 容器时，将 Langfuse API 密钥作为环境变量传递：

```bash
LANGFUSE_PUBLIC_KEY: 用您的实际公钥替换 "xxxxx"。
LANGFUSE_SECRET_KEY: 用您的实际私钥替换 "xxxxx"。
这些变量可以直接在 docker run 命令中设置，也可以通过 Docker Compose YAML 文件设置。
```

## 测试集成

设置完成后，您的 Langfuse 仪表板应开始记录通过 LiteLLM 集成进行的每个 API 调用。这样可以有效地监控和排查 API 交互。

![Langfuse 仪表板](/img/tutorial_langfuse.png)

## 注意

确保所有配置正确设置，并正确传递环境变量，以避免集成问题。

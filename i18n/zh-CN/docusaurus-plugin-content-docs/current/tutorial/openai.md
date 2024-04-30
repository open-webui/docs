---
sidebar_position: 2
title: "OpenAI API 接入"
---

# OpenAI API 接入

在本教程中，我们将演示如何使用环境变量配置多个 OpenAI（或 `OpenAI Like API`）API 端点。此设置使您可以轻松在不同的 API 提供商之间切换或同时使用多个提供商，同时在容器更新、重建或重新部署之间保持配置。

## Docker Run

以下是类似于您可能用于 Open WebUI 的 `docker run` 命令示例：
```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OPENAI_API_BASE_URLS="https://api.openai.com/v1;https://api.mistral.ai/v1" \
  -e OPENAI_API_KEYS="<OPENAI_API_KEY_1>;<OPENAI_API_KEY_2>" \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```
此命令设置以下环境变量：

* `OPENAI_API_BASE_URLS`：由分号（;）分隔的 API 基本 URL 列表。在此示例中，我们使用 OpenAI 和 Mistral。
* `OPENAI_API_KEYS`：与 `OPENAI_API_BASE_URLS` 中指定的基本 URL 相对应的 API 密钥列表。请确保将 `<OPENAI_API_KEY_1>` 和 `<OPENAI_API_KEY_2>` 替换为您的实际 API 密钥。

您可以根据自己的需求调整此命令，并添加更多端点/密钥对，但请确保按照上述示例包含环境变量。

## Docker Compose

或者，您可以使用 `docker-compose.yaml` 文件来定义和运行 Open WebUI 容器。以下是可能的简化版本：
```yaml
services:
  open-webui:
    environment:
      - 'OPENAI_API_BASE_URLS=${OPENAI_API_BASE_URLS}'
      - 'OPENAI_API_KEYS=${OPENAI_API_KEYS}'
```
您可以直接编辑 `${VARIABLES}`，或者选择在 `.env` 文件中定义这些变量的值，该文件应放置在与 `docker-compose.yaml` 文件相同的目录中：
```ini
OPENAI_API_BASE_URLS="https://api.openai.com/v1;https://api.mistral.ai/v1"
OPENAI_API_KEYS="<OPENAI_API_KEY_1>;<OPENAI_API_KEY_2>"
```

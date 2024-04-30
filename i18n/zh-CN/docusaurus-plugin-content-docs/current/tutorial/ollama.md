---
sidebar_position: 1
title: "Ollama 负载均衡"
---

# Ollama 负载均衡设置

本指南演示了如何配置 Open WebUI 以连接到多个 Ollama 实例，以在部署中实现负载平衡。此方法使您可以跨多个节点分布处理负载，从而提升性能和可靠性。该配置利用环境变量在容器更新、重建或重新部署之间管理连接，实现无缝连接。

## Docker Run

要使用 Docker 连接到多个 Ollama 实例，请使用以下示例命令：

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URLS="http://ollama-one:11434;http://ollama-two:11434" \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

此命令使用以下关键环境变量配置 Docker 容器：

- `OLLAMA_BASE_URLS`：指定每个 Ollama 实例的基本 URL，用分号 (`;`) 分隔。此示例使用两个实例，但您可以根据自己的设置进行调整。

确保两个 Ollama 实例版本相同，并且每个共享模型的标签相匹配。实例之间模型版本或标签的不一致可能会导致错误，因为 WebUI 如何对模型列表进行去重和合并。

## Docker Compose

对于那些喜欢使用 `docker-compose` 的人，以下是 `docker-compose.yaml` 文件的简化版本：

```yaml
services:
  open-webui:
    environment:
      - OLLAMA_BASE_URLS=http://ollama-one:11434;http://ollama-two:11434
```

要进一步简化此设置，您可以在与 `docker-compose.yaml` 相同目录中的 `.env` 文件中定义 `OLLAMA_BASE_URLS`。您的 `.env` 文件可能如下所示：

```
OLLAMA_BASE_URLS="http://ollama-one:11434;http://ollama-two:11434"
```

## 确保模型一致性

为了防止问题，两个 Ollama 实例必须运行相同版本和每个共享模型的相同标签。系统允许模型存在于一个服务器上而不是另一个服务器上，智能地将请求路由到包含请求模型的服务器。但是，跨实例对于相同模型标签的不同版本或哈希可能会导致不一致。

在 **设置 > 模型** 屏幕的服务器选择器下拉菜单旁边使用 `更新所有模型` 按钮，以在所有实例之间保持模型同步。

通过按照这些步骤，您可以有效地将计算负载分布到多个 Ollama 实例中，确保在 Open WebUI 中实现强大高效的部署。

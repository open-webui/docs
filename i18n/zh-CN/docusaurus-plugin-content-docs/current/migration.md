---
sidebar_position: 7
# title: "🔄 Migration"
title: "🔄 升级迁移"
---

# 从 Ollama WebUI 迁移到 Open WebUI

鉴于最近从 [Ollama WebUI 到 Open WebUI 的名称更改](https://github.com/open-webui/open-webui/discussions/602) ，docker 镜像已更名。对于之前使用 Ollama WebUI 并希望开始使用新镜像的人，需要额外的步骤来更新。

## 更新为 Open WebUI 但不保留数据

如果您想更新到新镜像但不想保留任何以前的数据，如对话、提示、文档等，您可以执行以下步骤：

:::danger

执行这些步骤将擦除所有当前的配置选项、聊天记录等。只有 LLM 模型将被保留

:::

```bash
docker rm -f ollama-webui
docker pull ghcr.io/open-webui/open-webui:main
[插入您用于安装的等效命令，新 Docker 镜像名称]
docker volume rm ollama-webui
```

例如，对于本地安装，它将是 `docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main`。有关其他安装命令，请查看此 README 文档的相关部分。

## 从 Ollama WebUI 迁移到 Open WebUI

如果您想更新到新镜像并迁移所有以前的设置，如对话、提示、文档等，您可以执行以下步骤：

```bash
docker rm -f ollama-webui
docker pull ghcr.io/open-webui/open-webui:main
# 创建一个新卷，并使用临时容器从一个卷复制到另一个卷，如 https://github.com/moby/moby/issues/31154#issuecomment-360531460
docker volume create --name open-webui
docker run --rm -v ollama-webui:/from -v open-webui:/to alpine ash -c "cd /from ; cp -av . /to"
[插入您用于安装的等效命令，新 Docker 镜像名称]
```

一旦您验证所有数据已迁移，您可以使用以下命令删除旧卷：

```bash
docker volume rm ollama-webui
```

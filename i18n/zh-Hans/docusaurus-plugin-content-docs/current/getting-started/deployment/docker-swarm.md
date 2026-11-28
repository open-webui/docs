---
slug: /deployment/docker-swarm
sidebar_position: 15
title: "Docker Swarm"
---

# Docker Swarm

此堆栈将 Open WebUI、ChromaDB 和 Ollama 作为三个服务部署到 Docker Swarm 中。本文假设你已经在运行 Swarm。

ChromaDB 作为独立的 HTTP 服务器运行，Open WebUI 通过 [`CHROMA_HTTP_HOST`](/reference/env-configuration#chroma_http_host) 访问它。默认的本地 ChromaDB 无法由多个工作进程或副本共享。将 `openWebUI` 服务扩展到多个副本之前，还需改用 PostgreSQL、Redis 和共享文件存储；请参阅[扩展 Open WebUI](/getting-started/advanced-topics/scaling)。

`chromadb/chroma` 镜像固定为 Open WebUI 镜像内 `chromadb` 客户端对应的版本，因为 1.x 客户端仅支持 v2 API。更新其中任意一个时，请保持两者的版本匹配。1.x 服务器将数据存储在 `/data` 下。Open WebUI 的**重置向量存储/知识库（Reset Vector Storage/Knowledge）**和**重置上传目录（Reset Upload Directory）**操作会调用 Chroma 的重置端点；除非在挂载到 `/config.yaml` 的配置文件中设置 `allow_reset: true`，否则 1.x 服务器会拒绝该请求（请参阅 [Chroma 的 Docker 指南](https://docs.trychroma.com/guides/deploy/docker)）。

嵌入在 Ollama 中运行，因此 Open WebUI 容器不会加载本地嵌入模型。堆栈启动后，使用 `docker exec <ollama-container> ollama pull nomic-embed-text` 拉取一次模型。

在 `docker-stack.yaml` 旁创建数据目录：

```bash
mkdir -p data/open-webui data/chromadb data/ollama
```

#### Docker-stack.yaml {#docker-stackyaml}

```yaml title="docker-stack.yaml"
services:
  openWebUI:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - ./data/open-webui:/app/backend/data
    environment:
      WEBUI_SECRET_KEY: your-secret-key
      OLLAMA_BASE_URL: http://ollama:11434
      VECTOR_DB: chroma
      CHROMA_HTTP_HOST: chromadb
      CHROMA_HTTP_PORT: 8000
      RAG_EMBEDDING_ENGINE: ollama
      RAG_EMBEDDING_MODEL: nomic-embed-text
    ports:
      - target: 8080
        published: 8080
    deploy:
      replicas: 1
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3

  chromadb:
    image: chromadb/chroma:1.5.9
    volumes:
      - ./data/chromadb:/data
    deploy:
      replicas: 1
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ./data/ollama:/root/.ollama
    deploy:
      replicas: 1
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
      resources:
        reservations:
          generic_resources:
            - discrete_resource_spec:
                kind: "NVIDIA-GPU"
                value: 0
```

将 `your-secret-key` 替换为 `openssl rand -hex 32` 的输出。服务通过堆栈网络上的服务名称相互访问，因此只有 Open WebUI 发布端口。`./data/...` 之类的绑定挂载仅存在于任务所在的节点上，因此请使用放置约束将服务固定到一个节点，或者使用所有节点均可访问的卷。

**GPU：** `generic_resources` 块适用于 GPU 节点。它需要 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)，并要求每个 GPU 节点都公布 GPU 资源：在 `/etc/nvidia-container-runtime/config.toml` 中取消注释 `swarm-resource = "DOCKER_RESOURCE_GPU"`，然后重启 Docker 守护进程。请参阅[为 GPU 配置 Docker Swarm](https://gist.github.com/tomlankhorst/33da3c4b9edbde5c83fc1244f010815c#configuring-docker-to-work-with-your-gpus)。

**仅使用 CPU：** 从 `ollama` 服务中删除 `resources:` 块。

部署堆栈：

```bash
docker stack deploy -c docker-stack.yaml -d open-webui
```

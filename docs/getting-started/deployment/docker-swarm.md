---
slug: /deployment/docker-swarm
sidebar_position: 15
title: "Docker Swarm"
---

# Docker Swarm

This stack deploys Open WebUI, ChromaDB and Ollama as three services in a Docker Swarm. It assumes you already run a Swarm.

ChromaDB runs as its own HTTP server, which Open WebUI reaches through [`CHROMA_HTTP_HOST`](/reference/env-configuration#chroma_http_host). The default local ChromaDB cannot be shared by several workers or replicas. Before scaling the `openWebUI` service past one replica, also move to PostgreSQL, Redis and shared file storage; see [Scaling Open WebUI](/getting-started/advanced-topics/scaling).

The `chromadb/chroma` image is pinned to the version of the `chromadb` client inside the Open WebUI image, because a 1.x client only speaks the v2 API. Keep the two versions matched when you update either. The 1.x server stores its data under `/data`. Open WebUI's **Reset Vector Storage/Knowledge** and **Reset Upload Directory** actions call Chroma's reset endpoint, which the 1.x server refuses unless `allow_reset: true` is set in a config file mounted at `/config.yaml` (see [Chroma's Docker guide](https://docs.trychroma.com/guides/deploy/docker)).

Embeddings run in Ollama, so the Open WebUI container loads no local embedding model. Pull the model once the stack is up with `docker exec <ollama-container> ollama pull nomic-embed-text`.

Create the data directories next to `docker-stack.yaml`:

```bash
mkdir -p data/open-webui data/chromadb data/ollama
```

#### Docker-stack.yaml

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

Replace `your-secret-key` with the output of `openssl rand -hex 32`. Services reach each other by service name on the stack's network, so only Open WebUI publishes a port. Bind mounts like `./data/...` exist only on the node where the task runs, so pin the services to one node with a placement constraint, or use volumes every node can reach.

**GPU:** the `generic_resources` block is for GPU nodes. It needs the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) and GPU resource advertising on every GPU node: uncomment `swarm-resource = "DOCKER_RESOURCE_GPU"` in `/etc/nvidia-container-runtime/config.toml` and restart the Docker daemon. See [configuring Docker Swarm for GPUs](https://gist.github.com/tomlankhorst/33da3c4b9edbde5c83fc1244f010815c#configuring-docker-to-work-with-your-gpus).

**CPU only:** delete the `resources:` block from the `ollama` service.

Deploy the stack:

```bash
docker stack deploy -c docker-stack.yaml -d open-webui
```

---
sidebar_position: 2
title: "使用 Docker 运行 Kokoro-FastAPI"
---

:::warning

本教程是社区贡献内容，不受 Open WebUI 团队支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 什么是 `Kokoro-FastAPI`？ {#what-is-kokoro-fastapi}

[Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) 是 [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) 文本转语音模型的 Docker 化 FastAPI 封装，实现了 OpenAI API 终结点规范。它提供高性能文本转语音，生成速度令人印象深刻。

## 主要功能 {#key-features}

- 兼容 OpenAI 的 Speech 终结点，支持内联语音组合
- NVIDIA GPU 加速或 CPU Onnx 推理
- 支持流式传输和可变分块
- 支持多种音频格式（`.mp3`、`.wav`、`.opus`、`.flac`、`.aac`、`.pcm`）
- 在 localhost:8880/web 提供集成 Web 界面（或在仓库中通过额外容器提供 Gradio 界面）
- 提供用于转换和生成的音素终结点

## 语音 {#voices}

- af
- af_bella
- af_irulan
- af_nicole
- af_sarah
- af_sky
- am_adam
- am_michael
- am_gurney
- bf_emma
- bf_isabella
- bm_george
- bm_lewis

## 语言 {#languages}

- en_us
- en_uk

## 前提条件 {#requirements}

- 系统已安装 Docker
- Open WebUI 正在运行
- GPU 支持：配备 CUDA 12.3 的 NVIDIA GPU
- 仅使用 CPU：无特殊要求

## 快速开始 {#quick-start}

### 可以选择 GPU 或 CPU 版本 {#you-can-choose-between-gpu-or-cpu-versions}

### GPU 版本（需要配备 CUDA 12.8 的 NVIDIA GPU） {#gpu-version-requires-nvidia-gpu-with-cuda-128}

使用 docker run：

```bash
docker run --gpus all -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-gpu
```

或者使用 docker compose：创建一个 `docker-compose.yml` 文件并运行 `docker compose up`。例如：

```yaml
name: kokoro
services:
    kokoro-fastapi-gpu:
        ports:
            - 8880:8880
        image: ghcr.io/remsky/kokoro-fastapi-gpu:v0.2.1
        restart: always
        deploy:
            resources:
                reservations:
                    devices:
                        - driver: nvidia
                          count: all
                          capabilities:
                              - gpu
```

:::info

可能需要安装并配置 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

:::

### CPU 版本（ONNX 优化推理） {#cpu-version-onnx-optimized-inference}

使用 docker run：

```bash
docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-cpu
```

使用 docker compose：

```yaml
name: kokoro
services:
    kokoro-fastapi-cpu:
        ports:
            - 8880:8880
        image: ghcr.io/remsky/kokoro-fastapi-cpu
        restart: always
```

## 设置 Open WebUI 以使用 `Kokoro-FastAPI` {#setting-up-open-webui-to-use-kokoro-fastapi}

要在 Open WebUI 中使用 Kokoro-FastAPI，请按以下步骤操作：

- 前往 `Settings` -> `Audio`（管理区域）
- 将 TTS 设置配置为以下内容：
- - 文本转语音引擎：OpenAI
  - API 基础 URL：`http://localhost:8880/v1` # 可能需要使用 `host.docker.internal` 代替 `localhost`
  - API 密钥：`not-needed`
  - TTS 语音：`af_bella` # 也接受现有 OAI 语音的映射以保持兼容
  - TTS 模型：`kokoro`

:::info

默认 API 密钥是字符串 `not-needed`。如果不需要额外的安全性，则无需更改此值。

:::

## 构建 Docker 容器 {#building-the-docker-container}

```bash
git clone https://github.com/remsky/Kokoro-FastAPI.git
cd Kokoro-FastAPI
cd docker/cpu # 或 docker/gpu
docker compose up --build
```

**就是这样！**

有关构建 Docker 容器的更多信息（包括更改端口），请参阅 [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) 仓库。

## 故障排除 {#troubleshooting}

### 未检测到 NVIDIA GPU {#nvidia-gpu-not-detected}

如果 GPU 版本未使用你的 GPU：

1. **安装 NVIDIA Container Toolkit：**
   ```bash
   # Ubuntu/Debian
   distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
   curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
   curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
   sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
   sudo systemctl restart docker
   ```

2. **验证 GPU 访问：**
   ```bash
   docker run --rm --gpus all nvidia/cuda:12.2.0-base nvidia-smi
   ```

### Open WebUI 的连接问题 {#connection-issues-from-open-webui}

如果 Open WebUI 无法访问 Kokoro，通常是 Docker 网络问题。请选择与你的部署方式匹配的方法：

**选项 1，Docker Desktop（Windows/Mac）：**

使用 `host.docker.internal` 代替 `localhost`：http://host.docker.internal:8880/v1

**选项 2，Docker Compose（同一网络）：**

直接使用服务名称：http://kokoro-fastapi-gpu:8880/v1

**选项 3，Docker 网络（Linux 推荐）：**

如果 `host.docker.internal` 不起作用，请创建共享 Docker 网络：

```bash
# 创建 Docker 网络
docker network create local-llm

# 将两个容器都连接到该网络
docker network connect local-llm open-webui
docker network connect local-llm kokoro-fastapi

# 重启两个容器
docker restart open-webui kokoro-fastapi
```

然后将 API 基础 URL 设置为 `http://kokoro-fastapi:8880/v1`

- 验证服务是否正在运行：`curl http://localhost:8880/health`

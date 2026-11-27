---
sidebar_position: 3
title: "Chatterbox TTS：语音克隆"
---

# Chatterbox TTS：语音克隆

:::warning

本教程是社区贡献内容，不受 Open WebUI 团队支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 什么是 `Chatterbox TTS API`？ {#what-is-chatterbox-tts-api}

[Chatterbox TTS API](https://github.com/travisvn/chatterbox-tts-api) 是一个支持语音克隆和文本转语音的 API 封装，可直接替代 OpenAI Speech API 终结点。

[![Resemble AI 语音示例链接](https://img.shields.io/badge/listen-demo_samples-blue)](https://resemble-ai.github.io/chatterbox_demopage/)

## 主要功能 {#key-features}

- 零样本语音克隆：只需任意语音约 10 秒的样本
- [表现优于 ElevenLabs](https://podonos.com/resembleai/chatterbox)
- 输出带水印，支持负责任的语音克隆
- 0.5B Llama 骨干网络
- 自定义语音库管理
- 支持流式传输，生成速度快
- 高级内存管理和自动清理
- 可选前端，便于管理和使用

### 硬件建议 {#hardware-recommendations}

- 内存：最低 4GB，建议 8GB 以上
- GPU：CUDA（Nvidia）、Apple M 系列（MPS）
- CPU：可以工作，但速度较慢；生产环境建议使用 GPU

:::info

Chatterbox 可能占用大量内存，其硬件要求可能高于你习惯使用的其他本地 TTS 解决方案。如果难以满足要求，可以考虑使用 [OpenAI Edge TTS](/features/chat-conversations/audio/text-to-speech/openai-edge-tts-integration) 或 [Kokoro-FastAPI](/features/chat-conversations/audio/text-to-speech/Kokoro-FastAPI-integration) 作为合适的替代方案。

:::

## 快速开始 {#quick-start}

### 使用 Python {#using-python}

#### 选项 A：使用 uv（推荐，速度更快、依赖处理更好） {#option-a-using-uv-recommended-faster--better-dependencies}

```bash

# 克隆仓库
git clone https://github.com/travisvn/chatterbox-tts-api
cd chatterbox-tts-api

# 如果尚未安装 uv，请先安装
curl -LsSf https://astral.sh/uv/install.sh | sh

# 使用 uv 安装依赖（自动创建 venv）
uv sync

# 复制并自定义环境变量
cp .env.example .env

# 使用 FastAPI 启动 API
uv run uvicorn app.main:app --host 0.0.0.0 --port 4123

# 或使用主脚本
uv run main.py
```

> **为什么使用 uv？** 用户报告它与 `chatterbox-tts` 的兼容性更好，安装速度快 25-40%，依赖解析能力也更出色。[请参阅迁移指南 →](https://github.com/travisvn/chatterbox-tts-api/blob/main/docs/UV_MIGRATION.md)

#### 选项 B：使用 pip（传统方式） {#option-b-using-pip-traditional}

```bash

# 克隆仓库
git clone https://github.com/travisvn/chatterbox-tts-api
cd chatterbox-tts-api

# 设置环境——使用 Python 3.11
python -m venv .venv
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制并自定义环境变量
cp .env.example .env

# 添加你的语音样本（或使用提供的样本）

# cp your-voice.mp3 voice-sample.mp3

# 使用 FastAPI 启动 API
uvicorn app.main:app --host 0.0.0.0 --port 4123

# 或使用主脚本
python main.py
```

> 遇到问题？请查看[故障排除部分](https://github.com/travisvn/chatterbox-tts-api?tab=readme-ov-file#common-issues)

### Docker（推荐） {#docker-recommended}

```bash

# 克隆并使用 Docker Compose 启动
git clone https://github.com/travisvn/chatterbox-tts-api
cd chatterbox-tts-api

# 使用针对 Docker 优化的环境变量
cp .env.example.docker .env  # Docker 专用路径，可直接使用

# 或：cp .env.example .env    # 本地开发路径，需要自定义

# 选择部署方式：

# 仅 API（默认）
docker compose -f docker/docker-compose.yml up -d             # 标准方式（基于 pip）
docker compose -f docker/docker-compose.uv.yml up -d          # uv 优化（构建更快）
docker compose -f docker/docker-compose.gpu.yml up -d         # 标准方式 + GPU
docker compose -f docker/docker-compose.uv.gpu.yml up -d      # uv + GPU（GPU 用户推荐）
docker compose -f docker/docker-compose.cpu.yml up -d         # 仅 CPU

# API + 前端（在上述任意命令中添加 --profile frontend）
docker compose -f docker/docker-compose.yml --profile frontend up -d             # 标准方式 + 前端
docker compose -f docker/docker-compose.gpu.yml --profile frontend up -d         # GPU + 前端
docker compose -f docker/docker-compose.uv.gpu.yml --profile frontend up -d      # uv + GPU + 前端

# 查看初始化日志（首次使用 TTS 耗时最长）
docker logs chatterbox-tts-api -f

# 测试 API
curl -X POST http://localhost:4123/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello from Chatterbox TTS!"}' \
  --output test.wav
```

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>**使用前端界面运行**</summary>

本项目包含一个基于 React 的可选 Web UI。使用 Docker Compose profiles 即可轻松启用或停用前端：

<h3 id="with-docker-compose-profiles">使用 Docker Compose Profiles</h3>

```bash

# 仅 API（默认行为）
docker compose -f docker/docker-compose.yml up -d

# API + 前端 + Web UI（使用 --profile frontend）
docker compose -f docker/docker-compose.yml --profile frontend up -d

# 或使用便捷的全栈辅助脚本：
python start.py fullstack

# 同样的模式适用于所有部署变体：
docker compose -f docker/docker-compose.gpu.yml --profile frontend up -d    # GPU + 前端
docker compose -f docker/docker-compose.uv.yml --profile frontend up -d     # uv + 前端
docker compose -f docker/docker-compose.cpu.yml --profile frontend up -d    # CPU + 前端
```

<h3 id="local-development">本地开发</h3>

进行本地开发时，可以分别运行 API 和前端：

```bash

# 先启动 API（按照前面的说明操作）

# 然后运行前端：
cd frontend && npm install && npm run dev
```

> **注意：**如果遇到依赖问题，请尝试运行 `npm install --force`，而不只是 `npm install`。

点击 Vite 提供的链接即可访问 Web UI。

<h3 id="build-for-production">构建生产版本</h3>

构建用于生产部署的前端：

```bash
cd frontend && npm install && npm run build
```

> **注意：**如果构建因依赖冲突而失败，请尝试使用 `npm install --force`。

随后可直接从本地文件系统的 `/dist/index.html` 访问它。

<h3 id="port-configuration">端口配置</h3>

- **仅 API**：通过 `http://localhost:4123` 访问（直接访问 API）
- **带前端**：Web UI 位于 `http://localhost:4321`，API 请求通过代理路由

前端使用反向代理转发请求，因此使用 `--profile frontend` 运行时，Web 界面将在 `http://localhost:4321` 提供，而 API 在代理后运行。

</details>

## 设置 Open WebUI 以使用 `Chatterbox TTS API` {#setting-up-open-webui-to-use-chatterbox-tts-api}

建议运行前端界面，这样在配置 Open WebUI 设置之前，就可以上传要使用的语音音频文件。如果启动正确（请参阅上面的指南），可访问 `http://localhost:4321` 打开前端。

要在 Open WebUI 中使用 Chatterbox TTS API，请按以下步骤操作：

- 前往 `Settings` -> `Audio`（管理区域）
- 将 TTS 设置配置为以下内容：
- - 文本转语音引擎：OpenAI
  - API 基础 URL：`http://localhost:4123/v1` # 也可以尝试 `http://host.docker.internal:4123/v1`
  - API 密钥：`none`
  - TTS 模型：`tts-1` 或 `tts-1-hd`
  - TTS 语音：已克隆语音的名称（也可以包含前端中定义的别名）
  - 响应拆分：`Paragraphs`

:::info

默认 API 密钥是字符串 `none`（无需 API 密钥）

:::

![为此项目添加正确终结点的 Open WebUI 管理员音频设置截图](https://lm17s1uz51.ufs.sh/f/EsgO8cDHBTOUjUe3QjHytHQ0xqn2CishmXgGfeJ4o983TUMO)

## 请为 [GitHub 仓库](https://github.com/travisvn/chatterbox-tts-api)点星，以支持开发 {#please-star-the-repo-on-github-to-support-development}

## 需要帮助？ {#need-help}

首次运行 Chatterbox 可能具有挑战性；如果某种安装方式遇到问题，可以尝试其他安装选项。

有关 `chatterbox-tts-api` 的更多信息，请访问 [GitHub 仓库](https://github.com/travisvn/chatterbox-tts-api)。

- **文档**：请参阅 [API 文档](https://github.com/travisvn/chatterbox-tts-api/blob/main/docs/API_README.md)和 [Docker 指南](https://github.com/travisvn/chatterbox-tts-api/blob/main/docs/DOCKER_README.md)
- **Discord**：[加入本项目的 Discord](http://chatterboxtts.com/discord)

## 故障排除 {#troubleshooting}

### 内存要求 {#memory-requirements}

Chatterbox 的内存要求高于其他 TTS 解决方案：
- **最低：**4GB 内存
- **建议：**8GB 以上内存
- **GPU：**建议使用 NVIDIA CUDA 或 Apple M 系列（MPS）

如果遇到内存问题，请考虑使用更轻量的替代方案，例如 [OpenAI Edge TTS](/features/chat-conversations/audio/text-to-speech/openai-edge-tts-integration) 或 [Kokoro-FastAPI](/features/chat-conversations/audio/text-to-speech/Kokoro-FastAPI-integration)。

### Docker 网络 {#docker-networking}

如果 Open WebUI 无法连接 Chatterbox：

- **Docker Desktop：**使用 `http://host.docker.internal:4123/v1`
- **Docker Compose：**使用 `http://chatterbox-tts-api:4123/v1`
- **Linux：**使用宿主机的 IP 地址

### 首次启动 {#first-time-startup}

首次 TTS 请求会因模型加载而耗时明显更长。使用以下命令检查日志：
```bash
docker logs chatterbox-tts-api -f
```

有关更多故障排除技巧，请参阅[音频故障排除指南](/troubleshooting/audio)。

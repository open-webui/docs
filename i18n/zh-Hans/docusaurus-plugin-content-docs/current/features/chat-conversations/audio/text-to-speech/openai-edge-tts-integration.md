---
sidebar_position: 1
title: "使用 Docker 运行 Edge TTS"
---

:::warning

本教程是社区贡献内容，不受 Open WebUI 团队支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

# 将 `openai-edge-tts` 与 Open WebUI 集成

## 什么是 `openai-edge-tts`？ {#what-is-openai-edge-tts}

[OpenAI Edge TTS](https://github.com/travisvn/openai-edge-tts) 是一个模拟 OpenAI API 终结点的文本转语音 API，在 Open WebUI 等可以自定义终结点 URL 的场景中，可直接用作替代方案。

它使用 [edge-tts](https://github.com/rany2/edge-tts) 软件包，利用 Edge 浏览器免费的“大声朗读”功能模拟向 Microsoft / Azure 发出的请求，从而免费获得极高质量的文本转语音服务。

[试听语音](https://tts.travisvn.com)

<!-- markdownlint-disable-next-line MD033 -->
<details>
  <!-- markdownlint-disable-next-line MD033 -->
<summary>它与“openedai-speech”有何不同？</summary>

与 [openedai-speech](https://github.com/matatonic/openedai-speech) 类似，[openai-edge-tts](https://github.com/travisvn/openai-edge-tts) 是一个模拟 OpenAI API 终结点的文本转语音 API 终结点；在可以调用 OpenAI Speech 终结点并配置服务器终结点 URL 的场景中，可直接用作替代方案。

`openedai-speech` 是一个更全面的选项，支持完全离线生成语音，并提供多种模态可供选择。

`openai-edge-tts` 是一个更简单的选项，使用名为 `edge-tts` 的 Python 软件包生成音频。

</details>

## 前提条件 {#requirements}

- 系统已安装 Docker
- Open WebUI 正在运行

## 快速开始 {#quick-start}

无需进行任何配置，最简单的入门方式是运行以下命令

```bash
docker run -d -p 5050:5050 travisvn/openai-edge-tts:latest
```

这将在端口 5050 上使用所有默认配置运行该服务

## 设置 Open WebUI 以使用 `openai-edge-tts` {#setting-up-open-webui-to-use-openai-edge-tts}

- 前往 `Settings` -> `Audio`（管理区域）
- 将 TTS 设置配置为与下方截图一致
- *注意：可在此处指定 TTS 语音*

![为此项目添加正确终结点的 Open WebUI 管理员音频设置截图](https://utfs.io/f/MMMHiQ1TQaBobmOhsMkrO6Tl2kxX39dbuFiQ8cAoNzysIt7f)

:::info

默认 API 密钥是字符串 `your_api_key_here`。如果不需要额外的安全性，则无需更改此值。

:::

**就是这样！你可以到此为止**

## 如果觉得 [OpenAI Edge TTS](https://github.com/travisvn/openai-edge-tts) 有用，请为 GitHub 仓库点星 {#please-star-the-repo-on-github-if-you-find-openai-edge-tts-useful}

<!-- markdownlint-disable-next-line MD033 -->
<details>
  <!-- markdownlint-disable-next-line MD033 -->
<summary>使用 Python 运行</summary>

<h3 id="running-with-python">使用 Python 运行</h3>

如果希望直接使用 Python 运行此项目，请按照以下步骤设置虚拟环境、安装依赖并启动服务器。

<h4 id="1-clone-the-repository">1. 克隆仓库</h4>

```bash
git clone https://github.com/travisvn/openai-edge-tts.git
cd openai-edge-tts
```

<h4 id="2-set-up-a-virtual-environment">2. 设置虚拟环境</h4>

创建并激活虚拟环境以隔离依赖：

```bash

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

<h4 id="3-install-dependencies">3. 安装依赖</h4>

使用 `pip` 安装 `requirements.txt` 中列出的必需软件包：

```bash
pip install -r requirements.txt
```

<h4 id="4-configure-environment-variables">4. 配置环境变量</h4>

在根目录中创建一个 `.env` 文件，并设置以下变量：

```plaintext
API_KEY=your_api_key_here
PORT=5050

DEFAULT_VOICE=en-US-AvaNeural
DEFAULT_RESPONSE_FORMAT=mp3
DEFAULT_SPEED=1.0

DEFAULT_LANGUAGE=en-US

REQUIRE_API_KEY=True
REMOVE_FILTER=False
EXPAND_API=True
```

<h4 id="5-run-the-server">5. 运行服务器</h4>

配置完成后，使用以下命令启动服务器：

```bash
python app/server.py
```

服务器将在 `http://localhost:5050` 开始运行。

<h4 id="6-test-the-api">6. 测试 API</h4>

现在可以与 `http://localhost:5050/v1/audio/speech` 及其他可用终结点交互。请求示例请参阅“用法”部分。

</details>

<!-- markdownlint-disable-next-line MD033 -->
<details>
  <!-- markdownlint-disable-next-line MD033 -->
<summary>用法详情</summary>

<h5 id="endpoint-v1audiospeech-aliased-with-audiospeech">终结点：<code>/v1/audio/speech</code>（别名为 <code>/audio/speech</code>）</h5>

根据输入文本生成音频。可用参数：

**必需参数：**

- **input**（字符串）：要转换为音频的文本（最多 4096 个字符）。

**可选参数：**

- **model**（字符串）：设置为 "tts-1" 或 "tts-1-hd"（默认值：`"tts-1"`）。
- **voice**（字符串）：任一兼容 OpenAI 的语音（alloy、echo、fable、onyx、nova、shimmer），或任何有效的 `edge-tts` 语音（默认值：`"en-US-AvaNeural"`）。
- **response_format**（字符串）：音频格式。选项：`mp3`、`opus`、`aac`、`flac`、`wav`、`pcm`（默认值：`mp3`）。
- **speed**（数字）：播放速度（0.25 至 4.0）。默认值为 `1.0`。

:::tip

可在 [tts.travisvn.com](https://tts.travisvn.com) 浏览可用语音并试听示例

:::

使用 `curl` 并将输出保存为 mp3 文件的请求示例：

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "input": "Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.",
    "voice": "echo",
    "response_format": "mp3",
    "speed": 1.0
  }' \
  --output speech.mp3
```

或者，按照 OpenAI API 终结点参数的格式：

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "tts-1",
    "input": "Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

以下是一个使用非英语语言的示例：

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "tts-1",
    "input": "じゃあ、行く。電車の時間、調べておくよ。",
    "voice": "ja-JP-KeitaNeural"
  }' \
  --output speech.mp3
```

<h5 id="additional-endpoints">其他终结点</h5>

- **POST/GET /v1/models**：列出可用的 TTS 模型。
- **POST/GET /v1/voices**：列出给定语言或区域设置的 `edge-tts` 语音。
- **POST/GET /v1/voices/all**：列出所有 `edge-tts` 语音及其语言支持信息。

:::info

`/v1` 现在是可选的。

Open WebUI 还接受 **Azure AI Speech** 的自定义终结点（`AUDIO_TTS_AZURE_SPEECH_BASE_URL`，即终结点 URL 字段）和 **ElevenLabs** 的自定义终结点（`ELEVENLABS_API_BASE_URL`，仅环境变量），因此这些引擎也可以指向兼容的服务器。

将环境变量设置为 `EXPAND_API=False` 可禁用这些终结点。

:::

</details>

## Docker 快速配置 {#quick-config-for-docker}

可以在运行项目的命令中配置环境变量

```bash
docker run -d -p 5050:5050 \
  -e API_KEY=your_api_key_here \
  -e PORT=5050 \
  -e DEFAULT_VOICE=en-US-AvaNeural \
  -e DEFAULT_RESPONSE_FORMAT=mp3 \
  -e DEFAULT_SPEED=1.0 \
  -e DEFAULT_LANGUAGE=en-US \
  -e REQUIRE_API_KEY=True \
  -e REMOVE_FILTER=False \
  -e EXPAND_API=True \
  travisvn/openai-edge-tts:latest
```

:::note

Markdown 文本现在会经过过滤器处理，以增强可读性和支持范围。

将环境变量设置为 `REMOVE_FILTER=True` 可禁用此功能。

:::

## 其他资源 {#additional-resources}

有关 `openai-edge-tts` 的更多信息，可访问 [GitHub 仓库](https://github.com/travisvn/openai-edge-tts)

如需直接支持，可访问 [Voice AI & TTS Discord](https://tts.travisvn.com/discord)

## 语音示例 {#voice-samples}

[播放语音示例并查看所有可用的 Edge TTS 语音](https://tts.travisvn.com/)

## 故障排除 {#troubleshooting}

### 连接问题 {#connection-issues}

#### “localhost”在 Docker 中不起作用 {#localhost-not-working-from-docker}

如果 Open WebUI 在 Docker 中运行，并且无法通过 `localhost:5050` 访问 TTS 服务：

**解决方案：**
- 使用 `host.docker.internal:5050` 代替 `localhost:5050`（Windows/Mac 上的 Docker Desktop）
- 在 Linux 上，使用宿主机的 IP 地址，或在 Docker run 命令中添加 `--network host`
- 如果两个服务都在 Docker Compose 中，使用容器名称：`http://openai-edge-tts:5050/v1`

**两个服务位于同一网络的 Docker Compose 示例：**

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=http://openai-edge-tts:5050/v1
      - AUDIO_TTS_OPENAI_API_KEY=your_api_key_here
    networks:
      - webui-network

  openai-edge-tts:
    image: travisvn/openai-edge-tts:latest
    ports:
      - "5050:5050"
    environment:
      - API_KEY=your_api_key_here
    networks:
      - webui-network

networks:
  webui-network:
    driver: bridge
```

#### 测试 TTS 服务 {#testing-the-tts-service}

独立验证 TTS 服务是否正常工作：

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{"input": "Test message", "voice": "alloy"}' \
  --output test.mp3
```

如果此命令有效，但 Open WebUI 仍无法连接，则问题与容器之间的网络有关。

### Open WebUI 中没有音频输出 {#no-audio-output-in-open-webui}

1. 检查 API 基础 URL 是否以 `/v1` 结尾
2. 验证两个服务的 API 密钥是否匹配（或移除密钥要求）
3. 检查 Open WebUI 容器日志：`docker logs open-webui`
4. 检查 openai-edge-tts 日志：`docker logs openai-edge-tts`（或你的容器名称）

有关更多故障排除技巧，请参阅[音频故障排除指南](/troubleshooting/audio)。

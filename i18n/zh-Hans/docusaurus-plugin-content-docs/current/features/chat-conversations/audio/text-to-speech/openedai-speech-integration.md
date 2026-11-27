---
sidebar_position: 2
title: "使用 Docker 运行 Openedai-speech"
---

:::warning

本教程是社区贡献内容，不受 Open WebUI 团队支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 使用 Docker 将 `openedai-speech` 集成到 Open WebUI {#integrating-openedai-speech-into-open-webui-using-docker}

## 什么是 `openedai-speech`？ {#what-is-openedai-speech}

:::info

[openedai-speech](https://github.com/matatonic/openedai-speech) 是一个兼容 OpenAI 音频/语音 API 的文本转语音服务器。

它提供 `/v1/audio/speech` 终结点，并通过自定义语音克隆功能提供免费、私密的文本转语音体验。此服务与 OpenAI 没有任何关联，也不需要 OpenAI API 密钥。

:::

## 前提条件 {#requirements}

- 系统已安装 Docker
- Open WebUI 正在 Docker 容器中运行
- 对 Docker 和 Docker Compose 有基本了解

## 选项 1：使用 Docker Compose {#option-1-using-docker-compose}

## 步骤 1：为 `openedai-speech` 服务创建新文件夹 {#step-1-create-a-new-folder-for-the-openedai-speech-service}

创建一个新文件夹（例如 `openedai-speech-service`），用于存放 `docker-compose.yml` 和 `speech.env` 文件。

## 步骤 2：从 GitHub 克隆 `openedai-speech` 仓库 {#step-2-clone-the-openedai-speech-repository-from-github}

```bash
git clone https://github.com/matatonic/openedai-speech.git
```

这会将 `openedai-speech` 仓库下载到本地计算机，其中包括 Docker Compose 文件（`docker-compose.yml`、`docker-compose.min.yml` 和 `docker-compose.rocm.yml`）及其他必需文件。

## 步骤 3：将 `sample.env` 文件重命名为 `speech.env`（可按需自定义） {#step-3-rename-the-sampleenv-file-to-speechenv-customize-if-needed}

在 `openedai-speech` 仓库文件夹中，创建一个名为 `speech.env` 的新文件，内容如下：

```yaml
TTS_HOME=voices
HF_HOME=voices

#PRELOAD_MODEL=xtts

#PRELOAD_MODEL=xtts_v2.0.2

#PRELOAD_MODEL=parler-tts/parler_tts_mini_v0.1

#EXTRA_ARGS=--log-level DEBUG --unload-timer 300

#USE_ROCM=1
```

## 步骤 4：选择 Docker Compose 文件 {#step-4-choose-a-docker-compose-file}

可以使用以下任意 Docker Compose 文件：

- [docker-compose.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.yml)：此文件使用 `ghcr.io/matatonic/openedai-speech` 镜像，并从 [Dockerfile](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile) 构建。
- [docker-compose.min.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.min.yml)：此文件使用 `ghcr.io/matatonic/openedai-speech-min` 镜像，并从 [Dockerfile.min](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile.min) 构建。
  此镜像是仅包含 Piper 支持的精简版本，不需要 GPU。
- [docker-compose.rocm.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.rocm.yml)：此文件使用 `ghcr.io/matatonic/openedai-speech-rocm` 镜像，并从支持 ROCm 的 [Dockerfile](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile) 构建。

## 步骤 4：构建所选的 Docker 镜像 {#step-4-build-the-chosen-docker-image}

运行 Docker Compose 文件之前，需要构建 Docker 镜像：

- **Nvidia GPU（CUDA 支持）**：

```bash
docker build -t ghcr.io/matatonic/openedai-speech .
```

- **AMD GPU（ROCm 支持）**：

```bash
docker build -f Dockerfile --build-arg USE_ROCM=1 -t ghcr.io/matatonic/openedai-speech-rocm .
```

- **仅 CPU，无 GPU（仅 Piper）**：

```bash
docker build -f Dockerfile.min -t ghcr.io/matatonic/openedai-speech-min .
```

## 步骤 5：运行正确的 `docker compose up -d` 命令 {#step-5-run-the-correct-docker-compose-up--d-command}

- **Nvidia GPU（CUDA 支持）**：运行以下命令，以分离模式启动 `openedai-speech` 服务：

```bash
docker compose up -d
```

- **AMD GPU（ROCm 支持）**：运行以下命令，以分离模式启动 `openedai-speech` 服务：

```bash
docker compose -f docker-compose.rocm.yml up -d
```

- **ARM64（Apple M 系列、Raspberry Pi）**：XTTS 在这些平台上仅支持 CPU，速度会非常慢。可以使用 Nvidia 镜像通过 CPU 运行 XTTS（速度较慢），也可以使用仅含 Piper 的镜像（推荐）：

```bash
docker compose -f docker-compose.min.yml up -d
```

- **仅 CPU，无 GPU（仅 Piper）**：使用仅支持 Piper 的精简 Docker 镜像（小于 1GB，而非 8GB）：

```bash
docker compose -f docker-compose.min.yml up -d
```

这将以分离模式启动 `openedai-speech` 服务。

## 选项 2：使用 Docker Run 命令 {#option-2-using-docker-run-commands}

也可以使用以下 Docker run 命令，以分离模式启动 `openedai-speech` 服务：

- **Nvidia GPU（CUDA）**：运行以下命令构建并启动 `openedai-speech` 服务：

```bash
docker build -t ghcr.io/matatonic/openedai-speech .
docker run -d --gpus=all -p 8000:8000 -v voices:/app/voices -v config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech
```

- **ROCm（AMD GPU）**：运行以下命令构建并启动 `openedai-speech` 服务：

> 要启用 ROCm 支持，请取消 `speech.env` 文件中 `#USE_ROCM=1` 行的注释。

```bash
docker build -f Dockerfile --build-arg USE_ROCM=1 -t ghcr.io/matatonic/openedai-speech-rocm .
docker run -d --privileged --init --name openedai-speech -p 8000:8000 -v voices:/app/voices -v config:/app/config ghcr.io/matatonic/openedai-speech-rocm
```

- **仅 CPU，无 GPU（仅 Piper）**：运行以下命令构建并启动 `openedai-speech` 服务：

```bash
docker build -f Dockerfile.min -t ghcr.io/matatonic/openedai-speech-min .
docker run -d -p 8000:8000 -v voices:/app/voices -v config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech-min
```

## 步骤 6：配置 Open WebUI 使用 `openedai-speech` 进行 TTS {#step-6-configuring-open-webui-to-use-openedai-speech-for-tts}

![openedai-tts](https://github.com/silentoplayz/docs/assets/50341825/ea08494f-2ebf-41a2-bb0f-9b48dd3ace79)

打开 Open WebUI 设置，前往**设置 > 音频**（管理区域）下的 TTS 设置。添加以下配置：

- **API 基础 URL**：`http://host.docker.internal:8000/v1`
- **API 密钥**：`sk-111111111`（注意，这是虚拟 API 密钥，因为 `openedai-speech` 不需要 API 密钥。此字段可以填写任意值，只要不为空即可。）

## 步骤 7：选择语音 {#step-7-choose-a-voice}

在管理员面板的同一音频设置菜单中的 `TTS Voice` 下，可以从下面列出的 `openedai-speech` 支持的选项中设置要使用的 `TTS Model`。这些模型的语音针对英语进行了优化。

- `tts-1` 或 `tts-1-hd`：`alloy`、`echo`、`echo-alt`、`fable`、`onyx`、`nova` 和 `shimmer`（`tts-1-hd` 可配置；默认使用 OpenAI 样本）

## 步骤 8：点击 `Save` 应用更改，开始享受自然动听的语音 {#step-8-press-save-to-apply-the-changes-and-start-enjoying-naturally-sounding-voices}

点击 `Save` 按钮，将更改应用到 Open WebUI 设置。刷新页面使更改完全生效，然后即可在 Open WebUI 中使用 `openedai-speech` 集成，以自然动听的声音通过文本转语音朗读文本回复。

## 模型详情 {#model-details}

`openedai-speech` 支持多种文本转语音模型，每种模型都有自身的优势和要求。可用模型如下：

- **Piper TTS**（速度非常快，在 CPU 上运行）：通过 `voice_to_speaker.yaml` 配置文件使用自己的 [Piper 语音](https://rhasspy.github.io/piper-samples/)。此模型非常适合需要低延迟和高性能的应用。Piper TTS 还支持[多语言](https://github.com/matatonic/openedai-speech#multilingual)语音。
- **Coqui AI/TTS XTTS v2**（速度快，但需要约 4GB GPU 显存和支持 CUDA 的 Nvidia GPU）：此模型使用 Coqui AI 的 XTTS v2 语音克隆技术生成高质量语音。虽然需要更强大的 GPU，但它能提供出色的性能和高质量音频。Coqui 也支持[多语言](https://github.com/matatonic/openedai-speech#multilingual)语音。
- **Beta Parler-TTS 支持**（实验性，速度较慢）：此模型使用 Parler-TTS 框架生成语音。虽然它目前处于 Beta 阶段，但可用于描述说话者声音的基本特征。每次生成的确切语音会略有不同，但应与提供的说话者描述相似。有关如何描述语音的灵感，请参阅 [Text Description to Speech](https://www.text-description-to-speech.com/)。

## 故障排除 {#troubleshooting}

如果在将 `openedai-speech` 与 Open WebUI 集成时遇到任何问题，请按以下故障排除步骤操作：

- **验证 `openedai-speech` 服务**：确保 `openedai-speech` 服务正在运行，并且 docker-compose.yml 文件中指定的端口已公开。
- **检查对 host.docker.internal 的访问**：确认 Open WebUI 容器内可以解析主机名 `host.docker.internal`。这是必需的，因为 `openedai-speech` 通过 PC 上的 `localhost` 公开，而 `open-webui` 通常无法从其容器内部访问该地址。可以在 `docker-compose.yml` 文件中添加卷，将宿主机上的文件挂载到容器中，例如挂载到将由 openedai-speech 提供服务的目录。
- **检查 API 密钥配置**：确保 API 密钥设置为虚拟值，或实际上不进行密钥检查，因为 `openedai-speech` 不需要 API 密钥。
- **检查语音配置**：确认尝试用于 TTS 的语音存在于 `voice_to_speaker.yaml` 文件中，并且对应文件（例如语音 XML 文件）位于正确目录中。
- **验证语音模型路径**：如果加载语音模型时遇到问题，请仔细检查 `voice_to_speaker.yaml` 文件中的路径是否与语音模型的实际位置一致。

## 其他故障排除技巧 {#additional-troubleshooting-tips}

- 检查 openedai-speech 日志中是否有错误或警告，以确定问题所在。
- 确认 `docker-compose.yml` 文件已针对你的环境正确配置。
- 如果仍遇到问题，请尝试重启 `openedai-speech` 服务或整个 Docker 环境。
- 如果问题仍然存在，请查阅 `openedai-speech` GitHub 仓库，或在相关社区论坛寻求帮助。

### GPU 内存问题（XTTS） {#gpu-memory-issues-xtts}

如果 XTTS 加载失败或导致内存不足错误：
- XTTS 需要约 4GB GPU 显存
- 考虑使用在 CPU 上运行的仅含 Piper 的精简镜像（`docker-compose.min.yml`）
- 启动容器前，减少其他 GPU 显存占用

### AMD GPU（ROCm）说明 {#amd-gpu-rocm-notes}

使用 AMD GPU 时：
1. 取消 `speech.env` 文件中 `USE_ROCM=1` 的注释
2. 使用 `docker-compose.rocm.yml` 文件
3. 确保宿主机已正确安装 ROCm 驱动程序

### ARM64 / Apple Silicon {#arm64--apple-silicon}

- XTTS 在 ARM64 上仅支持 CPU，速度会**非常慢**
- 在 ARM 设备上使用仅含 Piper 的镜像（`docker-compose.min.yml`）以获得可接受的性能
- Apple M 系列芯片可以工作，但使用精简镜像表现更好

### 容器网络 {#container-networking}

如果使用 Docker 网络：
```yaml
# 添加到你的 Docker Compose
networks:
  webui-network:
    driver: bridge
```

然后使用 `http://openedai-speech:8000/v1` 代替 `localhost`。

有关更多故障排除技巧，请参阅[音频故障排除指南](/troubleshooting/audio)。

## 常见问题 {#faq}

**如何控制生成音频的情感范围？**

没有直接控制生成音频情感输出的机制。大写或语法等某些因素可能会影响输出音频，但内部测试的结果并不一致。

**语音文件存储在哪里？配置文件呢？**。

用于定义可用语音及其属性的配置文件存储在 config 卷中。具体来说，默认语音在 voice_to_speaker.default.yaml 中定义。

## 其他资源 {#additional-resources}

有关配置 Open WebUI 以使用 `openedai-speech` 的更多信息（包括设置环境变量），请参阅 [Open WebUI 文档](/reference/env-configuration#text-to-speech)。

有关 `openedai-speech` 的更多信息，请访问 [GitHub 仓库](https://github.com/matatonic/openedai-speech)。

**如何向 openedai-speech 添加更多语音：**
[自定义语音操作指南](https://github.com/matatonic/openedai-speech?tab=readme-ov-file#custom-voices-howto)

:::note

可以将 `docker-compose.yml` 文件中的端口号更改为任何空闲且可用的端口，但请务必相应地更新 Open WebUI 管理员音频设置中的 **API 基础 URL**。

:::

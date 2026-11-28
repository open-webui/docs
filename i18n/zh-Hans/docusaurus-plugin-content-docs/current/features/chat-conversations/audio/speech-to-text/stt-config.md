---
sidebar_position: 1
title: "配置语音转文字"
sidebar_label: "配置"
description: "选择本地、浏览器或托管语音转文字引擎，配置音频设置，并在 Open WebUI 中通过听写输入提示词。"
---

使用语音转文字在 Open WebUI 中通过听写输入提示词。选择本地 Whisper、浏览器的语音识别或托管转录提供方，然后配置下面对应的管理员和用户设置。

![语音转文字设置](/images/tutorials/stt/image.png)

![语音转文字提供方](/images/tutorials/stt/stt-providers.png)

## 选择语音转文字提供方 {#cloud--remote-speech-to-text-providers}

支持以下语音转文字提供方：

| 服务 | 需要 API 密钥 | 指南 |
|---------|------------------|-------|
| 本地 Whisper（默认） | 否 | 内置，请参阅[环境变量](/features/chat-conversations/audio/speech-to-text/env-variables) |
| OpenAI（Whisper API） | 是 | [OpenAI STT 指南](/features/chat-conversations/audio/speech-to-text/openai-stt-integration) |
| 自托管（OpenAI 兼容） | 是 | [自托管 STT 指南](/features/chat-conversations/audio/speech-to-text/self-hosted-stt)（使用需要身份验证的服务器） |
| Mistral（Voxtral） | 是 | [Mistral Voxtral 指南](/features/chat-conversations/audio/speech-to-text/mistral-voxtral-integration) |
| Deepgram | 是 | 暂无 |
| Azure | 是 | [Azure AI Speech STT 指南](/features/chat-conversations/audio/speech-to-text/azure-stt-integration) |

**Web API** 通过浏览器内置的语音识别提供 STT（无需 API 密钥，在用户设置中配置）。

### 服务器端录音存储 {#server-side-recording-storage}

录音上传到 Open WebUI 转录终结点时，服务器会先将原始音频写入 `DATA_DIR/cache/audio/transcriptions`，再将其发送到所选引擎。处理完成后，终结点会保留该原始文件。在决定保留哪些音频以及如何保护数据卷及其备份时，请将此目录纳入考虑。浏览器语音识别不会通过此终结点发送录音。

## 配置 STT 提供方 {#configuring-your-stt-provider}

要配置语音转文字提供方：

- 进入管理员设置
- 选择“音频（Audio）”
- 提供 API 密钥，并从下拉菜单中选择模型

![语音转文字配置](/images/tutorials/stt/stt-config.png)

### 限制接受的音频扩展名 {#restricting-accepted-audio-extensions}

Open WebUI 维护一个允许的扩展名列表，用于控制上传终结点接受哪些音频文件扩展名（默认：`mp3,wav,m4a,webm,ogg,flac,mp4,mpga,mpeg`）。使用任何其他扩展名的上传都会在转录运行前被拒绝，并返回 `400 Invalid audio file extension`。

此检查在服务器端执行，作为 MIME 类型检查（`AUDIO_STT_SUPPORTED_CONTENT_TYPES`）之外的补充，因此收紧该列表是一种低成本的方式，可增强 STT 终结点对意外文件类型的防护。管理员**音频（Audio）**设置中不显示此列表。请使用 `AUDIO_STT_ALLOWED_EXTENSIONS` 环境变量进行设置，或将该变量设为空值以完全跳过扩展名检查。

## 用户级设置 {#user-level-settings}

除了管理员面板中配置的实例设置，还有一些用户级设置可以提供附加功能。

- **STT 设置（STT Settings）：** 包含与语音转文字功能相关的设置。
- **语音转文字引擎（Speech-to-Text Engine）：** 决定用于语音识别的引擎（默认或 Web API）。

这些设置位于你的**设置（Settings）**中的**音频（Audio）**标签页。该标签页会向管理员，以及至少拥有**允许语音转文字（Allow Speech to Text）**、**允许文字转语音（Allow Text to Speech）**或**允许通话（Allow Call）**权限之一的用户显示（请参阅[权限](/features/authentication-access/rbac/permissions#3-chat-permissions)）。

![用户音频设置](/images/tutorials/stt/user-settings.png)

## 使用语音转文字 {#using-stt}

语音转文字提供了一种使用语音高效“撰写”提示词的方式，在桌面和移动设备上都能稳定工作。

要使用 STT，只需点击麦克风图标：

![麦克风按钮](/images/tutorials/stt/stt-operation.png)

实时音频波形会表示语音已成功捕获：

![正在录音](/images/tutorials/stt/stt-in-progress.png)

## STT 模式操作 {#stt-mode-operation}

开始录音后，你可以：

- 点击对勾图标保存录音（如果启用了完成后自动发送，系统会自动发送消息以生成回复；否则可以手动发送）
- 如果希望中止录音（例如希望重新录制），可以点击“x”图标退出录音界面

![结束录音](/images/tutorials/stt/endstt.png)

## 故障排除 {#troubleshooting}

### 常见问题 {#common-issues}

#### “不支持 int8 计算类型”（int8 compute type not supported）错误 {#int8-compute-type-not-supported-error}

如果看到类似 `Error transcribing chunk: Requested int8 compute type, but the target device or backend do not support efficient int8 computation` 的错误，通常表示你的 GPU 不支持所请求的 `int8` 计算操作。

**解决方案：**
- **升级到最新版本：** 近期更新改进了计算类型的持久化配置，解决了已知的 CUDA 兼容性问题。
- **改用标准 Docker 镜像**，而不是 `:cuda` 镜像。较旧的 GPU（Maxwell 架构，约 2014–2016 年）可能不受现代 CUDA 加速库支持。
- 使用 `WHISPER_COMPUTE_TYPE` 环境变量**更改计算类型**：
  ```yaml
  environment:
    - WHISPER_COMPUTE_TYPE=float16  # 或 float32
  ```

:::tip
对于 Whisper 这类较小的模型，CPU 模式通常可以提供相当的性能，且没有 GPU 兼容性问题。`:cuda` 镜像主要加速 RAG 嵌入，对大多数用户的 STT 速度不会有显著影响。
:::

#### 麦克风不工作 {#microphone-not-working}

1. **检查浏览器权限：** 确保浏览器拥有麦克风访问权限
2. **使用 HTTPS：** 某些浏览器要求安全连接才能访问麦克风
3. **尝试其他浏览器：** Chrome 通常对 Web 音频 API 的支持最好

#### 识别准确率低 {#poor-recognition-accuracy}

- 使用 `WHISPER_LANGUAGE=en` **明确设置语言**（使用 ISO 639-1 代码）
- **切换多语言支持：** 如果需要支持英语以外的语言，请使用 `WHISPER_MULTILINGUAL=true`。禁用（默认）时，仅使用模型的纯英语版本，以提高英语任务的性能。
- **使用更大的 Whisper 模型：** 可选 `tiny`、`base`、`small`、`medium`、`large`
- 更大的模型更准确，但速度更慢

更详细的故障排除信息，请参阅[音频故障排除指南](/troubleshooting/audio)。

---
sidebar_position: 2
title: "Azure AI Speech 语音转文字"
---

# 使用 Azure AI Speech 进行语音转文字

本指南介绍如何在 Open WebUI 中使用 Azure AI Speech 进行语音转文字。Open WebUI 会将每段录音发送到 Azure 的[快速转录 API](https://learn.microsoft.com/azure/ai-services/speech-service/fast-transcription-create)，该 API 在单次请求中返回文本。

:::tip 正在寻找 TTS？
请参阅配套指南：[使用 Azure AI Speech 进行文字转语音](/features/chat-conversations/audio/text-to-speech/azure-tts-integration)
:::

## 前提条件 {#requirements}

- 一个位于提供**快速转录**功能区域的 Azure Speech 资源（Microsoft 文档也将其称为语音 Foundry 资源）。并非每个区域都提供该功能：请查看 Microsoft [Speech 服务区域表](https://learn.microsoft.com/azure/ai-services/speech-service/regions?tabs=stt)中的 **Fast transcription** 列。
- 资源密钥，可在 Azure 门户的**资源管理（Resource Management）** > **密钥和终结点（Keys and Endpoint）**中获取。两个密钥均可使用。
- 已安装并运行 Open WebUI

:::caution Azure Government
Microsoft 将快速转录列为 Azure Government 不支持的功能，因此无法在该环境中使用此引擎。请参阅[主权云中的 Speech 服务](https://learn.microsoft.com/azure/ai-services/speech-service/sovereign-clouds)。
:::

## 快速设置（界面） {#quick-setup-ui}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板（Admin Panel）**，然后选择**设置（Settings）**。设置会在窗口中打开。
3. 在侧边栏的*工具（Tools）*分组中，选择**管理员（Admin）**下的**音频（Audio）**。*偏好设置（Preferences）*分组中的另一个**音频（Audio）**条目用于个人音频设置。在窄屏上这些标签会隐藏；可通过 `/?settings=admin:audio` 直接打开管理员音频设置。
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **语音转文字引擎（Speech-to-Text Engine）** | `Azure AI Speech` |
| **API 密钥（API Key）** | 你的 Speech 资源密钥 |
| **Azure 区域（Azure Region）** | Speech 资源所在的区域，使用 `westus` 或 `westeurope` 这类标识符。留空时，Open WebUI 使用 `eastus` |
| **语言区域设置（Language Locales）** | 用户所说的语言，以逗号分隔且不带空格，例如 `en-US,de-DE`。请参阅[语言区域设置](#language-locales) |
| **终结点 URL（Endpoint URL）** | 留空，除非使用资源自己的终结点（请参阅[终结点 URL](#endpoint-url)） |
| **最大说话人数（Max Speakers）** | 留空以使用默认值 `3` |

5. 点击**保存（Save）**

密钥仅适用于创建资源时所在的区域。Microsoft 指出密钥具有区域范围，因此在其他区域使用密钥会身份验证失败。

## 语言区域设置 {#language-locales}

Azure 根据 Open WebUI 随每段录音发送的区域设置列表判断所使用的语言：

- 设置**语言区域设置（Language Locales）**后，Azure 会将这些区域设置作为候选。Microsoft 指出，如果音频中没有使用其中任何一种语言，服务会尝试自行识别语言。
- 留空时，Open WebUI 会发送以下列表：`en-US`、`es-ES`、`es-MX`、`fr-FR`、`hi-IN`、`it-IT`、`de-DE`、`en-GB`、`en-IN`、`ja-JP`、`ko-KR`、`pt-BR` 和 `zh-CN`。

Azure 会为每段录音识别一种主要语言。Microsoft 指出，使用数量较少且准确的候选区域设置可以提高检测效果，因此请仅列出用户实际使用的语言。有关 Azure 支持的区域设置，请参阅[语言和语音支持](https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=stt)。

仅使用逗号分隔区域设置。Open WebUI 不会去除空格，因此 `en-US, de-DE` 会发送带前导空格的 `" de-DE"`。

每位用户在**设置（Settings）** → **音频（Audio）**下设置的**语言（Language）**不会用于此引擎。只有管理员的**语言区域设置（Language Locales）**列表会发送到 Azure。

## 终结点 URL {#endpoint-url}

默认情况下，Open WebUI 会将请求发送到根据 **Azure 区域（Azure Region）**构建的 `https://<region>.api.cognitive.microsoft.com`。**终结点 URL（Endpoint URL）**会替换该地址，Open WebUI 会在其后添加 `/speechtotext/transcriptions:transcribe?api-version=2024-11-15`。请仅输入协议和主机，不要包含路径。

你可以使用**密钥和终结点（Keys and Endpoint）**中资源自己的终结点，例如 `https://<resource-name>.cognitiveservices.azure.com`。Microsoft 的快速转录示例会在该地址上调用相同路径。请去掉 Azure 显示的末尾 `/`，因为 Open WebUI 会直接添加路径，保留末尾斜杠会导致出现两个斜杠。

## 最大说话人数 {#max-speakers}

Open WebUI 始终要求 Azure 分离说话人（说话人分离，diarization），并将**最大说话人数（Max Speakers）**作为上限。Open WebUI 保留的文本是合并后的转录，不包含说话人标签。

## 通过环境变量设置 {#environment-variables-setup}

如果你更喜欢通过环境变量进行配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=azure
      - AUDIO_STT_AZURE_API_KEY=your-speech-resource-key
      - AUDIO_STT_AZURE_REGION=westeurope
      - AUDIO_STT_AZURE_LOCALES=en-US,de-DE
    # ... 其他配置
```

### 所有 Azure STT 环境变量 {#all-azure-stt-environment-variables}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | 设为 `azure` | 空（使用本地 Whisper） |
| `AUDIO_STT_AZURE_API_KEY` | 你的 Speech 资源密钥 | 空 |
| `AUDIO_STT_AZURE_REGION` | Speech 资源的区域标识符 | 空，即使用 `eastus` |
| `AUDIO_STT_AZURE_LOCALES` | 以逗号分隔的区域设置，不带空格 | 空，即发送上面列出的 13 个区域设置 |
| `AUDIO_STT_AZURE_BASE_URL` | 替换 `https://<region>.api.cognitive.microsoft.com` | 空 |
| `AUDIO_STT_AZURE_MAX_SPEAKERS` | 说话人分离的数量上限 | 空，即使用 `3` |

:::info 界面中保存的设置优先
保存管理员**音频（Audio）**设置会存储该标签页中的每个字段，包括空字段；选择引擎也会触发保存。使用默认的 `ENABLE_PERSISTENT_CONFIG=true` 时，此后这些存储的值会优先于 `AUDIO_*` 环境变量。请参阅 [`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config)。
:::

## 长录音 {#long-recordings}

转录前，Open WebUI 会将不在其支持格式列表中的录音转换为 MP3。超过 20 MB 的音频会重新编码为更小的 MP3；如果仍然过大，则拆分为每个不超过 20 MB 的片段。每个片段会作为独立请求发送到 Azure，因此每个片段都会单独检测语言，之后再合并文本。

精简镜像或 `BYPASS_PYDUB_PREPROCESSING=true` 会跳过此步骤并完整发送文件。此时，Open WebUI 会拒绝超过 200 MB 的文件；对于 Open WebUI 使用的 API 版本（`2024-11-15`），Microsoft 参考文档将音频时长限制为 2 小时以内。

## 使用语音转文字 {#using-stt}

1. 点击聊天输入框中的**麦克风图标**
2. 说出你的消息
3. 完成后点击对勾（**确认录音（Confirm recording）**）
4. 你的语音会被转录并显示在消息框中；如果你的**音频（Audio）**设置中开启了**语音转录后立即自动发送（Instant Auto-Send After Voice Transcription）**，消息会立即发送

## 故障排除 {#troubleshooting}

### “Azure STT 需要 Azure API 密钥和区域”（Azure API key and region are required for Azure STT） {#azure-api-key-and-region-are-required-for-azure-stt}

尚未保存 API 密钥。在 **API 密钥（API Key）**中输入你的 Speech 资源密钥（或设置 `AUDIO_STT_AZURE_API_KEY`），然后保存。

### “外部错误：订阅密钥无效或 API 终结点错误，访问被拒绝”（External: Access denied due to invalid subscription key or wrong API endpoint） {#external-access-denied-due-to-invalid-subscription-key-or-wrong-api-endpoint}

Azure 拒绝了密钥。请检查：

1. 密钥是否从**密钥和终结点（Keys and Endpoint）**正确复制
2. **Azure 区域（Azure Region）**是否为 Speech 资源所在区域
3. 如果设置了**终结点 URL（Endpoint URL）**，它是否为不含路径的资源终结点

### “外部错误：未找到资源”（External: Resource not found） {#external-resource-not-found}

Azure 无法识别该地址。如果设置了**终结点 URL（Endpoint URL）**，请确保主机后没有路径。

### 无法识别语言 {#language-could-not-be-identified}

当 Azure 无法识别语言，或识别出多种语言但没有一种占主导时，Open WebUI 会显示 Azure 自身的错误消息。请将**语言区域设置（Language Locales）**设为录音中实际使用的语言。

### 其他错误 {#other-errors}

音频为空或过长，以及出现两种语言识别错误时，Open WebUI 会显示 Azure 自身的消息。采用 Azure 转录错误格式的其他错误会显示“An error occurred during transcription.”，Azure 的错误代码和消息会写入服务器日志，所在行包含 `Azure STT error`。

还有一些消息来自 Open WebUI 本身：

- **以“Failed to parse Azure response:”开头的消息**：Azure 已响应，但响应中没有任何转录文本。
- **以“Error transcribing chunk:”开头的消息**：请求从未到达 Azure，例如区域标识符输入错误。

如果密钥和区域正确但转录仍然失败，请确认你的区域提供快速转录功能。

更多故障排除信息，请参阅[音频故障排除指南](/troubleshooting/audio)。

## 费用注意事项 {#cost-considerations}

Azure 会通过你的 Azure 订阅对 Speech 用量计费。请查看 [Azure Speech 定价页](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)了解当前费率。Microsoft 的[配额和限制](https://learn.microsoft.com/azure/ai-services/speech-service/speech-services-quotas-and-limits)文档仅列出标准（S0）层的快速转录限制。

:::tip
如需免费语音转文字，请使用**本地 Whisper（Local Whisper）**（默认）或浏览器的 **Web API** 进行基本转录。
:::

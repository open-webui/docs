---
sidebar_position: 2
title: "Azure AI Speech 文本转语音"
---

# 使用 Azure AI Speech 进行文本转语音

本指南介绍如何在 Open WebUI 中使用 Azure AI Speech 进行文本转语音。Open WebUI 将文本发送到 Azure 的[文本转语音 REST API](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech)，并播放返回的音频。

:::tip 需要 STT？
请参阅配套指南：[使用 Azure AI Speech 进行语音转文本](/features/chat-conversations/audio/speech-to-text/azure-stt-integration)
:::

## 前提条件 {#requirements}

- 一个 Azure Speech 资源（Microsoft 文档也将其称为 Speech 的 Foundry 资源）。有关各区域的文本转语音可用性，请参阅 Microsoft 的 [Speech 服务区域表](https://learn.microsoft.com/azure/ai-services/speech-service/regions?tabs=tts)。
- 资源密钥，可在 Azure 门户中的**资源管理（Resource Management）** > **密钥和终结点（Keys and Endpoint）**下找到。两个密钥中的任意一个均可使用。
- 已安装并运行 Open WebUI

## 快速设置（界面） {#quick-setup-ui}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板（Admin Panel）**，然后选择**设置（Settings）**。设置将在一个窗口中打开。
3. 在侧边栏中，选择**管理（Admin）**下*工具（Tools）*组中的**音频（Audio）**。*偏好设置（Preferences）*组中的另一个**音频**条目用于你的个人音频设置。在窄屏上这些标签会隐藏；可直接通过 `/?settings=admin:audio` 打开管理音频设置。
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **文本转语音引擎（Text-to-Speech Engine）** | `Azure AI Speech` |
| **API 密钥（API Key）** | 你的 Speech 资源密钥 |
| **Azure 区域（Azure Region）** | Speech 资源所在区域的标识符，例如 `westus` 或 `westeurope` |
| **终结点 URL（Endpoint URL）** | 留空，除非使用主权云（请参阅[终结点 URL](#endpoint-url)） |

5. 点击**保存（Save）**。选择引擎本身就会自动保存并清空 **TTS 语音（TTS Voice）**，因此语音需要在此步骤之后设置。
6. 切换到另一个设置选项卡，再返回**音频**。语音列表会在音频选项卡打开时获取，因此只有经过这一步，列表才会使用你的密钥加载。
7. 配置语音和格式：

| 设置 | 值 |
|---------|-------|
| **TTS 语音（TTS Voice）** | 输入语音名称或语言的一部分进行搜索，然后选择一种语音，例如 `en-US-JennyNeural` |
| **输出格式（Output format）** | 保留默认值 `audio-24khz-160kbitrate-mono-mp3`（请参阅[输出格式](#output-format)） |

8. 点击**保存**

密钥仅适用于创建资源时所在的区域。Microsoft 指出密钥具有区域范围，因此在其他区域使用该密钥会身份验证失败。

:::caution 务必设置区域
如果 **Azure 区域**和**终结点 URL**均为空，系统仍会从 `eastus` 请求语音，但完全不会加载语音列表。请设置资源所在的区域。
:::

## 选择语音 {#choosing-voices}

Open WebUI 会从 Azure 加载你所在区域的语音列表。**TTS 语音**中的每一行都会显示语音的完整名称（例如 `en-US-JennyNeural`），旁边以灰色显示其显示标签。一次只显示几行，因此可输入名称或语言的一部分（例如 `en-GB`）来缩小列表范围。

Open WebUI 发送给 Azure 的是完整名称，并从该名称的前两部分获取语音语言（从 `en-US-JennyNeural` 中得到 `en-US`）。如果手动输入语音而不是从列表中选择，请使用完整名称。

回复使用哪种语音，按以下顺序确定：

1. 模型自身的 **TTS 语音**（如果在**工作区（Workspace）** → **模型（Models）**中编辑模型时已设置）
2. 否则，使用用户在个人**音频**设置中**设置语音（Set Voice）**下选择的语音，前提是管理员的 **TTS 语音**仍是用户选择时所设置的值。如果管理员更改了该值，用户会听到新的默认语音，直到再次选择。
3. 否则，使用管理员的 **TTS 语音**

有关语音和语言的完整列表，请参阅 Microsoft 的[语言和语音支持](https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts)。

## 终结点 URL {#endpoint-url}

默认情况下，Open WebUI 会根据 **Azure 区域**构建地址，将请求发送到 `https://<region>.tts.speech.microsoft.com`。**终结点 URL**会替换该地址。Open WebUI 会在其后添加 `/cognitiveservices/v1` 来请求语音，并添加 `/cognitiveservices/voices/list` 来加载语音列表，因此只输入协议和主机，不要包含路径。

这不是**密钥和终结点**中显示的资源终结点，[STT 指南](/features/chat-conversations/audio/speech-to-text/azure-stt-integration#endpoint-url)可以使用后者。Microsoft 文档中，该地址上的语音列表路径为 `/tts/cognitiveservices/voices/list`，而 Open WebUI 请求的是 `/cognitiveservices/voices/list`，因此语音列表将无法加载。

对于主权云，Microsoft 文档列出了以下地址，其中 `<region>` 需替换为你的区域标识符：

| 云 | 终结点 URL |
|-------|--------------|
| Azure Government | `https://<region>.tts.speech.azure.us` |
| 由世纪互联运营的 Azure | `https://<region>.tts.speech.azure.cn` |

有关区域标识符，请参阅[主权云中的 Speech 服务](https://learn.microsoft.com/azure/ai-services/speech-service/sovereign-clouds)。

## 输出格式 {#output-format}

**输出格式**会作为需要返回的音频格式发送给 Azure。请保留一种 MP3 格式，例如默认的 `audio-24khz-160kbitrate-mono-mp3`。Open WebUI 会将接收到的音频保存为 `.mp3` 文件，并且除精简镜像外，无论 Azure 返回什么格式，都会以 MP3 形式提供。精简镜像会拒绝其浏览器可播放格式列表之外的音频类型；该列表包括 MP3、WAV 和 Ogg 等格式。Microsoft 的[音频输出列表](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)包含所有可用值。

## 环境变量设置 {#environment-variables-setup}

如果希望通过环境变量进行配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=azure
      - AUDIO_TTS_API_KEY=your-speech-resource-key
      - AUDIO_TTS_AZURE_SPEECH_REGION=westeurope
      - AUDIO_TTS_VOICE=en-US-JennyNeural
    # ... 其他配置
```

将 `AUDIO_TTS_VOICE` 设置为 Azure 语音名称。其默认值 `alloy` 是 OpenAI 语音。

### 所有 Azure TTS 环境变量 {#all-azure-tts-environment-variables}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | 设置为 `azure` | 空（仅使用浏览器 TTS） |
| `AUDIO_TTS_API_KEY` | 你的 Speech 资源密钥（与 ElevenLabs 引擎共用） | 空 |
| `AUDIO_TTS_AZURE_SPEECH_REGION` | Speech 资源的区域标识符 | 空（语音使用 `eastus`；未设置基础 URL 时，语音列表不会加载） |
| `AUDIO_TTS_AZURE_SPEECH_BASE_URL` | 替换 `https://<region>.tts.speech.microsoft.com` | 空 |
| `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT` | 音频输出格式 | `audio-24khz-160kbitrate-mono-mp3` |
| `AUDIO_TTS_VOICE` | 完整的 Azure 语音名称 | `alloy`（不是 Azure 语音） |

:::info 界面中保存的设置优先
保存管理员**音频**设置会存储该选项卡中的所有字段，包括空字段；选择引擎也会触发保存。在默认的 `ENABLE_PERSISTENT_CONFIG=true` 下，此后这些存储的值优先于 `AUDIO_*` 环境变量。请参阅 [`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config)。
:::

## 测试 TTS {#testing-tts}

1. 开始新聊天
2. 向任意模型发送一条消息
3. 点击 AI 回复上的**扬声器图标**，即可听其朗读

## 故障排除 {#troubleshooting}

### 列表中未显示语音 {#no-voices-shown-in-the-list}

1. 确认已设置并保存 **API 密钥**和 **Azure 区域**
2. 切换到另一个设置选项卡，再返回**音频**以重新加载列表
3. 检查 Open WebUI 日志中是否有 `Error fetching Azure voices`

### 语音请求失败并出现 401 错误 {#speech-fails-with-a-401-error}

Azure 拒绝了密钥。请检查是否从**密钥和终结点**正确复制了密钥，以及 **Azure 区域**是否为 Speech 资源所在区域。

### 语音请求失败并出现其他错误 {#speech-fails-with-another-error}

1. 确认 **TTS 语音**已设置为列表中的完整 Azure 语音名称
2. 确认**输出格式**是 Microsoft [音频输出列表](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)中的某个 MP3 值
3. 检查 Open WebUI 日志中的完整错误信息

如需更全面的音频调试，请参阅[音频故障排除指南](/troubleshooting/audio)。

## 成本注意事项 {#cost-considerations}

Azure 会根据你的 Azure 订阅对 Speech 使用量计费。有关当前费率，请查看 [Azure Speech 定价页面](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)。

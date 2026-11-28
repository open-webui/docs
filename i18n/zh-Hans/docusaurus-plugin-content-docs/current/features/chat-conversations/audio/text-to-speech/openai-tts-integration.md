---
sidebar_position: 0
title: "OpenAI TTS 集成"
---

# 使用 OpenAI 进行文本转语音

本指南介绍如何在 Open WebUI 中使用 OpenAI 官方的文本转语音 API。如果已经有 OpenAI API 密钥，这是最简单的设置方式。

:::tip 需要 STT？
请参阅配套指南：[使用 OpenAI 进行语音转文本](/features/chat-conversations/audio/speech-to-text/openai-stt-integration)
:::

## 前提条件 {#requirements}

- 具有 Audio API 访问权限的 OpenAI API 密钥
- 已安装并运行 Open WebUI

## 快速设置（界面） {#quick-setup-ui}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板（Admin Panel）**
3. 点击**设置（Settings）** → **音频（Audio）**选项卡
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **文本转语音引擎（Text-to-Speech Engine）** | `OpenAI` |
| **API 基础 URL（API Base URL）** | `https://api.openai.com/v1` |
| **API 密钥（API Key）** | 你的 OpenAI API 密钥 |
| **TTS 模型（TTS Model）** | `tts-1` 或 `tts-1-hd` |
| **TTS 语音（TTS Voice）** | 从可用语音中选择 |

5. 点击**保存（Save）**

## 可用模型 {#available-models}

| 模型 | 说明 | 最适用场景 |
|-------|-------------|----------|
| `tts-1` | 标准质量，较低延迟 | 实时应用、更快响应 |
| `tts-1-hd` | 更高质量的音频 | 预录内容、高品质音频 |

:::caution OpenAI 将停用这些模型
OpenAI 将于 2027-01-06 从其 API 中移除 `tts-1`、`tts-1-hd` 和 `gpt-4o-mini-tts`。其推荐的替代模型 `gpt-realtime-2.1-mini` 不受 `OpenAI` 引擎调用的 `/audio/speech` 终结点支持，因此仅更改 **TTS 模型**并不够。要继续使用 OpenAI 生成语音，请切换到 [OpenAI Realtime 引擎](#using-the-openai-realtime-engine)。详情请参阅 [OpenAI 的弃用页面](https://developers.openai.com/api/docs/deprecations#2026-10-01-text-to-speech-models)。
:::

## 可用语音 {#available-voices}

OpenAI 提供 6 种内置语音：

| 语音 | 说明 |
|-------|-------------|
| `alloy` | 中性、均衡 |
| `echo` | 温暖、适合对话 |
| `fable` | 富有表现力、英式口音 |
| `onyx` | 低沉、权威 |
| `nova` | 友好、明快 |
| `shimmer` | 柔和、温柔 |

:::tip
尝试不同的语音，找到最适合你用例的一种。可在 OpenAI 文档中预览语音。
:::

## 按模型设置 TTS 语音 {#per-model-tts-voice}

可以为各个模型指定特定的 TTS 语音，让不同的 AI 角色拥有不同的声音。此设置在模型编辑器中完成。

### 设置模型专用语音 {#setting-a-model-specific-voice}

1. 前往**工作区（Workspace） > 模型（Models）**
2. 点击要配置模型上的**编辑**（铅笔）图标
3. 向下滚动，找到 **TTS 语音**字段
4. 输入语音名称（例如 `alloy`、`echo`、`shimmer`、`onyx`、`nova`、`fable`）
5. 点击**保存**

### 语音优先级 {#voice-priority}

播放 TTS 音频时，Open WebUI 使用以下优先级：

1. **模型专用 TTS 语音**（如果在模型编辑器中设置）
2. **用户的个人语音设置**（如果在用户设置中配置）
3. **系统默认语音**（由管理员配置）

这样，管理员可以为每个 AI 角色指定一致的声音；未设置模型专用语音时，用户仍可用个人偏好覆盖默认设置。

### 用例 {#use-cases}

- **角色人设**：为“英式管家”模型指定 `fable` 语音，而“活力助手”使用 `nova`
- **语言学习**：为不同的语言导师分配合适的语音
- **无障碍访问**：为面向无障碍用例设计的模型设置更清晰的语音

## 环境变量设置 {#environment-variables-setup}

如果希望通过环境变量进行配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://api.openai.com/v1
      - AUDIO_TTS_OPENAI_API_KEY=sk-...
      - AUDIO_TTS_MODEL=tts-1
      - AUDIO_TTS_VOICE=alloy
    # ... 其他配置
```

### 所有 TTS 环境变量 {#all-tts-environment-variables}

| 变量 | 说明 | 默认值 |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | 设置为 `openai` | 空 |
| `AUDIO_TTS_OPENAI_API_BASE_URL` | OpenAI API 基础 URL | `https://api.openai.com/v1` |
| `AUDIO_TTS_OPENAI_API_KEY` | 你的 OpenAI API 密钥 | 空 |
| `AUDIO_TTS_MODEL` | TTS 模型（`tts-1` 或 `tts-1-hd`） | `tts-1` |
| `AUDIO_TTS_VOICE` | 要使用的语音 | `alloy` |

## 使用 OpenAI Realtime 引擎 {#using-the-openai-realtime-engine}

**OpenAI Realtime** 文本转语音引擎使用 OpenAI 的实时语音模型生成语音，这些模型与[实时通话](/features/chat-conversations/chat-features/voice-mode#realtime-calls)所用的模型相同。对于每段文本，Open WebUI 会与 `<API Base URL>/realtime` 建立一个短暂的 WebSocket 会话，要求模型朗读文本，并将结果保存为完整的 WAV 片段。它像其他文本转语音引擎一样，为“大声朗读”和标准语音通话提供服务。

1. 前往**设置 > 音频**（管理区域）。
2. 将**文本转语音引擎**设置为 **OpenAI Realtime**。模型和语音会切换为 `gpt-realtime-2.1-mini` 和 `marin`。
3. 填写 **API 基础 URL**和 **API 密钥**。这些字段与 `OpenAI` 引擎使用的字段相同。
4. 可选择更改 **TTS 模型**、**TTS 语音**或**提示模板（Prompt Template）**，然后点击**保存**。

| 设置 | 选项 |
|---------|---------|
| **TTS 模型** | `gpt-realtime-2.1-mini`（默认）或 `gpt-realtime-2.1` |
| **TTS 语音** | `alloy`、`ash`、`ballad`、`coral`、`echo`、`sage`、`shimmer`、`verse`、`marin`（默认）或 `cedar` |
| **提示模板** | 给模型的指令。留空可使用内置提示，该提示要求模型逐字朗读文本，保留原始语言，不作回答、总结或添加评论 |

对于此引擎，**提示模板**字段取代了**其他参数（Additional Parameters）**。上述相同的[语音优先级](#voice-priority)仍然适用：先使用模型的 **TTS 语音**，再使用用户自己的语音，最后使用管理员默认值。每个完成的片段都会缓存，因此下次遇到具有相同模型、语音和提示的相同文本时，会直接播放缓存。

API 基础 URL 必须以 `http://` 或 `https://` 开头，并且不能包含查询字符串、用户名或密码。使用环境变量配置：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai-realtime
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://api.openai.com/v1
      - AUDIO_TTS_OPENAI_API_KEY=sk-...
      - AUDIO_TTS_MODEL=gpt-realtime-2.1-mini
      - AUDIO_TTS_VOICE=marin
      # 可选：替换内置的朗读指令
      # - REALTIME_TTS_PROMPT_TEMPLATE=...
```

请参阅环境变量参考中的 [`REALTIME_TTS_PROMPT_TEMPLATE`](/reference/env-configuration#realtime_tts_prompt_template)。

## 使用 OpenRouter 作为文本转语音提供方 {#using-openrouter-as-a-text-to-speech-provider}

Open WebUI 的 `OpenAI` TTS 引擎兼容任何实现 OpenAI Audio API 的服务，包括 [OpenRouter](https://openrouter.ai)。本节介绍如何将 OpenRouter 配置为 TTS 提供方，以及如何避免常见的 `400 Bad Request` 错误。

### 为什么会发生 400 错误 {#why-the-400-error-happens}

省略 `response_format` 字段时，OpenRouter 的 [`/audio/speech` 终结点](https://openrouter.ai/docs/guides/overview/multimodal/tts)会将其默认设为 `pcm`。Open WebUI 不会在请求负载中发送 `response_format`，因此 OpenRouter 会返回 Open WebUI 无法播放的原始 PCM 音频，导致 `400 Bad Request`。

解决方法是在 TTS 设置的 **OpenAI 参数（OpenAI Params）**字段（额外参数）中显式添加 `{"response_format": "mp3"}`，请求 MP3 格式。

### 快速设置（界面） {#quick-setup-ui-1}

1. 点击你的**个人资料图标**（左下角）
2. 选择**管理员面板**
3. 点击**设置** → **音频**选项卡 → **文本转语音设置（Text-to-Speech Settings）**
4. 配置以下内容：

| 设置 | 值 |
|---------|-------|
| **文本转语音引擎** | `OpenAI` |
| **API 基础 URL** | `https://openrouter.ai/api/v1` |
| **API 密钥** | 你的 OpenRouter API 密钥（`sk-or-...`） |
| **TTS 模型** | 任意 OpenRouter TTS 模型，例如 `openai/tts-1` |
| **TTS 语音** | 从可用语音中选择 |
| **OpenAI 参数** | `{"response_format": "mp3"}` |

:::important

**OpenAI 参数**字段必须包含 `{"response_format": "mp3"}`。如果没有它，OpenRouter 会默认使用 `pcm`，语音请求将因 `400 Bad Request` 错误而失败。

:::

5. 点击**保存**

### 环境变量设置 {#environment-variables-setup-1}

如果希望通过环境变量进行配置，请通过 `AUDIO_TTS_OPENAI_PARAMS` 添加参数 JSON：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=openai
      - AUDIO_TTS_OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
      - AUDIO_TTS_OPENAI_API_KEY=sk-or-...
      - AUDIO_TTS_MODEL=openai/tts-1
      - AUDIO_TTS_VOICE=alloy
      - AUDIO_TTS_OPENAI_PARAMS={"response_format":"mp3"}
    # ... 其他配置
```

:::info

OpenRouter 支持 `mp3` 和 `pcm` 输出格式。请始终在 Open WebUI 中选择 `mp3`；PCM 输出用于实时流式处理管道，Open WebUI 无法播放。

:::

## 测试 TTS {#testing-tts}

1. 开始新聊天
2. 向任意模型发送一条消息
3. 点击 AI 回复上的**扬声器图标**，即可听其朗读

## 响应拆分 {#response-splitting}

朗读长回复时，Open WebUI 可以先将文本拆分为片段，再发送给 TTS 引擎。此功能在**设置 > 音频**（管理区域）的**响应拆分（Response Splitting）**下配置。

| 选项 | 说明 |
|--------|-------------|
| **标点符号（Punctuation）**（默认） | 在句子边界拆分：句号（`.`）、感叹号（`!`）、问号（`?`）和换行符。最适合自然的语流节奏。 |
| **段落（Paragraphs）** | 在每个换行符处拆分，无论单个还是双换行，同时保持代码块完整。生成的音频片段较长。 |
| **无（None）** | 将整个回复作为一个片段发送。长回复可能要等待较长时间才开始播放音频。 |

:::tip
大多数用例建议使用**标点符号**模式。它在流式性能（音频快速开始播放）与自然语音节奏之间实现了最佳平衡。
:::

每个片段在发送给引擎前都会经过清理。Open WebUI 会移除代码块、表格行、表情符号、推理和工具调用详情，以及 `[^1]` 等脚注标记。它会移除 `**`、`_`、`#`、列表标记和 `>` 等 Markdown 语法，但保留其标记的文字。链接会精简为其文本，不含 URL。`[1]` 等引用标记不会被移除，因此引擎会收到这些标记，并可能读出数字。连续两个标记（例如 `[1][2]`）会被视为链接并变成 `1`。

除一种情况外，此清理和拆分适用于所有引擎：当管理员的**文本转语音引擎**为 **Web API**，且你自己的引擎不是 **Kokoro.js (Browser)** 时，**大声朗读**会将完整回复原样交给浏览器的语音。语音通话则会在所有引擎下清理并拆分文本。

## 故障排除 {#troubleshooting}

### 没有音频播放 {#no-audio-plays}

1. 检查 OpenAI API 密钥是否有效并具有 Audio API 访问权限
2. 验证 API 基础 URL 是否正确（`https://api.openai.com/v1`）
3. 检查浏览器控制台（F12）中的错误
4. 如果 API 基础 URL 指向另一个兼容 OpenAI 的服务，请将默认的 `tts-1` 和 `alloy` 替换为该服务支持的 **TTS 模型**和 **TTS 语音**

### 音频质量问题 {#audio-quality-issues}

- 从 `tts-1` 切换到 `tts-1-hd` 可获得更高质量
- 注意：`tts-1-hd` 的延迟略高

### 速率限制 {#rate-limits}

OpenAI 对 Audio API 设有速率限制。如果达到限制：
- 考虑缓存常用短语
- 使用 `tts-1` 代替 `tts-1-hd`（使用的 token 更少）

有关更多故障排除内容，请参阅[音频故障排除指南](/troubleshooting/audio)。

## 成本注意事项 {#cost-considerations}

OpenAI 按字符对 TTS 收费。有关当前费率，请参阅 [OpenAI 定价](https://platform.openai.com/docs/pricing)。注意，`tts-1-hd` 的费用高于 `tts-1`。

:::info
如需免费替代方案，可考虑使用 Microsoft Edge 浏览器免费 TTS 的 [OpenAI Edge TTS](/features/chat-conversations/audio/text-to-speech/openai-edge-tts-integration)。
:::

---
sidebar_position: 2
title: "Kokoro Web - 为 Open WebUI 提供轻松的 TTS 体验"
---

:::warning

本教程是社区贡献内容，不受 Open WebUI 团队支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 什么是 `Kokoro Web`？ {#what-is-kokoro-web}

[Kokoro Web](https://github.com/eduardolat/kokoro-web) 为强大的 [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) 文本转语音模型提供轻量级、兼容 OpenAI 的 API，可与 Open WebUI 无缝集成，以自然动听的声音增强你的 AI 对话。

## 两步集成 {#two-step-integration}

### 1. 部署 Kokoro Web API（一条命令） {#1-deploy-kokoro-web-api-one-command}

```yaml
services:
  kokoro-web:
    image: ghcr.io/eduardolat/kokoro-web:latest
    ports:
      - "3000:3000"
    environment:
      # 将此值改为任意密钥，用作兼容 OpenAI 的 API 密钥
      - KW_SECRET_API_KEY=your-api-key
    volumes:
      - ./kokoro-cache:/kokoro/cache
    restart: unless-stopped
```

运行：`docker compose up -d`

### 2. 连接 OpenWebUI（30 秒） {#2-connect-openwebui-30-seconds}

1. 在 OpenWebUI 中，前往 `Settings` → `Audio`（管理区域）
2. 配置：
   - 文本转语音引擎：`OpenAI`
   - API 基础 URL：`http://localhost:3000/api/v1`
     （如果使用 Docker：`http://host.docker.internal:3000/api/v1`）
   - API 密钥：`your-api-key`（来自步骤 1）
   - TTS 模型：`model_q8f16`（大小与质量的最佳平衡）
   - TTS 语音：`af_heart`（默认的温暖、自然英文语音）。可将其更改为 [Kokoro Web 演示](https://voice-generator.pages.dev)中的任何其他语音或公式

**就是这样！你的 OpenWebUI 现在已具备 AI 语音功能。**

## 支持的语言 {#supported-languages}

Kokoro Web 支持 8 种语言，并为每种语言提供了专门优化的语音：

- 英语（美国）- en-us
- 英语（英国）- en-gb
- 日语 - ja
- 中文 - cmn
- 西班牙语 - es-419
- 印地语 - hi
- 意大利语 - it
- 葡萄牙语（巴西）- pt-br

每种语言都有专用语音，以实现最佳发音和自然流畅度。有关特定语言语音的完整列表，请参阅 [GitHub 仓库](https://github.com/eduardolat/kokoro-web)；也可使用 [Kokoro Web 演示](https://voice-generator.pages.dev)即时预览并创建自己的自定义语音。

## 适用于各种硬件的优化模型 {#optimized-models-for-any-hardware}

选择符合硬件需求的模型：

| 模型 ID | 优化方式 | 大小 | 适用场景 |
|----------|-------------|------|-----------|
| model_q8f16 | 混合精度 | 86 MB | **推荐**——最佳平衡 |
| model_quantized | 8 位 | 92.4 MB | 良好的 CPU 性能 |
| model_uint8f16 | 混合精度 | 114 MB | 中端 CPU 上更好的质量 |
| model_q4f16 | 4 位与 fp16 权重 | 154 MB | 更高质量，同时保持高效 |
| model_fp16 | fp16 | 163 MB | 卓越质量 |
| model_uint8 | 8 位与混合精度 | 177 MB | 均衡选择 |
| model_q4 | 4 位矩阵乘法 | 305 MB | 高质量选择 |
| model | fp32 | 326 MB | 最高质量（速度较慢） |

## 安装前试用 {#try-before-you-install}

访问 [**Kokoro Web 演示**](https://voice-generator.pages.dev)，即时预览所有语音。此演示：

- **完全在浏览器中运行**——无需服务器
- **免费使用**——无使用限制，无需注册
- **无需安装**——只需访问网站即可开始创作
- **包含所有功能**——可立即测试任何语音或语言

## 需要更多帮助？ {#need-more-help}

有关其他选项、语音自定义指南和高级设置，请访问 [GitHub 仓库](https://github.com/eduardolat/kokoro-web)。

## 故障排除 {#troubleshooting}

### 连接问题 {#connection-issues}

如果 Open WebUI 无法连接 Kokoro Web：

- **Docker Desktop（Windows/Mac）：**使用 `http://host.docker.internal:3000/api/v1`
- **Docker Compose（同一网络）：**使用 `http://kokoro-web:3000/api/v1`
- **Linux Docker：**使用宿主机的 IP 地址

### 语音无法工作 {#voice-not-working}

1. 确认 Kokoro Web 配置和 Open WebUI 设置中的秘密 API 密钥一致
2. 直接测试 API：
   ```bash
   curl -X POST http://localhost:3000/api/v1/audio/speech \
     -H "Authorization: Bearer your-api-key" \
     -H "Content-Type: application/json" \
     -d '{"input": "Hello world", "voice": "af_heart"}'
   ```

有关更多故障排除技巧，请参阅[音频故障排除指南](/troubleshooting/audio)。

**在 OpenWebUI 对话中畅享自然的 AI 语音吧！**

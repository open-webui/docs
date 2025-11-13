---
sidebar_position: 2
title: "Kokoro Web - Effortless TTS for Open WebUI"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## What is `Kokoro Web`?

[Kokoro Web](https://github.com/eduardolat/kokoro-web) provides a lightweight, OpenAI-compatible API for the powerful [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) text-to-speech model, seamlessly integrating with Open WebUI to enhance your AI conversations with natural-sounding voices.

## 🚀 Two-Step Integration

### 1. Deploy Kokoro Web API (One Command)

```yaml
services:
  kokoro-web:
    image: ghcr.io/eduardolat/kokoro-web:latest
    ports:
      - "3000:3000"
    environment:
      # Change this to any secret key to use as your OpenAI compatible API key
      - KW_SECRET_API_KEY=your-api-key
    volumes:
      - ./kokoro-cache:/kokoro/cache
    restart: unless-stopped
```

Run with: `docker compose up -d`

### 2. Connect OpenWebUI (30 Seconds)

1. In OpenWebUI, go to `Admin Panel` → `Settings` → `Audio`
2. Configure:
   - Text-to-Speech Engine: `OpenAI`
   - API Base URL: `http://localhost:3000/api/v1`
     (If using Docker: `http://host.docker.internal:3000/api/v1`)
   - API Key: `your-api-key` (from step 1)
   - TTS Model: `model_q8f16` (best balance of size/quality)
   - TTS Voice: `af_heart` (default warm, natural english voice). You can change this to any other voice or formula from the [Kokoro Web Demo](https://voice-generator.pages.dev)

**That's it! Your OpenWebUI now has AI voice capabilities.**

## 🌍 Supported Languages

Kokoro Web supports 8 languages with specific voices optimized for each:

- English (US) - en-us
- English (UK) - en-gb
- Japanese - ja
- Chinese - cmn
- Spanish - es-419
- Hindi - hi
- Italian - it
- Portuguese (Brazil) - pt-br

Each language has dedicated voices for optimal pronunciation and natural flow. See the [GitHub repository](https://github.com/eduardolat/kokoro-web) for the complete list of language-specific voices or use the [Kokoro Web Demo](https://voice-generator.pages.dev) to preview and create your own custom voices instantly.

## 💾 Optimized Models for Any Hardware

Choose the model that fits your hardware needs:

| Model ID | Optimization | Size | Ideal For |
|----------|-------------|------|-----------|
| model_q8f16 | Mixed precision | 86 MB | **Recommended** - Best balance |
| model_quantized | 8-bit | 92.4 MB | Good CPU performance |
| model_uint8f16 | Mixed precision | 114 MB | Better quality on mid-range CPUs |
| model_q4f16 | 4-bit & fp16 weights | 154 MB | Higher quality, still efficient |
| model_fp16 | fp16 | 163 MB | Premium quality |
| model_uint8 | 8-bit & mixed | 177 MB | Balanced option |
| model_q4 | 4-bit matmul | 305 MB | High quality option |
| model | fp32 | 326 MB | Maximum quality (slower) |

## ✨ Try Before You Install

Visit the [**Kokoro Web Demo**](https://voice-generator.pages.dev) to preview all voices instantly. This demo:

- **Runs 100% in your browser** - No server required
- **Free forever** - No usage limits or registration needed
- **Zero installation** - Just visit the website and start creating
- **All features included** - Test any voice or language immediately

## Need More Help?

For additional options, voice customization guides, and advanced settings, visit the [GitHub repository](https://github.com/eduardolat/kokoro-web).

**Enjoy natural AI voices in your OpenWebUI conversations!**

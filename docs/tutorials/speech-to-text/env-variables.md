---
sidebar_position: 2
title: "Environment Variables"
---

## Environment Variables List

:::info

For a complete list of all Open WebUI environment variables, see the [Environment Variable Configuration](https://docs.openwebui.com/getting-started/env-configuration) page.

:::

The following is a summary of the environment variables for speech to text (STT).

# Environment Variables For Speech To Text (STT)

| Variable | Description |
|----------|-------------|
| `WHISPER_MODEL` | Sets the Whisper model to use for local Speech-to-Text |
| `WHISPER_MODEL_DIR` | Specifies the directory to store Whisper model files |
| `WHISPER_LANGUAGE` | Specifies the ISO 639-1 (ISO 639-2 for Hawaiian and Cantonese) Speech-to-Text language to use for Whisper (language is predicted unless set) |
| `AUDIO_STT_ENGINE` | Specifies the Speech-to-Text engine to use (empty for local Whisper, or `openai`) |
| `AUDIO_STT_MODEL` | Specifies the Speech-to-Text model for OpenAI-compatible endpoints |
| `AUDIO_STT_OPENAI_API_BASE_URL` | Sets the OpenAI-compatible base URL for Speech-to-Text |
| `AUDIO_STT_OPENAI_API_KEY` | Sets the OpenAI API key for Speech-to-Text |

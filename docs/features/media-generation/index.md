---
sidebar_position: 0
title: "Media & Generation"
---

# 🎨 Media & Generation

**Talk to your AI, have it talk back, and create images without leaving the conversation.**

Open WebUI is not just text. Speak a prompt instead of typing it. Have the AI read its response aloud. Ask it to generate an image, edit a photo, or composite multiple images into one scene. With native tool calling, the model decides when to generate or edit visuals on its own, no manual toggle required.

Everything runs through configurable providers, so you can start with built-in local models and swap in cloud services when you need higher quality or lower latency.

---

## Why Media & Generation?

### Voice as a first-class input

Click the microphone icon and speak. Open WebUI transcribes with local Whisper by default, or routes to OpenAI, Mistral Voxtral, Deepgram, or Azure for cloud-grade accuracy. Dictation works from desktop and mobile with no extra setup.

### AI that speaks back

Every response can be read aloud with adjustable playback speed, tap-to-interrupt, and voice-interrupt support. Choose from OpenAI voices, ElevenLabs, Azure, local Kokoro/Chatterbox models, or the browser's built-in WebAPI.

### Hands-free voice and video calls

Start a real-time voice call directly from the chat. With a vision model selected, switch to a video call where the AI sees your camera feed and responds in context.

### Image generation inside the conversation

Ask the model to generate an image and it appears inline. With native function calling, the model invokes `generate_image` autonomously based on the conversation, no toggle or special syntax needed.

### Image editing and compositing

Upload a photo and describe what you want changed. The AI edits the image in place (inpainting) or combines multiple uploaded images into a single composite scene with harmonized lighting and perspective.

---

## Key Features

| | |
| :--- | :--- |
| 🎤 **Speech-to-Text** | Local Whisper, OpenAI, Mistral Voxtral, Deepgram, Azure, or browser WebAPI |
| 🔊 **Text-to-Speech** | OpenAI, ElevenLabs, Azure, Kokoro, Chatterbox, openedai-speech, browser WebAPI |
| 📞 **Voice & video calls** | Hands-free calls with vision model support and real-time responses |
| 🎚️ **Playback controls** | Adjustable speed, tap to interrupt, voice interrupt |
| 🖼️ **Image generation** | DALL-E, Gemini, ComfyUI, AUTOMATIC1111, Lumenfall, Image Router |
| ✏️ **Image editing** | Inpainting and multi-image compositing via natural language |
| 🤖 **Agentic generation** | Models generate and edit images autonomously during chat |

---

## Supported Providers

### Speech-to-Text

| Provider | Runs locally | API key required |
|----------|:---:|:---:|
| **Whisper** (default) | ✅ | ❌ |
| **OpenAI** (Whisper API) | ❌ | ✅ |
| **Mistral** (Voxtral) | ❌ | ✅ |
| **Deepgram** | ❌ | ✅ |
| **Azure** | ❌ | ✅ |
| **Web API** (browser-native) | ✅ | ❌ |

### Text-to-Speech

| Provider | Runs locally | API key required |
|----------|:---:|:---:|
| **OpenAI TTS** | ❌ | ✅ |
| **ElevenLabs** | ❌ | ✅ |
| **Azure** | ❌ | ✅ |
| **Kokoro** | ✅ | ❌ |
| **Chatterbox** | ✅ | ❌ |
| **openedai-speech** | ✅ | ❌ |
| **Web API** (browser-native) | ✅ | ❌ |

### Image Generation

| Engine | Type |
|--------|------|
| **DALL-E** (OpenAI) | Cloud API |
| **Gemini** | Cloud API |
| **ComfyUI** | Self-hosted, node-based workflows |
| **AUTOMATIC1111** | Self-hosted Stable Diffusion |
| **Lumenfall** | Cloud API |
| **Image Router** | Multi-provider proxy |

---

## Use Cases

### Voice-driven research

You are reviewing a dense paper on your phone. Instead of typing, you hold the microphone and ask, "Summarize the methodology in section 3." The AI transcribes your question, answers in text, and reads the summary aloud while you keep your eyes on the road.

### Agentic creative workflow

A designer describes a concept in chat: "Generate a hero image for our landing page, dark gradient background, abstract geometric shapes, our brand colors." The model calls `generate_image`, renders the result inline, and then the designer uploads the output and says "Make the shapes more angular and add a subtle grid overlay." The AI edits the image in place.

### Multilingual voice interface

A customer support team configures Whisper with `WHISPER_MULTILINGUAL=true` and a larger model. Agents speak queries in any supported language, and transcription happens locally with no data leaving the server.

### Live video troubleshooting

A technician points their phone camera at a piece of equipment and starts a video call with a vision model. The AI sees the hardware, identifies the issue, and walks through the fix step by step while the technician keeps both hands free.

---

## Limitations

### Context window usage

Image generation and editing prompts consume tokens. Complex multi-step generation requests with large conversation histories may push against context window limits.

### Provider-dependent capabilities

Not all image engines support editing or compositing. DALL-E and ComfyUI have the broadest support. Check the engine-specific documentation for details.

### Local STT performance

Local Whisper runs on CPU by default. For faster transcription, use a larger model with GPU acceleration or switch to a cloud provider. The `:cuda` Docker image accelerates RAG embeddings but has minimal impact on Whisper speed for most users.

---

## Dive Deeper

| Topic | What you'll learn |
|-------|-------------------|
| [**Create & Edit Images**](image-generation-and-editing) | Engine setup (DALL-E, Gemini, ComfyUI, AUTOMATIC1111, Lumenfall), usage, editing, and compositing |
| [**Speech-to-Text & Text-to-Speech**](audio) | Provider configuration, environment variables, and integration guides |

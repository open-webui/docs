---
sidebar_position: 3
title: "LocalAI STT Integration"
---

# Local speech recognition with LocalAI

Open WebUI can send recorded speech to LocalAI through its OpenAI-compatible
transcription API. This guide uses LocalAI's Orukeet gallery model as a concrete
CPU example. Audio goes from your browser to your Open WebUI server and then to
your LocalAI server; it is not sent to OpenAI or Hugging Face.

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/tutorials/contributing-tutorial).

:::

## Prepare LocalAI

Install LocalAI using its [installation guide](https://localai.io/docs/getting-started/).
In a directory where you want to keep its models and configuration, install the
model and start a server reachable by Open WebUI:

```sh
local-ai backends install nemo-speech-cpp
local-ai models install orukeet
local-ai run --address 127.0.0.1:8081 --api-keys YOUR_LOCALAI_API_KEY
```

Choose your own LocalAI key and keep it on the server. The gallery installs the
`nemo-speech-cpp` model configuration and downloads the Q8 GGUF from Hugging Face
at a pinned revision with a SHA-256 check. The GGUF request uses Hugging Face's
[normal model-download accounting](https://huggingface.co/docs/hub/models-download-stats).
Keep the model cache for offline inference and reuse; no counting requests are
sent during recognition. The first model/backend installation needs network
access.

Orukeet's weights use **CC BY-SA 4.0**, retaining NVIDIA foundation attribution.
Review the [model card and notices](https://huggingface.co/oruk/orukeet) when
deploying or redistributing them. This example uses completed-recording
transcription with automatic language detection; it does not configure native
streaming, speaker labels or word timestamps.

Before connecting Open WebUI, check LocalAI with a short WAV:

```sh
curl http://127.0.0.1:8081/v1/audio/transcriptions \
  -H "Authorization: Bearer YOUR_LOCALAI_API_KEY" \
  -F "model=orukeet" \
  -F "file=@recording.wav"
```

The response should contain a `text` field. Silence may return an empty string.
LocalAI's [audio transcription reference](https://localai.io/docs/features/audio-to-text/)
describes the endpoint and other supported backends.

## Connect Open WebUI

Open the user menu, choose **Settings**, then select **Audio** under **Admin**.
On older versions, this is **Admin Panel → Settings → Audio**. Set:

| Setting               | Value                           |
| --------------------- | ------------------------------- |
| Speech-to-Text Engine | `OpenAI`                        |
| API Base URL          | `http://127.0.0.1:8081/v1`      |
| API Key               | The LocalAI key you chose above |
| Request Format        | `Multipart Upload`              |
| STT Model             | `orukeet`                       |

Save, then keep the user-level speech-to-text engine at **Default**. The
**OpenAI** setting selects a compatible API format; the base URL determines
which server receives the audio. The **Web API** user setting uses the browser's
speech service instead of this server configuration.

The base URL is resolved by the **Open WebUI server**, not the browser. If Open
WebUI runs in Docker, `127.0.0.1` points to that container. Use a LocalAI service
name on a shared Docker network, or an appropriate host address such as
`host.docker.internal`. LocalAI must listen on an address reachable from that
container; restrict access and retain authentication when exposing it beyond
localhost.

For a new Open WebUI instance, the equivalent environment variables are:

```sh
AUDIO_STT_ENGINE=openai
AUDIO_STT_OPENAI_API_BASE_URL=http://127.0.0.1:8081/v1
AUDIO_STT_OPENAI_API_KEY=YOUR_LOCALAI_API_KEY
AUDIO_STT_OPENAI_API_REQUEST_FORMAT=multipart
AUDIO_STT_MODEL=orukeet
```

Existing persistent settings may override startup environment values. Update
and save the admin Audio settings if the server still calls an old endpoint.

Click the microphone in a chat, record a short utterance and finish recording.
The final transcription should appear in the message input. Open WebUI's chat
model can be configured separately; no change to its LLM endpoint is needed.

## Troubleshooting

- **Connection refused:** test the LocalAI URL from the Open WebUI server or
  container. Check its port and bind address.
- **Unauthorized:** use the same key in LocalAI and Open WebUI's Audio settings.
- **Unsupported request:** select **Multipart Upload**, not **JSON Base64**.
- **Model missing:** the STT model value must match the installed LocalAI name
  (`orukeet`), not its GGUF filename or Hugging Face repository ID.
- **Old provider still used:** verify saved admin settings and the user's
  **Default** speech-to-text engine.
- **Slow first recording:** initial backend/model loading happens before the
  first result. Test the LocalAI endpoint directly before troubleshooting the
  browser.

See [audio troubleshooting](/troubleshooting/audio) for microphone permissions,
accepted file types and HTTPS requirements.

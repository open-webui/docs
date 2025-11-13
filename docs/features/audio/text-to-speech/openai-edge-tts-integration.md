---
sidebar_position: 1
title: "Edge TTS Using Docker"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# Integrating `openai-edge-tts` 🗣️ with Open WebUI

## What is `openai-edge-tts`?

[OpenAI Edge TTS](https://github.com/travisvn/openai-edge-tts) is a text-to-speech API that mimics the OpenAI API endpoint, allowing for a direct substitute in scenarios where you can define the endpoint URL, like with Open WebUI.

It uses the [edge-tts](https://github.com/rany2/edge-tts) package, which leverages the Edge browser's free "Read Aloud" feature to emulate a request to Microsoft / Azure in order to receive very high quality text-to-speech for free.

[Sample the voices](https://tts.travisvn.com)

<!-- markdownlint-disable-next-line MD033 -->
<details>
  <!-- markdownlint-disable-next-line MD033 -->
<summary>How is it different from 'openedai-speech'?</summary>

Similar to [openedai-speech](https://github.com/matatonic/openedai-speech), [openai-edge-tts](https://github.com/travisvn/openai-edge-tts) is a text-to-speech API endpoint that mimics the OpenAI API endpoint, allowing for a direct substitute in scenarios where the OpenAI Speech endpoint is callable and the server endpoint URL can be configured.

`openedai-speech` is a more comprehensive option that allows for entirely offline generation of speech with many modalities to choose from.

`openai-edge-tts` is a simpler option that uses a Python package called `edge-tts` to generate the audio.

</details>

## Requirements

- Docker installed on your system
- Open WebUI running

## ⚡️ Quick start

The simplest way to get started without having to configure anything is to run the command below

```bash
docker run -d -p 5050:5050 travisvn/openai-edge-tts:latest
```

This will run the service at port 5050 with all the default configs

## Setting up Open WebUI to use `openai-edge-tts`

- Open the Admin Panel and go to `Settings` -> `Audio`
- Set your TTS Settings to match the screenshot below
- *Note: you can specify the TTS Voice here*

![Screenshot of Open WebUI Admin Settings for Audio adding the correct endpoints for this project](https://utfs.io/f/MMMHiQ1TQaBobmOhsMkrO6Tl2kxX39dbuFiQ8cAoNzysIt7f)

:::info

The default API key is the string `your_api_key_here`. You do not have to change that value if you do not need the added security.

:::

**And that's it! You can end here**

## Please ⭐️ star the repo on GitHub if you find [OpenAI Edge TTS](https://github.com/travisvn/openai-edge-tts) useful

<!-- markdownlint-disable-next-line MD033 -->
<details>
  <!-- markdownlint-disable-next-line MD033 -->
<summary>Running with Python</summary>

### 🐍 Running with Python

If you prefer to run this project directly with Python, follow these steps to set up a virtual environment, install dependencies, and start the server.

#### 1. Clone the Repository

```bash
git clone https://github.com/travisvn/openai-edge-tts.git
cd openai-edge-tts
```

#### 2. Set Up a Virtual Environment

Create and activate a virtual environment to isolate dependencies:

```bash

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate

# For Windows
python -m venv venv
venv\Scripts\activate
```

#### 3. Install Dependencies

Use `pip` to install the required packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

#### 4. Configure Environment Variables

Create a `.env` file in the root directory and set the following variables:

```plaintext
API_KEY=your_api_key_here
PORT=5050

DEFAULT_VOICE=en-US-AvaNeural
DEFAULT_RESPONSE_FORMAT=mp3
DEFAULT_SPEED=1.0

DEFAULT_LANGUAGE=en-US

REQUIRE_API_KEY=True
REMOVE_FILTER=False
EXPAND_API=True
```

#### 5. Run the Server

Once configured, start the server with:

```bash
python app/server.py
```

The server will start running at `http://localhost:5050`.

#### 6. Test the API

You can now interact with the API at `http://localhost:5050/v1/audio/speech` and other available endpoints. See the Usage section for request examples.

</details>

<!-- markdownlint-disable-next-line MD033 -->
<details>
  <!-- markdownlint-disable-next-line MD033 -->
<summary>Usage details</summary>

##### Endpoint: `/v1/audio/speech` (aliased with `/audio/speech`)

Generates audio from the input text. Available parameters:

**Required Parameter:**

- **input** (string): The text to be converted to audio (up to 4096 characters).

**Optional Parameters:**

- **model** (string): Set to "tts-1" or "tts-1-hd" (default: `"tts-1"`).
- **voice** (string): One of the OpenAI-compatible voices (alloy, echo, fable, onyx, nova, shimmer) or any valid `edge-tts` voice (default: `"en-US-AvaNeural"`).
- **response_format** (string): Audio format. Options: `mp3`, `opus`, `aac`, `flac`, `wav`, `pcm` (default: `mp3`).
- **speed** (number): Playback speed (0.25 to 4.0). Default is `1.0`.

:::tip

You can browse available voices and listen to sample previews at [tts.travisvn.com](https://tts.travisvn.com)

:::

Example request with `curl` and saving the output to an mp3 file:

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "input": "Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.",
    "voice": "echo",
    "response_format": "mp3",
    "speed": 1.0
  }' \
  --output speech.mp3
```

Or, to be in line with the OpenAI API endpoint parameters:

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "tts-1",
    "input": "Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

And an example of a language other than English:

```bash
curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "tts-1",
    "input": "じゃあ、行く。電車の時間、調べておくよ。",
    "voice": "ja-JP-KeitaNeural"
  }' \
  --output speech.mp3
```

##### Additional Endpoints

- **POST/GET /v1/models**: Lists available TTS models.
- **POST/GET /v1/voices**: Lists `edge-tts` voices for a given language / locale.
- **POST/GET /v1/voices/all**: Lists all `edge-tts` voices, with language support information.

:::info

The `/v1` is now optional.

Additionally, there are endpoints for **Azure AI Speech** and **ElevenLabs** for potential future support if custom API endpoints are allowed for these options in Open WebUI.

These can be disabled by setting the environment variable `EXPAND_API=False`.

:::

</details>

## 🐳 Quick Config for Docker

You can configure the environment variables in the command used to run the project

```bash
docker run -d -p 5050:5050 \
  -e API_KEY=your_api_key_here \
  -e PORT=5050 \
  -e DEFAULT_VOICE=en-US-AvaNeural \
  -e DEFAULT_RESPONSE_FORMAT=mp3 \
  -e DEFAULT_SPEED=1.0 \
  -e DEFAULT_LANGUAGE=en-US \
  -e REQUIRE_API_KEY=True \
  -e REMOVE_FILTER=False \
  -e EXPAND_API=True \
  travisvn/openai-edge-tts:latest
```

:::note

The markdown text is now put through a filter for enhanced readability and support.

You can disable this by setting the environment variable `REMOVE_FILTER=True`.

:::

## Additional Resources

For more information on `openai-edge-tts`, you can visit the [GitHub repo](https://github.com/travisvn/openai-edge-tts)

For direct support, you can visit the [Voice AI & TTS Discord](https://tts.travisvn.com/discord)

## 🎙️ Voice Samples

[Play voice samples and see all available Edge TTS voices](https://tts.travisvn.com/)

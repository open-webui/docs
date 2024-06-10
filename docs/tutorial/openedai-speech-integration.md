---
sidebar_position: 11
title: "Integrating OpenedAI-Speech with Open WebUI using Docker Desktop"
---

Integrating `openedai-speech` into Open WebUI using Docker Desktop
================================================================

**What is `openedai-speech`?**
-----------------------------

:::info:
[openedai-speech](https://github.com/matatonic/openedai-speech) is an OpenAI API compatible text-to-speech server that uses Coqui AI's `xtts_v2` and/or `Piper TTS` as the backend. It's a free, private, text-to-speech server that allows for custom voice cloning and is compatible with the OpenAI audio/speech API.
:::

**Prerequisites**
---------------

* Docker Desktop installed on your system
* Open WebUI running in a Docker container
* A basic understanding of Docker and Docker Compose

**Option 1: Using Docker Compose**
---------------------------------

**Step 1: Create a new folder for the `openedai-speech` service**
---------------------------------------------------------

Create a new folder, for example, `openedai-speech-service`, to store the `docker-compose.yml` and `.env` files.

**Step 2: Create a `docker-compose.yml` file**
------------------------------------------

In the `openedai-speech-service` folder, create a new file named `docker-compose.yml` with the following contents:
```yaml
services:
  server:
    image: ghcr.io/matatonic/openedai-speech
    container_name: openedai-speech
    env_file: .env
    ports:
      - "8000:8000"
    volumes:
      - tts-voices:/app/voices
      - tts-config:/app/config
    # labels:
    #   - "com.centurylinklabs.watchtower.enable=true"
    restart: unless-stopped

volumes:
  tts-voices:
  tts-config:
```
**Step 3: Create an `.env` file (optional)**
-----------------------------------------

In the same `openedai-speech-service` folder, create a new file named `.env` with the following contents:
```yaml
TTS_HOME=voices
HF_HOME=voices
#PRELOAD_MODEL=xtts
#PRELOAD_MODEL=xtts_v2.0.2
#PRELOAD_MODEL=parler-tts/parler_tts_mini_v0.1
```
**Step 4: Run `docker-compose` to start the `openedai-speech` service**
---------------------------------------------------------

Run the following command in the `openedai-speech-service` folder to start the `openedai-speech` service in detached mode:
```yaml
docker compose up -d
```
This will start the `openedai-speech` service in the background.

**Option 2: Using Docker Run Commands**
-------------------------------------

You can also use the following Docker run commands to start the `openedai-speech` service in detached mode:

**With GPU (Nvidia CUDA) support:**
```yaml
docker run -d --gpus=all -p 8000:8000 -v tts-voices:/app/voices -v tts-config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech:latest
```
**Alternative without GPU support:**
```yaml
docker run -d -p 8000:8000 -v tts-voices:/app/voices -v tts-config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech-min:latest
```
**Configuring Open WebUI**
-------------------------

:::tip:
For more information on configuring Open WebUI to use `openedai-speech`, including setting environment variables, see the [Open WebUI documentation](https://docs.openwebui.com/getting-started/env-configuration/#text-to-speech).
:::

**Step 5: Configure Open WebUI to use `openedai-speech`**
---------------------------------------------------------

Open the Open WebUI settings and navigate to the TTS Settings under **Admin Panel > Settings > Audio**. Add the following configuration as shown in the following image:

![openedai-tts](https://github.com/silentoplayz/docs/assets/50341825/ea08494f-2ebf-41a2-bb0f-9b48dd3ace79)

* **API Base URL**: `http://host.docker.internal:8000/v1`
* **API Key**: `sk-111111111` (note: this is a dummy API key, as `openedai-speech` doesn't require an API key; you can use whatever for this field)

**Step 6: Choose a voice**
-------------------------

Under `TTS Voice` within the same audio settings menu in the admin panel, you can set the `TTS Model` to use from the following choices below that `openedai-speech` supports. The voices of these models are optimized for the English language.

* `tts-1` or `tts-1-hd`: `alloy`, `echo`, `echo-alt`, `fable`, `onyx`, `nova`, and `shimmer` (`tts-1-hd` is configurable; uses OpenAI samples by default)

**Model Details:**

* `tts-1` via [Piper TTS](https://github.com/rhasspy/piper) (very fast, runs on CPU): You can map your own [Piper voices](https://rhasspy.github.io/piper-samples/) via the `voice_to_speaker.yaml` configuration file.
* `tts-1-hd` via [Coqui AI/TTS](https://github.com/coqui-ai/TTS) XTTS v2 voice cloning (fast, but requires around 4GB GPU VRAM & Nvidia GPU with CUDA): Custom cloned voices can be used for `tts-1-hd`. See: [Custom Voices Howto](https://github.com/matatonic/openedai-speech/blob/main/docs/custom_voices.md)
	+ [Multilingual Support](https://github.com/matatonic/openedai-speech#multilingual) with XTTS voices

* Beta [parler-tts](https://huggingface.co/parler-tts/parler_tts_mini_v0.1) support (you can describe very basic features of the speaker voice), See: (https://www.text-description-to-speech.com/) for some examples of how to describe voices. Voices can be defined in the `voice_to_speaker.default.yaml`. Two example [parler-tts](https://huggingface.co/parler-tts/parler_tts_mini_v0.1) voices are included in the `voice_to_speaker.default.yaml` file. `parler-tts` is experimental software and is on the slower side. The exact voice will be slightly different each generation but should be similar to the basic description.

**Step 7: Press `Save` to apply the changes and start enjoying naturally sounding voices**
--------------------------------------------------------------------------------------------

Press the `Save` button to apply the changes to your Open WebUI settings and enjoy using `openedai-speech` integration within Open WebUI to generate naturally sounding voice responses with text-to-speech.

**Troubleshooting**
-------------------

If you encounter any issues, make sure that:

* The `openedai-speech` service is running and the port you set in the docker-compose.yml file is exposed.
* The `host.docker.internal` hostname is resolvable from within the Open WebUI container. `host.docker.internal` is required since `openedai-speech` is exposed via `localhost` on your PC, but `open-webui` cannot normally access this from within its container.
* The API key is set to a dummy value, as `openedai-speech` doesn't require an API key.

**FAQ**
----

**How can I control the emotional range of the generated audio?**

There is no direct mechanism to control the emotional output of the audio generated. Certain factors may influence the output audio like capitalization or grammar, but internal tests have yielded mixed results.

**Additional Resources**
-------------------------

For more information on `openedai-speech`, please visit the [GitHub repository](https://github.com/matatonic/openedai-speech).

:::note:
You can change the port number in the `docker-compose.yml` file to any open and usable port, but make sure to update the **API Base URL** in Open WebUI Admin Audio settings accordingly.
:::

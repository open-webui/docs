---
sidebar_position: 11
title: "Integrating OpenedAI-Speech with Open WebUI using Docker Desktop"
---

Integrating `openedai-speech` into Open WebUI using Docker Desktop
================================================================

**What is `openedai-speech`?**
-----------------------------

[openedai-speech](https://github.com/matatonic/openedai-speech) is an OpenAI API compatible text-to-speech server that uses Coqui AI's `xtts_v2` and/or `Piper TTS` as the backend. It's a free, private, text-to-speech server that allows for custom voice cloning and is compatible with the OpenAI audio/speech API.

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
```
TTS_HOME=voices
HF_HOME=voices
#PRELOAD_MODEL=xtts
#PRELOAD_MODEL=xtts_v2.0.2
#PRELOAD_MODEL=parler-tts/parler_tts_mini_v0.1
```
**Step 4: Run `docker-compose` to start the `openedai-speech` service**
---------------------------------------------------------

Run the following command in the `openedai-speech-service` folder to start the `openedai-speech` service in detached mode:
```
docker compose up -d
```
This will start the `openedai-speech` service in the background.

**Option 2: Using Docker Run Commands**
-------------------------------------

You can also use the following Docker run commands to start the `openedai-speech` service in detached mode:

**With GPU (Nvidia) support:**
```bash
docker run -d --gpus=all -p 8000:8000 -v tts-voices:/app/voices -v tts-config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech:latest
```
**Alternative without GPU support:**
```bash
docker run -d -p 8000:8000 -v tts-voices:/app/voices -v tts-config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech-min:latest
```
**Step 5: Configure Open WebUI to use `openedai-speech`**
---------------------------------------------------------

Open the Open WebUI settings and navigate to the TTS Settings under Admin Panel > Settings > Audio. Add the following configuration:

* **API Base URL**: `http://host.docker.internal:8000/v1`
* **API Key**: `sk-111111111` (note: this is a dummy API key, as `openedai-speech` doesn't require an API key; you can use whatever for this field)

**Step 6: Choose a voice**
-------------------------

Under Set Voice, you can choose from the following voices:

* alloy
* echo
* echo-alt
* fable
* onyx
* nova
* shimmer

**Step 7: Enjoy naturally sounding voices**
-----------------------------------------

You should now be able to use the `openedai-speech` integration with Open WebUI to generate naturally sounding voices.

**Troubleshooting**
-------------------

If you encounter any issues, make sure that:

* The `openedai-speech` service is running and the port you set in the docker-compose.yml file is exposed.
* The `host.docker.internal` hostname is resolvable from within the Open WebUI container. `host.docker.internal` is required since `openedai-speech` is exposed via `localhost` on your PC, but `open-webui` cannot normally access this from within its container.
* The API key is set to a dummy value, as `openedai-speech` doesn't require an API key.

**Additional Resources**
-------------------------

For more information on `openedai-speech`, please visit the [GitHub repository](https://github.com/matatonic/openedai-speech).

Note: You can change the port number in the `docker-compose.yml` file to any open and usable port, but make sure to update the **API Base URL** in Open WebUI Admin Audio settings accordingly.

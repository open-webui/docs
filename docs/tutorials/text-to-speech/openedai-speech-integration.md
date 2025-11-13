---
sidebar_position: 2
title: "Openedai-speech Using Docker"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Integrating `openedai-speech` into Open WebUI using Docker

## What is `openedai-speech`?

:::info

[openedai-speech](https://github.com/matatonic/openedai-speech) is an OpenAI audio/speech API compatible text-to-speech server.

It serves the `/v1/audio/speech` endpoint and provides a free, private text-to-speech experience with custom voice cloning capabilities. This service is in no way affiliated with OpenAI and does not require an OpenAI API key.

:::

## Requirements

- Docker installed on your system
- Open WebUI running in a Docker container
- Basic understanding of Docker and Docker Compose

## Option 1: Using Docker Compose

## Step 1: Create a new folder for the `openedai-speech` service

Create a new folder, for example, `openedai-speech-service`, to store the `docker-compose.yml` and `speech.env` files.

## Step 2: Clone the `openedai-speech` repository from GitHub

```bash
git clone https://github.com/matatonic/openedai-speech.git
```

This will download the `openedai-speech` repository to your local machine, which includes the Docker Compose files (`docker-compose.yml`, `docker-compose.min.yml`, and `docker-compose.rocm.yml`) and other necessary files.

## Step 3: Rename the `sample.env` file to `speech.env` (Customize if needed)

In the `openedai-speech` repository folder, create a new file named `speech.env` with the following contents:

```yaml
TTS_HOME=voices
HF_HOME=voices

#PRELOAD_MODEL=xtts

#PRELOAD_MODEL=xtts_v2.0.2

#PRELOAD_MODEL=parler-tts/parler_tts_mini_v0.1

#EXTRA_ARGS=--log-level DEBUG --unload-timer 300

#USE_ROCM=1
```

## Step 4: Choose a Docker Compose file

You can use any of the following Docker Compose files:

- [docker-compose.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.yml): This file uses the `ghcr.io/matatonic/openedai-speech` image and builds from [Dockerfile](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile).
- [docker-compose.min.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.min.yml): This file uses the `ghcr.io/matatonic/openedai-speech-min` image and builds from [Dockerfile.min](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile.min).
  This image is a minimal version that only includes Piper support and does not require a GPU.
- [docker-compose.rocm.yml](https://github.com/matatonic/openedai-speech/blob/main/docker-compose.rocm.yml): This file uses the `ghcr.io/matatonic/openedai-speech-rocm` image and builds from [Dockerfile](https://github.com/matatonic/openedai-speech/blob/main/Dockerfile) with ROCm support.

## Step 4: Build the Chosen Docker Image

Before running the Docker Compose file, you need to build the Docker image:

- **Nvidia GPU (CUDA support)**:

```bash
docker build -t ghcr.io/matatonic/openedai-speech .
```

- **AMD GPU (ROCm support)**:

```bash
docker build -f Dockerfile --build-arg USE_ROCM=1 -t ghcr.io/matatonic/openedai-speech-rocm .
```

- **CPU only, No GPU (Piper only)**:

```bash
docker build -f Dockerfile.min -t ghcr.io/matatonic/openedai-speech-min .
```

## Step 5: Run the correct `docker compose up -d` command

- **Nvidia GPU (CUDA support)**: Run the following command to start the `openedai-speech` service in detached mode:

```bash
docker compose up -d
```

- **AMD GPU (ROCm support)**: Run the following command to start the `openedai-speech` service in detached mode:

```bash
docker compose -f docker-compose.rocm.yml up -d
```

- **ARM64 (Apple M-series, Raspberry Pi)**: XTTS only has CPU support here and will be very slow. You can use the Nvidia image for XTTS with CPU (slow), or use the Piper only image (recommended):

```bash
docker compose -f docker-compose.min.yml up -d
```

- **CPU only, No GPU (Piper only)**: For a minimal docker image with only Piper support (< 1GB vs. 8GB):

```bash
docker compose -f docker-compose.min.yml up -d
```

This will start the `openedai-speech` service in detached mode.

## Option 2: Using Docker Run Commands

You can also use the following Docker run commands to start the `openedai-speech` service in detached mode:

- **Nvidia GPU (CUDA)**: Run the following command to build and start the `openedai-speech` service:

```bash
docker build -t ghcr.io/matatonic/openedai-speech .
docker run -d --gpus=all -p 8000:8000 -v voices:/app/voices -v config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech
```

- **ROCm (AMD GPU)**: Run the following command to build and start the `openedai-speech` service:

> To enable ROCm support, uncomment the `#USE_ROCM=1` line in the `speech.env` file.

```bash
docker build -f Dockerfile --build-arg USE_ROCM=1 -t ghcr.io/matatonic/openedai-speech-rocm .
docker run -d --privileged --init --name openedai-speech -p 8000:8000 -v voices:/app/voices -v config:/app/config ghcr.io/matatonic/openedai-speech-rocm
```

- **CPU only, No GPU (Piper only)**: Run the following command to build and start the `openedai-speech` service:

```bash
docker build -f Dockerfile.min -t ghcr.io/matatonic/openedai-speech-min .
docker run -d -p 8000:8000 -v voices:/app/voices -v config:/app/config --name openedai-speech ghcr.io/matatonic/openedai-speech-min
```

## Step 6: Configuring Open WebUI to use `openedai-speech` for TTS

![openedai-tts](https://github.com/silentoplayz/docs/assets/50341825/ea08494f-2ebf-41a2-bb0f-9b48dd3ace79)

Open the Open WebUI settings and navigate to the TTS Settings under **Admin Panel > Settings > Audio**. Add the following configuration:

- **API Base URL**: `http://host.docker.internal:8000/v1`
- **API Key**: `sk-111111111` (Note that this is a dummy API key, as `openedai-speech` doesn't require an API key. You can use whatever you'd like for this field, as long as it is filled.)

## Step 7: Choose a voice

Under `TTS Voice` within the same audio settings menu in the admin panel, you can set the `TTS Model` to use from the following choices below that `openedai-speech` supports. The voices of these models are optimized for the English language.

- `tts-1` or `tts-1-hd`: `alloy`, `echo`, `echo-alt`, `fable`, `onyx`, `nova`, and `shimmer` (`tts-1-hd` is configurable; uses OpenAI samples by default)

## Step 8: Press `Save` to apply the changes and start enjoying naturally sounding voices

Press the `Save` button to apply the changes to your Open WebUI settings. Refresh the page for the change to fully take effect and enjoy using `openedai-speech` integration within Open WebUI to read aloud text responses with text-to-speech in a natural sounding voice.

## Model Details

`openedai-speech` supports multiple text-to-speech models, each with its own strengths and requirements. The following models are available:

- **Piper TTS** (very fast, runs on CPU): Use your own [Piper voices](https://rhasspy.github.io/piper-samples/) via the `voice_to_speaker.yaml` configuration file. This model is great for applications that require low latency and high performance. Piper TTS also supports [multilingual](https://github.com/matatonic/openedai-speech#multilingual) voices.
- **Coqui AI/TTS XTTS v2** (fast, but requires around 4GB GPU VRAM & Nvidia GPU with CUDA): This model uses Coqui AI's XTTS v2 voice cloning technology to generate high-quality voices. While it requires a more powerful GPU, it provides excellent performance and high-quality audio. Coqui also supports [multilingual](https://github.com/matatonic/openedai-speech#multilingual) voices.
- **Beta Parler-TTS Support** (experimental, slower): This model uses the Parler-TTS framework to generate voices. While it's currently in beta, it allows you to describe very basic features of the speaker voice. The exact voice will be slightly different with each generation, but should be similar to the speaker description provided. For inspiration on how to describe voices, see [Text Description to Speech](https://www.text-description-to-speech.com/).

## Troubleshooting

If you encounter any problems integrating `openedai-speech` with Open WebUI, follow these troubleshooting steps:

- **Verify `openedai-speech` service**: Ensure that the `openedai-speech` service is running and the port you specified in the docker-compose.yml file is exposed.
- **Check access to host.docker.internal**: Verify that the hostname `host.docker.internal` is resolvable from within the Open WebUI container. This is necessary because `openedai-speech` is exposed via `localhost` on your PC, but `open-webui` cannot normally access it from inside its container. You can add a volume to the `docker-compose.yml` file to mount a file from the host to the container, for example, to a directory that will be served by openedai-speech.
- **Review API key configuration**: Make sure the API key is set to a dummy value or effectively left unchecked because `openedai-speech` doesn't require an API key.
- **Check voice configuration**: Verify that the voice you are trying to use for TTS exists in your `voice_to_speaker.yaml` file and the corresponding files (e.g., voice XML files) are present in the correct directory.
- **Verify voice model paths**: If you're experiencing issues with voice model loading, double-check that the paths in your `voice_to_speaker.yaml` file match the actual locations of your voice models.

## Additional Troubleshooting Tips

- Check the openedai-speech logs for errors or warnings that might indicate where the issue lies.
- Verify that the `docker-compose.yml` file is correctly configured for your environment.
- If you're still experiencing issues, try restarting the `openedai-speech` service or the entire Docker environment.
- If the problem persists, consult the `openedai-speech` GitHub repository or seek help on a relevant community forum.

## FAQ

**How can I control the emotional range of the generated audio?**

There is no direct mechanism to control the emotional output of the generated audio. Certain factors such as capitalization or grammar may affect the output audio, but internal testing has yielded mixed results.

**Where are the voice files stored? What about the configuration file?**.

The configuration files, which define the available voices and their properties, are stored in the config volume. Specifically, the default voices are defined in voice_to_speaker.default.yaml.

## Additional Resources

For more information on configuring Open WebUI to use `openedai-speech`, including setting environment variables, see the [Open WebUI documentation](https://docs.openwebui.com/getting-started/env-configuration#text-to-speech).

For more information about `openedai-speech`, please visit the [GitHub repository](https://github.com/matatonic/openedai-speech).

**How to add more voices to openedai-speech:**
[Custom-Voices-HowTo](https://github.com/matatonic/openedai-speech?tab=readme-ov-file#custom-voices-howto)

:::note

You can change the port number in the `docker-compose.yml` file to any open and usable port, but be sure to update the **API Base URL** in Open WebUI Admin Audio settings accordingly.

:::

## Quick Start with Docker 🐳

Follow these steps to install Open WebUI with Docker.

## Step 1: Pull the Open WebUI Image

Start by pulling the latest Open WebUI Docker image from the GitHub Container Registry.

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

### Slim Image Variant

For environments with limited storage or bandwidth, Open WebUI offers slim image variants that exclude pre-bundled models. These images are significantly smaller but download required models (whisper, embedding models) on first use.

```bash
docker pull ghcr.io/open-webui/open-webui:main-slim
```

## Step 2: Run the Container

Run the container with default settings. This command includes a volume mapping to ensure persistent data storage.

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

To use the slim variant instead:

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main-slim
```

### Important Flags

- **Volume Mapping (`-v open-webui:/app/backend/data`)**: Ensures persistent storage of your data. This prevents data loss between container restarts.
- **Port Mapping (`-p 3000:8080`)**: Exposes the WebUI on port 3000 of your local machine.

### Using GPU Support

For Nvidia GPU support, add `--gpus all` to the `docker run` command:

```bash
docker run -d -p 3000:8080 --gpus all -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:cuda
```

#### Single-User Mode (Disabling Login)

To bypass the login page for a single-user setup, set the `WEBUI_AUTH` environment variable to `False`:

```bash
docker run -d -p 3000:8080 -e WEBUI_AUTH=False -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

:::warning

You cannot switch between single-user mode and multi-account mode after this change.

:::

#### Advanced Configuration: Connecting to Ollama on a Different Server

To connect Open WebUI to an Ollama server located on another host, add the `OLLAMA_BASE_URL` environment variable:

```bash
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

## Access the WebUI

After the container is running, access Open WebUI at:

[http://localhost:3000](http://localhost:3000)

For detailed help on each Docker flag, see [Docker's documentation](https://docs.docker.com/engine/reference/commandline/run/).

# Manual Docker Setup

If you prefer to set up Docker manually, follow these steps for Open WebUI.

## Step 1: Pull the Open WebUI Image

Start by pulling the latest Open WebUI Docker image from the GitHub Container Registry.

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

## Step 2: Run the Container

Run the container with default settings. This command includes a volume mapping to ensure persistent data storage.

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

### Important Flags

- **Volume Mapping (`-v open-webui:/app/backend/data`)**: Ensures persistent storage of your data. This prevents data loss between container restarts.
- **Port Mapping (`-p 3000:8080`)**: Exposes the WebUI on port 3000 of your local machine.

### Using GPU Support

For Nvidia GPU support, add `--gpus all` to the `docker run` command:

```bash
docker run -d -p 3000:8080 --gpus all -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:cuda
```

## User Roles and Privacy

:::info **Important Note on User Roles and Privacy:**

- **Admin Creation**: The first account created on Open WebUI will have **Administrator privileges**, managing user access and system settings.
- **User Registrations**: Additional accounts start with a **Pending** status, requiring Administrator approval for access.
- **Data Security**: **All your data** is stored locally on your device, ensuring **privacy** and **no external requests**. Open WebUI does not transmit data externally by default.

:::

## Single-User Mode (Disabling Login)

To bypass the login page for a single-user setup, set the `WEBUI_AUTH` environment variable to `False`:

```bash
docker run -d -p 3000:8080 -e WEBUI_AUTH=False -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

:::warning
You cannot switch between single-user mode and multi-account mode after this change.
:::

## Quick Start with Docker 🐳

### Essential Docker Command Options

For Docker installation, consider the following options:

- **Persistent Storage**: Use the `-v open-webui:/app/backend/data` option to ensure all application data remains available across sessions.
- **Exposing Ports**: Use the `-p` flag to map internal container ports to your system.

For example, if you're installing Open WebUI with data persistence and local-only port exposure, the command would be:

```bash
docker run -d -p 127.0.0.1:3000:8080 -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### Advanced Configuration: Connecting to Ollama on a Different Server

To connect Open WebUI to an Ollama server located on another host, add the `OLLAMA_BASE_URL` environment variable:

```bash
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### GPU Support with Nvidia

For running Open WebUI with Nvidia GPU support, use:

```bash
docker run -d -p 3000:8080 --gpus all -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
```

## Access the WebUI

After the container is running, access Open WebUI at:

[http://localhost:3000](http://localhost:3000)

For detailed help on each Docker flag, see [Docker's documentation](https://docs.docker.com/engine/reference/commandline/run/).

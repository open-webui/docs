## Quick Start with Docker

:::info
**WebSocket** support is required. Ensure your network configuration allows WebSocket connections.
:::

:::tip Docker Hub Now Available
Open WebUI images are published to **both** registries:
- **GitHub Container Registry:** `ghcr.io/open-webui/open-webui`
- **Docker Hub:** `openwebui/open-webui`

Both contain identical images. Replace `ghcr.io/open-webui/open-webui` with `openwebui/open-webui` in any command below.
:::

### 1. Pull the image

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

### 2. Run the container

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

| Flag | Purpose |
|------|---------|
| `-v open-webui:/app/backend/data` | Persistent storage. Prevents data loss between restarts. |
| `-p 3000:8080` | Exposes the UI on port 3000 of your machine. |

### 3. Open the UI

Visit [http://localhost:3000](http://localhost:3000).

---

## Image Variants

| Tag | Use case |
|-----|----------|
| `:main` | Standard image (recommended) |
| `:main-slim` | Smaller image, downloads Whisper and embedding models on first use |
| `:cuda` | Nvidia GPU support (add `--gpus all` to `docker run`) |
| `:ollama` | Bundles Ollama inside the container for an all-in-one setup |

### Specific release versions

For production environments, pin a specific version instead of using floating tags:

```bash
docker pull ghcr.io/open-webui/open-webui:v0.9.0
docker pull ghcr.io/open-webui/open-webui:v0.9.0-cuda
docker pull ghcr.io/open-webui/open-webui:v0.9.0-ollama
```

---

## Common Configurations

### GPU support (Nvidia)

```bash
docker run -d -p 3000:8080 --gpus all -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:cuda
```

### Bundled with Ollama

A single container with Open WebUI and Ollama together:

**With GPU:**
```bash
docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
```

**CPU only:**
```bash
docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
```

### Connecting to Ollama on a different server

```bash
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### Single-user mode (no login)

```bash
docker run -d -p 3000:8080 -e WEBUI_AUTH=False -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

:::warning
You cannot switch between single-user mode and multi-account mode after this change.
:::

---

## Using the Dev Branch

:::tip
Testing dev builds is one of the most valuable ways to contribute. Run it on a test instance and report issues on [GitHub](https://github.com/open-webui/open-webui/issues).
:::

The `:dev` tag contains the latest features before they reach a stable release.

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:dev
```

:::warning
**Never share your data volume between dev and production.** Dev builds may include database migrations that are not backward-compatible. Always use a separate volume (e.g., `-v open-webui-dev:/app/backend/data`).
:::

If Docker is not your preference, follow the [Developing Open WebUI](/getting-started/advanced-topics/development).

---

## Uninstall

1. **Stop and remove the container:**
    ```bash
    docker rm -f open-webui
    ```

2. **Remove the image (optional):**
    ```bash
    docker rmi ghcr.io/open-webui/open-webui:main
    ```

3. **Remove the volume (optional, deletes all data):**
    ```bash
    docker volume rm open-webui
    ```

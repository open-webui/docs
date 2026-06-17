# Docker Compose Setup

Using Docker Compose simplifies the management of multi-container Docker applications.

Docker Compose requires an additional package, `docker-compose-v2`.

:::warning

**Warning:** Older Docker Compose tutorials may reference version 1 syntax, which uses commands like `docker-compose build`. Ensure you use version 2 syntax, which uses commands like `docker compose build` (note the space instead of a hyphen).

:::

## Example `docker-compose.yml`

Here is an example configuration file for setting up Open WebUI with Docker Compose:

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
volumes:
  open-webui:
```

### Using Slim Images

For environments with limited storage or bandwidth, you can use the slim image variant that excludes pre-bundled models:

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main-slim
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
volumes:
  open-webui:
```

:::note

**Note:** Slim images download required models (whisper, embedding models) on first use, which may result in longer initial startup times but significantly smaller image sizes.

:::

## Starting the Services

To start your services, run the following command:

```bash
docker compose up -d
```

## Helper Scripts

A set of helper scripts is included with the codebase to streamline common Docker workflows:

- `docker-compose-launcher.sh`: Interactive Compose launcher with GPU auto-detection, configurable WebUI/API ports, host data mounts, and optional Playwright support. Run `./docker-compose-launcher.sh --help` for the full list of flags. Use `--drop` to tear down the project.
- `docker-cleanup.sh`: Stops the Compose project and **deletes all volumes**, including persistent data. Prompts for confirmation before destroying data.
- `docker-run.sh`: Builds the Open WebUI image and runs a single container, exposing it on `OPEN_WEBUI_PORT` (default `3000`).
- `docker-ollama.sh`: Pulls and runs the official Ollama container with optional GPU passthrough, exposing it on `OLLAMA_PORT` (default `11434`).
- `docker-update-models.sh`: Iterates through every model installed in the Ollama container and pulls the latest version.

---

:::note

**Note:** For Nvidia GPU support, you change the image from `ghcr.io/open-webui/open-webui:main` to `ghcr.io/open-webui/open-webui:cuda` and add the following to your service definition in the `docker-compose.yml` file:

:::

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

This setup ensures that your application can leverage GPU resources when available.

## Uninstall

To uninstall Open WebUI running with Docker Compose, follow these steps:

1.  **Stop and Remove the Services:**
    Run this command in the directory containing your `docker-compose.yml` file:
    ```bash
    docker compose down
    ```

2.  **Remove the Volume (Optional, WARNING: Deletes all data):**
    If you want to completely remove your data (chats, settings, etc.):
    ```bash
    docker compose down -v
    ```
    Or manually:
    ```bash
    docker volume rm <your_project_name>_open-webui
    ```

3.  **Remove the Image (Optional):**
    ```bash
    docker rmi ghcr.io/open-webui/open-webui:main
    ```

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

## Helper Script

A useful helper script called `run-compose.sh` is included with the codebase. This script assists in choosing which Docker Compose files to include in your deployment, streamlining the setup process.

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

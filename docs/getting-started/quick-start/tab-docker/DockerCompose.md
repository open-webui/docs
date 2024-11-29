# Docker Compose Setup

Using Docker Compose simplifies the management of multi-container Docker applications.

If you don't have Docker installed, check out our [Docker installation tutorial](../../../tutorials/integrations/docker-install.md).

Docker Compose requires an additional package, `docker-compose-v2`.

**Warning:** Older Docker Compose tutorials may reference version 1 syntax, which uses commands like `docker-compose build`. Ensure you use version 2 syntax, which uses commands like `docker compose build` (note the space instead of a hyphen).

## Example `docker-compose.yml` 

Here are example configuration files for setting up Open WebUI with Docker Compose:

### Ollama already running

```yaml
version: '3'
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

### Ollama not yet running, bundled together with Webui

```yaml
services:
  ollama:
    volumes:
      - ollama:/root/.ollama
    container_name: ollama
    pull_policy: always
    tty: true
    restart: unless-stopped
    image: ollama/ollama:${OLLAMA_DOCKER_TAG-latest}

  open-webui:
    build:
      context: .
      args:
        OLLAMA_BASE_URL: '/ollama'
      dockerfile: Dockerfile
    image: ghcr.io/open-webui/open-webui:${WEBUI_DOCKER_TAG-main}
    container_name: open-webui
    volumes:
      - open-webui:/app/backend/data
    depends_on:
      - ollama
    ports:
      - ${OPEN_WEBUI_PORT-3000}:8080
    environment:
      - 'OLLAMA_BASE_URL=http://ollama:11434'
      - 'WEBUI_SECRET_KEY='
    extra_hosts:
      - host.docker.internal:host-gateway
    restart: unless-stopped

volumes:
  ollama: {}
  open-webui: {}
```

## Starting the Services

To start your services, run the following command:

```bash
docker compose up -d
```

## Helper Script

A useful helper script called `run-compose.sh` is included with the codebase. This script assists in choosing which Docker Compose files to include in your deployment, streamlining the setup process.

---

**Note:** For Nvidia GPU support, add the following to your service definition in the `docker-compose.yml` file:

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

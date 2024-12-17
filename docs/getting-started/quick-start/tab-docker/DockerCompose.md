# Docker Compose Setup

Using Docker Compose simplifies the management of multi-container Docker applications.

If you don't have Docker installed, check out our [Docker installation tutorial](../../../tutorials/integrations/docker-install.md).

Docker Compose requires an additional package, `docker-compose-v2`.

**Warning:** Older Docker Compose tutorials may reference version 1 syntax, which uses commands like `docker-compose build`. Ensure you use version 2 syntax, which uses commands like `docker compose build` (note the space instead of a hyphen).

## Example `docker-compose.yml`

Here is an example configuration file for setting up Open WebUI with Docker Compose:

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

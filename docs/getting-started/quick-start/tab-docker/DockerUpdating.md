

# Docker Compose Setup

Using Docker Compose simplifies the management of multi-container Docker applications.

## Example `docker-compose.yml`

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

To start your services, run:

```bash
docker compose up -d
```

---

**Note:** For Nvidia GPU support, add the following to your service definition:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

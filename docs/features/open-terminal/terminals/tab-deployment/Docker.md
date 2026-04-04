## Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/) installed and running
- Open WebUI running (or ready to deploy alongside)
- [Open WebUI Enterprise License](https://openwebui.com/enterprise) (required for production use)

## Quick start with Docker Compose

This Compose file deploys Open WebUI and the Terminals orchestrator together.

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    environment:
      - >-
        TERMINAL_SERVER_CONNECTIONS=[{
          "id": "terminals",
          "name": "Terminals",
          "enabled": true,
          "url": "http://terminals:3000",
          "key": "${TERMINALS_API_KEY}",
          "auth_type": "bearer",
          "config": {
            "access_grants": [{
              "principal_type": "user",
              "principal_id": "*",
              "permission": "read"
            }]
          }
        }]
    volumes:
      - open-webui:/app/backend/data
    networks:
      - webui
    depends_on:
      - terminals

  terminals:
    image: ghcr.io/open-webui/terminals:latest
    environment:
      - TERMINALS_BACKEND=docker
      - TERMINALS_API_KEY=${TERMINALS_API_KEY}
      - TERMINALS_IMAGE=ghcr.io/open-webui/open-terminal:latest
      - TERMINALS_NETWORK=open-webui-network
      - TERMINALS_IDLE_TIMEOUT_MINUTES=30
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - terminals-data:/app/data
    networks:
      - webui

volumes:
  open-webui:
  terminals-data:

networks:
  webui:
    name: open-webui-network
```

Set the shared API key in a `.env` file next to your Compose file:

```env
TERMINALS_API_KEY=change-me-to-a-strong-random-value
```

Then start everything:

```bash
docker compose up -d
```

Open WebUI will be available at `http://localhost:3000`. When any user activates a terminal, the orchestrator provisions their personal container automatically.

:::warning Docker socket access
The orchestrator needs access to the Docker socket (`/var/run/docker.sock`) to manage containers. For production, use a Docker socket proxy like [Tecnativa/docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy) to restrict the API calls it can make.
:::

---

<details>
<summary>Configuration reference</summary>

| Variable | Default | Description |
| :--- | :--- | :--- |
| `TERMINALS_BACKEND` | `docker` | Backend type. Set to `docker` for this deployment mode. |
| `TERMINALS_API_KEY` | (empty) | Shared secret for authenticating requests from Open WebUI. Required. |
| `TERMINALS_IMAGE` | `ghcr.io/open-webui/open-terminal:latest` | Default container image for user terminals. |
| `TERMINALS_PORT` | `3000` | Port the orchestrator listens on. |
| `TERMINALS_HOST` | `0.0.0.0` | Address the orchestrator binds to. |
| `TERMINALS_NETWORK` | (empty) | Docker network for user containers. When set, containers communicate by name. |
| `TERMINALS_DOCKER_HOST` | `127.0.0.1` | Address for published container ports. Only relevant without `TERMINALS_NETWORK`. |
| `TERMINALS_DATA_DIR` | `data/terminals` | Host directory for per-user workspace data. |
| `TERMINALS_IDLE_TIMEOUT_MINUTES` | `0` (disabled) | Minutes of inactivity before a container is stopped. Set to `30` for typical usage. |
| `TERMINALS_MAX_CPU` | (empty) | CPU limit for user containers (e.g., `2`). |
| `TERMINALS_MAX_MEMORY` | (empty) | Memory limit for user containers (e.g., `4Gi`). |
| `TERMINALS_OPEN_WEBUI_URL` | (empty) | If set, validates incoming JWTs against this Open WebUI instance instead of using `TERMINALS_API_KEY`. |

</details>

---

<details>
<summary>Container lifecycle details</summary>

**Naming.** Containers are named `terminals-{policy_id}-{user_id}`, making them easy to filter with `docker ps --filter "label=managed-by=terminals"`.

**Health checks.** After creating a container, the orchestrator polls its `/health` endpoint until it returns HTTP 200 (up to 15 seconds). Only then does it start proxying traffic.

**Reconciliation.** If the orchestrator restarts, it rediscovers existing running containers by their labels and recovers their API keys from the container configuration. This prevents duplicate containers from being created.

**Conflict handling.** If a container with the same name already exists (e.g., from a previous failed cleanup), the orchestrator force-removes the old container and retries up to 3 times.

</details>

---

## Limitations

- **Single host.** All user containers run on one Docker host. For high availability or larger teams, use the Kubernetes Operator backend.
- **No built-in HA.** If the orchestrator goes down, active terminal sessions are interrupted (though containers keep running and are reconciled on restart).
- **Docker socket required.** The orchestrator needs access to the Docker socket to manage containers.

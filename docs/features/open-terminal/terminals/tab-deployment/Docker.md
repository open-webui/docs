## Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/) installed and running
- Open WebUI running (or ready to deploy alongside)
- [Open WebUI Enterprise License](https://docs.openwebui.com/enterprise) (required for production use)

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
          "server_type": "orchestrator",
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
      - TERMINALS_DOCKER_NETWORK=open-webui-network
      - TERMINALS_DOCKER_HOST_DATA_DIR=${PWD}/data/terminals
      - TERMINALS_IDLE_TIMEOUT_MINUTES=30
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/app/data
    networks:
      - webui

volumes:
  open-webui:

networks:
  webui:
    name: open-webui-network
```

Terminals keeps its database and the files of every machine in the `data` folder next to your Compose file. `TERMINALS_DOCKER_HOST_DATA_DIR` tells Docker where that folder lives on the host, so the machine containers mount the same files the orchestrator manages.

Set the shared API key in a `.env` file next to your Compose file:

```env
TERMINALS_API_KEY=change-me-to-a-strong-random-value
```

Then start everything:

```bash
docker compose up -d
```

Open WebUI will be available at `http://localhost:3000`. The connection above gives every user **Read** access, so users can use terminals that are shared with them. Give the people who create terminals **Write** access in the connection's **Access** setting, see [Creating Terminals](/features/open-terminal/terminals/orchestration/creating-terminals). When a user opens a terminal, the orchestrator provisions the machine automatically.

:::warning Docker socket access
The orchestrator needs access to the Docker socket (`/var/run/docker.sock`) to manage containers. For production, use a Docker socket proxy like [Tecnativa/docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy) to restrict the API calls it can make.
:::

---

The orchestrator settings for this deployment, such as `TERMINALS_DOCKER_NETWORK`, `TERMINALS_DOCKER_DATA_DIR` and `TERMINALS_IDLE_TIMEOUT_MINUTES`, are listed in [Orchestrator Environment Variables](/features/open-terminal/terminals/orchestration#orchestrator-environment-variables).

---

<details>
<summary>Container lifecycle details</summary>

**Filtering.** Containers are easy to filter with `docker ps --filter "label=app.kubernetes.io/managed-by=terminals"`.

**Startup.** After creating a container, the orchestrator waits until the container answers, for up to 15 seconds, and then starts proxying traffic. It logs a warning if the container was not ready in time.

</details>

---

## Limitations

- **Single host.** All user containers run on one Docker host. For high availability or larger teams, use the Kubernetes Operator backend.
- **No built-in HA.** If the orchestrator goes down, active terminal sessions are interrupted (though containers keep running and are reconciled on restart).
- **Docker socket required.** The orchestrator needs access to the Docker socket to manage containers.

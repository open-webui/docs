---
sidebar_position: 3
title: "Security"
---

# Security Best Practices

Open Terminal gives AI real power to run commands and manage files. Here's how to make sure that power is used safely.

---

## Use Docker

**Always use Docker** unless you specifically need direct access to your machine. Docker isolates Open Terminal in its own container: it has its own filesystem, its own processes, and can't access anything on your host computer unless you explicitly allow it.

```bash
docker run -d --name open-terminal -p 8000:8000 \
  --memory 2g --cpus 2 \
  -v open-terminal:/home/user \
  -e OPEN_TERMINAL_API_KEY=your-secret-key \
  ghcr.io/open-webui/open-terminal
```

The `--memory 2g` and `--cpus 2` flags prevent runaway processes from consuming all your machine's resources.

{/* TODO: Screenshot — A simple diagram showing your computer on the left, a Docker container in the middle (labeled "Open Terminal — isolated"), and an arrow showing that only the /home/user volume is shared. The rest of the host filesystem is blocked off. */}

:::warning Running without Docker
Without Docker (bare metal mode), the AI can run any command with your user's permissions — including deleting files, installing software, or accessing anything your account can access. Only use bare metal on your own personal machine for personal projects.
:::

---

## Always set a password

Without an API key, **anyone who can reach the port has full access** — they can run commands, read files, and control the terminal.

```bash
-e OPEN_TERMINAL_API_KEY=a-strong-password-here
```

For production, use a [config file](./configuration#config-file) or [Docker secrets](./configuration#docker-secrets) instead of putting the key on the command line.

{/* TODO: Screenshot — Example showing the docker logs command revealing an auto-generated API key, with a note saying "change this to your own strong password". */}

---

## Use admin connections (not user connections)

When connecting to Open WebUI, prefer the **admin-configured** approach:

| | Admin-configured | User-configured |
| :--- | :--- | :--- |
| API key visibility | Hidden on the server | Stored in the user's browser |
| Requests go through | Open WebUI's backend | Directly from the browser |
| Terminal network access needed from | Just the Open WebUI server | Every user's computer |

Admin-configured connections keep the API key out of users' browsers and let you control who has access.

{/* TODO: Screenshot — Admin settings showing the Open Terminal connection. The API key field shows dots (masked). A note points out that this key never reaches users' browsers. */}

---

## Limit resources

Prevent a runaway script from consuming all available CPU and memory:

```yaml title="docker-compose.yml"
deploy:
  resources:
    limits:
      memory: 2G
      cpus: "2.0"
```

If a process exceeds these limits, Docker throttles it (CPU) or kills it (memory). Your server stays healthy.

{/* TODO: Screenshot — Docker stats or htop inside the container showing CPU and memory usage within the configured limits. */}

---

## Network isolation

For the most secure setup, put Open Terminal on a **private Docker network** that only Open WebUI can reach:

```yaml title="docker-compose.yml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:latest
    ports:
      - "3000:8080"
    networks:
      - public
      - internal

  open-terminal:
    image: ghcr.io/open-webui/open-terminal
    # Notice: no ports exposed to the outside
    networks:
      - internal

networks:
  public:
  internal:
    internal: true   # No internet access from this network
```

This means:
- Open WebUI can reach Open Terminal at `http://open-terminal:8000`
- Open Terminal is **not accessible** from the internet
- Open Terminal **cannot make outbound internet requests**

{/* TODO: Screenshot — Network diagram showing the public network (internet → Open WebUI) and the internal network (Open WebUI → Open Terminal). The internal network has no path to the internet. */}

---

## Egress filtering

If Open Terminal needs *some* internet access (to install packages, for example), you can restrict it to specific domains:

```bash
-e OPEN_TERMINAL_ALLOWED_DOMAINS="pypi.org,github.com,*.npmjs.org"
```

Only these domains will be reachable. Everything else is blocked. This prevents:
- Unauthorized data leaving the container
- Downloading unexpected software
- Accessing internal services you didn't intend

{/* TODO: Screenshot — Terminal showing two curl commands: one to an allowed domain (succeeds) and one to a blocked domain (fails with "connection refused"). */}

---

## Docker socket warning

The Docker container can optionally access your host's Docker (to let the AI build images, run containers, etc.):

```bash
-v /var/run/docker.sock:/var/run/docker.sock
```

:::danger Only for trusted environments
Mounting the Docker socket gives the container **full control** over your host's Docker. This is effectively root access on your machine. Anyone with terminal access could:
- Run containers that mount your entire filesystem
- Access your host's network
- Manage every container on your machine

Only do this if you fully trust everyone who has access to the terminal.
:::

{/* TODO: Screenshot — A warning diagram showing the Docker socket as a direct bridge to the host, with arrows pointing to "can access host filesystem", "can access host network", "can manage all containers". */}

---

## Security checklist

| ✅ | Recommendation |
| :--- | :--- |
| ☐ | Use Docker, not bare metal |
| ☐ | Set a strong API key |
| ☐ | Use admin-configured connections |
| ☐ | Set memory and CPU limits |
| ☐ | Use network isolation (internal Docker network) |
| ☐ | Enable egress filtering if internet access isn't needed |
| ☐ | Don't mount the Docker socket unless necessary |
| ☐ | Use `slim` or `alpine` images if you don't need runtime package installs |

## Related

- [All configuration options →](./configuration)
- [Multi-user setup →](./multi-user)

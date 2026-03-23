---
sidebar_position: 2
title: "Configuration"
---

# Configuration Reference

Open Terminal has sensible defaults out of the box. This page covers all the settings you can customize if you need to.

Settings are applied in this order (later ones override earlier ones):

1. Built-in defaults
2. System config file (`/etc/open-terminal/config.toml`)
3. User config file (`~/.config/open-terminal/config.toml`)
4. Environment variables (`OPEN_TERMINAL_*`)
5. CLI flags (`--host`, `--port`, etc.)

---

## All settings

| Setting | Default | Environment Variable | Description |
| :--- | :--- | :--- | :--- |
| **Host** | `0.0.0.0` | — | Network address to listen on |
| **Port** | `8000` | — | Port number |
| **API Key** | Auto-generated | `OPEN_TERMINAL_API_KEY` | Password for connecting |
| **API Key File** | — | `OPEN_TERMINAL_API_KEY_FILE` | Load the key from a file (for Docker secrets) |
| **Log Directory** | `~/.local/state/open-terminal/logs` | `OPEN_TERMINAL_LOG_DIR` | Where to save log files |
| **Max Sessions** | `16` | `OPEN_TERMINAL_MAX_SESSIONS` | Maximum concurrent terminal sessions |
| **Enable Terminal** | `true` | `OPEN_TERMINAL_ENABLE_TERMINAL` | Turn the interactive terminal on/off |
| **Enable Notebooks** | `true` | `OPEN_TERMINAL_ENABLE_NOTEBOOKS` | Turn Jupyter notebook execution on/off |
| **TERM** | `xterm-256color` | `OPEN_TERMINAL_TERM` | Terminal color support |
| **Execute Timeout** | Unset | `OPEN_TERMINAL_EXECUTE_TIMEOUT` | How long (seconds) to wait for command output |
| **Execute Description** | — | `OPEN_TERMINAL_EXECUTE_DESCRIPTION` | Custom text telling the AI about installed tools |
| **Multi-User** | `false` | `OPEN_TERMINAL_MULTI_USER` | Enable [per-user isolation](./multi-user) |
| **CORS Origins** | — | `OPEN_TERMINAL_CORS_ALLOWED_ORIGINS` | Allowed cross-origin domains |
| **Allowed Domains** | — | `OPEN_TERMINAL_ALLOWED_DOMAINS` | [Egress firewall](./security#egress-filtering): only allow outbound connections to these domains |

---

## Docker-only settings

These only work with the Docker image:

| Setting | Environment Variable | Description |
| :--- | :--- | :--- |
| **System Packages** | `OPEN_TERMINAL_PACKAGES` | Space-separated list of system packages to install at startup |
| **Python Packages** | `OPEN_TERMINAL_PIP_PACKAGES` | Space-separated list of Python packages to install at startup |

:::note
These packages are reinstalled every time the container starts. If you need many packages, consider [building a custom image](https://github.com/open-webui/open-terminal) instead.
:::

---

## Config file

Instead of environment variables, you can put settings in a file:

```toml title="~/.config/open-terminal/config.toml"
host = "0.0.0.0"
port = 8000
api_key = "your-secret-key"
log_dir = "/var/log/open-terminal"
max_terminal_sessions = 16
enable_terminal = true
enable_notebooks = true
execute_timeout = 5
execute_description = "This terminal has ffmpeg and ImageMagick installed."
```

{/* TODO: Screenshot — A text editor showing a well-formatted config.toml file. */}

:::tip Why use a config file?
It keeps your API key out of the command line and shell history. Anyone running `ps` or `htop` on the machine won't see it.
:::

To use a config file in a custom location:

```bash
open-terminal run --config /path/to/my-config.toml
```

---

## Docker secrets

For production Docker deployments, you can load the API key from a secret file:

```yaml title="docker-compose.yml"
services:
  open-terminal:
    image: ghcr.io/open-webui/open-terminal
    environment:
      - OPEN_TERMINAL_API_KEY_FILE=/run/secrets/terminal_api_key
    secrets:
      - terminal_api_key

secrets:
  terminal_api_key:
    file: ./terminal_api_key.txt
```

{/* TODO: Screenshot — Docker Compose file in an editor with the secrets section highlighted. */}

---

## Image variants

Open Terminal comes in three sizes:

| | `latest` | `slim` | `alpine` |
| :--- | :--- | :--- | :--- |
| **Best for** | General use, AI agents | Smaller footprint | Smallest footprint |
| **Size** | ~4 GB | ~430 MB | ~230 MB |
| **Includes** | Node.js, Python, compilers, ffmpeg, Docker CLI, data science libs | git, curl, jq | git, curl, jq |
| **Can install packages** | ✔ (has sudo) | ✘ | ✘ |
| **Multi-user** | ✔ | ✘ | ✘ |

**If you're not sure, use `latest`.** It has everything pre-installed so the AI can work with any tool without waiting for installs.

{/* TODO: Screenshot — A visual comparison of the three image variants showing relative sizes and capabilities. */}

## Related

- [Security best practices →](./security)
- [Multi-user setup →](./multi-user)

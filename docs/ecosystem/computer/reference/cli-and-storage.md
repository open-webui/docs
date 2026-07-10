---
title: CLI, installation options, and stored state
sidebar_position: 1
---

# CLI, installation options, and stored state

The product is named **Open WebUI Computer**; `cptr` is the package and command name. A local install is the fastest way to learn whether the product solves your problem before you make any remote-access decision.

## Use this when

Use this reference when installing or operating Computer on a workstation or private server and you need to know which command starts it, where its state lives, and what to preserve during an upgrade.

## Before you start

- Use Python 3.10 or newer for the package installation.
- Decide whether Computer should access the host directly or a Docker-mounted workspace.
- Keep the data directory on persistent storage.

## Do it

```bash
pip install cptr
cptr run
```

Use `cptr[all]` when you need all optional feature groups, including MCP support. `uvx cptr@latest run` is an alternative one-command trial. `cptr run` is local-only by default; use `--host`, `--port`, `--headless`, or `--reload` only when their behavior is intentional.

The default data directory is `~/.cptr`; `CPTR_DATA_DIR` changes it. It contains `app.db`, `config.toml`, and logs such as `logs/audit.jsonl` when audit logging is enabled. In Docker, mount `/data` persistently and mount the actual host project into the container, for example at `/workspace`.

## Verify it worked

`cptr run` prints a first-time setup URL and the browser opens the setup/login flow. After creating a workspace and restarting, the workspace remains in the sidebar; in Docker, its state remains after recreating a container with the same `/data` volume.

## If it did not

If the browser cannot reach the service, confirm the printed host/port and local firewall. If state disappeared, confirm `CPTR_DATA_DIR` or the Docker `/data` volume is writable and persistent. On Windows terminal errors mentioning `VCRUNTIME140.dll`, install the Microsoft Visual C++ Redistributable and restart Computer.

## Trust boundary

Changing `--host` from loopback changes who can attempt to reach a shell-capable service. A persistent database also contains account, workspace, chat, and configuration state; back it up as sensitive application data.

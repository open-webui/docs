---
title: CLI
sidebar_position: 2
---

# CLI

The CLI has exactly one command:

```bash
cptr run
```

| Flag | Default | Behavior |
| --- | --- | --- |
| `--host` | `127.0.0.1` | Bind address. The default is loopback-only; use `--host 0.0.0.0` to accept connections from other devices on your network. |
| `--port` | `8000` | Listen port. Also exported to the process as `CPTR_PORT`. |
| `--headless` | off | Don't auto-open a browser on start. Use for servers, systemd units, and containers. |
| `--reload` | off | Auto-restart on code changes. Development only. |

On first run (while no user account exists yet), the server prints a one-time setup URL of the form `http://<host>:<port>/?token=<64-hex>`. Opening it creates the first user as admin. The token stops working as soon as a user exists.

## Install extras

`pip install cptr` needs Python 3.10+. Optional feature groups:

| Extra | Adds |
| --- | --- |
| `cptr[mcp]` | MCP tool server support |
| `cptr[pam]` | PAM authentication (Linux system users) |
| `cptr[agents]` | Coding-agent extras |
| `cptr[docs]` | Document-handling extras |
| `cptr[all]` | Everything above |

No install at all:

```bash
uvx cptr@latest run
```

## What the CLI doesn't have

- **No other subcommands.** There is no `cptr user`, `cptr migrate`, or similar; database migrations run automatically on startup.
- **No TLS flags.** HTTPS comes from a reverse proxy or tunnel in front of Computer, not from the CLI.
- **No `--workers`.** It runs as a single process.
- **No password-reset command.** Admins reset passwords in the UI; if you're locked out of the only admin account, see [Troubleshooting](/ecosystem/computer/troubleshooting) for the recovery procedure.

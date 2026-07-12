---
title: Troubleshooting
sidebar_position: 12
---

# Troubleshooting

Find your symptom below (Ctrl+F works). First check for anything odd: `curl http://127.0.0.1:8000/api/health` tells you whether the server is up at all.

## "cptr: command not found"

The package landed in a different Python environment than the one on your PATH. Install it into the Python you actually run:

```bash
python -m pip install cptr
```

If you installed with pipx or inside a virtualenv, activate that environment first (or use `pipx run cptr run` / `uvx cptr@latest run`). Then start it with `cptr run`.

## "Port 8000 already in use"

Something else owns the port. Either run on another one:

```bash
cptr run --port 8001
```

or find and stop the owner: `lsof -i :8000` (macOS/Linux) or `netstat -ano | findstr :8000` (Windows).

## The setup URL doesn't work / I lost the setup token

The setup token is printed once when `cptr run` starts, and the setup URL only works while **no account exists yet**. If you lost it, just restart `cptr run`: a fresh token is printed. If an account already exists, the setup URL is dead by design; go to `http://localhost:8000` and log in normally.

## I forgot my password / I'm locked out

If another admin exists, they can reset your password in **Settings → Admin → Users**. Two things that trip people up first:

- Login is rate-limited to **5 attempts per minute per IP**. If you're getting `429`, wait a minute and try again.
- Rotating `[server] secret` in `config.toml` signs out every session; it does **not** reset any password.

If you're the sole admin, stop the server. There is no CLI password reset. Your options, in order:

1. Restore a backup of `app.db` from when the password still worked.
2. Last resort: open `app.db` with a SQLite client and delete the user rows (the account and auth tables), then restart. First-run setup triggers again and you create a new admin. Your config (`config.toml`) and workspace chats (`<workspace>/.cptr/chats/`) survive; only the accounts are recreated.

## My phone can't reach it

`localhost` on your phone means the phone itself. It will never reach your computer.

- **Same Wi-Fi:** restart with `cptr run --host 0.0.0.0`, open `http://<your-computer-ip>:8000` on the phone, and allow the port through the host firewall.
- **Away from home:** you need Tailscale or a tunnel; see [phone and remote access](/ecosystem/computer/phone-and-remote/).
- **Host asleep:** nothing can serve a sleeping machine; see [keep it running](/ecosystem/computer/phone-and-remote/keep-it-running).

## Terminal won't open on Windows (VCRUNTIME140.dll)

The terminal backend needs the Microsoft Visual C++ Redistributable. Install the x64 version from Microsoft, restart your machine, and start `cptr run` again.

## Docker: setup wizard reappeared / my state is gone

The container started without its `/data` volume, so it looks like a fresh install. Your data is almost certainly still in the volume; never remove it while diagnosing. Recreate the container with the volume attached:

```bash
docker run -d -p 8000:8000 -v cptr-data:/data ghcr.io/open-webui/computer:latest
```

Your account, workspaces, and settings come back with it.

## Docker: SQLite can't write /data

You bind-mounted a host directory that the container user can't write to. Fix the ownership of the host directory, or (simpler and more robust) use a named volume (`-v cptr-data:/data`) instead of a bind mount. Don't run the container privileged as a shortcut.

## My project folder isn't visible in Docker

The container only sees what you mount into it. Add your project as a bind mount and use the **container** path as the workspace path:

```bash
docker run -d -p 8000:8000 -v cptr-data:/data -v ~/code/myproject:/workspace/myproject ghcr.io/open-webui/computer:latest
```

Then add `/workspace/myproject` as the workspace.

## Agent model missing from the selector / detection not ready

Check the profile status in **Settings → Admin → Agents**; each status has a specific fix:

- **not found**: the agent CLI isn't on the server's PATH. Install it, or put the absolute path in the profile's Command field.
- **missing dependency**: Claude Code also needs the `claude-agent-sdk` Python package in cptr's environment: `pip install claude-agent-sdk`.
- **auth unknown**: run the agent's own login on the host machine (`claude`, `codex login`, `agent login`, `cline auth`, …).

Detection results are cached for about 30 seconds, so give it a moment after fixing. Full setup per agent: [coding agents](/ecosystem/computer/ai/coding-agents).

## My bot doesn't answer

Work down this list:

1. Is the server running, and is the bot's **active** toggle on in **Settings → Admin → Bots**?
2. Did the token pass the **verify** check when you saved it?
3. Is your platform user ID actually in **Allowed senders**? A non-empty list silently ignores everyone else.
4. Discord and Slack need the `websockets` Python package: `pip install websockets`.
5. WhatsApp is webhook-only; the Meta webhook URL must point at a publicly reachable `https://<your-host>/api/webhooks/whatsapp/<bot_id>`.

Full setup per platform: [messaging bots](/ecosystem/computer/automate/messaging-bots).

## Terminal or chat disconnects behind my reverse proxy

Computer uses Socket.IO: terminals and streaming die if your proxy doesn't forward WebSocket upgrade headers (`Upgrade` / `Connection`). Add them to your proxy config; see [reverse proxy](/ecosystem/computer/phone-and-remote/reverse-proxy) for nginx/Caddy/Traefik snippets.

## Is the server healthy?

```bash
curl http://127.0.0.1:8000/api/health
```

Returns `{status, uptime_seconds, pid}` and needs no login. If this fails on the host itself, the server isn't running; check the terminal where you started `cptr run`.

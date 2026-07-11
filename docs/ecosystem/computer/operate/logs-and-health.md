---
title: Logs, health, and diagnostics
sidebar_position: 3
---

# Logs, health, and diagnostics

Is the server up?

```bash
curl http://127.0.0.1:8000/api/health
```

Returns JSON with `status`, `uptime_seconds`, and `pid`. No authentication is required, so you can point uptime monitors, systemd health checks, or Docker healthchecks at it.

## Server logs

Computer logs to stdout. Two variables control it (restart to apply, like all env vars):

| Variable | Default | Purpose |
| --- | --- | --- |
| `CPTR_LOG_LEVEL` | `INFO` | Set `DEBUG` for more detail. |
| `CPTR_LOG_FORMAT` | `text` | Set `json` for structured output that log collectors can parse. |

## Audit logging

Off by default. Turn it on when you want a durable record of who changed what:

```bash
CPTR_AUDIT_LOG_LEVEL=METADATA cptr run
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `CPTR_AUDIT_LOG_LEVEL` | `NONE` | `METADATA` records who/what/when for each mutation; `REQUEST` adds redacted request bodies; `REQUEST_RESPONSE` adds redacted response bodies. |
| `CPTR_AUDIT_LOG_PATH` | `<data>/logs/audit.jsonl` | Where the JSONL audit file goes. |
| `CPTR_AUDIT_LOG_ROTATION` | `10 MB` | Rotation size. |
| `CPTR_AUDIT_MAX_BODY_SIZE` | `2048` | Max bytes of body captured per entry. |
| `CPTR_AUDIT_EXCLUDED_PATHS` | `/api/chats,/v1/chat` | Paths skipped by the audit log. |

What it captures: HTTP mutations (settings changes, user changes, uploads, and so on), with sensitive values redacted. What it doesn't: terminal input/output is not HTTP traffic and never appears here, and chat routes are excluded by default. For evidence of what an agent actually did, read the chat itself and its terminal output.

## Upstream request logging

When a model behaves strangely and you want to see exactly what Computer sent to the provider:

```bash
CPTR_LOG_UPSTREAM_REQUESTS=true cptr run
```

Model API requests are written to `<data>/logs/upstream-requests.jsonl` (rotation at 50 MB, configurable via `CPTR_UPSTREAM_REQUEST_LOG_PATH` and `CPTR_UPSTREAM_REQUEST_LOG_ROTATION`). Turn it off when you're done: the file grows fast and contains prompt content.

## CORS

`CPTR_CORS_ALLOWED_ORIGINS` controls which browser origins may call the API. Default is `*`. Set an explicit comma-separated list if you host a separate frontend on another origin:

```bash
CPTR_CORS_ALLOWED_ORIGINS=https://computer.example.com cptr run
```

Full variable list, including chat tuning and scheduler settings: [Environment variables](/ecosystem/computer/reference/environment-variables).

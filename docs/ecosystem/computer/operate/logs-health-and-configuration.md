---
title: Logs, health, and configuration
sidebar_position: 4
---

# Logs, health, and configuration

## Use this when

You need a quick health signal, a durable diagnostic record, or a controlled location for instance configuration.

## Before you start

The unauthenticated health endpoint is `/api/health`. Environment variables are read when the process starts. `config.toml` lives in the data directory and mirrors server and app configuration; avoid editing it while the app is running.

## Do it

Check the instance:

```bash
curl http://127.0.0.1:8000/api/health
```

Set `CPTR_LOG_LEVEL=DEBUG` for more server detail or `CPTR_LOG_FORMAT=json` for structured stdout, then restart. Set `CPTR_AUDIT_LOG_LEVEL=METADATA` for a low-content mutation trail. `REQUEST` adds redacted request bodies and `REQUEST_RESPONSE` adds redacted response bodies; the default audit file is `~/.cptr/logs/audit.jsonl`, and `CPTR_AUDIT_LOG_PATH` changes it. Use `CPTR_DATA_DIR=/path/to/data` only before start, and make the selected directory persistent and writable.

## Verify it worked

Health returns JSON with `status`, `uptime_seconds`, and `pid`. Restart with the chosen log setting and observe the requested output format in the process log. After a harmless mutation, the selected audit file contains a redacted JSON entry. When changing the data directory, confirm it contains `app.db` and `config.toml` after a clean start.

## If it did not

If health fails locally, inspect the server's stdout and verify the chosen port. If the audit file is absent, restart and confirm its selected level and parent directory are writable. If config changes do not appear, restart and confirm you changed the directory actually selected by `CPTR_DATA_DIR`. If the app cannot write data, correct ownership rather than running it with broader privileges.

## Trust boundary

`/api/health` intentionally does not require login, so do not place secrets or sensitive diagnostics in it. Debug and audit logs may contain operational data and need protected storage.

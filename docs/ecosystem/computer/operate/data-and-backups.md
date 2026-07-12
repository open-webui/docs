---
title: Data and backups
sidebar_position: 2
---

# Data and backups

Everything Computer needs to survive a reinstall lives in one data directory: `~/.cptr` by default, `/data` in Docker, or wherever `CPTR_DATA_DIR` points. The one exception is chats: they live inside each workspace folder and travel with the project.

## What lives where

Inside the data directory:

| Path | What it holds |
| --- | --- |
| `app.db` | SQLite database in WAL mode (`app.db-wal` and `app.db-shm` sit next to it). Users and auth, instance config, automations, chat/message records, upload metadata. |
| `config.toml` | The server secret plus a mirror of app config. On startup the file is re-seeded into the database (**the file wins**), so it's safe to hand-edit while stopped, and config survives a lost database. See [config.toml](/ecosystem/computer/reference/configuration). |
| `uploads/` | Uploaded file blobs. |
| `logs/` | Audit and upstream-request logs, when enabled. |
| `memory/` | Per-user AI memory. |
| `skills/` | Managed global skills. |

Inside each workspace, Computer keeps a `.cptr/` folder:

| Path | What it holds |
| --- | --- |
| `<workspace>/.cptr/chats/<chat_id>.json` | Every chat for that workspace; move the folder and the chats come with it. |
| `<workspace>/.cptr/artifacts/` | Artifacts produced in that workspace. |
| `<workspace>/.cptr/task_logs/` | Logs from task runs. |

A data-directory backup does **not** include your workspaces. Project folders need their own backup (git remote, Time Machine, whatever you already use), and because chats live in `<workspace>/.cptr/`, that backup covers them too.

## Back up the data directory

:::warning Stop the server first
`app.db` uses SQLite WAL mode. Copying it while the server is writing can produce a corrupt or inconsistent backup. Stop Computer, copy, then start it again.
:::

For a Python install, archive `~/.cptr`:

```bash
tar -C "$HOME" -czf cptr-data-backup.tgz .cptr
```

For Docker, archive the stopped `cptr-data` volume into the current directory:

```bash
docker run --rm \
  -v cptr-data:/data:ro \
  -v "$PWD:/backup" \
  alpine tar -C /data -czf /backup/cptr-data-backup.tgz .
```

Confirm the archive contains the two files that matter most:

```bash
tar -tzf cptr-data-backup.tgz | grep -E '(^|/)app\.db$|(^|/)config\.toml$'
```

## Test a restore

Don't wait for a disaster to find out the backup works. Unpack into a fresh directory and start a second instance on another port with `CPTR_DATA_DIR` pointing at it:

```bash
mkdir -p /tmp/cptr-restore
tar -C /tmp/cptr-restore -xzf cptr-data-backup.tgz
CPTR_DATA_DIR=/tmp/cptr-restore/.cptr cptr run --port 8001
```

Sign in at `http://localhost:8001` and check that your account and settings are there.

For Docker, restore into a **new** volume rather than overwriting production:

```bash
docker volume create cptr-data-restore
docker run --rm \
  -v cptr-data-restore:/data \
  -v "$PWD:/backup:ro" \
  alpine tar -C /data -xzf /backup/cptr-data-backup.tgz
```

Then start a test container with `-v cptr-data-restore:/data` and sign in. Remember that workspaces are restored separately: the data backup gets you accounts, config, and settings, not project files.

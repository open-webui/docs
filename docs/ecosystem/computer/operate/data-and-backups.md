---
title: Data and backups
sidebar_position: 2
---

# Data and backups

## Use this when

Use this when you need to move or protect the persistent state of a private installation before an upgrade, host migration, or risky configuration change.

## Before you start

By default, Open WebUI Computer stores its database and configuration in `~/.cptr`: `app.db` and `config.toml`. Change the location before startup with `CPTR_DATA_DIR`. Docker stores the equivalent state in `/data`, normally backed by the `cptr-data` volume.

## Do it

Stop Open WebUI Computer cleanly. Copy the entire data directory, not only the database, to protected local or encrypted backup storage.

For a Python installation, archive the default data directory while Computer is stopped:

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

Keep this state backup separate from the project workspaces; those files need their own backup policy.

## Verify it worked

List the backup and confirm it contains both `app.db` and `config.toml` (or the Docker volume contents):

```bash
tar -tzf cptr-data-backup.tgz | rg '(^|/)app\.db$|(^|/)config\.toml$'
```

For a restore drill, unpack a Python backup into a fresh test location and start a stopped test installation with `CPTR_DATA_DIR` pointing there:

```bash
mkdir -p /tmp/cptr-restore
tar -C /tmp/cptr-restore -xzf cptr-data-backup.tgz
CPTR_DATA_DIR=/tmp/cptr-restore/.cptr cptr run --port 8001
```

For Docker, restore into a new volume rather than overwriting the production volume:

```bash
docker volume create cptr-data-restore
docker run --rm \
  -v cptr-data-restore:/data \
  -v "$PWD:/backup:ro" \
  alpine tar -C /data -xzf /backup/cptr-data-backup.tgz
```

Start a test container with `cptr-data-restore`, sign in, and confirm a known workspace and setting are present. Restore workspace files separately as well; the Computer data backup does not contain the project directory.

## If it did not

If SQLite reports locks or the backup is inconsistent, stop the process and retry; do not copy a live database while writes are in flight. If restoring loses access, restore the complete directory and verify file ownership before attempting account or config changes.

## Trust boundary

The data directory can contain account, configuration, workspace metadata, and service secrets. Treat backups as sensitive host data and encrypt them where your threat model requires it.

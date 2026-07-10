---
title: Data and backups
sidebar_position: 2
---

# Data and backups

## Use this when

Priya wants to move or protect the persistent state of a private installation before an upgrade, host migration, or risky configuration change.

## Before you start

By default, Open WebUI Computer stores its database and configuration in `~/.cptr`: `app.db` and `config.toml`. Change the location before startup with `CPTR_DATA_DIR`. Docker stores the equivalent state in `/data`, normally backed by the `cptr-data` volume.

## Do it

Stop Open WebUI Computer cleanly. Copy the entire data directory, not only the database, to protected local or encrypted backup storage. For Docker, create a backup from the `cptr-data` volume while the container is stopped. Keep the backup separate from the project workspaces; those files need their own backup policy.

## Verify it worked

List the backup and confirm it contains both `app.db` and `config.toml` (or the Docker volume contents). For a restore drill, point a stopped test installation at a copy of the backup with `CPTR_DATA_DIR`, start it, sign in, and confirm a known workspace and setting are present.

## If it did not

If SQLite reports locks or the backup is inconsistent, stop the process and retry; do not copy a live database while writes are in flight. If restoring loses access, restore the complete directory and verify file ownership before attempting account or config changes.

## Trust boundary

The data directory can contain account, configuration, workspace metadata, and service secrets. Treat backups as sensitive host data and encrypt them where your threat model requires it.

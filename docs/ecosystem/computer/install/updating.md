---
title: Updating
sidebar_position: 5
---

# Updating

Upgrade with the same tool you installed with, then restart:

```bash
# pip
pip install --upgrade cptr
# then restart cptr run

# uv (always runs the latest release)
uvx cptr@latest run
```

For Docker, pull the new image and recreate the container with the same `/data` volume; see [Docker](./docker#upgrading).

## Migrations are automatic

Database migrations run automatically at startup. There is no manual migration step and no migrate command: start the new version and it brings its database up to date.

## After the upgrade

- Update notes appear in the app after an upgrade, summarizing what changed.
- The admin UI can check GitHub for the latest release. This is informational only; it never updates the app itself.
- If the UI looks stale or broken after an upgrade, hard-refresh the browser (the old frontend can stay cached).

:::tip Before major upgrades
Back up the data directory (`~/.cptr`, or the `/data` volume in Docker) so you can roll back to the previous version with its matching state. See [data and backups](/ecosystem/computer/operate/data-and-backups).
:::

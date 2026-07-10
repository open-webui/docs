---
title: Update Open WebUI Computer
sidebar_position: 7
---

# Update Open WebUI Computer

## Use this when

Use this when you need to update a trusted single-host installation without losing its state. For installing the browser app, sharing files from a device, or PWA recovery, use [PWA, sharing, and shortcuts](/ecosystem/computer/workspace/pwa-share-shortcuts).

## Before you start

Keep the data directory or Docker `/data` volume persistent, and make a backup before changing a working host. Read the release notes and know whether the host was installed with Python or Docker.

## Do it

For a Python installation, stop the process, upgrade the same environment with `pip install --upgrade cptr`, then start `cptr run`. For Docker, follow [Docker volumes and safe upgrades](/ecosystem/computer/operate/docker-and-upgrades) so the replacement container retains the exact same `/data` volume and project mounts.

## Verify it worked

After an update, the existing account and workspace remain in the sidebar, and `curl http://127.0.0.1:8000/api/health` returns `status: ok`. If the browser still shows an older interface, reload it once after confirming the server is healthy.

## If it did not

If workspaces disappear after an update, stop and restore the original `~/.cptr` directory or `/data` volume before experimenting further; see [data and backups](/ecosystem/computer/operate/data-and-backups). If the browser app itself is stale or cannot connect, use the PWA guide's [recovery steps](/ecosystem/computer/workspace/pwa-share-shortcuts#if-it-did-not).

## Trust boundary

An update changes code that can access the host data directory and mounted projects. Keep backups protected, review releases, and retain the previous version until the new one passes the health and workspace checks.

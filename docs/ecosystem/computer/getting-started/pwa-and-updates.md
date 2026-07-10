---
title: PWA and updates
sidebar_position: 7
---

# Install the app and update it

## Use this when

Theo wants a one-tap way back to the host from a phone, or you need to update a trusted single-host installation without losing its state.

## Before you start

Keep the data directory or Docker `/data` volume persistent. Read the release notes before changing a working host. PWA installation depends on browser and device support.

## Do it

Open Open WebUI Computer in the browser. Use the browser's **Install app** or **Add to Home Screen** action; on iPhone and iPad, use Safari's Share menu. PWA preferences appear in Settings when the app is installed.

For a Python installation, stop the process, upgrade the same environment with `pip install --upgrade cptr`, then start `cptr run`. For Docker, pull the desired image and recreate the container with the exact same `/data` volume and project mounts.

## Verify it worked

The installed app opens the same instance and the existing workspace remains in the sidebar. After an update, Settings reports the expected version or the update notification is gone; `curl http://127.0.0.1:8000/api/health` still returns `status: ok`.

## If it did not

If the app opens a stale interface, reload once or remove and reinstall the PWA. If workspaces disappear after an update, stop and restore the original `~/.cptr` directory or `/data` volume before experimenting further; see [data and backups](/ecosystem/computer/operate/data-and-backups).

## Trust boundary

A PWA is another browser surface for the same machine. A phone home-screen icon does not add a new access-control layer.

---
title: Docker volumes and upgrades
sidebar_position: 3
---

# Docker volumes and safe upgrades

## Use this when

You run Open WebUI Computer in Docker and need to replace the image without replacing its identity or state.

## Before you start

Back up the `cptr-data` volume and note every project bind mount. Pin a release image if you need repeatability; `:dev` follows the main branch and is not a stability promise.

## Do it

Stop the current container, pull the intended tag, then recreate it with the same persistent volume and mounts:

```bash
docker pull ghcr.io/open-webui/computer:latest
docker run --rm -it -p 8000:8000 \
  -v cptr-data:/data -v "$PWD:/workspace" -w /workspace \
  ghcr.io/open-webui/computer:latest
```

For a Python installation, use `pip install --upgrade cptr` in the same environment after backing up `~/.cptr`.

## Verify it worked

The new process prints a setup URL, `curl http://127.0.0.1:8000/api/health` returns `status: ok`, and the browser shows the preexisting account and workspace rather than a new setup state. Run `docker volume inspect cptr-data` to confirm the named volume remains attached.

## If it did not

If setup starts from scratch, stop immediately and verify the `-v cptr-data:/data` mount was preserved. If the upgrade fails, restore the backup and use the previous image tag; collect logs before trying another version.

## Trust boundary

Pulling a new image changes code that can access mounted projects and data. Review the release and keep the scope of mounted directories minimal.

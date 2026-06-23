---
sidebar_position: 4
title: "Custom Images"
---

# Custom Images

For small package changes, prefer `OPEN_TERMINAL_PACKAGES`, `OPEN_TERMINAL_PIP_PACKAGES`, or `OPEN_TERMINAL_NPM_PACKAGES`.

For heavier customization, build an image:

```bash
git clone https://github.com/open-webui/open-terminal.git
cd open-terminal
docker build -t ghcr.io/acme/open-terminal:python-ds .
docker push ghcr.io/acme/open-terminal:python-ds
```

Then:

1. Set the policy image to `ghcr.io/acme/open-terminal:python-ds`.
2. Save the policy in Open WebUI.
3. Refresh affected terminals.

Newly provisioned terminals will use the new image.

If `TERMINALS_ALLOWED_IMAGES` is set on the orchestrator, the image must match that allowlist.

---
sidebar_position: 5
title: "Custom Images"
---

# Custom Images

A custom image is your own build of Open Terminal with the tools, languages and files your users need already installed, so every instance starts ready to work. Build one when startup installs would be slow or too large.

For small package changes, prefer `OPEN_TERMINAL_PACKAGES`, `OPEN_TERMINAL_PIP_PACKAGES`, or `OPEN_TERMINAL_NPM_PACKAGES`.

For heavier customization, build an image:

```bash
git clone https://github.com/open-webui/open-terminal.git
cd open-terminal
docker build -t ghcr.io/acme/open-terminal:python-ds .
docker push ghcr.io/acme/open-terminal:python-ds
```

Then:

1. Open the terminal dialog and expand **Advanced**.
2. Set **Image** to `ghcr.io/acme/open-terminal:python-ds`.
3. Save.

Instances that start afterwards use the new image.

If `TERMINALS_ALLOWED_IMAGES` is set on the orchestrator, the image must match that allowlist.

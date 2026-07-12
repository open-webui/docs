---
title: Air-gapped
sidebar_position: 4
---

# Air-gapped

Open WebUI Computer runs without internet access once installed. The Python wheel bundles the built frontend assets and the Docker image is self-contained, so nothing is fetched at runtime.

## Build the artifacts on a connected machine

```bash
# Python route: download a wheelhouse
pip download --dest wheelhouse 'cptr[all]'

# Docker route: save the image
docker pull ghcr.io/open-webui/computer:latest
docker save ghcr.io/open-webui/computer:latest -o cptr-image.tar
```

Download the wheelhouse on a machine matching the offline host's platform and Python version so pip picks compatible wheels.

## Install on the offline host

From the wheelhouse:

```bash
python -m venv .venv
. .venv/bin/activate
pip install --no-index --find-links ./wheelhouse 'cptr[all]'
cptr run --host 0.0.0.0
```

Or load and run the Docker image:

```bash
docker load -i cptr-image.tar
docker run --rm -it \
  --network=none \
  -p 8000:8000 \
  -v cptr-data:/data \
  -v "$PWD:/workspace" \
  -w /workspace \
  ghcr.io/open-webui/computer:latest
```

If pip still tries to contact an index, check that both `--no-index` and `--find-links ./wheelhouse` are present.

## What still needs a network

Files, editor, terminal, git (local operations), and workspaces all work fully offline. Anything that talks to an external service does not:

- Hosted model APIs (OpenAI, Anthropic, and other cloud providers)
- Web search providers
- Git remotes (`push`, `pull`, `clone` from the internet)
- Messaging platforms (Telegram, Discord, Slack, WhatsApp, Signal)
- Remote MCP and OpenAPI tool servers

Local models still work: point the app at an Ollama or other OpenAI-compatible endpoint reachable on your own network.

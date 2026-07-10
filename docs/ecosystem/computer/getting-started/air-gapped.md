---
title: Air-gapped installation
sidebar_position: 4
---

# Air-gapped installation

## Use this when

Your host cannot reach the internet, but a connected staging machine can download release artifacts for transfer.

## Before you start

Bring a Python wheelhouse or the Docker image from a connected machine. Open WebUI Computer itself runs locally after installation; hosted models, Git remotes, web search, messaging services, and external MCP/OpenAPI servers still need reachable endpoints.

## Do it

On a connected machine:

```bash
pip download --dest wheelhouse 'cptr[all]'
docker pull ghcr.io/open-webui/computer:latest
docker save ghcr.io/open-webui/computer:latest -o cptr-image.tar
```

Transfer the artifacts. On the offline host, either install from the wheelhouse:

```bash
python -m venv .venv
. .venv/bin/activate
pip install --no-index --find-links ./wheelhouse 'cptr[all]'
cptr run
```

Or load and run the saved image with `docker load -i cptr-image.tar`, then the [Docker command](./docker) with `--network=none`.

## Verify it worked

Disconnect the host from the network, start the server, and request `http://127.0.0.1:8000/api/health`. Open the local URL and browse a workspace. The health response and local files must work without DNS or internet connectivity.

## If it did not

If pip tries to contact an index, confirm both `--no-index` and `--find-links ./wheelhouse` are present and that the transferred wheelhouse contains dependencies for the offline host's platform. If an AI or integration fails, determine whether it requires an external endpoint rather than retrying the local install.

## Trust boundary

Offline installation removes a network dependency; it does not remove host access. Review artifacts and transfer media according to your organization's software-supply policy.

## Not a fit

This is not an offline AI guarantee. Choose a locally reachable model and local tools if the work must never leave the network; hosted providers and remote integrations cannot work without a route to them.

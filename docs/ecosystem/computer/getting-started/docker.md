---
title: Docker
sidebar_position: 3
---

# Run with Docker

## Use this when

You want a repeatable app runtime while deliberately choosing the host directories Open WebUI Computer can see. The project mount is still real host data.

## Before you start

Install Docker on the host. Pick a writable persistent volume for application state and a project directory you are comfortable exposing to the container.

## Do it

From the project directory:

```bash
docker run --rm -it \
  -p 8000:8000 \
  -v cptr-data:/data \
  -v "$PWD:/workspace" \
  -w /workspace \
  ghcr.io/open-webui/computer:latest
```

Open the tokenized URL printed in the logs. `/data` holds the app database and configuration; `/workspace` is the project available inside the container.

## Verify it worked

Run `docker volume inspect cptr-data`, then open `/workspace` in the setup wizard. In a terminal tab, `pwd` reports `/workspace` and `git status` reports the same checkout you mounted. `curl http://127.0.0.1:8000/api/health` returns `status: ok` from the host.

## If it did not

If state disappears, verify that `-v cptr-data:/data` is present. If startup cannot write `app.db` with a bind-mounted `/data`, fix ownership or choose a Docker-managed volume; host permissions override the image defaults. For container-specific recovery, see [Docker and state troubleshooting](/ecosystem/computer/troubleshooting/docker-and-state).

## Trust boundary

The container can read and modify every mounted directory and can run commands there. Docker narrows the view only to what you mount; it does not make an untrusted user safe.

## Not a fit

Docker is useful for repeatable operation, not for safely offering a shared hosted shell. If you need separate tenants, policy-enforced project isolation, or public SaaS access, Open WebUI Computer is not that service.

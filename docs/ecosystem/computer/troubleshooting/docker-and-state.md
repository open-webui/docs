---
title: Docker and persistent-state problems
sidebar_position: 4
---

# Docker and persistent-state problems

## Use this when

A Docker instance cannot write data, a project is absent in the container, or an apparent update has created a new empty instance.

## Before you start

Do not remove the data volume while diagnosing. Application state is in `/data`; the host project is only visible where you mount it, such as `/workspace`.

## Do it

Inspect the running configuration:

```bash
docker volume inspect cptr-data
docker inspect <container-name>
```

Confirm the container has `cptr-data` mounted at `/data` and the intended host project mounted at `/workspace`. For a writable bind-mounted data directory, ensure the container user can create and update `app.db` there.

## Verify it worked

The container starts without SQLite write errors, the browser shows the preexisting account/workspaces, and a terminal tab reports `pwd` as `/workspace`. `curl http://127.0.0.1:8000/api/health` from the host returns `status: ok`.

## If it did not

If the setup wizard reappears, recreate the container with the original `/data` volume. If a workspace is empty, correct the project bind mount and working directory. If SQLite cannot write, repair the host directory ownership or replace a broken bind mount with a Docker volume; do not run the container privileged as a permissions shortcut.

## Trust boundary

Container mounts define the data and project files the service can change. Minimizing mounts limits blast radius, but a signed-in user can still use the shell within those mounts.

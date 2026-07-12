---
title: "Add and switch workspaces"
sidebar_position: 2
---

# Add and switch workspaces

Open the workspace picker in the sidebar and add any folder on the host by its absolute path, for example `/Users/you/src/project`. You can also create a new folder directly from the picker while browsing, so starting a fresh project doesn't require a terminal.

Any folder works. It does not need to be a git repository; a directory of notes, PDFs, or downloads is a perfectly good workspace. If it is a repository, the git panel lights up automatically.

## What a workspace scopes

Selecting a workspace points the whole UI at that folder:

- the file browser and editor open its tree
- git shows that checkout's branch and changes
- new terminals start in that directory
- new chats run in that project's context, and are stored inside it
- quick search stays scoped to its files, chats, and messages

One instance, many workspaces: switch projects from the picker and each workspace keeps its own open tabs, splits, and layout. Switch away and back and everything is where you left it, on any device.

## Paths are host paths

The path you add is a path on the machine where `cptr` runs, not on the phone or laptop you're browsing from.

In Docker, that means the path **inside the container**. Mount your project first, then add the container-side path as the workspace:

```bash
docker run --rm -it \
  -p 8000:8000 \
  -v cptr-data:/data \
  -v "$PWD:/workspace" \
  -w /workspace \
  ghcr.io/open-webui/computer:latest
```

Here the workspace path is `/workspace`. If a folder doesn't appear in the picker, it usually isn't mounted into the container.

## Separate checkouts, separate workspaces

Give each checkout of a repository its own workspace. A git worktree is its own directory with its own checked-out branch, so add it as its own workspace. The [worktree picker in the git panel](./git#worktrees) does this for you when you create or open one. That way two branches can be checked out and worked on side by side without fighting over one working tree.

## Permissions

`cptr` runs as the OS account that started it. A workspace is readable and writable exactly as far as that account's permissions go: read-only mounts and file ownership apply as usual. Adding a folder as a workspace doesn't grant or restrict anything; it just tells the UI where to look.

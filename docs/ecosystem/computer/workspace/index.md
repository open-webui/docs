---
title: "Your workspace"
sidebar_position: 1
---

# Your workspace

This is the part that makes Open WebUI Computer more than a chat window. A workspace is an existing folder on your machine, with its files, terminal, git state, local services, chats, and remembered layout kept together. It is the visible source of truth for a task: before acting, confirm the path, branch, files, and running process match the work you mean to continue.

## Start with the thing you need to see

| Need | Guide |
| --- | --- |
| Confirm you opened the real project, not a copy | [Workspace paths](./workspace-paths) |
| Review a prototype, document, image, or shared file and keep feedback with it | [Review files and keep feedback with the project](./review-files-and-feedback) |
| Read, edit, or preview files | [Files and editor](./files-editor) |
| Resume a command or start a local service | [Terminals](./terminals) |
| Review a branch or diff | [Git](./git) |
| Open a running local app from another device | [Browser and port preview](./browser-port-preview) |
| Find an earlier chat, message, or file | [Search and chats](./search-chats) |
| Make the workspace easy to reach from a phone | [PWA, sharing, and shortcuts](./pwa-share-shortcuts) |

## Verify it worked

Open one existing workspace and confirm that its path, files, and git state match the host. Then create a terminal tab and run a harmless command such as `pwd`. If any of those show a different project, stop and use [workspace paths](./workspace-paths) before editing.

## Trust boundary

Workspace selection organizes your work. It does not sandbox the host or turn the directory into a separate machine. Read [the security model](/ecosystem/computer/remote-access/security-model) before sharing access.

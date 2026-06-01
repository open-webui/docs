---
sidebar_position: 5
title: "Knowledge Base Sync (oikb)"
---

# 🔄 Knowledge Base Sync (oikb)

**Keep an Open WebUI Knowledge Base in sync with an external source, automatically.**

[oikb](https://github.com/open-webui/oikb) is the official companion tool for mirroring content into [Knowledge Bases](/features/workspace/knowledge). Point it at a local folder, a GitHub repo, a Confluence space, an S3 bucket or any of its 44 connectors, and it keeps the Knowledge Base current. It is a separate program (a command-line tool plus an optional long-running daemon), not part of the Open WebUI server, but it is built specifically for Open WebUI and talks to it over the normal API.

:::info Requires Open WebUI 0.9.6+
oikb drives the incremental sync endpoints (`/sync/diff` and `/sync/cleanup`) that landed in **v0.9.6**. Against an older server there is nothing for it to call. See [Syncing a local directory](/features/workspace/knowledge#syncing-a-local-directory) for what those endpoints do on the server side.
:::

---

## Why use it

Uploading files by hand is fine once. Keeping a Knowledge Base current as the source keeps changing is the painful part. oikb solves that with **incremental** sync: it hashes every file (SHA-256), asks the server what has actually changed, and uploads only **new** and **modified** files while removing **deleted** ones. An unchanged 10,000-file repo re-syncs in seconds because nothing is re-uploaded or re-embedded.

In plain terms: you can wire a Knowledge Base to a living source (a docs repo, a wiki, a storage bucket) and have it stay fresh on a schedule or on every push, instead of slowly drifting out of date.

---

## Quick start

Install it, point it at your server, and sync a folder:

```bash
pip install oikb

export OPEN_WEBUI_URL=http://localhost:3000
export OPEN_WEBUI_API_KEY=sk-your-api-key   # generate one under Settings → Account

# Sync a local folder into a Knowledge Base
oikb sync ./docs --kb-id your-kb-id

# Or a GitHub repo
oikb sync github:owner/repo --kb-id your-kb-id

# Preview without uploading anything
oikb sync ./docs --kb-id your-kb-id --dry-run
```

`--kb-id` is the Knowledge Base's ID, visible in its URL in the Workspace. The API key authenticates as your user, so oikb can only touch Knowledge Bases that user already has write access to.

For multi-source, scheduled or webhook-driven sync, run `oikb init` to generate a `.oikb.yaml` config file, then `oikb daemon`. The full command reference, connector setup and deployment guide live in the [oikb repository](https://github.com/open-webui/oikb).

---

## Connectors

oikb reads from 44 sources. A representative slice:

| Category | Sources |
|---|---|
| Code repos | GitHub, GitLab, Bitbucket |
| Cloud storage | S3, GCS, Azure Blob, Google Drive, SharePoint, Dropbox |
| Wikis & KBs | Confluence, Notion, BookStack, GitBook, Outline, Document360 |
| Ticketing | Jira, Linear, Zendesk, ServiceNow, Asana, ClickUp |
| Messaging | Slack, Discord, Microsoft Teams, Gmail |
| Web | Website / sitemap crawler |

Some connectors need an optional extra, for example `pip install oikb[gdrive]`, `pip install oikb[s3]` or `pip install oikb[all]` for everything. The [repository](https://github.com/open-webui/oikb) lists the full set and each connector's options.

---

## Let the model trigger syncs

The oikb daemon can itself be exposed to Open WebUI as an [OpenAPI tool server](/features/extensibility/plugin/tools/openapi-servers). Add the daemon's URL (for example `http://oikb:8080`) under **Admin Settings → External Tools** (or **Settings → Tools** for a personal connection), and the model can trigger a sync, check status and query sync history as tool calls during a chat.

:::note
This is a standard OpenAPI tool-server connection, the same mechanism covered on the [OpenAPI / MCP tool servers](/features/extensibility/mcp) page. Set the daemon's own `OIKB_API_KEY` to protect its endpoints before you expose it.
:::

---

## How it fits together

1. oikb scans the source and computes a SHA-256 for each file.
2. It sends the manifest to Open WebUI's `/sync/diff`, which replies with exactly what is added, modified and deleted, and which directories to create or remove. This call is read-only; it does not change the Knowledge Base.
3. oikb uploads only the new and modified files (with their hashes), then calls `/sync/cleanup` to drop the stale ones.

The server side of this loop is documented under [Knowledge → Syncing a local directory](/features/workspace/knowledge#syncing-a-local-directory). oikb is the maintained client that implements the full loop and adds scheduling, webhooks and 44 source connectors on top.

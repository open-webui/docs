---
sidebar_position: 1
title: "Knowledge Base Sync (oikb)"
slug: /features/knowledge-base-sync
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 🔄 Knowledge Base Sync (oikb)

<ThemedImage
  alt="Knowledge Base Sync: many different source connectors flowing through the oikb sync hub into Open WebUI Knowledge Bases"
  sources={{
    light: useBaseUrl('/images/banners/kbsync-light.svg'),
    dark: useBaseUrl('/images/banners/kbsync-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Keep a Knowledge Base in sync with the source of truth, automatically.**

[oikb](https://github.com/open-webui/oikb) is the official companion tool for mirroring content into [Knowledge Bases](/features/workspace/knowledge). Point it at a local folder, a GitHub repo, a Confluence space, an S3 bucket or any of its 44 connectors, and it keeps the Knowledge Base current.

Unlike a one-time upload, which is stale the moment the source changes, oikb does **incremental** sync: it wires a Knowledge Base to a living source once, then keeps it fresh on a schedule, on every push or on demand. A docs repo, a wiki, a storage bucket, all stay current without anyone babysitting them.

It is a separate program (a command-line tool plus an optional long-running [daemon](/features/knowledge-base-sync/daemon)), not part of the Open WebUI server, but it is built for Open WebUI and talks to it over the normal REST API.

:::info Requires Open WebUI 0.9.6+
oikb drives the incremental sync endpoints (`/sync/diff` and `/sync/cleanup`) that landed in **v0.9.6**. Against an older server there is nothing for it to call. The server side of these endpoints is documented under [Knowledge → Syncing a local directory](/features/workspace/knowledge#syncing-a-local-directory).
:::

---

## Why Knowledge Base Sync?

### Only the changes move

Every file is hashed (SHA-256) and compared against what the server already has, so only new and modified files upload and deletions are removed. An unchanged 10,000-file repo re-syncs in seconds because nothing is re-uploaded or re-embedded. Running it often costs almost nothing.

### Built for large libraries

The in-app **Sync Directory** action runs in your browser, so on a large set (thousands of files or a multi-gigabyte vault) it gets slow and shows little progress. oikb runs natively with progress bars, parallel uploads and retries, so a library of tens of thousands of files syncs reliably. **If your corpus is large, this is the recommended way to load it.**

### One tool, every source

Point it at a local folder, a Git repo, a Confluence or Notion space, an S3 bucket, a Jira project, a Slack channel and 30-something more. The same command and the same incremental engine work for all of them.

### Stays fresh on its own

Sync once by hand, or hand it to the [daemon](/features/knowledge-base-sync/daemon) to run on an interval, a cron or the instant someone pushes. A Knowledge Base wired to a living source stops quietly drifting out of date.

### The model can drive it

The daemon doubles as an [OpenAPI tool server](/features/knowledge-base-sync/daemon#let-the-model-trigger-syncs), so a model can trigger a re-sync and report back mid-conversation, without anyone touching the command line.

---

## Key Features

| | |
| :--- | :--- |
| ⚡ **Incremental sync** | SHA-256 diffing uploads only new and modified files; deletions are removed, unchanged files left untouched |
| 🌐 **44 connectors** | Local folders, Git, cloud storage, wikis, ticketing, chat, CRM, plus a web crawler |
| ⏱️ **Scheduled & webhook sync** | Run on an interval, a cron or the moment someone pushes (via the daemon) |
| 👀 **Watch mode** | Auto-sync a local folder on every save |
| 🎯 **Selective sync** | Include/exclude globs, size caps and split one source across multiple Knowledge Bases |
| 🤖 **Model-triggerable** | The daemon is an OpenAPI tool server, so a model can start and check syncs from chat |
| 🔑 **Uses your access** | Authenticates as your user and never bypasses Knowledge Base access control |
| 📊 **Production-ready** | Prometheus metrics, structured JSON logs, sync history and failure notifications |

---

## Install

```bash
pip install oikb
```

Requires **Python 3.11+** and an **Open WebUI 0.9.6+** server. Most connectors talk plain HTTP and need nothing extra. A few need their vendor SDK, installed as an optional extra:

```bash
pip install oikb[s3]       # Amazon S3
pip install oikb[gcs]      # Google Cloud Storage
pip install oikb[azure]    # Azure Blob
pip install oikb[dropbox]  # Dropbox
pip install oikb[gdrive]   # Google Drive
pip install oikb[all]      # every optional connector at once
```

The full set of extras is `s3`, `gcs`, `azure`, `dropbox`, `r2`, `gdrive`, `gmail`, `gsites`, `web`, `oracle`, `sharepoint-cert` and `all`. Connectors not listed here (GitHub, Confluence, Notion, Jira, Slack and most others) need no extra.

For production, a Docker image is published at `ghcr.io/open-webui/oikb`. See [Running the daemon](/features/knowledge-base-sync/daemon#deployment).

---

## Quick start

```bash
export OPEN_WEBUI_URL=http://localhost:3000
export OPEN_WEBUI_API_KEY=sk-your-api-key   # Settings → Account → API keys

# Sync a local folder into a Knowledge Base
oikb sync ./docs --kb-id your-kb-id

# Or a GitHub repo, no local clone needed
oikb sync github:owner/repo --kb-id your-kb-id

# Preview exactly what would change and upload nothing
oikb sync ./docs --kb-id your-kb-id --dry-run
```

`--kb-id` is the Knowledge Base's ID, the UUID in its URL in the Workspace (`.../knowledge/<kb-id>`). Run the same command twice and the second run does nothing: only files whose contents changed are touched.

### What a sync looks like

The first run uploads everything; every run after that moves only what changed:

```console
$ oikb sync github:acme/handbook --kb-id 8f3a2b1c-...
  1,204 files found
  Diff: +3, ~1, -2, 1198 unchanged
  Uploading ━━━━━━━━━━━━━━━━━━━━ 4/4 • 0:00:02
Sync complete: 3 added, 1 modified, 2 deleted, 1198 unchanged
```

The `Diff` line is the server's answer to "what actually changed": three new files, one modified, two deleted and 1,198 left exactly as they were.

:::note Access is your access
The API key authenticates as **your** user. oikb can only read and write Knowledge Bases that user already has access to. It is not an admin backdoor, and it does not bypass [access control](/features/authentication-access/rbac).
:::

### Saving credentials

So you don't repeat the URL and key on every command:

```bash
oikb config set url http://localhost:3000
oikb config set token sk-your-api-key
oikb config get                    # show what's saved (token is masked)
```

Saved to `~/.config/oikb/config.yaml` (override the directory with `OIKB_CONFIG_DIR`). Resolution order, highest priority first:

1. CLI flags (`--url`, `--token`)
2. Environment (`OPEN_WEBUI_URL`, `OPEN_WEBUI_API_KEY`)
3. Config file

---

## How incremental sync works

1. oikb scans the source and computes a **SHA-256** checksum for every file.
2. It sends that manifest (path, filename and checksum, **not** the file contents) to Open WebUI's `/sync/diff`, which replies with exactly what is **added**, **modified** and **deleted**, plus which directories to create or remove. This call is read-only; it does not change the Knowledge Base.
3. oikb deletes the stale files (and now-empty directories), creates any missing directories, then uploads only the **new** and **modified** files, each tagged with its hash so the server skips re-hashing.

Because the diff is by content hash, an unchanged repository re-syncs almost instantly: nothing is re-uploaded, re-extracted or re-embedded, so there is no cost to running it often. Only real changes do any work.

Transient server errors (HTTP 5xx) during upload are retried up to three times with exponential backoff. Uploads run sequentially by default; pass `--concurrency N` (or set `concurrency:` per entry) to upload N files in parallel for large syncs.

The matching server-side behaviour and the same two endpoints exposed for your own scripts are documented under [Knowledge → Syncing a local directory](/features/workspace/knowledge#syncing-a-local-directory) and [Knowledge → API access](/features/workspace/knowledge#api-access). oikb is the maintained client that implements the full loop and adds scheduling, webhooks and 44 connectors on top.

---

## Sources and connectors

A **source** is either a local path or a `scheme:target` string. oikb resolves the scheme to a connector, pulls the files and syncs them into the Knowledge Base. Credentials are never written into the source string or `.oikb.yaml`; each connector reads them from **environment variables**, so secrets stay out of your config (pair with [`${VAR}` interpolation](/features/knowledge-base-sync/daemon#the-oikbyaml-config-file) to keep config files committable).

In the table below, `[brackets]` mark optional parts of the source string.

| Group | Connector | Source string | Credentials (env vars) |
|---|---|---|---|
| **Local** | Local directory | `./path` (any filesystem path) | none |
| **Code** | GitHub | `github:owner/repo` | `GITHUB_TOKEN` (private repos) |
| | GitLab | `gitlab:owner/repo` | `GITLAB_TOKEN`, `GITLAB_URL` (self-managed) |
| | Bitbucket | `bitbucket:owner/repo` | `BITBUCKET_USER`, `BITBUCKET_APP_PASSWORD` |
| **Cloud storage** | Amazon S3 | `s3://bucket/prefix` | standard AWS credential chain (boto3) |
| | Google Cloud Storage | `gs://bucket/prefix` | `GOOGLE_APPLICATION_CREDENTIALS` |
| | Azure Blob | `az://container/prefix` | `AZURE_STORAGE_CONNECTION_STRING` |
| | Cloudflare R2 | `r2://bucket/prefix` | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` |
| | Oracle Cloud | `oci://bucket/prefix` | `OCI_NAMESPACE` + OCI SDK config |
| | Dropbox | `dropbox:/path` | `DROPBOX_TOKEN` |
| | Google Drive | `gdrive:folder_id` | `GOOGLE_APPLICATION_CREDENTIALS` |
| | SharePoint | `sharepoint:site[/library]` | `SHAREPOINT_TENANT_ID`, `SHAREPOINT_CLIENT_ID` and `SHAREPOINT_CLIENT_SECRET` **or** `SHAREPOINT_CERTIFICATE_PATH` |
| | Egnyte | `egnyte:/path` | `EGNYTE_DOMAIN`, `EGNYTE_TOKEN` |
| **Wikis & KBs** | Confluence | `confluence:SPACE` | `CONFLUENCE_URL`, `CONFLUENCE_USER`, `CONFLUENCE_TOKEN` |
| | Notion | `notion:root_id` | `NOTION_TOKEN` |
| | BookStack | `bookstack:` | `BOOKSTACK_URL`, `BOOKSTACK_TOKEN_ID`, `BOOKSTACK_TOKEN_SECRET` |
| | Discourse | `discourse:[category]` | `DISCOURSE_URL`, `DISCOURSE_API_KEY`, `DISCOURSE_API_USERNAME` |
| | GitBook | `gitbook:space_id` | `GITBOOK_TOKEN` |
| | Guru | `guru:[collection]` | `GURU_USER`, `GURU_TOKEN` |
| | Outline | `outline:[collection]` | `OUTLINE_URL`, `OUTLINE_TOKEN` |
| | Slab | `slab:[org]` | `SLAB_ORG`, `SLAB_TOKEN` |
| | Document360 | `document360:project_id` | `DOCUMENT360_TOKEN` |
| | DokuWiki | `dokuwiki:[namespace]` | `DOKUWIKI_URL`, `DOKUWIKI_USER`, `DOKUWIKI_PASSWORD` |
| | Google Sites | `gsites:site_id` | `GOOGLE_SITES_TOKEN` |
| **Ticketing** | Jira | `jira:PROJECT` | `JIRA_URL`, `JIRA_USER`, `JIRA_TOKEN` |
| | Linear | `linear:team_key` | `LINEAR_TOKEN` |
| | Zendesk | `zendesk:[subdomain]` | `ZENDESK_SUBDOMAIN`, `ZENDESK_USER`, `ZENDESK_TOKEN` |
| | Freshdesk | `freshdesk:[domain]` | `FRESHDESK_DOMAIN`, `FRESHDESK_TOKEN` |
| | Asana | `asana:project_id` | `ASANA_TOKEN` |
| | ClickUp | `clickup:space_id` | `CLICKUP_TOKEN` |
| | Airtable | `airtable:base_id[/table]` | `AIRTABLE_TOKEN` |
| | ServiceNow | `servicenow:[table]` | `SERVICENOW_INSTANCE`, `SERVICENOW_USER`, `SERVICENOW_PASSWORD` |
| | ProductBoard | `productboard:` | `PRODUCTBOARD_TOKEN` |
| **Messaging** | Slack | `slack:channel_id` | `SLACK_TOKEN` |
| | Discord | `discord:channel_id` | `DISCORD_TOKEN` |
| | Microsoft Teams | `teams:team_id/channel_id` | `TEAMS_TENANT_ID`, `TEAMS_CLIENT_ID`, `TEAMS_CLIENT_SECRET` |
| | Gmail | `gmail:user@example.com` | `GOOGLE_APPLICATION_CREDENTIALS` |
| | Zulip | `zulip:[stream]` | `ZULIP_URL`, `ZULIP_EMAIL`, `ZULIP_KEY` |
| **Meetings** | Gong | `gong:` | `GONG_ACCESS_KEY`, `GONG_ACCESS_KEY_SECRET` |
| | Fireflies | `fireflies:` | `FIREFLIES_TOKEN` |
| **Sales & CRM** | Salesforce | `salesforce:` | `SALESFORCE_URL`, `SALESFORCE_TOKEN` |
| | HubSpot | `hubspot:` | `HUBSPOT_TOKEN` |
| **Forums** | XenForo | `xenforo:[forum_id]` | `XENFORO_URL`, `XENFORO_KEY` |
| **Web** | Website / sitemap | `web:https://example.com` | none |

A few connector notes worth knowing:

- **GitHub** reads through the Trees API, so there is no local clone. Add `--branch` and `--path` (or `branch:` / `path:` in config) to target a branch or subdirectory.
- **Chat connectors** (Slack, Discord, Teams) split history by day so the sync is genuinely incremental: past days are immutable, so their checksums never change and they are never re-uploaded.
- **Jira** and **ServiceNow** accept extra options in the source string (query, fields, output format, result limit), for example `servicenow:incident?query=...&limit=500`. See the [oikb repository](https://github.com/open-webui/oikb) for each connector's full options.

---

## Filtering what gets synced

Narrow a source with include/exclude globs and a size cap. These live under `filter:` in [`.oikb.yaml`](/features/knowledge-base-sync/daemon#the-oikbyaml-config-file):

```yaml
sources:
  - name: docs
    source: github:owner/repo
    kb-id: your-kb-id
    filter:
      include: ["docs/**/*.md", "*.txt"]   # only these
      exclude: ["drafts/**", "**/*.tmp"]   # minus these (applied after include)
      max-size: 50mb                        # skip anything larger
```

`max-size` accepts `b`, `kb`, `mb`, `gb`. Oversized files are warned about and skipped before the diff, so they never upload. It is also available as a CLI flag: `oikb sync ./docs --kb-id abc --max-file-size 50mb`.

To route different parts of one source into different Knowledge Bases, use separate entries with different `filter.include` and `kb-id`:

```yaml
sources:
  - name: user-docs
    source: github:owner/repo
    kb-id: abc123
    filter: { include: ["docs/**"] }
  - name: api-reference
    source: github:owner/repo
    kb-id: def456
    filter: { include: ["api/**"] }
```

### Skipped files and `.oikbignore`

When syncing a **local directory**, oikb always skips hidden entries (anything starting with `.`) and a built-in list: `.git`, `.svn`, `.hg`, `.DS_Store`, `Thumbs.db`, `__pycache__`, `.pytest_cache`, `node_modules`, `.oikb`, `.env`.

For project-specific exclusions, drop a `.oikbignore` file in the sync root. It uses gitignore-style globs (a trailing `/` matches directories only, a leading `/` anchors to the root). Negation with `!` is not yet supported.

---

## Watch mode

For a local directory you are actively editing, `watch` re-syncs the moment a file changes:

```bash
oikb watch ./docs --kb-id your-kb-id
```

It uses filesystem events (not polling), debounced one second (tune with `--debounce`), and runs until you stop it with Ctrl+C. Good for a live notes folder; for anything remote or unattended, use the [daemon](/features/knowledge-base-sync/daemon) instead.

---

## One-shot sync in CI

The Docker image runs as a one-shot command, which makes it a drop-in [GitHub Actions](/features/knowledge-base-sync/daemon#deployment) step to push docs into a Knowledge Base on every merge:

```yaml
- name: Sync docs to Open WebUI
  uses: docker://ghcr.io/open-webui/oikb:latest
  with:
    args: sync /github/workspace/docs --kb-id ${{ secrets.KB_ID }}
  env:
    OPEN_WEBUI_URL: ${{ secrets.OPEN_WEBUI_URL }}
    OPEN_WEBUI_API_KEY: ${{ secrets.OPEN_WEBUI_API_KEY }}
```

---

## CLI reference

| Command | What it does |
|---|---|
| `oikb sync <source>` | Incremental sync from a source to a KB (`--kb-id`). Omit `<source>` to sync every entry in [`.oikb.yaml`](/features/knowledge-base-sync/daemon#the-oikbyaml-config-file). |
| `oikb sync --dry-run` | Preview added/modified/deleted without uploading. |
| `oikb sync --concurrency N` | Upload N files in parallel (default 1, sequential). |
| `oikb sync --max-file-size 50mb` | Skip files above a size. |
| `oikb sync --name <alias>` | In `.oikb.yaml` mode, sync only the matching entry. |
| `oikb diff <source> --kb-id ID` | Preview changes (alias for `sync --dry-run`). |
| `oikb watch <dir> --kb-id ID` | Auto-sync a local directory on change (`--debounce`). |
| `oikb init` | Interactive wizard that writes a `.oikb.yaml`. |
| `oikb validate` | Check `.oikb.yaml` syntax. Add `--deep` to also ping Open WebUI, verify the API key and confirm each KB exists. |
| `oikb daemon` | Run the scheduled [daemon](/features/knowledge-base-sync/daemon) with an HTTP API. |
| `oikb ls --kb-id ID` | List files in a KB. |
| `oikb status --kb-id ID` | Show a KB's name, file count and total size. |
| `oikb history` | View sync history (`--json`, `--errors`, `--kb-id`, `--clear --days N`). |
| `oikb reset --kb-id ID` | Delete all files in a KB (`--keep-directories` keeps the folder structure). Prompts for confirmation. |
| `oikb config set url\|token <value>` | Save the Open WebUI URL or API key. `oikb config get` shows them. |

Add `-q` / `--quiet` to any command to suppress non-error output (useful in scripts), and `-v` / `--verbose` for per-file detail.

:::warning `oikb reset` deletes everything in the KB
`reset` removes every file in the target Knowledge Base, not just files oikb uploaded. It is the one destructive command. The confirmation prompt is there for a reason.
:::

---

## Use Cases

### Always-current product docs

Wire your docs repo (`github:acme/docs`) to a Knowledge Base and sync on every merge in CI, or on a webhook. Support agents and customers query documentation that is never more than one commit out of date.

### A large personal or family vault

Thousands of mixed documents (PDFs, Markdown, scans, records) in one well-organized folder. Point oikb at the top of the vault and it syncs the whole tree, every subdirectory included, into a single Knowledge Base, so household members can ask questions without needing to know which subfolder holds the answer. The in-app sync struggles at this size; oikb is built for it.

### Company handbook from the wiki

Mirror a Confluence space or Notion workspace into a KB on a morning cron. An "Ask HR" model answers from the current handbook, and edits made in the wiki show up the next day with nobody re-uploading anything.

### Support knowledge from tickets

Sync resolved Zendesk or Jira tickets into a KB so a triage model can surface how similar issues were handled before, grounded in your own history rather than generic training data.

### Code-aware assistant

Split one repo across two Knowledge Bases with filters: prose under `docs/**` into a "Docs" KB, source under `src/**` into a "Code" KB. Attach whichever fits the model, and both stay in sync from a single config.

---

## Limitations

### Requires Open WebUI 0.9.6+

The incremental sync endpoints landed in v0.9.6. Against an older server there is nothing for oikb to call.

### The daemon runs as one process

Scheduling and the per-KB locks live in a single process, so the [daemon](/features/knowledge-base-sync/daemon#deployment) is meant to run as one replica. To cover more sources, add entries to one daemon rather than running several copies.

### Indexing still happens server-side

oikb uploads fast, but Open WebUI extracts and embeds each new file asynchronously. A just-synced file is in the Knowledge Base, but it may take a moment before it is queryable.

---

## Troubleshooting

**`Connection refused` or `401 Unauthorized`**: the URL or key is wrong or unset. Check with `oikb config get`, or `echo $OPEN_WEBUI_URL` and `echo $OPEN_WEBUI_API_KEY`. The key must be a valid Open WebUI API key (Settings → Account).

**`No source specified and no .oikb.yaml found`**: you ran `oikb sync` with no source and there is no `.oikb.yaml` in the current directory. Either pass a source (`oikb sync ./docs --kb-id ...`) or create a config with `oikb init`.

**Large syncs are slow**: add `--concurrency 4` for parallel uploads, set `filter.max-size` to skip big binaries and use `filter.exclude` to drop anything the model does not need.

**Daemon won't start / a KB seems missing**: run `oikb validate --deep`. It verifies the server is reachable, the API key is valid and every `kb-id` in your config actually exists.

**Where is my KB ID?** Open the Knowledge Base in the Workspace; the UUID is the last path segment of the URL, `.../knowledge/<kb-id>`.

---

## See also

- **[Running the daemon →](/features/knowledge-base-sync/daemon)**: scheduled sync, webhooks, the HTTP API, observability, deployment and letting a model trigger syncs.
- **[Knowledge](/features/workspace/knowledge)**: the Knowledge Base feature oikb feeds, including the server-side [sync endpoints](/features/workspace/knowledge#api-access).
- **[OpenAPI / MCP tool servers](/features/extensibility/mcp)**: how the daemon plugs in as a tool the model can call.

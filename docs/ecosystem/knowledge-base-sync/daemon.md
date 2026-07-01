---
sidebar_position: 2
title: "Daemon, Webhooks & Deployment"
---

# Running the daemon

The CLI on the [main page](/ecosystem/knowledge-base-sync) covers one-off and watched syncs. For anything unattended, scheduled or driven by external events, run oikb as a long-lived **daemon**. It reads your [`.oikb.yaml`](#the-oikbyaml-config-file), syncs each source on its own schedule and exposes a small HTTP API for health checks, metrics, history and on-demand triggers.

```bash
oikb daemon
```

| Flag | Default | Purpose |
|---|---|---|
| `--port` | `8080` | Port for the HTTP API and health checks. |
| `--config` | `./.oikb.yaml` | Path to the config file. |
| `--log-format` | `text` | `text` or `json`. Also set by `LOG_FORMAT`. |
| `--no-server` | off | Run the scheduler only, with no HTTP server (no API, no webhooks, no metrics). |

On startup it prints the configured sources, whether auth is on and the endpoint URLs.

---

## The `.oikb.yaml` config file

A single source on the command line needs no config file. For multiple sources, scheduling, webhooks or the daemon, you describe everything in `.oikb.yaml`. Generate one interactively with `oikb init`, or write it by hand:

```yaml
defaults:                      # optional, applied to every entry below
  interval: 1h
  concurrency: 4
  filter:
    max-size: 50mb

sources:
  - name: wiki                 # friendly alias for CLI/API targeting
    source: github:owner/repo
    kb-id: 8f3a2b1c-...
    webhook: true              # also sync on push (see Webhooks)

  - name: handbook
    source: confluence:ENG
    kb-id: 4e7d9a0f-...
    interval: "0 6 * * 1-5"    # overrides the default interval
    notify:
      url: https://hooks.slack.com/services/T.../B.../xxx
      on: error
```

**Per-entry keys:** `name`, `source`, `kb-id` (the two required ones are `source` and `kb-id`), `interval`, `concurrency`, `branch`, `path`, `filter` (`include` / `exclude` / `max-size`), `notify`, `webhook` and the per-provider webhook secrets (`github_secret`, `gitlab_secret`, `slack_signing_secret`). You can also set `url` and `token` per entry to point different sources at different servers.

**Defaults** are deep-merged into each entry, so nested blocks like `filter` and `notify` combine rather than replace; any key set on an entry wins over the default.

**Environment interpolation:** every string value supports `${VAR}` and `${VAR:-default}`. This keeps secrets out of the file so it can be committed:

```yaml
sources:
  - name: docs
    source: github:${GITHUB_ORG}/docs
    kb-id: ${KB_DOCS_ID}
    token: ${OPEN_WEBUI_API_KEY}
    notify:
      url: ${SLACK_WEBHOOK:-https://hooks.slack.com/fallback}
```

:::note
The top-level key is `sources:`. The older name `sync:` still works for backward compatibility.
:::

Once the file exists, `oikb sync` (no source argument) runs every entry once, and `oikb sync --name wiki` runs just one.

---

## Scheduling

Each entry's `interval` is either a simple duration or a cron expression. oikb auto-detects which by counting fields, so no flag is needed:

```yaml
interval: 30m               # simple: every 30 minutes
interval: 1h                # every hour
interval: "0 6 * * 1-5"     # cron: weekdays at 06:00
interval: "0 */6 * * *"     # cron: every 6 hours
```

Simple durations accept `s`, `m`, `h`, `d`. Both styles can be mixed across entries in the same file.

---

## HTTP API

| Endpoint | Auth | Description |
|---|:---:|---|
| `GET /` | public | Status dashboard (a small page that polls `/health`). |
| `GET /health` | public | Sync status for every source: last run, duration, file counts, errors. |
| `GET /health/ready` | public | Liveness probe for Docker/Kubernetes. |
| `GET /metrics` | public | Prometheus metrics. |
| `GET /history` | 🔒 | Sync history, filterable by `kb_id` and `errors_only`. |
| `POST /sync/{name-or-kb-id}` | 🔒 | Trigger an immediate sync. Add `?dry_run=true` to preview only. |
| `POST /webhooks/github` · `/gitlab` · `/slack` · `/confluence` | signature | Real-time sync on push (see [Webhooks](#webhooks)). |

A triggered sync runs in the background and returns immediately; poll `/health` for progress. A `dry_run=true` trigger runs synchronously and returns the added/modified/deleted counts.

### Authentication

Set `OIKB_API_KEY` to protect the daemon. The health, readiness, metrics and dashboard endpoints stay public (so probes and scrapers keep working); `/history` and `/sync` then require a bearer token:

```bash
export OIKB_API_KEY=your-secret-key
oikb daemon
```

```bash
curl -X POST http://localhost:8080/sync/wiki \
  -H "Authorization: Bearer your-secret-key"
```

For Docker/Kubernetes secrets, set `OIKB_API_KEY_FILE` to a file path instead of putting the key in an environment variable. (Setting both is an error.)

---

## Webhooks

Turn on `webhook: true` for an entry and the daemon syncs it the instant the source changes, instead of waiting for the next interval. The push payload is matched to the right entry by repository or space, so one daemon serves many sources.

```yaml
sources:
  - name: docs
    source: github:owner/repo
    kb-id: abc123
    webhook: true
    github_secret: ${GITHUB_WEBHOOK_SECRET}   # verifies the payload signature
```

Then add a webhook in the source system pointing at the daemon:

- **GitHub** → repo Settings → Webhooks → `http://your-daemon:8080/webhooks/github`. With `github_secret` set, the `X-Hub-Signature-256` HMAC is verified and anything unsigned or mis-signed is rejected with `403`.
- **GitLab** → `…/webhooks/gitlab`, verified against `gitlab_secret` via the `X-Gitlab-Token` header.
- **Slack** → `…/webhooks/slack`, verified with `slack_signing_secret` (Slack's v0 request signature). The endpoint also answers Slack's URL-verification challenge.
- **Confluence** → `…/webhooks/confluence`, matched by space key.

If you do not set a secret, the signature check is skipped, so only expose the daemon on a trusted network in that case.

### Sync locking

Each Knowledge Base has its own lock. If a webhook fires while a scheduled sync of the same KB is still running, the duplicate is skipped (and logged) rather than racing the first one. This is automatic and needs no configuration.

---

## Observability

### Prometheus metrics

`GET /metrics` exports counters and a duration histogram, all labelled by source:

| Metric | Type | Meaning |
|---|---|---|
| `oikb_sync_total` | counter | Syncs, by source and status. |
| `oikb_sync_duration_seconds` | histogram | Sync duration. |
| `oikb_files_uploaded_total` | counter | Files added plus modified. |
| `oikb_files_deleted_total` | counter | Files deleted. |
| `oikb_sync_errors_total` | counter | Failed syncs. |
| `oikb_info` | gauge | Build version. |

```yaml
scrape_configs:
  - job_name: oikb
    static_configs:
      - targets: ["oikb:8080"]
```

### Structured JSON logging

For log aggregators (Datadog, Splunk, ELK, CloudWatch, Loki), emit one JSON object per line:

```bash
oikb daemon --log-format json     # or LOG_FORMAT=json
```

### Failure notifications

Add `notify` to an entry to POST a JSON payload to any HTTP endpoint when a sync fails (or always). The payload includes a `text` field, so a Slack incoming webhook renders it directly:

```yaml
notify:
  url: https://hooks.slack.com/services/T.../B.../xxx
  on: error            # error (default) | always
```

The same shape works for PagerDuty, Opsgenie or your own receiver. Alongside `text` it carries structured fields (`source`, `status`, `error`, `duration_ms`, file counts).

### Sync history

Every run is recorded in a local SQLite database. Query it over the API (`GET /history`) or from the CLI:

```bash
oikb history                    # recent runs, table view
oikb history --errors           # failures only
oikb history --json             # machine-readable
oikb history --clear --days 7   # prune entries older than 7 days
```

---

## Let the model trigger syncs

The daemon is also an **[OpenAPI tool server](/features/extensibility/mcp)**. Point Open WebUI at it and a model can trigger a sync, check its status and read sync history as tool calls during a chat:

> **You:** The handbook KB looks out of date. Re-sync it and tell me what changed.
>
> *(The model calls `trigger_sync`, polls `get_sync_status`, then answers.)*
>
> **Assistant:** Re-synced `handbook`: 4 files updated, 1 removed. It is current as of just now.

It serves a spec at `GET /openapi.json` exposing exactly three actions (the dashboard, metrics, health and webhook routes are hidden, so the model only sees the useful ones):

| Tool | Maps to | Does |
|---|---|---|
| `trigger_sync` | `POST /sync/{identifier}` | Start a sync by alias or KB ID (optionally dry-run). |
| `get_sync_status` | `GET /health` | Report each source's current status and last result. |
| `get_sync_history` | `GET /history` | Return recent sync runs. |

To connect it:

1. **Secure it first.** Set `OIKB_API_KEY` so `/sync` and `/history` are not open to anyone who can reach the daemon.
2. Add the daemon's URL (for example `http://oikb:8080`) as a tool server: **Admin Settings → External Tools** for an instance-wide connection, or **Settings → Tools** for a personal one. Supply the same `OIKB_API_KEY` as the connection's API key.

This is a standard OpenAPI tool-server connection, the same mechanism described on the [OpenAPI / MCP tool servers](/features/extensibility/mcp) page; oikb just happens to be the thing on the other end.

---

## Deployment

### Docker

```bash
docker run -d \
  -e OPEN_WEBUI_URL=http://open-webui:8080 \
  -e OPEN_WEBUI_API_KEY=sk-... \
  -e OIKB_API_KEY=your-daemon-key \
  -e LOG_FORMAT=json \
  -v ./.oikb.yaml:/app/.oikb.yaml:ro \
  -p 8080:8080 \
  ghcr.io/open-webui/oikb:latest daemon
```

### Docker Compose

Run it next to Open WebUI on the same network, so it reaches the server by service name:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"

  oikb:
    image: ghcr.io/open-webui/oikb:latest
    environment:
      - OPEN_WEBUI_URL=http://open-webui:8080
      - OPEN_WEBUI_API_KEY=${OPEN_WEBUI_API_KEY}
      - OIKB_API_KEY=${OIKB_API_KEY}
      - LOG_FORMAT=json
    volumes:
      - ./.oikb.yaml:/app/.oikb.yaml:ro
    command: daemon
    ports:
      - "8080:8080"
    depends_on:
      - open-webui
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health/ready"]
      interval: 30s
      timeout: 5s
```

### Kubernetes

Mount the config from a ConfigMap, pull secrets from a Secret and wire the probes to the health endpoints:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oikb
spec:
  replicas: 1
  selector:
    matchLabels: { app: oikb }
  template:
    metadata:
      labels: { app: oikb }
    spec:
      containers:
        - name: oikb
          image: ghcr.io/open-webui/oikb:latest
          args: ["daemon"]
          ports:
            - containerPort: 8080
          env:
            - name: OPEN_WEBUI_URL
              value: http://open-webui:8080
            - name: OPEN_WEBUI_API_KEY
              valueFrom: { secretKeyRef: { name: oikb-secrets, key: open-webui-api-key } }
            - name: OIKB_API_KEY
              valueFrom: { secretKeyRef: { name: oikb-secrets, key: oikb-api-key } }
            - name: LOG_FORMAT
              value: json
          volumeMounts:
            - name: config
              mountPath: /app/.oikb.yaml
              subPath: .oikb.yaml
          livenessProbe:
            httpGet: { path: /health/ready, port: 8080 }
            initialDelaySeconds: 5
            periodSeconds: 30
          readinessProbe:
            httpGet: { path: /health, port: 8080 }
            initialDelaySeconds: 10
            periodSeconds: 60
      volumes:
        - name: config
          configMap: { name: oikb-config }
```

:::caution Run a single replica
The scheduler and per-KB locks live in one process, so the daemon is meant to run as **one replica**. Scaling it horizontally would let two schedulers sync the same Knowledge Base at once. For more sources, add entries to one daemon rather than running several copies of the same config.
:::

### GitHub Actions

For push-based, build-time syncing instead of a long-running daemon, run the image as a one-shot step. See [One-shot sync in CI](/ecosystem/knowledge-base-sync#one-shot-sync-in-ci) on the main page.

---

## See also

- **[Knowledge Base Sync (oikb)](/ecosystem/knowledge-base-sync)**: installation, sources, connectors, filtering and the CLI.
- **[Knowledge](/features/workspace/knowledge)**: the Knowledge Base feature this keeps in sync.
- **[OpenAPI / MCP tool servers](/features/extensibility/mcp)**: connecting external tool servers to Open WebUI.

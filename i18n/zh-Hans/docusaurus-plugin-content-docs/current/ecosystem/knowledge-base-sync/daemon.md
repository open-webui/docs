---
sidebar_position: 2
title: "守护进程、Webhook 与部署"
---

# 运行守护进程

[主页面](/ecosystem/knowledge-base-sync)介绍的 CLI 涵盖一次性同步和监视同步。对于任何无人值守、按计划执行或由外部事件驱动的任务，请将 oikb 作为长期运行的**守护进程**运行。它会读取你的 [`.oikb.yaml`](#the-oikbyaml-config-file)，按各自的计划同步每个来源，并公开一个小型 HTTP API，用于健康检查、指标、历史记录和按需触发。

```bash
oikb daemon
```

| 参数 | 默认值 | 用途 |
|---|---|---|
| `--port` | `8080` | HTTP API 和健康检查使用的端口。 |
| `--config` | `./.oikb.yaml` | 配置文件路径。 |
| `--log-format` | `text` | `text` 或 `json`。也可通过 `LOG_FORMAT` 设置。 |
| `--no-server` | 关闭 | 仅运行调度器，不运行 HTTP 服务器（无 API、无 webhook、无指标）。 |

启动时，它会打印已配置的来源、是否启用身份验证以及端点 URL。

---

## `.oikb.yaml` 配置文件 {#the-oikbyaml-config-file}

命令行中的单个来源不需要配置文件。对于多个来源、计划任务、webhook 或守护进程，需要在 `.oikb.yaml` 中描述所有内容。可以使用 `oikb init` 以交互方式生成，也可以手动编写：

```yaml
defaults:                      # 可选，应用于下方每个条目
  interval: 1h
  concurrency: 4
  filter:
    max-size: 50mb

sources:
  - name: wiki                 # 供 CLI/API 指定目标时使用的友好别名
    source: github:owner/repo
    kb-id: 8f3a2b1c-...
    webhook: true              # 也在推送时同步（请参阅 Webhooks）

  - name: handbook
    source: confluence:ENG
    kb-id: 4e7d9a0f-...
    interval: "0 6 * * 1-5"    # 覆盖默认间隔
    notify:
      url: https://hooks.slack.com/services/T.../B.../xxx
      on: error
```

**每个条目的键：**`name`、`source`、`kb-id`（其中 `source` 和 `kb-id` 为必填项）、`interval`、`concurrency`、`branch`、`path`、`filter`（`include` / `exclude` / `max-size`）、`notify`、`webhook`，以及各提供方的 webhook 机密（`github_secret`、`gitlab_secret`、`slack_signing_secret`）。还可以按条目设置 `url` 和 `token`，让不同来源指向不同服务器。

**默认值**会深度合并到每个条目中，因此 `filter` 和 `notify` 等嵌套块会相互组合而非替换；条目上设置的任何键都优先于默认值。

**环境变量插值：**每个字符串值都支持 `${VAR}` 和 `${VAR:-default}`。这样可以避免将机密写入文件，使文件能够安全提交：

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
顶级键为 `sources:`。为保持向后兼容，旧名称 `sync:` 仍然有效。
:::

文件创建后，`oikb sync`（不带来源参数）会将每个条目运行一次，而 `oikb sync --name wiki` 只运行指定的一个条目。

---

## 计划调度 {#scheduling}

每个条目的 `interval` 可以是简单时长或 cron 表达式。oikb 会通过计算字段数自动识别类型，因此无需额外参数：

```yaml
interval: 30m               # 简单时长：每 30 分钟
interval: 1h                # 每小时
interval: "0 6 * * 1-5"     # cron：工作日 06:00
interval: "0 */6 * * *"     # cron：每 6 小时
```

简单时长支持 `s`、`m`、`h`、`d`。同一文件中的不同条目可以混用这两种形式。

---

## HTTP API {#http-api}

| 端点 | 身份验证 | 说明 |
|---|:---:|---|
| `GET /` | 公开 | 状态仪表板（一个轮询 `/health` 的小页面）。 |
| `GET /health` | 公开 | 每个来源的同步状态：上次运行、时长、文件数、错误。 |
| `GET /health/ready` | 公开 | 用于 Docker/Kubernetes 的存活探针。 |
| `GET /metrics` | 公开 | Prometheus 指标。 |
| `GET /history` | 需要身份验证 | 同步历史，可按 `kb_id` 和 `errors_only` 筛选。 |
| `POST /sync/{name-or-kb-id}` | 需要身份验证 | 立即触发同步。添加 `?dry_run=true` 可仅预览。 |
| `POST /webhooks/github` · `/gitlab` · `/slack` · `/confluence` | 签名 | 推送时实时同步（请参阅 [Webhooks](#webhooks)）。 |

触发的同步会在后台运行并立即返回；请轮询 `/health` 查看进度。`dry_run=true` 触发器会同步执行，并返回新增/修改/删除的数量。

### 身份验证 {#authentication}

设置 `OIKB_API_KEY` 以保护守护进程。健康、就绪、指标和仪表板端点仍保持公开（以便探针和抓取器继续工作）；此时 `/history` 和 `/sync` 需要 Bearer token：

```bash
export OIKB_API_KEY=your-secret-key
oikb daemon
```

```bash
curl -X POST http://localhost:8080/sync/wiki \
  -H "Authorization: Bearer your-secret-key"
```

对于 Docker/Kubernetes 机密，请将 `OIKB_API_KEY_FILE` 设置为文件路径，而不是把密钥放入环境变量。（同时设置两者会报错。）

---

## Webhooks {#webhooks}

为条目启用 `webhook: true` 后，守护进程会在来源发生变化时立即同步，而无需等待下一个间隔。系统会根据仓库或空间将推送载荷匹配到正确的条目，因此一个守护进程可以服务多个来源。

```yaml
sources:
  - name: docs
    source: github:owner/repo
    kb-id: abc123
    webhook: true
    github_secret: ${GITHUB_WEBHOOK_SECRET}   # 验证载荷签名
```

然后在来源系统中添加一个指向守护进程的 webhook：

- **GitHub** → 仓库 Settings → Webhooks → `http://your-daemon:8080/webhooks/github`。设置 `github_secret` 后，会验证 `X-Hub-Signature-256` HMAC，未签名或签名错误的内容都会被拒绝并返回 `403`。
- **GitLab** → `…/webhooks/gitlab`，通过 `X-Gitlab-Token` 标头根据 `gitlab_secret` 进行验证。
- **Slack** → `…/webhooks/slack`，使用 `slack_signing_secret` 验证（Slack 的 v0 请求签名）。该端点还会响应 Slack 的 URL 验证质询。
- **Confluence** → `…/webhooks/confluence`，按空间键匹配。

如果未设置机密，系统会跳过签名检查，因此在这种情况下只能在受信任的网络上公开守护进程。

### 同步锁定 {#sync-locking}

每个知识库都有独立的锁。如果某个知识库的计划同步仍在运行时 webhook 被触发，系统会跳过并记录重复的同步，而不会与第一次同步竞争。此行为自动生效，无需配置。

---

## 可观测性 {#observability}

### Prometheus 指标 {#prometheus-metrics}

`GET /metrics` 会导出计数器和一个时长直方图，所有指标均按来源添加标签：

| 指标 | 类型 | 含义 |
|---|---|---|
| `oikb_sync_total` | 计数器 | 按来源和状态统计的同步次数。 |
| `oikb_sync_duration_seconds` | 直方图 | 同步时长。 |
| `oikb_files_uploaded_total` | 计数器 | 新增与修改的文件数之和。 |
| `oikb_files_deleted_total` | 计数器 | 删除的文件数。 |
| `oikb_sync_errors_total` | 计数器 | 失败的同步次数。 |
| `oikb_info` | 计量指标 | 构建版本。 |

```yaml
scrape_configs:
  - job_name: oikb
    static_configs:
      - targets: ["oikb:8080"]
```

### 结构化 JSON 日志 {#structured-json-logging}

对于日志聚合器（Datadog、Splunk、ELK、CloudWatch、Loki），可让每行输出一个 JSON 对象：

```bash
oikb daemon --log-format json     # 或 LOG_FORMAT=json
```

### 失败通知 {#failure-notifications}

在条目中添加 `notify`，可在同步失败时（或始终）向任意 HTTP 端点发送包含 JSON 载荷的 POST 请求。载荷包含 `text` 字段，因此 Slack 传入 webhook 可以直接渲染：

```yaml
notify:
  url: https://hooks.slack.com/services/T.../B.../xxx
  on: error            # error（默认）| always
```

同样的结构也适用于 PagerDuty、Opsgenie 或你自己的接收器。除 `text` 外，载荷还包含结构化字段（`source`、`status`、`error`、`duration_ms`、文件数量）。

### 同步历史 {#sync-history}

每次运行都会记录在本地 SQLite 数据库中。可以通过 API（`GET /history`）或 CLI 查询：

```bash
oikb history                    # 最近运行记录，表格视图
oikb history --errors           # 仅失败记录
oikb history --json             # 机器可读格式
oikb history --clear --days 7   # 清理 7 天前的条目
```

---

## 让模型触发同步 {#let-the-model-trigger-syncs}

守护进程也是一个 **[OpenAPI 工具服务器](/features/extensibility/mcp)**。将 Open WebUI 指向它后，模型就能在聊天中通过工具调用触发同步、检查状态和读取同步历史：

> **你：**手册知识库看起来过时了。重新同步它，并告诉我有哪些变化。
>
> *（模型调用 `trigger_sync`，轮询 `get_sync_status`，然后回答。）*
>
> **助手：**已重新同步 `handbook`：更新了 4 个文件，移除了 1 个文件。截至刚才，它已是最新状态。

它在 `GET /openapi.json` 提供一份规范，恰好公开三个操作（仪表板、指标、健康和 webhook 路由均被隐藏，因此模型只能看到有用的操作）：

| 工具 | 对应端点 | 作用 |
|---|---|---|
| `trigger_sync` | `POST /sync/{identifier}` | 按别名或知识库 ID 启动同步（可选试运行）。 |
| `get_sync_status` | `GET /health` | 报告每个来源的当前状态和上次结果。 |
| `get_sync_history` | `GET /history` | 返回最近的同步运行记录。 |

连接方法：

1. **先做好安全防护。** 设置 `OIKB_API_KEY`，避免能够访问守护进程的任何人都可以调用 `/sync` 和 `/history`。
2. 将守护进程的 URL（例如 `http://oikb:8080`）添加为工具服务器：实例级连接使用**设置 → 集成**（管理员区域），个人连接使用**设置 → 集成**。将同一个 `OIKB_API_KEY` 填写为连接的 API 密钥。

这是标准的 OpenAPI 工具服务器连接，采用 [OpenAPI / MCP 工具服务器](/features/extensibility/mcp)页面介绍的相同机制，只是另一端恰好是 oikb。

---

## 部署 {#deployment}

### Docker {#docker}

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

### Docker Compose {#docker-compose}

让 oikb 与 Open WebUI 在同一网络中运行，使其能够通过服务名访问服务器：

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

### Kubernetes {#kubernetes}

从 ConfigMap 挂载配置，从 Secret 获取机密，并将探针连接到健康端点：

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

:::caution 运行单个副本
调度器和每个知识库的锁都存在于一个进程中，因此守护进程应以**单副本**运行。横向扩展会让两个调度器同时同步同一个知识库。如需增加来源，请在一个守护进程中添加条目，而不是使用相同配置运行多个副本。
:::

### GitHub Actions {#github-actions}

如果希望由推送触发、在构建时同步，而不是运行长期守护进程，可以将镜像作为一次性步骤运行。请参阅主页面的[在 CI 中执行一次性同步](/ecosystem/knowledge-base-sync#one-shot-sync-in-ci)。

---

## 另请参阅 {#see-also}

- **[知识库同步（oikb）](/ecosystem/knowledge-base-sync)**：安装、来源、连接器、筛选和 CLI。
- **[知识](/features/workspace/knowledge)**：由 oikb 保持同步的知识库功能。
- **[OpenAPI / MCP 工具服务器](/features/extensibility/mcp)**：将外部工具服务器连接到 Open WebUI。

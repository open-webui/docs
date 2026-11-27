---
sidebar_position: 7
title: "OpenTelemetry"
---

Open WebUI 支持通过 OpenTelemetry（OTel）协议（OTLP）导出**分布式追踪和指标**。这样可以与 **Grafana LGTM（Loki、Grafana、Tempo、Mimir）** 等现代可观测性技术栈以及 **Jaeger**、**Tempo** 和 **Prometheus** 集成，实时监控请求、数据库/Redis 查询、响应时间等。

:::warning 额外依赖

如果你从源代码或通过 `pip` 运行 Open WebUI（在官方 Docker 镜像之外），OpenTelemetry 依赖**可能不会默认安装**。你可能需要手动安装它们：

```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp
```

仅安装这三个软件包还不够：设置过程还会导入八个 `opentelemetry-instrumentation-*` 软件包（FastAPI、SQLAlchemy、Redis、requests、httpx、aiohttp-client、logging 和 system-metrics）。请安装 `backend/requirements.txt` 中的 `## Trace` 块，其中固定了所有这些软件包的版本。

:::

## 使用 Docker Compose 快速开始 {#quick-start-with-docker-compose}

要开始可观测性实践，最快的方式是下载示例 Compose 文件，并通过本地 Grafana LGTM 技术栈启动 Open WebUI：

```bash
curl -fsSLO https://docs.openwebui.com/docker-compose.otel.yaml
docker compose -f docker-compose.otel.yaml up -d
```

`docker-compose.otel.yaml` 文件会设置以下组件：

| 服务 | 端口 | 说明 |
| -------------- | ----------------------------------------- | -------------------------------------------------- |
| **lgtm** | 3000（UI）、4317（OTLP/gRPC）、4318（HTTP） | Grafana LGTM（Loki + Grafana + Tempo + Mimir）技术栈 |
| **open-webui** | 8088 → 8080 | 启用 OTEL 导出的 Open WebUI |

启动后：

- 可通过 [http://localhost:8088](http://localhost:8088) 访问 Open WebUI
- 可通过 [http://localhost:3000](http://localhost:3000) 访问 Grafana，用户名和密码为 `admin` / `admin`
- Open WebUI 从 Compose 网络内部将 OTLP 数据发送到 `http://lgtm:4317`

## 环境变量 {#environment-variables}

你可以使用以下环境变量（与 Compose 文件中的用法一致）配置 Open WebUI 中的 OpenTelemetry。在该文件之外，代码默认关闭全部四个 `ENABLE_OTEL*` 开关，端点为 `http://localhost:4317`，并关闭 `OTEL_EXPORTER_OTLP_INSECURE`：

| 变量 | 默认值 | 说明 |
|--------------------------------------|---------------------------------|-----------------------------------------------------|
| `ENABLE_OTEL` | Compose 中为 **true** | 启用 OpenTelemetry 设置的主开关 |
| `ENABLE_OTEL_TRACES` | Compose 中为 **true** | 启用分布式追踪导出 |
| `ENABLE_OTEL_METRICS` | Compose 中为 **true** | 启用 FastAPI HTTP 指标导出 |
| `ENABLE_OTEL_LOGS` | Compose 中为 **true** | 启用 OpenTelemetry 日志导出 |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Compose 中为 `http://lgtm:4317` | 用于追踪的 OTLP 端点 |
| `OTEL_METRICS_EXPORTER_OTLP_ENDPOINT`| Compose 中为 `http://lgtm:4317` | 用于指标的 OTLP 端点 |
| `OTEL_LOGS_EXPORTER_OTLP_ENDPOINT` | Compose 中为 `http://lgtm:4317` | 用于日志的 OTLP 端点 |
| `OTEL_EXPORTER_OTLP_INSECURE` | Compose 中为 **true** | OTLP 使用不安全（无 TLS）连接 |
| `OTEL_SERVICE_NAME` | `open-webui` | 服务名称（在追踪和指标中标记） |
| `OTEL_OTLP_SPAN_EXPORTER` | `grpc` | 导出器协议：`grpc`（端口 4317）或 `http`（端口 4318，端点中包含信号路径，例如 `/v1/traces`，因为端点会原样传递给导出器）；`OTEL_METRICS_OTLP_SPAN_EXPORTER` 和 `OTEL_LOGS_OTLP_SPAN_EXPORTER` 可按信号覆盖它 |
| `OTEL_METRICS_EXPORT_INTERVAL_MILLIS`| `10000` | 指标导出间隔，单位为毫秒（10 秒 = 约 6 DPM；设置为 `60000` 则约为 1 DPM） |
| `OTEL_BASIC_AUTH_USERNAME` / `OTEL_BASIC_AUTH_PASSWORD` | *（空）* | Collector 需要时使用的 Basic Auth 凭据 |

:::tip

根据需要，在 `.env` 文件或 Compose 文件中覆盖默认值。

:::

```yaml
  open-webui:
    environment:
      - ENABLE_OTEL=true
      - ENABLE_OTEL_TRACES=true
      - ENABLE_OTEL_METRICS=true
      - ENABLE_OTEL_LOGS=true
      - OTEL_EXPORTER_OTLP_INSECURE=true # 为 OTLP 使用不安全连接，生产环境中可能需要移除
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://lgtm:4317
      - OTEL_METRICS_EXPORTER_OTLP_ENDPOINT=http://lgtm:4317
      - OTEL_LOGS_EXPORTER_OTLP_ENDPOINT=http://lgtm:4317
      - OTEL_SERVICE_NAME=open-webui
      # 如有需要，可在此处设置 OTEL_BASIC_AUTH_USERNAME/PASSWORD
```

## 数据收集 {#data-collection}

### 分布式追踪 {#distributed-tracing}

Open WebUI 后端会自动为以下组件插桩：

- **FastAPI**（路由）
- **SQLAlchemy**（仅限同步引擎：`/ready` 和 `/health/db` ping、用户数量仪表，以及共享主数据库时的 pgvector 或 openGauss；请求时的查询在异步引擎上运行）
- **Redis**
- **requests**、**httpx**、**aiohttp**（外部调用）
- **logging**（日志记录上的追踪和 span ID）以及主机**系统指标**

日志导出需要同时启用 `ENABLE_OTEL` 和 `ENABLE_OTEL_LOGS`。

每个追踪 span 都包含丰富的数据，例如：

- `db.instance`、`db.statement`、`redis.args`
- `http.url`、`http.method`、`http.status_code`
- 异常的错误详情（`error.message`、`error.kind`）

### 指标收集 {#metrics-collection}

WebUI 通过 OpenTelemetry 导出以下指标：

| 指标仪器 | 类型 | 单位 | 标签 |
|------------------------|-----------|------|--------------------------------------|
| `http.server.requests` | Counter | 1 | `http.method`、`http.route`、`http.status_code` |
| `http.server.duration` | Histogram | ms | （同上） |
| `webui.users.total` | Gauge | 用户 | （无） |
| `webui.users.active` | Gauge | 用户 | （无） |
| `webui.users.active.today` | Gauge | 用户 | （无） |

每次导出时，都会从数据库读取三个用户仪表：

- `webui.users.total`：注册用户。
- `webui.users.active`：过去 3 分钟内活跃的用户。
- `webui.users.active.today`：从当天午夜 **UTC** 开始活跃的用户，而不是从本地午夜开始。

指标通过 OTLP 发送（默认每 10 秒一次，可通过 `OTEL_METRICS_EXPORT_INTERVAL_MILLIS` 配置），并可在 **Grafana** 中（通过 Prometheus/Mimir）可视化。

若要让健康检查等路由同时不出现在追踪和 HTTP 指标中，请将 `OTEL_PYTHON_FASTAPI_EXCLUDED_URLS`（或 `OTEL_PYTHON_EXCLUDED_URLS`）设置为以逗号分隔的正则表达式。每个表达式都会匹配请求 URL 中的任意位置，因此 `/health,/_app/immutable/.*` 也会覆盖 `/health/db`。

## 自定义 Collector 设置 {#custom-collector-setup}

要使用不同的（外部）OpenTelemetry Collector/技术栈：

```bash
docker run -d --name open-webui \
  -p 8088:8080 \
  -e ENABLE_OTEL=true \
  -e ENABLE_OTEL_TRACES=true \
  -e ENABLE_OTEL_METRICS=true \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317 \
  -e OTEL_EXPORTER_OTLP_INSECURE=true \
  -e OTEL_METRICS_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317 \
  -e OTEL_LOGS_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317 \
  -e OTEL_SERVICE_NAME=open-webui \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

## 故障排除 {#troubleshooting}

**Grafana 中未显示追踪/指标？**

- 再次检查 `ENABLE_OTEL`、`ENABLE_OTEL_TRACES` 和 `ENABLE_OTEL_METRICS` 是否都设置为 `true`
- 端点是否正确？在示例 Compose 文件中，Open WebUI 容器必须能够通过 `http://lgtm:4317` 访问它。
- 检查 Open WebUI 的日志（`docker logs open-webui-otel`）中是否有 OTLP 错误
- 检查 Open WebUI 容器能否访问 Collector。对端口 `4317` 发送普通 HTTP `curl` 请求，无法验证 Collector 是否接受基于 gRPC 的 OTLP。

### OTLP 报告 UNAVAILABLE {#otlp-reports-unavailable}

如果端口可以访问，但导出器仍记录 `UNAVAILABLE`，请检查导出器协议是否与 Collector 上的监听器匹配。默认端口为 gRPC 使用 `4317`，HTTP 使用 `4318`。使用 HTTP 时，请检查失败信号的路径，例如 `/v1/traces`、`/v1/metrics` 或 `/v1/logs`。[OTLP 协议规范](https://opentelemetry.io/docs/specs/otlp/)

检查追踪的 `OTEL_OTLP_SPAN_EXPORTER`。指标和日志可以分别使用 `OTEL_METRICS_OTLP_SPAN_EXPORTER` 和 `OTEL_LOGS_OTLP_SPAN_EXPORTER` 覆盖该选择。

**需要身份验证？**

- 为受身份验证保护的 Collector 设置 `OTEL_BASIC_AUTH_USERNAME` 和 `OTEL_BASIC_AUTH_PASSWORD`
- 对于需要其他标头（例如 API 密钥）的后端，请将标准 OpenTelemetry 变量 `OTEL_EXPORTER_OTLP_HEADERS` 设置为以逗号分隔的 `key=value` 对（例如 `x-api-key=your-key,x-team-id=your-team`）。设置 Basic Auth 变量时，此变量会被忽略。
- 如果使用 SSL/TLS，请酌情调整或移除 `OTEL_EXPORTER_OTLP_INSECURE`

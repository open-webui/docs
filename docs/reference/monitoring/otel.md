---
sidebar_position: 7
title: "OpenTelemetry"
---

Open WebUI supports **distributed tracing and metrics** export via the OpenTelemetry (OTel) protocol (OTLP). This enables integration with modern observability stacks such as **Grafana LGTM (Loki, Grafana, Tempo, Mimir)**, as well as **Jaeger**, **Tempo**, and **Prometheus** to monitor requests, database/Redis queries, response times, and more in real-time.

:::warning Additional Dependencies

If you are running Open WebUI from source or via `pip` (outside of the official Docker images), OpenTelemetry dependencies **may not be installed by default**. You may need to install them manually:

```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp
```

:::

## 🚀 Quick Start with Docker Compose

The fastest way to get started with observability is to download the example Compose file and start Open WebUI with a local Grafana LGTM stack:

```bash
curl -fsSLO https://docs.openwebui.com/docker-compose.otel.yaml
docker compose -f docker-compose.otel.yaml up -d
```

The `docker-compose.otel.yaml` file sets up these components:

| Service        | Port(s)                                   | Description                                        |
| -------------- | ----------------------------------------- | -------------------------------------------------- |
| **lgtm**       | 3000 (UI), 4317 (OTLP/gRPC), 4318 (HTTP) | Grafana LGTM (Loki + Grafana + Tempo + Mimir) stack |
| **open-webui** | 8088 → 8080                               | Open WebUI with OTEL export enabled                |

After startup:

- Open WebUI is available at [http://localhost:8088](http://localhost:8088)
- Grafana is available at [http://localhost:3000](http://localhost:3000) with `admin` / `admin`
- Open WebUI sends OTLP data to `http://lgtm:4317` from inside the Compose network

## ⚙️ Environment Variables

You can configure OpenTelemetry in Open WebUI with these environment variables (as used in the Compose file):

| Variable                            | Default                         | Description                                         |
|--------------------------------------|---------------------------------|-----------------------------------------------------|
| `ENABLE_OTEL`                       | **true** in Compose             | Master switch to enable OpenTelemetry setup         |
| `ENABLE_OTEL_TRACES`                | **true** in Compose             | Enable distributed tracing export                   |
| `ENABLE_OTEL_METRICS`                | **true** in Compose             | Enable FastAPI HTTP metrics export                  |
| `ENABLE_OTEL_LOGS`                   | **true** in Compose             | Enable OpenTelemetry log export                     |
| `OTEL_EXPORTER_OTLP_ENDPOINT`        | `http://lgtm:4317` in Compose   | OTLP endpoint used for traces                       |
| `OTEL_METRICS_EXPORTER_OTLP_ENDPOINT`| `http://lgtm:4317` in Compose   | OTLP endpoint used for metrics                      |
| `OTEL_LOGS_EXPORTER_OTLP_ENDPOINT`   | `http://lgtm:4317` in Compose   | OTLP endpoint used for logs                         |
| `OTEL_EXPORTER_OTLP_INSECURE`        | **true** in Compose             | Insecure (no TLS) connection for OTLP               |
| `OTEL_SERVICE_NAME`                  | `open-webui`                    | Service name (tagged in traces and metrics)         |
| `OTEL_METRICS_EXPORT_INTERVAL_MILLIS`| `10000`                         | Metrics export interval in ms (10s = ~6 DPM; set `60000` for ~1 DPM) |
| `OTEL_BASIC_AUTH_USERNAME` / `OTEL_BASIC_AUTH_PASSWORD` | *(empty)*      | Basic Auth credentials if Collector requires them   |

:::tip

Override defaults in your `.env` file or Compose file as needed.

:::

```yaml
  open-webui:
    environment:
      - ENABLE_OTEL=true
      - ENABLE_OTEL_TRACES=true
      - ENABLE_OTEL_METRICS=true
      - ENABLE_OTEL_LOGS=true
      - OTEL_EXPORTER_OTLP_INSECURE=true # Use insecure connection for OTLP, you may want to remove this in production
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://lgtm:4317
      - OTEL_METRICS_EXPORTER_OTLP_ENDPOINT=http://lgtm:4317
      - OTEL_LOGS_EXPORTER_OTLP_ENDPOINT=http://lgtm:4317
      - OTEL_SERVICE_NAME=open-webui
      # You may set OTEL_BASIC_AUTH_USERNAME/PASSWORD here if needed
```

## 📊 Data Collection

### Distributed Tracing

The Open WebUI backend automatically instruments:

- **FastAPI** (routes)
- **SQLAlchemy** (database queries)
- **Redis**
- **requests**, **httpx**, **aiohttp** (external calls)

Each trace span includes rich data such as:

- `db.instance`, `db.statement`, `redis.args`
- `http.url`, `http.method`, `http.status_code`
- Error details (`error.message`, `error.kind`) on exceptions

### Metrics Collection

WebUI exports the following metrics via OpenTelemetry:

| Instrument             | Type      | Unit | Labels                               |
|------------------------|-----------|------|--------------------------------------|
| `http.server.requests` | Counter   | 1    | `http.method`, `http.route`, `http.status_code` |
| `http.server.duration` | Histogram | ms   | (same as above)                      |

Metrics are sent via OTLP (default every 10 seconds, configurable via `OTEL_METRICS_EXPORT_INTERVAL_MILLIS`) and can be visualized in **Grafana** (via Prometheus/Mimir).

## 🔧 Custom Collector Setup

To use a different (external) OpenTelemetry Collector/Stack:

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

## 🚨 Troubleshooting

**Traces/metrics not appearing in Grafana?**

- Double-check `ENABLE_OTEL`, `ENABLE_OTEL_TRACES`, and `ENABLE_OTEL_METRICS` are all set to `true`
- Is the endpoint correct? In the example Compose file it must be reachable as `http://lgtm:4317` from the Open WebUI container.
- Inspect logs from Open WebUI (`docker logs open-webui-otel`) for OTLP errors
- Collector's OTLP port (`4317`) should be open and reachable. Try:
  `curl http://localhost:4317` (replace host as needed)

**Authentication required?**

- Set `OTEL_BASIC_AUTH_USERNAME` and `OTEL_BASIC_AUTH_PASSWORD` for auth-protected collectors
- If using SSL/TLS, adjust or remove `OTEL_EXPORTER_OTLP_INSECURE` as appropriate

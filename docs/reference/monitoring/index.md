---
sidebar_position: 6
title: "Monitoring"
---

# 📊 Monitoring

**Know when something breaks before your users do.**

Open WebUI exposes health and model endpoints that make it straightforward to wire up uptime monitoring, model connectivity checks, and end-to-end response testing. Whether you're running a single instance or a multi-node deployment, these checks give you confidence that the service is up, models are reachable, and inference is actually working.

---

## Why Monitor?

### Catch outages instantly

A health check that runs every 60 seconds means you know about downtime within a minute, not when a user files a complaint.

### Verify model connectivity

Open WebUI can be running fine while your model provider is down. Monitoring the `/api/models` endpoint catches that gap.

### End-to-end confidence

The deepest check sends a real prompt and validates the response. If that passes, you know the entire pipeline works: API, backend, model provider, and inference.

---

## Key Features

| | |
| :--- | :--- |
| ✅ **Health endpoint** | Unauthenticated `/health` check, returns `200` when the service is up |
| 🔗 **Model connectivity** | Authenticated `/api/models` check verifies provider connections |
| 🤖 **Deep health check** | Send a real chat completion and validate the response |
| 🐻 **Uptime Kuma recipes** | Ready-to-use configurations for each monitoring level |

---

## Level 1: Basic Health Check

The `/health` endpoint is publicly accessible (no authentication required) and returns `200 OK` when the service is running.

```bash
curl http://your-open-webui-instance:8080/health
```

This verifies web server availability, application initialization, and basic database connectivity.

### Uptime Kuma Setup

1. **Add New Monitor** with type **HTTP(s)**
2. **URL:** `http://your-open-webui-instance:8080/health`
3. **Interval:** `60 seconds`
4. **Retries:** `3`

---

## Level 2: Model Connectivity Check

The `/api/models` endpoint **requires authentication** and confirms that Open WebUI can reach your model providers and list available models.

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://your-open-webui-instance:8080/api/models
```

You'll need an API key. See [API Keys](/features/authentication-access/api-keys) for setup instructions.

:::tip Dedicated Monitoring Account
Create a **non-admin user** (e.g., `monitoring-bot`), generate an API key from that account, and use it for all monitoring requests. This limits blast radius if the key is ever compromised.
:::

### Uptime Kuma Setup

1. **Monitor Type:** HTTP(s) - JSON Query
2. **URL:** `http://your-open-webui-instance:8080/api/models`
3. **Method:** GET
4. **Header:** `Authorization: Bearer YOUR_API_KEY`
5. **JSON Query:** `$count(data[*])>0`
6. **Expected Value:** `true`
7. **Interval:** `300 seconds` (5 minutes)

### Advanced JSONata Queries

| Goal | Query |
| :--- | :--- |
| At least one Ollama model | `$count(data[owned_by='ollama'])>0` |
| Specific model exists | `$exists(data[id='gpt-4o'])` |
| Multiple models exist | `$count(data[id in ['gpt-4o', 'gpt-4o-mini']]) = 2` |

Test queries at [jsonata.org](https://try.jsonata.org/) with a sample API response.

---

## Level 3: Deep Health Check

Send a real chat completion to verify the entire inference pipeline end-to-end.

```bash
curl -X POST http://your-open-webui-instance:8080/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Respond with the word HEALTHY"}],
    "model": "llama3.1",
    "temperature": 0
  }'
```

A successful response returns `200 OK` with a chat completion containing "HEALTHY". This catches model loading failures, backend processing errors, and provider-side issues that Levels 1 and 2 would miss.

:::info
Setting up Level 3 in Uptime Kuma requires an HTTP(s) monitor with a POST body, authentication headers, and a JSON query to validate the response. See [Uptime Kuma docs](https://github.com/louislam/uptime-kuma) for POST monitor configuration.
:::

---

## Next Steps

- **[OpenTelemetry](/reference/monitoring/otel)** - Distributed tracing, metrics, and logs with Grafana, Prometheus, Jaeger, and more
- **[API Keys](/features/authentication-access/api-keys)** - Full guide on enabling and generating API keys for programmatic access

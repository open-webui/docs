---
sidebar_position: 21
title: "Opik"
---

## Comet Opik Integration with Open WebUI

[Comet Opik](https://www.comet.com/docs/opik/) is an open-source LLM observability and evaluation platform. You can connect Open WebUI telemetry to Opik using OpenTelemetry-compatible pipelines.

## How to integrate Opik with Open WebUI

[Pipelines](https://github.com/open-webui/pipelines/) in Open WebUI are an UI-agnostic framework for OpenAI API plugins. They can intercept and forward requests while exporting telemetry.

To use Opik, configure your telemetry pipeline to export traces to your Opik OTLP endpoint and headers from your project settings.

## Quick Start Guide

### Step 1: Setup Open WebUI

Make sure Open WebUI is running. See the [Open WebUI documentation](https://docs.openwebui.com/).

### Step 2: Set Up Pipelines

Start Pipelines:

```bash
docker run -p 9099:9099 --add-host=host.docker.internal:host-gateway -v pipelines:/app/pipelines --name pipelines --restart always ghcr.io/open-webui/pipelines:main
```

### Step 3: Configure OpenTelemetry export for Opik

In your telemetry pipeline configuration, set:

- `OTEL_EXPORTER_OTLP_ENDPOINT=<opik_otlp_endpoint>`
- `OTEL_EXPORTER_OTLP_HEADERS=<opik_otlp_headers>`

Use the values from your Opik project settings.

### Step 4: Verify traces in Opik

Run Open WebUI traffic through your pipeline and confirm traces appear in your Opik project.

## Learn more

- [Comet Opik docs](https://www.comet.com/docs/opik/)
- [Open WebUI Pipelines](https://github.com/open-webui/pipelines/)

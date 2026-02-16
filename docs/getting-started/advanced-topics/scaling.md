---
sidebar_position: 2
title: "Scaling Open WebUI"
---

# Scaling Open WebUI

Open WebUI is designed to scale with your needs — from a single user to organization-wide rollouts across entire enterprises and institutions. The steps below walk you through how to configure your deployment as your needs grow.

Open WebUI follows a **stateless, container-first architecture**, which means scaling it looks a lot like scaling any modern web application. Whether you're moving from a hobby setup to supporting a department, or growing from hundreds to thousands of users, the same set of building blocks apply.

This guide walks you through the key concepts and configurations at a high level. For exact environment variable details, see the [Environment Variable Reference](/reference/env-configuration).

---

## Understanding the Defaults

Out of the box, Open WebUI runs as a **single container** with:

- An **embedded SQLite database** stored on a local volume
- A **single Uvicorn worker** process
- **No external dependencies** (no Redis, no external DB)

This is perfect for personal use, small teams, or evaluation. The scaling journey begins when you outgrow any of these defaults.

---

## Step 1 — Switch to PostgreSQL

**When:** You plan to run more than one Open WebUI instance, or you want better performance and reliability for your database.

SQLite stores everything in a single file and doesn't handle concurrent writes from multiple processes well. PostgreSQL is a production-grade database that supports many simultaneous connections.

**What to do:**

Set the `DATABASE_URL` environment variable to point to your PostgreSQL server:

```
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
```

**Key things to know:**

- Open WebUI does **not** migrate data between databases — plan this before you have production data in SQLite.
- For high-concurrency deployments, tune `DATABASE_POOL_SIZE` and `DATABASE_POOL_MAX_OVERFLOW` to match your usage patterns.
- Remember that **each Open WebUI instance maintains its own connection pool**, so total connections = pool size × number of instances.

:::tip
A good starting point for tuning is `DATABASE_POOL_SIZE=15` and `DATABASE_POOL_MAX_OVERFLOW=20`. Keep the combined total per instance well below your PostgreSQL `max_connections` limit (default is 100).
:::

---

## Step 2 — Add Redis

**When:** You want to run multiple Open WebUI instances (horizontal scaling) or multiple Uvicorn workers.

Redis acts as a **shared state store** so that all your Open WebUI instances can coordinate sessions, websocket connections, and application state. Without it, users would see inconsistent behavior depending on which instance handles their request.

**What to do:**

Set these environment variables:

```
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis
ENABLE_WEBSOCKET_SUPPORT=true
```

**Key things to know:**

- Redis is **not needed** for single-instance deployments.
- If you're using Redis Sentinel for high availability, also set `REDIS_SENTINEL_HOSTS` and consider setting `REDIS_SOCKET_CONNECT_TIMEOUT=5` to prevent hangs during failover.
- For AWS Elasticache or other managed Redis Cluster services, set `REDIS_CLUSTER=true`.
- Make sure your Redis server has `timeout 1800` and a high enough `maxclients` (10000+) to prevent connection exhaustion over time.

---

## Step 3 — Run Multiple Instances

**When:** You need to handle more users or want high availability (no downtime during deploys or if a container crashes).

Open WebUI is stateless, so you can run as many instances as needed behind a **load balancer**. Each instance is identical and interchangeable.

### Option A: Container Orchestration (Recommended)

Use Kubernetes, Docker Swarm, or similar platforms to manage multiple replicas:

- Keep `UVICORN_WORKERS=1` per container (let the orchestrator handle scaling, not the app)
- Set `ENABLE_DB_MIGRATIONS=false` on all replicas except one designated "primary" pod to prevent migration race conditions
- Scale up/down by adjusting your replica count

### Option B: Multiple Workers per Container

For simpler setups (e.g., a single powerful server), increase `UVICORN_WORKERS`:

```
UVICORN_WORKERS=4
```

This spawns multiple application processes inside a single container. You still need PostgreSQL and Redis when using this approach.

:::info
Container orchestration is generally preferred because it provides automatic restarts, rolling updates, and more granular resource control. Multiple workers inside a single container is a simpler alternative when orchestration isn't available.
:::

---

## Step 4 — Use Cloud Storage

**When:** You're running multiple instances that need to share uploaded files, or you want durable, managed file storage.

By default, Open WebUI stores uploaded files on local disk. In a multi-instance setup, each instance would only see its own files. Cloud storage makes file uploads available to all instances.

**Supported providers:**

| Provider | Set `STORAGE_PROVIDER` to |
|---|---|
| Amazon S3 (or S3-compatible like MinIO, R2) | `s3` |
| Google Cloud Storage | `gcs` |
| Microsoft Azure Blob Storage | `azure` |

Each provider has its own set of environment variables for credentials and bucket configuration. See the [Environment Variable Reference](/reference/env-configuration) for details.

---

## Step 5 — Add Observability

**When:** You want to monitor performance, troubleshoot issues, and understand how your deployment is behaving at scale.

Open WebUI supports **OpenTelemetry** for exporting traces, metrics, and logs to your observability platform (Grafana, Datadog, New Relic, etc.):

```
ENABLE_OTEL=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
```

This gives you visibility into request latency, database query performance, error rates, and more.

---

## Putting It All Together

Here's what a production-ready scaled deployment typically looks like:

```
┌─────────────────────────────────────────────────────┐
│                   Load Balancer                     │
│              (Nginx, HAProxy, Cloud LB)             │
└──────────┬──────────┬──────────┬────────────────────┘
           │          │          │
     ┌─────▼──┐ ┌─────▼──┐ ┌────▼───┐
     │ WebUI  │ │ WebUI  │ │ WebUI  │   ← Stateless containers
     │ Pod 1  │ │ Pod 2  │ │ Pod N  │
     └───┬────┘ └───┬────┘ └───┬────┘
         │          │          │
    ┌────▼──────────▼──────────▼────┐
    │         PostgreSQL            │   ← Shared database
    └───────────────────────────────┘
    ┌───────────────────────────────┐
    │           Redis               │   ← Shared state & websockets
    └───────────────────────────────┘
    ┌───────────────────────────────┐
    │    Cloud Storage (S3/GCS)     │   ← Shared file storage
    └───────────────────────────────┘
```

### Minimum Environment Variables for Scaled Deployments

```bash
# Database
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui

# Redis
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis
ENABLE_WEBSOCKET_SUPPORT=true

# Storage (example for S3)
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=my-openwebui-bucket
S3_REGION_NAME=us-east-1

# Workers (let orchestrator scale, keep workers at 1)
UVICORN_WORKERS=1

# Migrations (set to false on all but one instance)
ENABLE_DB_MIGRATIONS=false
```

---

## Quick Reference: When Do I Need What?

| Scenario | PostgreSQL | Redis | Cloud Storage |
|---|:---:|:---:|:---:|
| Single user / evaluation | ✗ | ✗ | ✗ |
| Small team (< 50 users, single instance) | Recommended | ✗ | ✗ |
| Multiple instances / HA | **Required** | **Required** | **Required** |
| Multiple Uvicorn workers | **Required** | **Required** | ✗ |
| Large scale (1000+ users) | **Required** | **Required** | **Required** |

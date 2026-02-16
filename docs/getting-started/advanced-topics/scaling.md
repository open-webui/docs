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
- An **embedded ChromaDB vector database** (also backed by SQLite) for RAG embeddings
- A **single Uvicorn worker** process
- **No external dependencies** (no Redis, no external DB)

This is perfect for personal use, small teams, or evaluation. The scaling journey begins when you outgrow any of these defaults — and crucially, **both SQLite databases** (main and vector) must be replaced before you can safely run multiple processes.

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

## Step 4 — Switch to an External Vector Database

**When:** You run more than one Uvicorn worker (`UVICORN_WORKERS > 1`) or more than one replica. **This is not optional.**

:::danger Default ChromaDB Will Crash in Multi-Process Setups

The default vector database (ChromaDB) uses a local `PersistentClient` backed by **SQLite**. SQLite connections are **not fork-safe** — when uvicorn forks multiple workers, each process inherits the same database connection. Concurrent writes (e.g., during document uploads) cause **instant worker death**:

```
save_docs_to_vector_db:1619 - adding to collection file-id
INFO:     Waiting for child process [pid]
INFO:     Child process [pid] died
```

This is a [well-known SQLite limitation](https://www.sqlite.org/howtocorrupt.html#_carrying_an_open_database_connection_across_a_fork_), not a bug. It also affects multi-replica deployments where multiple containers access the same ChromaDB data directory.

:::

**What to do:**

Set the `VECTOR_DB` environment variable to a client-server vector database:

```
VECTOR_DB=pgvector
```

**Recommended alternatives:**

| Vector DB | Best For | Configuration |
|---|---|---|
| **PGVector** | Teams already using PostgreSQL — reuses your existing database infrastructure | `VECTOR_DB=pgvector` + `PGVECTOR_DB_URL=postgresql://...` |
| **Milvus** | Large-scale self-hosted deployments with high query throughput; supports multitenancy for per-user isolation | `VECTOR_DB=milvus` + `MILVUS_URI=http://milvus-host:19530` |
| **Qdrant** | Self-hosted deployments needing efficient filtering and metadata search; supports multitenancy | `VECTOR_DB=qdrant` + `QDRANT_URI=http://qdrant-host:6333` |
| **Pinecone** | Fully managed cloud service — zero infrastructure to maintain, pay-per-use | `VECTOR_DB=pinecone` + `PINECONE_API_KEY=...` |
| **ChromaDB (HTTP mode)** | Keeping ChromaDB but making it multi-process safe by running it as a separate server | `VECTOR_DB=chroma` + `CHROMA_HTTP_HOST=chroma-host` + `CHROMA_HTTP_PORT=8000` |

:::tip
**PGVector** is the simplest choice if you're already running PostgreSQL for the main database — it adds vector search to the database you already have, with no additional infrastructure.

For maximum scalability in self-hosted environments, **Milvus** and **Qdrant** both support **multitenancy mode** (`ENABLE_MILVUS_MULTITENANCY_MODE=True` / `ENABLE_QDRANT_MULTITENANCY_MODE=True`), which provides per-user vector isolation and better resource sharing at scale.
:::

---

## Step 5 — Share File Storage Across Instances

**When:** You're running multiple instances that need to share uploaded files, generated images, and other user data.

By default, Open WebUI stores uploaded files on the local filesystem under `DATA_DIR` (typically `/app/backend/data`). In a multi-instance setup, each instance needs access to the same files.

### Do I need cloud storage (S3)?

**Not necessarily.** Open WebUI stores all uploaded files with **UUID-based unique filenames**. Multiple processes and replicas only ever **create new files** or **read existing ones** — they never write to the same file simultaneously. This means a simple **shared filesystem mount** works correctly without any risk of write conflicts.

**Your options:**

| Approach | When to Use |
|---|---|
| **Shared filesystem** (NFS, AWS EFS, CephFS, GlusterFS, or a shared Docker volume) | The simplest option for most deployments. Mount the same directory to `/app/backend/data` on all instances. Works well for on-prem, Docker Swarm, and Kubernetes with ReadWriteMany (RWX) volumes. |
| **Cloud object storage** (S3, GCS, Azure Blob) | Better for cloud-native deployments at very large scale, or when you want managed durability (11 nines) and don't want to manage shared filesystems. Requires setting `STORAGE_PROVIDER`. |

:::info What does STORAGE_PROVIDER actually control?
`STORAGE_PROVIDER` only controls where **uploaded files** are stored (documents, images, etc.). It does **not** affect the main database (use `DATABASE_URL` for that) or the vector database (use `VECTOR_DB` for that). When left unset, files are stored on the local filesystem under `DATA_DIR`.
:::

### Option A: Shared Filesystem (Simplest)

No configuration changes needed — just ensure all instances mount the same directory:

**Kubernetes:**
```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: openwebui-data  # Must be ReadWriteMany (RWX)
```

**Docker Swarm/Compose:**
```yaml
volumes:
  - /mnt/shared-nfs/openwebui-data:/app/backend/data
```

:::warning
Do **not** store the SQLite database on a network filesystem. SQLite's file locking does not work reliably over NFS. This is another reason to switch to PostgreSQL (Step 1) before scaling to multiple instances.
:::

### Option B: Cloud Object Storage

Set `STORAGE_PROVIDER` and the corresponding credentials:

**Supported providers:**

| Provider | Set `STORAGE_PROVIDER` to |
|---|---|
| Amazon S3 (or S3-compatible like MinIO, R2) | `s3` |
| Google Cloud Storage | `gcs` |
| Microsoft Azure Blob Storage | `azure` |

```
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=my-openwebui-bucket
S3_REGION_NAME=us-east-1
```

Each provider has its own set of environment variables for credentials and bucket configuration. See the [Environment Variable Reference](/reference/env-configuration#cloud-storage) for details.

---

## Step 6 — Add Observability

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
    │     (+ PGVector for RAG)      │   ← Vector DB (or Milvus/Qdrant)
    └───────────────────────────────┘
    ┌───────────────────────────────┐
    │           Redis               │   ← Shared state & websockets
    └───────────────────────────────┘
    ┌───────────────────────────────┐
    │  Shared Storage (NFS or S3)   │   ← Shared file storage
    └───────────────────────────────┘
```

### Minimum Environment Variables for Scaled Deployments

```bash
# Database
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui

# Vector Database (do NOT use default ChromaDB with multiple workers/replicas)
VECTOR_DB=pgvector
PGVECTOR_DB_URL=postgresql://user:password@db-host:5432/openwebui

# Redis
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis
ENABLE_WEBSOCKET_SUPPORT=true

# Storage — pick ONE:
# Option A: shared filesystem (no env vars needed, just mount the same volume)
# Option B: cloud storage
# STORAGE_PROVIDER=s3
# S3_BUCKET_NAME=my-openwebui-bucket
# S3_REGION_NAME=us-east-1

# Workers (let orchestrator scale, keep workers at 1)
UVICORN_WORKERS=1

# Migrations (set to false on all but one instance)
ENABLE_DB_MIGRATIONS=false
```

---

## Quick Reference: When Do I Need What?

| Scenario | PostgreSQL | Redis | External Vector DB | Shared Storage |
|---|:---:|:---:|:---:|:---:|
| Single user / evaluation | ✗ | ✗ | ✗ | ✗ |
| Small team (< 50 users, single instance) | Recommended | ✗ | ✗ | ✗ |
| Multiple Uvicorn workers | **Required** | **Required** | **Required** | ✗ (same filesystem) |
| Multiple instances / HA | **Required** | **Required** | **Required** | **Required** (NFS or S3) |
| Large scale (1000+ users) | **Required** | **Required** | **Required** | **Required** (NFS or S3) |

:::note About "External Vector DB"
The default ChromaDB uses a local SQLite backend that crashes under multi-process access. "External Vector DB" means either a client-server database (PGVector, Milvus, Qdrant, Pinecone) or ChromaDB running as a separate HTTP server. See [Step 4](#step-4--switch-to-an-external-vector-database) for details.
:::

:::note About "Shared Storage"
For multiple instances, all replicas need access to the same uploaded files. A **shared filesystem mount** (NFS, EFS, CephFS) is sufficient — cloud object storage (S3/GCS/Azure) is an alternative, not a requirement. Files use UUID-based unique names, so there are no write conflicts. See [Step 5](#step-5--share-file-storage-across-instances) for details.
:::

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

**When:** You plan to run more than one Open WebUI instance, or you want better performance and reliability for your database. **You should also switch if your SQLite file lives on anything other than a locally-attached SSD/NVMe** — see the callout below.

:::tip You don't need this step if you're a single-replica deployment on local disk
**Staying on SQLite is fine for:** single-replica deployments, personal use, evaluation, home lab setups, and small teams — **as long as the database file lives on a locally-attached SSD/NVMe and you're not running multiple replicas or workers.** The 0.8 → 0.9 async-backend story only bites when `webui.db` is on network storage; on local disk, SQLite is fast, supported, and a perfectly reasonable default. No migration needed. Skip this step and move on to whichever later step you actually need.
:::

SQLite stores everything in a single file and doesn't handle concurrent writes from multiple processes well. PostgreSQL is a production-grade database that supports many simultaneous connections.

**What to do:**

Set the `DATABASE_URL` environment variable to point to your PostgreSQL server:

```
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
```

**Key things to know:**

- Open WebUI does **not** migrate data between databases — plan this before you have production data in SQLite.
- For high-concurrency deployments, tune `DATABASE_POOL_SIZE` and `DATABASE_POOL_MAX_OVERFLOW` to match your usage patterns. See [Database Optimization](/troubleshooting/performance#-database-optimization) for detailed guidance.
- Remember that **each Open WebUI instance maintains its own connection pool**, so total connections = pool size × number of instances.
- If you skip this step and run multiple instances with SQLite, you will see `database is locked` errors and data corruption. See [Database Corruption / "Locked" Errors](/troubleshooting/multi-replica#4-database-corruption--locked-errors) for details.

:::tip
A good starting point for tuning is `DATABASE_POOL_SIZE=15` and `DATABASE_POOL_MAX_OVERFLOW=20`. Keep the combined total per instance well below your PostgreSQL `max_connections` limit (default is 100).
:::

For credential handling and the SQLCipher-encrypted SQLite option, see the [Database section of the Hardening guide](/getting-started/advanced-topics/hardening#database).

### Why SQLite on network storage fails the moment you scale (or upgrade)

Since 0.9.0 the backend data layer is **fully async** (async SQLAlchemy + `aiosqlite`). That change made Open WebUI dramatically more concurrent — and, as a side effect, made every pre-existing "SQLite is slow on NFS/CephFS/Azure Files" problem go from *tolerable* to *fatal* overnight. Many operators hit this right after upgrading from 0.8.x without changing anything else in their deployment.

The mechanism in one paragraph: SQLite's durability guarantee is `fsync()` on every commit. On local SSD that's ~100 μs. On NFS / CephFS / Azure Files / Kubernetes PVCs backed by network storage that's 50–500 ms, sometimes seconds. In the old sync backend, FastAPI's ~40-thread worker pool acted as a natural throttle, so slow storage meant "slow app." In the async backend there's no thread-pool ceiling — the asyncio loop schedules thousands of DB coroutines in parallel, every slow `fsync` keeps a connection checked out for the full duration, and the SQLAlchemy async pool (default `pool_size=5` + `max_overflow=10` = 15 connections) saturates almost instantly. You then see:

```
sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached,
connection timed out, timeout 30.00
```

Making the pool bigger just moves the breaking point. More connections means more concurrent slow `fsync`s hitting the same slow storage; the filesystem is still the bottleneck.

On top of that, SQLite's WAL mode relies on a memory-mapped `-shm` file for cross-process coordination, and `mmap` over NFS is [officially unreliable per SQLite upstream](https://www.sqlite.org/faq.html#q5) — with high async concurrency it can produce actual locking pathologies (deadlocks, `PRAGMA journal_mode=WAL` that starts but never completes, multi-minute stalls on trivial queries).

**There is no setting that fixes this while SQLite stays on network storage.** The three options are:

1. **Best — switch to PostgreSQL (this step).** The DB server manages its own I/O against its own local storage. Your app reaches it over a network socket, but that hop is orders of magnitude cheaper than NFS `fsync`, and Postgres was designed from day one for concurrent writers. This is the only supported configuration for multi-replica, multi-user, or Kubernetes/Swarm deployments.
2. **Move `webui.db` off network storage onto a local SSD/NVMe.** Only appropriate for single-node, low-user deployments. Your RAG files and uploads on NFS are fine — SQLite specifically is the problem, not the shared filesystem in general.
3. **Temporary workaround if you cannot do either yet:**
   ```bash
   DATABASE_POOL_SIZE=1
   DATABASE_SQLITE_PRAGMA_BUSY_TIMEOUT=30000
   ```
   Serializes to a single async connection, trading concurrency for stability. **Not supported long-term** — plan the real migration.

The short version: sync backends throttled concurrency through thread pools, so slow storage just made things *slow*. Async backends allow massive concurrency, which means slow `fsync`s stack up, connections stay checked out longer, the pool saturates, and the whole thing wedges. The same storage was tolerable before because the app wasn't asking it to do 20 concurrent `fsync`s.

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

- Redis is **not needed** for single-instance deployments for basic functionality. However, **without Redis, signing out does not revoke tokens** — they remain valid until they expire (default: 4 weeks). If your deployment is production-facing or handles sensitive data, Redis is strongly recommended even for a single instance, or alternatively shorten `JWT_EXPIRES_IN` to limit exposure. See [Token Revocation](/getting-started/advanced-topics/hardening#token-revocation) in the Hardening guide for details.
- If you're using Redis Sentinel for high availability, also set `REDIS_SENTINEL_HOSTS` and consider setting `REDIS_SOCKET_CONNECT_TIMEOUT=5` to prevent hangs during failover.
- For AWS Elasticache or other managed Redis Cluster services, set `REDIS_CLUSTER=true`.
- Make sure your Redis server has `timeout 1800` and a high enough `maxclients` (10000+) to prevent connection exhaustion over time.
- A **single Redis instance** is sufficient for the vast majority of deployments, even with thousands of users. You almost certainly do not need Redis Cluster unless you have specific HA/bandwidth requirements. If you think you need Redis Cluster, first check whether your connection count and memory usage are caused by fixable configuration issues (see [Common Anti-Patterns](/troubleshooting/performance#%EF%B8%8F-common-anti-patterns)).
- Without Redis in a multi-instance setup, you will experience [WebSocket 403 errors](/troubleshooting/multi-replica#2-websocket-403-errors--connection-failures), [configuration sync issues](/troubleshooting/multi-replica#3-model-not-found-or-configuration-mismatch), and intermittent authentication failures.

For a complete step-by-step Redis setup (Docker Compose, Sentinel, Cluster mode, verification), see the [Redis WebSocket Support](/tutorials/integrations/redis) tutorial. For WebSocket and CORS issues behind reverse proxies, see [Connection Errors](/troubleshooting/connection-error#-https-tls-cors--websocket-issues).

---

## Step 3 — Run Multiple Instances

**When:** You need to handle more users or want high availability (no downtime during deploys or if a container crashes).

Open WebUI is stateless, so you can run as many instances as needed behind a **load balancer**. Each instance is identical and interchangeable.

:::warning
Before running multiple instances, ensure you have completed **Steps 1 and 2** (PostgreSQL and Redis). You also need a shared `WEBUI_SECRET_KEY` across all replicas — without it, users will experience [login loops and 401 errors](/troubleshooting/multi-replica#1-login-loops--401-unauthorized-errors). For how to generate, store, and rotate that key (plus the matching `OAUTH_SESSION_TOKEN_ENCRYPTION_KEY`), see [Secret Key](/getting-started/advanced-topics/hardening#secret-key) in the Hardening guide. For a full pre-flight checklist, see the [Core Requirements Checklist](/troubleshooting/multi-replica#core-requirements-checklist).
:::

### Option A: Container Orchestration (Recommended)

Use Kubernetes, Docker Swarm, or similar platforms to manage multiple replicas:

- Keep `UVICORN_WORKERS=1` per container (let the orchestrator handle scaling, not the app)
- Set `ENABLE_DB_MIGRATIONS=false` on all replicas except one designated "primary" pod to prevent migration race conditions — see [Updates and Migrations](/troubleshooting/multi-replica#updates-and-migrations) for the safe procedure
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

For the full crash sequence analysis, see [Worker Crashes During Document Upload](/troubleshooting/multi-replica#6-worker-crashes-during-document-upload-chromadb--multi-worker) or [RAG Troubleshooting: Worker Dies During Upload](/troubleshooting/rag#12-worker-dies-during-document-upload).

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
| **MariaDB Vector** | HNSW-based vector search - performance comparable to other implementations, with stronger scalability under multi-connection workloads | `VECTOR_DB=mariadb-vector` + `MARIADB_VECTOR_DB_URL=mariadb+mariadbconnector://...` |
| **Milvus** | Large-scale self-hosted deployments with high query throughput; supports multitenancy for per-user isolation | `VECTOR_DB=milvus` + `MILVUS_URI=http://milvus-host:19530` |
| **Qdrant** | Self-hosted deployments needing efficient filtering and metadata search; supports multitenancy | `VECTOR_DB=qdrant` + `QDRANT_URI=http://qdrant-host:6333` |
| **Pinecone** | Fully managed cloud service — zero infrastructure to maintain, pay-per-use | `VECTOR_DB=pinecone` + `PINECONE_API_KEY=...` |
| **ChromaDB (HTTP mode)** | Keeping ChromaDB but making it multi-process safe by running it as a separate server | `VECTOR_DB=chroma` + `CHROMA_HTTP_HOST=chroma-host` + `CHROMA_HTTP_PORT=8000` |

:::note

Only PGVector and ChromaDB will be consistently maintained by the Open WebUI team. The other vector stores are mainly community-added vector databases.

:::

:::tip
**PGVector** is the simplest choice if you're already running PostgreSQL for the main database — it adds vector search to the database you already have, with no additional infrastructure.

For maximum scalability in self-hosted environments, **Milvus** and **Qdrant** both support **multitenancy mode** (`ENABLE_MILVUS_MULTITENANCY_MODE=True` / `ENABLE_QDRANT_MULTITENANCY_MODE=True`), which provides better resource sharing at scale.
:::

---

## Step 5 — Share File Storage Across Instances

**When:** You're running multiple instances that need to share uploaded files, generated images, and other user data.

By default, Open WebUI stores uploaded files on the local filesystem under `DATA_DIR` (typically `/app/backend/data`). In a multi-instance setup, each instance needs access to the same files. Without shared storage, you will see [uploaded files and RAG knowledge become inaccessible](/troubleshooting/multi-replica#5-uploaded-files-or-rag-knowledge-inaccessible) when requests hit different replicas.

### Do I need cloud storage (S3)?

**Not necessarily.** Open WebUI stores all uploaded files with **UUID-based unique filenames**. Multiple processes and replicas only ever **create new files** or **read existing ones** — they never write to the same file simultaneously. This means a simple **shared filesystem mount** works correctly without write conflicts under normal operation. Though you have to ensure, that all workers/replicas have access to the very same shared DATA_DIR directory in a shared storage.

**Your options:**

| Approach | When to Use |
|---|---|
| **Shared filesystem** (NFS, AWS EFS, CephFS, GlusterFS, or a simple shared Docker volume) | The simplest option for most deployments. Mount the same directory to `/app/backend/data` on all instances. Works well for on-prem, Docker Swarm, and Kubernetes with ReadWriteMany (RWX) volumes. |
| **Cloud object storage** (S3, GCS, Azure Blob) | Better for cloud-native deployments at very large scale, or when you want managed durability (11 nines) and don't want to manage shared filesystems. Requires setting `STORAGE_PROVIDER`. |

:::info What does STORAGE_PROVIDER actually control?
`STORAGE_PROVIDER` only controls where **uploaded files** are stored (documents, images, etc.). It does **not** affect the main database (use `DATABASE_URL` for that) or the vector database (use `VECTOR_DB` for that). When left unset, files are stored on the local filesystem under `DATA_DIR`.
:::

### Option A: Shared Filesystem (Simplest)

No configuration changes needed — just ensure all instances mount the same directory:

**Example Kubernetes:**
```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: openwebui-data  # Must be ReadWriteMany (RWX)
```

**Example Docker Compose:**
```yaml
volumes:
  - /opt/data/openwebui-data:/app/backend/data
```

:::warning
Do **not** store the SQLite database on a network filesystem. SQLite's file locking does not work reliably over NFS. This is another reason to switch to PostgreSQL (Step 1) before scaling to multiple instances.
:::

Once your data directory is shared, lock down what can land in it: see [File upload limits](/getting-started/advanced-topics/hardening#file-upload-limits) for size, count, and extension caps, and [Data directory](/getting-started/advanced-topics/hardening#data-directory) for filesystem-permission and backup guidance.

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

## Step 6 — Fix Content Extraction & Embeddings

**When:** You process documents regularly (RAG, knowledge bases) and are running in production.

:::danger These Defaults Cause Memory Leaks at Scale
The default content extraction engine (pypdf) and default embedding engine (SentenceTransformers) are the **two most common causes of memory leaks** in production Open WebUI deployments. Fixing these is just as important as switching to PostgreSQL or adding Redis.
:::

**What to do:**

1. **Switch the content extraction engine** to an external service:

```
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998
```

2. **Switch the embedding engine** to an external provider:

```
RAG_EMBEDDING_ENGINE=openai
# or for self-hosted:
RAG_EMBEDDING_ENGINE=ollama
```

**Key things to know:**

- The default content extractor (pypdf) has unavoidable **known memory leaks** that cause your Open WebUI process to grow in memory continuously. An external extractor (Tika, Docling) runs in its own process/container, isolating these leaks.
- The default SentenceTransformers embedding model loads ~500MB per worker process. With 8 workers, that's 4GB of RAM just for embeddings. External embedding eliminates this.
- For detailed guidance and configuration options, see [Content Extraction Engine](/troubleshooting/performance#content-extraction-engine) and [Embedding Engine](/troubleshooting/performance#embedding-engine) in the Performance guide.
- External Tika, Docling, or embedding endpoints become a new outbound destination from Open WebUI. Reach them over the internal network only, and review the [Network and outbound requests](/getting-started/advanced-topics/hardening#network-and-outbound-requests) section of the Hardening guide for SSRF defaults (`AIOHTTP_CLIENT_ALLOW_REDIRECTS=false`, `WEB_FETCH_FILTER_LIST`) so a misconfigured extractor URL cannot be redirected onto an internal address.

---

## Step 7 — Add Observability

**When:** You want to monitor performance, troubleshoot issues, and understand how your deployment is behaving at scale.

Open WebUI supports **OpenTelemetry** for exporting traces, metrics, and logs to your observability platform (Grafana, Datadog, New Relic, etc.):

```
ENABLE_OTEL=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
```

This gives you visibility into request latency, database query performance, error rates, and more.

For the full setup guide, see [OpenTelemetry Monitoring](/reference/monitoring/otel). For application-level log configuration (log levels, debug output), see [Logging Open WebUI](/getting-started/advanced-topics/logging). For structured-logging defaults aimed at log aggregators, plus the dedicated audit log that records auth events, admin actions, and data access, see [Observability](/getting-started/advanced-topics/hardening#observability) and [Audit Logging](/getting-started/advanced-topics/hardening#audit-logging) in the Hardening guide.

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
    │     (+ PGVector for RAG)      │   ← Vector DB (or other Vector DB)
    └───────────────────────────────┘
    ┌───────────────────────────────┐
    │           Redis               │   ← Shared state & websockets
    └───────────────────────────────┘
    ┌───────────────────────────────┐
    │  Shared Storage (NFS or S3)   │   ← Shared file storage
    └───────────────────────────────┘
```

**Running into issues?** The [Scaling & HA Troubleshooting](/troubleshooting/multi-replica) guide covers common problems (login loops, WebSocket failures, database locks, worker crashes) and their solutions. For performance tuning at scale, see [Optimization, Performance & RAM Usage](/troubleshooting/performance).

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

# Content Extraction (do NOT use default pypdf in production)
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998

# Embeddings (do NOT use default SentenceTransformers at scale)
RAG_EMBEDDING_ENGINE=openai
# or: RAG_EMBEDDING_ENGINE=ollama

# Workers (let orchestrator scale, keep workers at 1)
UVICORN_WORKERS=1

# Migrations (set to false on all but one instance)
ENABLE_DB_MIGRATIONS=false

# Concurrency & DB write throttling (REQUIRED at scale — see note below)
THREAD_POOL_SIZE=2000
DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL=300
```

:::warning Two settings people forget — and then their scaled deployment stalls
- **`THREAD_POOL_SIZE=2000`** — Open WebUI offloads blocking work (DB calls, file I/O, sync handlers) to a thread pool whose default concurrency ceiling is only **40**. At scale, once 40 blocking operations are in flight every further request **queues**, and the whole app appears to freeze even though CPU/RAM look fine. `2000` is a *lower* bound for large instances; it is a concurrency ceiling, **not** a CPU/thread count, so a high value is not a contention risk. Never lower it. (The only exception is genuinely tiny hardware, which is not a "scaled deployment".)
- **`DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL=300`** — presence tracking writes each user's `last_active_at` to the database. **Unset (the default) means this write is unthrottled — roughly one `UPDATE` + `COMMIT` per authenticated request.** At scale that is a continuous flood of tiny write transactions that saturates the connection pool for no functional gain. Set it to `300`–`500` seconds; it is mandatory for large/production deployments and free performance everywhere else.

Both are read once at startup and are not configurable from the Admin UI. See [Performance → Database Optimization](/troubleshooting/performance#-database-optimization) and [Performance → High-Concurrency](/troubleshooting/performance#-high-concurrency--network-optimization).
:::

### Security defaults to revisit at scale

A few defaults that are reasonable for single-user evaluation become less so once you put the deployment behind SSO and serve real users. The full discussion lives in the [Hardening guide](/getting-started/advanced-topics/hardening); the items most often missed in enterprise rollouts:

- **Disable external profile image redirects** — `ENABLE_PROFILE_IMAGE_URL_FORWARDING=false`. By default the user/model profile-image endpoints `302` to whatever external URL `profile_image_url` holds, which makes every browser viewing an avatar leak its IP, User-Agent, and Referer to that origin. Set this to `false` for shared deployments **unless** your IdP supplies avatars only as `data:` URIs (which Open WebUI persists locally and is unaffected) or you have a deliberate reason to keep IdP-hosted avatars rendering — e.g. your `OAUTH_PICTURE_CLAIM` returns Google/Gravatar URLs and you want them to display. See [SSO configuration](/features/authentication-access/auth/sso) for the matching OAuth picture-claim settings.
- **Set `WEBUI_SECRET_KEY` and `OAUTH_SESSION_TOKEN_ENCRYPTION_KEY`** to the same value across every replica. Without this, sessions break on rolling restart and OAuth tokens written by one pod cannot be decrypted by another.
- **Lower `JWT_EXPIRES_IN`** from the four-week default if your deployment carries sensitive data, especially if Redis is not yet in place to revoke tokens on signout. See [Token Revocation](/getting-started/advanced-topics/hardening#token-revocation).
- **Disable `ENABLE_OAUTH_ID_TOKEN_COOKIE`** (`false`) once all clients are on the new server-side session model. The legacy cookie carried the raw IdP id_token to the browser; the new model keeps it server-side.

These are configuration defaults, not new features — the existing knobs simply matter more once a deployment has multiple users and a real identity provider in front of it.

Beyond this short list, the Hardening guide groups the same concerns by topic so you can work through them step by step: [Network Placement](/getting-started/advanced-topics/hardening#network-placement), [Authentication and Signup](/getting-started/advanced-topics/hardening#authentication-and-signup), [Session and Cookie Security](/getting-started/advanced-topics/hardening#session-and-cookie-security), [Security Headers](/getting-started/advanced-topics/hardening#security-headers), [Access Control](/getting-started/advanced-topics/hardening#access-control), [Tools, Functions, and Pipelines](/getting-started/advanced-topics/hardening#tools-functions-and-pipelines), and the [Security-First Deployment](/getting-started/advanced-topics/hardening#security-first-deployment) checklist at the end.

---

## Quick Reference: When Do I Need What?

| Scenario | PostgreSQL | Redis | External Vector DB | Ext. Content Extraction | Ext. Embeddings | Shared Storage |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Single user / evaluation | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Small team (< 50 users, single instance) | Recommended | Recommended† | ✗ | Recommended | ✗ | ✗ |
| Multiple Uvicorn workers | **Required** | **Required** | **Required** | **Strongly Recommended** | **Strongly Recommended** | ✗ (same filesystem) |
| Multiple instances / HA | **Required** | **Required** | **Required** | **Strongly Recommended** | **Strongly Recommended** | **Optional** (NFS or S3) |
| Large scale (1000+ users) | **Required** | **Required** | **Required** | **Strongly Recommended** | **Strongly Recommended** | **Optional** (NFS or S3) |

†Without Redis, signing out and password changes do **not** revoke tokens — they remain valid until `JWT_EXPIRES_IN` expires (default: 4 weeks). For production deployments handling sensitive data, Redis is recommended for proper token revocation. See [Token Revocation](/getting-started/advanced-topics/hardening#token-revocation).

:::note About "External Vector DB"
The default ChromaDB uses a local SQLite backend that crashes under multi-process access. "External Vector DB" means either a client-server database (PGVector, Milvus, Qdrant, Pinecone) or ChromaDB running as a separate HTTP server. See [Step 4](#step-4--switch-to-an-external-vector-database) for details.
:::

:::note About "Shared Storage"
For multiple instances, all replicas need access to the same uploaded files. A **shared filesystem mount** (local drive, NFS, EFS, CephFS) is sufficient — cloud object storage (S3/GCS/Azure) is a scalable alternative, but not a requirement. Files use UUID-based unique names, so there are no write conflicts. See [Step 5](#step-5--share-file-storage-across-instances) for details.
:::

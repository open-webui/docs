---
sidebar_position: 2
title: "Scaling Open WebUI"
---

# Scaling Open WebUI

Open WebUI scales from a single user to organization-wide rollouts. It follows a **stateless, container-first architecture**, so scaling it works like scaling any modern web application: move state into shared services, then add instances behind a load balancer.

This guide covers the steps at a high level. For exact variable details, see the [Environment Variable Reference](/reference/env-configuration). For tuning a single instance, see [Optimization, Performance & RAM Usage](/troubleshooting/performance). When something breaks in a scaled deployment, see [Scaling & HA Troubleshooting](/troubleshooting/multi-replica).

---

## Understanding the Defaults

Open WebUI defaults to a **self-contained, single-instance deployment**. The standard Docker image includes:

- **Embedded SQLite** for application data on a persistent volume
- **Embedded ChromaDB** (also backed by SQLite) for RAG embeddings
- **Local file storage** (`STORAGE_PROVIDER=local`) for uploads under `DATA_DIR/uploads`
- **A single Uvicorn worker**, with no external database or Redis required

This keeps time to deployment and operational overhead low, and simplifies **air-gapped deployment**.

**Horizontal scaling requires shared persistence and coordination**, so every replica works on the same data. Before adding replicas, switch to PostgreSQL and a client-server vector database, configure shared file storage and add Redis. The application tier then scales independently behind a load balancer.

:::warning External databases do not share uploaded files
PostgreSQL stores file metadata and storage paths, and the vector database stores embeddings. Neither stores the files. Before adding replicas, configure **external object storage (S3, GCS or Azure Blob)** or a **shared filesystem** that every replica can reach. See [Step 5](#step-5-share-file-storage-across-instances).
:::

---

## Step 1: Switch to PostgreSQL

**When:** You plan to run more than one Open WebUI instance, or your SQLite file lives on anything other than a locally attached SSD/NVMe.

:::tip You don't need this step if you're a single-replica deployment on local disk
SQLite is fine for single-replica deployments, personal use, evaluation, home labs and small teams, **as long as the database file lives on a locally attached SSD/NVMe.** Skip to whichever later step you need.
:::

SQLite stores everything in a single file and handles concurrent writes from several processes poorly. PostgreSQL supports many simultaneous connections.

**What to do:**

Set [`DATABASE_URL`](/reference/env-configuration#database_url) to your PostgreSQL server:

```
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
```

Use a plain `postgresql://` URL. Open WebUI picks the async driver (psycopg 3) itself.

**Key things to know:**

- Open WebUI does **not** migrate data between databases, so plan this before you have production data in SQLite.
- **Connection pool.** With [`DATABASE_POOL_SIZE`](/reference/env-configuration#database_pool_size) unset, each process uses SQLAlchemy's default of 5 connections plus 10 overflow. Once you set `DATABASE_POOL_SIZE`, the overflow default drops to `0`, so set [`DATABASE_POOL_MAX_OVERFLOW`](/reference/env-configuration#database_pool_max_overflow) too. `DATABASE_POOL_SIZE=0` disables pooling. `DATABASE_POOL_SIZE=15` with `DATABASE_POOL_MAX_OVERFLOW=20` is a good start for busy instances.
- **Every replica has its own pool.** The maximum number of connections is `(DATABASE_POOL_SIZE + DATABASE_POOL_MAX_OVERFLOW) × replicas`. Keep that below PostgreSQL's `max_connections` (default 100) with room for other clients. With the values above, 3 replicas can open 105 connections.
- For single-instance pool tuning, see [Connection Pool Sizing](/troubleshooting/performance#connection-pool-sizing).

For credential handling and encryption at rest, see the [Database section of the Hardening guide](/getting-started/advanced-topics/hardening#database).

### Why SQLite on network storage fails the moment you scale (or upgrade)

SQLite on NFS, CephFS, Azure Files or a network-backed Kubernetes PVC works at low load and then fails under concurrency: connection pool timeouts, `database is locked` and simple queries that stall for seconds or minutes. Every commit waits on a slow network `fsync`, and SQLite's file locking is [unreliable over network filesystems](https://www.sqlite.org/faq.html#q5). A bigger pool makes it worse.

No setting fixes this while SQLite stays on network storage. Switch to PostgreSQL (this step), or move `webui.db` to a local SSD/NVMe for a single-node deployment. Uploads and RAG files can stay on the shared filesystem. For the mechanism, see [Disk I/O Latency](/troubleshooting/performance#disk-io-latency-sqlite--storage). For symptoms and a stopgap, see [Database Corruption / "Locked" Errors](/troubleshooting/multi-replica#4-database-corruption--locked-errors).

---

## Step 2: Add Redis

**When:** You run more than one Open WebUI instance.

Redis lets all instances coordinate. It has two roles:

- [`REDIS_URL`](/reference/env-configuration#redis_url): token revocation on sign-out, stopping and resuming responses running on another instance, sign-in rate limiting, OAuth token refresh locks and the optional base-model cache.
- [`WEBSOCKET_MANAGER=redis`](/reference/env-configuration#websocket_manager): delivers live updates (streamed tokens, channel messages, note edits) to users connected to other instances, and shares the model list, active users and presence between them. It connects to [`WEBSOCKET_REDIS_URL`](/reference/env-configuration#websocket_redis_url), which defaults to `REDIS_URL`.

**What to do:**

Set both on every instance:

```
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis
```

Keep [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) at its default `true`.

Open WebUI uses ordinary Redis commands, so a Redis-protocol server such as [**Valkey**](/tutorials/integrations/valkey) or **Dragonfly** works with the same settings. Neither is part of what Open WebUI tests. Use a recent release, and run Dragonfly standalone, since its cluster mode does not carry the pub/sub that live updates depend on.

**Key things to know:**

- Single instances work without Redis, but then **signing out does not revoke the session token**: it stays valid until it expires (default: 4 weeks). Password changes and **Sign out all devices** work without Redis. For production or sensitive data, add Redis or shorten `JWT_EXPIRES_IN`. See [Token Revocation](/getting-started/advanced-topics/hardening#token-revocation).
- **Redis Sentinel:** set [`REDIS_SENTINEL_HOSTS`](/reference/env-configuration#redis_sentinel_hosts) and [`WEBSOCKET_SENTINEL_HOSTS`](/reference/env-configuration#websocket_sentinel_hosts) (the websocket manager reads only the second). The host part of `REDIS_URL` is the master's service name. Set `REDIS_SOCKET_CONNECT_TIMEOUT=5` so failover does not hang.
- **Redis Cluster** (for example AWS ElastiCache in cluster mode): set [`REDIS_CLUSTER=true`](/reference/env-configuration#redis_cluster). The websocket manager follows it.
- Set the Redis server `timeout` (for example `1800`) and a high enough `maxclients` (10000+) to prevent connection exhaustion.
- For heavy streaming, raise Redis's Pub/Sub output buffer limits; see [WebSocket Pub/Sub Buffer Limits](/tutorials/integrations/redis#websocket-pubsub-buffer-limits).
- All instances must use the same [`WEBSOCKET_REDIS_ROOM_CHANNELS`](/reference/env-configuration#websocket_redis_room_channels) value. See [Per-Room Redis Channels](#per-room-redis-channels).
- A **single Redis instance** is enough for the vast majority of deployments, even with thousands of users. Before reaching for Redis Cluster, check for fixable configuration issues (see [Common Anti-Patterns](/troubleshooting/performance#common-anti-patterns)).

For a full Redis setup (Docker Compose, Sentinel, Cluster, verification), see the [Redis WebSocket Support](/tutorials/integrations/redis) tutorial. For WebSocket and CORS issues behind reverse proxies, see [Connection Errors](/troubleshooting/connection-error#https-tls-cors--websocket-issues).

---

## Step 3: Run Multiple Instances

**When:** You need to serve more users or want high availability.

With shared state in place, run as many identical instances as you need behind a **load balancer**.

:::warning
Complete **Steps 1, 2, 4 and 5** first. All replicas also need the same `WEBUI_SECRET_KEY`, or users get [login loops and 401 errors](/troubleshooting/multi-replica#1-login-loops--401-unauthorized-errors). For generating, storing and rotating it (plus `OAUTH_SESSION_TOKEN_ENCRYPTION_KEY`), see [Secret Key](/getting-started/advanced-topics/hardening#secret-key). For a pre-flight list, see the [Core Requirements Checklist](/troubleshooting/multi-replica#core-requirements-checklist).
:::

Keep one worker per instance ([`UVICORN_WORKERS=1`](/reference/env-configuration#uvicorn_workers), the default) and scale by changing the number of replicas. Each replica then has its own memory limit and can be restarted on its own.

- **Docker Compose** (one host): set `deploy.replicas` on the Open WebUI service, or run `docker compose up -d --scale open-webui=3`. Remove the fixed host port mapping (such as `3000:8080`) from that service, because only one container can bind a host port. Put a reverse proxy (Nginx, Traefik or Caddy) in the same Compose project and point it at `open-webui:8080`; Docker's DNS returns every replica for the service name, and the proxy spreads requests across them round-robin. With WebSockets on (the default), plain round-robin works; see [Session Affinity](/troubleshooting/multi-replica#session-affinity-sticky-sessions) for when sticky sessions help. Nginx resolves that name only at startup, so reload it after changing the replica count.
- **Docker Swarm** or **Kubernetes** (several hosts): set the replica count of the service or Deployment, or let an autoscaler manage it. See [Docker Swarm](/deployment/docker-swarm) and [Kubernetes](/deployment/kubernetes).

Let only one process run database migrations; see [Updates and Migrations](/troubleshooting/multi-replica#updates-and-migrations). Compose gives every replica the same settings, so `ENABLE_DB_MIGRATIONS` cannot pick one of them. Upgrade by scaling down to one replica (`docker compose up -d --scale open-webui=1`), wait until it is healthy, then scale back up.

### Offload HTTP Compression to the Load Balancer

Once a load balancer, ingress or CDN sits in front of Open WebUI, let it compress HTTP responses and turn off the app's compression:

```
ENABLE_COMPRESSION_MIDDLEWARE=false
```

Every replica otherwise spends a few percent of its CPU compressing responses. Streaming chat responses and WebSocket traffic are unaffected either way. If nothing in front compresses, the first page load and large JSON responses get bigger. See [`ENABLE_COMPRESSION_MIDDLEWARE`](/reference/env-configuration#enable_compression_middleware).

WebSocket frames are compressed by the WebSocket server itself. Under heavy streaming, turn that off:

```
UVICORN_WS_PER_MESSAGE_DEFLATE=false
```

Chat responses stream as one small frame per token, so compressing each frame costs CPU for every subscriber and saves almost nothing. See [`UVICORN_WS_PER_MESSAGE_DEFLATE`](/reference/env-configuration#uvicorn_ws_per_message_deflate).

Two more WebSocket settings matter at size:

- **Heartbeats.** Each open tab sends a heartbeat every 30 seconds. [`WEBSOCKET_HEARTBEAT_INTERVAL=60`](/reference/env-configuration#websocket_heartbeat_interval) halves that traffic. A disconnected user then stays in the active count longer, since presence lasts four times the interval (at least 120 seconds).
- **Leftover streams.** A response being streamed is kept in Redis so a reconnecting browser can resume it, and is deleted when it finishes. [`REDIS_RESPONSE_STREAM_TTL`](/reference/env-configuration#redis_response_stream_ttl) (default `3600` seconds) expires entries left behind by replicas killed mid-stream. `0` keeps them forever.

#### Pair It with Static Asset Caching at the Proxy

Disabling app-side compression works best when the proxy also **caches the static assets**, so each browser downloads the compressed bundles once.

All frontend JavaScript and CSS lives under `/_app/immutable/` with **content-hashed filenames**. A given URL never changes content, so these files are safe to cache for a long time. The HTML shell and `/_app/version.json` must stay short-lived, because browsers use them to discover a new build.

Example for Nginx:

```nginx
proxy_cache_path /var/cache/nginx/openwebui levels=1:2 keys_zone=OPENWEBUI_STATIC:10m
                 max_size=1g inactive=7d use_temp_path=off;

# Content-hashed bundles: immutable by construction
location ^~ /_app/immutable/ {
    proxy_pass http://openwebui;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Connection "";
    proxy_buffering on;
    proxy_cache OPENWEBUI_STATIC;
    proxy_cache_valid 200 7d;
    proxy_cache_lock on;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
}
```

- `immutable` stops browsers from revalidating on reload. `max-age=2592000, immutable` (30 days) works nearly as well.
- Keep the HTML shell and `/_app/version.json` uncached or at a few minutes, or users miss upgrades. Open WebUI sends the HTML shell with `Cache-Control: no-cache` unless [`CACHE_CONTROL`](/reference/env-configuration#cache_control) is set; keep that header at the proxy.
- `proxy_cache` fetches each asset from a replica once per cache lifetime instead of once per user.
- Nginx compresses on every response (its cache stores the uncompressed body), so use moderate levels: `gzip_comp_level 4;` or brotli quality 4 to 5, plus `gzip_min_length 1000;`.

### Switch the JSON Encoder to orjson

With several instances, every live update crosses Redis and is encoded and decoded as JSON. [`ENABLE_ORJSON`](/reference/env-configuration#enable_orjson) (default `True`) uses the much faster [orjson](https://pypi.org/project/orjson/) library for this and for the rest of the app. Keep it on. For the behaviour differences, see [Use the Faster JSON Encoder](/troubleshooting/multi-replica#use-the-faster-json-encoder).

### Per-Room Redis Channels

With `WEBSOCKET_MANAGER=redis`, live updates addressed to a specific user, channel or note go out on a Redis channel of their own. Each instance subscribes only to the rooms of the users connected to it, so it skips decoding updates meant for other instances. Acknowledgements and control messages stay on the shared channel. The saving grows with the number of instances. This is on by default:

```
WEBSOCKET_REDIS_ROOM_CHANNELS=True
```

:::warning Update all instances together

Every instance must run the same mode. A rolling restart leaves instances in different modes, and live updates then go missing between them. Stop all instances, change the setting everywhere, then start them again.

:::

If your Redis user is restricted by ACLs, it needs the `PUBLISH`, `SUBSCRIBE`, `UNSUBSCRIBE` and `PING` commands and access to the channels `&socketio` and `&socketio#*`. Room channels are named `socketio#<namespace>#<room>`. When a permission is missing, live updates fail and the log shows `Redis denied publishing` or `Redis denied subscribing`, together with the permissions and channels to check.

`WEBSOCKET_REDIS_ROOM_CHANNELS=False` sends everything through the one shared channel. See [`WEBSOCKET_REDIS_ROOM_CHANNELS`](/reference/env-configuration#websocket_redis_room_channels).

### Speed Up Name Lookups

Hostname lookups queue behind each other under load, delaying the request each one belongs to. The c-ares resolver removes that queue:

```
AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER=True
```

It is opt-in because c-ares reads fewer name sources than the operating system does. See [DNS Resolver](/troubleshooting/performance#dns-resolver) for what to test afterwards.

---

## Step 4: Switch to an External Vector Database

**When:** You run more than one replica. **This is required.**

:::danger Default ChromaDB Will Crash in Multi-Process Setups

The default ChromaDB runs embedded in the Open WebUI process and stores its data in local SQLite files under `DATA_DIR/vector_db`. Only one process may write to them. With several replicas, concurrent writes (for example during document uploads) kill the process:

```
save_docs_to_vector_db:1619 - adding to collection file-id
INFO:     Waiting for child process [pid]
INFO:     Child process [pid] died
```

See [Worker Crashes During Document Upload](/troubleshooting/multi-replica#6-worker-crashes-during-document-upload-chromadb--multi-worker).

:::

**What to do:**

Set [`VECTOR_DB`](/reference/env-configuration#vector_db) to a client-server vector database:

```
VECTOR_DB=pgvector
```

**Recommended alternatives:**

| Vector DB | Best For | Configuration |
|---|---|---|
| **PGVector** | Teams already running PostgreSQL | `VECTOR_DB=pgvector` + `PGVECTOR_DB_URL=postgresql://...` (defaults to `DATABASE_URL`) |
| **MariaDB Vector** | Teams running MariaDB | `VECTOR_DB=mariadb-vector` + `MARIADB_VECTOR_DB_URL=mariadb+mariadbconnector://...` |
| **Milvus** | Large self-hosted deployments with high query throughput | `VECTOR_DB=milvus` + `MILVUS_URI=http://milvus-host:19530` |
| **Qdrant** | Self-hosted deployments needing efficient filtering and metadata search | `VECTOR_DB=qdrant` + `QDRANT_URI=http://qdrant-host:6333` |
| **Pinecone** | Fully managed cloud service | `VECTOR_DB=pinecone` + `PINECONE_API_KEY=...` |
| **ChromaDB (HTTP mode)** | Keeping ChromaDB, run as a separate server | `VECTOR_DB=chroma` + `CHROMA_HTTP_HOST=chroma-host` + `CHROMA_HTTP_PORT=8000` |

:::note

The core team maintains PGVector and ChromaDB. The other vector stores are contributed integrations.

:::

:::tip
**PGVector** is the simplest choice if you already run PostgreSQL for the main database: no additional infrastructure.

**Milvus** and **Qdrant** have a multitenancy mode, and we recommend it whenever you use either. Without it, every file, knowledge base, user's memories and web search gets its own collection, which runs into scaling problems quickly on a larger instance. With it, all data shares a few collections. It is on by default for Qdrant ([`ENABLE_QDRANT_MULTITENANCY_MODE`](/reference/env-configuration#enable_qdrant_multitenancy_mode)) and off for Milvus ([`ENABLE_MILVUS_MULTITENANCY_MODE`](/reference/env-configuration#enable_milvus_multitenancy_mode)), so turn it on for Milvus. Decide before the first start; switching later needs a reindex.
:::

The slim image supports only PGVector, its default `VECTOR_DB`.

---

## Step 5: Share File Storage Across Instances

**When:** You're running multiple instances. **Shared access to uploaded files is required** for attachments, knowledge documents and generated images to work across replicas.

By default, Open WebUI stores uploaded files under `DATA_DIR` (typically `/app/backend/data`). Every instance needs access to the same files, or [uploaded files and RAG knowledge become inaccessible](/troubleshooting/multi-replica#5-uploaded-files-or-rag-knowledge-inaccessible) when requests hit different replicas.

### Do I need cloud storage (S3)?

**Shared file access is the requirement; object storage is one way to get it.** Use S3, GCS or Azure Blob, or keep `STORAGE_PROVIDER=local` and mount the same shared filesystem at the same path on every replica.

**Your options:**

| Approach | When to Use |
|---|---|
| **Shared filesystem** (NFS, AWS EFS, CephFS or a shared volume on one host) | You already operate shared storage. Mount the same directory at the same path on all instances; multi-node Kubernetes needs ReadWriteMany (RWX) storage. |
| **External object storage** (S3, GCS, Azure Blob) | Replicas run on separate hosts, or files must survive container replacement without a shared volume. Configure `STORAGE_PROVIDER` and the same bucket or container on every replica. |

:::info What does STORAGE_PROVIDER actually control?
`STORAGE_PROVIDER` covers files saved through Open WebUI's file upload API: documents, attachments and generated images. The main database (`DATABASE_URL`), the vector database (`VECTOR_DB`) and the rest of `DATA_DIR` stay where they are. Files served directly from `/cache/`, such as some tool outputs, use the filesystem and need shared access if another replica must serve them.
:::

### Option A: Shared Filesystem (Simplest)

Keep `STORAGE_PROVIDER=local` and mount the same directory at the same path on all instances:

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

This bind mount shares files only between containers on the **same host**. On separate hosts, the source directory must itself be on shared storage. Docker volumes with the same name on different hosts are separate volumes.

:::warning
Keep the SQLite database off network filesystems. This is another reason to switch to PostgreSQL ([Step 1](#step-1-switch-to-postgresql)) before scaling.
:::

Once your data directory is shared, lock down what can land in it: see [File upload limits](/getting-started/advanced-topics/hardening#file-upload-limits) for size, count and extension caps, and [Data directory](/getting-started/advanced-topics/hardening#data-directory) for filesystem permissions and backups.

### Option B: Cloud Object Storage

Set `STORAGE_PROVIDER` and the bucket or container and credentials on **every replica**. All replicas must use the same destination, including the same `S3_KEY_PREFIX` if set, with permission to read, write and delete files.

**Supported providers:**

| Provider | Set `STORAGE_PROVIDER` to |
|---|---|
| Amazon S3 (or S3-compatible like MinIO, R2) | `s3` |
| Google Cloud Storage | `gcs` |
| Microsoft Azure Blob Storage | `azure` |

```bash
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=my-openwebui-bucket
S3_REGION_NAME=us-east-1

# For an S3-compatible service, also set its endpoint:
# S3_ENDPOINT_URL=https://s3.example.com
# S3_ADDRESSING_STYLE=path
```

For S3, omit `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` to use the default AWS credential chain (for example an IAM role), or supply both through your secret management. GCS uses `GCS_BUCKET_NAME` with application default credentials or `GOOGLE_APPLICATION_CREDENTIALS_JSON`. Azure uses `AZURE_STORAGE_ENDPOINT` and `AZURE_STORAGE_CONTAINER_NAME`, with `AZURE_STORAGE_KEY` or the default Azure credential. The slim image supports only `local` and `s3`.

See the [Environment Variable Reference](/reference/env-configuration#cloud-storage) for all provider settings and the [S3 Storage tutorial](/tutorials/maintenance/s3-storage) for a worked example.

:::warning Object storage still needs local disk
Uploads are first written to `DATA_DIR/uploads` and then sent to the bucket. Reads download files there before Open WebUI processes or serves them. Give every replica a writable data directory with enough space and I/O capacity for concurrent transfers.

`STORAGE_LOCAL_CACHE=false` removes local copies of cloud-backed files after processing. Plan local disk capacity anyway, since downloads and unprocessed uploads still use it.
:::

### Switching an Existing Deployment

Changing `STORAGE_PROVIDER` does **not** migrate existing files or rewrite their stored paths. Plan the transfer of existing objects and their file records before switching; copying files into a bucket is not enough. Back up the database and files first.

Before sending production traffic to multiple replicas, upload a file through one replica and download it through another. Check knowledge documents and generated images too, then repeat after replacing the uploading replica.

---

## Step 6: Fix Content Extraction & Embeddings

**When:** You process documents regularly (RAG, knowledge bases) in production.

The default content extractor (pypdf) and the default local embedding model (SentenceTransformers) run inside every Open WebUI process, so their memory use repeats for every replica, and the extractor is a common source of memory growth. Move both to external services.

**What to do:**

1. **Switch the content extraction engine** to an external service:

```
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998
```

To route different file types to different backends, run your own service and set `CONTENT_EXTRACTION_ENGINE=external`. See [External Document Extraction](/features/chat-conversations/rag/document-extraction/external).

2. **Switch the embedding engine** to an external provider:

```
RAG_EMBEDDING_ENGINE=openai
# or for self-hosted:
RAG_EMBEDDING_ENGINE=ollama
```

**Key things to know:**

- For details and options, see [Content Extraction Engine](/troubleshooting/performance#content-extraction-engine) and [Embedding Engine](/troubleshooting/performance#embedding-engine).
- The slim image has no local embedding or reranking models, so it requires an external embedding engine.
- External Tika, Docling or embedding endpoints are new outbound destinations. Reach them over the internal network only, and review [Network and outbound requests](/getting-started/advanced-topics/hardening#network-and-outbound-requests) in the Hardening guide (`AIOHTTP_CLIENT_ALLOW_REDIRECTS=false`, `WEB_FETCH_FILTER_LIST`).

---

## Step 7: Add Observability

**When:** You want to monitor performance and troubleshoot a deployment at scale.

Open WebUI exports traces, metrics and logs over **OpenTelemetry** to Grafana, Datadog, New Relic and similar platforms. Turn on the master switch and each signal you want:

```
ENABLE_OTEL=true
ENABLE_OTEL_TRACES=true
ENABLE_OTEL_METRICS=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
```

For the full setup, see [OpenTelemetry Monitoring](/reference/monitoring/otel). For log levels, see [Logging Open WebUI](/getting-started/advanced-topics/logging). For structured logging and the audit log, see [Observability](/getting-started/advanced-topics/hardening#observability) and [Audit Logging](/getting-started/advanced-topics/hardening#audit-logging) in the Hardening guide.

---

## Putting It All Together

A production-ready scaled deployment typically looks like this:

```mermaid
flowchart TD
    %% Main Flow
    LB["Load Balancer<br/>(Nginx, HAProxy, Cloud LB)"]

    subgraph Pods ["Stateless Containers"]
        direction LR
        P1["WebUI<br/>Pod 1"]
        P2["WebUI<br/>Pod 2"]
        PN["WebUI<br/>Pod N"]
    end

    subgraph Shared ["Shared Infrastructure"]
        direction LR
        DB[("PostgreSQL<br/>(+ PGVector for RAG)")]
        Redis{{"Redis"}}
        Storage[/"Shared Storage<br/>(NFS or S3)"/]
    end

    %% Annotations
    DBNote["Shared database<br/>+ Vector DB"]
    RedisNote["Shared state & websockets"]
    StoreNote["Shared file storage"]

    %% Connections
    LB --> P1
    LB --> P2
    LB --> PN
    P1 --> Shared
    P2 --> Shared
    PN --> Shared

    %% Alignment Links
    DB -.-> DBNote
    Redis -.-> RedisNote
    Storage -.-> StoreNote
```

**Running into issues?** See [Scaling & HA Troubleshooting](/troubleshooting/multi-replica) for login loops, WebSocket failures, database locks and crashes during uploads.

### Minimum Environment Variables for Scaled Deployments

```bash
# Same value on every replica
WEBUI_SECRET_KEY=your-shared-secret

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
DATABASE_POOL_SIZE=15
DATABASE_POOL_MAX_OVERFLOW=20

# Vector database (never the embedded ChromaDB with several replicas)
VECTOR_DB=pgvector
PGVECTOR_DB_URL=postgresql://user:password@db-host:5432/openwebui

# Redis
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis

# File storage: required across replicas, configure ONE option on all of them.
# Option A: STORAGE_PROVIDER=local with the same shared filesystem and mount path.
#           Separate per-host Docker volumes do not share files.
# Option B: external object storage (same bucket and key prefix on all replicas)
# STORAGE_PROVIDER=s3
# S3_BUCKET_NAME=my-openwebui-bucket
# S3_REGION_NAME=us-east-1
# Object storage still needs writable local disk; see Step 5.

# Content extraction and embeddings outside the app process
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998
RAG_EMBEDDING_ENGINE=openai
# or: RAG_EMBEDDING_ENGINE=ollama

# Migrations: false on all but one instance; see Updates and Migrations
ENABLE_DB_MIGRATIONS=false

# Room for blocking work (DB calls, file I/O); the default limit is 40
THREAD_POOL_SIZE=2000

# Only if your load balancer, ingress or CDN compresses responses
# ENABLE_COMPRESSION_MIDDLEWARE=false

# Per-token WebSocket compression costs CPU for little gain
# UVICORN_WS_PER_MESSAGE_DEFLATE=false

# Fewer idle heartbeats; a dropped user lingers longer in the active count
# WEBSOCKET_HEARTBEAT_INTERVAL=60

# Grow streamed responses in place; helps long answers under concurrency
ENABLE_CHAT_RESPONSE_STREAM_INPLACE_APPEND=True

# Faster name lookups; verify your names still resolve after enabling
AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER=True
```

:::warning Don't skip THREAD_POOL_SIZE
Open WebUI runs blocking work (database calls, file I/O, sync handlers) in a thread pool limited to **40** concurrent operations by default. Once 40 are in flight, further requests queue and the app appears to freeze while CPU and RAM look fine. `THREAD_POOL_SIZE` raises that limit. Threads are created only when needed, so a high value is safe. See [Thread Pool Size](/troubleshooting/performance#thread-pool-size).
:::

### Security defaults to revisit at scale

A few defaults that are reasonable for a single-user evaluation matter more once real users sign in through SSO. The full discussion lives in the [Hardening guide](/getting-started/advanced-topics/hardening). The items most often missed:

- **Disable external profile image redirects** with `ENABLE_PROFILE_IMAGE_URL_FORWARDING=false`. By default the profile image endpoints redirect to whatever external URL `profile_image_url` holds, so every browser showing that avatar sends its IP, User-Agent and Referer to that origin. Keep the default only if you want IdP-hosted avatars (for example Google or Gravatar URLs from `OAUTH_PICTURE_CLAIM`) to display; `data:` URI avatars are stored locally either way. See [SSO configuration](/features/authentication-access/auth/sso).
- **Set `WEBUI_SECRET_KEY`** to the same value on every replica. `OAUTH_SESSION_TOKEN_ENCRYPTION_KEY` defaults to it; if you set it separately, it must also match everywhere. Otherwise sessions break across replicas and OAuth tokens stored by one pod cannot be decrypted by another.
- **Lower `JWT_EXPIRES_IN`** from the four-week default if your deployment carries sensitive data, especially without Redis for sign-out revocation. See [Token Revocation](/getting-started/advanced-topics/hardening#token-revocation).
- **Set `ENABLE_OAUTH_ID_TOKEN_COOKIE=false`.** By default the raw IdP id_token is also sent to the browser as a cookie. Open WebUI keeps the id_token in the server-side OAuth session and uses that copy for sign-out.

Beyond this list, the Hardening guide works through the same concerns by topic: [Network Placement](/getting-started/advanced-topics/hardening#network-placement), [Authentication and Signup](/getting-started/advanced-topics/hardening#authentication-and-signup), [Session and Cookie Security](/getting-started/advanced-topics/hardening#session-and-cookie-security), [Security Headers](/getting-started/advanced-topics/hardening#security-headers), [Access Control](/getting-started/advanced-topics/hardening#access-control), [Tools, Functions, and Pipelines](/getting-started/advanced-topics/hardening#tools-functions-and-pipelines) and the [Security-First Deployment](/getting-started/advanced-topics/hardening#security-first-deployment) checklist.

---

## Quick Reference: When Do I Need What?

<div className="responsive-table">

| Scenario | PostgreSQL | Redis | External Vector DB | Ext. Content Extraction | Ext. Embeddings | Shared Storage |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Single user / evaluation | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Small team (< 50 users, single instance) | Optional | Recommended† | ✗ | Recommended | ✗ | ✗ |
| Multiple instances / HA | **Required** | **Required** | **Required** | **Strongly Recommended** | **Strongly Recommended** | **Required** (shared filesystem or object storage) |
| Large scale (1000+ users) | **Required** | **Required** | **Required** | **Strongly Recommended** | **Strongly Recommended** | **Required across replicas** |

</div>

†Without Redis, signing out does **not** revoke the session token: it stays valid until `JWT_EXPIRES_IN` expires (default: 4 weeks). See [Token Revocation](/getting-started/advanced-topics/hardening#token-revocation).

:::note About "External Vector DB"
A client-server database (PGVector, Milvus, Qdrant, Pinecone and others) or ChromaDB running as a separate HTTP server. See [Step 4](#step-4-switch-to-an-external-vector-database).
:::

:::note About "Shared Storage"
All replicas must reach the same uploaded files through **external object storage** (S3, GCS, Azure) or a **shared filesystem** (NFS, EFS, CephFS or a volume shared on one host). See [Step 5](#step-5-share-file-storage-across-instances).
:::

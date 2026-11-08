---
sidebar_position: 15
title: "Performance & RAM"
---

# Optimization, Performance & RAM Usage

This guide provides a comprehensive overview of strategies to optimize Open WebUI. Your ideal configuration depends heavily on your specific deployment goals. Consider which of these scenarios describes you best:

1.  **Maximum Privacy on Weak Hardware (e.g., Raspberry Pi)**:
    *   *Goal*: keep everything local; minimize resource usage.
    *   *Trade-off*: You must use lightweight local models (SentenceTransformers) and disable heavy features to prevent crashes.

2.  **Maximum Quality for Single User (e.g., Desktop)**:
    *   *Goal*: Best possible experience with high speed and quality.
    *   *Strategy*: Leverage external APIs (OpenAI/Anthropic) for embeddings and task models to offload compute from your local machine.

3.  **High Scale for Many Users (e.g., Enterprise/Production)**:
    *   *Goal*: Stability and concurrency.
    *   *Strategy*: Requires a dedicated vector DB (PGVector, Milvus or Qdrant), increased thread pools, caching to handle load, and **PostgreSQL** instead of SQLite.

---

## Performance Tuning (Speed & Responsiveness)

If Open WebUI feels slow or unresponsive, especially during chat generation or high concurrency, specialized optimizations can significantly improve the user experience.

### 1. Dedicated Task Models

By default, Open WebUI automates background tasks like title generation, tagging, and autocomplete. These run in the background and can slow down your main chat model if they share the same resources.

![Task model settings under Admin > Interface](/images/admin/admin-interface.png)

**Recommendation**: Use a **very fast, small, and cheap NON-REASONING model** for these tasks. Avoid a large reasoning model: it spends seconds thinking, and charges you for those thinking tokens, before producing a three word chat title. Every major provider offers a small tier that suits this far better than its flagship.

**Good options:**
*   **External/Cloud**: `gpt-5.6-luna`, `gemini-3.5-flash-lite`, `claude-haiku-4-5-20251001` (OpenAI, Google and Anthropic directly, or the same models through OpenRouter).
*   **Local**: `qwen3.5:2b`, `gemma4:e2b`, `llama3.2:3b`.

**Configuration:** the two model pickers, the parameters those background requests are sent with, and the switches for turning individual tasks off are all in **Settings > Admin > Interface**. See [Task Models](/features/administration/task-models) for the walkthrough.

### 2. Caching & Latency Optimization

Configure these settings to reduce latency and external API usage.

#### Model Caching
Drastically reduces startup time and API calls to external providers.

:::warning Important for OpenRouter and Multi-Model Providers
If you are using **OpenRouter** or any provider with hundreds/thousands of models, enabling model caching is **highly recommended**. Without caching, initial page loads can take **10-15+ seconds** as the application queries all available models. Enabling the cache reduces this to near-instant.
:::

- **Admin Panel**: `Settings > Admin > Connections > Cache Base Model List`
- **Env Var**: `ENABLE_BASE_MODELS_CACHE=True`
  *   *Note*: Caches the base model list, in Redis when Redis is configured (shared by all replicas), otherwise in each replica's memory. It refreshes when you click **Save** in Connections settings or use the refresh button next to the toggle. Without Redis it also refreshes on restart.

- **Env Var**: `MODELS_CACHE_TTL=300`
  *   *Note*: Caches the model list responses from each OpenAI and Ollama connection for 5 minutes. The default is `1` second.

#### Search Query Caching
Reuses the LLM-generated Web-Search search queries for RAG search within the same chat turn. This prevents redundant LLM calls when multiple retrieval features act on the same user prompt.

- **Env Var**: `ENABLE_QUERIES_CACHE=True`
  *   *Note*: If enabled, the same search query will be reused for RAG instead of generating new queries for RAG, saving on inference cost and API calls, thus improving performance.

---

## Database Optimization

For high-scale deployments, your database configuration is the single most critical factor for stability.

### PostgreSQL (Mandatory for Scale)
For any multi-user or high-concurrency setup, **PostgreSQL is mandatory**. SQLite (the default) is not designed for high concurrency and will become a bottleneck (database locking errors).

-   **Variable**: `DATABASE_URL`
-   **Example**: `postgres://user:password@localhost:5432/webui`

### User Active-Status Write Throttling (set this on every deployment)

Open WebUI tracks online/"active" presence by writing each user's `last_active_at` timestamp to the database. Unthrottled, essentially every authenticated request issues its own `UPDATE` plus `COMMIT`, a flood of tiny write transactions that loads the database and the connection pool for no benefit, since presence only needs about minute granularity.

-   **Env Var**: `DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL`
-   **Default**: `60` seconds
-   **Recommendation**: `120`, which halves the presence writes again. Keep it below `180`: active presence counts users whose timestamp falls in the last 180 seconds, so a longer interval makes the active-user figure oscillate. `0` disables throttling. See [`DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL`](/reference/env-configuration#database_user_active_status_update_interval).

### Database Session Sharing

Session sharing lets a database call reuse the session its request already holds instead of opening a new one.

-   **Env Var**: `DATABASE_ENABLE_SESSION_SHARING`
-   **Default**: `False`

:::tip Recommendations by Database Type

- **SQLite and low-spec hardware** (Raspberry Pi, containers capped at around 250m CPU): keep it **disabled** (default). Enabled, it causes slow admin pages, API timeouts and an unresponsive UI on such systems.
- **PostgreSQL with adequate resources:** consider **enabling** it for multi-user or high-concurrency deployments.

:::

### Connection Pool Sizing

For high-concurrency PostgreSQL deployments, the default connection pool may be too small. With `DATABASE_POOL_SIZE` unset, PostgreSQL uses the SQLAlchemy default of 5 connections plus 10 overflow. If you see `QueuePool limit reached` errors or connection timeouts, raise it:

-   **Env Var**: `DATABASE_POOL_SIZE=15`
-   **Env Var**: `DATABASE_POOL_MAX_OVERFLOW=20` (applies once `DATABASE_POOL_SIZE` is set; default `0`)
-   **Env Var**: `DATABASE_POOL_TIMEOUT` (seconds a request waits for a free connection before failing; default `30`)

SQLite uses its own pool sizing, see [SQLite Memory Footprint on Constrained Containers](#5-sqlite-memory-footprint-on-constrained-containers).

**Important:** The combined total (`DATABASE_POOL_SIZE` + `DATABASE_POOL_MAX_OVERFLOW`) should remain well below your database's `max_connections` limit. PostgreSQL defaults to 100 max connections, so keep the combined total under 50-80 per Open WebUI instance to leave room for other clients and maintenance operations.

### Vector Database (RAG)
For multi-user setups, the choice of Vector DB matters.

A knowledge base search runs without holding up the worker that issued it, so everyone else's responses keep streaming while it is in flight, and several collections are searched at the same time rather than one after another. A slow vector database therefore costs the chat that is searching rather than every user on that worker. It still has to cope with being reached by several replicas at once, which is what the choices below are about.

-   **ChromaDB (Default)**: **NOT SAFE** for multi-replica deployments. The default ChromaDB keeps its data in local SQLite files that only one process may write; several replicas writing at once crash them. See the [Scaling & HA troubleshooting guide](/troubleshooting/multi-replica#6-worker-crashes-during-document-upload-chromadb--multi-worker) for the full crash sequence and solutions.
-   **Recommendations**:
    *   **Milvus** or **Qdrant**: Best for improved scale and performance, when run as servers. A server deployment is safe for multi-replica access, because every replica talks to it over the network.
    *   **Milvus Lite**: for small single-instance deployments whose knowledge base is small and stays roughly the same size, where it uses less disk and less memory than local ChromaDB. Avoid it if you upload documents in bulk or keep adding files over time: the duplicate check Open WebUI runs before every upload scans the whole collection on Milvus Lite, so ingestion gets slower the more you have stored. See [Swap ChromaDB for Milvus Lite](#4-swap-chromadb-for-milvus-lite-small-deployments) for the measurements. A Milvus server remains the right choice for anything larger, and Milvus Lite is embedded, so it carries the same multi-process restriction as local ChromaDB. Point `MILVUS_URI` at a Milvus server before adding replicas.
    *   **PGVector**: Excellent choice if you are already using PostgreSQL. Also fully multi-process safe.
    *   **ChromaDB HTTP mode**: If you want to keep using ChromaDB, run it as a [separate server](/reference/env-configuration#chroma_http_host) so Open WebUI connects via HTTP instead of local SQLite.
-   **Multitenancy**: Recommended whenever you use Milvus or Qdrant; without it, larger instances quickly hit scaling problems. See [Step 4 of the scaling guide](/getting-started/advanced-topics/scaling#step-4-switch-to-an-external-vector-database).
    *   `ENABLE_MILVUS_MULTITENANCY_MODE=True` (default `False`)
    *   `ENABLE_QDRANT_MULTITENANCY_MODE=True` (default)

### Content Extraction Engine

:::danger Default Content Extractor Causes Memory Leaks
The **default content extraction engine** uses Python libraries including **pypdf**, which are known to have **persistent memory leaks** during document ingestion. In production deployments with regular document uploads, this will cause Open WebUI's memory usage to grow continuously until the process is killed or the container is restarted.

This is the **#1 cause of unexplained memory growth** in production deployments.
:::

**Recommendation**: Switch to an external content extraction engine for any deployment that processes documents regularly:

| Engine | Best For | Configuration |
|---|---|---|
| **Apache Tika** | General-purpose, widely used, handles most document types | `CONTENT_EXTRACTION_ENGINE=tika` + `TIKA_SERVER_URL=http://tika:9998` |
| **Docling** | High-quality extraction with layout-aware parsing | `CONTENT_EXTRACTION_ENGINE=docling` + `DOCLING_SERVER_URL=http://docling:5001` |
| **PaddleOCR-vl** | OCR-heavy workloads (scanned PDFs, images, mixed layouts); self-hosted vision-language OCR | `CONTENT_EXTRACTION_ENGINE=paddleocr_vl` + `PADDLEOCR_VL_BASE_URL=http://paddleocr-vl:8080` + `PADDLEOCR_VL_TOKEN=...` |
| **Any other External Loader** | Recommended for production and custom extraction pipelines | `CONTENT_EXTRACTION_ENGINE=external` + `EXTERNAL_DOCUMENT_LOADER_URL=...` |

Using an external extractor moves the memory-intensive parsing out of the Open WebUI process entirely, eliminating this class of memory leaks.

### Embedding Engine

:::warning SentenceTransformers at Scale
The **default SentenceTransformers** embedding engine (all-MiniLM-L6-v2) loads PyTorch and the model into the Open WebUI process at startup. Each replica loads its own copy. Fine for personal use; for multi-user or production deployments, **offload embeddings to an external service**.
:::

-   **Recommended**: `RAG_EMBEDDING_ENGINE=openai` (OpenAI or compatible APIs), `azure_openai`, or `ollama` (self-hosted, with models like `nomic-embed-text`).
-   **Effect**: No embedding model is loaded into the Open WebUI process.

### Optimizing Document Chunking

The way your documents are chunked directly impacts both storage efficiency and retrieval quality.

- **Use Markdown Header Splitting**: This preserves the semantic structure of your documents.
- **Set a Chunk Min Size Target**: When using the markdown header splitter, tiny chunks (e.g., just a single sub-header) can be created. These are inefficient to store and poor for retrieval.
  - **Env Var**: `CHUNK_MIN_SIZE_TARGET=1000` (Example value)
  - **Benefit**: Intelligently merges small chunks with neighbors, significantly reducing the total vector count and improving RAG performance.

---

## Scaling Infrastructure (Multi-Tenancy & Kubernetes)

For **enterprise scale** (hundreds of users), run several replicas behind a load balancer with Docker Compose, Docker Swarm or Kubernetes, one worker each.

For a step-by-step walkthrough of the entire scaling journey (PostgreSQL, Redis, vector DB, storage, observability), see the **[Scaling Open WebUI](/getting-started/advanced-topics/scaling)** guide.

*   **Kubernetes / Helm**: For deploying on K8s with multiple replicas, see the **[Multi-Replica & High Availability Guide](/troubleshooting/multi-replica)**.
*   **Redis (Mandatory)**: When running multiple replicas, **Redis is required** to handle WebSocket connections and session syncing. See **[Redis Integration](/tutorials/integrations/redis)**.
*   **Load Balancing**: Plain round-robin works. See [Session Affinity](/troubleshooting/multi-replica#session-affinity-sticky-sessions) for when sticky sessions help.
*   **Reverse Proxy Caching**: Configure your reverse proxy (e.g., Nginx, Caddy, Cloudflare) to **cache static assets** (JS, CSS, Images). This significantly reduces load on the application server. See **[Nginx Config](/reference/https/nginx)** or **[Caddy Config](/reference/https/caddy)**.
*   **Disable Proxy Buffering (Critical for Streaming)**: If using Nginx, you **must** disable `proxy_buffering` for Open WebUI. Proxy buffering re-chunks SSE streams, causing garbled markdown and slow streaming. Add `proxy_buffering off;` and `proxy_cache off;` to your location block. See **[Streaming Troubleshooting](/troubleshooting/connection-error#garbled-markdown--streaming-response-corruption)**.

---

## High-Concurrency & Network Optimization

For setups with many simultaneous users, these settings are crucial to prevent bottlenecks.

#### Batch Streaming Tokens
By default (`1`), Open WebUI streams *every single token* arriving from the LLM. High-frequency streaming increases network IO and CPU usage on the server.

Increasing the chunk size buffers these updates, sending them to the client in larger groups. The only downside is a slightly choppier UI experience when streaming the response, but it can make a big difference in performance.

- **Env Var**: `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE=7`
  *   *Recommendation*: Set to **5-10** for high-concurrency instances.

#### HTTP Response Compression
By default, Open WebUI compresses HTTP responses (JSON API responses and the static JS/CSS assets of the web UI) with ZStd/Brotli/Gzip inside the application itself. This costs CPU on every worker: profiling (py-spy) of production deployments shows roughly **3–4% of worker CPU time** spent in the compression middleware. Disabling it frees that CPU and slightly reduces response latency.

*   **Scope**: only regular HTTP responses larger than 500 bytes with compressible content types. WebSocket (Socket.IO) traffic and streaming chat responses (SSE) pass through uncompressed, so the chat streaming hot path is the same either way.
*   **When to disable**: Your reverse proxy / load balancer / CDN already compresses responses (preferred: enable it there and turn it off in the app), or your users reach the instance over a fast/local network where the extra transfer size doesn't matter.
*   **When to keep it on**: The backend is directly internet-facing with nothing in front of it that compresses, and users connect over slow or mobile links. Uncompressed, the first (uncached) page load transfers several megabytes more, and large payloads like long chat histories or big model lists grow 5–10×.

- **Env Var**: `ENABLE_COMPRESSION_MIDDLEWARE=false`

*   **Recommended companion**: When you disable app-side compression in favor of the proxy, also have the proxy **cache the static assets aggressively**. Open WebUI's JS/CSS bundles live under `/_app/immutable/` with content-hashed filenames, so they can be cached with `Cache-Control: public, max-age=31536000, immutable` and served from the proxy cache without ever hitting a worker, which eliminates the "larger first page load" downside for every visit after the first. See [Scaling → Pair It with Static Asset Caching at the Proxy](/getting-started/advanced-topics/scaling#pair-it-with-static-asset-caching-at-the-proxy) for a ready-made Nginx snippet.

See [`ENABLE_COMPRESSION_MIDDLEWARE`](/reference/env-configuration#enable_compression_middleware) for the full trade-off discussion.

#### Streamed Response Assembly
Open WebUI rebuilds a response's text on every chunk that arrives, copying everything received so far each time. The cost grows with the square of the answer length, and it is spent on the event loop, so one worker assembling a very long answer holds up every other stream it is serving. Growing the text in place instead removes the copying, and lowers peak memory with it, since a copy needs the old and the new string in memory at once.

- **Env Var**: `ENABLE_CHAT_RESPONSE_STREAM_INPLACE_APPEND=true`

*   *Recommendation*: turn it on wherever long answers are normal (agent transcripts, large code dumps, long tool output) and several of them stream at once. An ordinary chat answer is sub-millisecond either way, so a small instance will not notice.
*   *What you give up*: if memory runs out during an append, that one message is left empty instead of keeping the text collected so far. A container memory limit kills the process instead, so this needs an allocation to be refused, which is rare.

See [`ENABLE_CHAT_RESPONSE_STREAM_INPLACE_APPEND`](/reference/env-configuration#enable_chat_response_stream_inplace_append) for the full description.

#### WebSocket Frame Compression
The HTTP middleware above never touches WebSocket traffic, but the WebSocket server compresses frames on its own, and that is the one worth disabling under streaming load. Chat responses arrive as a very small frame per token, so each is compressed separately, for every subscriber, with almost nothing to gain at that size. Under heavy streaming this shows up as measurable worker CPU.

- **Env Var**: `UVICORN_WS_PER_MESSAGE_DEFLATE=false`

*   **What you give up**: the frames that did compress well are the rare large ones, a finished message or a set of sources, and even a very long reply is only a few hundred kilobytes uncompressed, which any network carries without a noticeable delay.
*   **Default**: enabled.

See [`UVICORN_WS_PER_MESSAGE_DEFLATE`](/reference/env-configuration#uvicorn_ws_per_message_deflate) for the full description.

#### WebSocket Heartbeats
Every connected browser tells the server it is still there on a fixed interval, thirty seconds by default. That is one small message per open tab, so an instance holding thousands of idle tabs spends real time on messages that carry nothing.

- **Env Var**: `WEBSOCKET_HEARTBEAT_INTERVAL=60`

*   **What it costs**: the server holds a presence entry for four times the interval, or 120 seconds, whichever is larger, so a user who closes their laptop shows as active for longer before dropping out of the active-user count.
*   **Range**: values are held between `5` and `90`. The setting is sent to the browser, so it applies without rebuilding the frontend.

See [`WEBSOCKET_HEARTBEAT_INTERVAL`](/reference/env-configuration#websocket_heartbeat_interval).

#### JSON Encoder

Open WebUI encodes and decodes JSON for every request body, API response, saved chat, provider request and streamed chunk, and for every Socket.IO event, including those published over Redis with multiple replicas. All of it goes through [orjson](https://pypi.org/project/orjson/), a Rust implementation several times faster than Python's standard-library `json` module.

*   **Where it matters most**: Socket.IO encoding in clustered deployments, parsing of streamed chunks, and saving and opening long chats.
*   **Where it does not**: a single-user instance with ordinary-sized chats.
*   **Fallback**: anything orjson cannot encode falls back to the standard library. One difference: `NaN` and `Infinity` floats serialize as `null`; the standard library raises an error.

- **Env Var**: `ENABLE_ORJSON=True`
  *   *Recommendation*: leave it on.

See [Multi-Replica → Use the Faster JSON Encoder](/troubleshooting/multi-replica#use-the-faster-json-encoder) for the full breakdown, and [`ENABLE_ORJSON`](/reference/env-configuration#enable_orjson) for the variable itself.

#### Log Level

Messages the level filters out are never built, so raising it saves CPU as well as log volume, most on busy servers and on chats drawing from a large knowledge base. `WARNING` also drops the `INFO` lines recording startup, key events and request handling, so keep `INFO` if your log aggregator relies on them.

- **Env Var**: `GLOBAL_LOG_LEVEL=WARNING`
  *   *Recommendation*: try it on a busy instance that does not depend on the `INFO` lines. Never leave `DEBUG` on in production, it is the most expensive level to run. Requires a restart.

See [What the Log Level Costs](../getting-started/advanced-topics/logging.md#what-the-log-level-costs) for the full explanation.

#### Thread Pool Size
Caps how many **concurrent** blocking operations (sync DB calls, file I/O, sync route handlers and other work offloaded to a thread) may run at once. It is a ceiling, not a pre-spawned pool: threads are created lazily and reused, so a high value costs nothing while idle.
*   **Default**: unset, so the AnyIO limit of 40 applies. That is far too low for production.
*   **Servers**: `2000` or higher. Never go below the default.
*   **Symptom if too low**: further requests queue and the **whole app appears to hang** while CPU and RAM look fine.
*   **Weak hardware** (Raspberry Pi, tiny VPS, containers capped at about 250m CPU or very little RAM): keep the default or a few hundred. Each concurrent blocking operation uses a real OS thread with its own stack, so a huge ceiling lets a traffic burst exhaust RAM.

- **Env Var**: `THREAD_POOL_SIZE=2000`

See [`THREAD_POOL_SIZE`](/reference/env-configuration#thread_pool_size).

#### AIOHTTP Client Timeouts
Requests to model providers have no total timeout by default, so a long completion is never cut off. Model list requests time out after 10 seconds.

- **Env Var**: `AIOHTTP_CLIENT_TIMEOUT` (unset by default). Set it, for example to `1800`, to bound how long a hung provider can hold a request.
- **Env Var**: `AIOHTTP_CLIENT_STREAM_IDLE_TIMEOUT` (unset by default). Ends a request after this many seconds without new data from the provider, while a long stream that keeps producing output runs on.
- **Env Var**: `AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST` (default `10`). Raise it for slow providers that list hundreds of models.

#### DNS Resolver

By default Open WebUI asks the operating system to resolve hostnames, and those lookups queue behind each other and behind other background work, so under load a lookup that should take milliseconds delays the request it belongs to. The c-ares resolver does not queue, so many simultaneous lookups take about as long as one. The win is largest on instances making many outbound requests at once and invisible on a quiet one.

- **Env Var**: `AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER=True`
  *   *Recommendation*: try it, then exercise your models, web search and any internal services and switch it back off if lookups start failing. Requires a restart.

c-ares reads fewer name sources than the operating system does, so read [`AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER`](../reference/env-configuration.mdx#aiohttp_client_async_dns_resolver) before leaving it on. See [Intermittent Name Lookup Failures](./connection-error.mdx#intermittent-name-lookup-failures-often-reported-as-model-not-found) if you are debugging lookups that fail on and off.

#### Container Resource Limits
For Docker deployments, ensure adequate resource allocation:

```yaml
deploy:
  resources:
    limits:
      memory: 8G      # Adjust based on usage
      cpus: '4.0'
    reservations:
      memory: 4G
      cpus: '2.0'

# Increase file descriptor limits
ulimits:
  nofile:
    soft: 65536
    hard: 65536
```

**Diagnosis commands:**
```bash
# Check container resource usage
docker stats openwebui --no-stream

# Check connection states
docker exec openwebui netstat -an | grep -E "ESTABLISHED|TIME_WAIT|CLOSE_WAIT" | sort | uniq -c

# Check open file descriptors
docker exec openwebui ls -la /proc/1/fd | wc -l
```

---


## Cloud Infrastructure Latency

When deploying Open WebUI in cloud Kubernetes environments (AKS, EKS, GKE), you may notice significant performance degradation compared to local Kubernetes (Rancher Desktop, kind, Minikube) or bare-metal deployments, even with identical resource allocations. This is almost always caused by **latency** in the underlying infrastructure.

### Network Latency (Database & Services)

The most common cause of cloud performance issues is **network latency between Open WebUI and its database**.

Many cloud deployments place the database on a separate node, availability zone, or even a managed database service. While this is architecturally sound, it introduces latency to *every single database query*. Open WebUI makes multiple database calls per request, so even 10-20ms of network latency per query can compound into multi-second response times under concurrent load.

**Symptoms:**
- Health check endpoints show high response times instead of being near-instant.
- Simple API calls or normal chat completions become sluggish under concurrent load, even when CPU and Memory usage appear low.
- Significant performance gap between local development/testing and cloud production environments.

**Diagnosis:**
- Check network latency between your Open WebUI pod and your database. From within the pod:
  ```bash
  # For PostgreSQL
  psql -h <db-host> -U <user> -c "SELECT 1" -d <database>
  
  # Or use ping/nc to check raw latency
  nc -zv <db-host> 5432
  ```
- **Ideal Latency Target:** You should aim for **1-2ms or lower** for database queries. If network latency to your database exceeds **5ms**, it is highly not recommended for production deployments and will likely be your primary performance bottleneck.

**Solutions:**
1. **Co-locate services:** Deploy Open WebUI and PostgreSQL in the same availability zone, or even on the same node pool if possible, to minimize network hops.
2. **Managed DB Consideration:** Note that "one-click" managed database solutions in the cloud, while scalable, often introduce significant network latency compared to a self-hosted DB on the same node. This tradeoff must be carefully considered.
3. **Enable caching:** Use `ENABLE_BASE_MODELS_CACHE=True` and the other [caching options](#2-caching--latency-optimization) to cut repeated work per request.
4. **Reduce database writes:** Keep [`DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL`](#user-active-status-write-throttling-set-this-on-every-deployment) at `60` or higher.

### Disk I/O Latency (SQLite & Storage)

If you're using **SQLite** (the default) in a cloud environment, you may be trading network latency for **disk latency**.

Cloud storage (Azure Disks, AWS EBS, GCP Persistent Disks) often has significantly higher latency and lower IOPS than local NVMe/SSD storage, especially on lower-tier storage classes. 

:::danger SQLite on NFS / SMB / Azure Files Is Not Supported, by SQLite Itself
This restriction does **not** come from Open WebUI. It comes from **SQLite upstream**. The SQLite project [officially states](https://www.sqlite.org/faq.html#q5) that SQLite databases on network filesystems (NFS, SMB/CIFS, and similar) are **not supported**: file locking over those protocols is unreliable, and concurrent writers **can corrupt the database**. The SQLite documentation explicitly warns against it, and Open WebUI inherits that constraint because it uses SQLite.

As a consequence, for Open WebUI the **only supported storage configurations are**:

- **PostgreSQL**: recommended for any multi-user deployment and required for anything not on a directly-attached local SSD. This sidesteps the SQLite-on-network-storage problem entirely. **Or**
- **SQLite on a directly-attached SSD / NVMe**: single-user / small deployments only. Must be a **local** disk on the host; SQLite upstream's guidance applies regardless of the application.

**Not supported** for SQLite (per SQLite's own documentation, not an Open WebUI policy): **NFS, SMB/CIFS, Azure Files, GlusterFS, CephFS, object-storage-backed FUSE mounts, network PVCs, any remote or low-IOPS storage.** This includes Docker bind mounts and Kubernetes PersistentVolumeClaims backed by those filesystems. Beyond the performance symptoms below, you are risking **database corruption**, again, per SQLite, not us.

If your storage is anything other than a local SSD/NVMe, **use PostgreSQL**.

Typical symptoms of SQLite on network storage:

- `/api/config` takes **10 to 20+ seconds** on every request
- `/api/v1/chats/?page=1` and other list endpoints stall for **minutes** under load
- OIDC / SSO callbacks hang or "spin" when redirecting back to Open WebUI
- Large (multi-second) gaps in DEBUG logs between `aiosqlite` and `httpcore` lines
- `PRAGMA journal_mode=WAL` starts but never completes in logs
:::

#### Why the async backend makes network-storage SQLite fail suddenly

Open WebUI runs its database calls asynchronously, so many of them are in flight at once. On slow storage they pile up until the app stops responding. `DATABASE_POOL_SIZE` and similar settings treat the symptom; the storage is the cause.

**The core thing is `fsync()`.** SQLite guarantees durability with synchronous flushes to disk (with the default WAL mode and `synchronous=NORMAL`, at each checkpoint). `fsync` latency depends entirely on where the file lives:

| Storage | Typical `fsync` latency |
| :--- | :--- |
| Local NVMe | ~100 μs |
| Local SATA SSD | 100 μs to a few ms |
| Local HDD | ~10 ms |
| NFS / CephFS / Azure Files (SSD-backed) | 50 to 500 ms |
| NFS (HDD-backed or high-latency) | hundreds of ms to multiple seconds |

**Concurrency multiplies it.** Each database call checks out a connection from the SQLite pool (512 connections when `DATABASE_POOL_SIZE` is unset, plus 10 overflow). On local SSD a connection is back in the pool within about a millisecond. On NFS or CephFS it stays checked out for hundreds of milliseconds per flush, writers queue on the file lock, and requests pile up. Once the pool is exhausted, each further request waits `DATABASE_POOL_TIMEOUT` (30 s) and fails with:

```
sqlalchemy.exc.TimeoutError: QueuePool limit of size 512 overflow 10 reached,
connection timed out, timeout 30.00
```

A bigger pool only moves the breaking point: more connections mean more concurrent slow flushes against the same storage.

**And WAL over NFS is specifically broken.** SQLite's WAL mode uses an `mmap`-backed `-shm` file for cross-process coordination. [SQLite upstream says plainly](https://www.sqlite.org/faq.html#q5) that `mmap` on NFS is unreliable: some NFS versions don't support it at all. Under concurrency you hit actual locking pathologies (deadlocks, `PRAGMA journal_mode=WAL` that starts and never completes, multi-minute stalls on trivial queries).

**Why Postgres is the fix:** the Postgres server manages its own I/O concurrency against its own local storage. Your app reaches it over a network socket, a hop orders of magnitude cheaper than an NFS `fsync`, and Postgres is built for concurrent writers: no file-level locking, no cross-process `mmap` coordination, no WAL-on-network-FS caveats. Open WebUI talks to it through the async `psycopg` driver.

**Symptoms:**
- Performance is acceptable with a single user but degrades rapidly as concurrency increases.
- High "I/O Wait" on the server despite low CPU usage.

**Solutions (in order of robustness):**

1. **Best, migrate to PostgreSQL.** This is the recommended fix for any deployment that is not strictly single-user on a local disk, and it is required for any deployment on remote / network / low-IOPS storage. Set:
   ```bash
   DATABASE_URL=postgresql://user:password@host:5432/webui
   ```
2. **Acceptable, move `webui.db` onto directly-attached local SSD/NVMe.** Only appropriate for single-user or very small deployments. Bind-mount a directory on the host's **local** SSD/NVMe into `/app/backend/data`. Never use NFS, SMB, Azure Files or any other network-backed storage class for it.
3. **Temporary workaround only, keep SQLite on NFS with reduced concurrency.** If you cannot immediately move storage or switch databases, set:
   ```bash
   DATABASE_POOL_SIZE=1
   DATABASE_SQLITE_PRAGMA_BUSY_TIMEOUT=30000
   ```
   `DATABASE_POOL_SIZE=1` shrinks the SQLite pool to one connection plus 10 overflow, so far fewer writers hit the storage at once, trading concurrency for stability. `DATABASE_SQLITE_PRAGMA_BUSY_TIMEOUT=30000` gives SQLite 30 seconds to acquire locks, which NFS can take much longer to grant than local disk. This is **not a supported long-term configuration**: expect degraded throughput, intermittent stalls, and potential corruption. Plan to migrate to PostgreSQL or local SSD as soon as possible. A warm pool may briefly appear fine after restart, but the problem returns under load.
4. **Cloud block storage:** When using cloud block storage for the Open WebUI data volume (for PostgreSQL or the application itself), use SSD-backed **Block Storage** classes (e.g., `Premium_LRS` on Azure Disks, `gp3` on AWS EBS, `pd-ssd` on GCP). Avoid "File" based storage classes (like `azurefile-csi`) for any database workload, including SQLite.

### Other Cloud-Specific Considerations

| Factor | Impact | Mitigation |
|--------|--------|------------|
| **Burstable VMs** (e.g., Azure B-series, AWS T-series) | CPU throttling under sustained load, even at low reported usage | Use standard/compute-optimized node pools |
| **DNS Resolution** | CoreDNS overhead on every external request | Ensure CoreDNS is properly scaled; consider node-local DNS cache |
| **Service Mesh Sidecars** | Istio/Linkerd proxies add latency to every request | Check for unexpected sidecar containers in your pods |
| **Network Policies** | CNI processing overhead | Audit and simplify network policies if possible |
| **Cross-Zone Traffic** | Latency + egress costs when services span zones | Pin services to the same availability zone |

---

## Resource Efficiency (Reducing RAM)

If deploying on memory-constrained devices (Raspberry Pi, small VPS), use these strategies to prevent the application from crashing due to OOM (Out of Memory) errors.

### The Slim Image

If your models, embeddings, document extraction and speech run as external services, use the slim image: `ghcr.io/open-webui/open-webui:slim` (also `:main-slim`, or `:<version>-slim` to pin a release). It is the standard image built with `USE_SLIM=true`, which:

- installs a reduced Python dependency set: no PyTorch, SentenceTransformers, Transformers or faster-whisper, no vector database client besides pgvector, no Playwright, no local PDF and Office parsers and no Azure or Google Cloud storage SDKs
- skips the pandoc, ffmpeg, git and compiler system packages
- bakes in no models (the standard image ships the embedding model, the auxiliary embedding model, Whisper `base` and the tiktoken encoding)
- ships the code interpreter's Pyodide runtime without its Python packages

**Effect:** the amd64 download is about 200 MB against about 1.6 GB for the standard image. No local model or ML library is ever loaded, so memory stays at the app's own baseline whichever features you enable, and extra replicas add no model copies. See [RAM usage](/getting-started/quick-start#slim-memory-usage) for a measured idle figure.

**Settings that matter on slim:**

| Feature | Setting |
|---|---|
| Embeddings | `RAG_EMBEDDING_ENGINE=openai`, `azure_openai` or `ollama`. The local engine is unavailable |
| Vector database | `VECTOR_DB` defaults to `pgvector`. Set `PGVECTOR_DB_URL`, or use a PostgreSQL `DATABASE_URL` with the pgvector extension. Other stores fail on first use |
| Documents | `CONTENT_EXTRACTION_ENGINE` for PDFs and Office files. Text, Markdown, CSV, HTML and XML are read in-process |
| Reranking | `RAG_RERANKING_ENGINE=external`, or leave the reranking model empty for cosine scoring |
| Speech | An external `AUDIO_STT_ENGINE`, or `web` for browser recognition. An external `AUDIO_TTS_ENGINE`, or the default browser voice. `BYPASS_PYDUB_PREPROCESSING` is always on |
| Database and files | `DATABASE_URL` on SQLite or PostgreSQL, `STORAGE_PROVIDER=local` or `s3`. Anything else stops startup |

Two things are downloaded at runtime instead of shipped: the tiktoken encoding, on first use of the `token` text splitter (cached in `TIKTOKEN_CACHE_DIR`), and the code interpreter's Python packages, which the browser fetches from `cdn.jsdelivr.net`. See [Why choose slim?](/getting-started/quick-start#what-slim-leaves-out) for the full feature table.

### 1. Offload Auxiliary Models (Local Deployments Only)

On the standard image, Open WebUI can run models for RAG and speech inside its own process. **This section is only relevant if you run them locally.**

#### RAG Embeddings
-   **Low-Spec Recommendation**:
    *   **Option A (Easiest)**: Keep the default **SentenceTransformers** (all-MiniLM-L6-v2). It is lightweight, runs on CPU, and is significantly more efficient than running a full Ollama instance on the same Raspberry Pi.
    *   **Option B (Best Performance)**: Use an **External API** (OpenAI/Cloud).

-   **Configuration**:
    *   **Admin Panel**: `Settings > Admin > Documents > Embedding Model Engine`
    *   **Env Var**: `RAG_EMBEDDING_ENGINE=openai` (to offload completely)

#### Speech-to-Text (STT)
The default engine is local Whisper, which loads into the Open WebUI process on the first transcription and stays there.

-   **Recommendation**: Use **Web API** (browser-based). It uses the user's device, costing no server RAM.
-   **Configuration**:
    *   **Admin Panel**: `Settings > Admin > Audio > STT Engine`
    *   **Env Var**: `AUDIO_STT_ENGINE=web`

-   **Bypass Audio Preprocessing (offload to the STT provider)**: If you use an external STT engine (OpenAI, Deepgram, Azure, Mistral) that already accepts raw audio and handles format conversion on its side, set `BYPASS_PYDUB_PREPROCESSING=true`. This skips Open WebUI's pydub-based MP3 conversion, compression and chunk splitting, removing a CPU-heavy step on every upload and reducing latency on large files. Only enable it when you are confident the provider handles unprocessed audio correctly.

### 2. Disable Unused Features

On the standard image, these load a local model into the Open WebUI process. Leave them off or point them at an external service:

-   **Reranking**: with hybrid search on (`ENABLE_RAG_HYBRID_SEARCH=True`) and a `RAG_RERANKING_MODEL` on the local engine, every worker loads the reranking model at startup. Use `RAG_RERANKING_ENGINE=external`, or leave the model empty.
-   **Local text-to-speech**: `AUDIO_TTS_ENGINE=transformers` loads a speech model on first use. Pick an external engine.

Image generation and the code interpreter run on external engines or in the browser, so they hold no model in server memory.

### 3. Disable Background Tasks

If resource usage is critical, disable automated features that constantly trigger model inference.

**Recommendation order (Highest Impact first):**

1.  **Autocomplete**: `ENABLE_AUTOCOMPLETE_GENERATION=False` (the default; keep it off, it triggers on every keystroke)
    *   Admin: `Settings > Admin > Interface > Autocomplete`
2.  **Follow-up Questions**: `ENABLE_FOLLOW_UP_GENERATION=False`
    *   Admin: `Settings > Admin > Interface > Follow-up`
3.  **Title Generation**: `ENABLE_TITLE_GENERATION=False`
    *   Admin: `Settings > Admin > Interface > Chat Title`
4.  **Tag Generation**: `ENABLE_TAGS_GENERATION=False`

### 4. Swap ChromaDB for Milvus Lite (Small Deployments)

On a Raspberry Pi or a small VPS, the default local ChromaDB is usually the largest thing in the process after the models. Milvus Lite is an embedded database like ChromaDB, needs no server and no extra container, and holds the same content in noticeably less disk and less resident memory. Read the limit below before switching, because it rules out any deployment that ingests documents in bulk.

:::danger Not for bulk document ingestion

The disk and memory saving only pays off on a knowledge base that is small and stays roughly the same size. If you plan to upload a large corpus, or to keep adding files over time, stay on ChromaDB or use a Milvus server.

Open WebUI looks up the content hash of a file before storing it, so that the same document is not indexed twice. That lookup filters on a metadata field, and Milvus Lite keeps no index on metadata, so it reads the entire collection every time. Adding one file therefore costs more the more you already have stored, and the time to ingest a whole corpus grows with the square of its size.

Measured against a local Milvus Lite database using Open WebUI's own collection schema, a single hash lookup takes:

| Rows in the collection | Time for one lookup |
| --- | --- |
| 500 | 0.72s |
| 1,000 | 1.43s |
| 2,000 | 2.94s |
| 3,000 | 4.51s |
| 4,000 | 7.94s |

The same lookup on ChromaDB stays flat at every size (0.024s at 500 rows, 0.002s at 4,000), because ChromaDB keeps metadata in SQLite with an index on it.

End to end on the same machine, the same settings and the same embedding provider, ingesting markdown files ran at 8 files per minute on Milvus Lite and fell below 5 as the collection grew, against 200 to 368 files per minute on ChromaDB. Extrapolating the measured per-row cost, a 28,000 file corpus would take roughly 170 hours on Milvus Lite.

This concerns ingestion. Search performance was not measured, and neither was a Milvus server, which is a different deployment from the embedded Milvus Lite described here.

:::

The saving comes from multitenancy, so enable it together with the switch:

```
VECTOR_DB=milvus
ENABLE_MILVUS_MULTITENANCY_MODE=True
```

Leave `MILVUS_URI` unset. The default already points at the embedded database inside your data directory, and setting the variable to that path stops the application from starting. See [`MILVUS_URI`](/reference/env-configuration#milvus_uri-required) for why, and for the directory that has to exist first.

With multitenancy on, users share one set of collections and each user's vectors are partitioned inside them. Without it, every user and every knowledge base gets its own collection, which is what makes the footprint grow far faster than the content does. On a device where storage is small or billed, this is usually the single biggest reduction available after offloading the embedding model.

This applies to single-instance deployments. Milvus Lite is a file held by one process, so adding replicas requires a Milvus server instead.

### 5. SQLite Memory Footprint on Constrained Containers

This RAM problem applies **even on fast local SSD/NVMe** (for the latency and corruption problem on network storage, see [Disk I/O Latency](#disk-io-latency-sqlite--storage)). It is the most common cause of "the container gets OOM-killed when I edit model or knowledge-base permissions" on small deployments.

On SQLite, when `DATABASE_POOL_SIZE` is unset or `0`, the pool holds up to **512** connections plus 10 overflow. `DATABASE_POOL_MAX_OVERFLOW` has no effect on SQLite. Each pooled connection independently:

- lazily grows its **own** SQLite page cache up to the `DATABASE_SQLITE_PRAGMA_CACHE_SIZE` cap. The default `-65536` is roughly **64 MB of committed RAM per connection**.
- memory-maps the database file up to `DATABASE_SQLITE_PRAGMA_MMAP_SIZE`, default **256 MB per connection**. This is mostly virtual and file-backed, but it inflates `total-vm` and the resident portion counts against a cgroup memory limit.
- runs on its **own OS thread** (the async SQLite driver uses one thread per connection), adding thread-stack memory.

Peak memory therefore scales with the number of **simultaneously active connections**. A workflow that fans out many short-lived connections, for example editing model or knowledge-base access control and then reloading a long model list, can briefly drive dozens of connections live. On a small container the page caches alone (active connections times up to 64 MB) exceed the limit and the OOM killer terminates the process. A profiler (py-spy, memray) attributes almost everything to `aiosqlite/core.py`, where each connection allocates its cache and materialises rows. That is the signature of many connections, unrelated to any remote vector database.

:::tip Constrained / Low-Spec Containers (SQLite)
On any deployment with a tight memory limit (small VPS, Raspberry Pi, a Docker `mem_limit` of 1 to 2 GB), set these explicitly:

```bash
DATABASE_POOL_SIZE=8                       # 8 connections plus 10 overflow instead of 512 plus 10
DATABASE_SQLITE_PRAGMA_CACHE_SIZE=-2000    # ~2 MB page cache per connection instead of ~64 MB
DATABASE_SQLITE_PRAGMA_MMAP_SIZE=0         # disable the per-connection mmap window
```

Also give the container realistic headroom. **1 GB is very low** for anything doing RAG or embeddings; aim for **2 GB or more**. Keep `DATABASE_ENABLE_SESSION_SHARING=False` (the default) on low-spec hardware (see [Database Session Sharing](#database-session-sharing)).

For multi-user or growing deployments the durable fix is **PostgreSQL**.
:::

### 6. Large Document Uploads

Processing a document holds its chunks and their embeddings in memory while they are written to the vector database.

-   **Env Var**: `RAG_EMBEDDING_BUFFER_SIZE` (default `1000`). Chunks are embedded and saved in steps of this many, so a very large document never holds all its embeddings at once. Lower it to cut the peak on small devices. See [`RAG_EMBEDDING_BUFFER_SIZE`](/reference/env-configuration#rag_embedding_buffer_size).
-   **Env Var**: `RAG_FILE_MAX_SIZE` (in MB, unset by default). Rejects larger uploads before they are extracted and embedded. See [`RAG_FILE_MAX_SIZE`](/reference/env-configuration#rag_file_max_size).

---

## Recommended Configuration Profiles

### Profile 1: Maximum Privacy (Weak Hardware/RPi)
*Target: 100% Local, Raspberry Pi / &lt;4GB RAM.*

1.  **Embeddings**: Default (SentenceTransformers). *Runs on CPU, lightweight.*
2.  **Audio**: `AUDIO_STT_ENGINE=web`. *Zero server load.*
3.  **Task Model**: Disable, or use a tiny model (`qwen3.5:0.8b`).
4.  **Scaling**: Keep default `THREAD_POOL_SIZE` (40).
5.  **Disable**: Follow-ups, local reranking and local text-to-speech. Keep Autocomplete off (the default).
6.  **Database**: SQLite is fine, but cap its memory: `DATABASE_POOL_SIZE=8`, `DATABASE_SQLITE_PRAGMA_CACHE_SIZE=-2000`, `DATABASE_SQLITE_PRAGMA_MMAP_SIZE=0`. The unset SQLite pool default is large (512); see [SQLite Memory Footprint on Constrained Containers](#5-sqlite-memory-footprint-on-constrained-containers).

### Profile 2: Single User Enthusiast
*Target: Max Quality & Speed, Local + External APIs.*

1.  **Embeddings**: `RAG_EMBEDDING_ENGINE=openai` (or `ollama` with `nomic-embed-text` on a fast server).
2.  **Task Model**: `gpt-5.6-luna` or `gemini-3.5-flash-lite`.
3.  **Caching**: `MODELS_CACHE_TTL=300`.
4.  **Vector DB**: PGVector (recommended) or ChromaDB (either is fine unless dealing with massive data).

### Profile 3: High Scale / Enterprise
*Target: Many concurrent users, Stability > Persistence.*

1.  **Database**: **PostgreSQL** (Mandatory).
2.  **Content Extraction**: **Tika**, **Docling**, **or any other external document loader** (Mandatory: default pypdf leaks memory). See [Content Extraction Engine](#content-extraction-engine).
3.  **Embeddings**: **External**: `RAG_EMBEDDING_ENGINE=openai`, `azure_openai` or `ollama` (Mandatory: default SentenceTransformers consumes too much RAM at scale). See [Embedding Engine](#embedding-engine).
4.  **Tool Calling**: **Native Mode** (the default; Legacy Mode is unsupported and breaks KV cache). All models should be configured for Native Mode. See [Tool Calling Modes](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native).
5.  **Thread Pool**: `THREAD_POOL_SIZE=2000` (Prevent timeouts).
6.  **Streaming**: `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE=7` (Reduce CPU and network load).
7.  **Image**: `:slim` when the vector DB is PGVector. Everything in this profile runs as an external service, so the local model stack in the standard image goes unused. See [The Slim Image](#the-slim-image).
8.  **Vector DB**: **Milvus**, **Qdrant**, or **PGVector**. **Do not use ChromaDB's default local mode**: its SQLite backend will crash under multi-replica access.
9.  **Task Model**: External/Hosted (Offload compute).
10. **Caching**: `ENABLE_BASE_MODELS_CACHE=True`, `MODELS_CACHE_TTL=300`, `ENABLE_QUERIES_CACHE=True`.
11. **Redis**: Single instance with `timeout 1800` and high `maxclients` (10000+). See [Redis Tuning](#redis-tuning) below.
12. **Compression**: `ENABLE_COMPRESSION_MIDDLEWARE=False` **if** your load balancer / ingress / CDN compresses responses (enable it there instead). Saves ~3–4% CPU on every worker. See [HTTP Response Compression](#http-response-compression).
13. **WebSocket Heartbeats**: `WEBSOCKET_HEARTBEAT_INTERVAL=60`. Halves the idle heartbeat traffic from every open tab, at the cost of a disconnected user lingering in the active count. See [WebSocket Heartbeats](#websocket-heartbeats).
14. **WebSocket Compression**: `UVICORN_WS_PER_MESSAGE_DEFLATE=false`. Streaming sends one tiny frame per token, and compressing each of them costs CPU per subscriber for almost no saving. See [WebSocket Frame Compression](#websocket-frame-compression).
15. **JSON Encoder**: `ENABLE_ORJSON=True`, on by default; leave it on. Cuts the cost of the heaviest JSON work in a clustered deployment: encoding Socket.IO events, parsing streamed provider chunks and saving and opening whole chats. See [JSON Encoder](#json-encoder).

#### Redis Tuning

A single Redis instance is sufficient for the vast majority of deployments, including those with thousands of users. **You almost certainly do not need Redis Cluster or Redis Sentinel** unless you have specific HA requirements.

Each worker also keeps the parsed model list it reads from Redis for filter lookups, which takes about 3 MB of memory per worker for every 1000 models.

A response being streamed is held in Redis so a browser that reconnects can resume it, and the entry is deleted when the response finishes. Entries left behind by a worker killed mid-stream expire after `REDIS_RESPONSE_STREAM_TTL` seconds (default `3600`). Lower it where Redis memory is tight; `0` keeps them forever. See [`REDIS_RESPONSE_STREAM_TTL`](/reference/env-configuration#redis_response_stream_ttl).

Common Redis configuration issues that cause unnecessary scaling:

| Issue | Symptom | Fix |
|---|---|---|
| **Stale connections** | Redis runs out of connections or memory grows indefinitely | Set `timeout 1800` in redis.conf (kills idle connections after 30 minutes) |
| **Low maxclients** | `max number of clients reached` errors | Set `maxclients 10000` or higher |
| **No connection limits** | Open WebUI pods may accumulate connections that never close | Combine `timeout` with connection pool limits in your Redis client config |
| **Low Pub/Sub output buffer limits** | WebSocket streams stall, `Cannot publish to redis... giving up`, or Redis logs client output buffer disconnections when large Socket.IO events are published | Increase the Redis `client-output-buffer-limit ... pubsub ...` setting, sized for your websocket payloads and available Redis memory |

For the Pub/Sub output buffer limit, including the commands to inspect it and an example configuration, see [WebSocket Pub/Sub Buffer Limits](/tutorials/integrations/redis#websocket-pubsub-buffer-limits).

---

## Common Anti-Patterns

These are real-world mistakes that cause organizations to massively over-provision infrastructure:

| Anti-Pattern | What Happens | Fix |
|---|---|---|
| **Using default content extractor in production** | pypdf leaks memory → containers restart constantly → you add more replicas to compensate | Switch to Tika or Docling (`CONTENT_EXTRACTION_ENGINE=tika`) |
| **Running SentenceTransformers at scale** | Each worker loads PyTorch and its own copy of the embedding model → RAM usage explodes → you add more machines | Use external embeddings (`RAG_EMBEDDING_ENGINE=openai`, `azure_openai` or `ollama`), or the [slim image](#the-slim-image) |
| **Redis Cluster when single Redis suffices** | Too many replicas → too many connections → Redis can't handle them → you deploy Redis Cluster to compensate | Fix the root cause (fewer replicas, `timeout 1800`, `maxclients 10000`) |
| **Scaling replicas to mask memory leaks** | Leaky processes → OOM kills → auto-scaler adds more pods → more Redis connections → Redis overwhelmed | Fix the leaks first (content extraction, embedding engine), then right-size |
| **Using Legacy (prompt-based) tool calling** | Legacy mode is unsupported; injected prompts break KV cache → higher latency → more resources needed per request; cannot access built-in system tools | Switch every model to Native Mode |
| **Not configuring Redis stale connection timeout** | Connections accumulate forever → Redis OOM → you deploy Redis Cluster | Add `timeout 1800` to redis.conf |
| **Using base64-encoded icons in Actions/Filters** | Icon data is embedded in `/api/models` responses sent to the frontend on every page load for every model. A 500 KB base64 icon on 3 actions across 20 models = **30 MB of payload bloat** per request → slow frontend loads, high bandwidth usage, unnecessary backend memory pressure | Host icons as static files and reference them by URL in `icon_url` / `self.icon`. See [Action Function icon_url warning](/features/extensibility/plugin/functions/action#example-specifying-action-frontmatter) |
| **Running SQLite with the default pool on a tiny container** | Unset `DATABASE_POOL_SIZE` falls back to a pool of 512 connections plus 10 overflow; each connection grows its own ~64 MB page cache plus a 256 MB mmap window, so a connection-fanning workflow (editing model/KB permissions, reloading a long model list) OOM-kills a 1 GB container | Cap `DATABASE_POOL_SIZE` (e.g. `8`), set `DATABASE_SQLITE_PRAGMA_CACHE_SIZE=-2000` and `DATABASE_SQLITE_PRAGMA_MMAP_SIZE=0`, give the container ≥ 2 GB. See [SQLite Memory Footprint](#5-sqlite-memory-footprint-on-constrained-containers) |
| **Leaving `GLOBAL_LOG_LEVEL=DEBUG` on in production** | Set once to chase a problem and never set back. `DEBUG` is the most expensive level to run: every message it adds is genuinely built and written, whole chat request payloads included, on every request → wasted CPU on top of the log volume, and prompts and user content sitting in your logs | Set it back to `INFO` (the default), or `WARNING` on a busy instance that does not consume the informational lines. Requires a restart. See [Log Level](#log-level) |

---

## Environment Variable References

For detailed information on all available variables, see the [Environment Configuration](/reference/env-configuration) guide.

| Variable | Description & Link |
| :--- | :--- |
| `TASK_MODEL` | [Task Model (Local)](/reference/env-configuration#task_model) |
| `TASK_MODEL_EXTERNAL` | [Task Model (External)](/reference/env-configuration#task_model_external) |
| `TASK_MODEL_PARAMS` | [Task Model Parameters](/reference/env-configuration#task_model_params) |
| `ENABLE_BASE_MODELS_CACHE` | [Cache Model List](/reference/env-configuration#enable_base_models_cache) |
| `MODELS_CACHE_TTL` | [Model Cache TTL](/reference/env-configuration#models_cache_ttl) |
| `ENABLE_QUERIES_CACHE` | [Queries Cache](/reference/env-configuration#enable_queries_cache) |
| `DATABASE_URL` | [Database URL](/reference/env-configuration#database_url) |
| `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE` | [Streaming Chunk Size](/reference/env-configuration#chat_response_stream_delta_chunk_size) |
| `ENABLE_COMPRESSION_MIDDLEWARE` | [HTTP Response Compression](/reference/env-configuration#enable_compression_middleware) |
| `ENABLE_ORJSON` | [JSON Encoder](/reference/env-configuration#enable_orjson) |
| `GLOBAL_LOG_LEVEL` | [Log Level](/reference/env-configuration#global_log_level) |
| `THREAD_POOL_SIZE` | [Thread Pool Size](/reference/env-configuration#thread_pool_size) |
| `AIOHTTP_CLIENT_TIMEOUT` | [HTTP Client Timeout](/reference/env-configuration#aiohttp_client_timeout) |
| `AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER` | [DNS Resolver](/reference/env-configuration#aiohttp_client_async_dns_resolver) |
| `RAG_EMBEDDING_ENGINE` | [Embedding Engine](/reference/env-configuration#rag_embedding_engine) |
| `CONTENT_EXTRACTION_ENGINE` | [Content Extraction Engine](/reference/env-configuration#content_extraction_engine) |
| `AUDIO_STT_ENGINE` | [STT Engine](/reference/env-configuration#audio_stt_engine) |
| `BYPASS_PYDUB_PREPROCESSING` | [Bypass pydub audio preprocessing](/reference/env-configuration#bypass_pydub_preprocessing) |
| `RAG_RERANKING_ENGINE` | [Reranking Engine](/reference/env-configuration#rag_reranking_engine) |
| `RAG_EMBEDDING_BUFFER_SIZE` | [Embedding Buffer Size](/reference/env-configuration#rag_embedding_buffer_size) |
| `VECTOR_DB` | [Vector Database](/reference/env-configuration#vector_db) |
| `ENABLE_AUTOCOMPLETE_GENERATION` | [Autocomplete](/reference/env-configuration#enable_autocomplete_generation) |
| `DATABASE_ENABLE_SESSION_SHARING` | [Database Session Sharing](/reference/env-configuration#database_enable_session_sharing) |
| `DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL` | [Presence Write Throttling](/reference/env-configuration#database_user_active_status_update_interval) |
| `DATABASE_POOL_SIZE` | [Connection Pool Size](/reference/env-configuration#database_pool_size) |
| `DATABASE_SQLITE_PRAGMA_CACHE_SIZE` | [SQLite Page Cache Size](/reference/env-configuration#database_sqlite_pragma_cache_size) |
| `DATABASE_SQLITE_PRAGMA_MMAP_SIZE` | [SQLite mmap Size](/reference/env-configuration#database_sqlite_pragma_mmap_size) |

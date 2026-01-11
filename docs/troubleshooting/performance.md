---
sidebar_position: 15
title: "Optimization, Performance & RAM Usage"
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
    *   *Strategy*: Requires dedicated Vector DBs (Milvus/Qdrant), increased thread pools, caching to handle load, and **PostgreSQL** instead of SQLite.

---

## ⚡ Performance Tuning (Speed & Responsiveness)

If Open WebUI feels slow or unresponsive, especially during chat generation or high concurrency, specialized optimizations can significantly improve the user experience.

### 1. Dedicated Task Models

By default, Open WebUI automates background tasks like title generation, tagging, and autocomplete. These run in the background and can slow down your main chat model if they share the same resources.

**Recommendation**: Use a **very fast, small, and cheap NON-REASONING model** for these tasks. Avoid using large reasoning models (like o1, r1, or Claude) as they are too slow and expensive for simple background tasks.

**Configuration:**
There are two separate settings in **Admin Panel > Settings > Interface**. The system intelligently selects which one to use based on the model you are currently chatting with:
*   **Task Model (External)**: Used when you are chatting with an external model (e.g., OpenAI).
*   **Task Model (Local)**: Used when you are chatting with a locally hosted model (e.g., Ollama).

**Best Options (2025):**
*   **External/Cloud**: `gpt-5-nano`, `gemini-2.5-flash-lite`, `llama-3.1-8b-instant` (OpenAI/Google/Groq/OpenRouter).
*   **Local**: `qwen3:1b`, `gemma3:1b`, `llama3.2:3b`.

### 2. Caching & Latency Optimization

Configure these settings to reduce latency and external API usage.

#### Model Caching
Drastically reduces startup time and API calls to external providers.

:::warning Important for OpenRouter and Multi-Model Providers
If you are using **OpenRouter** or any provider with hundreds/thousands of models, enabling model caching is **highly recommended**. Without caching, initial page loads can take **10-15+ seconds** as the application queries all available models. Enabling the cache reduces this to near-instant.
:::

- **Admin Panel**: `Settings > Connections > Cache Base Model List`
- **Env Var**: `ENABLE_BASE_MODELS_CACHE=True`
  *   *Note*: Caches the list of models in memory. Only refreshes on App Restart or when clicking **Save** in Connections settings.

- **Env Var**: `MODELS_CACHE_TTL=300`
  *   *Note*: Sets a 5-minute cache for external API responses.

#### Search Query Caching
Reuses the LLM-generated Web-Search search queries for RAG search within the same chat turn. This prevents redundant LLM calls when multiple retrieval features act on the same user prompt.

- **Env Var**: `ENABLE_QUERIES_CACHE=True`
  *   *Note*: If enabled, the same search query will be reused for RAG instead of generating new queries for RAG, saving on inference cost and API calls, thus improving performance.

I.e. the LLM generates "US News 2025" as a Web Search query, if this setting is enabled, the same search query will be reused for RAG instead of generating new queries for RAG, saving on inference cost and API calls, thus improving performance.

#### KV Cache Optimization (RAG Performance)
Drastically improves the speed of follow-up questions when chatting with large documents or knowledge bases.

- **Env Var**: `RAG_SYSTEM_CONTEXT=True`
- **Effect**: Injects RAG context into the **system message** instead of the user message.
- **Why**: Many LLM engines (like Ollama, llama.cpp, vLLM) and cloud providers (OpenAI, Vertex AI) support **KV prefix caching** or **Prompt Caching**. System messages stay at the start of the conversation, while user messages shift position each turn. Moving RAG context to the system message ensures the cache remains valid, leading to **near-instant follow-up responses** instead of re-processing large contexts every turn.

---

## 📦 Database Optimization

For high-scale deployments, your database configuration is the single most critical factor for stability.

### PostgreSQL (Mandatory for Scale)
For any multi-user or high-concurrency setup, **PostgreSQL is mandatory**. SQLite (the default) is not designed for high concurrency and will become a bottleneck (database locking errors).

-   **Variable**: `DATABASE_URL`
-   **Example**: `postgres://user:password@localhost:5432/webui`

### Chat Saving Strategy

By default, Open WebUI saves chats **after generation is complete**. While saving in real-time (token by token) is possible, it creates massive database write pressure and is **strongly discouraged**.

-   **Env Var**: `ENABLE_REALTIME_CHAT_SAVE=False` (Default)
-   **Effect**: Chats are saved only when the generation is complete (or periodically).
-   **Recommendation**: **DO NOT ENABLE `ENABLE_REALTIME_CHAT_SAVE` in production.** It is highly recommended to keep this `False` to prevent database connection exhaustion and severe performance degradation under concurrent load. See the [Environment Variable Configuration](/getting-started/env-configuration#enable_realtime_chat_save) for details.

### Database Session Sharing

Starting with v0.7.1, Open WebUI includes a database session sharing feature that can improve performance under high concurrency by reusing database sessions instead of creating new ones for each request.

-   **Env Var**: `DATABASE_ENABLE_SESSION_SHARING`
-   **Default**: `False`

:::tip Recommendations by Database Type

- **SQLite:** Keep this setting **disabled** (default). Enabling session sharing on SQLite with limited hardware resources may cause severe performance degradation or timeouts.
- **PostgreSQL with adequate resources:** Consider **enabling** this setting for improved performance, especially in multi-user or high-concurrency deployments.

:::

:::warning Low-Spec Hardware

If you upgraded to v0.7.0 and experienced slow admin page loads, API timeouts, or unresponsive UI, this was likely caused by database session sharing being enabled. Ensure `DATABASE_ENABLE_SESSION_SHARING=False` on low-spec hardware (Raspberry Pi, containers with limited CPU allocation like 250m or less).

:::

### Connection Pool Sizing

For high-concurrency PostgreSQL deployments, the default connection pool settings may be insufficient. If you experience `QueuePool limit reached` errors or connection timeouts, increase the pool size:

-   **Env Var**: `DATABASE_POOL_SIZE=15` (default: uses SQLAlchemy defaults)
-   **Env Var**: `DATABASE_POOL_MAX_OVERFLOW=20` (default: 0)

**Important:** The combined total (`DATABASE_POOL_SIZE` + `DATABASE_POOL_MAX_OVERFLOW`) should remain well below your database's `max_connections` limit. PostgreSQL defaults to 100 max connections, so keep the combined total under 50-80 per Open WebUI instance to leave room for other clients and maintenance operations.

### Vector Database (RAG)
For multi-user setups, the choice of Vector DB matters.

-   **ChromaDB**: **NOT RECOMMENDED** for multi-user environments due to performance limitations and locking issues.
-   **Recommendations**:
    *   **Milvus** or **Qdrant**: Best for improved scale and performance.
    *   **PGVector**: Excellent choice if you are already using PostgreSQL.
-   **Multitenancy**: If using Milvus or Qdrant, enabling multitenancy offers better resource sharing.
    *   `ENABLE_MILVUS_MULTITENANCY_MODE=True`
    *   `ENABLE_QDRANT_MULTITENANCY_MODE=True`

### Optimizing Document Chunking

The way your documents are chunked directly impacts both storage efficiency and retrieval quality.

- **Use Markdown Header Splitting**: This preserves the semantic structure of your documents.
- **Set a Chunk Min Size Target**: When using the markdown header splitter, tiny chunks (e.g., just a single sub-header) can be created. These are inefficient to store and poor for retrieval.
  - **Env Var**: `CHUNK_MIN_SIZE_TARGET=1000` (Example value)
  - **Benefit**: Intelligently merges small chunks with neighbors, significantly reducing the total vector count and improving RAG performance.

---

## 📈 Scaling Infrastructure (Multi-Tenancy & Kubernetes)

If you are deploying for **enterprise scale** (hundreds of users), simple Docker Compose setups may not suffice. You will need to move to a clustered environment.

*   **Kubernetes / Helm**: For deploying on K8s with multiple replicas, see the **[Multi-Replica & High Availability Guide](/troubleshooting/multi-replica)**.
*   **Redis (Mandatory)**: When running multiple workers (`UVICORN_WORKERS > 1`) or multiple replicas, **Redis is required** to handle WebSocket connections and session syncing. See **[Redis Integration](/tutorials/integrations/redis)**.
*   **Load Balancing**: Ensure your Ingress controller supports **Session Affinity** (Sticky Sessions) for best performance.
*   **Reverse Proxy Caching**: Configure your reverse proxy (e.g., Nginx, Caddy, Cloudflare) to **cache static assets** (JS, CSS, Images). This significantly reduces load on the application server. See **[Nginx Config](/tutorials/https/nginx)** or **[Caddy Config](/tutorials/https/caddy)**.

---

## ⚡ High-Concurrency & Network Optimization

For setups with many simultaneous users, these settings are crucial to prevent bottlenecks.

#### Batch Streaming Tokens
By default, Open WebUI streams *every single token* arriving from the LLM. High-frequency streaming increases network IO and CPU usage on the server. If real-time saving is enabled (which is strongly discouraged), it also destroys database performance.

Increasing the chunk size buffers these updates, sending them to the client in larger groups. The only downside is a slightly choppier UI experience when streaming the response, but it can make a big difference in performance.

- **Env Var**: `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE=7`
  *   *Recommendation*: Set to **5-10** for high-concurrency instances.

#### Thread Pool Size
Defines the number of worker threads available for handling requests.
*   **Default**: 40
*   **High-Traffic Recommendation**: **2000+**
*   **Warning**: **NEVER decrease this value.** Even on low-spec hardware, an idle thread pool does not consume significant resources. Setting this too low (e.g., 10) **WILL cause application freezes** and request timeouts.

- **Env Var**: `THREAD_POOL_SIZE=2000`

---

## ☁️ Cloud Infrastructure Latency

When deploying Open WebUI in cloud Kubernetes environments (AKS, EKS, GKE), you may notice significant performance degradation compared to local Kubernetes (Rancher Desktop, kind, Minikube) or bare-metal deployments—even with identical resource allocations. This is almost always caused by **latency** in the underlying infrastructure.

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
3. **Enable caching:** Use `ENABLE_BASE_MODELS_CACHE=True` and other caching options to reduce the frequency of database queries.
4. **Reduce database writes:** Set `ENABLE_REALTIME_CHAT_SAVE=False` to batch database updates and reduce IOPS pressure.

### Disk I/O Latency (SQLite & Storage)

If you're using **SQLite** (the default) in a cloud environment, you may be trading network latency for **disk latency**.

Cloud storage (Azure Disks, AWS EBS, GCP Persistent Disks) often has significantly higher latency and lower IOPS than local NVMe/SSD storage—especially on lower-tier storage classes. 

:::warning Warning: Performance Risk with Network File Systems
Using Network-attached File Systems like **NFS, SMB, or Azure Files** for your database storage (especially for SQLite) **may** introduce severe latency into the file locking and synchronous write operations that SQLite relies on.
:::

SQLite is particularly sensitive to disk performance because it performs synchronous writes. Moving from local SSDs to a network share can increase latency by 10x or more per operation.

**Symptoms:**
- Performance is acceptable with a single user but degrades rapidly as concurrency increases.
- High "I/O Wait" on the server despite low CPU usage.

**Solutions:**
1. **Use high-performance Block Storage:**
   - Ensure you are using SSD-backed **Block Storage** classes (e.g., `Premium_LRS` on Azure Disks, `gp3` on AWS EBS, `pd-ssd` on GCP). Avoid "File" based storage classes (like `azurefile-csi`) for database workloads.
2. **Use PostgreSQL instead:** For any medium to large production deployment, **Postgres is mandatory**. SQLite is generally not recommended at scale in cloud environments due to the inherent latency of network-attached storage and the compounding effect of file locking over the network.

### Other Cloud-Specific Considerations

| Factor | Impact | Mitigation |
|--------|--------|------------|
| **Burstable VMs** (e.g., Azure B-series, AWS T-series) | CPU throttling under sustained load, even at low reported usage | Use standard/compute-optimized node pools |
| **DNS Resolution** | CoreDNS overhead on every external request | Ensure CoreDNS is properly scaled; consider node-local DNS cache |
| **Service Mesh Sidecars** | Istio/Linkerd proxies add latency to every request | Check for unexpected sidecar containers in your pods |
| **Network Policies** | CNI processing overhead | Audit and simplify network policies if possible |
| **Cross-Zone Traffic** | Latency + egress costs when services span zones | Pin services to the same availability zone |

---

## 📉 Resource Efficiency (Reducing RAM)

If deploying on memory-constrained devices (Raspberry Pi, small VPS), use these strategies to prevent the application from crashing due to OOM (Out of Memory) errors.

### 1. Offload Auxiliary Models (Local Deployments Only)

Open WebUI loads local ML models for features like RAG and STT. **This section is only relevant if you are running models LOCALLY.**

#### RAG Embeddings
-   **Low-Spec Recommendation**:
    *   **Option A (Easiest)**: Keep the default **SentenceTransformers** (all-MiniLM-L6-v2). It is lightweight, runs on CPU, and is significantly more efficient than running a full Ollama instance on the same Raspberry Pi.
    *   **Option B (Best Performance)**: Use an **External API** (OpenAI/Cloud).

-   **Configuration**:
    *   **Admin Panel**: `Settings > Documents > Embedding Model Engine`
    *   **Env Var**: `RAG_EMBEDDING_ENGINE=openai` (to offload completely)

#### Speech-to-Text (STT)
Local Whisper models are heavy (~500MB+ RAM).

-   **Recommendation**: Use **WebAPI** (Browser-based). It uses the user's device capabilities, costing 0 server RAM.
-   **Configuration**:
    *   **Admin Panel**: `Settings > Audio > STT Engine`
    *   **Env Var**: `AUDIO_STT_ENGINE=webapi`

### 2. Disable Unused Features

Prevent the application from loading **local** models you don't use.

-   **Image Generation**: `ENABLE_IMAGE_GENERATION=False` (Admin: `Settings > Images`)
-   **Code Interpreter**: `ENABLE_CODE_INTERPRETER=False` (Admin: `Settings > Tools`)

### 3. Disable Background Tasks

If resource usage is critical, disable automated features that constantly trigger model inference.

**Recommendation order (Highest Impact first):**

1.  **Autocomplete**: `ENABLE_AUTOCOMPLETE_GENERATION=False` (**High Impact**: Triggers on every keystroke!)
    *   Admin: `Settings > Interface > Autocomplete`
2.  **Follow-up Questions**: `ENABLE_FOLLOW_UP_GENERATION=False`
    *   Admin: `Settings > Interface > Follow-up`
3.  **Title Generation**: `ENABLE_TITLE_GENERATION=False`
    *   Admin: `Settings > Interface > Chat Title`
4.  **Tag Generation**: `ENABLE_TAGS_GENERATION=False`

---

## 🚀 Recommended Configuration Profiles

### Profile 1: Maximum Privacy (Weak Hardware/RPi)
*Target: 100% Local, Raspberry Pi / &lt;4GB RAM.*

1.  **Embeddings**: Default (SentenceTransformers) - *Runs on CPU, lightweight.*
2.  **Audio**: `AUDIO_STT_ENGINE=webapi` - *Zero server load.*
3.  **Task Model**: Disable or use tiny model (`llama3.2:1b`).
4.  **Scaling**: Keep default `THREAD_POOL_SIZE` (40).
5.  **Disable**: Image Gen, Code Interpreter, Autocomplete, Follow-ups.
6.  **Database**: SQLite is fine.

### Profile 2: Single User Enthusiast
*Target: Max Quality & Speed, Local + External APIs.*

1.  **Embeddings**: `RAG_EMBEDDING_ENGINE=openai` (or `ollama` with `nomic-embed-text` on a fast server).
2.  **Task Model**: `gpt-5-nano` or `llama-3.1-8b-instant`.
3.  **Caching**: `MODELS_CACHE_TTL=300`.
4.  **Database**: `ENABLE_REALTIME_CHAT_SAVE=False` (Keeping this disabled is recommended even for single users to ensure maximum stability).
5.  **Vector DB**: PGVector (recommended) or ChromaDB (either is fine unless dealing with massive data).

### Profile 3: High Scale / Enterprise
*Target: Many concurrent users, Stability > Persistence.*

1.  **Database**: **PostgreSQL** (Mandatory).
2.  **Workers**: `THREAD_POOL_SIZE=2000` (Prevent timeouts).
3.  **Streaming**: `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE=7` (Reduce CPU/Net/DB writes).
4.  **Chat Saving**: `ENABLE_REALTIME_CHAT_SAVE=False`.
5.  **Vector DB**: **Milvus**, **Qdrant**, or **PGVector**. **Avoid ChromaDB.**
6.  **Task Model**: External/Hosted (Offload compute).
7.  **Caching**: `ENABLE_BASE_MODELS_CACHE=True`, `MODELS_CACHE_TTL=300`, `ENABLE_QUERIES_CACHE=True`.

---

## 🔗 Environment Variable References

For detailed information on all available variables, see the [Environment Configuration](/getting-started/env-configuration) guide.

| Variable | Description & Link |
| :--- | :--- |
| `TASK_MODEL` | [Task Model (Local)](/getting-started/env-configuration#task_model) |
| `TASK_MODEL_EXTERNAL` | [Task Model (External)](/getting-started/env-configuration#task_model_external) |
| `ENABLE_BASE_MODELS_CACHE` | [Cache Model List](/getting-started/env-configuration#enable_base_models_cache) |
| `MODELS_CACHE_TTL` | [Model Cache TTL](/getting-started/env-configuration#models_cache_ttl) |
| `ENABLE_QUERIES_CACHE` | [Queries Cache](/getting-started/env-configuration#enable_queries_cache) |
| `DATABASE_URL` | [Database URL](/getting-started/env-configuration#database_url) |
| `ENABLE_REALTIME_CHAT_SAVE` | [Realtime Chat Save](/getting-started/env-configuration#enable_realtime_chat_save) |
| `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE` | [Streaming Chunk Size](/getting-started/env-configuration#chat_response_stream_delta_chunk_size) |
| `THREAD_POOL_SIZE` | [Thread Pool Size](/getting-started/env-configuration#thread_pool_size) |
| `RAG_EMBEDDING_ENGINE` | [Embedding Engine](/getting-started/env-configuration#rag_embedding_engine) |
| `AUDIO_STT_ENGINE` | [STT Engine](/getting-started/env-configuration#audio_stt_engine) |
| `ENABLE_IMAGE_GENERATION` | [Image Generation](/getting-started/env-configuration#enable_image_generation) |
| `ENABLE_AUTOCOMPLETE_GENERATION` | [Autocomplete](/getting-started/env-configuration#enable_autocomplete_generation) |
| `RAG_SYSTEM_CONTEXT` | [RAG System Context](/getting-started/env-configuration#rag_system_context) |
| `DATABASE_ENABLE_SESSION_SHARING` | [Database Session Sharing](/getting-started/env-configuration#database_enable_session_sharing) |

---
sidebar_position: 15
title: "性能与内存"
---

# 优化、性能与内存占用

本指南全面介绍优化 Open WebUI 的策略。理想配置在很大程度上取决于具体部署目标。请考虑以下哪种场景最符合你的情况：

1.  **在低性能硬件上实现最高隐私性（例如 Raspberry Pi）**：
    *   *目标*：所有内容均在本地运行；尽量减少资源占用。
    *   *权衡*：必须使用轻量级本地模型（SentenceTransformers），并禁用高负载功能，以防崩溃。

2.  **单用户最高质量（例如桌面电脑）**：
    *   *目标*：兼顾高速度与高质量的最佳体验。
    *   *策略*：利用外部 API（OpenAI/Anthropic）执行嵌入和任务模型推理，将计算负载从本机转移出去。

3.  **面向大量用户的大规模部署（例如企业/生产环境）**：
    *   *目标*：稳定性与并发能力。
    *   *策略*：需要专用向量数据库（PGVector、Milvus 或 Qdrant）、更大的线程池、用于应对负载的缓存，以及用 **PostgreSQL** 替代 SQLite。

---

## 性能调优（速度与响应能力） {#performance-tuning-speed--responsiveness}

如果 Open WebUI 运行缓慢或没有响应，尤其是在聊天生成或高并发期间，专门的优化可以显著改善用户体验。

### 1. 专用任务模型 {#1-dedicated-task-models}

默认情况下，Open WebUI 会自动执行标题生成、标签生成和自动补全等后台任务。这些任务在后台运行，如果与主聊天模型共享相同资源，可能会拖慢主聊天模型。

![设置 > 界面（管理员区域）中的任务模型设置](/images/admin/admin-interface.png)

**建议**：为这些任务使用**速度非常快、规模小且成本低的非推理模型**。避免使用大型推理模型：它可能要思考数秒，并为这些思考 token 付费，然后才生成一个只有三个词的聊天标题。每个主要服务提供方都有小型模型档位，比其旗舰模型更适合这类任务。

**推荐选项：**
*   **外部/云端**：`gpt-5.6-luna`、`gemini-3.5-flash-lite`、`claude-haiku-4-5-20251001`（直接使用 OpenAI、Google 和 Anthropic，或通过 OpenRouter 使用相同模型）。
*   **本地**：`qwen3.5:2b`、`gemma4:e2b`、`llama3.2:3b`。

**配置：**两个模型选择器、后台请求使用的参数，以及各项任务的独立开关都位于**设置 > 界面**（管理员区域）。分步说明请参阅[任务模型](/features/administration/task-models)。

### 2. 缓存与延迟优化 {#2-caching--latency-optimization}

配置以下设置可减少延迟和外部 API 调用。

#### 模型缓存 {#model-caching}
大幅缩短启动时间，并减少对外部服务提供方的 API 调用。

:::warning 对 OpenRouter 和多模型服务提供方尤为重要
如果使用 **OpenRouter** 或任何提供数百/数千个模型的服务提供方，**强烈建议**启用模型缓存。如果不使用缓存，应用查询所有可用模型时，初始页面加载可能需要 **10–15 秒以上**。启用缓存后，加载几乎可以立即完成。
:::

- **管理员面板**：`Settings > Connections > Cache Base Model List`（设置 > 连接 > 缓存基础模型列表；管理员区域）
- **环境变量**：`ENABLE_BASE_MODELS_CACHE=True`
  *   *说明*：缓存基础模型列表；配置 Redis 时存储在 Redis 中（由所有副本共享），否则存储在每个副本的内存中。在连接设置中点击**保存**，或使用开关旁的刷新按钮时，缓存会刷新。未使用 Redis 时，重启也会刷新缓存。
  *   *模型选择器数据过期*：缓存启用期间，模型选择器显示缓存列表。服务提供方新增或移除的模型不会出现或消失，llama.cpp 和 LM Studio 模型上的**已加载**标签也会保持列表缓存时的状态，因此服务提供方自行加载或卸载的模型会显示旧状态。从 Open WebUI 加载、卸载、下载或删除模型会刷新列表。否则，请点击**缓存基础模型列表**旁的**刷新**。

- **环境变量**：`MODELS_CACHE_TTL=300`
  *   *说明*：将每个 OpenAI 和 Ollama 连接的模型列表响应缓存 5 分钟。默认值为 `1` 秒。

#### 搜索查询缓存 {#search-query-caching}
在同一聊天轮次中，复用由 LLM 生成的 Web 搜索查询来执行 RAG 搜索。这样，当多个检索功能处理同一用户提示词时，可以避免重复的 LLM 调用。

- **环境变量**：`ENABLE_QUERIES_CACHE=True`
  *   *说明*：启用后，RAG 会复用相同的搜索查询，而不会生成新查询，从而节省推理成本和 API 调用，并提高性能。

---

## 数据库优化 {#database-optimization}

对于大规模部署，数据库配置是影响稳定性的最关键因素。

### PostgreSQL（规模化部署必需） {#postgresql-mandatory-for-scale}
对于任何多用户或高并发环境，**PostgreSQL 都是必需的**。SQLite（默认）并非为高并发而设计，会成为瓶颈（数据库锁定错误）。

-   **变量**：`DATABASE_URL`
-   **示例**：`postgres://user:password@localhost:5432/webui`

### 用户活跃状态写入节流（每个部署都应设置） {#user-active-status-write-throttling-set-this-on-every-deployment}

Open WebUI 通过将每个用户的 `last_active_at` 时间戳写入数据库来跟踪在线/“活跃”状态。如果不进行节流，几乎每个经过身份验证的请求都会单独发出 `UPDATE` 和 `COMMIT`，产生大量微小写入事务，徒然增加数据库和连接池负载，因为在线状态只需要约分钟级的精度。

-   **环境变量**：`DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL`
-   **默认值**：`60` 秒
-   **建议**：`120`，可将在线状态写入次数再减少一半。保持在 `180` 以下：活跃状态统计时间戳位于最近 180 秒内的用户，因此更长的间隔会使活跃用户数上下波动。`0` 表示禁用节流。请参阅 [`DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL`](/reference/env-configuration#database_user_active_status_update_interval)。

### 数据库会话共享 {#database-session-sharing}

会话共享允许数据库调用复用当前请求已经持有的会话，而不是打开新会话。

-   **环境变量**：`DATABASE_ENABLE_SESSION_SHARING`
-   **默认值**：`False`

:::tip 按数据库类型给出的建议

- **SQLite 和低配置硬件**（Raspberry Pi、CPU 上限约为 250m 的容器）：保持**禁用**（默认）。在此类系统上启用会导致管理页面缓慢、API 超时和界面无响应。
- **资源充足的 PostgreSQL：**对于多用户或高并发部署，可以考虑**启用**。

:::

### 连接池大小 {#connection-pool-sizing}

对于高并发 PostgreSQL 部署，默认连接池可能太小。未设置 `DATABASE_POOL_SIZE` 时，PostgreSQL 使用 SQLAlchemy 的默认值，即 5 个连接加 10 个溢出连接。如果看到 `QueuePool limit reached` 错误或连接超时，请增大连接池：

-   **环境变量**：`DATABASE_POOL_SIZE=15`
-   **环境变量**：`DATABASE_POOL_MAX_OVERFLOW=20`（设置 `DATABASE_POOL_SIZE` 后生效；默认值为 `0`）
-   **环境变量**：`DATABASE_POOL_TIMEOUT`（请求在失败前等待空闲连接的秒数；默认值为 `30`）

SQLite 使用自己的连接池大小设置，请参阅[资源受限容器中的 SQLite 内存占用](#5-sqlite-memory-footprint-on-constrained-containers)。

**重要：**对于 PostgreSQL，请统计连接到同一数据库服务器的同步连接池、异步连接池以及任何 pgvector 连接池。再乘以所有副本的工作进程总数，并为其他客户端预留空间。请参阅 [PostgreSQL 连接池大小](/reference/env-configuration#database_pool_size)。

### 向量数据库（RAG） {#vector-database-rag}
对于多用户环境，向量数据库的选择很重要。

知识库搜索不会阻塞发起它的工作进程，因此搜索执行期间，其他用户的响应仍会继续流式传输；多个集合也会同时搜索，而不是依次搜索。因此，缓慢的向量数据库只会拖慢正在搜索的聊天，而不会影响该工作进程上的每个用户。但它仍需能够应对多个副本同时访问，这正是下列选择的重点。

-   **ChromaDB（默认）**：**不安全**，不适用于多副本部署。默认 ChromaDB 将数据保存在只允许一个进程写入的本地 SQLite 文件中；多个副本同时写入会导致崩溃。完整的崩溃序列和解决方案请参阅[扩展与高可用故障排除指南](/troubleshooting/multi-replica#6-worker-crashes-during-document-upload-chromadb--multi-worker)。
-   **推荐**：
    *   **Milvus** 或 **Qdrant**：作为服务器运行时，最有利于扩展和性能。服务器部署可安全支持多副本访问，因为每个副本都通过网络与其通信。
    *   **Milvus Lite**：适用于知识库较小且规模基本不变的单实例小型部署；与本地 ChromaDB 相比，它占用的磁盘和内存更少。如果批量上传文档或持续添加文件，请避免使用：Open WebUI 在每次上传前执行的重复检查会在 Milvus Lite 上扫描整个集合，因此存储的内容越多，摄取就越慢。测量数据请参阅[将 ChromaDB 替换为 Milvus Lite](#4-swap-chromadb-for-milvus-lite-small-deployments)。更大规模部署仍应选择 Milvus 服务器；Milvus Lite 是嵌入式数据库，因此与本地 ChromaDB 具有相同的多进程限制。添加副本前，请将 `MILVUS_URI` 指向 Milvus 服务器。
    *   **PGVector**：如果已经使用 PostgreSQL，这是极佳选择，也完全支持多进程安全访问。
    *   **ChromaDB HTTP 模式**：如果要继续使用 ChromaDB，请将其作为[独立服务器](/reference/env-configuration#chroma_http_host)运行，让 Open WebUI 通过 HTTP 连接，而不是使用本地 SQLite。
-   **多租户**：使用 Milvus 或 Qdrant 时均建议启用；否则，较大实例很快会遇到扩展问题。请参阅[扩展指南的步骤 4](/getting-started/advanced-topics/scaling#step-4-switch-to-an-external-vector-database)。
    *   `ENABLE_MILVUS_MULTITENANCY_MODE=True`（默认 `False`）
    *   `ENABLE_QDRANT_MULTITENANCY_MODE=True`（默认）

### 内容提取引擎 {#content-extraction-engine}

:::danger 默认内容提取器会导致内存泄漏
**默认内容提取引擎**使用包括 **pypdf** 在内的 Python 库，这些库在文档摄取期间存在已知的**持续性内存泄漏**。在经常上传文档的生产部署中，这会导致 Open WebUI 的内存占用持续增长，直到进程被终止或容器重启。

这是生产部署中**无法解释的内存增长的首要原因**。
:::

**建议**：对于任何需要经常处理文档的部署，切换到外部内容提取引擎：

| 引擎 | 最适用场景 | 配置 |
|---|---|---|
| **Apache Tika** | 通用、应用广泛，支持大多数文档类型 | `CONTENT_EXTRACTION_ENGINE=tika` + `TIKA_SERVER_URL=http://tika:9998` |
| **Docling** | 通过布局感知解析实现高质量提取 | `CONTENT_EXTRACTION_ENGINE=docling` + `DOCLING_SERVER_URL=http://docling:5001` |
| **PaddleOCR-vl** | OCR 密集型工作负载（扫描 PDF、图片、混合布局）；自托管视觉语言 OCR | `CONTENT_EXTRACTION_ENGINE=paddleocr_vl` + `PADDLEOCR_VL_BASE_URL=http://paddleocr-vl:8080` + `PADDLEOCR_VL_TOKEN=...` |
| **任何其他外部加载器** | 推荐用于生产环境和自定义提取管道 | `CONTENT_EXTRACTION_ENGINE=external` + `EXTERNAL_DOCUMENT_LOADER_URL=...` |

使用外部提取器可将高内存消耗的解析工作完全移出 Open WebUI 进程，从而消除这类内存泄漏。

### 嵌入引擎 {#embedding-engine}

:::warning 大规模使用 SentenceTransformers
**默认 SentenceTransformers** 嵌入引擎（all-MiniLM-L6-v2）会在启动时将 PyTorch 和模型加载到 Open WebUI 进程中。每个副本都会加载自己的副本。个人使用没有问题；对于多用户或生产部署，**请将嵌入计算转移到外部服务**。
:::

-   **推荐**：`RAG_EMBEDDING_ENGINE=openai`（OpenAI 或兼容 API）、`azure_openai` 或 `ollama`（自托管，使用 `nomic-embed-text` 等模型）。
-   **效果**：Open WebUI 进程中不会加载嵌入模型。
-   **保留本地引擎**：在**设置 > 文档**（管理员区域）中增大**嵌入批次大小**，或调整 [`RAG_EMBEDDING_BATCH_SIZE`](/reference/env-configuration#rag_embedding_batch_size)。默认值 `1` 会让本地模型每次只嵌入一个文本块，导致大型 CSV、XLSX 和多文件上传速度缓慢。更大的批次会使用更多内存。

### 优化文档分块 {#optimizing-document-chunking}

文档的分块方式会直接影响存储效率和检索质量。

- **使用 Markdown 标题拆分**：这样可以保留文档的语义结构。
- **设置文本块最小目标大小**：使用 Markdown 标题拆分器时，可能会生成极小的文本块（例如只有一个子标题）。这类文本块存储效率低，检索效果也差。
  - **环境变量**：`CHUNK_MIN_SIZE_TARGET=1000`（示例值）
  - **好处**：智能地将小文本块与相邻文本块合并，显著减少向量总数并提高 RAG 性能。

---

## 扩展基础设施（多租户与 Kubernetes） {#scaling-infrastructure-multi-tenancy--kubernetes}

对于**企业级规模**（数百名用户），请使用 Docker Compose、Docker Swarm 或 Kubernetes 在负载均衡器后运行多个副本，每个副本运行一个工作进程。

有关整个扩展过程（PostgreSQL、Redis、向量数据库、存储、可观测性）的分步说明，请参阅 **[扩展 Open WebUI](/getting-started/advanced-topics/scaling)** 指南。

*   **Kubernetes / Helm**：有关在 K8s 上部署多个副本，请参阅 **[多副本与高可用指南](/troubleshooting/multi-replica)**。
*   **Redis（必需）**：运行多个副本时，**必须使用 Redis** 来处理 WebSocket 连接和会话同步。请参阅 **[Redis 集成](/tutorials/integrations/redis)**。
*   **负载均衡**：普通轮询即可。有关粘性会话何时有帮助，请参阅[会话亲和性](/troubleshooting/multi-replica#session-affinity-sticky-sessions)。
*   **反向代理缓存**：配置反向代理（例如 Nginx、Caddy、Cloudflare）**缓存静态资源**（JS、CSS、图片）。这会显著降低应用服务器负载。请参阅 **[Nginx 配置](/reference/https/nginx)** 或 **[Caddy 配置](/reference/https/caddy)**。
*   **禁用代理缓冲（对流式传输至关重要）**：如果使用 Nginx，**必须**为 Open WebUI 禁用 `proxy_buffering`。代理缓冲会重新切分 SSE 流，导致 Markdown 乱码和流式传输缓慢。在 location 块中添加 `proxy_buffering off;` 和 `proxy_cache off;`。请参阅 **[流式传输故障排除](/troubleshooting/connection-error#garbled-markdown--streaming-response-corruption)**。

---

## 高并发与网络优化 {#high-concurrency--network-optimization}

对于同时有大量用户的环境，以下设置对于防止瓶颈至关重要。

#### 批量流式传输 Token {#batch-streaming-tokens}
默认情况下（`1`），Open WebUI 会流式传输从 LLM 到达的*每一个 token*。高频流式传输会增加服务器的网络 I/O 和 CPU 使用量。

增大块大小会缓冲这些更新，以更大的批次发送给客户端。唯一的缺点是流式响应的界面体验会稍微不够平滑，但可以显著改善性能。

- **环境变量**：`CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE=7`
  *   *建议*：高并发实例设置为 **5–10**。

#### 回复成批到达或仅在完成后到达 {#replies-arrive-in-bursts-or-only-when-finished}
Open WebUI 逐行读取服务提供方的流，并在每行完成后立即将每个文本更新发送到聊天。默认设置不会额外进行批处理。如果回复大批量出现，或在完成后一次性全部出现，请按顺序检查以下各项：

1.  **流式聊天响应已关闭。**设置为**关闭**时，Open WebUI 会要求服务提供方在一个响应中返回完整回复，聊天只会在完成后显示。可在**工作区** > **模型**中模型的**高级参数**、聊天的**控制** > **高级参数**，以及**设置** > **通用** > **高级参数**中设置。模型上的值优先于聊天上的值，聊天上的值优先于**设置**。
2.  **块大小已增大。**`CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE` 和**流式增量块大小**参数会将多个文本更新合并为一个，再发送给聊天。Open WebUI 使用两者中的较大值，模型上设置的值会替换聊天上设置的值。该参数显示在相同的**高级参数**区域，仅管理员可用。将环境变量设为 `1`，并将参数设为**默认**，即可在每次更新到达时看到它。
3.  **反向代理缓冲了流。**请参阅 **[流式传输故障排除](/troubleshooting/connection-error#garbled-markdown--streaming-response-corruption)**。
4.  **服务提供方分块释放文本。**服务提供方、其前置网关或服务提供方一侧的内容过滤器可能会暂存文本，再以较大的片段发送。启用流式传输，直接向服务提供方的 API 发送相同提示词。如果文本仍以同样的批次到达，则原因不在 Open WebUI。
5.  **安全软件扫描 HTTP 流量。**用户设备或网络上的防病毒软件、终端防护或网络 Web 过滤器可能会在扫描期间暂存流式响应。请从另一个网络或浏览器测试，或将 Open WebUI 地址排除在扫描范围之外，然后比较结果。

#### HTTP 响应压缩 {#http-response-compression}
默认情况下，Open WebUI 在应用内部使用 ZStd/Brotli/Gzip 压缩 HTTP 响应（JSON API 响应以及 Web 界面的静态 JS/CSS 资源）。这会占用每个工作进程的 CPU：对生产部署的性能分析（py-spy）显示，压缩中间件大约消耗**工作进程 CPU 时间的 3–4%**。禁用它可以释放这些 CPU，并略微降低响应延迟。

*   **范围**：仅压缩大于 500 字节且内容类型可压缩的普通 HTTP 响应。WebSocket（Socket.IO）流量和流式聊天响应（SSE）不会经过压缩，因此无论如何设置，聊天流式传输的热路径都相同。
*   **何时禁用**：反向代理/负载均衡器/CDN 已经压缩响应（推荐在代理层启用并在应用中关闭），或者用户通过高速/本地网络访问实例，额外的传输大小无关紧要。
*   **何时保持启用**：后端直接面向互联网，前置组件均未压缩，并且用户通过慢速或移动网络连接。未压缩时，首次（未缓存）页面加载会多传输数 MB，长聊天历史或大型模型列表等大负载会增大 5–10 倍。

- **环境变量**：`ENABLE_COMPRESSION_MIDDLEWARE=false`

*   **推荐的配套措施**：禁用应用侧压缩、改用代理压缩时，还应让代理**积极缓存静态资源**。Open WebUI 的 JS/CSS 捆绑文件位于 `/_app/immutable/` 下，文件名包含内容哈希，因此可以使用 `Cache-Control: public, max-age=31536000, immutable` 缓存，并由代理缓存直接提供，完全无需访问工作进程；这样首次之后的每次访问都不会再有“首次页面加载更大”的缺点。现成的 Nginx 代码段请参阅[扩展 → 与代理上的静态资源缓存搭配使用](/getting-started/advanced-topics/scaling#pair-it-with-static-asset-caching-at-the-proxy)。

完整权衡说明请参阅 [`ENABLE_COMPRESSION_MIDDLEWARE`](/reference/env-configuration#enable_compression_middleware)。

#### 流式响应组装 {#streamed-response-assembly}
Open WebUI 每收到一个块都会重建响应文本，每次都复制目前已收到的全部内容。开销随回复长度的平方增长，而且发生在事件循环上，因此一个工作进程组装超长回复时，会阻塞它处理的所有其他流。改为就地扩展文本可以消除复制，同时降低峰值内存，因为复制需要同时在内存中保留新旧字符串。

- **环境变量**：`ENABLE_CHAT_RESPONSE_STREAM_INPLACE_APPEND=true`

*   *建议*：在长回复很常见（智能体记录、大段代码输出、长工具输出）且多个回复同时流式传输的环境中启用。普通聊天回复无论采用哪种方式都只需不到一毫秒，小型实例感觉不到差异。
*   *代价*：如果追加期间内存耗尽，该条消息会变空，而不会保留目前已收集的文本。容器内存限制会终止进程，因此只有内存分配被拒绝时才会出现这种结果，而这种情况很少见。

完整说明请参阅 [`ENABLE_CHAT_RESPONSE_STREAM_INPLACE_APPEND`](/reference/env-configuration#enable_chat_response_stream_inplace_append)。

#### WebSocket 帧压缩 {#websocket-frame-compression}
上述 HTTP 中间件不会处理 WebSocket 流量，但 WebSocket 服务器会自行压缩帧；在流式传输负载下，这项压缩更值得禁用。聊天响应以每个 token 一个极小帧的形式到达，因此每个帧都会针对每个订阅者分别压缩，而这种大小几乎没有压缩收益。在大量流式传输时，这会表现为可测量的工作进程 CPU 开销。

- **环境变量**：`UVICORN_WS_PER_MESSAGE_DEFLATE=false`

*   **代价**：真正能有效压缩的是少见的大帧，例如一条完整消息或一组来源；即使很长的回复，未压缩时也只有几百 KB，任何网络都能在没有明显延迟的情况下传输。
*   **默认值**：启用。

完整说明请参阅 [`UVICORN_WS_PER_MESSAGE_DEFLATE`](/reference/env-configuration#uvicorn_ws_per_message_deflate)。

#### WebSocket 心跳 {#websocket-heartbeats}
每个已连接的浏览器都会按固定间隔告知服务器自己仍处于连接状态，默认间隔为 30 秒。这意味着每个打开的标签页都会发送一条小消息，因此保有数千个空闲标签页的实例会花费实际时间处理这些没有载荷的消息。

- **环境变量**：`WEBSOCKET_HEARTBEAT_INTERVAL=60`

*   **代价**：服务器会将在线状态条目保留为间隔的四倍或 120 秒，以较大者为准，因此合上笔记本电脑的用户会显示为活跃更长时间，然后才从活跃用户数中移除。
*   **范围**：值会限制在 `5` 到 `90` 之间。该设置会发送到浏览器，因此无需重建前端即可生效。

请参阅 [`WEBSOCKET_HEARTBEAT_INTERVAL`](/reference/env-configuration#websocket_heartbeat_interval)。

#### JSON 编码器 {#json-encoder}

Open WebUI 会为每个请求正文、API 响应、已保存聊天、服务提供方请求和流式块，以及每个 Socket.IO 事件（包括多副本环境中通过 Redis 发布的事件）编码和解码 JSON。这些操作全部使用 [orjson](https://pypi.org/project/orjson/)，这是一种比 Python 标准库 `json` 模块快数倍的 Rust 实现。

*   **影响最大的场景**：集群部署中的 Socket.IO 编码、流式块解析，以及长聊天的保存和打开。
*   **影响不大的场景**：聊天长度普通的单用户实例。
*   **回退**：orjson 无法编码的内容会回退到标准库。一点差异是：`NaN` 和 `Infinity` 浮点数会序列化为 `null`；标准库则会抛出错误。

- **环境变量**：`ENABLE_ORJSON=True`
  *   *建议*：保持启用。

完整分析请参阅[多副本 → 使用更快的 JSON 编码器](/troubleshooting/multi-replica#use-the-faster-json-encoder)，变量说明请参阅 [`ENABLE_ORJSON`](/reference/env-configuration#enable_orjson)。

#### 日志级别 {#log-level}

被级别过滤的消息不会构建，因此提高级别既能减少日志量，也能节省 CPU；在繁忙服务器和使用大型知识库的聊天上效果最明显。`WARNING` 还会丢弃记录启动、关键事件和请求处理的 `INFO` 行，因此如果日志聚合器依赖这些行，请保留 `INFO`。

- **环境变量**：`GLOBAL_LOG_LEVEL=WARNING`
  *   *建议*：在不依赖 `INFO` 行的繁忙实例上尝试。切勿在生产环境中长期启用 `DEBUG`，它是运行成本最高的级别。需要重启。

完整说明请参阅[日志级别的开销](../getting-started/advanced-topics/logging.md#what-the-log-level-costs)。

#### 线程池大小 {#thread-pool-size}
限制可同时运行的**并发**阻塞操作数量（同步数据库调用、文件 I/O、同步路由处理程序以及转移到线程执行的其他工作）。这是上限，不是预创建的线程池：线程按需创建并复用，因此较高的值在空闲时不会产生开销。
*   **默认值**：未设置，因此使用 AnyIO 的 40 上限。这对生产环境来说太低。
*   **服务器**：`2000` 或更高。绝不要低于默认值。
*   **设置过低的症状**：后续请求排队，**整个应用看起来卡住**，而 CPU 和内存看起来正常。
*   **低性能硬件**（Raspberry Pi、微型 VPS、CPU 上限约为 250m 或内存极少的容器）：保持默认值或设置为几百。每个并发阻塞操作都会使用具有独立栈的真实 OS 线程，因此过高的上限可能让突发流量耗尽内存。

- **环境变量**：`THREAD_POOL_SIZE=2000`

请参阅 [`THREAD_POOL_SIZE`](/reference/env-configuration#thread_pool_size)。

#### AIOHTTP 客户端超时 {#aiohttp-client-timeouts}
默认情况下，对模型服务提供方的请求没有总超时，因此长时间补全永远不会被中断。模型列表请求会在 10 秒后超时。

- **环境变量**：`AIOHTTP_CLIENT_TIMEOUT`（默认未设置）。例如设置为 `1800`，可限制无响应的服务提供方占用请求的时长。
- **环境变量**：`AIOHTTP_CLIENT_STREAM_IDLE_TIMEOUT`（默认未设置）。在指定秒数内未从服务提供方收到新数据时结束请求；持续产生输出的长流会继续运行。
- **环境变量**：`AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST`（默认 `10`）。对于列出数百个模型的慢速服务提供方，可以增大该值。

#### DNS 解析器 {#dns-resolver}

默认情况下，Open WebUI 请求操作系统解析主机名，这些查询会相互排队，也会排在其他后台工作之后，因此在负载下，本应只需毫秒的查询会延迟所属请求。c-ares 解析器不会排队，因此许多同时查询的耗时与单次查询大致相同。在同时发出大量出站请求的实例上收益最大，在空闲实例上则感觉不到差异。

- **环境变量**：`AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER=True`
  *   *建议*：尝试启用，然后测试模型、Web 搜索和所有内部服务；如果查询开始失败，请将其关闭。需要重启。

c-ares 读取的名称来源比操作系统少，因此长期启用前请阅读 [`AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER`](../reference/env-configuration.mdx#aiohttp_client_async_dns_resolver)。如果要排查间歇性查询失败，请参阅[间歇性名称查询失败](./connection-error.mdx#intermittent-name-lookup-failures-often-reported-as-model-not-found)。

#### 容器资源限制 {#container-resource-limits}
对于 Docker 部署，请确保分配足够的资源：

```yaml
deploy:
  resources:
    limits:
      memory: 8G      # 根据使用情况调整
      cpus: '4.0'
    reservations:
      memory: 4G
      cpus: '2.0'

# 增大文件描述符限制
ulimits:
  nofile:
    soft: 65536
    hard: 65536
```

**诊断命令：**
```bash
# 检查容器资源使用情况
docker stats openwebui --no-stream

# 检查连接状态
docker exec openwebui netstat -an | grep -E "ESTABLISHED|TIME_WAIT|CLOSE_WAIT" | sort | uniq -c

# 检查打开的文件描述符
docker exec openwebui ls -la /proc/1/fd | wc -l
```

---


## 云基础设施延迟 {#cloud-infrastructure-latency}

在云 Kubernetes 环境（AKS、EKS、GKE）中部署 Open WebUI 时，即使资源分配完全相同，与本地 Kubernetes（Rancher Desktop、kind、Minikube）或裸机部署相比，性能也可能显著下降。这几乎总是由底层基础设施的**延迟**造成的。

### 网络延迟（数据库与服务） {#network-latency-database--services}

云端性能问题最常见的原因是 **Open WebUI 与其数据库之间的网络延迟**。

许多云部署将数据库放在不同节点、可用区，甚至托管数据库服务上。虽然这种架构合理，但会给*每一次数据库查询*引入延迟。Open WebUI 每个请求会调用数据库多次，因此即使每次查询只有 10–20 ms 的网络延迟，在并发负载下也会累积成数秒的响应时间。

**症状：**
- 健康检查端点的响应时间很长，而不是近乎即时。
- 即使 CPU 和内存使用率看起来很低，简单 API 调用或普通聊天补全在并发负载下也会变慢。
- 本地开发/测试与云端生产环境之间存在明显性能差距。

**诊断：**
- 检查 Open WebUI Pod 与数据库之间的网络延迟。在 Pod 内运行：
  ```bash
  # 对于 PostgreSQL
  psql -h <db-host> -U <user> -c "SELECT 1" -d <database>

  # 或使用 ping/nc 检查原始延迟
  nc -zv <db-host> 5432
  ```
- **理想延迟目标：**数据库查询应以 **1–2 ms 或更低**为目标。如果到数据库的网络延迟超过 **5 ms**，则非常不建议用于生产部署，因为它很可能成为主要性能瓶颈。

**解决方案：**
1. **就近部署服务：**将 Open WebUI 和 PostgreSQL 部署在同一可用区，条件允许时甚至部署在同一节点池，以尽量减少网络跳数。
2. **托管数据库注意事项：**请注意，云端“一键式”托管数据库解决方案虽然可扩展，但与同一节点上的自托管数据库相比，通常会引入显著的网络延迟。必须谨慎考虑这种权衡。
3. **启用缓存：**使用 `ENABLE_BASE_MODELS_CACHE=True` 和其他[缓存选项](#2-caching--latency-optimization)，减少每个请求的重复工作。
4. **减少数据库写入：**将 [`DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL`](#user-active-status-write-throttling-set-this-on-every-deployment) 保持在 `60` 或更高。

### 磁盘 I/O 延迟（SQLite 与存储） {#disk-io-latency-sqlite--storage}

如果在云环境中使用 **SQLite**（默认），网络延迟可能会转化为**磁盘延迟**问题。

云存储（Azure Disks、AWS EBS、GCP Persistent Disks）的延迟通常显著高于本地 NVMe/SSD，IOPS 则更低，在较低层级的存储类型上尤其如此。

:::danger SQLite 本身不支持 NFS / SMB / Azure Files 上的 SQLite
此限制**并非**来自 Open WebUI，而是来自 **SQLite 上游**。SQLite 项目[明确说明](https://www.sqlite.org/faq.html#q5)，网络文件系统（NFS、SMB/CIFS 及类似系统）上的 SQLite 数据库**不受支持**：这些协议上的文件锁定不可靠，并发写入者**可能损坏数据库**。SQLite 文档明确警告不要这样使用，而 Open WebUI 因使用 SQLite 也继承了这一限制。

因此，对于 Open WebUI，**唯一受支持的存储配置是**：

- **PostgreSQL**：推荐用于任何多用户部署；对于不在本地直连 SSD 上的任何部署，则必须使用。这样可以完全规避网络存储上的 SQLite 问题。**或者**
- **本地直连 SSD / NVMe 上的 SQLite**：仅适用于单用户/小型部署。必须是主机上的**本地**磁盘；无论使用什么应用，SQLite 上游的指导都适用。

SQLite **不支持**以下存储（依据 SQLite 自身文档，而非 Open WebUI 的策略）：**NFS、SMB/CIFS、Azure Files、GlusterFS、CephFS、由对象存储支撑的 FUSE 挂载、网络 PVC、任何远程或低 IOPS 存储。**这包括由这些文件系统支撑的 Docker 绑定挂载和 Kubernetes PersistentVolumeClaim。除下述性能症状外，还会面临**数据库损坏**风险；同样，这是 SQLite 的限制，而非我们的策略。

如果存储不是本地 SSD/NVMe，**请使用 PostgreSQL**。

网络存储上的 SQLite 典型症状：

- `/api/config` 每次请求需要 **10 到 20 秒以上**
- `/api/v1/chats/?page=1` 和其他列表端点在负载下停滞**数分钟**
- OIDC / SSO 回调重定向回 Open WebUI 时卡住或一直“转圈”
- DEBUG 日志中 `aiosqlite` 与 `httpcore` 行之间存在长达数秒的间隔
- 日志显示 `PRAGMA journal_mode=WAL` 已开始，但始终没有完成
:::

#### 异步后端为何会让网络存储上的 SQLite 突然失效 {#why-the-async-backend-makes-network-storage-sqlite-fail-suddenly}

Open WebUI 异步执行数据库调用，因此许多调用会同时进行。在慢速存储上，它们会不断堆积，直到应用停止响应。`DATABASE_POOL_SIZE` 等设置只能缓解症状；存储才是根本原因。

**核心是 `fsync()`。**SQLite 通过同步刷新到磁盘来保证持久性（默认 WAL 模式和 `synchronous=NORMAL` 下，在每次检查点时执行）。`fsync` 延迟完全取决于文件所在位置：

| 存储 | 典型 `fsync` 延迟 |
| :--- | :--- |
| 本地 NVMe | 约 100 μs |
| 本地 SATA SSD | 100 μs 到数 ms |
| 本地 HDD | 约 10 ms |
| NFS / CephFS / Azure Files（SSD 支撑） | 50 到 500 ms |
| NFS（HDD 支撑或高延迟） | 数百 ms 到数秒 |

**并发会放大延迟。**每次数据库调用都会从 SQLite 连接池取出一个连接（未设置 `DATABASE_POOL_SIZE` 时为 512 个连接，外加 10 个溢出连接）。在本地 SSD 上，连接约在 1 ms 内归还连接池。在 NFS 或 CephFS 上，每次刷新会让连接被占用数百 ms，写入者在文件锁上排队，请求不断堆积。连接池耗尽后，每个后续请求都会等待 `DATABASE_POOL_TIMEOUT`（30 秒），然后失败：

```
sqlalchemy.exc.TimeoutError: QueuePool limit of size 512 overflow 10 reached,
connection timed out, timeout 30.00
```

更大的连接池只会推迟崩溃点：更多连接意味着对同一存储执行更多并发慢速刷新。

**WAL 在 NFS 上尤其不可靠。**SQLite 的 WAL 模式使用由 `mmap` 支撑的 `-shm` 文件进行跨进程协调。[SQLite 上游明确说明](https://www.sqlite.org/faq.html#q5)，NFS 上的 `mmap` 不可靠：某些 NFS 版本甚至完全不支持。并发时会遇到实际的锁异常（死锁、`PRAGMA journal_mode=WAL` 开始却永不完成、简单查询停滞数分钟）。

**PostgreSQL 为何能解决问题：**PostgreSQL 服务器基于自己的本地存储管理自己的 I/O 并发。应用通过网络套接字访问它，这一跳的开销比 NFS `fsync` 低几个数量级，而且 PostgreSQL 专为并发写入者设计：没有文件级锁定、跨进程 `mmap` 协调或网络文件系统上的 WAL 限制。Open WebUI 通过异步 `psycopg` 驱动与其通信。

**症状：**
- 单用户时性能尚可，但并发增加后迅速下降。
- CPU 使用率低，但服务器“I/O Wait”很高。

**解决方案（按可靠性排序）：**

1. **最佳方案：迁移到 PostgreSQL。**对于并非严格使用本地磁盘的单用户部署，这是推荐的解决方案；对于任何使用远程/网络/低 IOPS 存储的部署，则必须这样做。设置：
   ```bash
   DATABASE_URL=postgresql://user:password@host:5432/webui
   ```
2. **可接受方案：将 `webui.db` 移到本地直连 SSD/NVMe。**仅适用于单用户或极小型部署。将主机**本地** SSD/NVMe 上的目录绑定挂载到 `/app/backend/data`。切勿为其使用 NFS、SMB、Azure Files 或任何其他网络存储类型。
3. **仅限临时方案：保留 NFS 上的 SQLite 并降低并发。**如果无法立即迁移存储或更换数据库，请设置：
   ```bash
   DATABASE_POOL_SIZE=1
   DATABASE_SQLITE_PRAGMA_BUSY_TIMEOUT=30000
   ```
   `DATABASE_POOL_SIZE=1` 将 SQLite 连接池缩减为一个连接加 10 个溢出连接，因此同时访问存储的写入者大幅减少，以并发能力换取稳定性。`DATABASE_SQLITE_PRAGMA_BUSY_TIMEOUT=30000` 给 SQLite 30 秒来获取锁，而 NFS 授予锁的耗时可能比本地磁盘长得多。这**不是受支持的长期配置**：预计会出现吞吐量下降、间歇性停滞和潜在损坏。请尽快计划迁移到 PostgreSQL 或本地 SSD。重启后预热连接池可能短暂表现正常，但问题会在负载下再次出现。
4. **云块存储：**将云块存储用于 Open WebUI 数据卷（供 PostgreSQL 或应用本身使用）时，使用 SSD 支撑的**块存储**类型（例如 Azure Disks 的 `Premium_LRS`、AWS EBS 的 `gp3`、GCP 的 `pd-ssd`）。任何数据库工作负载（包括 SQLite）都应避免使用基于“文件”的存储类型（如 `azurefile-csi`）。

### 其他云端特定注意事项 {#other-cloud-specific-considerations}

| 因素 | 影响 | 缓解措施 |
|--------|--------|------------|
| **可突增 VM**（例如 Azure B 系列、AWS T 系列） | 持续负载下发生 CPU 节流，即使报告的使用率很低 | 使用标准/计算优化型节点池 |
| **DNS 解析** | 每个外部请求都有 CoreDNS 开销 | 确保 CoreDNS 扩展得当；考虑节点本地 DNS 缓存 |
| **服务网格 Sidecar** | Istio/Linkerd 代理为每个请求增加延迟 | 检查 Pod 中是否有意外的 Sidecar 容器 |
| **网络策略** | CNI 处理开销 | 尽可能审查并简化网络策略 |
| **跨可用区流量** | 服务跨可用区时产生延迟和出口费用 | 将服务固定在同一可用区 |

---

## 资源效率（降低内存占用） {#resource-efficiency-reducing-ram}

如果在内存受限设备（Raspberry Pi、小型 VPS）上部署，请使用以下策略防止应用因 OOM（内存不足）错误而崩溃。

### 精简镜像 {#the-slim-image}

如果模型、嵌入、文档提取和语音功能均作为外部服务运行，请使用精简镜像：`ghcr.io/open-webui/open-webui:slim`（也可使用 `:main-slim`，或用 `:<version>-slim` 固定发行版本）。它是使用 `USE_SLIM=true` 构建的标准镜像，具体表现为：

- 安装精简的 Python 依赖集：不包含 PyTorch、SentenceTransformers、Transformers 或 faster-whisper，不包含 pgvector 以外的向量数据库客户端，不包含 Playwright、本地 PDF 和 Office 解析器，也不包含 Azure 或 Google Cloud 存储 SDK
- 不安装 pandoc、ffmpeg、git 和编译器系统软件包
- 不内置模型（标准镜像随附嵌入模型、辅助嵌入模型、Whisper `base` 和 tiktoken 编码）
- 提供代码解释器的 Pyodide 运行时，但不附带其 Python 软件包

**效果：**amd64 下载大小约为 200 MB，而标准镜像约为 1.6 GB。不会加载任何本地模型或机器学习库，因此无论启用哪些功能，内存都保持在应用自身的基线水平，额外副本也不会增加模型副本。实测空闲内存数值请参阅[内存占用](/getting-started/quick-start#slim-memory-usage)。

**精简镜像上的重要设置：**

| 功能 | 设置 |
|---|---|
| 嵌入 | `RAG_EMBEDDING_ENGINE=openai`、`azure_openai` 或 `ollama`。本地引擎不可用 |
| 向量数据库 | `VECTOR_DB` 默认为 `pgvector`。设置 `PGVECTOR_DB_URL`，或使用启用了 pgvector 扩展的 PostgreSQL `DATABASE_URL`。其他存储会在首次使用时失败 |
| 文档 | PDF 和 Office 文件使用 `CONTENT_EXTRACTION_ENGINE`。文本、Markdown、CSV、HTML 和 XML 在进程内读取 |
| 重排序 | `RAG_RERANKING_ENGINE=external`，或者将重排序模型留空以使用余弦评分 |
| 语音 | 外部 `AUDIO_STT_ENGINE`，或使用 `web` 进行浏览器识别。外部 `AUDIO_TTS_ENGINE`，或使用默认浏览器语音。`BYPASS_PYDUB_PREPROCESSING` 始终启用 |
| 数据库和文件 | SQLite 或 PostgreSQL 上的 `DATABASE_URL`，`STORAGE_PROVIDER=local` 或 `s3`。其他任何配置都会阻止启动 |

有两项内容在运行时下载而非随镜像提供：首次使用 `token` 文本拆分器时下载 tiktoken 编码（缓存于 `TIKTOKEN_CACHE_DIR`），以及浏览器从 `cdn.jsdelivr.net` 下载代码解释器的 Python 软件包。完整功能表请参阅[为何选择精简镜像？](/getting-started/quick-start#what-slim-leaves-out)。

### 1. 转移辅助模型（仅限本地部署） {#1-offload-auxiliary-models-local-deployments-only}

在标准镜像上，Open WebUI 可以在自身进程内运行 RAG 和语音模型。**本节仅与在本地运行这些模型的情况有关。**

#### RAG 嵌入 {#rag-embeddings}
-   **低配置建议**：
    *   **选项 A（最简单）**：保留默认 **SentenceTransformers**（all-MiniLM-L6-v2）。它很轻量，可在 CPU 上运行，比在同一个 Raspberry Pi 上运行完整 Ollama 实例高效得多。
    *   **选项 B（最佳性能）**：使用**外部 API**（OpenAI/云端）。

-   **配置**：
    *   **管理员面板**：`Settings > Documents > Embedding Model Engine`（设置 > 文档 > 嵌入模型引擎；管理员区域）
    *   **环境变量**：`RAG_EMBEDDING_ENGINE=openai`（完全转移嵌入计算）

#### 语音转文本（STT） {#speech-to-text-stt}
默认引擎是本地 Whisper，首次转录时加载到 Open WebUI 进程中并持续驻留。

-   **建议**：使用 **Web API**（基于浏览器）。它使用用户设备，不占用服务器内存。
-   **配置**：
    *   **管理员面板**：`Settings > Audio > STT Engine`（设置 > 音频 > STT 引擎；管理员区域）
    *   **环境变量**：`AUDIO_STT_ENGINE=web`

-   **绕过音频预处理（转交给 STT 服务提供方）**：如果使用的外部 STT 引擎（OpenAI、Deepgram、Azure、Mistral）已经接受原始音频并能在服务端处理格式转换，请设置 `BYPASS_PYDUB_PREPROCESSING=true`。这会跳过 Open WebUI 基于 pydub 的 MP3 转换、压缩和分块，消除每次上传中的一个高 CPU 开销步骤，并降低大文件延迟。仅当确信服务提供方能正确处理未经处理的音频时才启用。

### 2. 禁用未使用的功能 {#2-disable-unused-features}

在标准镜像上，以下功能会将本地模型加载到 Open WebUI 进程中。请保持禁用或将其指向外部服务：

-   **重排序**：启用混合搜索（`ENABLE_RAG_HYBRID_SEARCH=True`）并在本地引擎上设置 `RAG_RERANKING_MODEL` 时，每个工作进程都会在启动时加载重排序模型。请使用 `RAG_RERANKING_ENGINE=external`，或将模型留空。
-   **本地文本转语音**：`AUDIO_TTS_ENGINE=transformers` 会在首次使用时加载语音模型。请选择外部引擎。

图像生成和代码解释器在外部引擎或浏览器中运行，因此不会在服务器内存中保留模型。

### 3. 禁用后台任务 {#3-disable-background-tasks}

如果资源占用是关键问题，请禁用会持续触发模型推理的自动化功能。

**建议顺序（按影响从高到低）：**

1.  **自动补全**：`ENABLE_AUTOCOMPLETE_GENERATION=False`（默认值；保持关闭，它会在每次按键时触发）
    *   管理员：`Settings > Interface > Autocomplete`（设置 > 界面 > 自动补全；管理员区域）
2.  **后续问题**：`ENABLE_FOLLOW_UP_GENERATION=False`
    *   管理员：`Settings > Interface > Follow-up`（设置 > 界面 > 后续问题；管理员区域）
3.  **标题生成**：`ENABLE_TITLE_GENERATION=False`
    *   管理员：`Settings > Interface > Chat Title`（设置 > 界面 > 聊天标题；管理员区域）
4.  **标签生成**：`ENABLE_TAGS_GENERATION=False`

### 4. 将 ChromaDB 替换为 Milvus Lite（小型部署） {#4-swap-chromadb-for-milvus-lite-small-deployments}

在 Raspberry Pi 或小型 VPS 上，默认本地 ChromaDB 通常是进程中仅次于模型的最大内存占用者。Milvus Lite 与 ChromaDB 一样是嵌入式数据库，不需要服务器或额外容器，并能以明显更少的磁盘和常驻内存保存相同内容。切换前请阅读以下限制，因为它不适用于任何批量摄取文档的部署。

:::danger 不适用于批量文档摄取

只有知识库较小且规模基本不变时，节省磁盘和内存才有价值。如果计划上传大型语料库或持续添加文件，请继续使用 ChromaDB 或改用 Milvus 服务器。

Open WebUI 在存储文件前会查询其内容哈希，避免重复索引同一文档。该查询按元数据字段过滤，而 Milvus Lite 没有元数据索引，因此每次都会读取整个集合。所以，已有内容越多，添加一个文件的成本越高，摄取整个语料库的时间会随其规模的平方增长。

使用 Open WebUI 自身的集合架构，对本地 Milvus Lite 数据库实测，单次哈希查询耗时为：

| 集合中的行数 | 单次查询耗时 |
| --- | --- |
| 500 | 0.72s |
| 1,000 | 1.43s |
| 2,000 | 2.94s |
| 3,000 | 4.51s |
| 4,000 | 7.94s |

ChromaDB 上的相同查询在各种规模下都保持稳定（500 行时为 0.024s，4,000 行时为 0.002s），因为 ChromaDB 将元数据保存在 SQLite 中并建立了索引。

在同一台机器上使用相同设置和相同嵌入服务提供方进行端到端测试，Milvus Lite 摄取 Markdown 文件的速度为每分钟 8 个文件，并随集合增长降至每分钟 5 个以下；ChromaDB 则为每分钟 200 到 368 个文件。根据测得的逐行成本外推，28,000 个文件的语料库在 Milvus Lite 上大约需要 170 小时。

这仅涉及摄取。搜索性能未经测量，Milvus 服务器也未经测量；它与此处描述的嵌入式 Milvus Lite 是不同的部署方式。

:::

节省来自多租户，因此切换时应同时启用：

```
VECTOR_DB=milvus
ENABLE_MILVUS_MULTITENANCY_MODE=True
```

保持 `MILVUS_URI` 未设置。默认值已经指向数据目录内的嵌入式数据库，将该变量设置为该路径会阻止应用启动。原因以及必须事先存在的目录，请参阅 [`MILVUS_URI`](/reference/env-configuration#milvus_uri-required)。

启用多租户后，用户共享一组集合，每个用户的向量在集合内分区。未启用时，每个用户和每个知识库都有自己的集合，这会使占用的增长速度远快于内容本身。在存储空间小或按存储计费的设备上，这通常是转移嵌入模型之后可实现的最大单项缩减。

这适用于单实例部署。Milvus Lite 是由一个进程持有的文件，因此添加副本需要改用 Milvus 服务器。

### 5. 资源受限容器中的 SQLite 内存占用 {#5-sqlite-memory-footprint-on-constrained-containers}

即使在快速本地 SSD/NVMe 上，这个内存问题**也同样存在**（网络存储上的延迟和损坏问题请参阅[磁盘 I/O 延迟](#disk-io-latency-sqlite--storage)）。它是小型部署中“编辑模型或知识库权限时容器被 OOM 终止”的最常见原因。

在 SQLite 上，当 `DATABASE_POOL_SIZE` 未设置或为 `0` 时，连接池最多持有 **512** 个连接加 10 个溢出连接。`DATABASE_POOL_MAX_OVERFLOW` 对 SQLite 无效。每个池化连接都会独立地：

- 按需将**自己的** SQLite 页面缓存增大到 `DATABASE_SQLITE_PRAGMA_CACHE_SIZE` 上限。默认值 `-65536` 约等于**每个连接 64 MB 已提交内存**。
- 按 `DATABASE_SQLITE_PRAGMA_MMAP_SIZE` 对数据库文件进行内存映射，默认**每个连接 256 MB**。这部分大多是虚拟且由文件支撑的内存，但会增大 `total-vm`，其常驻部分也计入 cgroup 内存限制。
- 在**自己的 OS 线程**上运行（异步 SQLite 驱动每个连接使用一个线程），从而增加线程栈内存。

因此，峰值内存随**同时活跃连接数**扩展。一个会派生许多短生命周期连接的工作流，例如编辑模型或知识库访问控制后重新加载长模型列表，可能会短暂激活数十个连接。在小型容器上，仅页面缓存（活跃连接数乘以最多 64 MB）就会超过限制，导致 OOM killer 终止进程。性能分析器（py-spy、memray）会将几乎所有开销归因于 `aiosqlite/core.py`，每个连接都在这里分配缓存并生成行。这是多连接的特征，与任何远程向量数据库无关。

:::tip 资源受限/低配置容器（SQLite）
对于任何内存限制严格的部署（小型 VPS、Raspberry Pi、Docker `mem_limit` 为 1 到 2 GB），请明确设置：

```bash
DATABASE_POOL_SIZE=8                       # 8 个连接加 10 个溢出连接，而不是 512 加 10
DATABASE_SQLITE_PRAGMA_CACHE_SIZE=-2000    # 每个连接约 2 MB 页面缓存，而不是约 64 MB
DATABASE_SQLITE_PRAGMA_MMAP_SIZE=0         # 禁用每连接 mmap 窗口
```

还要为容器留出合理的余量。对于任何执行 RAG 或嵌入的环境，**1 GB 都非常低**；目标应为 **2 GB 或更多**。在低配置硬件上保持 `DATABASE_ENABLE_SESSION_SHARING=False`（默认值）（请参阅[数据库会话共享](#database-session-sharing)）。

对于多用户或不断增长的部署，持久的解决方案是 **PostgreSQL**。
:::

### 6. 大型文档上传 {#6-large-document-uploads}

处理文档时，其文本块及嵌入会保留在内存中，同时写入向量数据库。

-   **环境变量**：`RAG_EMBEDDING_BUFFER_SIZE`（默认 `1000`）。文本块按此数量分批嵌入和保存，因此超大文档不会同时持有全部嵌入。在小型设备上降低该值可减少峰值内存。请参阅 [`RAG_EMBEDDING_BUFFER_SIZE`](/reference/env-configuration#rag_embedding_buffer_size)。
-   **环境变量**：`RAG_FILE_MAX_SIZE`（单位为 MB，默认未设置）。在提取和嵌入之前拒绝更大的上传。请参阅 [`RAG_FILE_MAX_SIZE`](/reference/env-configuration#rag_file_max_size)。

---

## 推荐配置方案 {#recommended-configuration-profiles}

### 方案 1：最高隐私性（低性能硬件/RPi） {#profile-1-maximum-privacy-weak-hardwarerpi}
*目标：100% 本地运行，Raspberry Pi / 低于 4GB 内存。*

1.  **嵌入**：默认（SentenceTransformers）。*在 CPU 上运行，轻量。*
2.  **音频**：`AUDIO_STT_ENGINE=web`。*服务器零负载。*
3.  **任务模型**：禁用，或使用微型模型（`qwen3.5:0.8b`）。
4.  **扩展**：保持默认 `THREAD_POOL_SIZE`（40）。
5.  **禁用**：后续问题、本地重排序和本地文本转语音。保持自动补全关闭（默认）。
6.  **数据库**：SQLite 即可，但应限制其内存：`DATABASE_POOL_SIZE=8`、`DATABASE_SQLITE_PRAGMA_CACHE_SIZE=-2000`、`DATABASE_SQLITE_PRAGMA_MMAP_SIZE=0`。未设置的 SQLite 连接池默认值很大（512）；请参阅[资源受限容器中的 SQLite 内存占用](#5-sqlite-memory-footprint-on-constrained-containers)。

### 方案 2：单用户发烧友 {#profile-2-single-user-enthusiast}
*目标：最高质量与速度，本地 + 外部 API。*

1.  **嵌入**：`RAG_EMBEDDING_ENGINE=openai`（或在快速服务器上使用 `ollama` 搭配 `nomic-embed-text`）。
2.  **任务模型**：`gpt-5.6-luna` 或 `gemini-3.5-flash-lite`。
3.  **缓存**：`MODELS_CACHE_TTL=300`。
4.  **向量数据库**：PGVector（推荐）或 ChromaDB（除非处理海量数据，否则两者均可）。

### 方案 3：大规模/企业 {#profile-3-high-scale--enterprise}
*目标：大量并发用户，稳定性优先于持久性。*

1.  **数据库**：**PostgreSQL**（必需）。
2.  **内容提取**：**Tika**、**Docling** 或**任何其他外部文档加载器**（必需：默认 pypdf 会泄漏内存）。请参阅[内容提取引擎](#content-extraction-engine)。
3.  **嵌入**：**外部**：`RAG_EMBEDDING_ENGINE=openai`、`azure_openai` 或 `ollama`（必需：默认 SentenceTransformers 在大规模部署中占用过多内存）。请参阅[嵌入引擎](#embedding-engine)。
4.  **工具调用**：**原生模式**（默认；不支持旧版模式，且旧版模式会破坏 KV 缓存）。所有模型都应配置为原生模式。请参阅[工具调用模式](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)。
5.  **线程池**：`THREAD_POOL_SIZE=2000`（防止超时）。
6.  **流式传输**：`CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE=7`（降低 CPU 和网络负载）。
7.  **镜像**：向量数据库为 PGVector 时使用 `:slim`。此方案中的所有功能均作为外部服务运行，因此标准镜像中的本地模型栈不会被使用。请参阅[精简镜像](#the-slim-image)。
8.  **向量数据库**：**Milvus**、**Qdrant** 或 **PGVector**。**不要使用 ChromaDB 的默认本地模式**：其 SQLite 后端会在多副本访问下崩溃。
9.  **任务模型**：外部/托管（转移计算负载）。
10. **缓存**：`ENABLE_BASE_MODELS_CACHE=True`、`MODELS_CACHE_TTL=300`、`ENABLE_QUERIES_CACHE=True`。
11. **Redis**：单个实例，设置 `timeout 1800` 和较高的 `maxclients`（10000+）。请参阅下面的 [Redis 调优](#redis-tuning)。
12. **压缩**：**如果**负载均衡器/Ingress/CDN 压缩响应，则设置 `ENABLE_COMPRESSION_MIDDLEWARE=False`（改为在代理层启用）。每个工作进程可节省约 3–4% CPU。请参阅 [HTTP 响应压缩](#http-response-compression)。
13. **WebSocket 心跳**：`WEBSOCKET_HEARTBEAT_INTERVAL=60`。将每个打开标签页的空闲心跳流量减半，代价是断开连接的用户会在活跃计数中多停留一段时间。请参阅 [WebSocket 心跳](#websocket-heartbeats)。
14. **WebSocket 压缩**：`UVICORN_WS_PER_MESSAGE_DEFLATE=false`。流式传输每个 token 发送一个极小的帧，对每个帧分别压缩会按订阅者消耗 CPU，却几乎无法节省流量。请参阅 [WebSocket 帧压缩](#websocket-frame-compression)。
15. **JSON 编码器**：`ENABLE_ORJSON=True`，默认启用；保持启用。降低集群部署中最繁重的 JSON 工作成本：编码 Socket.IO 事件、解析流式服务提供方数据块，以及保存和打开完整聊天。请参阅 [JSON 编码器](#json-encoder)。

#### Redis 调优 {#redis-tuning}

对于绝大多数部署，包括拥有数千名用户的部署，单个 Redis 实例就足够。**除非有特定的高可用要求，否则几乎肯定不需要 Redis Cluster 或 Redis Sentinel**。

每个工作进程还会保留从 Redis 读取并解析的模型列表，用于过滤器查询；每 1000 个模型，每个工作进程约占用 3 MB 内存。

正在流式传输的响应会保存在 Redis 中，以便浏览器重连后恢复；响应完成后会删除该条目。工作进程在流式传输中途被终止而留下的条目，会在 `REDIS_RESPONSE_STREAM_TTL` 秒（默认 `3600`）后过期。Redis 内存紧张时可降低该值；`0` 表示永久保留。请参阅 [`REDIS_RESPONSE_STREAM_TTL`](/reference/env-configuration#redis_response_stream_ttl)。

会导致不必要扩展的常见 Redis 配置问题：

| 问题 | 症状 | 解决方法 |
|---|---|---|
| **过期连接** | Redis 连接耗尽或内存无限增长 | 在 redis.conf 中设置 `timeout 1800`（30 分钟后终止空闲连接） |
| **maxclients 过低** | `max number of clients reached` 错误 | 设置为 `maxclients 10000`，或采用更高的客户端上限 |
| **无连接限制** | Open WebUI Pod 可能积累永不关闭的连接 | 在 Redis 客户端配置中结合使用 `timeout` 与连接池限制 |
| **Pub/Sub 输出缓冲区限制过低** | WebSocket 流停滞、`Cannot publish to redis... giving up`，或发布大型 Socket.IO 事件时 Redis 日志记录客户端输出缓冲区断开连接 | 增大 Redis 的 `client-output-buffer-limit ... pubsub ...` 设置，根据 WebSocket 负载和可用 Redis 内存确定大小 |

有关 Pub/Sub 输出缓冲区限制，包括检查命令和配置示例，请参阅 [WebSocket Pub/Sub 缓冲区限制](/tutorials/integrations/redis#websocket-pubsub-buffer-limits)。

---

## 常见反模式 {#common-anti-patterns}

以下是真实环境中导致组织大幅过度配置基础设施的错误做法：

| 反模式 | 后果 | 解决方法 |
|---|---|---|
| **在生产环境使用默认内容提取器** | pypdf 泄漏内存 → 容器不断重启 → 添加更多副本进行补偿 | 切换到 Tika 或 Docling（`CONTENT_EXTRACTION_ENGINE=tika`） |
| **大规模运行 SentenceTransformers** | 每个工作进程加载 PyTorch 和自己的嵌入模型副本 → 内存占用激增 → 添加更多机器 | 使用外部嵌入（`RAG_EMBEDDING_ENGINE=openai`、`azure_openai` 或 `ollama`），或使用[精简镜像](#the-slim-image) |
| **单个 Redis 足够时却使用 Redis Cluster** | 副本过多 → 连接过多 → Redis 无法处理 → 部署 Redis Cluster 进行补偿 | 解决根本原因（减少副本、`timeout 1800`、`maxclients 10000`） |
| **通过扩展副本掩盖内存泄漏** | 进程泄漏 → OOM 终止 → 自动扩容器添加更多 Pod → 更多 Redis 连接 → Redis 过载 | 先解决泄漏（内容提取、嵌入引擎），再合理确定规模 |
| **使用旧版（基于提示词）工具调用** | 不支持旧版模式；注入的提示词破坏 KV 缓存 → 延迟更高 → 每个请求需要更多资源；无法访问内置系统工具 | 将每个模型切换到原生模式 |
| **未配置 Redis 过期连接超时** | 连接无限积累 → Redis OOM → 部署 Redis Cluster | 在 redis.conf 中添加 `timeout 1800` |
| **在 Actions/Filters 中使用 base64 编码图标** | 每次页面加载时，图标数据都会嵌入发送给前端的每个模型的 `/api/models` 响应中。20 个模型各有 3 个 Action，每个使用 500 KB base64 图标，等于每个请求增加 **30 MB 负载** → 前端加载缓慢、带宽占用高、后端承受不必要的内存压力 | 将图标托管为静态文件，并在 `icon_url` / `self.icon` 中通过 URL 引用。请参阅 [Action 函数 icon_url 警告](/features/extensibility/plugin/functions/action#example-specifying-action-frontmatter) |
| **在微型容器上使用默认 SQLite 连接池** | 未设置 `DATABASE_POOL_SIZE` 会回退到 512 个连接加 10 个溢出连接的连接池；每个连接会扩展自己的约 64 MB 页面缓存和 256 MB mmap 窗口，因此派生大量连接的工作流（编辑模型/知识库权限、重新加载长模型列表）会让 1 GB 容器被 OOM 终止 | 限制 `DATABASE_POOL_SIZE`（例如 `8`），设置 `DATABASE_SQLITE_PRAGMA_CACHE_SIZE=-2000` 和 `DATABASE_SQLITE_PRAGMA_MMAP_SIZE=0`，并为容器提供至少 2 GB 内存。请参阅 [SQLite 内存占用](#5-sqlite-memory-footprint-on-constrained-containers) |
| **生产环境长期保持 `GLOBAL_LOG_LEVEL=DEBUG`** | 为排查问题设置一次后再未恢复。`DEBUG` 是运行成本最高的级别：它添加的每条消息都会实际构建并写入，包括每个请求的完整聊天请求负载 → 除日志量外还浪费 CPU，而且提示词和用户内容会留在日志中 | 恢复为 `INFO`（默认值），或在不使用信息级日志行的繁忙实例上设置为 `WARNING`。需要重启。请参阅[日志级别](#log-level) |

---

## 环境变量参考 {#environment-variable-references}

有关所有可用变量的详细信息，请参阅[环境配置](/reference/env-configuration)指南。

| 变量 | 说明与链接 |
| :--- | :--- |
| `TASK_MODEL` | [任务模型（本地）](/reference/env-configuration#task_model) |
| `TASK_MODEL_EXTERNAL` | [任务模型（外部）](/reference/env-configuration#task_model_external) |
| `TASK_MODEL_PARAMS` | [任务模型参数](/reference/env-configuration#task_model_params) |
| `ENABLE_BASE_MODELS_CACHE` | [缓存模型列表](/reference/env-configuration#enable_base_models_cache) |
| `MODELS_CACHE_TTL` | [模型缓存 TTL](/reference/env-configuration#models_cache_ttl) |
| `ENABLE_QUERIES_CACHE` | [查询缓存](/reference/env-configuration#enable_queries_cache) |
| `DATABASE_URL` | [数据库 URL](/reference/env-configuration#database_url) |
| `CHAT_RESPONSE_STREAM_DELTA_CHUNK_SIZE` | [流式块大小](/reference/env-configuration#chat_response_stream_delta_chunk_size) |
| `ENABLE_COMPRESSION_MIDDLEWARE` | [HTTP 响应压缩](/reference/env-configuration#enable_compression_middleware) |
| `ENABLE_ORJSON` | [JSON 编码器](/reference/env-configuration#enable_orjson) |
| `GLOBAL_LOG_LEVEL` | [日志级别](/reference/env-configuration#global_log_level) |
| `THREAD_POOL_SIZE` | [线程池大小](/reference/env-configuration#thread_pool_size) |
| `AIOHTTP_CLIENT_TIMEOUT` | [HTTP 客户端超时](/reference/env-configuration#aiohttp_client_timeout) |
| `AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER` | [DNS 解析器](/reference/env-configuration#aiohttp_client_async_dns_resolver) |
| `RAG_EMBEDDING_ENGINE` | [嵌入引擎](/reference/env-configuration#rag_embedding_engine) |
| `CONTENT_EXTRACTION_ENGINE` | [内容提取引擎](/reference/env-configuration#content_extraction_engine) |
| `AUDIO_STT_ENGINE` | [STT 引擎](/reference/env-configuration#audio_stt_engine) |
| `BYPASS_PYDUB_PREPROCESSING` | [绕过 pydub 音频预处理](/reference/env-configuration#bypass_pydub_preprocessing) |
| `RAG_RERANKING_ENGINE` | [重排序引擎](/reference/env-configuration#rag_reranking_engine) |
| `RAG_EMBEDDING_BUFFER_SIZE` | [嵌入缓冲区大小](/reference/env-configuration#rag_embedding_buffer_size) |
| `VECTOR_DB` | [向量数据库](/reference/env-configuration#vector_db) |
| `ENABLE_AUTOCOMPLETE_GENERATION` | [自动补全](/reference/env-configuration#enable_autocomplete_generation) |
| `DATABASE_ENABLE_SESSION_SHARING` | [数据库会话共享](/reference/env-configuration#database_enable_session_sharing) |
| `DATABASE_USER_ACTIVE_STATUS_UPDATE_INTERVAL` | [在线状态写入节流](/reference/env-configuration#database_user_active_status_update_interval) |
| `DATABASE_POOL_SIZE` | [连接池大小](/reference/env-configuration#database_pool_size) |
| `DATABASE_SQLITE_PRAGMA_CACHE_SIZE` | [SQLite 页面缓存大小](/reference/env-configuration#database_sqlite_pragma_cache_size) |
| `DATABASE_SQLITE_PRAGMA_MMAP_SIZE` | [SQLite mmap 大小](/reference/env-configuration#database_sqlite_pragma_mmap_size) |

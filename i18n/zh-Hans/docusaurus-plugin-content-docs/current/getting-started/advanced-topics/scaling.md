---
sidebar_position: 2
title: "扩展 Open WebUI"
---

# 扩展 Open WebUI

Open WebUI 可从单用户扩展到覆盖整个组织的部署。它采用**无状态、容器优先的架构**，因此扩展方式与现代 Web 应用程序相同：先将状态迁移到共享服务，再在负载均衡器后添加实例。

本文从宏观层面介绍这些步骤。有关变量的准确详情，请参阅[环境变量参考](/reference/env-configuration)。有关单个实例的调优，请参阅[优化、性能与内存用量](/troubleshooting/performance)。扩展部署出现故障时，请参阅[扩展与高可用故障排除](/troubleshooting/multi-replica)。

---

## 了解默认配置 {#understanding-the-defaults}

Open WebUI 默认采用**自包含的单实例部署**。标准 Docker 镜像包括：

- **嵌入式 SQLite**，将应用程序数据存储在持久卷中
- **嵌入式 ChromaDB**（同样由 SQLite 支持），用于 RAG 嵌入
- **本地文件存储**（`STORAGE_PROVIDER=local`），将上传内容保存在 `DATA_DIR/uploads` 下
- **单个 Uvicorn 工作进程**，无需外部数据库或 Redis

这使部署耗时和运维开销保持在较低水平，并简化了**离线隔离部署**。

**水平扩展需要共享持久化和协调机制**，使每个副本都处理相同的数据。添加副本之前，请切换到 PostgreSQL 和客户端-服务器模式的向量数据库，配置共享文件存储并添加 Redis。随后，应用层即可在负载均衡器后独立扩展。

:::warning 外部数据库不会共享上传的文件
PostgreSQL 存储文件元数据和存储路径，向量数据库存储嵌入。两者都不存储文件本身。添加副本之前，请配置每个副本均可访问的**外部对象存储（S3、GCS 或 Azure Blob）**或**共享文件系统**。请参阅[步骤 5](#step-5-share-file-storage-across-instances)。
:::

---

## 步骤 1：切换到 PostgreSQL {#step-1-switch-to-postgresql}

**适用时机：**你计划运行多个 Open WebUI 实例，或者 SQLite 文件不在本地连接的 SSD/NVMe 上。

:::tip 本地磁盘上的单副本部署无需此步骤
对于单副本部署、个人使用、评估、家庭实验室和小团队，**只要数据库文件位于本地连接的 SSD/NVMe 上**，SQLite 就足够了。可直接跳转到后续你需要的步骤。
:::

SQLite 将所有内容存储在单个文件中，无法很好地处理多个进程的并发写入。PostgreSQL 支持大量同时连接。

**操作步骤：**

将 [`DATABASE_URL`](/reference/env-configuration#database_url) 设置为你的 PostgreSQL 服务器：

```
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
```

使用普通的 `postgresql://` URL。Open WebUI 会自行选择异步驱动程序（psycopg 3）。

**需要了解的要点：**

- Open WebUI **不会**在数据库之间迁移数据，因此请在 SQLite 中存有生产数据之前规划好这一步。
- **连接池。**未设置 [`DATABASE_POOL_SIZE`](/reference/env-configuration#database_pool_size) 时，每个进程使用 SQLAlchemy 默认的 5 个连接和 10 个溢出连接。设置 `DATABASE_POOL_SIZE` 后，溢出连接数的默认值会降为 `0`，因此也要设置 [`DATABASE_POOL_MAX_OVERFLOW`](/reference/env-configuration#database_pool_max_overflow)。`DATABASE_POOL_SIZE=0` 会禁用连接池。对于繁忙实例，`DATABASE_POOL_SIZE=15` 配合 `DATABASE_POOL_MAX_OVERFLOW=20` 是一个不错的起点。
- **按数据库服务器规划连接预算。**启用 PostgreSQL 连接池后，每个工作进程都有一个同步应用程序连接池和一个异步应用程序连接池。使用 `VECTOR_DB=pgvector` 时，未设置的 `PGVECTOR_DB_URL` 默认为 `DATABASE_URL`。即使指向同一服务器，pgvector 也会为该 URL 创建独立的引擎。统计连接到每台服务器的连接池数量，再乘以所有副本的工作进程总数。有关示例，请参阅 [PostgreSQL 连接池大小](/reference/env-configuration#database_pool_size)。
- 有关单实例连接池调优，请参阅[连接池大小](/troubleshooting/performance#connection-pool-sizing)。

有关凭据处理和静态加密，请参阅加固指南的[数据库部分](/getting-started/advanced-topics/hardening#database)。

### 为什么网络存储上的 SQLite 一旦扩展（或升级）就会失败 {#why-sqlite-on-network-storage-fails-the-moment-you-scale-or-upgrade}

NFS、CephFS、Azure Files 或网络支持的 Kubernetes PVC 上的 SQLite 在低负载下可以运行，但会在并发情况下失败：连接池超时、`database is locked`，以及简单查询停滞数秒甚至数分钟。每次提交都要等待缓慢的网络 `fsync`，而 SQLite 的文件锁在[网络文件系统上不可靠](https://www.sqlite.org/faq.html#q5)。增大连接池只会让情况更糟。

只要 SQLite 仍位于网络存储上，任何设置都无法解决此问题。请切换到 PostgreSQL（本步骤），或者在单节点部署中将 `webui.db` 移到本地 SSD/NVMe。上传内容和 RAG 文件可以保留在共享文件系统上。有关其机制，请参阅[磁盘 I/O 延迟](/troubleshooting/performance#disk-io-latency-sqlite--storage)。有关症状和临时缓解办法，请参阅[数据库损坏/“Locked”错误](/troubleshooting/multi-replica#4-database-corruption--locked-errors)。

---

## 步骤 2：添加 Redis {#step-2-add-redis}

**适用时机：**你运行多个 Open WebUI 实例。

Redis 使所有实例能够相互协调。它承担两个角色：

- [`REDIS_URL`](/reference/env-configuration#redis_url)：用于退出登录时撤销令牌、停止和恢复在其他实例上运行的响应、登录速率限制、OAuth 令牌刷新锁，以及可选的基础模型缓存。
- [`WEBSOCKET_MANAGER=redis`](/reference/env-configuration#websocket_manager)：向连接到其他实例的用户传递实时更新（流式令牌、频道消息、笔记编辑），并在实例之间共享模型列表、活跃用户和在线状态。它连接到 [`WEBSOCKET_REDIS_URL`](/reference/env-configuration#websocket_redis_url)，后者默认为 `REDIS_URL`。

**操作步骤：**

在每个实例上设置这两项：

```
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis
```

将 [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) 保持为默认值 `true`。

Open WebUI 使用普通 Redis 命令，因此 [**Valkey**](/tutorials/integrations/valkey) 或 **Dragonfly** 等 Redis 协议服务器可使用相同设置。Open WebUI 的测试范围不包括这两者。请使用近期版本，并以独立模式运行 Dragonfly，因为其集群模式不提供实时更新所依赖的发布/订阅功能。

**需要了解的要点：**

- 单实例无需 Redis 即可运行，但此时**退出登录不会撤销会话令牌**：令牌在过期之前一直有效（默认为 4 周）。更改密码和**退出所有设备**无需 Redis 即可生效。对于生产环境或敏感数据，请添加 Redis 或缩短 `JWT_EXPIRES_IN`。请参阅[令牌撤销](/getting-started/advanced-topics/hardening#token-revocation)。
- [Tether](/ecosystem/tether) 连接在 [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) 大于 1 时需要 Redis。请参阅其[要求](/ecosystem/tether#requirements)。
- **Redis Sentinel：**设置 [`REDIS_SENTINEL_HOSTS`](/reference/env-configuration#redis_sentinel_hosts) 和 [`WEBSOCKET_SENTINEL_HOSTS`](/reference/env-configuration#websocket_sentinel_hosts)（WebSocket 管理器仅读取后者）。`REDIS_URL` 的主机部分是主节点的服务名称。设置 `REDIS_SOCKET_CONNECT_TIMEOUT=5`，避免故障转移挂起。
- **Redis Cluster**（例如集群模式下的 AWS ElastiCache）：设置 [`REDIS_CLUSTER=true`](/reference/env-configuration#redis_cluster)。WebSocket 管理器会遵循此设置。
- 设置 Redis 服务器的 `timeout`（例如 `1800`）和足够高的 `maxclients`（10000+），防止连接耗尽。
- 对于大量流式传输，提高 Redis 的发布/订阅输出缓冲区限制；请参阅 [WebSocket 发布/订阅缓冲区限制](/tutorials/integrations/redis#websocket-pubsub-buffer-limits)。
- 所有实例必须使用相同的 [`WEBSOCKET_REDIS_ROOM_CHANNELS`](/reference/env-configuration#websocket_redis_room_channels) 值。请参阅[按房间划分 Redis 频道](#per-room-redis-channels)。
- 即使有数千名用户，**单个 Redis 实例**也足以满足绝大多数部署的需求。在考虑 Redis Cluster 之前，请检查是否存在可修复的配置问题（请参阅[常见反模式](/troubleshooting/performance#common-anti-patterns)）。

有关完整的 Redis 设置（Docker Compose、Sentinel、Cluster、验证），请参阅 [Redis WebSocket 支持](/tutorials/integrations/redis)教程。有关反向代理后的 WebSocket 和 CORS 问题，请参阅[连接错误](/troubleshooting/connection-error#https-tls-cors--websocket-issues)。

---

## 步骤 3：运行多个实例 {#step-3-run-multiple-instances}

**适用时机：**你需要服务更多用户或希望实现高可用性。

共享状态准备就绪后，在**负载均衡器**后运行所需数量的相同实例。

:::warning
先完成**步骤 1、2、4 和 5**。所有副本还需要相同的 `WEBUI_SECRET_KEY`，否则用户会遇到[登录循环和 401 错误](/troubleshooting/multi-replica#1-login-loops--401-unauthorized-errors)。有关生成、存储和轮换该密钥（以及 `OAUTH_SESSION_TOKEN_ENCRYPTION_KEY`），请参阅[密钥](/getting-started/advanced-topics/hardening#secret-key)。有关部署前检查清单，请参阅[核心要求清单](/troubleshooting/multi-replica#core-requirements-checklist)。
:::

每个实例保留一个工作进程（[`UVICORN_WORKERS=1`](/reference/env-configuration#uvicorn_workers)，默认值），通过更改副本数进行扩展。这样每个副本都有自己的内存限制，并可独立重启。

- **Docker Compose**（单台主机）：在 Open WebUI 服务上设置 `deploy.replicas`，或运行 `docker compose up -d --scale open-webui=3`。从该服务中移除固定的主机端口映射（例如 `3000:8080`），因为只有一个容器能绑定一个主机端口。在同一 Compose 项目中放置一个反向代理（Nginx、Traefik 或 Caddy），并将其指向 `open-webui:8080`；Docker 的 DNS 会返回该服务名称对应的每个副本，代理则以轮询方式在它们之间分配请求。启用 WebSocket（默认）时，普通轮询即可；有关粘性会话在何时有帮助，请参阅[会话亲和性](/troubleshooting/multi-replica#session-affinity-sticky-sessions)。Nginx 仅在启动时解析该名称，因此更改副本数后要重新加载 Nginx。
- **Docker Swarm** 或 **Kubernetes**（多台主机）：设置服务或 Deployment 的副本数，或交给自动扩缩器管理。请参阅 [Docker Swarm](/deployment/docker-swarm) 和 [Kubernetes](/deployment/kubernetes)。

仅让一个进程运行数据库迁移；请参阅[更新与迁移](/troubleshooting/multi-replica#updates-and-migrations)。Compose 会为每个副本提供相同设置，因此 `ENABLE_DB_MIGRATIONS` 无法只选择其中一个副本。升级时先缩减到一个副本（`docker compose up -d --scale open-webui=1`），等待其健康，然后再扩展回去。

### 将 HTTP 压缩卸载到负载均衡器 {#offload-http-compression-to-the-load-balancer}

当负载均衡器、入口或 CDN 位于 Open WebUI 前端时，让其压缩 HTTP 响应，并关闭应用程序的压缩：

```
ENABLE_COMPRESSION_MIDDLEWARE=false
```

否则，每个副本都要花费几个百分点的 CPU 来压缩响应。无论采用哪种方式，流式聊天响应和 WebSocket 流量都不受影响。如果前端没有任何组件进行压缩，首次页面加载和大型 JSON 响应的体积会增大。请参阅 [`ENABLE_COMPRESSION_MIDDLEWARE`](/reference/env-configuration#enable_compression_middleware)。

WebSocket 帧由 WebSocket 服务器自身压缩。大量流式传输时，请关闭此功能：

```
UVICORN_WS_PER_MESSAGE_DEFLATE=false
```

聊天响应按每个令牌一个小帧进行流式传输，因此压缩每个帧会消耗每个订阅者的 CPU，却几乎节省不了带宽。请参阅 [`UVICORN_WS_PER_MESSAGE_DEFLATE`](/reference/env-configuration#uvicorn_ws_per_message_deflate)。

大规模部署时，还有两个设置很重要：

- **心跳。**[`WEBSOCKET_HEARTBEAT_INTERVAL=60`](/reference/env-configuration#websocket_heartbeat_interval) 可将每个打开标签页的心跳流量减半（默认为每 30 秒一次）。有关其开销，请参阅 [WebSocket 心跳](/troubleshooting/performance#websocket-heartbeats)。
- **残留流。**流式响应会保存在 Redis 中，以便重新连接的浏览器恢复，并在完成后删除。[`REDIS_RESPONSE_STREAM_TTL`](/reference/env-configuration#redis_response_stream_ttl)（默认 `3600` 秒）会让副本在流式传输中途被终止时留下的条目过期。

#### 在代理上同时配置静态资源缓存 {#pair-it-with-static-asset-caching-at-the-proxy}

当代理同时**缓存静态资源**时，禁用应用端压缩的效果最佳，这样每个浏览器只需下载一次压缩后的资源包。

所有前端 JavaScript 和 CSS 都位于 `/_app/immutable/` 下，文件名包含**内容哈希**。给定 URL 的内容永远不会改变，因此这些文件可以安全地长期缓存。HTML 外壳和 `/_app/version.json` 必须保持较短的缓存时间，因为浏览器使用它们发现新构建。

Nginx 示例：

```nginx
proxy_cache_path /var/cache/nginx/openwebui levels=1:2 keys_zone=OPENWEBUI_STATIC:10m
                 max_size=1g inactive=7d use_temp_path=off;

# 包含内容哈希的资源包：按构建方式不可变
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

- `immutable` 可阻止浏览器在重新加载时重新验证。`max-age=2592000, immutable`（30 天）的效果几乎一样好。
- 让 HTML 外壳和 `/_app/version.json` 不缓存或只缓存几分钟，否则用户会错过升级。除非设置了 [`CACHE_CONTROL`](/reference/env-configuration#cache_control)，否则 Open WebUI 会为 HTML 外壳发送 `Cache-Control: no-cache`；请在代理上保留该标头。
- `proxy_cache` 在每个缓存生命周期内从副本获取一次资源，而不是为每个用户都获取一次。
- Nginx 会压缩每个响应（其缓存存储未压缩的正文），因此请使用适中的级别：`gzip_comp_level 4;` 或 brotli 质量 4 到 5，并加上 `gzip_min_length 1000;`。

### 将 JSON 编码器切换为 orjson {#switch-the-json-encoder-to-orjson}

使用多个实例时，每次实时更新都会经过 Redis，并以 JSON 形式编码和解码。[`ENABLE_ORJSON`](/reference/env-configuration#enable_orjson)（默认 `True`）会为此及应用程序的其他部分使用速度更快的 [orjson](https://pypi.org/project/orjson/) 库。请保持启用。有关行为差异，请参阅[使用更快的 JSON 编码器](/troubleshooting/multi-replica#use-the-faster-json-encoder)。

### 按房间划分 Redis 频道 {#per-room-redis-channels}

使用 `WEBSOCKET_MANAGER=redis` 时，发送给特定用户、频道或笔记的实时更新会通过其专属的 Redis 频道发出。每个实例仅订阅连接到它的用户所在房间，因此无需解码发往其他实例的更新。确认消息和控制消息仍使用共享频道。实例越多，节省的开销越大。此功能默认启用：

```
WEBSOCKET_REDIS_ROOM_CHANNELS=True
```

:::warning 同时更新所有实例

每个实例必须运行相同的模式。滚动重启会使实例处于不同模式，导致它们之间的实时更新丢失。停止所有实例，在所有实例上更改设置，然后重新启动。

:::

如果 Redis 用户受 ACL 限制，则需要 `PUBLISH`、`SUBSCRIBE`、`UNSUBSCRIBE` 和 `PING` 命令权限，以及对 `&socketio` 和 `&socketio#*` 频道的访问权限。房间频道命名为 `socketio#<namespace>#<room>`。缺少权限时，实时更新会失败，日志会显示 `Redis denied publishing` 或 `Redis denied subscribing`，并列出需要检查的权限和频道。

`WEBSOCKET_REDIS_ROOM_CHANNELS=False` 会让所有流量都经过一个共享频道。请参阅 [`WEBSOCKET_REDIS_ROOM_CHANNELS`](/reference/env-configuration#websocket_redis_room_channels)。

### 加快名称查询 {#speed-up-name-lookups}

负载较高时，主机名查询会相互排队，延迟每个查询所属的请求。c-ares 解析器可以消除这种排队：

```
AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER=True
```

该功能需要主动启用，因为 c-ares 读取的名称来源比操作系统少。有关启用后需要测试的内容，请参阅 [DNS 解析器](/troubleshooting/performance#dns-resolver)。

---

## 步骤 4：切换到外部向量数据库 {#step-4-switch-to-an-external-vector-database}

**适用时机：**你运行多个副本。**这是必需的。**

:::danger 默认 ChromaDB 会在多进程部署中崩溃

默认 ChromaDB 嵌入在 Open WebUI 进程中运行，并将数据存储在 `DATA_DIR/vector_db` 下的本地 SQLite 文件中。只允许一个进程写入这些文件。使用多个副本时，并发写入（例如文档上传期间）会终止进程：

```
save_docs_to_vector_db:1619 - adding to collection file-id
INFO:     Waiting for child process [pid]
INFO:     Child process [pid] died
```

请参阅[文档上传期间工作进程崩溃](/troubleshooting/multi-replica#6-worker-crashes-during-document-upload-chromadb--multi-worker)。

:::

**操作步骤：**

将 [`VECTOR_DB`](/reference/env-configuration#vector_db) 设置为客户端-服务器模式的向量数据库：

```
VECTOR_DB=pgvector
```

**推荐选项：**

| 向量数据库 | 最适用场景 | 配置 |
|---|---|---|
| **PGVector** | 已运行 PostgreSQL 的团队 | `VECTOR_DB=pgvector` + `PGVECTOR_DB_URL=postgresql://...`（默认为 `DATABASE_URL`） |
| **MariaDB Vector** | 运行 MariaDB 的团队 | `VECTOR_DB=mariadb-vector` + `MARIADB_VECTOR_DB_URL=mariadb+mariadbconnector://...` |
| **Milvus** | 查询吞吐量高的大型自托管部署 | `VECTOR_DB=milvus` + `MILVUS_URI=http://milvus-host:19530` |
| **Qdrant** | 需要高效过滤和元数据搜索的自托管部署 | `VECTOR_DB=qdrant` + `QDRANT_URI=http://qdrant-host:6333` |
| **Pinecone** | 完全托管的云服务 | `VECTOR_DB=pinecone` + `PINECONE_API_KEY=...` |
| **ChromaDB（HTTP 模式）** | 保留 ChromaDB，作为独立服务器运行 | `VECTOR_DB=chroma` + `CHROMA_HTTP_HOST=chroma-host` + `CHROMA_HTTP_PORT=8000` |

:::note

核心团队维护 PGVector 和 ChromaDB。其他向量存储是社区贡献的集成。

:::

:::tip
如果你已经在主数据库中使用 PostgreSQL，**PGVector** 是最简单的选择：无需额外基础设施。

**Milvus** 和 **Qdrant** 具有多租户模式，我们建议在使用任意一个时都启用它。如果不启用，每个文件、知识库、用户记忆和网络搜索都会获得自己的集合，这在较大实例上很快会引发扩展问题。启用后，所有数据共享少数几个集合。Qdrant 默认启用此模式（[`ENABLE_QDRANT_MULTITENANCY_MODE`](/reference/env-configuration#enable_qdrant_multitenancy_mode)），Milvus 默认禁用（[`ENABLE_MILVUS_MULTITENANCY_MODE`](/reference/env-configuration#enable_milvus_multitenancy_mode)），因此请为 Milvus 启用它。请在首次启动前决定；之后切换需要重新索引。
:::

Slim 镜像仅支持其默认 `VECTOR_DB` 对应的 PGVector。

---

## 步骤 5：在实例之间共享文件存储 {#step-5-share-file-storage-across-instances}

**适用时机：**你正在运行多个实例。要让附件、知识文档和生成的图像跨副本正常工作，**必须共享上传文件的访问权限**。

默认情况下，Open WebUI 将上传的文件存储在 `DATA_DIR` 下（通常为 `/app/backend/data`）。每个实例都需要访问相同的文件，否则当请求到达不同副本时，[上传的文件和 RAG 知识将无法访问](/troubleshooting/multi-replica#5-uploaded-files-or-rag-knowledge-inaccessible)。

### 我需要云存储（S3）吗？ {#do-i-need-cloud-storage-s3}

**要求是共享文件访问，而对象存储只是实现方式之一。**你可以使用 S3、GCS 或 Azure Blob，也可以保留 `STORAGE_PROVIDER=local`，并在每个副本的相同路径挂载同一个共享文件系统。

**可选方案：**

| 方案 | 使用场景 |
|---|---|
| **共享文件系统**（NFS、AWS EFS、CephFS 或单台主机上的共享卷） | 你已经在运维共享存储。在所有实例的相同路径挂载同一目录；多节点 Kubernetes 需要 ReadWriteMany（RWX）存储。 |
| **外部对象存储**（S3、GCS、Azure Blob） | 副本运行在不同主机上，或文件必须在容器替换后仍然保留且没有共享卷。在每个副本上配置 `STORAGE_PROVIDER` 以及相同的存储桶或容器。 |

:::info STORAGE_PROVIDER 实际控制什么？
`STORAGE_PROVIDER` 涵盖通过 Open WebUI 文件上传 API 保存的文件：文档、附件和生成的图像。主数据库（`DATABASE_URL`）、向量数据库（`VECTOR_DB`）及 `DATA_DIR` 的其余部分仍保留在原位置。直接从 `/cache/` 提供的文件（例如某些工具输出）使用文件系统；如果需要由另一个副本提供，则必须共享访问。
:::

### 方案 A：共享文件系统（最简单） {#option-a-shared-filesystem-simplest}

保留 `STORAGE_PROVIDER=local`，并在所有实例的相同路径挂载同一目录：

**Kubernetes 示例：**
```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: openwebui-data  # 必须为 ReadWriteMany（RWX）
```

**Docker Compose 示例：**
```yaml
volumes:
  - /opt/data/openwebui-data:/app/backend/data
```

此绑定挂载仅在**同一主机**上的容器之间共享文件。在不同主机上，源目录本身必须位于共享存储上。不同主机上同名的 Docker 卷是相互独立的卷。

:::warning
让 SQLite 数据库远离网络文件系统。这是在扩展前切换到 PostgreSQL（[步骤 1](#step-1-switch-to-postgresql)）的另一个原因。
:::

数据目录共享后，请限制可写入其中的内容：有关大小、数量和扩展名上限，请参阅[文件上传限制](/getting-started/advanced-topics/hardening#file-upload-limits)；有关文件系统权限和备份，请参阅[数据目录](/getting-started/advanced-topics/hardening#data-directory)。

### 方案 B：云对象存储 {#option-b-cloud-object-storage}

在**每个副本**上设置 `STORAGE_PROVIDER`、存储桶或容器及凭据。所有副本必须使用相同的目标位置，包括设置时的相同 `S3_KEY_PREFIX`，并有权读取、写入和删除文件。

**支持的服务提供方：**

| 服务提供方 | 将 `STORAGE_PROVIDER` 设置为 |
|---|---|
| Amazon S3（或 MinIO、R2 等 S3 兼容服务） | `s3` |
| Google Cloud Storage | `gcs` |
| Microsoft Azure Blob Storage | `azure` |

```bash
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=my-openwebui-bucket
S3_REGION_NAME=us-east-1

# 对于 S3 兼容服务，还要设置其端点：
# S3_ENDPOINT_URL=https://s3.example.com
# S3_ADDRESSING_STYLE=path
```

对于 S3，省略 `S3_ACCESS_KEY_ID` 和 `S3_SECRET_ACCESS_KEY` 即可使用默认 AWS 凭据链（例如 IAM 角色），或者通过你的密钥管理系统同时提供两者。GCS 使用 `GCS_BUCKET_NAME` 配合应用程序默认凭据或 `GOOGLE_APPLICATION_CREDENTIALS_JSON`。Azure 使用 `AZURE_STORAGE_ENDPOINT` 和 `AZURE_STORAGE_CONTAINER_NAME`，配合 `AZURE_STORAGE_KEY` 或默认 Azure 凭据。Slim 镜像仅支持 `local` 和 `s3`。

有关所有服务提供方设置，请参阅[环境变量参考](/reference/env-configuration#cloud-storage)；有关完整示例，请参阅 [S3 存储教程](/tutorials/maintenance/s3-storage)。

:::warning 对象存储仍需要本地磁盘
上传内容先写入 `DATA_DIR/uploads`，然后发送到存储桶。读取时，文件会先下载到该目录，再由 Open WebUI 处理或提供。为每个副本提供可写的数据目录，并留出足够的空间和 I/O 容量以支持并发传输。

`STORAGE_LOCAL_CACHE=false` 会在处理后移除云存储文件的本地副本。仍需规划本地磁盘容量，因为下载和尚未处理的上传内容仍会使用它。
:::

### 切换现有部署 {#switching-an-existing-deployment}

更改 `STORAGE_PROVIDER` **不会**迁移现有文件或重写其存储路径。切换前，请规划现有对象及其文件记录的迁移；仅将文件复制到存储桶并不够。请先备份数据库和文件。

将生产流量发送到多个副本之前，通过一个副本上传文件，再通过另一个副本下载。还要检查知识文档和生成的图像，然后在替换上传副本后重复测试。

---

## 步骤 6：调整内容提取与嵌入 {#step-6-fix-content-extraction--embeddings}

**适用时机：**你在生产环境中经常处理文档（RAG、知识库）。

默认内容提取器（pypdf）和默认本地嵌入模型（SentenceTransformers）在每个 Open WebUI 进程内运行，因此每个副本都会重复占用内存，而提取器是内存增长的常见来源。请将两者迁移到外部服务。

**操作步骤：**

1. **将内容提取引擎**切换到外部服务：

```
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998
```

要将不同文件类型路由到不同后端，请运行自己的服务并设置 `CONTENT_EXTRACTION_ENGINE=external`。请参阅[外部文档提取](/features/chat-conversations/rag/document-extraction/external)。

2. **将嵌入引擎**切换到外部服务提供方：

```
RAG_EMBEDDING_ENGINE=openai
# 自托管时可使用：
RAG_EMBEDDING_ENGINE=ollama
```

**需要了解的要点：**

- 有关详情和选项，请参阅[内容提取引擎](/troubleshooting/performance#content-extraction-engine)和[嵌入引擎](/troubleshooting/performance#embedding-engine)。
- Slim 镜像没有本地嵌入或重排序模型，因此需要外部嵌入引擎。
- 外部 Tika、Docling 或嵌入端点是新的出站目标。仅通过内部网络访问它们，并查看加固指南中的[网络和出站请求](/getting-started/advanced-topics/hardening#network-and-outbound-requests)（`AIOHTTP_CLIENT_ALLOW_REDIRECTS=false`、`WEB_FETCH_FILTER_LIST`）。

---

## 步骤 7：添加可观测性 {#step-7-add-observability}

**适用时机：**你希望监控性能并排除大规模部署的故障。

Open WebUI 通过 **OpenTelemetry** 将追踪、指标和日志导出到 Grafana、Datadog、New Relic 及类似平台。打开总开关以及你需要的每类信号：

```
ENABLE_OTEL=true
ENABLE_OTEL_TRACES=true
ENABLE_OTEL_METRICS=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
```

有关完整设置，请参阅 [OpenTelemetry 监控](/reference/monitoring/otel)。有关日志级别，请参阅 [Open WebUI 日志](/getting-started/advanced-topics/logging)。有关结构化日志和审计日志，请参阅加固指南中的[可观测性](/getting-started/advanced-topics/hardening#observability)和[审计日志](/getting-started/advanced-topics/hardening#audit-logging)。

---

## 整合所有组件 {#putting-it-all-together}

可用于生产的扩展部署通常如下所示：

```mermaid
flowchart TD
    %% 主流程
    LB["负载均衡器<br/>(Nginx、HAProxy、云负载均衡)"]

    subgraph Pods ["无状态容器"]
        direction LR
        P1["WebUI<br/>Pod 1"]
        P2["WebUI<br/>Pod 2"]
        PN["WebUI<br/>Pod N"]
    end

    subgraph Shared ["共享基础设施"]
        direction LR
        DB[("PostgreSQL<br/>(+ 用于 RAG 的 PGVector)")]
        Redis{{"Redis"}}
        Storage[/"共享存储<br/>(NFS 或 S3)"/]
    end

    %% 注释
    DBNote["共享数据库<br/>+ 向量数据库"]
    RedisNote["共享状态和 WebSocket"]
    StoreNote["共享文件存储"]

    %% 连接
    LB --> P1
    LB --> P2
    LB --> PN
    P1 --> Shared
    P2 --> Shared
    PN --> Shared

    %% 对齐连线
    DB -.-> DBNote
    Redis -.-> RedisNote
    Storage -.-> StoreNote
```

**遇到问题？**有关登录循环、WebSocket 故障、数据库锁定和上传期间崩溃，请参阅[扩展与高可用故障排除](/troubleshooting/multi-replica)。

### 扩展部署的最低环境变量配置 {#minimum-environment-variables-for-scaled-deployments}

```bash
# 每个副本上使用相同的值
WEBUI_SECRET_KEY=your-shared-secret

# 数据库
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
DATABASE_POOL_SIZE=15
DATABASE_POOL_MAX_OVERFLOW=20

# 向量数据库（多个副本时切勿使用嵌入式 ChromaDB）
VECTOR_DB=pgvector
PGVECTOR_DB_URL=postgresql://user:password@db-host:5432/openwebui

# Redis
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis

# 文件存储：副本间必须共享，在所有副本上配置一种方案。
# 方案 A：STORAGE_PROVIDER=local，使用相同的共享文件系统和挂载路径。
#         每台主机独立的 Docker 卷不会共享文件。
# 方案 B：外部对象存储（所有副本使用相同的存储桶和键前缀）
# STORAGE_PROVIDER=s3
# S3_BUCKET_NAME=my-openwebui-bucket
# S3_REGION_NAME=us-east-1
# 对象存储仍需要可写的本地磁盘；请参阅步骤 5。

# 在应用程序进程之外进行内容提取和嵌入
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998
RAG_EMBEDDING_ENGINE=openai
# 或：RAG_EMBEDDING_ENGINE=ollama

# 迁移：除一个实例外，其余全部设为 false；请参阅“更新与迁移”
ENABLE_DB_MIGRATIONS=false

# 为阻塞工作（数据库调用、文件 I/O）留出空间；默认上限为 40
THREAD_POOL_SIZE=2000

# 仅在负载均衡器、入口或 CDN 压缩响应时设置
# ENABLE_COMPRESSION_MIDDLEWARE=false

# 按令牌进行 WebSocket 压缩会消耗 CPU，收益却很小
# UVICORN_WS_PER_MESSAGE_DEFLATE=false

# 减少空闲心跳；离线用户会在活跃计数中保留更久
# WEBSOCKET_HEARTBEAT_INTERVAL=60

# 就地扩展流式响应；有助于并发情况下的长回答
ENABLE_CHAT_RESPONSE_STREAM_INPLACE_APPEND=True

# 加快名称查询；启用后验证名称仍能正常解析
AIOHTTP_CLIENT_ASYNC_DNS_RESOLVER=True
```

:::warning 不要跳过 THREAD_POOL_SIZE
Open WebUI 在线程池中运行阻塞工作（数据库调用、文件 I/O、同步处理器），默认最多同时执行 **40** 个操作。一旦有 40 个操作正在执行，后续请求就会排队，应用程序看似冻结，而 CPU 和内存却看似正常。`THREAD_POOL_SIZE` 可提高此上限。线程仅在需要时创建，因此较高的值也是安全的。请参阅[线程池大小](/troubleshooting/performance#thread-pool-size)。
:::

### 大规模部署时需要重新审视的安全默认值 {#security-defaults-to-revisit-at-scale}

一些对单用户评估合理的默认值，在真实用户通过 SSO 登录后会变得更加重要。完整讨论见[加固指南](/getting-started/advanced-topics/hardening)。最常遗漏的项目包括：

- 使用 `ENABLE_PROFILE_IMAGE_URL_FORWARDING=false` **禁用外部头像重定向**。默认情况下，头像端点会重定向到 `profile_image_url` 中保存的任意外部 URL，因此每个显示该头像的浏览器都会向该来源发送其 IP、User-Agent 和 Referer。仅在希望显示 IdP 托管的头像（例如来自 `OAUTH_PICTURE_CLAIM` 的 Google 或 Gravatar URL）时保留默认值；无论哪种方式，`data:` URI 头像都存储在本地。请参阅 [SSO 配置](/features/authentication-access/auth/sso)。
- 在每个副本上**将 `WEBUI_SECRET_KEY` 设置为相同的值**。`OAUTH_SESSION_TOKEN_ENCRYPTION_KEY` 默认为该值；如果单独设置，也必须在所有位置保持一致。否则会话会跨副本失效，一个 Pod 存储的 OAuth 令牌也无法由另一个 Pod 解密。
- 如果部署处理敏感数据，特别是在没有 Redis 提供退出登录撤销的情况下，**缩短 `JWT_EXPIRES_IN`**，不要沿用四周的默认值。请参阅[令牌撤销](/getting-started/advanced-topics/hardening#token-revocation)。
- **设置 `ENABLE_OAUTH_ID_TOKEN_COOKIE=false`。**默认情况下，原始 IdP id_token 还会作为 Cookie 发送到浏览器。Open WebUI 将 id_token 保存在服务器端 OAuth 会话中，并使用该副本退出登录。

除上述清单外，加固指南还按主题讨论了同样的安全问题：[网络位置](/getting-started/advanced-topics/hardening#network-placement)、[身份验证与注册](/getting-started/advanced-topics/hardening#authentication-and-signup)、[会话和 Cookie 安全](/getting-started/advanced-topics/hardening#session-and-cookie-security)、[安全标头](/getting-started/advanced-topics/hardening#security-headers)、[访问控制](/getting-started/advanced-topics/hardening#access-control)、[工具、函数与管道](/getting-started/advanced-topics/hardening#tools-functions-and-pipelines)，以及[安全优先部署](/getting-started/advanced-topics/hardening#security-first-deployment)清单。

---

## 快速参考：何时需要哪些组件？ {#quick-reference-when-do-i-need-what}

<div className="responsive-table">

| 场景 | PostgreSQL | Redis | 外部向量数据库 | 外部内容提取 | 外部嵌入 | 共享存储 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 单用户 / 评估 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| 小团队（< 50 名用户，单实例） | 可选 | 推荐† | ✗ | 推荐 | ✗ | ✗ |
| 多实例 / 高可用 | **必需** | **必需** | **必需** | **强烈推荐** | **强烈推荐** | **必需**（共享文件系统或对象存储） |
| 大规模（1000+ 名用户） | **必需** | **必需** | **必需** | **强烈推荐** | **强烈推荐** | **跨副本必需** |

</div>

†没有 Redis 时，退出登录**不会**撤销会话令牌：令牌在 `JWT_EXPIRES_IN` 到期之前一直有效（默认为 4 周）。请参阅[令牌撤销](/getting-started/advanced-topics/hardening#token-revocation)。

:::note 关于“外部向量数据库”
指客户端-服务器模式的数据库（PGVector、Milvus、Qdrant、Pinecone 等），或作为独立 HTTP 服务器运行的 ChromaDB。请参阅[步骤 4](#step-4-switch-to-an-external-vector-database)。
:::

:::note 关于“共享存储”
所有副本必须能通过**外部对象存储**（S3、GCS、Azure）或**共享文件系统**（NFS、EFS、CephFS 或单台主机上的共享卷）访问相同的上传文件。请参阅[步骤 5](#step-5-share-file-storage-across-instances)。
:::

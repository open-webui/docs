---
sidebar_position: 50
title: "Redis WebSocket 支持"
---

# Redis WebSocket 支持

:::warning

本教程由社区贡献，Open WebUI 团队不提供支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 概述 {#overview}

本页介绍如何为 Open WebUI 设置 Redis，包括所需的 Redis 服务器设置、Open WebUI 变量、Sentinel 和 Cluster，以及故障排除。

## 何时需要 Redis？ {#when-is-redis-required}

只要运行多个 Open WebUI 进程（多个 Uvicorn 工作进程或多个实例），就需要 Redis；退出登录时撤销令牌也依赖 Redis。[第 2 步：添加 Redis](/getting-started/advanced-topics/scaling#step-2-add-redis)介绍了它协调的内容，以及单个实例何时需要它。

### 先决条件 {#prerequisites}

- 一个 Redis 容器（本例使用 `redis:7-alpine`）
- Docker Compose v2
- 一个由 Open WebUI 和 Redis 共享的 Docker 网络

### 关键：Redis 服务器配置 {#critical-redis-server-configuration}

:::danger

**防止出现“Max Number of Clients Reached”错误**

在配置 Open WebUI 使用 Redis 之前，**必须**确保 Redis 服务器本身配置正确。一种常见的错误配置会导致连接随时间累积，最终耗尽连接数上限，造成**身份验证完全失败**（所有用户都收到 500 Internal Server Error）。

**问题所在：**

Open WebUI 使用 Redis 处理：
- 令牌验证/撤销检查（每个经过身份验证的请求）
- WebSocket 管理（实时更新）
- 会话存储（如果启用了 `ENABLE_STAR_SESSIONS_MIDDLEWARE`）

在某些发行版的默认 Redis 设置（`maxclients 1000`、`timeout 0`）下，连接永远不会关闭。经过数天或数周，它们会悄无声息地累积，直至达到上限。然后，突然之间所有人都无法登录。

**症状：**
- 应用程序正常运行数天/数周
- 突然，所有用户登录时都收到 500 Internal Server Error
- 日志中出现错误：`redis.exceptions.ConnectionError: max number of clients reached`
- 随着旧连接最终断开，问题可能暂时“自行修复”，随后再次出现

**解决方案：**

将以下设置添加到 Redis 配置中：

```conf
# 允许足够的并发连接
maxclients 10000

# 在 30 分钟（1800 秒）后关闭空闲连接
# 仅影响与 Redis 之间的空闲 TCP 连接，不影响会话
timeout 1800
```

**对于 Docker 部署**，请将以下参数添加到 Redis 命令中：

```yml
services:
  redis:
    image: redis:7-alpine
    command: "redis-server --save 30 1 --appendonly yes --maxclients 10000 --timeout 1800 --maxmemory-policy noeviction"
    # ... 其余配置
```

**为什么 `timeout 1800` 是安全的：**

该超时仅影响空闲的 Redis TCP 连接，不影响用户会话。连接超时时：
- 用户的 JWT 令牌仍然有效
- 其会话不受影响
- 下一个请求只需打开一个新的 Redis 连接（增加约 1-5ms，难以察觉）

**监控：**

检查当前连接数：
```bash
redis-cli INFO clients | grep connected_clients
```

正确配置 `timeout` 后，该数值应自然波动（活跃时段上升，空闲时段下降），而不是无限攀升。

:::

### 关键：内存淘汰策略 {#critical-memory-eviction-policy}

:::danger

**不要为 Open WebUI 的 Redis 设置 `allkeys-*` 淘汰策略。**

Open WebUI 将 Redis 用作**有状态存储，而不是一次性缓存**。其中的键分为两类：

- **带 TTL 的安全键**：令牌撤销条目（`{prefix}:auth:token:<jti>:revoked`，过期时间恰好设为令牌原本的过期时间）和分布式锁（设置过期时间）。
- **持久运行键**：WebSocket **session** 和 **usage** 池（无过期时间的 Redis 哈希），以及缓存的工具服务器和机器列表。

在 `allkeys-lru`、`allkeys-lfu` 或 `allkeys-random` 策略下，内存耗尽时 Redis 会淘汰**任意**键，包括上述两类键。这可能：

- **悄无声息地重新启用已退出登录的令牌**：如果撤销键在其 TTL 到期前被淘汰，通过退出登录而失效的令牌会再次可用（造成安全回退）；并且
- 通过淘汰持久池，**破坏 WebSocket、会话跟踪和配置**。

请使用 **`noeviction`**（安全的默认值）。内存耗尽时，Redis 会拒绝新的写入并返回错误，这是一个明确且可恢复的信号，而不会悄无声息地丢弃身份验证和会话状态：

```conf
maxmemory-policy noeviction
```

Open WebUI 的 Redis 工作集很小（WebSocket 池、撤销、锁、任务、速率限制、模型缓存、协作文档以及缓存的工具服务器和机器列表），因此在不设置 `maxmemory` 时，Redis 只使用所需内存，永远不会淘汰键。只有存在特定原因时才设置 `maxmemory` 上限；如果设置，应对用量发出告警，而不是依赖淘汰。

如果确实必须在启用淘汰的情况下限制内存，唯一可接受的策略是 `volatile-ttl` 或 `volatile-lru`：它们**只**淘汰带 TTL 的键（锁和撤销），永远不会淘汰持久池。请注意，这仍可能提前丢弃撤销记录，因此应优先增加 RAM，而不是启用淘汰。

:::

### 持久化 {#persistence}

示例命令使用 `--save 30 1`（如果至少有一个键发生更改，则在 30 秒后生成 RDB 快照）。在**非正常**重启时，Redis 会丢失自上次快照以来的所有写入，包括令牌撤销和会话状态，因此崩溃可能使已退出登录的令牌重新生效，并丢失活跃会话。

在生产环境中，还应启用仅追加文件，将数据丢失范围限制在约一秒内：

```conf
appendonly yes
appendfsync everysec
```

`appendfsync everysec` 每秒将 AOF 刷新到磁盘一次，以通常可忽略的小幅 I/O 开销，将最坏情况下的数据丢失范围限制在约一秒内，适合 Open WebUI 较轻的 Redis 工作负载。RDB 和 AOF 可以共存；同时保留两者可实现快速重启和秒级持久性。下一节中的示例 `command` 已包含 `--appendonly yes` 和 `--maxmemory-policy noeviction`。

## 设置 Redis {#setting-up-redis}

要为 WebSocket 支持设置 Redis，需要创建一个包含以下内容的 `docker-compose.yml` 文件：

```yml
services:
  redis:
    image: redis:7-alpine
    container_name: redis
    volumes:
      - redis-data:/data
    command: "redis-server --save 30 1 --appendonly yes --maxclients 10000 --timeout 1800 --maxmemory-policy noeviction"
    healthcheck:
      test: "[ $$(redis-cli ping) = 'PONG' ]"
      start_period: 5s
      interval: 1s
      timeout: 3s
      retries: 5
    restart: unless-stopped
    cap_drop:
      - ALL
    cap_add:
      - SETGID
      - SETUID
      - DAC_OVERRIDE
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"
    networks:
      - openwebui-network

volumes:
  redis-data:

networks:
  openwebui-network:
    external: true
```

:::info

说明

此配置未包含 `ports` 指令，因为大多数情况下并不需要。Open WebUI 服务仍可从 Docker 网络内部访问 Redis 服务。但是，如果需要从 Docker 网络外部访问 Redis 实例（例如用于调试或监控），可以添加 `ports` 指令来公开 Redis 端口（例如 `6379:6379`）。

上述配置会设置一个名为 `redis` 的 Redis 容器，并挂载一个卷来实现数据持久化。`healthcheck` 指令可确保容器在无法响应 `ping` 命令时重启。`--save 30 1` 命令选项会在发生更改 30 秒后且至少有 1 个键发生更改时写入 RDB 快照，`--appendonly yes` 则添加仅追加日志以实现秒级持久性。

**重要：**`--maxclients 10000 --timeout 1800` 标志可防止连接耗尽，`--maxmemory-policy noeviction` 可阻止 Redis 悄无声息地淘汰 Open WebUI 的会话和令牌撤销键。详情请参阅上面的[关键：Redis 服务器配置](#critical-redis-server-configuration)、[内存淘汰策略](#critical-memory-eviction-policy)和[持久化](#persistence)部分。

:::

### WebSocket Pub/Sub 缓冲区限制 {#websocket-pubsub-buffer-limits}

启用 `WEBSOCKET_MANAGER=redis` 时，Open WebUI 会通过 Redis Pub/Sub 使用 Socket.IO。流式响应和工具事件可能生成大型 WebSocket 事件，因为某些更新包含累积的消息状态，而不仅仅是最新的 Token 增量。如果 Redis 在传递这些事件时断开 Pub/Sub 客户端连接，用户可能会看到流式响应停滞、实时更新缺失，或出现如下日志消息：

```text
Cannot publish to redis... retrying
Cannot publish to redis... giving up
redis.exceptions.TimeoutError: Timeout connecting to server
```

检查 Redis 是否因输出缓冲区限制而断开 Pub/Sub 客户端连接：

```bash
redis-cli INFO stats | grep client_output_buffer_limit_disconnections
redis-cli SLOWLOG GET 50
redis-cli CONFIG GET client-output-buffer-limit
```

如果慢日志显示大型 `PUBLISH socketio ...` 有效负载，并且 `client_output_buffer_limit_disconnections` 持续增加，请提高 Redis Pub/Sub 输出缓冲区限制。例如：

```conf
# 保持普通客户端不变；允许更大的 WebSocket Pub/Sub 突发流量。
client-output-buffer-limit normal 0 0 0 replica 268435456 67108864 60 pubsub 1073741824 268435456 180
```

这会将 Pub/Sub 硬限制设置为 1 GB，将软限制设置为 256 MB 并持续 180 秒。请根据可用 Redis 内存和预期 WebSocket 有效负载大小调整这些值。更高的限制使 Redis 更能容忍暂时较慢的订阅者，但也允许每个较慢的 Pub/Sub 客户端在 Redis 断开其连接之前缓冲更多内存。

启用[按房间划分的 Redis 通道](../../getting-started/advanced-topics/scaling.md#per-room-redis-channels)（默认设置）后，Redis 只向每个实例发送连接到该实例的用户的更新，从而在多实例设置中缩小这些缓冲区。房间通道在慢日志中显示为 `PUBLISH socketio#...`。

如果你在运行时更改了 Redis 配置，请验证当前生效的值：

```bash
redis-cli CONFIG GET client-output-buffer-limit
```

要创建供 Open WebUI 与 Redis 通信的 Docker 网络，请运行以下命令：

```bash
docker network create openwebui-network
```

## 配置 Open WebUI {#configuring-open-webui}

### 基本配置（所有部署） {#basic-configuration-all-deployments}

```bash
REDIS_URL="redis://redis:6379/0"
WEBSOCKET_MANAGER="redis"
```

`REDIS_URL` 是用于令牌撤销、锁、任务跟踪、速率限制和共享缓存的连接。`WEBSOCKET_MANAGER=redis` 使 WebSocket 层也使用 Redis，从而让实时更新送达连接到任意工作进程或实例的用户。

### WebSocket 配置 {#websocket-configuration}

WebSocket 默认启用（[`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support)）。WebSocket 层使用 `REDIS_URL` 并遵循 `REDIS_CLUSTER`。只有需要将 WebSocket 流量放在不同的 Redis 服务器或数据库上时，才设置 [`WEBSOCKET_REDIS_URL`](/reference/env-configuration#websocket_redis_url)（以及 `WEBSOCKET_REDIS_CLUSTER`），例如 `redis://redis:6379/1`。

:::warning CORS 和 WebSocket
如果设置了 [`CORS_ALLOW_ORIGIN`](/reference/env-configuration#cors_allow_origin)，请包含用户用来打开 Open WebUI 的每个源，例如 `https://chat.example.com`，并使用分号分隔。来自任何其他源的 WebSocket 连接都会被拒绝。请参阅[连接错误](/troubleshooting/connection-error#https-tls-cors--websocket-issues)。
:::

### 可选配置 {#optional-configuration}

```bash
REDIS_KEY_PREFIX="open-webui"
```

`REDIS_KEY_PREFIX` 允许多个 Open WebUI 实例共享同一个 Redis 实例而不发生键冲突。`open-webui` 已是默认值，因此只有更改该值时此行才有意义；在集群模式下也会原样使用该前缀。

### Sentinel 故障转移配置 {#sentinel-failover-configuration}

通过设置 `REDIS_SENTINEL_HOSTS`（以逗号分隔）启用 Sentinel，并可选择设置 `REDIS_SENTINEL_PORT`（默认值为 `26379`）；同时还应设置 `WEBSOCKET_SENTINEL_HOSTS` 和 `WEBSOCKET_SENTINEL_PORT`，因为 WebSocket 管理器不会读取 `REDIS_SENTINEL_*` 这一对变量。在此模式下，`REDIS_URL` 的主机名部分是 Sentinel 主节点（服务）名称，并复用其数据库和凭据。主节点名称区分大小写，因此请严格按照 Sentinel 中的配置书写（例如 `redis://:password@myMaster:6379/0`）。URL 中的用户名和密码也会发送给 Sentinel，因此使用相同密码保护的 Sentinel 无需额外设置即可工作。

:::danger 关键：Sentinel 部署的套接字超时

Redis Sentinel 设置需要显式的套接字连接超时配置，以确保正确的故障转移行为。如果没有超时，当 Redis 主节点离线时，应用程序可能无限期挂起，甚至可能无法重启。

**缺少超时配置的症状：**
- 故障转移期间应用程序完全无响应
- 如果第一个 Sentinel 主机无法访问，应用程序在启动时挂起
- 主节点故障转移后，恢复需要数分钟而不是数秒

**必需的配置：**
```bash
REDIS_SOCKET_CONNECT_TIMEOUT=5
```

这会将连接 Redis/Sentinel 节点的套接字连接尝试超时设置为 5 秒，使应用程序能够正常完成故障转移。

:::

:::warning

**如果使用 WEBSOCKET_REDIS_OPTIONS**

显式设置 `WEBSOCKET_REDIS_OPTIONS` 时，`REDIS_SOCKET_CONNECT_TIMEOUT` 不会自动应用于 WebSocket 连接。必须在这两个位置都包含超时：
```bash
REDIS_SOCKET_CONNECT_TIMEOUT=5
WEBSOCKET_REDIS_OPTIONS='{"socket_connect_timeout": 5}'
```

:::

#### 重试与重新连接逻辑 {#retry-and-reconnect-logic}

为增强 Sentinel 故障转移期间（正在选举和提升新主节点的时间窗口）的韧性，可以配置重试行为，防止应用程序过快耗尽重新连接尝试次数。

- **`REDIS_SENTINEL_MAX_RETRY_COUNT`**：设置使用 Sentinel 时 Redis 操作的最大重试次数（默认值：`2`）。
- **`REDIS_RECONNECT_DELAY`**：在重试尝试之间添加可选延迟，单位为**毫秒**（例如 `REDIS_RECONNECT_DELAY=500`）。这可防止过于紧密的重试循环，否则在新主节点就绪之前，这类循环可能使事件循环过载或阻塞应用程序。

#### 连接健康检查 {#connection-health-checks}

如果 Redis 服务器配置了 `timeout`（建议如此，见上文），服务器端会清理空闲时间超过该超时的池化连接。如果不进行健康检查，下一个获取此类失效套接字的请求将因 `ConnectionError: Connection reset by peer` 而失败。

- **`REDIS_HEALTH_CHECK_INTERVAL`**：redis-py 在复用空闲的池化连接之前向其发送 PING 的频率，单位为秒（例如 `REDIS_HEALTH_CHECK_INTERVAL=60`）。该值必须**短于** Redis 服务器的 `timeout`，以及通往 Redis 路径上任何防火墙/负载均衡器的空闲超时。设置为 `0` 或留空可禁用。
- **`REDIS_SOCKET_KEEPALIVE`**：在所有 Redis 客户端套接字上启用 TCP `SO_KEEPALIVE`（例如 `REDIS_SOCKET_KEEPALIVE=True`）。启用后，操作系统内核会在空闲连接上发送 TCP keepalive 探测，从 TCP 层面检测由防火墙/负载均衡器静默重置或网络波动造成的半关闭套接字。

这两种机制互为补充：
- `REDIS_HEALTH_CHECK_INTERVAL` 在**应用程序层面**工作：redis-py 在检出空闲连接时发送 PING，验证套接字并重置服务器的空闲计时器。
- `REDIS_SOCKET_KEEPALIVE` 在 **TCP 层面**工作：即使没有应用程序层流量，内核也能检测失效的对端。

:::tip 推荐组合

对于稳健的生产部署，请同时配置所有三个层面：

| 机制 | 层面 | 覆盖范围 | 示例 |
|-----------|-------|--------|---------|
| `timeout 1800`（redis.conf） | 服务器 | 清理应用程序遗忘的泄漏/孤立连接 | 安全保障 |
| `REDIS_HEALTH_CHECK_INTERVAL=60` | 应用程序 | 在实际命令使用失效套接字之前检测它们；保持池化连接活跃 | 主动防护 |
| `REDIS_SOCKET_KEEPALIVE=True` | TCP/内核 | 检测静默网络重置（防火墙、负载均衡器、网卡波动）造成的半关闭套接字 | 网络层防护 |

:::

### Redis Cluster 模式 {#redis-cluster-mode}

对于使用 Redis Cluster 的部署（包括 **AWS Elasticache Serverless** 等托管服务），请使用以下配置启用集群模式：

```bash
REDIS_URL="redis://your-cluster-endpoint:6379/0"
REDIS_CLUSTER="true"
```

:::info

**关键配置说明**

- `REDIS_CLUSTER` 启用可感知集群的连接处理
- `REDIS_URL` 应指向集群的配置端点
- 如果定义了 `REDIS_SENTINEL_HOSTS`，此选项不起作用（Sentinel 优先）

:::

#### AWS Elasticache Serverless {#aws-elasticache-serverless}

对于 AWS Elasticache Serverless 部署，请使用以下配置：

```bash
REDIS_URL="rediss://your-elasticache-endpoint.serverless.use1.cache.amazonaws.com:6379/0"
REDIS_CLUSTER="true"
```

请注意 `rediss://` 方案（双写“s”）会启用 TLS，这是 Elasticache Serverless 所必需的。

#### OpenTelemetry 支持 {#opentelemetry-support}

Redis Cluster 模式与 OpenTelemetry 插桩完全兼容。启用 `ENABLE_OTEL` 后，无论使用单个 Redis 实例、Redis Sentinel 还是 Redis Cluster 模式，Redis 操作都会被正确跟踪。

### 完整配置示例 {#complete-example-configuration}

```bash
# 多副本部署所必需
REDIS_URL="redis://redis:6379/0"
WEBSOCKET_MANAGER="redis"

# 建议用于 Sentinel 部署（防止故障转移挂起）
REDIS_SOCKET_CONNECT_TIMEOUT=5
REDIS_SENTINEL_MAX_RETRY_COUNT=5
REDIS_RECONNECT_DELAY=1000

# 建议：检测过期的池化连接（必须小于 Redis 服务器超时）
REDIS_HEALTH_CHECK_INTERVAL=60

# 建议：启用 TCP keepalive，在内核层面检测失效对端
REDIS_SOCKET_KEEPALIVE=True
```

#### Redis Cluster 模式示例 {#redis-cluster-mode-example}

```bash
REDIS_URL="rediss://your-cluster-endpoint:6379/0"
REDIS_CLUSTER="true"
WEBSOCKET_MANAGER="redis"
```

### Docker Run 示例 {#docker-run-example}

将 Open WebUI 连接到与 Redis 相同的 Docker 网络：

```bash
docker run -d \
  --name open-webui \
  --network openwebui-network \
  -v open-webui:/app/backend/data \
  -p 3000:8080 \
  -e WEBUI_SECRET_KEY="your-secret-key" \
  -e REDIS_URL="redis://redis:6379/0" \
  -e WEBSOCKET_MANAGER="redis" \
  ghcr.io/open-webui/open-webui:main
```

:::warning

**有关服务名称的重要说明**

在上面的示例中，我们使用 `redis://redis:6379`，原因如下：

- `redis` 是 docker-compose.yml 中定义的容器名称
- Docker 的内部 DNS 会将此名称解析为网络中正确的 IP 地址
- 这是 Docker 部署的推荐方法

从一个容器连接到另一个容器时，请**不要**使用 `127.0.0.1` 或 `localhost`。它们指的是容器自身的 localhost，而不是 Redis 容器。

:::

## 验证 {#verification}

### 验证 Redis 连接 {#verify-redis-connection}

首先，确认 Redis 实例正在运行并接受连接：

```bash
docker exec -it redis redis-cli -p 6379 ping
```

如果 Redis 实例运行正常，此命令应输出 `PONG`。

### 验证 Open WebUI 配置 {#verify-open-webui-configuration}

使用正确的 Redis 配置启动 Open WebUI 实例后，请检查日志以确认集成成功：

#### 检查一般 Redis 连接 {#check-for-general-redis-connection}

查找表明 Redis 正用于应用程序状态的日志消息：

```bash
docker logs open-webui 2>&1 | grep -i redis
```

#### 检查 WebSocket Redis 连接 {#check-for-websocket-redis-connection}

如果设置了 `WEBSOCKET_MANAGER=redis` 和 `GLOBAL_LOG_LEVEL=DEBUG`，你应看到以下日志消息：

```
DEBUG:open_webui.socket.main:Using Redis to manage websockets.
```

要专门检查此消息：

```bash
docker logs open-webui 2>&1 | grep "Using Redis to manage websockets"
```

### 验证 Redis 键 {#verify-redis-keys}

你还可以验证 Open WebUI 是否确实在向 Redis 写入数据：

```bash
docker exec -it redis redis-cli --scan --pattern "open-webui*"
```

如果 Redis 配置正确，你应看到带有所配置前缀的键，例如有人打开 UI 后会出现 `open-webui:session_pool` 和 `open-webui:usage_pool`，密码登录后会出现 `open-webui:ratelimit:*`，退出登录后会出现 `open-webui:auth:token:*:revoked`。如果将 `WEBSOCKET_REDIS_URL` 设置为另一个数据库，这两个池会位于该数据库中（在命令中添加 `-n <db>`）。持久化配置通过数据库而不是 Redis 共享。

当 Redis 无响应时，`/ready` 端点也会返回 503，因此对其使用就绪探测可以检测到 Redis 连接丢失。

## 故障排除 {#troubleshooting}

### 常见问题与解决方案 {#common-issues-and-solutions}

#### 问题：“无法连接到 Redis” {#issue-connection-to-redis-failed}

**症状：**

- 日志中出现有关 Redis 连接的错误消息
- 应用程序无法启动或崩溃
- WebSocket 无法工作

**解决方案：**

1. 确认 Redis 容器正在运行：`docker ps | grep redis`
2. 检查 Redis 是否健康：`docker exec -it redis redis-cli ping`
3. 验证网络连接：`docker network inspect openwebui-network`
4. 确保 `REDIS_URL` 使用正确的容器名称，而不是 `127.0.0.1` 或 `localhost`
5. 检查两个容器是否位于同一个 Docker 网络中

#### 问题：“WebSocket 无法工作” {#issue-websockets-not-working}

**症状：**

- 不显示实时聊天更新
- 需要刷新页面才能看到新消息
- 浏览器控制台中出现连接错误

**解决方案：**

1. 确认每个实例都设置了 `WEBSOCKET_MANAGER="redis"`，且没有仅在部分实例上将 `ENABLE_WEBSOCKET_SUPPORT` 设置为 `false`。
2. 检查日志中是否有：`DEBUG:open_webui.socket.main:Using Redis to manage websockets.`（以 DEBUG 级别记录，因此只有设置 `GLOBAL_LOG_LEVEL=DEBUG` 时才会出现）
3. 确认 Open WebUI 容器可以访问 Redis
4. 如果 Redis 用户受 ACL 限制，请检查日志中是否有 `Redis denied publishing` 或 `Redis denied subscribing`。两者都意味着用户缺少某项命令或通道权限，日志行会列出需要检查的权限和通道。启用 `WEBSOCKET_REDIS_ROOM_CHANNELS`（默认设置）时，用户需要 `PUBLISH`、`SUBSCRIBE`、`UNSUBSCRIBE` 和 `PING` 权限，以及对通道 `&socketio` 和 `&socketio#*` 的访问权限。请参阅[按房间划分的 Redis 通道](../../getting-started/advanced-topics/scaling.md#per-room-redis-channels)。

#### 问题：“多个 Open WebUI 实例相互干扰” {#issue-multiple-open-webui-instances-interfering-with-each-other}

**症状：**

- 两个独立的 Open WebUI 安装共享一个 Redis 服务器
- 一个安装的活跃用户数或模型列表显示在另一个安装中

**解决方案：**
为每个安装使用不同的 `REDIS_KEY_PREFIX` 值：

```bash
# 实例 1
REDIS_KEY_PREFIX="openwebui-prod"

# 实例 2
REDIS_KEY_PREFIX="openwebui-dev"
```

#### 问题：“Redis 内存用量持续增长” {#issue-redis-memory-usage-growing-continuously}

**症状：**

- Redis 内存用量随时间增加
- 容器最终耗尽内存

:::danger
请**不要**使用 `--maxmemory-policy allkeys-lru` 来“修复”此问题。Open WebUI 的 Redis 保存的是令牌撤销键、会话池和锁，而不是一次性缓存。`allkeys-*` 策略可能悄无声息地重新启用已退出登录的令牌并破坏会话。请参阅[内存淘汰策略](#critical-memory-eviction-policy)。
:::

内存持续增长通常意味着键数量增长，而不是缺少淘汰策略，因此应调查原因，而不是通过淘汰来掩盖问题。

**解决方案：**

1. 找出占用内存的内容以及它是否正在无界增长：

   ```bash
   docker exec -it redis redis-cli info memory
   docker exec -it redis redis-cli --bigkeys
   docker exec -it redis redis-cli info keyspace   # 每个数据库的键数量
   ```

2. 按照[关键：Redis 服务器配置](#critical-redis-server-configuration)部分确认已设置 `timeout`（空闲连接累积也会表现为内存增长）。

3. 如果必须限制内存，请设置 `maxmemory` 上限并搭配 **`noeviction`**，使 Redis 明确拒绝写入而不是丢弃身份验证/会话状态，然后对 `used_memory` 发出告警：

   ```conf
   maxmemory 512mb
   maxmemory-policy noeviction
   ```

4. 避免在运行中的实例上执行 `FLUSHDB`/`FLUSHALL`：这会清除活跃会话、撤销列表和锁。如果需要在维护窗口内清除累积状态，请改为重启 Redis 容器。

#### 问题：运行数天/数周后出现“max number of clients reached” {#issue-max-number-of-clients-reached-after-daysweeks-of-operation}

**症状：**

- 应用程序正常工作了很长一段时间，随后突然出现故障
- 所有登录尝试都返回 500 Internal Server Error
- 日志中出现错误：`redis.exceptions.ConnectionError: max number of clients reached`
- 可能暂时恢复，随后再次出现故障

**原因：**由于连接累积而达到 Redis `maxclients` 上限。这种情况发生在：
- `timeout` 设置为 `0`（连接永不关闭）
- `maxclients` 对于你的使用模式而言过低

**解决方案：**

1. 检查当前连接数：
   ```bash
   redis-cli INFO clients | grep connected_clients
   ```

2. 检查当前设置：
   ```bash
   redis-cli CONFIG GET maxclients
   redis-cli CONFIG GET timeout
   ```

3. 修复配置：
   ```bash
   redis-cli CONFIG SET maxclients 10000
   redis-cli CONFIG SET timeout 1800
   ```

4. 将配置添加到 `redis.conf` 或 Docker 命令中以永久生效：
   ```conf
   maxclients 10000
   timeout 1800
   ```

5. 重启 Redis 以清除累积的连接：
   ```bash
   # 对于 systemd
   sudo systemctl restart redis

   # 对于 Docker
   docker restart redis
   ```

**预防措施：**始终将 `timeout` 配置为合理的值（例如 1800 秒）。该超时仅影响空闲 TCP 连接，不影响用户会话。这样做安全且值得推荐。同时在客户端设置 `REDIS_HEALTH_CHECK_INTERVAL`（见下文）。

#### 问题：空闲一段时间后的第一个请求出现“Connection reset by peer”错误 {#issue-connection-reset-by-peer-errors-on-first-request-after-idle-period}

**症状：**

- 日志中间歇性出现 `redis.exceptions.ConnectionError: Connection reset by peer`
- 错误往往出现在低活跃时段（夜间、周末）之后
- 触发错误的请求会失败并返回 500 Internal Server Error，但后续请求成功
- 配置 Redis 服务器 `timeout` 时更常见（应该配置，见上文）

**原因：**Redis 服务器通过其 `timeout` 设置清理了空闲连接，但 redis-py 中池化的套接字并不知道它已失效。下一个从池中获取该套接字的请求向一个已关闭的连接发送了命令。

**解决方案：**

将 `REDIS_HEALTH_CHECK_INTERVAL` 环境变量设置为一个**短于** Redis 服务器 `timeout` 的值：

```bash
# Redis 服务器超时为 1800 秒（30 分钟），因此每 60 秒检查一次
REDIS_HEALTH_CHECK_INTERVAL=60
```

这会让 redis-py 在复用任何已空闲超过 60 秒的池化连接之前向其发送 PING。如果连接已失效，系统会透明地替换它。PING 还会重置服务器的空闲计时器，使活跃使用的连接保持存活。

**如何选择合适的值：**

| Redis `timeout` | 建议的 `REDIS_HEALTH_CHECK_INTERVAL` |
|-----------------------|-----------------------------------------|
| 300（5 分钟） | 30 |
| 900（15 分钟） | 60 |
| 1800（30 分钟） | 60 |
| 3600（1 小时） | 120 |

健康检查间隔还应短于应用程序与 Redis 之间任何防火墙或负载均衡器的空闲超时。

### 其他资源 {#additional-resources}

- [Redis 文档](https://redis.io/docs)
- [使用 Valkey](/tutorials/integrations/valkey)：开源、可直接替代且兼容 Redis 的方案
- [Docker Compose 文档](https://docs.docker.com/compose/overview/)
- [Open WebUI 环境变量](/reference/env-configuration/)
- [sysctl 文档](https://man7.org/linux/man-pages/man8/sysctl.8.html)

### 获取帮助 {#getting-help}

如果按照本指南操作后仍然遇到问题：

1. 查看 [Open WebUI GitHub Issues](https://github.com/open-webui/open-webui/issues)
2. 检查完整配置中是否有拼写错误
3. 确认所有容器都能在 Docker 网络上通信
4. 收集 Open WebUI 和 Redis 容器的相关日志
5. 加入 [Open WebUI Discord](https://discord.gg/5rJgQTnV4s) 获取社区支持

---
sidebar_position: 50
title: "Redis Websocket Support"
---

# Redis Websocket Support

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Overview

This page sets up Redis for Open WebUI: the Redis server settings it needs, the Open WebUI variables, Sentinel and Cluster, and troubleshooting.

## When is Redis Required?

Redis is required as soon as more than one Open WebUI process runs (several Uvicorn workers or several instances), and it is what makes signing out revoke a token. [Step 2: Add Redis](/getting-started/advanced-topics/scaling#step-2-add-redis) explains what it coordinates and when a single instance needs it.

### Prerequisites

- A Redis container (this example uses `redis:7-alpine`)
- Docker Compose v2
- A Docker network shared by Open WebUI and Redis

### Critical: Redis Server Configuration

:::danger

**Prevent "Max Number of Clients Reached" Errors**

Before configuring Open WebUI to use Redis, you **must** ensure your Redis server itself is properly configured. A common misconfiguration causes connections to accumulate over time, eventually exhausting the connection limit and causing **complete authentication failure** (500 Internal Server Error for all users).

**The Problem:**

Open WebUI uses Redis for:
- Token validation/revocation checking (every authenticated request)
- WebSocket management (real-time updates)
- Session storage (if `ENABLE_STAR_SESSIONS_MIDDLEWARE` is enabled)

With default Redis settings on some distributions (`maxclients 1000`, `timeout 0`), connections are never closed. Over days or weeks, they accumulate silently until the limit is reached. Then, suddenly, no one can log in.

**The Symptoms:**
- Application works fine for days/weeks
- Suddenly, all users get 500 Internal Server Error on login
- Error in logs: `redis.exceptions.ConnectionError: max number of clients reached`
- May temporarily "fix itself" as old connections eventually die, then fail again

**The Solution:**

Add these settings to your Redis configuration:

```conf
# Allow sufficient concurrent connections
maxclients 10000

# Close idle connections after 30 minutes (1800 seconds)
# Affects only idle TCP connections to Redis, not sessions
timeout 1800
```

**For Docker deployments**, add to your Redis command:

```yml
services:
  redis:
    image: redis:7-alpine
    command: "redis-server --save 30 1 --appendonly yes --maxclients 10000 --timeout 1800 --maxmemory-policy noeviction"
    # ... rest of config
```

**Why `timeout 1800` is safe:**

The timeout only affects idle Redis TCP connections, not user sessions. When a connection times out:
- The user's JWT token remains valid
- Their session is not affected
- The next request simply opens a new Redis connection (adds ~1-5ms, imperceptible)

**Monitoring:**

Check current connection count:
```bash
redis-cli INFO clients | grep connected_clients
```

With proper `timeout` configuration, this number should fluctuate naturally (rising during active hours, falling during quiet periods) rather than climbing indefinitely.

:::

### Critical: Memory Eviction Policy

:::danger

**Do not give Open WebUI's Redis an `allkeys-*` eviction policy.**

Open WebUI uses Redis as a **stateful store, not a disposable cache**. Its keys fall into two groups:

- **TTL'd security keys**: token-revocation entries (`{prefix}:auth:token:<jti>:revoked`, set to expire exactly when the token would) and distributed locks (set with an expiry).
- **Persistent operational keys**: the websocket **session** and **usage** pools (Redis hashes with no expiry) and the cached tool server and terminal server lists.

Under an `allkeys-lru`, `allkeys-lfu`, or `allkeys-random` policy, Redis evicts **any** key when memory fills, including the two groups above. That can:

- **silently un-revoke a signed-out token**: if the revocation key is evicted before its TTL, a token that was invalidated by signing out starts working again (a security regression), and
- **break websockets, session tracking, and configuration** by evicting the persistent pools.

Use **`noeviction`** (the safe default). When memory is exhausted, Redis rejects new writes with an error, which is a loud, recoverable signal, instead of silently discarding auth and session state:

```conf
maxmemory-policy noeviction
```

Open WebUI's Redis working set is small (websocket pools, revocations, locks, tasks, rate limits, model caches, collaborative-note documents and cached tool/terminal server lists), so with `maxmemory` left unset Redis simply uses what it needs and never evicts. Only set a `maxmemory` cap if you have a specific reason to, and if you do, alert on usage rather than relying on eviction.

If you genuinely must cap memory **with** eviction, the only acceptable policies are `volatile-ttl` or `volatile-lru`: these evict **only** keys that carry a TTL (locks and revocations) and never the persistent pools. Be aware this can still drop a revocation early, so prefer adding RAM over enabling eviction.

:::

### Persistence

The example command uses `--save 30 1` (an RDB snapshot after 30 seconds, if at least one key changed). On an **unclean** restart, Redis loses every write since the last snapshot, including token revocations and session state, so a crash can resurrect signed-out tokens and drop active sessions.

For production, also enable the append-only file so the loss is bounded to about a second:

```conf
appendonly yes
appendfsync everysec
```

`appendfsync everysec` flushes the AOF to disk once per second, bounding worst-case loss to roughly one second at a small, usually negligible I/O cost for Open WebUI's modest Redis workload. RDB and AOF coexist; keeping both gives fast restarts plus second-level durability. The example `command` in the next section already includes `--appendonly yes` and `--maxmemory-policy noeviction`.

## Setting up Redis

To set up Redis for websocket support, you will need to create a `docker-compose.yml` file with the following contents:

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

Notes

The `ports` directive is not included in this configuration, as it is not necessary in most cases. The Redis service will still be accessible from within the Docker network by the Open WebUI service. However, if you need to access the Redis instance from outside the Docker network (e.g., for debugging or monitoring purposes), you can add the `ports` directive to expose the Redis port (e.g., `6379:6379`).

The above configuration sets up a Redis container named `redis` and mounts a volume for data persistence. The `healthcheck` directive ensures that the container is restarted if it fails to respond to the `ping` command. The `--save 30 1` command option writes an RDB snapshot 30 seconds after a change if at least 1 key has changed, and `--appendonly yes` adds the append-only log for second-level durability.

**Important:** The `--maxclients 10000 --timeout 1800` flags prevent connection exhaustion, and `--maxmemory-policy noeviction` stops Redis from silently evicting Open WebUI's session and token-revocation keys. See the [Critical: Redis Server Configuration](#critical-redis-server-configuration), [Memory Eviction Policy](#critical-memory-eviction-policy), and [Persistence](#persistence) sections above for details.

:::

### WebSocket Pub/Sub Buffer Limits

Open WebUI uses Socket.IO over Redis Pub/Sub when `WEBSOCKET_MANAGER=redis` is enabled. Streaming responses and tool events can generate large websocket events because some updates include accumulated message state, not only the newest token delta. If Redis disconnects Pub/Sub clients while delivering these events, users can see stalled streams, missing live updates, or log messages such as:

```text
Cannot publish to redis... retrying
Cannot publish to redis... giving up
redis.exceptions.TimeoutError: Timeout connecting to server
```

Check whether Redis is disconnecting Pub/Sub clients because of output buffer limits:

```bash
redis-cli INFO stats | grep client_output_buffer_limit_disconnections
redis-cli SLOWLOG GET 50
redis-cli CONFIG GET client-output-buffer-limit
```

If the slow log shows large `PUBLISH socketio ...` payloads and `client_output_buffer_limit_disconnections` increases, raise the Redis Pub/Sub output buffer limit. For example:

```conf
# Keep normal clients unchanged; allow larger websocket Pub/Sub bursts.
client-output-buffer-limit normal 0 0 0 replica 268435456 67108864 60 pubsub 1073741824 268435456 180
```

This sets the Pub/Sub hard limit to 1 GB and the soft limit to 256 MB for 180 seconds. Tune these values for your available Redis memory and expected websocket payload size. Higher limits make Redis more tolerant of temporary slow subscribers, but they also allow each slow Pub/Sub client to buffer more memory before Redis disconnects it.

With [per-room Redis channels](../../getting-started/advanced-topics/scaling.md#per-room-redis-channels) on (the default), Redis sends each instance only the updates for people connected to it, which keeps these buffers smaller in multi-instance setups. The room channels show up in the slow log as `PUBLISH socketio#...`.

If you changed Redis configuration at runtime, verify the active value:

```bash
redis-cli CONFIG GET client-output-buffer-limit
```

To create a Docker network for communication between Open WebUI and Redis, run the following command:

```bash
docker network create openwebui-network
```

## Configuring Open WebUI

### Basic Configuration (All Deployments)

```bash
REDIS_URL="redis://redis:6379/0"
WEBSOCKET_MANAGER="redis"
```

`REDIS_URL` is the connection for token revocation, locks, task tracking, rate limits and shared caches. `WEBSOCKET_MANAGER=redis` makes the websocket layer use Redis as well, so live updates reach users connected to any worker or instance.

### Websocket Configuration

WebSockets are on by default ([`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support)). The websocket layer uses `REDIS_URL` and follows `REDIS_CLUSTER`. Set [`WEBSOCKET_REDIS_URL`](/reference/env-configuration#websocket_redis_url) (and `WEBSOCKET_REDIS_CLUSTER`) only to put websocket traffic on a different Redis server or database, for example `redis://redis:6379/1`.

:::warning CORS and websockets
If you set [`CORS_ALLOW_ORIGIN`](/reference/env-configuration#cors_allow_origin), include every origin users open Open WebUI from, for example `https://chat.example.com`, separated by semicolons. Websocket connections from any other origin are refused. See [Connection Errors](/troubleshooting/connection-error#https-tls-cors--websocket-issues).
:::

### Optional Configuration

```bash
REDIS_KEY_PREFIX="open-webui"
```

The `REDIS_KEY_PREFIX` allows multiple Open WebUI instances to share the same Redis instance without key conflicts. `open-webui` is already the default, so this line only matters when you change it, and the prefix is used verbatim in cluster mode too.

### Sentinel Failover Configuration

Sentinel is enabled by setting `REDIS_SENTINEL_HOSTS` (comma-separated) and optionally `REDIS_SENTINEL_PORT` (default `26379`); set `WEBSOCKET_SENTINEL_HOSTS` and `WEBSOCKET_SENTINEL_PORT` as well, because the websocket manager does not read the `REDIS_SENTINEL_*` pair. In that mode the hostname part of `REDIS_URL` is the Sentinel master (service) name, and its database and credentials are reused. The master name is case sensitive, so write it exactly as configured in Sentinel (for example `redis://:password@myMaster:6379/0`). The user name and password in the URL are also sent to the Sentinels, so Sentinels protected with the same password work without extra settings.

:::danger Critical: Socket Timeout for Sentinel Deployments

Redis Sentinel setups require explicit socket connection timeout configuration to ensure proper failover behavior. Without a timeout, the application can hang indefinitely when a Redis master node goes offline, potentially preventing even application restarts.

**Symptoms of missing timeout configuration:**
- Application becomes completely unresponsive during failover
- Application hangs on startup if the first Sentinel host is unreachable  
- Recovery takes minutes instead of seconds after master failover

**Required configuration:**
```bash
REDIS_SOCKET_CONNECT_TIMEOUT=5
```

This sets a 5-second timeout for socket connection attempts to Redis/Sentinel nodes, allowing the application to fail over gracefully.

:::

:::warning

**If using WEBSOCKET_REDIS_OPTIONS**

When you explicitly set `WEBSOCKET_REDIS_OPTIONS`, `REDIS_SOCKET_CONNECT_TIMEOUT` does not automatically apply to websocket connections. You must include the timeout in both places:
```bash
REDIS_SOCKET_CONNECT_TIMEOUT=5
WEBSOCKET_REDIS_OPTIONS='{"socket_connect_timeout": 5}'
```

:::

#### Retry and Reconnect Logic

To enhance resilience during Sentinel failover (the window when a new master is being elected and promoted) you can configure retry behavior to prevent the application from exhausting its reconnection attempts too quickly.

- **`REDIS_SENTINEL_MAX_RETRY_COUNT`**: Sets the maximum number of retries for Redis operations when using Sentinel (Default: `2`).
- **`REDIS_RECONNECT_DELAY`**: Adds an optional delay in **milliseconds** between retry attempts (e.g., `REDIS_RECONNECT_DELAY=500`). This prevents tight retry loops that may otherwise overwhelm the event loop or block the application before a new master is ready.

#### Connection Health Checks

If your Redis server has a `timeout` configured (recommended, see above), pooled connections that sit idle longer than that timeout will be reaped server-side. Without health checks, the next request that grabs one of those dead sockets will fail with `ConnectionError: Connection reset by peer`.

- **`REDIS_HEALTH_CHECK_INTERVAL`**: How often (in seconds) redis-py should PING an idle pooled connection before reusing it (e.g., `REDIS_HEALTH_CHECK_INTERVAL=60`). The value must be **shorter** than your Redis server's `timeout` and any firewall/load balancer idle timeout on the path to Redis. Set to `0` or leave empty to disable.
- **`REDIS_SOCKET_KEEPALIVE`**: Enables TCP `SO_KEEPALIVE` on all Redis client sockets (e.g., `REDIS_SOCKET_KEEPALIVE=True`). When enabled, the OS kernel sends TCP keepalive probes on idle connections, detecting half-closed sockets caused by silent firewall/load balancer resets or network flaps at the TCP level.

These two mechanisms are complementary:
- `REDIS_HEALTH_CHECK_INTERVAL` works at the **application level**: redis-py PINGs idle connections on checkout, validating the socket and resetting the server's idle timer.
- `REDIS_SOCKET_KEEPALIVE` works at the **TCP level**: the kernel detects dead peers even when no application-level traffic is flowing.

:::tip Recommended pairing

For robust production deployments, configure all three layers together:

| Mechanism | Level | Covers | Example |
|-----------|-------|--------|---------|
| `timeout 1800` (redis.conf) | Server | Reaps leaked/orphaned connections the app forgot about | Safety net |
| `REDIS_HEALTH_CHECK_INTERVAL=60` | Application | Detects dead sockets before real commands use them; keeps pooled connections alive | Active protection |
| `REDIS_SOCKET_KEEPALIVE=True` | TCP/Kernel | Detects half-closed sockets from silent network resets (firewalls, LBs, NIC flaps) | Network-level protection |

:::

### Redis Cluster Mode

For deployments using Redis Cluster (including managed services like **AWS Elasticache Serverless**), enable cluster mode with the following configuration:

```bash
REDIS_URL="redis://your-cluster-endpoint:6379/0"
REDIS_CLUSTER="true"
```

:::info

**Key Configuration Notes**

- `REDIS_CLUSTER` enables cluster-aware connection handling
- The `REDIS_URL` should point to your cluster's configuration endpoint
- This option has no effect if `REDIS_SENTINEL_HOSTS` is defined (Sentinel takes precedence)

:::

#### AWS Elasticache Serverless

For AWS Elasticache Serverless deployments, use the following configuration:

```bash
REDIS_URL="rediss://your-elasticache-endpoint.serverless.use1.cache.amazonaws.com:6379/0"
REDIS_CLUSTER="true"
```

Note the `rediss://` scheme (with double 's') which enables TLS, required for Elasticache Serverless.

#### OpenTelemetry Support

Redis Cluster mode is fully compatible with OpenTelemetry instrumentation. When `ENABLE_OTEL` is enabled, Redis operations are properly traced regardless of whether you're using a single Redis instance, Redis Sentinel, or Redis Cluster mode.

### Complete Example Configuration

```bash
# Required for multi-replica deployments
REDIS_URL="redis://redis:6379/0"
WEBSOCKET_MANAGER="redis"

# Recommended for Sentinel deployments (prevents failover hangs)
REDIS_SOCKET_CONNECT_TIMEOUT=5
REDIS_SENTINEL_MAX_RETRY_COUNT=5
REDIS_RECONNECT_DELAY=1000

# Recommended: detect stale pooled connections (must be < Redis server timeout)
REDIS_HEALTH_CHECK_INTERVAL=60

# Recommended: enable TCP keepalive for dead-peer detection at the kernel level
REDIS_SOCKET_KEEPALIVE=True
```

#### Redis Cluster Mode Example

```bash
REDIS_URL="rediss://your-cluster-endpoint:6379/0"
REDIS_CLUSTER="true"
WEBSOCKET_MANAGER="redis"
```

### Docker Run Example

Connect Open WebUI to the same Docker network as Redis:

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

**Important Note on Service Names**

In the examples above, we use `redis://redis:6379` because:

- `redis` is the container name defined in the docker-compose.yml
- Docker's internal DNS resolves this name to the correct IP address within the network
- This is the recommended approach for Docker deployments

Do **not** use `127.0.0.1` or `localhost` when connecting from one container to another. These refer to the container's own localhost, not the Redis container.

:::

## Verification

### Verify Redis Connection

First, confirm that your Redis instance is running and accepting connections:

```bash
docker exec -it redis redis-cli -p 6379 ping
```

This command should output `PONG` if the Redis instance is running correctly.

### Verify Open WebUI Configuration

After starting your Open WebUI instance with the proper Redis configuration, check the logs to confirm successful integration:

#### Check for General Redis Connection

Look for log messages indicating Redis is being used for application state:

```bash
docker logs open-webui 2>&1 | grep -i redis
```

#### Check for Websocket Redis Connection

If you set `WEBSOCKET_MANAGER=redis` and `GLOBAL_LOG_LEVEL=DEBUG`, you should see this log message:

```
DEBUG:open_webui.socket.main:Using Redis to manage websockets.
```

To check this specifically:

```bash
docker logs open-webui 2>&1 | grep "Using Redis to manage websockets"
```

### Verify Redis Keys

You can also verify that Open WebUI is actually writing data to Redis:

```bash
docker exec -it redis redis-cli --scan --pattern "open-webui*"
```

If Redis is configured correctly, you should see keys with your configured prefix, such as `open-webui:session_pool` and `open-webui:usage_pool` once someone has the UI open, `open-webui:ratelimit:*` after a password sign-in and `open-webui:auth:token:*:revoked` after a sign-out. If you set `WEBSOCKET_REDIS_URL` to another database, the two pools live there (add `-n <db>` to the command). Persisted configuration is shared through the database, not Redis.

The `/ready` endpoint also returns 503 while Redis does not answer, so a readiness probe on it catches a lost Redis connection.

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Connection to Redis failed"

**Symptoms:**

- Error messages about Redis connection in logs
- Application fails to start or crashes
- Websockets don't work

**Solutions:**

1. Verify Redis container is running: `docker ps | grep redis`
2. Check Redis is healthy: `docker exec -it redis redis-cli ping`
3. Verify network connectivity: `docker network inspect openwebui-network`
4. Ensure the `REDIS_URL` uses the correct container name, not `127.0.0.1` or `localhost`
5. Check that both containers are on the same Docker network

#### Issue: "Websockets not working"

**Symptoms:**

- Real-time chat updates don't appear
- Need to refresh page to see new messages
- Connection errors in browser console

**Solutions:**

1. Verify `WEBSOCKET_MANAGER="redis"` is set on every instance, and that `ENABLE_WEBSOCKET_SUPPORT` is not set to `false` on only some of them.
2. Check logs for: `DEBUG:open_webui.socket.main:Using Redis to manage websockets.` (logged at DEBUG level, so it appears only with `GLOBAL_LOG_LEVEL=DEBUG`)
3. Verify Redis is accessible from Open WebUI container
4. If your Redis user is restricted by ACLs, check the log for `Redis denied publishing` or `Redis denied subscribing`. Either means the user is missing a command or channel permission, and the log line names the permissions and channels to check. With `WEBSOCKET_REDIS_ROOM_CHANNELS` on (the default), the user needs `PUBLISH`, `SUBSCRIBE`, `UNSUBSCRIBE` and `PING`, plus access to the channels `&socketio` and `&socketio#*`. See [Per-Room Redis Channels](../../getting-started/advanced-topics/scaling.md#per-room-redis-channels).

#### Issue: "Multiple Open WebUI instances interfering with each other"

**Symptoms:**

- Two separate Open WebUI installations share one Redis server
- Active-user counts or model lists of one installation show up in the other

**Solution:**
Use different `REDIS_KEY_PREFIX` values for each installation:

```bash
# Instance 1
REDIS_KEY_PREFIX="openwebui-prod"

# Instance 2
REDIS_KEY_PREFIX="openwebui-dev"
```

#### Issue: "Redis memory usage growing continuously"

**Symptoms:**

- Redis memory usage increases over time
- Container eventually runs out of memory

:::danger
Do **not** "fix" this with `--maxmemory-policy allkeys-lru`. Open WebUI's Redis holds token-revocation keys, session pools, and locks, not disposable cache. An `allkeys-*` policy can silently un-revoke a signed-out token and break sessions. See [Memory Eviction Policy](#critical-memory-eviction-policy).
:::

Continuously growing memory usually means key growth, not a missing eviction policy, so investigate the cause rather than masking it with eviction.

**Solutions:**

1. Find what is consuming memory and whether it is growing without bound:

   ```bash
   docker exec -it redis redis-cli info memory
   docker exec -it redis redis-cli --bigkeys
   docker exec -it redis redis-cli info keyspace   # key counts per DB
   ```

2. Confirm `timeout` is set (idle-connection accumulation also shows up as memory growth), per the [Critical: Redis Server Configuration](#critical-redis-server-configuration) section.

3. If you must cap memory, set a `maxmemory` limit paired with **`noeviction`** so Redis fails writes loudly instead of dropping auth/session state, then alert on `used_memory`:

   ```conf
   maxmemory 512mb
   maxmemory-policy noeviction
   ```

4. Avoid `FLUSHDB`/`FLUSHALL` on a live instance: it wipes active sessions, the revocation list, and locks. Restart the Redis container instead if you need to clear accumulated state during a maintenance window.

#### Issue: "max number of clients reached" after days/weeks of operation

**Symptoms:**

- Application worked fine for an extended period, then suddenly fails
- All login attempts return 500 Internal Server Error
- Error in logs: `redis.exceptions.ConnectionError: max number of clients reached`
- May temporarily recover, then fail again

**Cause:** Redis `maxclients` limit reached due to connection accumulation. This happens when:
- `timeout` is set to `0` (connections never close)
- `maxclients` is too low for your usage pattern

**Solution:**

1. Check current connection count:
   ```bash
   redis-cli INFO clients | grep connected_clients
   ```

2. Check current settings:
   ```bash
   redis-cli CONFIG GET maxclients
   redis-cli CONFIG GET timeout
   ```

3. Fix the configuration:
   ```bash
   redis-cli CONFIG SET maxclients 10000
   redis-cli CONFIG SET timeout 1800
   ```

4. Make permanent by adding to `redis.conf` or Docker command:
   ```conf
   maxclients 10000
   timeout 1800
   ```

5. Restart Redis to clear accumulated connections:
   ```bash
   # For systemd
   sudo systemctl restart redis
   
   # For Docker
   docker restart redis
   ```

**Prevention:** Always configure `timeout` to a reasonable value (e.g., 1800 seconds). The timeout only affects idle TCP connections, not user sessions. It's safe and recommended. Pair this with `REDIS_HEALTH_CHECK_INTERVAL` on the client side (see below).

#### Issue: "Connection reset by peer" errors on first request after idle period

**Symptoms:**

- Sporadic `redis.exceptions.ConnectionError: Connection reset by peer` in logs
- Errors tend to appear after periods of low activity (nights, weekends)
- The request that triggers the error fails with a 500 Internal Server Error, but subsequent requests succeed
- More common when Redis server `timeout` is configured (which it should be, see above)

**Cause:** The Redis server reaped an idle connection (via its `timeout` setting), but the pooled socket in redis-py was not aware it was dead. The next request that grabbed that socket from the pool sent a command to a closed connection.

**Solution:**

Set the `REDIS_HEALTH_CHECK_INTERVAL` environment variable to a value **shorter** than your Redis server's `timeout`:

```bash
# Redis server timeout is 1800s (30 min), so check every 60s
REDIS_HEALTH_CHECK_INTERVAL=60
```

This tells redis-py to PING any pooled connection that has been idle for more than 60 seconds before reusing it. If the connection is dead, it is replaced transparently. The PING also resets the server's idle timer, keeping actively-used connections alive.

**How to choose the right value:**

| Your Redis `timeout` | Suggested `REDIS_HEALTH_CHECK_INTERVAL` |
|-----------------------|-----------------------------------------|
| 300 (5 min)           | 30                                      |
| 900 (15 min)          | 60                                      |
| 1800 (30 min)         | 60                                      |
| 3600 (1 hour)         | 120                                     |

The health check interval should also be shorter than any firewall or load balancer idle timeout between the application and Redis.

### Additional Resources

- [Redis Documentation](https://redis.io/docs)
- [Using Valkey](/tutorials/integrations/valkey): the open-source, drop-in Redis-compatible alternative
- [Docker Compose Documentation](https://docs.docker.com/compose/overview/)
- [Open WebUI Environment Variables](https://docs.openwebui.com/reference/env-configuration/)
- [sysctl Documentation](https://man7.org/linux/man-pages/man8/sysctl.8.html)

### Getting Help

If you continue to experience issues after following this guide:

1. Check the [Open WebUI GitHub Issues](https://github.com/open-webui/open-webui/issues)
2. Review your complete configuration for typos
3. Verify all containers can communicate on the Docker network
4. Collect relevant logs from both Open WebUI and Redis containers
5. Join the [Open WebUI Discord](https://discord.gg/5rJgQTnV4s) for community support

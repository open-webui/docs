---
sidebar_position: 30
title: "Redis Websocket Support"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# 🔗 Redis Websocket Support

## Overview

This documentation page outlines the steps required to integrate Redis with Open WebUI for websocket support. By following these steps, you will be able to enable websocket functionality in your Open WebUI instance, allowing for real-time communication and updates between clients and your application.

## When is Redis Required?

Redis serves two distinct purposes in Open WebUI, and understanding when it's required is crucial for proper deployment:

### Single Instance Deployments

If you're running Open WebUI as a **single instance** with `UVICORN_WORKERS=1` (the default), Redis is **completely optional and not strictly needed**. The application will function normally without it for all operations.

### Multi-Worker and Multi-Instance Deployments

Redis becomes **mandatory** in the following scenarios:

1. **Multiple Uvicorn Workers** (`UVICORN_WORKERS > 1`)
   - Running multiple worker processes on a single host
   - Requires Redis to share session state and application configuration between workers

2. **Multi-Node Deployments**
   - Kubernetes clusters with multiple pods
   - Docker Swarm with multiple replicas
   - Load-balanced setups with multiple Open WebUI instances
   - Requires Redis to coordinate state across all instances

3. **High Availability Setups**
   - Any deployment pattern where multiple Open WebUI processes run simultaneously
   - Requires Redis for session management, websocket coordination, and state synchronization

:::warning

**Critical Requirement**

Without Redis in multi-worker or multi-instance scenarios, you will experience:

- Session management failures across workers
- Inconsistent application state between instances
- Non-functional websocket connections
- Intermittent authentication failures
- Loss of real-time chat updates

:::

### Prerequisites

- A valid Open WebUI instance (running version 1.0 or higher)
- A Redis container (we will use `docker.io/valkey/valkey:8.0.1-alpine` in this example, which is based on the latest Redis 7.x release)
- Docker Composer (version 2.0 or higher) installed on your system
- A Docker network for communication between Open WebUI and Redis
- Basic understanding of Docker, Redis, and Open WebUI

## Setting up Redis

To set up Redis for websocket support, you will need to create a `docker-compose.yml` file with the following contents:

```yml
version: '3.9'
services:
  redis:
    image: docker.io/valkey/valkey:8.0.1-alpine
    container_name: redis-valkey
    volumes:
      - redis-data:/data
    command: "valkey-server --save 30 1"
    healthcheck:
      test: "[ $$(valkey-cli ping) = 'PONG' ]"
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

The above configuration sets up a Redis container named `redis-valkey` and mounts a volume for data persistence. The `healthcheck` directive ensures that the container is restarted if it fails to respond to the `ping` command. The `--save 30 1` command option saves the Redis database to disk every 30 minutes if at least 1 key has changed.

:::

To create a Docker network for communication between Open WebUI and Redis, run the following command:

```bash
docker network create openwebui-network
```

## Configuring Open WebUI

To enable Redis support in Open WebUI, you need to configure different environment variables depending on your deployment type.

### Basic Configuration (All Deployments)

For **all deployments** using Redis (single or multi-instance), set the following base environment variable:

```bash
REDIS_URL="redis://redis-valkey:6379/0"
```

This variable configures the primary Redis connection for application state management, session storage, and coordination between instances.

### Websocket Configuration

To enable websocket support specifically, add these additional environment variables:

```bash
ENABLE_WEBSOCKET_SUPPORT="true"
WEBSOCKET_MANAGER="redis"
WEBSOCKET_REDIS_URL="redis://redis-valkey:6379/1"
```

:::danger Critical: Configure CORS for WebSocket Connections

A very common and difficult-to-debug issue with WebSocket connections is a misconfigured Cross-Origin Resource Sharing (CORS) policy. If your Open WebUI instance is accessed from a different domain or port than the backend (e.g., behind a reverse proxy), you **must** set the `CORS_ALLOW_ORIGIN` environment variable. This variable tells the server which origins are permitted to access its resources.

Failure to configure this correctly will cause WebSocket connections to fail silently or with cryptic browser errors and forgetting to set this variable is a common cause of WebSocket connection issues.

**Example:**
If you access your UI at `https://my-open-webui.com`, you must set:

```bash
CORS_ALLOW_ORIGIN="https://my-open-webui.com"
```

You can also provide a semicolon-separated list of allowed domains. **Do not skip this step in a production or reverse-proxied setup.**

:::

:::info

**Redis Database Numbers**

Notice the different database numbers (`/0` vs `/1`) in the URLs:

- `REDIS_URL` uses database `0` for general application state
- `WEBSOCKET_REDIS_URL` uses database `1` for websocket-specific data

This separation helps isolate different types of data. You can use the same database number for both if preferred, but using separate databases is recommended for better organization and potential performance optimization.

:::

### Optional Configuration

```bash
REDIS_KEY_PREFIX="open-webui"
```

The `REDIS_KEY_PREFIX` allows multiple Open WebUI instances to share the same Redis instance without key conflicts. In Redis cluster mode, the prefix is formatted as `{prefix}:` (e.g., `{open-webui}:config:*`) to enable multi-key operations on configuration keys within the same hash slot.

### Complete Example Configuration

Here's a complete example showing all Redis-related environment variables:

```bash
# Required for multi-worker/multi-instance deployments
REDIS_URL="redis://redis-valkey:6379/0"

# Required for websocket support
ENABLE_WEBSOCKET_SUPPORT="true"
WEBSOCKET_MANAGER="redis"
WEBSOCKET_REDIS_URL="redis://redis-valkey:6379/1"

# Optional
REDIS_KEY_PREFIX="open-webui"
```

### Docker Run Example

When running Open WebUI using Docker, connect it to the same Docker network and include all necessary Redis variables:

```bash
docker run -d \
  --name open-webui \
  --network openwebui-network \
  -v open-webui:/app/backend/data \
  -p 3000:8080 \
  -e REDIS_URL="redis://redis-valkey:6379/0" \
  -e ENABLE_WEBSOCKET_SUPPORT="true" \
  -e WEBSOCKET_MANAGER="redis" \
  -e WEBSOCKET_REDIS_URL="redis://redis-valkey:6379/1" \
  -e REDIS_KEY_PREFIX="open-webui" \
  ghcr.io/open-webui/open-webui:main
```

:::warning

**Important Note on Service Names**

In the examples above, we use `redis://redis-valkey:6379` because:

- `redis-valkey` is the container name defined in the docker-compose.yml
- Docker's internal DNS resolves this name to the correct IP address within the network
- This is the recommended approach for Docker deployments

Do **not** use `127.0.0.1` or `localhost` when connecting from one container to another - these refer to the container's own localhost, not the Redis container.

:::

### Multi-Worker Configuration

If you're running multiple Uvicorn workers on a single host, add this variable:

```bash
UVICORN_WORKERS="4"  # Adjust based on your CPU cores
REDIS_URL="redis://redis-valkey:6379/0"  # Required when UVICORN_WORKERS > 1
```

:::danger

**Critical: Redis Required for UVICORN_WORKERS > 1**

If you set `UVICORN_WORKERS` to any value greater than 1, you **must** configure `REDIS_URL`. Failing to do so will cause:

- Session state to be lost between requests
- Authentication to fail intermittently
- Application configuration to be inconsistent
- Websockets to malfunction

:::

## Verification

### Verify Redis Connection

First, confirm that your Redis instance is running and accepting connections:

```bash
docker exec -it redis-valkey valkey-cli -p 6379 ping
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

If you have enabled websocket support, you should see this specific log message:

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
# List all Open WebUI keys
docker exec -it redis-valkey valkey-cli --scan --pattern "open-webui*"

# Or with the default Redis CLI
docker exec -it redis-valkey redis-cli --scan --pattern "open-webui*"
```

If Redis is configured correctly, you should see keys with your configured prefix (e.g., `open-webui:session:*`, `open-webui:config:*`).

### Test Multi-Worker Setup

If you're running with `UVICORN_WORKERS > 1`, test that sessions persist across workers:

1. Log in to Open WebUI
2. Refresh the page multiple times
3. You should remain logged in consistently

If you're logged out randomly or see authentication errors, Redis is likely not configured correctly.

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Connection to Redis failed"

**Symptoms:**

- Error messages about Redis connection in logs
- Application fails to start or crashes
- Websockets don't work

**Solutions:**

1. Verify Redis container is running: `docker ps | grep redis`
2. Check Redis is healthy: `docker exec -it redis-valkey valkey-cli ping`
3. Verify network connectivity: `docker network inspect openwebui-network`
4. Ensure the `REDIS_URL` uses the correct container name, not `127.0.0.1` or `localhost`
5. Check that both containers are on the same Docker network

#### Issue: "Session lost after page refresh" (with UVICORN_WORKERS > 1)

**Symptoms:**

- Users are logged out randomly
- Authentication works but doesn't persist
- Different behavior on each page refresh

**Cause:** `REDIS_URL` is not configured when using multiple workers

**Solution:**
Add the `REDIS_URL` environment variable:

```bash
REDIS_URL="redis://redis-valkey:6379/0"
```

#### Issue: "Websockets not working"

**Symptoms:**

- Real-time chat updates don't appear
- Need to refresh page to see new messages
- Connection errors in browser console

**Solutions:**

1. Verify all websocket environment variables are set:
   - `ENABLE_WEBSOCKET_SUPPORT="true"`
   - `WEBSOCKET_MANAGER="redis"`
   - `WEBSOCKET_REDIS_URL="redis://redis-valkey:6379/1"`
2. Check logs for: `DEBUG:open_webui.socket.main:Using Redis to manage websockets.`
3. Verify Redis is accessible from Open WebUI container

#### Issue: "Multiple Open WebUI instances interfering with each other"

**Symptoms:**

- Configuration changes affect other instances
- Sessions conflict between deployments
- Unexpected behavior when running multiple Open WebUI installations

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

**Solutions:**

1. Configure Redis maxmemory policy:

```yml
   command: "valkey-server --save 30 1 --maxmemory 256mb --maxmemory-policy allkeys-lru"
```

2. Monitor Redis memory: `docker exec -it redis-valkey valkey-cli info memory`
3. Clear old keys if needed: `docker exec -it redis-valkey valkey-cli FLUSHDB`

### Additional Resources

- [Redis Documentation](https://redis.io/docs)
- [Valkey Documentation](https://valkey.io/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/overview/)
- [Open WebUI Environment Variables](https://docs.openwebui.com/getting-started/env-configuration/)
- [sysctl Documentation](https://man7.org/linux/man-pages/man8/sysctl.8.html)

### Getting Help

If you continue to experience issues after following this guide:

1. Check the [Open WebUI GitHub Issues](https://github.com/open-webui/open-webui/issues)
2. Review your complete configuration for typos
3. Verify all containers can communicate on the Docker network
4. Collect relevant logs from both Open WebUI and Redis containers
5. Join the [Open WebUI Discord](https://discord.gg/5rJgQTnV4s) for community support

By following these steps and troubleshooting tips, you should be able to set up Redis with Open WebUI for both application state management and websocket support, enabling reliable multi-instance deployments and real-time communication between clients and your application.

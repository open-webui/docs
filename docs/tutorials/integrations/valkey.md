---
sidebar_position: 51
title: "Using Valkey (Redis-compatible)"
---

# Using Valkey

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## What is Valkey?

[Valkey](https://valkey.io/) is a BSD-licensed fork of Redis that speaks the **Redis protocol**, so Open WebUI talks to it through the same `REDIS_*` settings. This is the **same setup as the [Redis tutorial](/tutorials/integrations/redis)** with the Valkey image swapped in. Valkey is not part of what Open WebUI tests; see [Step 2: Add Redis](/getting-started/advanced-topics/scaling#step-2-add-redis) for what that means.

:::info Two different "Valkey" features, do not mix them up
- **Valkey as the Redis layer (this page)** is the cache, websocket and session store. It is configured with **`REDIS_URL`** and the `redis://` scheme, because Open WebUI uses the Redis protocol.
- **Valkey as a vector database** is a separate, non-core [vector store](/reference/env-configuration#valkey) (`VECTOR_DB=valkey`, the `valkey-search` module). It is configured with **`VALKEY_URL`** and the `valkey://` scheme.

They are unrelated and you can run either, both, or neither. This tutorial is about the first one.
:::

## When do you need it?

The same as for Redis: see [When is Redis Required?](/tutorials/integrations/redis#when-is-redis-required).

## Setting up Valkey

Create a `docker-compose.yml`:

```yml
services:
  valkey:
    image: docker.io/valkey/valkey:8.0.1-alpine
    container_name: valkey
    volumes:
      - valkey-data:/data
    command: "valkey-server --save 30 1 --appendonly yes --maxmemory-policy noeviction --maxclients 10000 --timeout 1800"
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
  valkey-data:

networks:
  openwebui-network:
    external: true
```

Create the shared network if you do not have one yet:

```bash
docker network create openwebui-network
```

:::tip Do not skip `--maxclients` and `--timeout`
With the default `timeout 0`, idle connections never close and accumulate until they hit the limit, which locks every user out with a 500 on login. See [Critical: Redis Server Configuration](/tutorials/integrations/redis#critical-redis-server-configuration), which applies to Valkey as well.
:::

## Connecting Open WebUI

Point Open WebUI at the Valkey container. The variables and the `redis://` scheme are unchanged; only the host (the container name) differs:

```bash
REDIS_URL="redis://valkey:6379/0"
WEBSOCKET_MANAGER="redis"
```

:::info The scheme stays `redis://`
Open WebUI connects over the Redis protocol, so the connection string is `redis://...` even though the server is Valkey. There is no `valkey://` form of these variables (that scheme belongs to the unrelated vector-database feature noted above).
:::

## Verify

```bash
docker exec -it valkey valkey-cli ping                              # → PONG
docker logs open-webui 2>&1 | grep -i redis                          # general connection
docker logs open-webui 2>&1 | grep "Using Redis to manage websockets"
```

The log line says "Redis" because Open WebUI uses the Redis protocol; that is expected and correct when the server is Valkey.

## Everything else is identical to Redis

Because Open WebUI speaks to Valkey over the Redis protocol, all of the configuration and troubleshooting in the [Redis Websocket Support](/tutorials/integrations/redis) tutorial applies as-is. Just substitute the `docker.io/valkey/valkey` image and the `valkey-cli` / `valkey-server` commands. In particular:

- [Configuration variables](/tutorials/integrations/redis#configuring-open-webui), the `REDIS_*`, websocket, Sentinel and Cluster settings
- [Connection exhaustion fixes](/tutorials/integrations/redis#critical-redis-server-configuration), `maxclients`, `timeout` and health checks
- [Troubleshooting](/tutorials/integrations/redis#troubleshooting), every issue and fix

## Additional Resources

- [Valkey Documentation](https://valkey.io/docs/)
- [Redis Websocket Support](/tutorials/integrations/redis), the full reference for both Redis and Valkey
- [Open WebUI Environment Variables](/reference/env-configuration)

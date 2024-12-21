---
sidebar_position: 30
title: "🔗 Redis Websocket Support"
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# 🔗 Redis Websocket Support

## Overview

This documentation page outlines the steps required to integrate Redis with Open WebUI for websocket support. By following these steps, you will be able to enable websocket functionality in your Open WebUI instance, allowing for real-time communication and updates between clients and your application.

### Prerequisites

* A valid Open WebUI instance (running version 1.0 or higher)
* A Redis container (we will use `docker.io/valkey/valkey:8.0.1-alpine` in this example, which is based on the latest Redis 7.x release)
* Docker Composer (version 2.0 or higher) installed on your system

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

volumes:
  redis-data:
```

This configuration sets up a Redis container named `redis-valkey` and mounts a volume for data persistence. The `healthcheck` directive ensures that the container is restarted if it fails to respond to the `ping` command.

## Configuring Open WebUI

To enable websocket support in Open WebUI, you will need to set the following environment variables for your Open WebUI instance:

```bash
ENABLE_WEBSOCKET_SUPPORT="true"
WEBSOCKET_MANAGER="redis"
WEBSOCKET_REDIS_URL="redis://redis:6379/1"
```

These environment variables enable websocket support, specify Redis as the websocket manager, and define the Redis URL. Make sure to replace the `WEBSOCKET_REDIS_URL` value with the actual URL of your Redis instance.

## Verification

If you have properly set up Redis and configured Open WebUI, you should see the following log message when starting your Open WebUI instance:

`DEBUG:open_webui.socket.main:Using Redis to manage websockets.`

This confirms that Open WebUI is using Redis for websocket management. You can also use the `docker exec` command using Command Prompt to verify that the Redis instance is running and accepting connections:

```bash
docker exec -it redis-valkey redis-cli -p 6379 ping
```

This command should output `PONG` if the Redis instance is running correctly. If this command fails, you could try this command instead:

```bash
docker exec -it redis-valkey valkey-cli -p 6379 ping
```

## Troubleshooting

If you encounter issues with Redis or websocket support in Open WebUI, you can refer to the following resources for troubleshooting:

* [Redis Documentation](https://redis.io/docs)
* [Open WebUI Documentation](https://open-webui.github.io/docs)
* [Docker Composer Documentation](https://docs.docker.com/compose/overview/)

By following these steps and troubleshooting tips, you should be able to set up Redis with Open WebUI for websocket support and enable real-time communication and updates between clients and your application.

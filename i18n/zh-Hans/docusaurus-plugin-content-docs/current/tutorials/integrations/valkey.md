---
sidebar_position: 51
title: "使用 Valkey（兼容 Redis）"
---

# 使用 Valkey

:::warning

本教程由社区贡献，Open WebUI 团队不提供支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 什么是 Valkey？ {#what-is-valkey}

[Valkey](https://valkey.io/) 是采用 BSD 许可证的 Redis 分支，使用 **Redis 协议**，因此 Open WebUI 通过相同的 `REDIS_*` 设置与其通信。这里的设置与 [Redis 教程](/tutorials/integrations/redis)**相同**，只需换用 Valkey 镜像。Open WebUI 的测试范围不包含 Valkey；有关其含义，请参阅[第 2 步：添加 Redis](/getting-started/advanced-topics/scaling#step-2-add-redis)。

:::info 两种不同的“Valkey”功能，请勿混淆
- **作为 Redis 层的 Valkey（本页）**是缓存、WebSocket 和会话存储。它使用 **`REDIS_URL`** 和 `redis://` 方案进行配置，因为 Open WebUI 使用 Redis 协议。
- **作为向量数据库的 Valkey** 是独立的非核心[向量存储](/reference/env-configuration#valkey)（`VECTOR_DB=valkey`、`valkey-search` 模块）。它使用 **`VALKEY_URL`** 和 `valkey://` 方案进行配置。

二者互不相关，你可以只运行其中一个、同时运行两个或都不运行。本教程介绍的是前者。
:::

## 何时需要它？ {#when-do-you-need-it}

与 Redis 相同：请参阅[何时需要 Redis？](/tutorials/integrations/redis#when-is-redis-required)。

## 设置 Valkey {#setting-up-valkey}

创建一个 `docker-compose.yml`：

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

如果还没有共享网络，请创建一个：

```bash
docker network create openwebui-network
```

:::tip 不要跳过 `--maxclients` 和 `--timeout`
使用默认的 `timeout 0` 时，空闲连接永远不会关闭，而会不断累积直至达到上限，导致所有用户在登录时因 500 错误而无法访问。请参阅[关键：Redis 服务器配置](/tutorials/integrations/redis#critical-redis-server-configuration)，该说明同样适用于 Valkey。
:::

## 连接 Open WebUI {#connecting-open-webui}

将 Open WebUI 指向 Valkey 容器。变量和 `redis://` 方案保持不变；只有主机（容器名称）不同：

```bash
REDIS_URL="redis://valkey:6379/0"
WEBSOCKET_MANAGER="redis"
```

:::info 方案仍为 `redis://`
Open WebUI 通过 Redis 协议连接，因此即使服务器是 Valkey，连接字符串仍为 `redis://...`。这些变量没有 `valkey://` 形式（该方案属于上面提到的独立向量数据库功能）。
:::

## 验证 {#verify}

```bash
docker exec -it valkey valkey-cli ping                              # → PONG
docker logs open-webui 2>&1 | grep -i redis                          # 一般连接
docker logs open-webui 2>&1 | grep "Using Redis to manage websockets"
```

日志行中显示“Redis”是因为 Open WebUI 使用 Redis 协议；当服务器是 Valkey 时，这是预期且正确的行为。

## 其他所有内容都与 Redis 相同 {#everything-else-is-identical-to-redis}

由于 Open WebUI 通过 Redis 协议与 Valkey 通信，[Redis WebSocket 支持](/tutorials/integrations/redis)教程中的所有配置和故障排除内容均可直接适用。只需替换为 `docker.io/valkey/valkey` 镜像以及 `valkey-cli` / `valkey-server` 命令。特别是：

- [配置变量](/tutorials/integrations/redis#configuring-open-webui)：`REDIS_*`、WebSocket、Sentinel 和 Cluster 设置
- [连接耗尽修复](/tutorials/integrations/redis#critical-redis-server-configuration)：`maxclients`、`timeout` 和健康检查
- [故障排除](/tutorials/integrations/redis#troubleshooting)：所有问题及修复方法

## 其他资源 {#additional-resources}

- [Valkey 文档](https://valkey.io/docs/)
- [Redis WebSocket 支持](/tutorials/integrations/redis)：Redis 和 Valkey 的完整参考
- [Open WebUI 环境变量](/reference/env-configuration)

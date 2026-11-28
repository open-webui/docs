## 先决条件 {#prerequisites}

- 已安装并运行 [Docker Engine](https://docs.docker.com/engine/install/)
- Open WebUI 正在运行（或准备与其一同部署）
- [Open WebUI 企业版许可证](/enterprise)（生产环境使用时必需）

## 使用 Docker Compose 快速开始 {#quick-start-with-docker-compose}

此 Compose 文件会同时部署 Open WebUI 和 Terminals 编排器。

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    environment:
      - >-
        MACHINE_CONNECTIONS=[{
          "id": "terminals",
          "name": "Terminals",
          "enabled": true,
          "url": "http://terminals:3000",
          "key": "${TERMINALS_API_KEY}",
          "auth_type": "bearer",
          "server_type": "orchestrator",
          "config": {
            "access_grants": [{
              "principal_type": "user",
              "principal_id": "*",
              "permission": "read"
            }]
          }
        }]
    volumes:
      - open-webui:/app/backend/data
    networks:
      - webui
    depends_on:
      - terminals

  terminals:
    image: ghcr.io/open-webui/terminals:latest
    environment:
      - TERMINALS_BACKEND=docker
      - TERMINALS_API_KEY=${TERMINALS_API_KEY}
      - TERMINALS_IMAGE=ghcr.io/open-webui/open-terminal:latest
      - TERMINALS_DOCKER_NETWORK=open-webui-network
      - TERMINALS_DOCKER_HOST_DATA_DIR=${PWD}/data/terminals
      - TERMINALS_IDLE_TIMEOUT_MINUTES=30
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/app/data
    networks:
      - webui

volumes:
  open-webui:

networks:
  webui:
    name: open-webui-network
```

Terminals 将其数据库和每个实例的文件保存在 Compose 文件旁的 `data` 文件夹中。`TERMINALS_DOCKER_HOST_DATA_DIR` 告知 Docker 该文件夹在主机上的位置，使实例容器能够挂载编排器管理的同一组文件。

在 Compose 文件旁的 `.env` 文件中设置共享 API 密钥：

```env
TERMINALS_API_KEY=change-me-to-a-strong-random-value
```

然后启动所有服务：

```bash
docker compose up -d
```

Open WebUI 将可通过 `http://localhost:3000` 访问。上述连接为每个用户授予**读取（Read）**权限，因此用户可以使用共享给他们的终端。请在连接的**访问权限（Access）**设置中为创建终端的人员授予**写入（Write）**权限，请参阅[创建机器](/features/open-terminal/terminals/orchestration/creating-terminals)。当用户打开终端时，编排器会自动预配实例。

:::warning Docker socket 访问
编排器需要访问 Docker socket（`/var/run/docker.sock`）才能管理容器。在生产环境中，请使用 [Tecnativa/docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy) 等 Docker socket 代理来限制它可以发起的 API 调用。
:::

---

此部署的编排器设置（例如 `TERMINALS_DOCKER_NETWORK`、`TERMINALS_DOCKER_DATA_DIR` 和 `TERMINALS_IDLE_TIMEOUT_MINUTES`）列于[编排器环境变量](/features/open-terminal/terminals/orchestration#orchestrator-environment-variables)。

---

<details>
<summary>容器生命周期详情</summary>

**筛选。** 使用 `docker ps --filter "label=app.kubernetes.io/managed-by=terminals"` 可以轻松筛选容器。

**启动。** 创建容器后，编排器会等待容器响应，最长等待 15 秒，然后开始代理流量。如果容器未能及时就绪，它会记录一条警告日志。

</details>

---

## 限制 {#limitations}

- **单主机。** 所有用户容器都在一台 Docker 主机上运行。如需高可用性或支持更大的团队，请使用 Kubernetes Operator 后端。
- **无内置高可用性。** 如果编排器停止运行，活动终端会话会中断（但容器会继续运行，并在编排器重启时进行状态协调）。
- **需要 Docker socket。** 编排器需要访问 Docker socket 才能管理容器。

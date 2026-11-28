---
sidebar_position: 12
title: "SearXNG"
---

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关与网页搜索相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

本指南介绍如何在 Docker 中使用 SearXNG 为 Open WebUI 设置网页搜索功能。

## SearXNG（Docker） {#searxng-docker}

> “**SearXNG 是一个免费的互联网元搜索引擎，可聚合来自各种搜索服务和数据库的结果。用户不会被跟踪，也不会被建立用户画像。**”

## 1. SearXNG 配置 {#1-searxng-configuration}

要将 SearXNG 配置为最适合与 Open WebUI 搭配使用，请按照以下步骤操作：

**步骤 1：使用 `git clone` 克隆 SearXNG Docker 并进入该目录：**

1. 克隆仓库 `searxng-docker`

 克隆 searxng-docker 仓库。这将创建一个名为 `searxng-docker` 的新目录，其中包含你的 SearXNG 配置文件。有关配置说明，请参阅 [SearXNG 文档](https://docs.searxng.org/)。

```bash
git clone https://github.com/searxng/searxng-docker.git
```

进入 `searxng-docker` 仓库，后续所有命令均在该目录中运行：

```bash
cd searxng-docker
```

**步骤 2：找到并修改 `.env` 文件：**

1. 取消 `.env` 文件中 `SEARXNG_HOSTNAME` 的注释，并按需设置：

```bash

# 默认监听 https://localhost

# 要更改此设置：

# * 取消 SEARXNG_HOSTNAME 的注释，并将 <host> 替换为 SearXNG 主机名

# * 取消 LETSENCRYPT_EMAIL 的注释，并将 <email> 替换为你的电子邮箱（创建 Let's Encrypt 证书时需要）

SEARXNG_HOSTNAME=localhost

# LETSENCRYPT_EMAIL=<email>

# 可选：

# 如果实例规模很小或很大，你可能需要调整使用的 uwsgi worker 数量以及每个 worker 的线程数

# 更多 worker（即进程）意味着可以同时处理更多搜索请求，但也会占用更多资源

# SEARXNG_UWSGI_WORKERS=4

# SEARXNG_UWSGI_THREADS=4
```

**步骤 3：修改 `docker-compose.yaml` 文件**

3. 通过修改 `docker-compose.yaml` 文件移除 `localhost` 限制：

如果端口 8080 已被占用，请在运行命令前将命令中的 `0.0.0.0:8080` 更改为 `0.0.0.0:[available port]`。

运行适用于你操作系统的命令：

- **Linux**
```bash
sed -i 's/127.0.0.1:8080/0.0.0.0:8080/' docker-compose.yaml
```

- **macOS**：
```bash
sed -i '' 's/127.0.0.1:8080/0.0.0.0:8080/' docker-compose.yaml
```

**步骤 4：授予必要权限**

4. 在根目录运行以下命令，允许容器创建新的配置文件：

```bash
sudo chmod a+rwx searxng
```

**步骤 5：创建非限制性的 `limiter.toml` 文件**

5. 创建非限制性的 `searxng-docker/searxng/limiter.toml` 配置文件：

*如果文件已存在，将缺失的行追加到其中。*

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>searxng-docker/searxng/limiter.toml</summary>

```bash

# 此配置文件会更新默认配置文件

# 请参阅 https://github.com/searxng/searxng/blob/master/searx/limiter.toml

[botdetection.ip_limit]

# 在 ip_limit 方法中启用 link_token 方法
link_token = false

[botdetection.ip_lists]
block_ip = []
pass_ip = []
```

</details>

**步骤 6：删除默认的 `settings.yml` 文件**

6. 如果存在默认的 `searxng-docker/searxng/settings.yml` 文件，请将其删除，因为 SearXNG 首次启动时会重新生成该文件：

```bash
rm searxng/settings.yml
```

**步骤 7：创建全新的 `settings.yml` 文件**

7. 短暂启动容器以生成新的 settings.yml 文件：

如果有多个同名容器正在运行，例如 caddy、redis 或 searxng，你需要在 docker-compose.yaml 文件中重命名它们以避免冲突。

```bash
docker compose up -d ; sleep 10 ; docker compose down
```

首次运行后，出于安全考虑，将 `cap_drop: - ALL` 添加到 `docker-compose.yaml` 文件中。

如果 Open WebUI 与 Searxng 位于同一个 Docker 网络中，可以移除 `0.0.0.0`，仅指定端口映射。在这种情况下，Open WebUI 可以使用容器名称直接访问 Searxng。

<details>
<summary>docker-compose.yaml</summary>

```yaml
searxng:
    container_name: searxng
    image: docker.io/searxng/searxng:latest
    restart: unless-stopped
    networks:
      - searxng
    ports:
      - "0.0.0.0:8080:8080" # 如果容器位于同一个 Docker 网络中，使用 8080:8080
    volumes:
      - ./searxng:/etc/searxng:rw
      - searxng-data:/var/cache/searxng:rw
    environment:
      - SEARXNG_BASE_URL=https://${SEARXNG_HOSTNAME:-localhost}/
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"
    cap_drop:
      - ALL
```

</details>

**步骤 8：添加格式**

8. 将 HTML 和 JSON 格式添加到 `searxng-docker/searxng/settings.yml` 文件中：

- **Linux**
```bash
sed -i 's/- html/- html\n    - json/' searxng/settings.yml
```

- **macOS**
```bash
sed -i '' 's/- html/- html\n    - json/' searxng/settings.yml
```

**步骤 9：运行服务器**

9. 使用以下命令启动容器：

```bash
docker compose up -d
```

SearXNG 将通过 [http://localhost:8080](http://localhost:8080)（或你之前设置的端口号）提供服务。

## 2. 替代设置方案 {#2-alternative-setup}

或者，如果你不想修改默认配置，只需创建一个空的 `searxng-docker` 文件夹，然后按照其余设置说明操作。

### Docker Compose 设置 {#docker-compose-setup}

将以下环境变量添加到 Open WebUI 的 `docker-compose.yaml` 文件中：

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "searxng"
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 10
      SEARXNG_QUERY_URL: "http://searxng:8080/search"
```

为 SearXNG 创建一个 `.env` 文件：

```env
# SearXNG
SEARXNG_HOSTNAME=localhost:8080/
```

接下来，将以下内容添加到 SearXNG 的 `docker-compose.yaml` 文件中：

```yaml
services:
  searxng:
    container_name: searxng
    image: searxng/searxng:latest
    ports:
      - "8080:8080"
    volumes:
      - ./searxng:/etc/searxng:rw
    env_file:
      - .env
    restart: unless-stopped
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - DAC_OVERRIDE
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"
```

你的服务栈已准备就绪，可以使用以下命令启动：

```bash
docker compose up -d
```

:::note

首次运行时，必须从 `docker-compose.yaml` 文件中移除 `cap_drop: - ALL`，`searxng` 服务才能成功创建 `/etc/searxng/uwsgi.ini`。这是必要的，因为 `cap_drop: - ALL` 指令会移除所有能力，包括创建 `uwsgi.ini` 文件所需的能力。首次运行后，出于安全考虑，应将 `cap_drop: - ALL` 重新添加到 `docker-compose.yaml` 文件中。

:::

**配置 SearXNG 以与 Open WebUI 集成**

启动容器后，你需要配置 SearXNG，使其支持来自 Open WebUI 的 JSON 格式查询：

1. 等待约 30 秒，让初始配置文件生成，然后停止容器：

```bash
docker compose down
```

2. 进入 `./searxng` 文件夹并编辑 `settings.yml` 文件：

```bash
cd searxng
```

3. 使用你喜欢的文本编辑器打开 `settings.yml` 文件，找到 `search` 部分。将 `json` 添加到 formats 列表中：

```yaml
search:
  safe_search: 0
  autocomplete: ""
  default_lang: ""
  formats:
    - html
    - json  # 添加此行以启用 Open WebUI 的 JSON 格式支持
```

或者，你可以使用以下命令自动添加 JSON 支持：

```bash
sed -i '/formats:/,/]/s/html/html\n    - json/' searxng/settings.yml
```

4. 保存文件并重启容器：

```bash
docker compose up -d
```

:::warning

如果不添加 JSON 格式支持，SearXNG 将阻止来自 Open WebUI 的查询，你会在 Open WebUI 日志中遇到 `403 Client Error: Forbidden` 错误。

:::

或者，你也可以直接使用 `docker run` 运行 SearXNG：

```bash
docker run --name searxng --env-file .env -v ./searxng:/etc/searxng:rw -p 8080:8080 --restart unless-stopped --cap-drop ALL --cap-add CHOWN --cap-add SETGID --cap-add SETUID --cap-add DAC_OVERRIDE --log-driver json-file --log-opt max-size=1m --log-opt max-file=1 searxng/searxng:latest
```

## 3. 确认连接 {#3-confirm-connectivity}

在命令行界面中，确认你的 Open WebUI 容器实例能够连接到 SearXNG：

```bash
docker exec -it open-webui curl http://host.docker.internal:8080/search?q=this+is+a+test+query&format=json
```

## 4. 图形界面配置 {#4-gui-configuration}

1. 前往：`Settings` -> `Web Search`（管理员区域）
2. 开启 `Enable Web Search`
3. 在下拉菜单中将 `Web Search Engine` 设为 `searxng`
4. 将 `Searxng Query URL` 设为以下示例之一：

- `http://localhost:8080/search`（使用主机和主机端口，适用于基于 Docker 的部署）
- `http://searxng:8080/search`（使用容器名称和暴露的端口，适用于基于 Docker 的部署）
- `http://host.docker.internal:8080/search`（使用 `host.docker.internal` DNS 名称和主机端口，适用于基于 Docker 的部署）
- `http://<searxng.local>/search`（使用本地域名，适用于局域网访问）
- `https://<search.domain.com>/search`（为自托管 SearXNG 实例使用自定义域名，适用于公网或私网访问）

将 URL 指向 `/search` 端点。Open WebUI 会自行添加查询参数（`q`、`format=json`、`language` 等）。旧版 `/search?q=<query>` 形式仍然有效，因为 Open WebUI 检测到 `<query>` 时会移除查询字符串，但并非必须使用这种形式。

**Searxng 搜索语言（all、en、es、de、fr 等）**字段（`SEARXNG_LANGUAGE`，默认值为 `all`）会作为 SearXNG 的 `language` 参数发送，发送前会移除首尾空格和末尾逗号。无论此字段设置为何值，请求的 `Accept-Language` 标头始终保持 `en-US,en;q=0.5`。

5. 根据需要调整 `Search Result Count` 和 `Concurrent Requests` 的值
6. 保存更改

### 双向 TLS {#mutual-tls}

如果你的 SearXNG 实例位于需要客户端证书的代理之后，请使用以下环境变量向 Open WebUI 指定证书：

```bash
SEARXNG_CLIENT_CERT_FILE=/certs/searxng-client.pem
SEARXNG_CLIENT_KEY_FILE=/certs/searxng-client.key
```

如果证书文件已包含密钥，则无需设置 `SEARXNG_CLIENT_KEY_FILE`。将文件挂载到容器中（`-v /path/to/certs:/certs:ro`），使这些路径能够在容器内解析。只有 SearXNG 请求使用此证书；其他所有出站连接仍使用其正常的 TLS 设置。证书在首次使用时读取一次，因此替换磁盘上的证书后需要重启。

![SearXNG 图形界面配置](/images/tutorial_searxng_config.png)

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## 5. 在聊天中使用网页搜索 {#5-using-web-search-in-a-chat}

要使用网页搜索，请打开 **+** 菜单并开启**网页搜索（Web Search）**。

![网页搜索界面开关](/images/web_search_toggle.png)

按照这些步骤操作后，你将成功完成 SearXNG 与 Open WebUI 的设置，并能够使用 SearXNG 引擎执行网页搜索。

#### 注意 {#note}

你需要在聊天中明确开启或关闭此功能。

此设置按会话生效。例如，重新加载页面或切换到另一个聊天都会将其关闭。

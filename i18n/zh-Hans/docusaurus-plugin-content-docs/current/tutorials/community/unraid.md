---
sidebar_position: 10
title: "Unraid 部署（适合新手）"
---

# 在 Unraid 上运行 Open WebUI（适合新手）

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看[贡献教程](/tutorials/contributing-tutorial)。

:::

本指南面向首次使用 Unraid 的用户，帮助你实现具有持久化数据和安全升级能力的稳定 Docker 部署。

## 你将完成的操作 {#what-you-will-do}

- 在 Unraid 中创建 Open WebUI 容器。
- 为 `/app/backend/data` 配置持久化存储。
- 将 Open WebUI 连接到 Ollama。
- 在不丢失数据的情况下更新 Open WebUI。
- 排除反向代理和持久化问题。

## 开始之前 {#before-you-start}

- 已在 Unraid 中启用 Docker。
- 你有一个持久化的 appdata 路径，例如：`/mnt/user/appdata/open-webui`。
- 可选：Ollama 运行在以下任一位置：
  - Unraid 主机，或
  - 另一台可访问的机器。

:::important
将 `/app/backend/data` 持久化到主机路径。如果跳过此步骤，重新创建容器后，聊天和设置可能会消失。
:::

## 1. 在 Unraid 中创建容器 {#1-create-the-container-in-unraid}

在 **Docker > Add Container** 中，使用：

| 字段 | 值 |
| --- | --- |
| Name | `open-webui` |
| Repository | `ghcr.io/open-webui/open-webui:main` |
| Network Type | `bridge` |
| Restart Policy | `always` |
| Container Port | `8080` |
| Host Port | `3000`（或其他空闲端口） |

添加路径映射：

| 配置类型 | 容器路径 | 主机路径 |
| --- | --- | --- |
| Path | `/app/backend/data` | `/mnt/user/appdata/open-webui` |

## 2. 配置 Ollama 连接 {#2-configure-ollama-connectivity}

选择一种设置方式。

### Ollama 位于 Unraid 主机上 {#ollama-on-the-unraid-host}

- 额外参数：
  - `--add-host=host.docker.internal:host-gateway`
- 环境变量：
  - `OLLAMA_BASE_URL=http://host.docker.internal:11434`

### Ollama 位于另一台机器上 {#ollama-on-another-machine}

- 环境变量：
  - `OLLAMA_BASE_URL=http://<ollama-lan-ip>:11434`

### Ollama 位于另一个容器中 {#ollama-in-another-container}

- 将两个容器放在同一个自定义 Docker 网络中。
- 设置：
  - `OLLAMA_BASE_URL=http://<ollama-container-name>:11434`

## 3. 首次启动验证 {#3-first-launch-validation}

1. 启动容器。
2. 打开 `http://<unraid-ip>:3000`。
3. 完成初始管理员设置。
4. 打开 **Settings > Connections**（管理员区域），验证 Ollama 端点。
5. 确认模型选择器中出现模型。

## 4. 持久卷注意事项 {#4-persistent-volume-notes}

- Open WebUI 状态存储在 `/app/backend/data` 中。
- 在 Unraid 模板中设置固定的 `WEBUI_SECRET_KEY`，并在重新创建容器时保持不变，以避免不必要的会话失效。
- 在更新和重新创建容器时保持主机映射一致。
- 使用目录映射，而不是文件映射。
- 如果持久化失败，请检查 `/mnt/user/appdata/open-webui` 的文件夹权限。

## 5. 升级步骤（安全流程） {#5-upgrade-steps-safe-workflow}

1. 备份 `/mnt/user/appdata/open-webui`。
2. 确保模板保留相同的 `WEBUI_SECRET_KEY`。
3. 更新/拉取你的 Open WebUI 镜像标签。
4. 使用相同的模板和相同的 `/app/backend/data` 映射重新创建容器。
5. 验证聊天和设置是否完好。
6. 如有需要，回滚到先前的镜像并恢复备份。

有关更多更新选项，请参阅[更新 Open WebUI](/getting-started/updating)。

## 故障排除 {#troubleshooting}

### 无法连接 Ollama {#cannot-reach-ollama}

症状：
- Open WebUI 中出现 `Connection error`
- 模型未加载

检查：
- 确认可以从 Open WebUI 容器内部访问 `OLLAMA_BASE_URL`。
- 如果使用主机上的 Ollama，确认存在 `--add-host=host.docker.internal:host-gateway`。
- 如果 `host.docker.internal` 无法使用，请使用 Unraid 主机的 LAN IP。

### `host.docker.internal` 无法解析 {#hostdockerinternal-does-not-resolve}

- 添加 `--add-host=host.docker.internal:host-gateway`。
- 保存模板更改后重启容器。
- 回退方案：`OLLAMA_BASE_URL=http://<unraid-lan-ip>:11434`。

### 反向代理子路径问题（`/openwebui`） {#reverse-proxy-subpath-problems-openwebui}

症状：
- 登录/静态资源返回 `404`
- WebSocket 断开连接或加载状态卡住

检查：
- 确保代理转发 WebSocket 升级标头。
- Open WebUI 没有基础路径设置，因此 `/openwebui` 之类的子路径无法工作：前端会从域名根路径请求 `/api/...`、`/ws/socket.io` 和 `/_app/...`。请改用子域名或在根路径下提供服务。
- 将 `WEBUI_URL` 设置为不带尾部斜杠的公共 URL，例如 `WEBUI_URL=https://ai.example.com`；它用于 OAuth 重定向和链接，而不是路由。对于已经启动过的安装，请改为在 Settings > General（管理员区域）中更改 **WebUI URL**，因为环境变量仅在首次启动时设置该值。

有关更广泛的反向代理调试，请参阅[连接错误](/troubleshooting/connection-error)。

### 更新/重做后数据丢失 {#data-missing-after-updateredo}

- 验证映射是否准确地将 `/app/backend/data` 指向持久化主机文件夹。
- 确认没有因拼写错误而创建第二个空文件夹。
- 确认 Unraid 权限允许读取和写入。

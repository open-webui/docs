# 故障排除

## 理解 Open WebUI 架构

Open WebUI 系统旨在简化客户端（您的浏览器）与 Ollama API 之间的交互。这一设计的核心是后端反向代理，可增强安全性并解决 CORS 问题。

- **工作原理**：Open WebUI 旨在通过特定路由与 Ollama API 进行交互。当 WebUI 向 Ollama 发出请求时，请求不会直接发送到 Ollama API。最初，请求将通过 `/ollama` 路由发送到 Open WebUI 后端。从那里，后端负责将请求转发到 Ollama API。这通过使用 `OLLAMA_BASE_URL` 环境变量中指定的路由来完成。因此，在 WebUI 中对 `/ollama` 的请求实际上等同于在后端中对 `OLLAMA_BASE_URL` 的请求。例如，WebUI 中对 `/ollama/api/tags` 的请求等同于在后端中对 `OLLAMA_BASE_URL/api/tags` 的请求。

- **安全性优势**：此设计防止了直接将 Ollama API 暴露给前端，从而防止潜在的 CORS（跨源资源共享）问题和未经授权的访问。要求进行身份验证以访问 Ollama API 进一步增强了此安全层。

## Open WebUI：服务器连接错误

如果您遇到连接问题，通常是由于 WebUI docker 容器无法访问容器内 127.0.0.1：11434 （host.docker.internal：11434） 的 Ollama 服务器。使用 docker 命令中 --network=host 的标志来解决此问题。请注意，端口从 3000 更改为 8080，从而产生链接： http://localhost:8080 .

**示例 Docker 命令**：

```bash
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

如果您遇到 SSL 错误的连接问题 huggingface.co，请检查 huggingface 服务器，如果它宕机，您可以在 `docker run` 命令中将 `HF_ENDPOINT` 设置为 `https://hf-mirror.com/`。

```bash
docker run -d -p 3000:8080 -e HF_ENDPOINT=https://hf-mirror.com/ --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### 通用连接错误

**确保 Ollama 版本是最新的**：始终从 Ollama 的官方网站查看您是否具有最新版本。获取最新更新。

**故障排除步骤**：

1. **验证 Ollama URL 格式**：
   - 运行 Web UI 容器时，请确保正确设置。 OLLAMA_BASE_URL （例如， `http://192.168.1.1:11434` 对于不同的主机设置）。
   - 在 Open WebUI 中，导航到“设置”>“常规”。
   - 确认 Ollama 服务器 URL 已正确设置为 `[OLLAMA URL]` （例如， `http://localhost:11434` ）。

通过遵循这些增强的故障排除步骤，连接问题应有效解决。如需进一步协助或查询，请随时在我们的社区 Discord 上与我们联系。

## 重置管理员密码

如果您忘记了管理员密码，可以按照以下步骤重置密码：

### 在 Docker 中重置管理员密码

要在 Docker 部署中重置 Open WebUI 的管理员密码，请生成新密码的 bcrypt 哈希并运行 Docker 命令以更新数据库。用所需的密码替换 `your-new-password` 并执行：

1. **生成 bcrypt 哈希**（本地机器）：
   ```bash
   htpasswd -bnBC 10 "" your-new-password | tr -d ':\n'
   ```

2. **在 Docker 中更新密码**（替换 `HASH` 和 `admin@example.com` ）：
   ```bash
   docker run --rm -v open-webui:/data alpine/socat EXEC:"bash -c 'apk add sqlite && echo UPDATE auth SET password='\''HASH'\'' WHERE email='\''admin@example.com'\''; | sqlite3 /data/webui.db'", STDIO
   ```

### 本地重置管理员密码

对于 Open WebUI 的本地安装，请转到 `open-webui` 目录并在 `backend/data/webui.db` 数据库中更新密码。

1. **生成 bcrypt 哈希**（本地机器）：
   ```bash
   htpasswd -bnBC 10 "" your-new-password | tr -d ':\n'
   ```

2. **在本地更新密码**（替换 `HASH` 和 `admin@example.com`）：
   ```bash
   sqlite3 backend/data/webui.db "UPDATE auth SET password='HASH' WHERE email='admin@example.com';"
   ```
### Nginx Proxy Manager {#nginx-proxy-manager}

Nginx Proxy Manager（NPM）可让你轻松管理反向代理，并使用 Let's Encrypt 颁发的有效 SSL 证书保护 Open WebUI 等本地应用程序。
此配置可启用 HTTPS 访问。许多移动浏览器出于安全要求，必须启用 HTTPS 才能使用语音输入功能；同时，此配置无需将应用程序的特定端口直接暴露到互联网。

#### 前提条件 {#prerequisites}

- 一台运行 Docker 且已运行 open-webui 容器的家庭服务器。
- 一个域名（可选择 DuckDNS 等免费服务，或 Namecheap/GoDaddy 等付费服务）。
- 具备 Docker 和 DNS 配置的基础知识。

#### Nginx Proxy Manager 配置步骤 {#nginx-proxy-manager-steps}

1. **为 Nginx 文件创建目录：**

    ```bash
    mkdir ~/nginx_config
    cd ~/nginx_config
    ```

2. **使用 Docker 设置 Nginx Proxy Manager：**

    ```bash
    nano docker-compose.yml
    ```

```yaml
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

运行容器：

```bash
docker compose up -d
```

3. **配置 DNS 和域名：**

    - 登录你的域名服务提供方（例如 DuckDNS）并创建一个域名。
    - 将域名指向代理的本地 IP（例如 192.168.0.6）。
    - 如果使用 DuckDNS，请从其控制面板获取 API 令牌。

###### 以下是在 https://www.duckdns.org/domains 上配置的简单示例 {#here-is-a-simple-example-how-its-done-in-httpswwwduckdnsorgdomains}

4. **设置 SSL 证书：**

- 通过 http://server_ip:81 访问 Nginx Proxy Manager。例如：``192.168.0.6:81``

- 使用默认凭据（admin@example.com / changeme）登录，并按提示更改凭据。
- 依次进入 SSL Certificates → Add SSL Certificate → Let's Encrypt。
- 填写你的电子邮件地址和从 DuckDNS 获取的域名。一个域名包含星号，另一个不包含。例如：``*.hello.duckdns.org`` 和 ``hello.duckdns.org``。
- 选择 Use a DNS challenge，选择 DuckDNS，然后粘贴你的 API 令牌。例如：
```dns_duckdns_token=f4e2a1b9-c78d-e593-b0d7-67f2e1c9a5b8```
- 同意 Let’s Encrypt 条款并保存。**如有需要**，更改传播时间（120 秒）。

5. **创建代理主机：**

- 对于每项服务（例如 openwebui、nextcloud），依次进入 Hosts → Proxy Hosts → Add Proxy Host。

- 填写域名（例如 openwebui.hello.duckdns.org）。
- 将协议设为 HTTP（默认值），启用 ``Websockets support``（WebSocket 支持），并指向你的 Docker IP（如果运行 open-webui 的 Docker 与 NGINX 管理器位于同一台计算机上，则此处使用与之前相同的 IP，例如：``192.168.0.6``）。
- 选择之前生成的 SSL 证书，强制使用 SSL，并启用 HTTP/2。

:::tip 将 CORS_ALLOW_ORIGIN 设置为你的公开源

`CORS_ALLOW_ORIGIN` 默认为 `*`，因此不设置它绝不会导致 WebSocket 连接中断。将其设置为你的确切公开源（例如 `https://chat.example.com`）可作为一种加固措施。会导致 Socket.IO 连接（以及任何跨源浏览器请求）中断的是未包含该公开源的值，例如在通过 `https://` 提供服务时配置了 `http://` 条目。

**示例：**
如果你通过 `https://openwebui.hello.duckdns.org` 访问 UI，请设置：

```bash
CORS_ALLOW_ORIGIN="https://openwebui.hello.duckdns.org"
```

你也可以提供以分号分隔的允许源列表。默认值 `*` 允许所有源；上面的值则仅允许你的源。

:::

:::warning 为流式响应禁用代理缓冲

Web UI 通过 Socket.IO 连接以流式方式传输聊天令牌，因此在 WebSocket 正常工作时，缓冲不会导致浏览器中的聊天内容乱码，但会延迟 API 客户端读取的流式响应。

在 Nginx Proxy Manager 中，依次进入你的代理主机 → **Advanced** 选项卡，并将以下指令添加到 **Custom Nginx Configuration** 字段：

```nginx
proxy_buffering off;
proxy_cache off;
```

如果不进行此配置，Nginx 会延迟流式响应，导致 API 客户端成批收到响应，或只在最后才收到响应。

:::

:::tip 为长时间补全延长超时时间

耗时较长的 LLM 补全（复杂任务可能需要 30 分钟以上）可能超过默认的 60 秒超时时间。在 **Advanced** 选项卡 → **Custom Nginx Configuration** 中添加以下指令：

```nginx
proxy_read_timeout 1800;
proxy_send_timeout 1800;
proxy_connect_timeout 1800;
```

这会将超时时间设置为 30 分钟。请根据实际使用场景按需调整。

:::

:::tip 缓存最佳实践

虽然 Nginx Proxy Manager 会自动处理大部分配置，但请注意：

- **静态资源**（CSS、JS、图像）默认会被缓存，以提高性能
- **身份验证端点**绝不应被缓存
- 如果在 NPM 的“Advanced”选项卡中添加自定义缓存规则，请确保排除 `/api/`、`/auth/`、`/signup/`、`/signin/`、`/sso/`、`/admin/`、`/signout/`、`/oauth/`、`/login/` 和 `/logout/` 等路径

NPM 的默认配置可以正确处理这些情况；只有明确了解相关操作时，才应修改缓存配置。

:::

6. **告知 Open WebUI 其公开 URL：**

- 依次进入你的 open-webui → 设置 → 通用（管理员部分）
- 在 **WebUI URL** 字段中，输入你将通过代理使用的 URL，例如 ``https://openwebui.hello.duckdns.org``。该 URL 用于 SSO 登录后的重定向以及通知中的链接。

#### 访问 WebUI {#access-the-webui}

根据你的配置方式，通过 HTTPS 访问 ``hello.duckdns.org`` 或 ``openwebui.hello.duckdns.org`` 上的 Open WebUI。

:::note

防火墙注意事项：本地防火墙软件（例如 Portmaster）可能会阻止 Docker 内部网络流量或所需端口。如果遇到问题，请检查防火墙规则，确保允许此配置所需的通信。

:::

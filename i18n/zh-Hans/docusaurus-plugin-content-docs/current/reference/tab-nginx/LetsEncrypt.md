### Let's Encrypt {#lets-encrypt}

Let's Encrypt 提供受大多数浏览器信任的免费 SSL 证书，非常适合用于保护生产环境。

本指南采用两阶段方法：

1.  **阶段 1：** 临时运行 Nginx，证明你拥有该域名，并从 Let's Encrypt 获取证书。
2.  **阶段 2：** 重新配置 Nginx，使用新证书建立安全的 HTTPS 连接。

#### 前提条件 {#prerequisites}

  * 一个**域名**（例如 `my-webui.com`），其 **DNS `A` 记录**指向服务器的公共 IP 地址。
  * 服务器上已安装 **Docker** 和 **Docker Compose**。
  * 对终端命令的运行方式有基本了解。

:::info
**注意！** Let's Encrypt **不能**为 IP 地址签发证书。你**必须**使用域名。
:::

-----

### 步骤 1：证书验证的初始设置 {#step-1-initial-setup-for-certificate-validation}

首先，我们将设置必要的文件和临时 Nginx 配置，使 Let's Encrypt 的服务器能够验证你的域名。

1. **确保你已遵循上述[前提条件](#prerequisites)。**

2. **创建目录结构**

    从项目根目录运行此命令，为 Nginx 配置和 Let's Encrypt 证书创建文件夹：

    ```bash
    mkdir -p nginx/conf.d ssl/certbot/conf ssl/certbot/www
    ```

3. **创建临时 Nginx 配置**

    创建文件 `nginx/conf.d/open-webui.conf`。此初始配置仅监听端口 80，并为 Certbot 提供验证文件。

    **请记得将 `<YOUR_DOMAIN_NAME>`** 替换为你的实际域名。

    ```nginx
    # nginx/conf.d/open-webui.conf

    server {
        listen 80;
        listen [::]:80;
        server_name <YOUR_DOMAIN_NAME>;

        # Let's Encrypt 验证质询的路由
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # 暂时忽略所有其他请求
        location / {
            return 404;
        }
    }
    ```

4. **更新你的 `docker-compose.yml`**

    将 `nginx` 服务添加到 `docker-compose.yml`，并确保 `open-webui` 服务配置为使用共享 Docker 网络。

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        restart: always
        ports:
          # 向主机公开 HTTP 和 HTTPS 端口
          - "80:80"
          - "443:443"
        volumes:
          # 挂载 Nginx 配置和 SSL 证书数据
          - ./nginx/conf.d:/etc/nginx/conf.d
          - ./ssl/certbot/conf:/etc/letsencrypt
          - ./ssl/certbot/www:/var/www/certbot
        depends_on:
          - open-webui
        networks:
          - open-webui-network

      open-webui:
        # 你现有的 open-webui 配置...
        # ...
        # 确保它位于同一网络中
        networks:
          - open-webui-network
        # 在 Docker 网络内部公开端口。
        # 你不需要将其发布到主机（例如，此处不需要 `ports` 节）。
        expose:
          - 8080

    networks:
        open-webui-network:
            driver: bridge
    ```

-----

### 步骤 2：获取 SSL 证书 {#step-2-obtain-the-ssl-certificate}

现在，我们将运行一个使用 Docker 获取证书的脚本。

1.  **创建证书申请脚本**

    在项目根目录中创建一个名为 `enable_letsencrypt.sh` 的可执行脚本。

    **请记得将 `<YOUR_DOMAIN_NAME>` 和 `<YOUR_EMAIL_ADDRESS>`** 替换为你的实际信息。

    ```bash
    #!/bin/bash
    # enable_letsencrypt.sh

    DOMAIN="<YOUR_DOMAIN_NAME>"
    EMAIL="<YOUR_EMAIL_ADDRESS>"

    echo "### Obtaining SSL certificate for $DOMAIN ###"

    # 启动 Nginx 以提供质询
    docker compose up -d nginx

    # 在容器中运行 Certbot 以获取证书
    docker run --rm \
      -v "./ssl/certbot/conf:/etc/letsencrypt" \
      -v "./ssl/certbot/www:/var/www/certbot" \
      certbot/certbot certonly \
      --webroot \
      --webroot-path=/var/www/certbot \
      --email "$EMAIL" \
      --agree-tos \
      --no-eff-email \
      --force-renewal \
      -d "$DOMAIN"

    if [[ $? != 0 ]]; then
        echo "Error: Failed to obtain SSL certificate."
        docker compose stop nginx
        exit 1
    fi

    # 在应用最终配置之前停止 Nginx
    docker compose stop nginx
    echo "### Certificate obtained successfully! ###"
    ```

2.  **使脚本可执行**

    ```bash
    chmod +x enable_letsencrypt.sh
    ```

3.  **运行脚本**

    执行脚本。它会自动启动 Nginx、申请证书，然后停止 Nginx。

    ```bash
    ./enable_letsencrypt.sh
    ```

-----

### 重要：缓存配置 {#important-caching-configuration}

将 NGINX 与 Open WebUI 结合使用时，适当的缓存对性能至关重要，同时还能确保身份验证安全。下面的配置包括：

- **已缓存**：静态资产（CSS、JS、字体、图片），以获得更好的性能
- **未缓存**：身份验证端点、API 调用、SSO/OAuth 回调和会话数据
- **结果**：加快页面加载速度，同时不破坏登录功能

下面的配置会自动实施这些规则。

### 步骤 3：完成 Nginx 的 HTTPS 配置 {#step-3-finalize-nginx-configuration-for-https}

证书保存在 `ssl` 目录中后，现在可以更新 Nginx 配置以启用 HTTPS。

1.  **更新 Nginx 的 SSL 配置**

    用下面的最终配置**替换** `nginx/conf.d/open-webui.conf` 的**全部内容**。

    **将全部 4 处 `<YOUR_DOMAIN_NAME>`** 替换为你的域名。

    ```nginx
    # nginx/conf.d/open-webui.conf

    # 将所有 HTTP 流量重定向到 HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name <YOUR_DOMAIN_NAME>;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name <YOUR_DOMAIN_NAME>;

        ssl_certificate /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256';
        ssl_prefer_server_ciphers off;

        location ~* ^/(auth|api|oauth|admin|signin|signup|signout|login|logout|sso)/ {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 10m;
            proxy_buffering off;
            proxy_cache off;
            client_max_body_size 20M;

            proxy_no_cache 1;
            proxy_cache_bypass 1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;
            add_header Pragma "no-cache" always;
            expires -1;
        }

        # 个人资料和模型图片 - 缓存以提高性能
        location ~ ^/api/v1/(users/[^/]+/profile/image|models/model/profile/image)$ {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 将图片缓存 1 天
            expires 1d;
            add_header Cache-Control "public, max-age=86400";
        }

        location ~* \.(css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 将静态资产缓存 7 天
            expires 7d;
            add_header Cache-Control "public, immutable";
        }

        location / {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 为长时间的 LLM 补全延长超时时间（30 分钟）
            proxy_read_timeout 1800;
            proxy_send_timeout 1800;
            proxy_connect_timeout 1800;

            proxy_buffering off;
            proxy_cache off;
            client_max_body_size 20M;

            add_header Cache-Control "public, max-age=300, must-revalidate";
        }
    }
    ```

2.  **启动所有服务**

    使用最终的安全配置启动 Nginx 和 Open WebUI。

    ```bash
    docker compose up -d
    ```

-----

### 步骤 4：访问安全的 WebUI {#step-4-access-your-secure-webui}

现在，你可以通过 HTTPS 安全访问 Open WebUI 实例。

→ **`https://<YOUR_DOMAIN_NAME>`**

-----

### （可选）步骤 5：设置自动续期 {#optional-step-5-setting-up-automatic-renewal}

Let's Encrypt 证书每 90 天到期。你应设置一个 `cron` 任务来自动续期。

1.  打开 crontab 编辑器：

    ```bash
    sudo crontab -e
    ```

2.  添加以下行，在每天凌晨 3:30 运行续期检查。只有证书即将到期时才会续期。

    ```cron
    30 3 * * * /usr/bin/docker run --rm -v "<absolute_path>/ssl/certbot/conf:/etc/letsencrypt" -v "<absolute_path>/ssl/certbot/www:/var/www/certbot" certbot/certbot renew --quiet --webroot --webroot-path=/var/www/certbot --deploy-hook "/usr/bin/docker compose -f <absolute_path>/docker-compose.yml restart nginx"
    ```

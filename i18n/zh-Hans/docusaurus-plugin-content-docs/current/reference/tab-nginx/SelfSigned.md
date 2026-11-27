### 自签名证书 {#self-signed-certificate}

自签名证书适用于信任并非关键要求的开发或内部使用场景。

#### 自签名证书配置步骤 {#self-signed-certificate-steps}

1. **为 Nginx 文件创建目录：**

    ```bash
    mkdir -p conf.d ssl
    ```

2. **创建 Nginx 配置文件：**

    **`conf.d/open-webui.conf`：**

    ```nginx
    server {
        listen 443 ssl;
        server_name your_domain_or_IP;

        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;
        ssl_protocols TLSv1.2 TLSv1.3;

        location ~* ^/(auth|api|oauth|admin|signin|signup|signout|login|logout|sso)/ {
            proxy_pass http://host.docker.internal:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_buffering off;
            proxy_cache off;
            client_max_body_size 20M;
            proxy_read_timeout 10m;

            # 禁用身份验证端点的缓存
            proxy_no_cache 1;
            proxy_cache_bypass 1;
            add_header Cache-Control "no-store, no-cache, must-revalidate" always;
            expires -1;
        }

        # 个人资料与模型图像 - 缓存以提高性能
        location ~ ^/api/v1/(users/[^/]+/profile/image|models/model/profile/image)$ {
            proxy_pass http://host.docker.internal:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;

            # 图像缓存 1 天
            expires 1d;
            add_header Cache-Control "public, max-age=86400";
        }

        location ~* \.(css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://host.docker.internal:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;

            expires 7d;
            add_header Cache-Control "public, immutable";
        }

        location / {
            proxy_pass http://host.docker.internal:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_buffering off;
            proxy_cache off;

            client_max_body_size 20M;

            # 为耗时较长的 LLM 补全延长超时时间（30 分钟）
            proxy_read_timeout 1800;
            proxy_send_timeout 1800;
            proxy_connect_timeout 1800;

            add_header Cache-Control "public, max-age=300, must-revalidate";
        }
    }
    ```

3. **生成自签名 SSL 证书：**

    ```bash
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/nginx.key \
    -out ssl/nginx.crt \
    -subj "/CN=your_domain_or_IP"
    ```

4. **更新 Docker Compose 配置：**

    将 Nginx 服务添加到你的 `docker-compose.yml`：

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        ports:
          - "443:443"
        volumes:
          - ./conf.d:/etc/nginx/conf.d
          - ./ssl:/etc/nginx/ssl
        depends_on:
          - open-webui
    ```

5. **启动 Nginx 服务：**

    ```bash
    docker compose up -d nginx
    ```

#### 访问 WebUI {#access-the-webui}

通过以下地址以 HTTPS 访问 Open WebUI：

[https://your_domain_or_IP](https://your_domain_or_IP)

---

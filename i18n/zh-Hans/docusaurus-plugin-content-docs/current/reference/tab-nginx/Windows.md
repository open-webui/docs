### 在 Windows 上不使用 Docker，通过自签名证书和 Nginx 代理 Open WebUI {#using-a-self-signed-certificate-and-nginx-on-windows-without-docker}

对于基本的内部/开发环境安装，可以使用 nginx 和自签名证书将 Open WebUI 代理到 HTTPS，从而允许通过局域网使用麦克风输入等功能。（默认情况下，大多数浏览器不允许在不安全且非 localhost 的 URL 上使用麦克风输入。）

本指南假设你已使用 pip 安装 Open WebUI，并正在运行 `open-webui serve`。

#### 步骤 1：安装 openssl 以生成证书 {#step-1-installing-openssl-for-certificate-generation}

首先需要安装 openssl。

你可以从 [Shining Light Productions（SLP）](https://slproweb.com/) 网站下载并安装预编译的二进制文件。

或者，如果你已安装 [Chocolatey](https://chocolatey.org/)，可以使用它快速安装 OpenSSL：

1. 打开命令提示符或 PowerShell。
2. 运行以下命令安装 OpenSSL：

   ```bash
   choco install openssl -y
   ```

---

### **验证安装** {#verify-installation}

安装完成后，打开命令提示符并输入：

```bash
openssl version
```

如果显示 OpenSSL 版本（例如 `OpenSSL 3.x.x ...`），则说明安装正确。

#### 步骤 2：安装 nginx {#step-2-installing-nginx}

从 [nginx.org](https://nginx.org) 下载官方 Windows 版 Nginx，或使用 Chocolatey 等软件包管理器。
将下载的 ZIP 文件解压到一个目录（例如 C:\nginx）。

#### 步骤 3：生成证书 {#step-3-generate-certificate}

运行以下命令：

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt
```

将生成的 nginx.key 和 nginx.crt 文件移到你选择的文件夹，或移到 C:\nginx 目录。

#### 步骤 4：配置 nginx {#step-4-configure-nginx}

在文本编辑器中打开 C:\nginx\conf\nginx.conf。

如果希望通过本地局域网访问 Open WebUI，请务必使用 `ipconfig` 查看并记下你的局域网 IP 地址，例如 192.168.1.15。

按如下方式配置：

```conf

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;

#error_log  logs/error.log  notice;

#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  120;

    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        listen 80;
        server_name 192.168.1.15;

        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name 192.168.1.15;

        ssl_certificate C:\\nginx\\nginx.crt;
        ssl_certificate_key C:\\nginx\\nginx.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers on;

        location ~* ^/(auth|api|oauth|admin|signin|signup|signout|login|logout|sso)/ {
            proxy_pass http://localhost:8080;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_buffering off;
            proxy_cache off;
            client_max_body_size 20M;
            proxy_read_timeout 10m;

            add_header Cache-Control "no-store, no-cache, must-revalidate" always;
            expires -1;
        }

        # 个人资料与模型图像 - 缓存以提高性能
        location ~ ^/api/v1/(users/[^/]+/profile/image|models/model/profile/image)$ {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;

            # 图像缓存 1 天
            expires 1d;
            add_header Cache-Control "public, max-age=86400";
        }

        location ~* \.(css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;

            expires 7d;
            add_header Cache-Control "public, immutable";
        }

        location / {
            proxy_pass http://localhost:8080;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;

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
}
```

保存文件，然后运行 `nginx -t`，检查配置是否存在错误或语法问题。根据安装方式，你可能需要先执行 `cd C:\nginx`。

运行 `nginx` 启动 nginx。如果 nginx 服务已启动，可以运行 `nginx -s reload` 重新加载新配置。

---

现在，你应当能够通过 https://192.168.1.15（或你实际的局域网 IP）访问 Open WebUI。请确保根据需要允许 Windows 防火墙访问。
